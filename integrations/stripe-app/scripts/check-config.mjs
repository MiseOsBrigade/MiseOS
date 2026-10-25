const required = ["MISEOS_METADATA_API_URL","MISEOS_CHAIN_ID","MISEOS_NFT_CONTRACT_ADDRESS"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error("Missing required configuration:", missing.join(", "));
  process.exit(1);
}
const url = new URL(process.env.MISEOS_METADATA_API_URL);
if (!["https:","http:"].includes(url.protocol)) throw new Error("Invalid metadata API URL");
if (!/^\d+$/.test(process.env.MISEOS_CHAIN_ID)) throw new Error("MISEOS_CHAIN_ID must be numeric");
if (!/^0x[a-fA-F0-9]{40}$/.test(process.env.MISEOS_NFT_CONTRACT_ADDRESS)) throw new Error("Invalid NFT contract address");
console.log("MiseOS Stripe App configuration is structurally valid.");
