#!/bin/sh

if [ -f "$(pwd)/temporary.js" ]; then
  mv gatsby-config.js gatsby-config.dev.js
  mv temporary.js gatsby-config.js
fi

# yarn pro 0
# 存在 $1 不提交发布
if [ ! "$1" ]; then
  npm publish
fi
