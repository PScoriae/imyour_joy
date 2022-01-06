FROM docker.io/library/node:17.2-alpine

ADD . .

RUN npm install

RUN apk add --no-cache tzdata

ARG tz=Asia/Kuala_Lumpur

ENV TZ $tz

WORKDIR /dist/

CMD ["node", "index.js"]
