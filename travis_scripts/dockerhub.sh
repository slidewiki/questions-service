#!/bin/bash

docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
docker build -t slidewiki/questionservice:latest-dev .
docker push slidewiki/questionservice:latest-dev
