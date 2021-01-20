#!/bin/sh
cd public
touch CNAME
echo 'kwoks.me' > CNAME
git init
git add .
git config user.email "rollawaypoint@gmail.com"
git config user.name "christian"
git remote add origin https://github.com/justwink/justwink.github.io.git
git commit -m 'Site has been published!'
git push origin HEAD:master -f
cd ..