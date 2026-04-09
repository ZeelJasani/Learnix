# Docker Setup

This project can run locally with Docker Compose using three services:

- `mongo` for the backend database
- `backend` for the Express API
- `frontend` for the Next.js app

## Prerequisites

- Docker Desktop running
- `backend/.env` present
- `frontend/.env` present

## Start the stack

```bash
docker compose up --build
```

If those ports are already in use on your machine, override them:

PowerShell:

```powershell
$env:FRONTEND_PORT="3001"
$env:BACKEND_PORT="5001"
$env:MONGO_PORT="27018"
docker compose up --build
```

Bash:

```bash
FRONTEND_PORT=3001 BACKEND_PORT=5001 MONGO_PORT=27018 docker compose up --build
```

## URLs

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017/learnix`

## Notes

- The compose file overrides the backend Mongo connection to use the `mongo` service.
- The frontend uses `INTERNAL_API_URL=http://backend:5000/api` for server-side requests inside Docker.
- Browser requests still use `http://localhost:5000/api`.
