# Simplified version

购买 Node.js 镜像的主机

公网 IP：150.158.78.211

1. 服务器密码重置

https://console.cloud.tencent.com/lighthouse/instance/index?rid=4

2. 安装 nginx

- sudo yum install nginx

3. 连接并登录原服务器，迁移文件

- ssh root@ip
<!-- 站点资源 -->
- scp -r christian root@150.158.78.211:/root
<!-- 服务器配置 -->
- scp /etc/nginx/nginx.conf root@150.158.78.211:/etc/nginx/nginx.conf
<!-- 证书 -->
- scp -r /home root@150.158.78.211:/

4. start ng server

- sudo nginx -t
- sudo chmod 644 /home/iakoug.cn_nginx/iakoug.cn_bundle.crt
- sudo chmod 644 /home/home.iakoug.cn_nginx/home.iakoug.cn_bundle.crt
- sudo systemctl enable nginx
- sudo systemctl start nginx
- sudo systemctl status nginx -l

5. dns 后台修改域名解析为新主机公网 IP

https://console.dnspod.cn/dns/list/detail/iakoug.cn/records
