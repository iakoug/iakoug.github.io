---
title: 开发环境搭建
tags:
  - 开发环境搭建
date: 2019-04-03 13:27:00
categories: 开发环境搭建
---

入手新的mac？快速搭建你的开发环境！👏
<!-- more -->

# 开机
ahhhh

# Node
[Node最新版本下载地址：](https://nodejs.org/en/)，Current 或者 LTS 版本的 Node 看自己的需求选一个囖

# nrm
npm包管理器会捆绑安装的Node中，但是有时候我们会需要用到管理npm源的需要的，如果可能会有多个源自己设置 registry 是不是很麻烦呢
下载nrm吧，非常好用
```bash
# 安装
sudo npm install nrm -g

# 查看当前的源列表（带*为正在使用）
nrm ls

# 添加源
nrm add [源名字] [源地址]

# 删除源
nrm del [源名字]

# 切换源
nrm use [源名字]

# 测试源响应时间
nrm test [源名字]
```

# cnpm
网络xxx，加个淘宝npm镜像吧，定时同步
```bash
sudo npm install -g cnpm --registry=https://registry.npm.taobao.org
```
这里是添加了一个 `cnpm` 的命令行工具，使用方式和 npm 完全一致，会自动添加到nrm中，但是有上面的 nrm, 完全可以自己不使用cnpm，直接加在自己的源列表里面也是可以的
```bash
nrm add cnpm https://registry.npm.taobao.org
```

# git
下载并安装git：[https://git-scm.com/](https://git-scm.com/)

# homebrew
Homebrew是一个包管理器，用于安装需要的UNIX工具类似wget，也可以安装nginx、yarn之类的服务服务和工具

安装XCode或者Command Line Tools for Xcode。Xcode可以从AppStore里下载安装
或者安装 Command Line Tools for Xcode：
```bash
xcode-select --install
```
安装Homebrew
```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

使用：
```bash
# 搜索包
brew search [包名]

# 安装包
brew install [包名]

# 查看包信息，比如目前的版本，依赖，安装后注意事项等
brew info [包名]

# 卸载包
brew uninstall [包名]

# 显示已安装的包
brew list

# 查看brew的帮助
brew –help

# 更新， 这会更新 Homebrew 自己
brew update

# 检查过时（是否有新版本），这会列出所有安装的包里，哪些可以升级
brew outdated
brew outdated [包名]

# 升级所有可以升级的软件们
brew upgrade
brew upgrade [包名]

# 清理不需要的版本极其安装包缓存
brew cleanup
brew cleanup [包名]
```

# yarn
Yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快
可以使用homebrew：
```bash
brew install yarn
```
也可以使用npm：
```bash
sudo npm i yarn -g
```

# oh my zsh + item2
mac岂可无顺眼的终端

查看当前拥有哪些终端：
```bash
cat /etc/shells
```
查看正在使用的终端：
```bash
echo $SHELL
```
切换终端为zsh：
```bash
chsh -s /bin/zsh
```
安装 oh my zsh：
```bash
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

#### 配置 zsh 插件
这里推荐我用的三个

安装zsh-autosuggestions（命令推荐）:
```bash
git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
```
安装zsh-syntax-highlighting（命令高亮）：
```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git 
```
安装autojump（记录命令操作，使用j快捷跳转）：
```bash
git clone git://github.com/joelthelion/autojump.git
cd autojump
./install.py
```
最后在 ~/.zshrc 中配置插件和主题，主题可以自行选择，有很多种类：
```bash
# 主题配置
ZSH_THEME=ys
# 插件配置
plugins=(
 git
 autojump
 zsh-autosuggestions
 zsh-syntax-highlighting
)
```

最后下载一款 iterm2 的终端代替mac自带的：
直接下载安装：[http://iterm2.com/ ](http://iterm2.com/)
设为默认：
iTerm2 -> Make iTerm2 Default Term

