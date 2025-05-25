from fastapi import FastAPI, HTTPException
from datetime import datetime
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from auth import router
from db import init_db, add_flight, remove_flight, SessionLocal, Flight
from control import create_path, delete_path

app = FastAPI()
app.include_router(router)


class StartRequest(BaseModel):
    drone_id: str
    start_time: datetime
    end_time: datetime


@app.on_event("startup")
async def startup():
    await init_db()
    await delete_expired_flights()


@app.post("/stream")
async def create_stream(data: StartRequest):
    path = f"/{data.drone_id}"

    try:
        await create_path(path)
        await add_flight(data.drone_id, data.start_time, data.end_time)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    return {"status": "started", "path": path}


async def delete_expired_flights():
    async with SessionLocal() as session:  # type: AsyncSession
        result = await session.execute(select(Flight))
        for flight in result.scalars():
            if flight.end_time <= datetime.utcnow():
                await delete_path(f"/{flight.drone_id}")
                await remove_flight(flight.drone_id)


@app.on_event("shutdown")
async def shutdown():
    await delete_expired_flights()
