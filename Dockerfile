FROM node:11.13.0-alpine

WORKDIR /opt/newman-runner

# Update hosts file
ADD https://raw.githubusercontent.com/ForgeCloud/ob-deploy-tools/master/update-hosts.sh /bin
RUN ["chmod", "+x", "/bin/update-hosts.sh"]
RUN apk update && apk add bash

COPY yarn.lock yarn.lock
COPY package.json package.json
RUN yarn install
COPY run.sh run.sh

COPY app app

ENTRYPOINT ["/opt/newman-runner/run.sh"]
