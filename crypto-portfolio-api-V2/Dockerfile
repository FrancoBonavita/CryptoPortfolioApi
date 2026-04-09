# ── Stage 1: Build ────────────────────────────────────────────────────────────
# Install all dependencies (including devDependencies) and compile TypeScript.
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first — Docker caches this layer as long as deps don't change.
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and compile.
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ── Stage 2: Production ──────────────────────────────────────────────────────
# Start fresh with a clean image — no TypeScript, no devDependencies, no source code.
FROM node:20-alpine

WORKDIR /app

# Only install production dependencies.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy the compiled JavaScript from the builder stage.
COPY --from=builder /app/dist ./dist

# Copy the env example as a fallback — the real .env is mounted at runtime.
COPY .env.example .env

EXPOSE 3000

CMD ["node", "--env-file=.env", "dist/app.js"]
