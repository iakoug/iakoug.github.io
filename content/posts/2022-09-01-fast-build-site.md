---
date: 2022-09-02
title: Nginx 快速建站
description: By Tencent Cloud
template: post
slug: /fast-build-ur-site
category: R&D
tags:
  - Nginx
cover: media/arseny-togulev-mnx3NlXwKdg-unsplash-middle.jpg
---

重构博客 <span color='red'>v6</span>

在腾讯云服务器上快速部署一个前端页面，当然也可以随便选择一个厂商

---

# Preset

- 云服务器

购买腾讯云轻型应用服务器（便宜）

- 域名

腾讯云注册一个属于自己的域名（任意域名服务商，只要把域名解析到你的云服务器公网 IP 就行）

# DNS

访问域名时将其解析到云服务器相应的公网 IP

选择解析类型：

A:

- 解析到指定 IP 地址（云服务器公网 IP）
  - www
  - 自定义二级子域名如 test.iak.cn
- @ 解析主域名

之后外网访问该域名将指向云服务器的公网 IP

# Nginx

外网流量打到云服务器后，提供一个 Nginx 转发服务器来控制具体访问内容

install:

可以自行在 nginx 官网下载指定版本，但是后续配置较为麻烦，选择`yum`直接安装

```Bash
$ sudo yum install nginx

# 设置开机启动

$ sudo systemctl enable nginx
# 启动服务

$ sudo systemctl start nginx
# 停止服务

$ sudo systemctl restart nginx
# 重新加载，因为一般重新配置之后，不希望重启服务，这时可以使用重新加载。

$ sudo systemctl reload nginx

```

安装完成后 nginx 相关文件在 /etc/nginx 目录（后续只需要关注 **/etc/nginx/nginx.conf**）

启动服务后如果遇到报错可以检查是否存在（默认 80）端口占用问题

# SSL

腾讯云服务器提供了主域名（或者 www 主机）免费 ssl 申请的资格

填写相关实名资料申请完成 ssl 证书后，下载相应的 nginx 版本的证书

可以选择通过`scp`命令将证书上传到云服务器硬盘：

```Bash
scp 证书 user@ip:/目录
```

上传到指定目录后，vim /etc/nginx/nginx.conf 对 Https 相关 Server 配置进行更改

操作 conf 文件可以通过云服务器提供的 web shell 或者在本机通过 `ssh user@ip`连接

```Bash
server {
        listen       443 ssl http2;
        listen       [::]:443 ssl http2;
        server_name  域名; # 关联域名 baidu.com
        root         /usr/share/nginx/html;

        ssl_certificate "证书.crt"; # 证书crt文件路径
        ssl_certificate_key "证书.key"; # 证书key文件路径
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  10m;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }


```

配置完成后可以通过 `nginx -t`命令检测配置是否正确（避免语法等问题）

# Sub

如果需要配置子域名如上操作：

1. 新建 server 选项配置 server_name，子域名也需要相应的 ssl 证书需要自行申请（或者购买主域名下的通配符证书）后配置
   不过如果只是挂靠在一级域名下可以直接使用一级域名的 ssl 访问，会带有安全警告

2. 配置子域名的 DNS 解析记录，在购买域名的服务上面添加子域名的主机记录以及相关的类型和 IP 地址

如在腾讯云购买的域名可以访问：https://console.dnspod.cn/dns/

| 主机记录 | 类型 |             IP             |
| :------: | :--: | :------------------------: |
| 二级域名 |  A   | 服务器公网 IP 1.116.219.68 |

# Redirect http to https

```Bash
server {
    listen       80;
    server_name  _;
    return       301 https://$host$request_uri;
}
```

通过通配符`_` 将 80 端口所有打进来的流量都通过重定向的方式跳转到相应 https 链接（也可以通过 rewrite 方式）

# Deploy

将开发 demo 的 dist 文件（`create-react-app demo && yarn build`）同样以`scp`命令上传到云服务器硬盘，将项目入口 html 文件路径配置在 root 上：

```Bash
    server {
        listen      443 ssl;
        server_name www.iakoug.cn; # 可以分别配置带有和不带有 www 的 server
        root        /home/lighthouse/christian/demo/build; # 项目路径
        index       index.html; # 入口文件
    }

```

可能遇到配置完成后外部访问相关域名返回 403 forbidden 问题，检查 nginx.conf 文件顶部 user 配置权限是否为 root

```Bash
# user nginx;
user root;
```

修改文件后重新启动 nginx 服务

```Bash
sudo nginx -s reload
```

# nginx.conf

```Conf
[root@VM-12-10-centos ~]# cat /etc/nginx/nginx.conf
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user root;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
  worker_connections 1024;
}

http {
  log_format main '$remote_addr - $remote_user [$time_local] "$request" '
  '$status $body_bytes_sent "$http_referer" '
  '"$http_user_agent" "$http_x_forwarded_for"';

  access_log /var/log/nginx/access.log main;

  sendfile on;
  tcp_nopush on;
  tcp_nodelay on;
  keepalive_timeout 65;
  types_hash_max_size 4096;

  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  # Load modular configuration files from the /etc/nginx/conf.d directory.
  # See http://nginx.org/en/docs/ngx_core_module.html#include
  # for more information.
  include /etc/nginx/conf.d/*.conf;

  server {
    listen 80;
    listen [::]:80;
    server_name _;
    root /usr/share/nginx/html;

    return 301 https://$host$request_uri;

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    error_page 404 /404.html;
    location = /404.html {
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
    }
  }

  # Settings for a TLS enabled server.
  #
  server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.iakoug.cn;
    # root         /usr/share/nginx/html;
    # root         /root/christian/homepage;
    root /root/christian/blog-tech;
    ssl_certificate "/home/iakoug.cn_nginx/iakoug.cn_bundle.crt";
    ssl_certificate_key "/home/iakoug.cn_nginx/iakoug.cn.key";
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 10m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    error_page 404 /404.html;
    location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
    }
  }

  server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name iakoug.cn;
    # root         /usr/share/nginx/html;
    # root         /root/christian/homepage;
    root /root/christian/blog-tech;
    ssl_certificate "/home/iakoug.cn_nginx/iakoug.cn_bundle.crt";
    ssl_certificate_key "/home/iakoug.cn_nginx/iakoug.cn.key";
    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 10m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;

    error_page 404 /404.html;
    location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
    }
  }

  server {
    listen 443 ssl;
    server_name home.iakoug.cn;
    # root        /root/christian/blog-tech;
    root /root/christian/homepage;
    error_page 404 /404.html;
    location = /404.html {
      root /root/christian/homepage;
    }
    # index       index.html;
    # return      301 https://iakoug.github.io;
  }
```

Done
