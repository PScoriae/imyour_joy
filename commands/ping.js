const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("안녕ㅇㅇㅇ"),
  async execute(interaction) {
    await interaction.reply(
      `https://tenor.com/view/seulisasoo-joy-gif-21877236`
    );
  },
};
