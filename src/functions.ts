import { Guild, TextChannel } from "discord.js";

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

function refreshSpotifyAccessToken() {
  spotifyApi
    .refreshAccessToken()
    .then((data: { body: { access_token: string } }) => {
      spotifyApi.setAccessToken(data.body.access_token);
      console.log(`Refreshed Spotify Access Token`);
    });
}

// returns a random element from a given array
function getRandElem(array: any[]) {
  const randomNo = getRandInt(array.length);
  return array[randomNo];
}

async function sendRandSong(textChannel: TextChannel) {
  const ytPrefix = "https://youtu.be/";
  console.log(getCurrentTime());
  refreshSpotifyAccessToken();
  // wait for Spotify servers to recognize new token
  await new Promise((r) => setTimeout(r, 2000));
  const randomPlaylist = getRandElem(spotify.playlistIds);
  spotifyApi.getPlaylistTracks(randomPlaylist).then(
    (data: { body: { items: string[] } }) => {
      const randomTrack = getRandElem(data.body.items);
      const searchTerm = `${randomTrack.track.name} ${randomTrack.track.artists[0].name}`;
      youTube.search(
        searchTerm,
        1,
        (error: any, result: { items: { id: { videoId: string } }[] }) => {
          if (error) console.log(error);
          else {
            const ytLink = ytPrefix + result.items[0].id.videoId;
            textChannel.send(ytLink);
            console.log(`Sent ${searchTerm} to ${textChannel.name}`);
          }
        }
      );
    },
    async function (err: any) {
      console.log(err);
    }
  );
}

function changeGuildIcon(imageDirFiles: string[], myGuild: Guild) {
  const randomNo = getRandInt(imageDirFiles.length);
  const chosenImg = imageDirFiles[randomNo];
  imageDirFiles.splice(randomNo, 1);
  myGuild.setIcon("../images/" + chosenImg);
  console.log(
    `${getCurrentTime()}\nSuccessfully set ${
      myGuild.name
    }'s image to ${chosenImg}`
  );
}

module.exports = {
  getCurrentTime,
  getRandInt,
  getAllDirFiles,
  sendRandSong,
  changeGuildIcon,
};
