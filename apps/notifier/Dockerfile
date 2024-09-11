FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

ARG PROJECT=@repo/notifier

RUN corepack enable
RUN pnpm add -g turbo@2.1.1 
RUN pnpm add -g @nestjs/cli

WORKDIR /app
COPY . .

FROM base AS pruner

RUN turbo prune ${PROJECT} --docker

FROM base AS installer

COPY --from=pruner /app/out/json/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS builder

COPY --from=pruner /app/out/full/ .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --filter=${PROJECT} --frozen-lockfile
RUN turbo build --filter=${PROJECT}

FROM builder AS runner

ENTRYPOINT [ "sh", "-c", "turbo prod --filter=@repo/notifier" ]

