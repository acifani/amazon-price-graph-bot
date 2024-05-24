FROM node:20-slim
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm ci && npm run build && npm prune --omit=dev

CMD ["dist/index.js"]
