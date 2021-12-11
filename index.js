// Require the necessary discord.js classes
const { Client, Collection, Intents } = require("discord.js");
const {
  discordToken,
  guildId,
  testingChannel,
  ytApiKey,
  spotify,
} = require("./config.json");
const { getRandInt } = require("./functions.js");
const fs = require("fs");
const cron = require("node-cron");
const YouTube = require("youtube-node");
const SpotifyWebApi = require("spotify-web-api-node");

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

const spotifyApi = new SpotifyWebApi({
  clientId: spotify.clientId,
  clientSecret: spotify.clientSecret,
  redirectUri: "http://localhost:8000/callback",
});

const youTube = new YouTube();
youTube.setKey(ytApiKey);

const ytPrefix = "https://youtu.be/";
const kpopPlaylistId = "5zvS8rhYah42PJfMkyNtt0";

spotifyApi.setAccessToken(spotify.accessToken);
spotifyApi.setRefreshToken(spotify.refreshToken);

let imageDirFiles = getAllDirFiles("./images/");

client.on("ready", async () => {
  const myGuild = client.guilds.cache.get(guildId);
  const joybotChannel = client.channels.cache.get(testingChannel);

  cron.schedule("0 * * * *", async () => {
    const randomNo = getRandInt(imageDirFiles.length);
    const chosenImg = imageDirFiles[randomNo];
    imageDirFiles.splice(randomNo, 1);
    myGuild.setIcon("./images/" + chosenImg);

    if (imageDirFiles.length < 1) {
      imageDirFiles = getAllDirFiles("./images/");
    }
  });

  cron.schedule("30 * * * *", async () => {
    spotifyApi.getPlaylistTracks(kpopPlaylistId).then(
      function (data) {
        const randomNo = getRandInt(data.body.items.length);
        const searchTerm =
          data.body.items[randomNo].track.name +
          " " +
          data.body.items[randomNo].track.artists[0].name;
        youTube.search(searchTerm, 1, function (error, result) {
          if (error) {
            console.log(error);
          } else {
            const ytLink = ytPrefix + result.items[0].id.videoId;
            joybotChannel.send(ytLink);
          }
        });
      },
      function (err) {
        console.log("error :(", err);
      }
    );
  });

  // refresh access token every 10 minutes
  cron.schedule("/*10 * * * *", async () => {
    // When our access token will expire
    let tokenExpirationEpoch;

    spotifyApi.refreshAccessToken().then(
      function (data) {
        tokenExpirationEpoch =
          new Date().getTime() / 1000 + data.body["expires_in"];
        console.log(
          "Refreshed token. It now expires in " +
            Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
            " seconds!"
        );
      },
      function (err) {
        console.log("Could not refresh the token!", err.message);
      }
    );
  });
});

client.login(discordToken);
