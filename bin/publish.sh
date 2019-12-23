#!/bin/sh
cd public
touch CNAME
echo 'justwink.cn' > CNAME
git init
git add .
git config user.email "rollawaypoint@gmail.com"
git config user.name "christian"
git remote add origin https://github.com/rollawaypoint/rollawaypoint.github.io.git
git commit -m 'Site has been published automatically'
git push origin HEAD:master -f