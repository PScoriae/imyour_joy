const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const cheerio = require("cheerio");

const site = "https://kpop.asiachan.com";

const getRestrictedRange = (noOfPages) => {
  if (noOfPages > 100) {
    return 100;
  }
  return noOfPages;
};

const getRndInt = (min, max) => {
  return Math.floor(Math.random() * (max - min) + 1) + min;
};

const getRandomPage = async (name) => {
  const searchString = `${site}/${name}?s=id`;
  const values = [];
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
    values.push(searchString);
    values.push(randomPage);
    return values;
  } catch (err) {
    console.log(err);
  }
};

const getImageLink = async (searchString, randomPage) => {
  searchString = `${searchString}&p=${randomPage}`;
  try {
    const { data } = await axios({
      method: "GET",
      url: searchString,
    });

    const $ = cheerio.load(data);
    const links = [];
    $("#thumbs2 > li > p").each((i, pic) => {
      const tmp = $(pic).children("a").attr("href")
      if (tmp.includes('full')) {
        links.push(tmp);
      }
    });
    const randomIdx = getRndInt(0, links.length - 1);
    return links[randomIdx];
  } catch (err) {
    console.log(err);
  }
};

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
    await interaction.deferReply();
    const name = interaction.options.getString("name");
    const values = await getRandomPage(name);
    const link = await getImageLink(values[0], values[1]);
    await interaction.editReply(link);
  },
};
