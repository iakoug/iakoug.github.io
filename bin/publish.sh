#!/bin/sh
gatsby clean
gatsby build
cd public
git init
git remote add origin https://github.com/rollawaypoint/rollawaypoint.github.io.git
git commit -am 'Site has been automatically published!'
git push origin HEAD:master -f