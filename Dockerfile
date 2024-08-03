# Base stage for both dev and prod
FROM node:18 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate

# Development stage
FROM base AS development
ENV NODE_ENV=development
CMD ["sh", "/app/entrypoint.sh"]

# Production stage
FROM base AS production
ENV NODE_ENV=production
RUN npm run build

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

CMD ["sh", "/app/entrypoint.sh"]