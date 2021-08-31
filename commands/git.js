const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("git")
    .setDescription(""),
  async execute(interaction) {
    await interaction.reply(
      `https://tenor.com/view/seulisasoo-joy-gif-21877236`
    );
  },
};