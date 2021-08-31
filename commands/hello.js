const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("git")
    .setDescription("Joy's 안녕 MV"),
  async execute(interaction) {
    await interaction.reply(
      'https://youtu.be/lNvBbh5jDcA'
    );
  },
};