#!/bin/bash
set -e

PROJ_PATH=$(pwd)
OUTPUT_PATH="${PROJ_PATH}/output"

# 切换node版本
source /etc/profile
nvm install 18
nvm use 18

npm install -g yarn@1.22.17 --registry=https://bnpm.byted.org/
yarn --version
node -v

yarn config set registry http://bnpm.byted.org/
yarn

export BUILD_PATH=dist
yarn build

mkdir $OUTPUT_PATH
cp -r dist $OUTPUT_PATH