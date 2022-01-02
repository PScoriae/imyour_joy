const { SlashCommandBuilder } = require("@discordjs/builders");
const { getRandInt, getCurrentTime } = require("../functions.js");
const axios = require("axios");
const cheerio = require("cheerio");

const site = "https://kpop.asiachan.com";

const getRestrictedRange = (noOfPages) => {
  if (noOfPages > 100) {
    return 100;
  }
  return noOfPages;
};

const loadHtml = async (searchString) => {
  try {
    const { data } = await axios({
      method: "GET",
      url: searchString,
    });
    return cheerio.load(data);
  } catch (err) {
    console.log(err);
  }
};

const getRandomPage = async (name) => {
  const searchString = `${site}/${name}?s=id`;
  const values = [];
  try {
    const $ = await loadHtml(searchString);

    const pagination = $(".pagination").text().trim();
    const tmp = pagination.split(" ")[3];
    const re = /\d+/;
    const noOfPages = Number(tmp.match(re)[0]);
    const randomPage = String(getRandInt(getRestrictedRange(noOfPages)) + 1);

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
    const $ = await loadHtml(searchString);
    const links = await scrapeImageLinks($);
    const randomIdx = getRandInt(links.length);
    return links[randomIdx - 1];
  } catch (err) {
    console.log(err);
  }
};

const scrapeImageLinks = async ($) => {
  const exts = [".jpg", ".jpeg", ".png"];
  const links = [];
  $("#thumbs2 > li > p > a").each((i, pic) => {
    const tmp = $(pic).attr("href");
    for (const ext of exts) {
      if (tmp.endsWith(ext)) {
        links.push(tmp);
        break;
      }
    }
  });
  return links;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pic")
    .setDescription(
      "Returns a randomly chosen image of the person/thing from kpop.asiachan.com."
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of person to search for.")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const name = interaction.options.getString("name");
      const values = await getRandomPage(name);
      const link = await getImageLink(values[0], values[1]);
      await interaction.editReply(link);
      console.log(`${getCurrentTime()}\nExecuted /pic command.`);
    } catch (err) {
      await interaction.editReply("없어요 ㅠㅠ");
      console.log(`${getCurrentTime}\nUnable to find picture for ${name}`);
    }
  },
};
