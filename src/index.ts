import { Guild, TextChannel } from "discord.js";

// Require the necessary discord.js classes
const { Client, Collection, Intents, HTTPError } = require("discord.js");
const { discord } = require("../config.json");
const {
  getAllDirFiles,
  sendRandSong,
  changeGuildIcon,
} = require("./functions.js");
const fs = require("fs");
const cron = require("node-cron");
var process = require("process");

// Change cwd to dist
process.chdir("./dist");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// Initialize commands and events
client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file: string) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const eventFiles = fs
  .readdirSync("./events")
  .filter((file: string) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once)
    client.once(event.name, (...args: any) => event.execute(...args));
  else client.on(event.name, (...args: any[]) => event.execute(...args));
}

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

client.on("ready", async () => {
  let imageDirFiles = getAllDirFiles("../images/");
  const myGuild: Guild = client.guilds.cache.get(discord.guildId);
  const musicChannel: TextChannel = client.channels.cache.get(
    discord.musicChannel
  );
  const errorChannel: TextChannel = client.channels.cache.get(
    discord.errorChannel
  );

  cron.schedule("0 0 * * *", async () => {
    if (imageDirFiles.length < 1) imageDirFiles = getAllDirFiles("../images/");
    try {
      changeGuildIcon(imageDirFiles, myGuild);
    } catch (e) {
      if (e instanceof HTTPError) {
        console.error("HTTPError connecting to Discord's servers.");
        errorChannel.send(
          "HTTPError occured trying to change the server's icon."
        );
      } else {
        console.log("Something went wrong trying to change the image!");
        errorChannel.send("Something went wrong trying to change the image!");
      }
    }
  });

  cron.schedule("0 17 * * *", async () => {
    try {
      await sendRandSong(musicChannel);
    } catch (error) {
      console.log(error);
      errorChannel.send("Something went wrong trying to send a song.");
    }
  });
});

client.login(discord.token);
