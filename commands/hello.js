const { SlashCommandBuilder } = require("@discordjs/builders");
const { getCurrentTime } = require("../functions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Joy's 안녕 MV hi"),
  async execute(interaction) {
    await interaction.reply("https://youtu.be/lNvBbh5jDcA");
    console.log(`${getCurrentTime()}\nExecuted /hello command.`);
  },
};
