from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from models import Base, Flight, Pilot, Drone
from sqlalchemy import select, delete
from datetime import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://timur:1234@localhost:5433/decentra")

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

def make_naive(dt):
    if dt.tzinfo is not None:
        return dt.replace(tzinfo=None)
    return dt

async def add_flight(drone_id, start, end):
    start_naive = make_naive(start)
    end_naive = make_naive(end)
    async with SessionLocal() as session:
        session.add(Flight(drone_id=drone_id, start_time=start_naive, end_time=end_naive))
        await session.commit()

async def remove_flight(drone_id):
    async with SessionLocal() as session:
        await session.execute(delete(Flight).where(Flight.drone_id == drone_id))
        await session.commit()

async def is_valid_flight(path, user, password):
    drone_id = path.strip("/")
    async with SessionLocal() as session:
        # get drone owner, check if it's valid

        result = await session.execute(select(Flight).where(Flight.drone_id == drone_id))
        flight = result.scalar()
        pilot = await session.execute(select(Pilot).where(Pilot.drones.contains(drone_id)))
        pilot = pilot.scalar()
        if pilot and pilot.email == user and pilot.password == password and flight and flight.start_time <= datetime.utcnow() <= flight.end_time:
            return True
        
    return False

async def create_pilot(email, password):
    async with SessionLocal() as session:
        session.add(Pilot(email=email, password=password, drones=[]))
        await session.commit()

async def add_drone_to_pilot(email: str, drone_id: str):
    async with SessionLocal() as session:
        result = await session.execute(select(Pilot).where(Pilot.email == email).limit(1))
        pilot = result.scalar_one_or_none()

        if not pilot:
            raise Exception("Pilot not found")

        existing_drone = await session.execute(select(Drone).where(Drone.drone_id == drone_id))
        if existing_drone.scalar_one_or_none():
            raise Exception("Drone with this ID already exists")

        new_drone = Drone(drone_id=drone_id, pilot=pilot)
        session.add(new_drone)
        await session.commit()

