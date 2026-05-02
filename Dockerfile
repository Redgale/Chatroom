# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

# Copy deps and source
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY server.js    ./
COPY index.html   ./

# Give node user ownership before dropping privileges
RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["node", "server.js"]
