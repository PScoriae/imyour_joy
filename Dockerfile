FROM node:16.8-alpine

ADD . .

RUN npm install

CMD ["node", "."]
