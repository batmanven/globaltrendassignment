# TaskFlow - Task Manager Application

A full-stack task management application built with React, Node.js/Express, and MongoDB.

## Tech Stack

- **Frontend:** React 19, Vite, TailwindCSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Containerization:** Docker & Docker Compose

## Quick Start

### Using Docker Compose

```bash
docker-compose up --build
```

Then open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

### Local Development

**Backend:**

```bash
cd backend
npm install
npm run dev
```

**Frontend (in another terminal):**

```bash
cd frontend
npm install
npm run dev
```

## Features

- Create, read, update, and delete tasks
- Filter tasks (completed, pending, all)
- Edit task titles
- Mark tasks as complete
- Task progress tracking

## Assumptions & Trade-offs

- **Database:** MongoDB used for data persistence. In-container setup for development convenience.
- **Authentication:** Not implemented - this is an MVP.
- **Frontend-Backend Communication:** Standard HTTP REST API (no WebSockets).
- **Styling:** TailwindCSS for quick, responsive design without custom CSS.
- **Error Handling:** User-friendly error messages with toast notifications.
- **No WebSocket:** Tasks are fetched on-demand rather than real-time sync.
- **Testing:** Basic test setup included; full coverage not required for MVP.

## Setup Notes

- Ensure Docker and Docker Compose are installed
- MongoDB data persists in Docker volume
- Both services include hot reload for development
- Port conflicts: If ports 5001, 5173, or 27017 are in use, modify docker-compose.yml
