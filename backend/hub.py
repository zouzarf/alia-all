from fastapi import FastAPI, Query
import httpx
import asyncio
import logging

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
            f"{ACTIONNER_MODULE_URL}/PUMP_{pump_number}/activate",
        )
        await asyncio.sleep(pump_warm_up)
        await client.get(
            f"{ACTIONNER_MODULE_URL}/VALVE_{pump_number}/activate",
        )
        await client.get(
            f"{ACTIONNER_MODULE_URL}/{destination}/activate",
        )
        await asyncio.sleep(pump_seconds - compressor_warm_up)
        await client.get(
            f"{ACTIONNER_MODULE_URL}/COMPRESSOR/activate",
        )
        await asyncio.sleep(compressor_warm_up)
        await client.get(
            f"{ACTIONNER_MODULE_URL}/PUMP_{pump_number}/deactivate",
        )
        await client.get(
            f"{ACTIONNER_MODULE_URL}/VALVE_{pump_number}/deactivate",
        )
        await asyncio.sleep(compressor_seconds)
        await client.get(
            f"{ACTIONNER_MODULE_URL}/COMPRESSOR/deactivate",
        )
        await client.get(
            f"{ACTIONNER_MODULE_URL}/{destination}/deactivate",
        )

    return {"status": "done"}


@app.get("/status")
async def status():
    """
    Just return a static message since we don't track state
    """
    return {"status": "ready"}
