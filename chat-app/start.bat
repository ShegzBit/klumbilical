@echo off
rem Installs Socket.IO the first time, then starts the chat. (Windows)
if not exist node_modules\socket.io call npm install
node chat.js
