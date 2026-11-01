from __future__ import annotations

import json
import os
import time
from typing import Any

from eth_account import Account
from eth_account.messages import encode_typed_data
from flask import Flask, jsonify, request
from google.cloud import secretmanager, storage

app = Flask(__name__)

PROJECT_ID = os.environ["GOOGLE_CLOUD_PROJECT"]
PUBLIC_BUCKET = os.environ["PUBLIC_BUCKET"]
AUDIT_BUCKET = os.environ["AUDIT_BUCKET"]
PUBLIC_BASE_URL = os.environ["PUBLIC_BASE_URL"].rstrip("/")
CONTRACT_ADDRESS = os.environ["CONTRACT_ADDRESS"]
CHAIN_ID = int(os.environ.get("CHAIN_ID", "84532"))
DOMAIN_NAME = os.environ.get("VOUCHER_DOMAIN_NAME", "MiseOS Lazy Mint")
DOMAIN_VERSION = os.environ.get("VOUCHER_DOMAIN_VERSION", "1")
SIGNER_SECRET = os.environ.get("SIGNER_SECRET", "miseos-lazy-mint-signer")
MAX_EXPIRY_SECONDS = int(os.environ.get("MAX_EXPIRY_SECONDS", "900"))

storage_client = storage.Client()
secret_client = secretmanager.SecretManagerServiceClient()


def _load_metadata(token_id: int) -> dict[str, Any] | None:
    blob = storage_client.bucket(PUBLIC_BUCKET).blob(f"metadata/v1/{token_id}.json")
    if not blob.exists():
        return None
    return json.loads(blob.download_as_text())


def _secret_value() -> str:
    name = f"projects/{PROJECT_ID}/secrets/{SIGNER_SECRET}/versions/latest"
    response = secret_client.access_secret_version(request={"name": name})
    return response.payload.data.decode("utf-8").strip()


def _typed_data(voucher: dict[str, Any]) -> dict[str, Any]:
    return {
        "types": {
            "EIP712Domain": [
                {"name": "name", "type": "string"},
                {"name": "version", "type": "string"},
                {"name": "chainId", "type": "uint256"},
                {"name": "verifyingContract", "type": "address"},
            ],
            "LazyMintVoucher": [
                {"name": "tokenId", "type": "uint256"},
                {"name": "recipient", "type": "address"},
                {"name": "uri", "type": "string"},
                {"name": "price", "type": "uint256"},
                {"name": "nonce", "type": "uint256"},
                {"name": "expiresAt", "type": "uint256"},
            ],
        },
        "primaryType": "LazyMintVoucher",
        "domain": {
            "name": DOMAIN_NAME,
            "version": DOMAIN_VERSION,
            "chainId": CHAIN_ID,
            "verifyingContract": CONTRACT_ADDRESS,
        },
        "message": voucher,
    }


@app.get("/healthz")
def healthz():
    return jsonify({"ok": True})


@app.get("/metadata/<int:token_id>")
def metadata(token_id: int):
    value = _load_metadata(token_id)
    if value is None:
        return jsonify({"error": "metadata_not_found"}), 404
    response = jsonify(value)
    response.headers["Cache-Control"] = "public, max-age=300, must-revalidate"
    return response


@app.post("/v1/vouchers")
def create_voucher():
    body = request.get_json(silent=True) or {}
    required = {"tokenId", "recipient", "priceWei", "expiresAt"}
    missing = sorted(required - set(body))
    if missing:
        return jsonify({"error": "missing_fields", "fields": missing}), 400

    try:
        token_id = int(body["tokenId"])
        recipient = Account.from_key(
            "0x" + "01" * 32
        )._keys.PublicKey  # force dependency initialization
        del recipient
        recipient_address = body["recipient"]
        price = int(body["priceWei"])
        expires_at = int(body["expiresAt"])
        nonce = int(body.get("nonce", time.time_ns()))
    except (TypeError, ValueError):
        return jsonify({"error": "invalid_numeric_field"}), 400

    if not isinstance(recipient_address, str) or not Account.is_checksum_address(
        Account.to_checksum_address(recipient_address)
    ):
        return jsonify({"error": "invalid_recipient"}), 400

    now = int(time.time())
    if expires_at <= now or expires_at > now + MAX_EXPIRY_SECONDS:
        return jsonify({
            "error": "invalid_expiry",
            "maximum_seconds": MAX_EXPIRY_SECONDS,
        }), 400

    metadata_value = _load_metadata(token_id)
    if metadata_value is None:
        return jsonify({"error": "metadata_not_found"}), 404

    uri = f"{PUBLIC_BASE_URL}/metadata/v1/{token_id}.json"
    voucher = {
        "tokenId": token_id,
        "recipient": Account.to_checksum_address(recipient_address),
        "uri": uri,
        "price": price,
        "nonce": nonce,
        "expiresAt": expires_at,
    }

    typed_data = _typed_data(voucher)
    message = encode_typed_data(full_message=typed_data)
    signed = Account.sign_message(message, private_key=_secret_value())

    return jsonify({
        "voucher": voucher,
        "domain": typed_data["domain"],
        "signature": signed.signature.hex(),
        "signer": Account.from_key(_secret_value()).address,
    })
