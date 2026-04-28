# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source (node_modules and .env excluded via .dockerignore)
COPY . .

# Create required runtime directories
RUN mkdir -p Saved_Images Prompts

# Expose port (can be overridden at runtime via PORT env var)
EXPOSE 3000

# Runtime environment variables — all provided at `docker run` time via --env or --env-file
# Do NOT hardcode secrets here; these are just documentation of expected vars
ENV NODE_ENV=production \
    PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT||3000) + '/', (r) => { if (r.statusCode !== 200) throw new Error(r.statusCode) })"

CMD ["node", "server.js"]
