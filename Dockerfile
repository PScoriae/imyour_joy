FROM docker.io/library/node:17.2-alpine

RUN mkdir /home/imyour_joy

WORKDIR /home/imyour_joy

ADD . .

RUN npm install

RUN npm run build

RUN apk add --no-cache tzdata

ARG tz=Asia/Kuala_Lumpur

ENV TZ $tz

CMD npm run bot
