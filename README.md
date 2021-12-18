# imyour_joy

A simple Kpop discord.js bot.

In its current state, this is a Joy (Red Velvet) themed Discord bot that with features that appeal to Kpop fans.
Complying with Discord's announcement regarding *[Message Content Access Deprecation for Verified Bots](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Access-Deprecation-for-Verified-Bots)*, this bot only uses Slash Commands. Though this change only applies to Verified Bots, I still want to use Slash Commands so that I, hopefully, don't encounter any headaches in the future.

You can simply clone this repository, configure it with your own credentials and deploy it.

The suggested method of deployment is through the use of Docker containers. Furthermore, a privately hosted registry for the Docker image is strongly recommended since the image contains the key to your bot.

### Features
- Periodically set a random image as server icon.
- Periodically send appropriate YouTube links for random songs in a Spotify Playlist.

### Commands

| Syntax         | Description                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `/pic {name}`  | Returns a randomly chosen image of the person/thing from kpop.asiachan.com.                       |
| `/git`         | Links to this GitHub repo.                                                                        |
| `/hello`       | Links to Joy's Hello music video.                                                                 |
| `/ping`        | Sends a GIF of Joy waving.                                                                        |

**Note:** In actual use, name arguments should **not** be enclosed in curly brackets. They are only presented here to demonstrate the syntax.

## Installation

In your desired location, simply run the following in the terminal:

    $ git clone https://github.com/PScoriae/imyour_joy

## Configuration

### `config.json` and credentials

If you have a look at the `.gitignore` file, you'll notice that `config.json` has been excluded. This is because it contains sensitive information that is unique to whoever wishes to deploy it.

Hence, the first step is to create a file called `config.json` in the root directory. Then, create an object with your credentials and configuration.

This is the list of things you'll need to setup and where to find them:

- ytApiKey
  1. Set up a new project in the [Google Cloud Console](https://console.cloud.google.com)
  2. Enable the YouTube Data API v3
  3. Grab the API Key
- Discord Information
  1. Enable developer mode in your Discord client's settings
  2. Right-click on the bot, guild or desired channel then click on *Copy ID* to get the clientId, guildId or targetChannelId respectively.
- Spotify API and Playlist
  1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) (Login if you have to)
  2. Click on Create an App
  3. Click on *Edit Settings* and add http://localhost:8888/callback as a Redirect URI then save.
  4. Grab your Spotify Client ID and Secret.
  5. Follow [this](https://github.com/thelinmichael/spotify-web-api-node/blob/master/examples/tutorial/00-get-access-token.js) guide to get your API's refresh token.
  6. Get the desired playlist's ID by looking at its link. For example, https://open.spotify.com/playlist/3etdiVqR3BTqVdOqGlUjvf?si=79b7f3aab1364538 has a playlist ID of 3etdiVqR3BTqVdOqGlUjvf. Add these playlist IDs into a list.

Here's how your `config.json` object should look like:
```
{
    "ytApiKey": "randomBunchOfAlphanumerics",
    "discord": {
        "token": "yourBotsReallyLongTokenHere",
        "clientId": "2034972343430942",
        "guildId": "923847239487234",
        "targetChannel": "3933842342343"
    },
    "spotify": {
        "clientId": "randomBunchOfAlphanumerics",
        "clientSecret": "randomBunchOfAlphanumerics",
        "refreshToken": "reeeeeeeaaaallllyyLoooooonnggggBunchOfAlphanumerics",
        "playlistIds": ["3etdiVqR3BTqVdOqGlUjvf", "1A4YFkRdyliuTubKvSUdvw", "5WWFy14H1EZZsDRbpWuVUg", "6LnpfY8qOiPdnFqizTp2Aa"]
    }
}
```

### Images

You don't really need to do anything for this since I've provided some images. Of course, you may change the images to your liking. Here are some guidelines for the images:
- Square ratio
- Discord recommends resolutions of at least 512x512

***

If you choose to deploy this bot using Docker, that's all the setup that's needed!

I've provided a `docker.sh` script that's designed to Dockerize the bot and deploy it to a private Docker registry (see [Running the Bot Through Docker](#running-the-bot-through-docker)

However, if you wish to run the bot outside of Docker, see [Running the Bot Outside of Docker](#running-the-bot-outside-of-docker)

## Deployment

These instructions and the included script are meant for *nix based systems. However, the deployment process can be replicated on Windows systems provided you understand the intents behind these actions and adjust them accordingly.

### Deploying Slash Commands

Like how the official [Discord.js Guide](https://discordjs.guide/interactions/registering-slash-commands.html#guild-commands) explains,

- `deploy-commands-global.js` updates your bot's commands across all the guilds it's in. However, it may take up to 1 hour for it to fan out all its commands.

- `deploy-commands.js` instantly updates your bot's commands only to the guild specified in `config.json`.

Here's how to run them:

1. Ensure all dependencies are installed beforehand.

        $ npm install

2. Run the appropriate deploy-command script from the `deploy_commands` directory of the project.

        $ node deploy-commands-global.js

#### Duplicate Commands

One very important thing to note is that running both of these deploy scripts will make your bot have duplicate commands in the guild specified in `config.json`.
To remove the duplicates:

1. Temporarily delete the commands in the `commands` folder. 

2. Run your chosen deploy_commands script as described in [Deploying Slash Commands](#deploying-slash-commands).

3. Verify that the duplicates are gone.

4. Undo the deletion.

5. Run the chosen deploy_commands script.

**Note**: This fix need not be done when the bot is offline or on the server that the bot is being hosted on. All the scripts do is update the Discord servers regarding what commands your bot has.

### Running the Bot Outside of Docker

1. You'll first need to have Node.js installed and then install the required dependencies:

        $ npm install

2. Then, to start the bot, you can run the following from the root directory:

        $ node .

That's all you need to do. The instructions below are for deploying it to a server hosting a private registry.

### Running the Bot Through Docker

#### Setting Up A Private Registry

These instructions are largely based on the [official guide](https://docs.docker.com/registry/).

1.  On the server, pull the official registry image.
        
        $ docker pull registry

2.  Run the image in detached mode and open it on your preferred ports.
        
        $ docker run -d -p 5000:5000 --name registry registry

#### Building and Pushing the Docker Image

Special thanks to botjtib for providing a [solution](https://stackoverflow.com/questions/38695515/can-not-pull-push-images-after-update-docker-to-1-12) for pushing to a private regisry.

1. On the computer that will push the Docker image, ensure your server's IP:port is added as an insecure registry to `/etc/docker/daemon.json`. Its contents should include a line like this:

        {"insecure-registries":["192.168.0.154:5000"]}

2. Restart the Docker daemon.

        $ sudo systemctl restart docker

3. Edit `docker.sh`'s variables to fit your needs.

4. Run `docker.sh` to automatically **build**, **tag** and **push** the image to your private registry.

#### Running the Image

1. On your server, pull the image from your registry.

        $ docker pull localhost:5000/imyourjoy

2. Finally, run the image in detached mode.

        $ docker run -d imyourjoy

# Enjoy

Thanks for reading and I hope you enjoy the bot!
