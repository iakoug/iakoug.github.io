#!/bin/sh
cd public
git init
git add .
git config user.email "rollwaypoint@gmail.com"
git config user.name "christian"
git remote add origin https://github.com/rollawaypoint/rollawaypoint.github.io.git
git commit -m 'Site has been automatically published!'
git push origin HEAD:master -f