FROM node:18-alpine AS base

FROM base AS builder
WORKDIR /app
COPY . .
RUN npm install --legacy-peer-deps
RUN cd backend && npm run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./package.json
COPY --from=builder /app/backend/prisma ./prisma

EXPOSE 3001
CMD ["npm", "run", "start:prod"]
