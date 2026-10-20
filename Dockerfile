FROM node:22-alpine AS base

ENV PORT=8080
WORKDIR /app

RUN addgroup -S app && adduser -S app -G app \
    && mkdir -p /app/public/uploads/blog-img /app/public/uploads/users \
    && chown -R app:app /app

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:8080/api/healthz').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

FROM base AS development

ENV NODE_ENV=development

COPY --chown=app:app package*.json ./
USER app
RUN npm ci
COPY --chown=app:app . .

CMD ["node", "--watch", "index.js"]

FROM base AS production

ENV NODE_ENV=production

COPY --chown=app:app package*.json ./
USER app
RUN npm ci --omit=dev
COPY --chown=app:app . .

CMD ["node", "index.js"]