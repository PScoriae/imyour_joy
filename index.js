// Require the necessary discord.js classes
const { Client, Collection, Intents } = require("discord.js");
const { token, guildId } = require("./config.json");
const fs = require("fs");
const cron = require("node-cron");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.on("interactionCreate", async (interaction) => {
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

const getAllDirFiles = function (dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(file);
    }
  });

  return arrayOfFiles;
};

let imageDirFiles = getAllDirFiles("./images/");

client.on("ready", async () => {
  cron.schedule("*/1 * * * * *", async () => {
    const randomNo = Math.floor(Math.random() * imageDirFiles.length);
    const chosenImg = imageDirFiles[randomNo];
    imageDirFiles.splice(randomNo, 1);

    const myGuild = client.guilds.cache.get(guildId);
    myGuild.setIcon("./images/" + chosenImg);

    if (imageDirFiles.length < 1) {
      imageDirFiles = getAllDirFiles("./images/");
    }
  });
});

client.login(token);
