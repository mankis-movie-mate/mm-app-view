# Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app

# Install dependencies with caching
COPY package.json package-lock.json*  ./
RUN npm install

# Build step
FROM node:20-alpine AS builder
WORKDIR /app
#ENV NEXT_PUBLIC_NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NEXT_PUBLIC_API_URL=https://themanki.net/mmate
ENV NEXT_PUBLIC_AUTH_URL=https://themanki.net/mmate/mm-user-service/users/api/latest/auth

# Next.js collects build artifacts here:
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

CMD ["npm", "start"]
