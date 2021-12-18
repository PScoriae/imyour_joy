#!/bin/bash
# automates docker image creation and push to local registry.

imageName=imyourjoy
serverIp=192.168.0.154
serverPort=5000
timezone=Asia/Kuala_Lumpur

docker build --build-arg tz=$timezone -t $imageName .
docker tag imyourjoy $serverIp:$serverPort/$imageName
docker push $serverIp:$serverPort/$imageName
