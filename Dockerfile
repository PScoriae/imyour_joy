FROM docker.io/library/node:17.2-alpine

RUN mkdir /home/imyour_joy

WORKDIR /home/imyour_joy

ADD . .

RUN npm install

RUN npx tsc -p .

RUN apk add --no-cache tzdata

ARG tz=Asia/Kuala_Lumpur

ENV TZ $tz

WORKDIR /home/imyour_joy/dist

CMD npm run bot
