import { CommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");
const { getCurrentTime } = require("../functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("git")
    .setDescription("Links to the GitHub repo."),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("https://github.com/PScoriae/imyour_joy");
    console.log(`${getCurrentTime()}\nExecuted /git command.`);
  },
};
