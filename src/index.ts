const { Client, Intents } = require("discord.js");
const { discord } = require("../config.json");
const { initialiseClient } = require("./functions");

import process from "process";

// Change cwd to dist
process.chdir("./dist");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
initialiseClient(client);

client.on("interactionCreate", async (interaction: any) => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(discord.token);
