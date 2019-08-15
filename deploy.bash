#!/bin/bash
sudo curl -s https://raw.githubusercontent.com/BinaryStudioAcademy/bsa-2019-lama/DEV/docker-compose.yml --output docker-compose.yml
sudo docker-compose pull lamaapi
sudo docker-compose pull photoapi
sudo docker-compose pull lamaweb
sudo docker-compose up -d
