FROM gcr.io/distroless/nodejs:18
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm ci && npm run build && npm --omit=dev

CMD ["dist/index.js"]
