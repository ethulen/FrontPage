#!/bin/bash
. "$NVM_DIR/nvm.sh"
clear
sudo /etc/init.d/mysql start
nvm use 16
node ${PWD}/index.js --debug=true -w2