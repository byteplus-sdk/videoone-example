#!/bin/bash
set -e

# 切换node版本
source /etc/profile
# nvm install 18
# nvm use 18

node -v
npm -v
npm i -g pnpm@5.5
pnpm -v
pnpm install
pnpm build