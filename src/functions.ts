import { Collection, Guild, TextChannel } from "discord.js";

const { ytApiKey, spotify } = require("../config.json");
const SpotifyWebApi = require("spotify-web-api-node");
const YouTube = require("youtube-node");
const fs = require("fs");

// Initialize APIs
const spotifyApi = new SpotifyWebApi({
  clientId: spotify.clientId,
  clientSecret: spotify.clientSecret,
  redirectUri: "http://localhost:8000/callback",
});
spotifyApi.setRefreshToken(spotify.refreshToken);

const youTube = new YouTube();
youTube.setKey(ytApiKey);

// Functions
function getCurrentTime() {
  const currentdate = new Date();
  return (
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds()
  );
}

function getRandInt(length: number) {
  return Math.floor(Math.random() * length);
}

function getAllDirFiles(dirPath: string, arrayOfFiles?: string[]) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file: string) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory())
      arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles);
    else arrayOfFiles?.push(file);
  });

  return arrayOfFiles;
}

async function refreshSpotifyAccessToken() {
  const response = await spotifyApi.refreshAccessToken();
  await spotifyApi.setAccessToken(response.body.access_token);
  console.log(`Refreshed Spotify Access Token`);
}

// returns a random element from a given array
function getRandElem(array: any[]) {
  const randomNo = getRandInt(array.length);
  return array[randomNo];
}

async function sendRandSong(textChannel: TextChannel) {
  console.log(getCurrentTime());
  refreshSpotifyAccessToken();
  // wait for Spotify servers to recognize new token
  await new Promise((r) => setTimeout(r, 2000));
  const combinedSongs = await combineSongs(spotify.playlistIds);
  const randomTrack = getRandElem(combinedSongs);
  const searchTerm = `${randomTrack.track.name} ${randomTrack.track.artists[0].name}`;
  const ytPrefix = "https://youtu.be/";
  try {
    youTube.search(
      searchTerm,
      1,
      (error: any, result: { items: { id: { videoId: string } }[] }) => {
        textChannel.send(ytPrefix + result.items[0].id.videoId);
      }
    );
    console.log(`Sent ${searchTerm} to ${textChannel.name}`);
  } catch (e) {
    console.log(e);
  }
}

async function combineSongs(playlistIds: string[]) {
  let combinedSongs: JSON[] = [];
  for (let playlistId of playlistIds) {
    const trackList = await getSpotifyTracks(playlistId);
    combinedSongs.push(...trackList);
  }
  return combinedSongs;
}

async function getSpotifyTracks(playlistId: string): Promise<JSON[]> {
  const limit = 100;
  const response = await spotifyApi.getPlaylistTracks(playlistId);
  const songList: JSON[] = response.body.items;
  if (response.body.total <= limit) return songList;

  const remainder = response.body.total % limit;
  // edge case determines if a single extra query must be made for playlists with multiples of 100
  const edgeCase = remainder ? 0 : 1;
  const noOfQueriesLeft = Math.floor(response.body.total / limit) - edgeCase;
  let queued = response.body.total - limit;
  let offset = limit;

  for (let i = 0; i < noOfQueriesLeft; i++) {
    const altResponse = await spotifyApi.getPlaylistTracks(playlistId, {
      offset: offset,
    });
    songList.push(...altResponse.body.items);

    if (queued < limit) offset = queued;
    else offset += limit;
    queued -= limit;
  }
  return songList;
}

function changeGuildIcon(imageDirFiles: string[], myGuild: Guild) {
  const randomNo = getRandInt(imageDirFiles.length);
  const chosenImg = imageDirFiles[randomNo];
  imageDirFiles.splice(randomNo, 1);
  myGuild.setIcon("../images/" + chosenImg);
  console.log(getCurrentTime());
  console.log(`Successfully set ${myGuild.name}'s image to ${chosenImg}`);
}

// Initialise commands and events
function initialiseClient(client: any) {
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
}

module.exports = {
  getCurrentTime,
  getRandInt,
  getAllDirFiles,
  sendRandSong,
  changeGuildIcon,
  initialiseClient,
};
