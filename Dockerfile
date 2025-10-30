# Etapa 1: Build del frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=5000
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./server.js
COPY --from=build /app/dist ./dist
EXPOSE 5000
CMD ["node", "server.js"]