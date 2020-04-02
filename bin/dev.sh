#!/bin/sh

if [ ! -f "$(pwd)/temporary.js" ]; then
  mv gatsby-config.js temporary.js
  mv gatsby-config.dev.js gatsby-config.js
fi

gatsby clean
gatsby develop -p 9000