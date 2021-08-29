const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pic")
    .setDescription("Returns searched image from kpop.asiachan.com")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of person to search for.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const getRestrictedRange = (noOfPages) => {
      if (noOfPages > 100) {
        return 100;
      }
      return noOfPages;
    };

    const getRndInt = (min, max) => {
      return Math.floor(Math.random() * (max - min) + 1) + min;
    };

    const getImage = async (arg) => {
      const site = "https://kpop.asiachan.com";
      const searchString = `${site}/${arg}?s=id`;
      try {
        const { data } = await axios({
          method: "GET",
          url: searchString,
        });

        const $ = cheerio.load(data);
        const pagination = $(".pagination").text().trim();
        const tmp = pagination.split(" ")[3];
        const re = /\d+/;
        const noOfPages = Number(tmp.match(re)[0]);
        const randomPage = String(getRndInt(1, getRestrictedRange(noOfPages)));

        const searchString2 = `${searchString}&p=${randomPage}`;
        try {
          const { data } = await axios({
            method: "GET",
            url: searchString2,
          });

          const $ = cheerio.load(data);
          const links = [];
          $("#thumbs2 > li > p").each((i, pic) => {
            links.push($(pic).children("a").attr("href"));
          });
          const randomIdx = getRndInt(0, links.length - 1);
          return links[randomIdx];
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
      }
    };
    const string = interaction.options.getString("name");
    await interaction.deferReply();
    const link = await getImage(string);
    await interaction.editReply(link);
  },
};
