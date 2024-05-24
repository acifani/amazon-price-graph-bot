FROM node:20-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN corepack enable && pnpm install && pnpm build && pnpm prune --prod

CMD ["pnpm", "start"]
