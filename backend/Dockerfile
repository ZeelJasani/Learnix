FROM oven/bun:1 AS deps
WORKDIR /app
COPY package*.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json bun.lock ./
COPY tsconfig.json ./
COPY api ./api
COPY src ./src
RUN bun run build

FROM oven/bun:1 AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json bun.lock ./
RUN bun install --production
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["bun", "run", "start"]
