FROM node:20-alpine
WORKDIR /app
COPY worker/package*.json ./
RUN npm ci --only=production
COPY worker/ .
ENV CHECK_INTERVAL_MS=10000
CMD ["node", "index.js"]
