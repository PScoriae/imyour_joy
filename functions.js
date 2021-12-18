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

function refreshSpotifyAccessToken() {
  spotifyApi.refreshAccessToken().then(function (data) {
    spotifyApi.setAccessToken(data.body.access_token);
    console.log("refreshed spotify access token!");
  });
}

// returns a random element from a given array
function getRandElem(array) {
  const randomNo = getRandInt(array.length);
  return array[randomNo];
}

async function sendRandSong(textChannel) {
  refreshSpotifyAccessToken();
  // wait for Spotify servers to update
  await new Promise((r) => setTimeout(r, 2000));
  const randomPlaylist = getRandElem(spotify.playlistIds);
  spotifyApi.getPlaylistTracks(randomPlaylist).then(
    function (data) {
      const randomTrack = getRandElem(data.body.items);
      const searchTerm = `${randomTrack.track.name} ${randomTrack.track.artists[0].name}`;
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
