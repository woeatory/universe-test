FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG PROJECT=@repo/user-service

RUN corepack enable
RUN pnpm add -g turbo@2.1.1 
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY . .

FROM base AS pruner

RUN turbo prune ${PROJECT} --docker

FROM base AS installer

COPY --from=pruner /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS migrator

COPY --from=pruner /app/out/full/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=${PROJECT} --frozen-lockfile

ENTRYPOINT [ "sh", "-c", "turbo migrate --filter=@repo/user-service" ]
