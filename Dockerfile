FROM node:11.13.0-alpine

WORKDIR /opt/newman-runner

COPY yarn.lock yarn.lock
COPY package.json package.json
RUN yarn install
COPY run.sh run.sh

COPY app app

ENTRYPOINT ["./run.sh"]