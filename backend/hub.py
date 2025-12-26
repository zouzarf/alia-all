from fastapi import FastAPI, Query
import httpx
import asyncio
import logging
import time

app = FastAPI(title="Hub Module")
logging.basicConfig(
    level=logging.INFO,  # DEBUG, INFO, WARNING, ERROR, CRITICAL
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)
# Base URL of the actionner module
ACTIONNER_MODULE_URL = "http://127.0.0.1:8000"  # change as needed

# ---------- Endpoints ----------


@app.get("/reload")
async def reload():
    """
    Reload config and trigger the reload endpoint on the actionner module
    """
    # Call reload on the actionner module
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(f"{ACTIONNER_MODULE_URL}/reload")
            result = resp.json()
        except Exception as e:
            result = {"error": str(e)}

    return {"status": "reloaded", "actionner_result": result}


@app.get("/route_water")
async def router_water(
    pump_number: int = Query(..., description="Pump number"),
    pump_warm_up: float = Query(
        0.0, description="Warm-up duration before water pump starts"
    ),
    pump_seconds: float = Query(..., description="Duration of pumping"),
    compressor_warm_up: float = Query(0.0, description="Duration of compression"),
    compressor_seconds: float = Query(..., description="Duration of compression"),
    destination: str = Query(..., description="Destination zone"),
):
    async with httpx.AsyncClient() as client:
        await client.get(
            f"{ACTIONNER_MODULE_URL}/{destination}/activate",
        )
        t1 = time.time()
        await client.get(
            f"{ACTIONNER_MODULE_URL}/PUMP_{pump_number}/activate",
        )
        await asyncio.sleep(pump_warm_up)
        t2 = time.time()
        warmup_pump_time = t2 - t1
        await client.get(
            f"{ACTIONNER_MODULE_URL}/VALVE_{pump_number}/activate",
        )
        t22 = time.time()

        async def activate_compressor_with_delay():
            await asyncio.sleep(pump_seconds - compressor_warm_up)
            await client.get(f"{ACTIONNER_MODULE_URL}/COMPRESSOR/activate")
            t = time.time()
            return t

        compressor_task = asyncio.create_task(activate_compressor_with_delay())
        await asyncio.sleep(pump_seconds)
        await client.get(
            f"{ACTIONNER_MODULE_URL}/VALVE_{pump_number}/deactivate",
        )
        t3 = time.time()
        pump_timer = t3 - t22
        return_compressor = await asyncio.gather(
            client.get(
                f"{ACTIONNER_MODULE_URL}/PUMP_{pump_number}/deactivate",
            ),
            compressor_task,
        )
        warmup_pump_compressor = t3 - return_compressor[1]
        t4 = time.time()
        await asyncio.sleep(compressor_seconds)
        await client.get(
            f"{ACTIONNER_MODULE_URL}/COMPRESSOR/deactivate",
        )
        t5 = time.time()
        compressor_time = t5 - t4
        await client.get(
            f"{ACTIONNER_MODULE_URL}/{destination}/deactivate",
        )

    return {
        "status": "done",
        "warmup_pump_time": warmup_pump_time,
        "warmup_pump_compressor": warmup_pump_compressor,
        "pump_timer": pump_timer,
        "compressor_time": compressor_time,
    }


@app.get("/status")
async def status():
    """
    Just return a static message since we don't track state
    """
    return {"status": "ready"}
