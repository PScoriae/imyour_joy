#!/bin/bash
# automates docker image creation and push to local registry.

imageName=imyourjoy
serverIp=192.168.0.154
serverPort=5000

docker build -t $imageName .
docker tag imyourjoy $serverIp:$serverPort/$imageName
docker push $serverIp:$serverPort/$imageName