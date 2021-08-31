const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("git")
    .setDescription("Links to the GitHub repo."),
  async execute(interaction) {
    await interaction.reply(
      'https://github.com/PScoriae/imyour_joy/'
    );
  },
};