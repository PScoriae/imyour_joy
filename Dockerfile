FROM node:17.2-alpine

ADD . .

RUN npm install

CMD ["node", "."]
