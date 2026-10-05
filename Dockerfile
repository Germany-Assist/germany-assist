# syntax=docker/dockerfile:1

########## Stage 1: build the client bundle ##########
# Vite outputs to ../server/public, so the server dir must exist next to client/.
FROM node:22-slim AS client-build
WORKDIR /build

# VITE_* vars are baked into the bundle at build time
ARG VITE_NODE_ENV=staging
ARG VITE_GOOGLE_CLIENT_ID=""
ARG VITE_STRIPE_SK=""
ENV VITE_NODE_ENV=$VITE_NODE_ENV \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID \
    VITE_STRIPE_SK=$VITE_STRIPE_SK

COPY client/package*.json client/
RUN npm ci --prefix client
COPY client/ client/
RUN mkdir -p server
RUN npm run build --prefix client

########## Stage 2: server runtime ##########
FROM node:22-slim
ENV NODE_ENV=staging
WORKDIR /app

COPY server/package*.json ./
RUN npm ci --omit=dev

COPY server/src ./src
COPY --from=client-build /build/server/public ./public

RUN mkdir -p logs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Env comes from the container environment (docker-compose.staging.yml)
CMD ["node", "src/index.js"]
