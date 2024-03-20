#!/bin/bash
set -e

# 切换node版本
source /etc/profile
nvm install 18
nvm use 18

npm install -g yarn@1.22.17 --registry=https://bnpm.byted.org/
yarn --version
node -v

yarn config set registry http://bnpm.byted.org/
yarn

yarn build