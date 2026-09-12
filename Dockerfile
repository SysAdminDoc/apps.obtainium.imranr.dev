FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
ENV HOST=0.0.0.0
ENV PORT=8080
USER node
EXPOSE 8080
CMD ["node", "dist/server/entry.mjs"]

# docker build -t obtainium-apps:0.0.3 .
# docker run --rm -p 127.0.0.1:8080:8080 obtainium-apps:0.0.3
