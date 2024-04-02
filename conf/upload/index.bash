
scp -r ./ root@1.116.219.68:/home/iakoug.cn_nginx
scp -r ./ root@1.116.219.68:/etc/nginx
yarn build && cd ./public && scp -r ./ root@1.116.219.68:/root/christian/blog-tech
scp -r ./ root@1.116.219.68:/root/christian/homepage