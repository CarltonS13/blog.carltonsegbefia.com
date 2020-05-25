#!/usr/bin/env zsh
echo "Minifying Files"
gulp
echo "Uploading Files"
FTP_USER=<username> FTP_PASSWORD=<password> gulp remote-deploy
echo "Done"
