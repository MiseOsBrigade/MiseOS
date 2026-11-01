import asyncio, json
from datetime import datetime, timezone
import nats
from sqlalchemy import select
from .config import settings
from .db import SessionLocal
from .models import OutboxEvent

async def outbox_publisher(stop: asyncio.Event):
    nc = None
    try:
        nc = await nats.connect(settings.nats_url, connect_timeout=2, max_reconnect_attempts=-1)
        js = nc.jetstream()
        try:
            await js.add_stream(name="MISEOS", subjects=["miseos.>"])
        except Exception:
            pass
        while not stop.is_set():
            with SessionLocal() as db:
                events = db.execute(select(OutboxEvent).where(OutboxEvent.published.is_(False)).order_by(OutboxEvent.created_at).limit(50)).scalars().all()
                for event in events:
                    try:
                        await js.publish(event.subject, json.dumps(event.payload, default=str).encode())
                        event.published = True
                        event.published_at = datetime.now(timezone.utc)
                    except Exception:
                        event.attempts += 1
                db.commit()
            try: await asyncio.wait_for(stop.wait(), timeout=1.0)
            except asyncio.TimeoutError: pass
    finally:
        if nc: await nc.drain()
