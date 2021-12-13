const { ytApiKey, spotify } = require("./config.json");
const SpotifyWebApi = require("spotify-web-api-node");
const YouTube = require("youtube-node");
const fs = require("fs");

function getRandInt(length) {
  return Math.floor(Math.random() * length);
}

function getAllDirFiles(dirPath, arrayOfFiles) {
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
const kpopPlaylistId = spotify.playlistId;

function refreshSpotifyAccessToken() {
  spotifyApi.refreshAccessToken().then(function (data) {
    spotifyApi.setAccessToken(data.body.access_token);
    console.log("refreshed spotify access token!");
  });
}

async function sendRandSong(textChannel) {
  refreshSpotifyAccessToken();
  await new Promise((r) => setTimeout(r, 2000));
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
          textChannel.send(ytLink);
        }
      });
    },
    async function (err) {
      console.log(err);
      // refreshSpotifyAccessToken();
      // await new Promise((r) => setTimeout(r, 2000));
      // sendRandSong(textChannel);
    }
  );
}

function changeGuildIcon(imageDirFiles, myGuild) {
  const randomNo = getRandInt(imageDirFiles.length);
  const chosenImg = imageDirFiles[randomNo];
  imageDirFiles.splice(randomNo, 1);
  myGuild.setIcon("./images/" + chosenImg);
}

module.exports = { getRandInt, getAllDirFiles, sendRandSong, changeGuildIcon };
