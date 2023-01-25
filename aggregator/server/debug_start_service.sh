#!/bin/bash
. "$NVM_DIR/nvm.sh"
clear
nvm use 18
node ${PWD}/index.js --debug=true -w2