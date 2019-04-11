FROM node:11.13.0-alpine

WORKDIR /opt/newman-runner

COPY yarn.lock yarn.lock
COPY package.json package.json
RUN yarn install

COPY app app

ENTRYPOINT ["node", "-r", "esm", "app/index.mjs"]