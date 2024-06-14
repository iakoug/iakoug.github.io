
scp -r ./ root@150.158.78.211:/home/iakoug.cn_nginx
scp -r ./ root@150.158.78.211:/etc/nginx
yarn build && cd ./public && scp -r ./ root@150.158.78.211:/root/christian/blog-tech
scp -r ./ root@150.158.78.211:/root/christian/homepage