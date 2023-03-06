<div align='center'>
<p>
  <a href="https://github.com/PScoriae/imyour_joy/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-WTFPL-brightgreen?style=for-the-badge">
  </a>
  <a href="https://linkedin.com/in/pierreccesario">
    <img src="https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555">
  </a>
</p>
<p>
  <img src="./images/joyfunny.png" width=300>
</p>

## imyour_joy

</div>
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about">About</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li><a href="#installation">Installation</a></li>
    <li>
      <a href="#configuration">Configuration</a>
      <ul>
        <li><a href="#configjson">config.json</a></li>
        <li><a href="#images">Images</a></li>
      </ul>
    </li>
    <li>
      <a href="#deployment">Deployment</a>
      <ul>
        <li><a href="#running-the-bot-outside-of-docker">Running the Bot Outside of Docker</a></li>
        <li><a href="#jenkinsfile">Jenkinsfile</a></li>
        <li><a href="#jenkins-configuration">Jenkins Configuration</a></li>
        <li><a href="#github-webhook">Github Webhook</a></li>
      </ul>
    </li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>
<hr/>

## About

An open source self-deployable Dockerized Discord.js bot written in TypeScript (previously Python)

In its current state, this is a Kpop themed Discord bot that with features that appeal to Kpop fans.

Complying with Discord's announcement regarding _[Message Content Access Deprecation for Verified Bots](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Access-Deprecation-for-Verified-Bots)_, this bot only uses Slash Commands. Though this change only applies to Verified Bots, I still want to use Slash Commands so that I hopefully don't encounter any headaches in the future.

Technically, the fastest way to get it up and running is making the `config.json` file and deploying it on your own PC.

However, CI related files - Docker and Jenkins - are supplied as it is the suggested method of deployment - on an external server.

### Built With

- [TypeScript](https://www.typescriptlang.org/)
- [Discord.js](https://discord.js.org/#/)
- [Docker](https://www.docker.com/)
- [Jenkins](https://www.jenkins.io/)

### Features and Commands

- Periodically set a random image as server icon.
- Periodically send appropriate YouTube links for random songs in a Spotify Playlist.

| Syntax        | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `/pic {name}` | Returns a randomly chosen image of the person/thing from kpop.asiachan.com. |
| `/git`        | Links to this GitHub repo.                                                  |
| `/hello`      | Links to Joy's Hello music video.                                           |
| `/ping`       | Sends a GIF of Joy waving.                                                  |

**Note:** In actual use, name arguments should **not** be enclosed in curly brackets. They are only presented here to demonstrate the syntax.

## Installation

1. If you plan to use Jenkins CI for deployment using GitHub webhooks, fork this repo.

2. In your desired location, simply run the following in the terminal:

   $ git clone https://github.com/yourUsername/imyour_joy

## Configuration

### `config.json`

If you have a look at the `.gitignore` file, you'll notice that `config.json` has been excluded. This is because it contains sensitive information that is unique to whoever wishes to deploy it. Hence, the first step is to create the JSON file called `config.json` in the root directory then set it up with your secrets and configuration.

However, if you wish to make your fork private, you may remove the `config.json` entry for your convenience.

This is the list of things you'll need to setup and where to find them:

- ytApiKey
  1. Set up a new project in the [Google Cloud Console](https://console.cloud.google.com)
  2. Enable the YouTube Data API v3
  3. Grab the API Key
- Discord Information
  1. Enable developer mode in your Discord client's settings
  2. Right-click on the bot, guild or desired channel then click on _Copy ID_ to get their respective IDs.
- Spotify API and Playlist
  1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/)
  2. Click on _Create an App_
  3. Click on _Edit Settings_ and add http://localhost:8888/callback as a Redirect URI then save.
  4. Grab your Spotify Client ID and Secret.
  5. Follow [this guide](https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js) to get your API's refresh token.
  6. Into a list of strings, add the desired playlist's ID by looking at its link. For example, https://open.spotify.com/playlist/3etdiVqR3BTqVdOqGlUjvf?si=79b7f3aab1364538 has a playlist ID of `3etdiVqR3BTqVdOqGlUjvf`.

Here's how your `config.json` object should look like:

```
{
    "ytApiKey": "randomBunchOfAlphanumerics",
    "discord": {
        "token": "yourBotsReallyLongTokenHere",
        "clientId": "2034972343430942",
        "guildId": "923847239487234",
        "musicChannel": "3933842342343",
        "errorChannel": "3200124239834",
    },
    "spotify": {
        "clientId": "randomBunchOfAlphanumerics",
        "clientSecret": "randomBunchOfAlphanumerics",
        "refreshToken": "reeeeeeeaaaallllyyLoooooonnggggBunchOfAlphanumerics",
        "playlistIds": ["3etdiVqR3BTqVdOqGlUjvf", "1A4YFkRdyliuTubKvSUdvw", "5WWFy14H1EZZsDRbpWuVUg", "6LnpfY8qOiPdnFqizTp2Aa"]
    }
}
```

### `docker-compose.yml`

In here, the TZ (time zone) environment variable must be changed to suit your timezone.

A list of TZ database time zones can be found [here](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

### Images

You don't really need to do anything for this since I've provided some images. Of course, you may change the images to your liking. Here are some guidelines for the images:

- Square ratio
- Discord recommends resolutions of at least 512x512

---

If you choose to deploy this bot using Docker, that's all the setup that's needed!

However, if you wish to run the bot outside of Docker, see [Running the Bot Outside of Docker](#running-the-bot-outside-of-docker)

## Deployment

These instructions and the included `npm run` scripts are meant for \*nix based systems. However, the deployment process can be replicated on Windows systems provided you understand the intents behind these actions and adjust them accordingly.

### Running the Bot Outside of Docker

1.  You'll first need to have Node.js installed and then install the required dependencies:

        $ npm install

2.  Then, to start the bot, you can simply use the included scripts:

        $ npm run build && npm run bot

The following instructions are for deploying it to a server using the CI/CD tools Jenkins and Docker.

### Jenkins Configuration

If you plan to use the provided Jenkinsfile and make the fork public, add the **Config File Provider** plugin to your Jenkins install. This is so that Jenkins can add the `config.json` file to the workspace during the build process since it isn't available in the repo.

Using the Jenkins web console, create a new JSON config file and set the ID to the one specified in the Jenkinsfile. Then, make the JSON object.

### GitHub Webhook

In your forked repo's settings, navigate to Webhooks and add your server's public IP address followed by the appropriate port and endpoint for Jenkins e.g. https://123.456.7.89:8090/github-webhook/

Obviously, this means that you'll also need to portforward it.

## Acknowledgements

| Source                                                           | Description                                 |
| ---------------------------------------------------------------- | ------------------------------------------- |
| [Official discord.js guide](https://discordjs.guide)             | Great guide to get started with discord.js  |
| [Official discord.js docs](https://discord.js.org/#/docs/)       | Detailed discord.js docs                    |
| [Michael Hampton and BillyTom](https://serverfault.com/a/683651) | Custom TZ solution for Alpine Docker images |

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/pierreccesario
