import { Guild, TextChannel } from "discord.js";
import express from "express";

const { Client, HTTPError } = require("discord.js");
const {
  getAllDirFiles,
  sendRandSong,
  changeGuildIcon,
  getCurrentTime,
} = require("../functions");
const { discord } = require("../../config.json");
const cron = require("node-cron");

const app = express();
const port = 2525;

module.exports = {
  name: "ready",
  once: true,
  execute(client: typeof Client) {
    console.log(getCurrentTime());
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    client.user?.setActivity("with Pie");

    let imageDirFiles = getAllDirFiles("../images/");
    const myGuild: Guild = client.guilds.cache.get(discord.guildId);
    const musicChannel: TextChannel = client.channels.cache.get(
      discord.musicChannel
    );
    const errorChannel: TextChannel = client.channels.cache.get(
      discord.errorChannel
    );

    app.post("/api/jenkins-build", (req, res) => {
      res.send(200);
    });

    app.listen(port, () => {
      console.log(`Discord Bot listening on port ${port}`);
    });

    cron.schedule("0 0 * * *", async () => {
      if (imageDirFiles.length < 1)
        imageDirFiles = getAllDirFiles("../images/");
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
  },
};
