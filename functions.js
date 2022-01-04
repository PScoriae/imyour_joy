const { ytApiKey, spotify } = require("./config.json");
const SpotifyWebApi = require("spotify-web-api-node");
const YouTube = require("youtube-node");
const fs = require("fs");

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

function getRandInt(length) {
  return Math.floor(Math.random() * length);
}

function getAllDirFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory())
      arrayOfFiles = getAllDirFiles(dirPath + "/" + file, arrayOfFiles);
    else arrayOfFiles.push(file);
  });

  return arrayOfFiles;
}

const spotifyApi = new SpotifyWebApi({
  clientId: spotify.clientId,
  clientSecret: spotify.clientSecret,
  redirectUri: "http://localhost:8000/callback",
});

spotifyApi.setRefreshToken(spotify.refreshToken);

const youTube = new YouTube();
youTube.setKey(ytApiKey);

const ytPrefix = "https://youtu.be/";

function refreshSpotifyAccessToken() {
  spotifyApi.refreshAccessToken().then((data) => {
    spotifyApi.setAccessToken(data.body.access_token);
    console.log(`Refreshed Spotify Access Token`);
  });
}

// returns a random element from a given array
function getRandElem(array) {
  const randomNo = getRandInt(array.length);
  return array[randomNo];
}

async function sendRandSong(textChannel) {
  console.log(getCurrentTime());
  refreshSpotifyAccessToken();
  // wait for Spotify servers to recognize new token
  await new Promise((r) => setTimeout(r, 2000));
  const randomPlaylist = getRandElem(spotify.playlistIds);
  spotifyApi.getPlaylistTracks(randomPlaylist).then(
    (data) => {
      const randomTrack = getRandElem(data.body.items);
      const searchTerm = `${randomTrack.track.name} ${randomTrack.track.artists[0].name}`;
      youTube.search(searchTerm, 1, (error, result) => {
        if (error) console.log(error);
        else {
          const ytLink = ytPrefix + result.items[0].id.videoId;
          textChannel.send(ytLink);
          console.log(`Sent ${searchTerm} to ${textChannel.name}`);
        }
      });
    },
    async function (err) {
      console.log(err);
    }
  );
}

function changeGuildIcon(imageDirFiles, myGuild) {
  const randomNo = getRandInt(imageDirFiles.length);
  const chosenImg = imageDirFiles[randomNo];
  imageDirFiles.splice(randomNo, 1);
  myGuild.setIcon("./images/" + chosenImg);
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
