from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi import APIRouter
from db import is_valid_flight, create_pilot, add_drone_to_pilot
from pydantic import BaseModel

router = APIRouter()

@router.post("/auth")
async def auth(request: Request):
    body = await request.json()
    path = body.get("path", "")
    action = body.get("action", "")
    user = body.get("user", "")
    password = body.get("password", "")

    if await is_valid_flight(path, user, password):
        return JSONResponse({"allow": True})
    return JSONResponse({"allow": False})


class CreateUserRequest(BaseModel):
    email: str
    password: str

@router.post("/pilot")
async def auth(request: CreateUserRequest):
    email = request.email
    password = request.password
    await create_pilot(email, password)
    return JSONResponse({})


class AddDroneRequest(BaseModel):
    email: str
    drone_id: str

@router.post("/pilot/drone")
async def add_drone(request: AddDroneRequest):
    email = request.email
    drone_id = request.drone_id
    await add_drone_to_pilot(email, drone_id)
    return JSONResponse({})