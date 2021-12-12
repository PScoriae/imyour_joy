FROM node:17.2-alpine

ADD . .

RUN npm install

RUN apk add --no-cache tzdata

ENV TZ Asia/Kuala_Lumpur

CMD ["node", "."]
