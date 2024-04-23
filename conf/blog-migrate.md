# Migrating DOC

购买 Node.js 镜像的主机

1. 服务器密码重置

https://console.cloud.tencent.com/lighthouse/instance/index?rid=4

2. ssh 登录配置基础目录

- ssh root@ip
- mkdir christian
- cd christian
- mkdir homepage
- mkdir blog-tech

3. install nginx

- sudo yum install nginx

4. 替换服务器上 nginx.conf

- scp /etc/nginx/nginx.conf root@ip:/etc/nginx/nginx.conf

5. 上传服务器证书

下载证书到本地

- cd iakoug.cn_nginx
- scp -r ./ root@ip:/home/iakoug.cn_nginx

6. 检查 ng 配置并且启动 ng server

- sudo nginx -t
- sudo chmod 644 /home/iakoug.cn_nginx/iakoug.cn_bundle.crt
- sudo systemctl start nginx
- sudo systemctl enable nginx
- sudo systemctl status nginx -l

7. 上传 Blog

- scp -r ./ root@ip:/root/christian/blog-tech

8. dns 后台修改域名解析为新主机公网 IP

https://console.dnspod.cn/dns/list/detail/iakoug.cn/records
