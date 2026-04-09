# TaskFlow - Full Stack Docker Setup (Development)
# This is an alternative to docker-compose for running the entire app in a single container
# For production, use docker-compose.yml instead

FROM node:20-slim as base

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Build backend
FROM base as backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --only=production

COPY backend . .

# Build and serve frontend with backend
FROM base as final

WORKDIR /app

# Copy backend files
COPY --from=backend-builder /app/backend ./backend

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

COPY frontend . .
RUN npm run build

# Setup backend
WORKDIR /app/backend
EXPOSE 5001

# Set environment
ENV NODE_ENV=production
ENV PORT=5001

# Start backend (serves frontend from dist directory)
CMD ["node", "index.js"]
