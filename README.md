```markdown
# RTMP → RTSP Converter

A simple converter of video streams from RTMP to RTSP, with dynamic path registration via HTTP API (MediaMTX).

## 🚀 Quick Start

### 1. Docker / Podman-Compose

```bash
# Clone the repository
git clone <your-repo> && cd <your-repo>

# Launch services with Docker Compose
docker-compose up -d

# Or with Podman Compose
podman-compose up -d
```

The `mediamtx` service listens on:
- **RTMP:** port 1935  
- **RTSP:** port 8554  
- **HTTP API:** port 9997  

### 2. Testing Static Routes

```bash
# Example for the pre-configured path `local_stream`
ffplay rtmp://localhost:1935/local_stream
ffplay rtsp://localhost:8554/local_stream
```

### 3. Dynamic Path Registration (curl)

Add a new stream (e.g. drone with ID `drone42`):

```bash
curl -X PUT http://localhost:9997/v1/paths/live/drone42 \
  -H "Content-Type: application/json" \
  -d '{
    "publish": true,
    "rtmpEnable": true,
    "read": true,
    "rtspEnable": true
  }'
```

Now:
- **Push RTMP** to  
  `rtmp://localhost:1935/live/drone42`
- **Pull RTSP** from  
  `rtsp://localhost:8554/live/drone42`

Remove the stream:

```bash
curl -X DELETE http://localhost:9997/v1/paths/live/drone42
```

## 🛠 Configuration Files

- `docker-compose.yml`  
- `mediamtx.yml`

## 🐳 Running Without Compose

### Docker

```bash
docker run -d --name mediamtx \
  -p 1935:1935 -p 8554:8554 -p 9997:9997 \
  -v "$(pwd)/mediamtx.yml":/mediamtx.yml \
  bluenviron/mediamtx:latest \
  /mediamtx /mediamtx.yml
```

### Podman (rootless + SELinux)

```bash
podman run -d --name mediamtx \
  -p 1935:1935 -p 8554:8554 -p 9997:9997 \
  -v "$(pwd)/mediamtx.yml":/mediamtx.yml:Z \
  bluenviron/mediamtx:latest \
  /mediamtx /mediamtx.yml
```
```