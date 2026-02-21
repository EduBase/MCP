## Multi-stage builder
FROM node:24-alpine AS builder
COPY . /build
WORKDIR /build
RUN --mount=type=cache,target=/root/.npm npm install

## EduBase MCP server image
FROM node:24-alpine AS server
WORKDIR /app
COPY --from=builder /build/dist /app/dist
COPY --from=builder /build/package.json /app/package.json
COPY --from=builder /build/package-lock.json /app/package-lock.json
ENV NODE_ENV=production
RUN npm ci --ignore-scripts --omit-dev
USER node
ENTRYPOINT ["node", "dist/index.js"]
