FROM node:18-alpine AS base

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN cd frontend && npm run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
