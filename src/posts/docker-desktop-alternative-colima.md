---
title: Remove docker desktop in mac
date: 2024-12-26T00:00:01.644Z
excerpt: How to get rid of docker desktop and use colima(Command line tools.)
type: post
blog: true
image: /images/no-docker-desk.png
tags:
 - development
 - docker-desktop
 - docker
 - linux
---

### Uninstall the currenct docker desktop

```bash
# !/bin/bash

# If you need to run with sudo then uncomment the following four lines.

# if [ "${USER}" != "root" ]; then
#     echo "$0 must be run as root!"
#     exit 2
# fi

while true; do
  read -p "Remove all Docker Machine VMs? (Y/N): " yn
  case $yn in
    [Yy]* ) docker-machine rm -f $(docker-machine ls -q); break;;
    [Nn]* ) break;;
    * ) echo "Please answer yes or no."; exit 1;;
  esac
done

echo "Removing Applications..."
rm -rf /Applications/Docker.app

echo "Removing docker binaries..."
rm -f /usr/local/bin/docker
rm -f /usr/local/bin/docker-machine
rm -r /usr/local/bin/docker-machine-driver*
rm -f /usr/local/bin/docker-compose

echo "Removing boot2docker.iso"
rm -rf /usr/local/share/boot2docker

echo "Forget packages"
pkgutil --forget io.docker.pkg.docker
pkgutil --forget io.docker.pkg.dockercompose
pkgutil --forget io.docker.pkg.dockermachine
pkgutil --forget io.boot2dockeriso.pkg.boot2dockeriso

echo "All Done!"
```

### Install the colima

```bash
brew install colima
brew services start colima
```

### Start the colima to start the docker

```bash
colima start
```

### Install docker, docker compose plugin, credentials plugin

```brew install docker docker-compose docker-credential-helper```

### Update the docker config file to locate the compose and other plugins. Add the following code blocks to `~/.docker/config.json`

```bash
"cliPluginsExtraDirs": [
     "/opt/homebrew/lib/docker/cli-plugins"
 ]
 ```

### Update the credsStore on `~/.docker/config.json`

```bash
"credsStore": "osxkeychain"
```

**~/.docker/config.json should look like following**

```json
{
    "auths": {},
    "credsStore": "osxkeychain",
    "currentContext": "colima",
    "cliPluginsExtraDirs": [
        "/opt/homebrew/lib/docker/cli-plugins"
    ],
    "plugins": {
        "-x-cli-hints": {
            "enabled": "true"
        },
        "debug": {
            "hooks": "exec"
        },
        "scout": {
            "hooks": "pull,buildx build"
        }
    },
    "features": {
        "hooks": "true"
    }
}
```

### Run portainer

> If you want to see the logs from a better UI then, I recommend Portainer. Run the below command to install

```bash
docker run -d -p 9444:9000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:2.21.5
```

Access from <http://localhost:9444>

* Resources:
  * <https://github.com/abiosoft/colima> (MIT license)
