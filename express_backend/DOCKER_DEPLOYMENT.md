# Express Backend - Docker Deployment Guide

## Overview
This guide explains how to build and run the Express backend using Docker.

## Prerequisites
- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)
- Environment variables configured

## Environment Variables

Create a `.env` file in the `express_backend` directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=production
BACKEND_URL=http://localhost:3000

# API Keys
GROQ_API_KEY=your_groq_api_key_here
HF_API_KEY=your_huggingface_api_key_here

# Pinggy URL for external image generation
PINGGY_URL=https://your-pinggy-url.com
```

## Building the Docker Image

### Option 1: Using Docker directly

```bash
# Navigate to express_backend directory
cd express_backend

# Build the image
docker build -t express-backend:latest .

# Run the container
docker run -d \
  --name express-backend \
  -p 3000:3000 \
  --env-file .env \
  -v $(pwd)/Saved_Images:/app/Saved_Images \
  -v $(pwd)/Prompts:/app/Prompts \
  express-backend:latest
```

### Option 2: Using Docker Compose (Recommended)

```bash
# Navigate to express_backend directory
cd express_backend

# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

## Docker Commands Reference

### Build Commands
```bash
# Build the image
docker build -t express-backend:latest .

# Build with no cache (clean build)
docker build --no-cache -t express-backend:latest .

# Build with Docker Compose
docker-compose build
```

### Run Commands
```bash
# Run container in detached mode
docker run -d --name express-backend -p 3000:3000 --env-file .env express-backend:latest

# Run container with interactive terminal
docker run -it --name express-backend -p 3000:3000 --env-file .env express-backend:latest

# Run with Docker Compose
docker-compose up -d
```

### Management Commands
```bash
# View running containers
docker ps

# View all containers (including stopped)
docker ps -a

# View logs
docker logs express-backend
docker logs -f express-backend  # Follow logs

# Stop container
docker stop express-backend

# Start container
docker start express-backend

# Restart container
docker restart express-backend

# Remove container
docker rm express-backend

# Remove image
docker rmi express-backend:latest
```

### Docker Compose Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Remove everything (containers, networks, volumes)
docker-compose down -v
```

## Exposed Ports

- **3000**: Express backend API server

## API Endpoints

Once the container is running, the following endpoints are available:

### Health Check
```bash
GET http://localhost:3000/
```

### Prompt Enhancement
```bash
POST http://localhost:3000/get_prompt
Content-Type: application/json

{
  "prompt": "your prompt here"
}
```

### Image Generation (HuggingFace)
```bash
POST http://localhost:3000/generate-image
Content-Type: application/json

{
  "prompts": ["your enhanced prompt here"]
}
```

### Image Generation (Pinggy)
```bash
POST http://localhost:3000/generate-image-pinggy
Content-Type: application/json

{
  "prompt": "your prompt here"
}
```

## Volume Mounts

The Docker container uses the following volume mounts:

- `./Saved_Images:/app/Saved_Images` - Persists generated images
- `./Prompts:/app/Prompts` - Mounts prompt template files

## Health Check

The container includes a health check that runs every 30 seconds:
- Checks if the server responds on port 3000
- Marks container as unhealthy after 3 failed attempts
- Useful for orchestration tools like Kubernetes

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs express-backend

# Check if port 3000 is already in use
netstat -an | grep 3000  # Linux/Mac
netstat -an | findstr 3000  # Windows
```

### Environment variables not loading
```bash
# Verify .env file exists
ls -la .env

# Check environment variables in container
docker exec express-backend env
```

### Permission issues with volumes
```bash
# Fix permissions on Linux/Mac
sudo chown -R $USER:$USER Saved_Images Prompts
chmod -R 755 Saved_Images Prompts
```

### Rebuild after code changes
```bash
# Stop and remove old container
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

## Production Deployment

For production deployment, consider:

1. **Use a reverse proxy** (Nginx, Traefik) for SSL/TLS
2. **Set resource limits** in docker-compose.yml:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1'
         memory: 1G
       reservations:
         cpus: '0.5'
         memory: 512M
   ```
3. **Use Docker secrets** for sensitive data instead of .env files
4. **Enable logging driver** for centralized logging
5. **Use health checks** for automatic container restart
6. **Set up monitoring** (Prometheus, Grafana)

## Security Best Practices

1. Never commit `.env` files to version control
2. Use Docker secrets for sensitive data in production
3. Run container as non-root user (add to Dockerfile if needed)
4. Keep base image updated (`node:20-alpine`)
5. Scan images for vulnerabilities: `docker scan express-backend:latest`

## Multi-Stage Build (Optional Optimization)

For smaller image size, you can use a multi-stage build:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

## Support

For issues or questions:
1. Check container logs: `docker logs express-backend`
2. Verify environment variables are set correctly
3. Ensure all required ports are available
4. Check Docker daemon is running: `docker info`
