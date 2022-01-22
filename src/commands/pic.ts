import { SlashCommandOptionBase } from "@discordjs/builders/dist/interactions/slashCommands/mixins/CommandOptionBase";
import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { getRandInt, getCurrentTime } = require("../functions.js");
const axios = require("axios");
const cheerio = require("cheerio");

const site = "https://kpop.asiachan.com";

const getRestrictedRange = (noOfPages: number) => {
  if (!(noOfPages > 100)) return noOfPages;
  return 100;
};

const loadHtml = async (searchString: string) => {
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

const getRandomPage = async (name: string) => {
  const searchString = `${site}/${name}?s=id`;

  try {
    const $ = await loadHtml(searchString);

    const pagination = $(".pagination").text().trim();
    const tmp = pagination.split(" ")[3];
    const re = /\d+/;
    const noOfPages = Number(tmp.match(re)[0]);
    const randomPage = String(getRandInt(getRestrictedRange(noOfPages)) + 1);
    var values = { searchString, randomPage };
    values.searchString = searchString;
    values.randomPage = randomPage;
    return values;
  } catch (err) {
    console.log(err);
  }
};

const getImageLink = async (searchString: string, randomPage: string) => {
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

const scrapeImageLinks = async ($: Function) => {
  const exts = [".jpg", ".jpeg", ".png"];
  const links: string[] = [];
  $("#thumbs2 > li > p > a").each((i: Function, pic: string) => {
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
    .addStringOption((option: SlashCommandOptionBase) =>
      option
        .setName("name")
        .setDescription("Name of person to search for.")
        .setRequired(true)
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    try {
      const name = interaction.options.getString("name");
      const values = await getRandomPage(name!);
      const link = await getImageLink(values!.searchString, values!.randomPage);
      await interaction.editReply(link!);
      console.log(`${getCurrentTime()}\nExecuted /pic command.`);
    } catch (err) {
      await interaction.editReply("없어요 ㅠㅠ");
      console.log(`${getCurrentTime}\nUnable to find picture for ${name}`);
    }
  },
};
