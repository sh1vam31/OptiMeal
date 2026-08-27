# Stage 1: Build the React Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

# Copy frontend dependencies and build
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
# We don't need a VITE_API_URL because it will be served from the same domain
RUN npm run build


# Stage 2: Build the FastAPI Backend
FROM python:3.10-slim AS backend
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code and machine learning models
COPY backend/ ./backend/
COPY ml/ ./ml/
COPY intenteats.db ./

# Copy the built React app from the frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose the port (Render provides $PORT, defaulting to 8000 locally)
EXPOSE 8000

# Run the FastAPI server
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
