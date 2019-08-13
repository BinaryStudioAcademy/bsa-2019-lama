#!/bin/bash
echo $USER
echo $GROUP
sudo curl -s https://raw.githubusercontent.com/BinaryStudioAcademy/bsa-2019-lama/DEV/docker-compose.yml --output docker-compose.yml
sudo docker-compose up -d
