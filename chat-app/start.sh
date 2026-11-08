#!/bin/sh
# Installs Socket.IO the first time, then starts the chat. (Mac, Linux, Termux)
[ -d node_modules/socket.io ] || npm install
node chat.js
