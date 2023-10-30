# ADB

> Android 调试桥 (`adb`) 是一种功能多样的命令行工具，可让您与设备进行通信。`adb` 命令可用于执行各种设备操作，例如安装和调试应用。`adb` 提供对 Unix shell（可用来在设备上运行各种命令）的访问权限。它是一种客户端-服务器程序，包括以下三个组件：
>
> - **客户端**：用于发送命令。客户端在开发机器上运行。您可以通过发出 `adb` 命令从命令行终端调用客户端。
> - **守护程序 (adbd)**：用于在设备上运行命令。守护程序在每个设备上作为后台进程运行。
> - **服务器**：用于管理客户端与守护程序之间的通信。服务器在开发机器上作为后台进程运行。
>
> `adb` 包含在 Android SDK 平台工具软件包中。您可以使用 [SDK 管理器](https://developer.android.google.cn/studio/intro/update?hl=zh-cn#sdk-manager)下载此软件包，该管理器会将其安装在 `android_sdk/platform-tools/` 下。如果您需要独立的 Android SDK 平台工具软件包，请[点击此处进行下载](https://developer.android.google.cn/studio/releases/platform-tools?hl=zh-cn)。
>
> 如需了解如何通过 `adb` 连接设备以供使用，包括如何使用 Connection Assistant 来排查常见问题，请参阅[在硬件设备上运行应用](https://developer.android.google.cn/studio/run/device?hl=zh-cn)。
>
> [Android 调试桥 (adb)  | Android 开发者  | Android Developers (google.cn)](https://developer.android.google.cn/studio/command-line/adb?hl=zh_cn)

### ADB 网络调试

##### 手机开启网络调试端口

```bash
adb tcpip 5555
```

> [!TIP]
>
> 可使用 app 开启网络调试：[ADB WiFi(com.rair.adbwifi) - 5.1.6 - 应用 - 酷安 (coolapk.com)](https://www.coolapk.com/apk/com.rair.adbwifi)

将手机与电脑连接到同一网络

##### 连接 ADB 设备

```bash
adb connect 192.168.3.62
# 关闭连接
adb disconnect 192.168.3.62
```

> [!TIP]
> 默认网络调试端口：5555



```bash
# adb设备列表
adb devices
# 进入shell
adb shell
adb -s 553cdf21 shell
```

### shell 命令

```bash
# root
su
# 所有应用列表
pm list package
# 停用应用
pm disable-user com.edu.xxx
# 启用应用
pm enable com.edu.xxx

# 启动activity
am start com.xxx.xxxx/.SplashActivity
# 查看前台activity
dumpsys activity | grep -i run
# 导出apk
pm path net.ossrs.flutter_live_example
package:/data/app/~~hPzRSKuT3wQJdF-_OdNwng==/net.ossrs.flutter_live_example-29dYs9vez7LfOG2uGvHNig==/base.apk
adb pull /data/app/~~hPzRSKuT3wQJdF-_OdNwng==/net.ossrs.flutter_live_example-29dYs9vez7LfOG2uGvHNig==/base.apk D:\test1\
/data/app/~~hPzRSKuT3wQJdF-_OdNwng==/net.ossrs.flutter_liv...le pulled, 0 skipped. 36.5 MB/s (44790407 bytes in 1.170s)

# 搜索包名
pm list package |findstr solid
# 应用授权
appops set --uid org.videolan.vlc MANAGE_EXTERNAL_STORAGE allow
# 屏幕截图
screencap /sdcard/screen.png
# 推送文件
adb push D:\test1\VLC-Android-3.5.4-armeabi-v7a_2.apk /sdcard/Download
# 拉文件
adb pull /sdcard/Download/VLC-Android-3.5.4-armeabi-v7a_2.apk D:\test1\
```

> 所有权限：[Manifest.permission  | Android Developers (google.cn)](https://developer.android.google.cn/reference/android/Manifest.permission)

> [!TIP]
>
> shell 命令也可以在不进入 shell 时使用`adb shell pm list package`执行

> [!NOTE]
>
> shell 执行禁用等命令时报错：`Error:java.lang.SecurityException:PermissionDenial:attempttochangecomponentstatefrompid=10941,uid=2000,packageuid=10040`，说明权限不足，需要 root 权限

> [adb查看手机中已安装的应用列表_夜瑾漠的博客-CSDN博客](https://blog.csdn.net/weixin_38515203/article/details/90718733)
>
> [Android通过adb shell命令查看当前与用户交互的前台Activity_IT先森的博客-CSDN博客_adb命令查看当前activity](https://blog.csdn.net/tkwxty/article/details/108484512)
>
> [ADB - 无需root禁用系统APP+关闭系统应用广告 - Citrusliu - 博客园 (cnblogs.com)](https://www.cnblogs.com/citrus/p/12961113.html)
>
> [adb指令禁用软件_Android免root禁用系统应用（adb停用安卓系统应用）_Lo-FiGames的博客-CSDN博客](https://blog.csdn.net/weixin_28936835/article/details/111923940)
>
> [Android adb启动任意app的几种方式_Ang_qq_252390816的博客-CSDN博客_adb打开app](https://blog.csdn.net/ezconn/article/details/99885715)
>
> [adb 命令大全（简洁明了）adb命令启动应用_ihoudf的博客-CSDN博客_adb启动应用](https://blog.csdn.net/HDFQQ188816190/article/details/98599940)

### 网络叹号

```bash
# Android 7.0 之前
adb shell "settings put global captive_portal_server connect.rom.miui.com"

# Android 7.0 之后
adb shell "settings put global captive_portal_http_url http://connect.rom.miui.com/generate_204"
adb shell "settings put global captive_portal_https_url https://connect.rom.miui.com/generate_204"
```

然后打开飞行模式、关闭

> [一分钟解决类原生安卓系统wifi或移动网络叹号或叉叉 - 哔哩哔哩 (bilibili.com)](https://www.bilibili.com/read/cv16146843/)

### 出现假的模拟器 emulator offline

`adb devices`出现一个`offline`的模拟器

```bash
platform-tools>adb devices
List of devices attached
emulator-5570   offline
```

```bash
# 方法1，指定设备
adb -s 553cdf21 shell
# 方法2，关闭adb服务，清掉ADB设备列表
adb kill-server
adb devices
```

##### 方法3：彻底解决的办法

> 当您启动某个 `adb` 客户端时，该客户端会先检查是否有 `adb` 服务器进程已在运行。如果没有，它会启动服务器进程。服务器在启动后会与本地 TCP 端口 5037 绑定，并监听 `adb` 客户端发出的命令。
>
> **注意**：所有 `adb` 客户端均使用端口 5037 与 `adb` 服务器通信。
>
> 然后，服务器会与所有正在运行的设备建立连接。它通过扫描 5555 到 5585 之间（该范围供前 16 个模拟器使用）的奇数号端口查找模拟器。服务器一旦发现 `adb` 守护程序 (adbd)，便会与相应的端口建立连接。
>
> 每个模拟器都使用一对按顺序排列的端口：一个用于控制台连接的偶数号端口，另一个用于 `adb` 连接的奇数号端口。例如：
>
> 模拟器 1，控制台：5554
> 模拟器 1，`adb`：5555
> 模拟器 2，控制台：5556
> 模拟器 2，`adb`：5557
> 依此类推。
>
> 如上所示，在端口 5555 处与 `adb` 连接的模拟器与控制台监听端口为 5554 的模拟器是同一个。
>
> 服务器与所有设备均建立连接后，您便可以使用 `adb` 命令访问这些设备。由于服务器管理与设备的连接，并处理来自多个 `adb` 客户端的命令，因此您可以从任意客户端或从某个脚本控制任意设备。
>
> [adb 的工作原理 - Android 调试桥 (adb)  | Android 开发者  | Android Developers (google.cn)](https://developer.android.google.cn/studio/command-line/adb?hl=zh_cn#howadbworks)

根据文档描述，ADB服务会扫描 5555 到 5585 之间（该范围供前 16 个模拟器使用）的奇数号端口查找模拟器，即**占用 5555 到 5585 之间的奇数端口的程序，会被识别为模拟器，如果序列号为`emulator-5570`，那么它占用端口为 5571**。

```bash
platform-tools>adb devices
List of devices attached
emulator-5570   offline

# 查找占用5571端口的进程
netstat -ano | findstr 5571
```

例如通联支付的输入控件:dog:
