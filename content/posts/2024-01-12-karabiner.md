---
title: "Mac OS MDM Profile Policy"
date: 2024-01-12 08:00:00
template: post
draft: false
slug: /karabiner
category: R&D
tags:
  - Mac Profile
description: 突然发现日常使用的 Karabiner Elements 设置的 Hyper key 失效了，这可是我的生产力效率支柱
cover: media/jez-timms-aCgM_7B-cNk-unsplash.jpg
by: Photo by &nbsp;<a href="https://unsplash.com/@jeztimms?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Jez Timms</a> &nbsp; on <a href="https://unsplash.com/photos/white-and-black-angel-painting-aCgM_7B-cNk?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">&nbsp;Unsplash</a>
---

日常工作中 Mac 上对我来说影响最大的效率提升工具是 Keyboard Maestro + Karabiner Elements 的组合。Keyboard Maestro 用来定义一些系统通知、快捷指令、Text snippet、 Clipboard History、App 唤起等功能，Karabiner Elements 主要用来做一些 Key mapping Or Key combination

> Hyper key: Command + Shift + Option + Ctrl

我将 Mac 上将相对无用的 Caps Lock 换成了 Hyper key，例如唤起 Wecom、WeChat、Chrome、Vscode、Terminal、Search Panel 等等应用的快捷操作是通过 `Hyper key + [指定按键]`来实现的，为了避免快捷键冲突（每一个软件都有自己的快捷键设置）简单来说 `Command + Shift + Option + Ctrl + C` 是我用来快速唤起或者将 Chrome 展示在屏幕最上层的操作，现在我只需要 `Caps Lock + C`

---

## Karabiner Elements 失灵了

莫名其妙...

嗯？安全组又推送了新的安全软件 ForcePoint，大概率有关，可恶

遇事不决 Reinstall<br>
无效<br>
换版本<br>
无效<br>

不管之前为什么不灵，现在重新安装不灵的原因主要是无法唤起系统设置中被 Block 的 Allow 选项

=> Open Security & Privacy System Preferences

## Driver

If macOS failed to load the driver in the early stage, the allow button might be not shown on Security & Privacy System Preferences.
In this case, you need to reinstall the driver in order for the button to appear.
How to reinstall driver:

1. 🌟 Deactivate driver (The administrator password will be required.). ✅

2. 🌟 Restart macoS. ✅

3. 🌟 Activate driver ❌

```shell
Activation was failed. (error: 1)
```

重启电脑重新激活驱动报了一个完全没意义的错，在 Karabiner Elements 官方文档 [Documentation/Help/Troubleshooting](https://karabiner-elements.pqrs.org/docs/help/troubleshooting/allow-button-does-not-appear/) 找到一个解：

**Reason：**
The exact cause of the issue has not been determined, but it may be caused by the corrupted system cache by a macOS issue.

This issue may be resolved by starting macOS in safe mode to refresh the system cache.

**Steps：**

1. 🌟 Restart your Mac in safe mode by this instruction. ✅
2. 🌟 Open Karabiner-Elements from Launchpad to ensure that Allow button is shown on System Settings. ✅
3. 🌟 Open System Settings and confirm the Allow button is shown. If the Allow button is hidden, close System Settings and open it again. ❌
4. 🌟 Click the Allow button.
5. 🌟 Restart your Mac and boot in normal mode.

如果可以这么简单就解决我也不会写一篇文章，这个问题最终花了我两三个小时才定位<br>
怀疑系统缓存损坏，要进安全模式处理，在 Mac 的安全模式下依然无法触发 Allow 选项，那就没坏呗

## Activation was failed. (error: 1)

现在我决定把重点放在上面激活驱动的那个错误上，是错误就得给我一个原因吧？我不要`Activation was failed. (error: 1)`这种毫无语义的错

```bash
systemextensionsctl list
```

确认已经加载的系统拓展中确实没有 KE 相关内容，命令行尝试激活一下：

```
/Applications/.Karabiner-VirtualHIDDevice-Manager.app/Contents/MacOS/Karabiner
-VirtualHIDDevice-Manager activate
```

activation of org.pars.Karabiner-DriverKit-VirtualHIDDevice is requested request of org.pars.Karabiner-DriverKit-VirtualHIDDevice is failed with error: T he operation couldn't be completed. (OSSystemExtensionErrorDomain error 10.)

终于来了一些有意义的内容了：`OSSystemExtensionErrorDomain error 10.`

> OSSystemExtensionErrorDomain error 10 is forbiddenBySystemPolicy. So, loading new driver is blocked by some system policy.

显然和系统的权限策略有关，毕竟是公司的 Mac，联系了安全组的同学将 XDR 停止保护、卸载 ForcePoint

哪有这么简单解决的好事，ReInstall 依然不行，现在有点头秃，但是我知道排查的方向肯定是对的

## Profile

公司的 Mac 统一都是听过 MDM 管理的，所以很有可能就是 MDM 传递的 Profile 文件导致相关的权限限制

> A device profile (System Preferences > Profiles) sent by the MDM that blocks both a) any System Extension / TeamID that is not listed in the profile and b) the ability of a user to manually allow a System Extension of their own choosing.

### Step 1) 是否受 MDM 控制

输出当前 Mac 的 Profile 清单：

```bash
sudo profiles list -output stdout-xml > ~/Documents/ohno.txt
code ~/Documents/ohno.txt
```

- 配置中存在相关的 ServerURL 配置了公司的 MDM 服务器
- PayloadDescription 下存在相关的 MDM Settings

### Step 2) 找到相关的影响的 Profile

_这里其实因为我猜测大概率是新推送的 ForcePoint 导致所以很快就确认了_

1. 找到 system-extension-policy 相关的 AllowUserOverrides 配置（如果没有 system-extension-policy 相关的配置说明和该原因无关）
2. 确认存在 `<false />` tag

确认是当前这个 ForcePoint Profile 导致 Mac 禁止新的扩展（设置中无法出现允许打开软件的 Allow 按钮）

```xml
<dict>
  <key>AllowUserOverrides</key>
  <!-- Pay attention to ⬇️ -->
  <false/>
  <key>AllowedSystemExtensionTypes</key>
  <dict>
    <key>******</key>
    <array>
      <string>EndpointSecurityExtension</string>
      <string>NetworkExtension</string>
    </array>
  </dict>
  <key>AllowedSystemExtensions</key>
  <dict>
    <key>******</key>
    <array>
      <string>com.forcepoint.ne</string>
    </array>
  </dict>
  <key>RemovableSystemExtensions</key>
  <dict>
    <key>******</key>
    <array>
      <string>com.forcepoint.ne</string>
    </array>
  </dict>
</dict>
```

## Fixed

联系安全相关同学临时删除我的设备上相关 Profile 后再重新安装 Karabiner Elements 已经可以正常唤起隐私安全中的 Allow Button（相关 Profile 可能需要向厂商提交修改申请）

一切好起来了
