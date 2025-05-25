import httpx

MEDIA_BASE = "http://localhost:9997/v3/config/paths"

async def create_path(path: str):
    name = path.strip("/")
    async with httpx.AsyncClient() as client:
        await client.post(f"{MEDIA_BASE}/{name}", json={})

async def delete_path(path: str):
    name = path.strip("/")
    async with httpx.AsyncClient() as client:
        await client.delete(f"{MEDIA_BASE}/{name}")
