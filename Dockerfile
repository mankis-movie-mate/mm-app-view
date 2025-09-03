FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# Envs used at build time
ENV NEXT_PUBLIC_BASE_PATH="/mmate/view"
ENV NEXT_PUBLIC_NODE_ENV="production"
ENV NEXT_PUBLIC_API_URL="https://themanki.net/mmate"
ENV NEXT_PUBLIC_AUTH_URL="https://themanki.net/mmate/mm-user-service/users/api/latest/auth"

RUN npm run build

# --- Standalone runner ---
FROM node:20-alpine AS runner
WORKDIR /app

# Copy ONLY the standalone output (minimal server, all required files)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
