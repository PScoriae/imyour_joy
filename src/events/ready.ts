import { Client } from "discord.js";
const { getCurrentTime } = require("../functions");

module.exports = {
  name: "ready",
  once: true,
  execute(client: Client) {
    console.log(getCurrentTime());
    console.log(`Ready! Logged in as ${client.user?.tag}`);
    client.user?.setActivity("with Pie");
  },
};
