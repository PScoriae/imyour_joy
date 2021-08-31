# imyour_joy

A simple Kpop discord.js bot.

In its current state, this is a Joy (Red Velvet) themed Discord bot that with features that appeal to Kpop fans.
Complying with Discord's announcement regarding *[Message Content Access Deprecation for Verified Bots](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Access-Deprecation-for-Verified-Bots)*, this bot only uses Slash Commands. Though this change only applies to Verified Bots, I still want to use Slash Commands so that I, hopefully, don't encounter any headaches in the future.

You can simply clone this repository, configure it with your own credentials and deploy it.

The suggested method of deployment is through the use of Docker containers. Furthermore, a privately hosted registry for the Docker image is strongly recommended since the image contains the key to your bot.

## Commands

| Syntax         | Description                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `/pic {name}`  | Returns a randomly chosen image of the person/thing from kpop.asiachan.com.                       |
| `/git`         | Links to this GitHub repo.                                                                        |
| `/hello`       | Links to Joy's Hello music video.                                                                 |
| `/ping`        | Sends a GIF of Joy waving                                                                         |

**Note:** In actual use, name arguments should **not** be enclosed in curly brackets. They are only presented here to demonstrate the syntax.

# Installation and Configuration

## Installation

In your desired location, simply run the following in the terminal:

        $ git clone https://github.com/PScoriae/imyour_joy

## Configuration

If you have a look at the `.gitignore` file, you'll notice that `config.json` has been excluded. This is because it contains sensitive information that is unique to whoever wishes to deploy it.

Hence, the first step is to create a file called `config.json` in the root directory. Then, create an object with your bot's token, client ID and guild ID like so:

    {
    "token": "yourBotsReallyLongTokenHere",
    "clientId": "2034972343430942",
    "guildId": "923847239487234"
    }

To get your bot's client ID and your guild's ID, first enable Developer mode in your Discord client's settings. Then, you can right-click on the bot and the server to get their IDs.

If you choose to deploy this bot using Docker, that's all the setup that's needed! `docker build` will take care of the rest.

However, if you wish to run the bot outside of Docker, see [Running the Bot Outside of Docker](##running-the-bot-outside-of-docker)

# Deployment

These instructions and the included script are meant for *nix based systems. However, the deployment process can be replicated on Windows systems provided you understand the intents behind these actions and adjust them accordingly.

## Running the Bot Outside of Docker

You'll first need to have Node.js installed and then install the required dependencies with `npm`:

    $ npm install

Then, to start the bot, you can run the following from the root directory

    $ node .

That's all you need to do. The instructions below are for deploying it to a server hosting a private registry.

## Setting Up A Private Registry

These instructions are largely based on the [official guide](https://docs.docker.com/registry/).

1.  On the server, pull the official registry image.
        
        $ docker pull registry

2.  Run the image in detached mode and open it on your preferred ports.
        
        $ docker run -d -p 5000:5000 --name registry registry

## Creating and Pushing the Docker Image

Special thanks to botjtib for providing a [solution](https://stackoverflow.com/questions/38695515/can-not-pull-push-images-after-update-docker-to-1-12) for pushing to a private regisry.

1. On the computer that will push the Docker image, ensure your server's IP:port is added as an insecure registry to `/etc/docker/daemon.json`. Its contents should include a line like this:

        {"insecure-registries":["192.168.0.154:5000"]}

2. Restart the Docker daemon.

        $ sudo systemctl restart docker

3. Edit `docker.sh`'s variables to fit your needs.

4. Run `docker.sh` to automatically **build**, **tag** and **push** the image to your private registry.

## Running the Image

1. On your server, pull the image from your registry.

        $ docker pull localhost:5000/imyourjoy

2. Finally, run the image in detached mode.

        $ docker run -d imyourjoy

# Enjoy

Thanks for reading and I hope you enjoy the bot!
