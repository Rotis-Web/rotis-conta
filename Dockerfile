
FROM node:20-alpine AS base


RUN apk add --no-cache \
    libc6-compat \
    curl


WORKDIR /app


ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


COPY package.json pnpm-lock.yaml ./


FROM base AS development

RUN pnpm install --frozen-lockfile


COPY . .


EXPOSE 3000 24678


ENV NODE_ENV=development


CMD ["pnpm", "run", "dev"]


FROM base AS builder


RUN pnpm install --frozen-lockfile


COPY . .


ENV NODE_ENV=production


RUN pnpm run build


RUN pnpm prune --prod


FROM node:20-alpine AS production


RUN apk add --no-cache dumb-init


RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxt -u 1001


WORKDIR /app


COPY --from=builder --chown=nuxt:nodejs /app/.output /app/.output
COPY --from=builder --chown=nuxt:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=nuxt:nodejs /app/package.json /app/
COPY --from=builder --chown=nuxt:nodejs /app/pnpm-lock.yaml /app/


USER nuxt


EXPOSE 3000


ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000


HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1


ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", ".output/server/index.mjs"]