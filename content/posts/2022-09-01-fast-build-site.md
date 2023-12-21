---
date: 2022-09-02
title: 腾讯云 Nginx 快速建站
template: post
thumbnail: "../thumbnails/post.png"
slug: /fast-build-ur-site
category: Nginx
tags:
  - Nginx
---

在腾讯云服务器上快速部署一个前端页面

---

# Preset

- 云服务器

购买腾讯云轻型应用服务器（便宜）

- 域名

腾讯云注册一个属于自己的域名（任意域名服务商，只要把域名解析到你的云服务器公网IP就行）

# DNS

访问域名时将其解析到云服务器相应的公网IP



选择解析类型：

  A:

  - 解析到指定IP地址（云服务器公网IP）
      - www
      - 自定义二级子域名如test.iak.cn
  - @ 解析主域名



之后外网访问该域名将指向云服务器的公网IP

# Nginx

外网流量打到云服务器后，提供一个Nginx 转发服务器来控制具体访问内容



install:

可以自行在nginx官网下载指定版本，但是后续配置较为麻烦，选择`yum`直接安装

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

安装完成后nginx相关文件在 /etc/nginx目录（后续只需要关注 **/etc/nginx/nginx.conf**）

启动服务后如果遇到报错可以检查是否存在（默认80）端口占用问题

# SSL

腾讯云服务器提供了主域名（或者www主机）免费ssl申请的资格



填写相关实名资料申请完成ssl证书后，下载相应的nginx 版本的证书

可以选择通过`scp`命令将证书上传到云服务器硬盘：

```Bash
scp 证书 user@ip:/目录
```

上传到指定目录后，vim /etc/nginx/nginx.conf 对Https相关Server配置进行更改

操作conf文件可以通过云服务器提供的web shell或者在本机通过 `ssh user@ip`连接

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

如果需要配置子域名，可以新建server选项，子域名也需要相应的ssl证书需要自行申请（或者购买主域名下的通配符证书）后配置



# Redirect http to https

```Bash
server {
    listen       80;
    server_name  _;
    return       301 https://$host$request_uri;
}
```

通过通配符`_` 将80端口所有打进来的流量都通过重定向的方式跳转到相应https链接（也可以通过rewrite方式）



# Deploy

将开发demo的dist文件（`create-react-app demo && yarn build`）同样以`scp`命令上传到云服务器硬盘，将项目入口html文件路径配置在 root上：

```Bash
    server {
        listen      443 ssl;
        server_name blog.iakoug.cn;
        root        /home/lighthouse/christian/demo/build; # 项目路径
        index       index.html; # 入口文件
    }

```

可能遇到配置完成后外部访问相关域名返回403 forbidden问题，检查nginx.conf文件顶部user配置权限是否为root

```Bash
# user nginx;
user root;
```

修改文件后重新启动nginx服务

```Bash
sudo nginx -s reload
```



Done