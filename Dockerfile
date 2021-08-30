FROM node:16.8-alpine

ADD . .

RUN npm install cheerio axios discord.js @discordjs/rest discord-api-types

CMD ["node", "."]
