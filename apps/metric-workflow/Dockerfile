FROM node:22.16.0-alpine3.21 AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev && npm cache clean --force

FROM node:22.16.0-alpine3.21 AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3000
RUN addgroup -S miseos && adduser -S miseos -G miseos
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY api ./api
COPY schemas ./schemas
COPY registry ./registry
COPY workflow ./workflow
COPY frontend ./frontend
COPY data ./data
USER miseos
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "api/src/server.js"]
