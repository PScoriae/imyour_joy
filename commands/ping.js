const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		var t0 = performance.now();
		await interaction.reply(`Pong in ${interaction.channel.toString()} to ${interaction.user.toString()}`);
		var t1 = performance.now();
		await interaction.channel.send(`Took ${t1 - t0} ms`);
	},
};
