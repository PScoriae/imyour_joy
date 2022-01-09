FROM docker.io/library/node:17.2-alpine

RUN mkdir /home/imyour_joy

WORKDIR /home/imyour_joy

# split ADD into two parts to take advantage of layering system
# builder will use cache if there are no changes in dependencies
ADD package.json package-lock.json ./

RUN npm ci

ADD . .

RUN npm run build

RUN apk add --no-cache tzdata

ARG tz=Asia/Kuala_Lumpur

ENV TZ $tz

CMD npm run bot
