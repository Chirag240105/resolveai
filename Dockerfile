FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY --chown=node:node . .
ARG DATABASE_URL=postgresql://build:build@localhost:5432/build?schema=public
ENV DATABASE_URL=$DATABASE_URL
RUN npm run db:generate && npm run build

FROM node:22-alpine AS runner

WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./apps/api/prisma.config.ts
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

RUN mkdir -p /app/uploads && chown -R node:node /app

ENV NODE_ENV=production
EXPOSE 4000
USER node
CMD ["npm", "start"]
