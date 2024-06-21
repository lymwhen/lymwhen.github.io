# Moonlight

##### 客户端：

Moonlight：[Moonlight Game Streaming: Play Your PC Games Remotely (moonlight-stream.org)](https://moonlight-stream.org/)

##### 串流服务：

Sunshine：供 Moonlight 使用的自建游戏串流服务。

官网：[LizardByte](https://app.lizardbyte.dev/?lng=en)

文档：[Sunshine documentation (lizardbyte.dev)](https://docs.lizardbyte.dev/projects/sunshine/en/latest/)

Shield：英伟达的串流服务，已经停止服务，而且 sunshine 的效果足够好，就不考虑了。

Steam Link：最大带宽 100M，而且实测手机效果非常好，但电视画面、声音延迟很大。

### 安装 Sunshine

下载安装包，一直下一步即可。

安装好后，打开开始菜单的 sunshine 或浏览器打开[https://localhost:47990/](https://localhost:47990/)，注意允许不安全的 https。

### 安装 Moonlight

moonlight 支持 PC、Android 等端。

##### 客户端设置

- 内网带宽 1000M的话，直接把码率拉到 150M，可以提高画面清晰度
- 如果客户端支持高刷新率，可以开启高刷，选择支持的刷新率

正常来说，就可以在手机上用虚拟手柄或者在电视上插入手柄串流游戏了。

- 按 xbox 的西瓜键可以打开 steam 大屏幕模式

### 添加非 steam 游戏到 steam

普通游戏：steam 左下角添加游戏...

xbox 游戏：下载 UWPHook，勾选游戏，比如地平线4，点击右下角`Export selected apps to steam`，重启 steam 后，可以在库中看到游戏。

# 串流到电视 + 手柄

问题历程😌

### 手柄连接电视 + moonlight

<!-- panels:start -->

<!-- div:left-panel -->

利用 Moonlight 自带的手柄功能，steam 游戏和 xbox 地平线4 都能正常，但是没有手柄震动。

结论：**Moonlight 模拟的是 xbox 360 手柄，而且依赖于 steam 输入，不支持震动。**

<!-- div:right-panel -->

> [!RESULT]
>
> - ✅ steam 大屏幕：moonlight
> - ✅ steam 游戏：moonlight
>   - ✖️ 震动
> - ✅ 非 steam 游戏：moonlight
>   - ✖️ 震动
> - ✅ 桌面：moonlight
>   - ✅ 自由运行游戏

<!-- panels:end -->

---

### 手柄连接电视 + virtualhere 

<!-- panels:start -->

<!-- div:left-panel -->

电视作为服务端，插手柄，PC 作为客户端，远程使用手柄。

steam 游戏和震动都正常，但 xbox 地平线4 识别不到手柄，似乎把手柄当键盘了

结论：**似乎 virtualhere 并不能完美的映射 xbox 手柄。**

<!-- div:right-panel -->

> [!RESULT]
>
> - ✅ steam 大屏幕：steam 输入
> - ✅ steam 游戏：steam 输入
>   - ✅ 震动
> - ✖️ 非 steam 游戏：手柄被识别为键盘
>   - ✖️ 震动
> - ✅ 桌面：steam 输入
>   - ✖️ 自由运行游戏：手柄被识别为键盘

<!-- panels:end -->

---

### 手柄连接 PC + steam 输入

<!-- panels:start -->

<!-- div:left-panel -->

使用 USB 延长线将手柄直接连接到 PC

steam 游戏和震动都正常，但 xbox 地平线4 手柄和键鼠冲突，不能正常控制。

结论：**steam 输入和 xbox 手柄冲突。**这个与延长线无关，**steam 输入和 非 steam 游戏有冲突**。

验证方式：游戏中推动右摇杆，屏幕上鼠标会移动，说明存在冲突。

<!-- div:right-panel -->

> [!RESULT]
>
> - ✅ steam 大屏幕：steam 输入
> - ✅ steam 游戏：steam 输入
>   - ✅ 震动
> - ❌ 非 steam 游戏：原生输入 + steam 输入冲突
>   - ✅ 震动
> - ✅ 桌面：steam 输入
>   - ❌ 自由运行游戏：原生输入 + steam 输入冲突

<!-- panels:end -->

---

### 手柄连接 PC + steam 输入（手柄）

<!-- panels:start -->

<!-- div:left-panel -->

作为上一问题的一个解决方案：

steam - 设置 - 控制器 - 非游戏控制器布局 - 桌面布局 - 编辑 - 点击当前按键布局 - 模板 - 选择手柄 - 应用布局。此时右摇杆应该不能控制鼠标了，测试 steam 游戏和 xbox 地平线4 游戏和震动都正常。

> [!TIP]
>
> 此处可以通过在 steam 添加非 steam 游戏的方式打开游戏。

结论：可以解决手柄和键鼠冲突，**但是会导致手柄无法控制鼠标操作游戏和 steam 之外的东西，因为这个操作依赖于 steam 控制器的非游戏桌面布局**

<!-- div:right-panel -->

> [!RESULT]
>
> - ✅ steam 大屏幕：steam 输入
> - ✅ steam 游戏：steam 输入
>   - ✅ 震动
> - ✅ 非 steam 游戏：原生输入
>   - ✅ 震动
> - ✖️ 桌面：steam 输入（手柄布局）无法控制桌面
>   - ✖️ 自由运行游戏

<!-- panels:end -->

---

### 手柄连接 PC + steam 输入 + sunshine 启停 steam

<!-- panels:start -->

<!-- div:left-panel -->

前两种连接方式都无法完整识别到 xbox one s 手柄，无法完美支持 xbox 地平线4 的震动，所以否决，只能采用最麻烦最原始的延长线方案了。:dog:，而且经过测试，10m 延长线几乎没有延迟，也算比较完美了。

经过多方查阅，无法完美兼容非 steam 游戏和 steam 键鼠输入，两者只能选其一，而 steam 输入是很不方便开启和关闭切换的，所以只能从 sunshine 上来解决了，在运行非 steam 游戏之前，强行停止 steam。

##### Desktop

由于采用手柄连接 PC，无法使用 Moonlight 的手柄输入，要控制电脑必须依赖 steam，所以此处要打开 steam。同时切换分辨率。

command

```cmd
C:\Program Files (x86)\Steam\Steam.exe
```



##### Forza Horizon 4

关闭 steam，切换分辨率，启动地平线4

do

```cmd
cmd /C "taskkill /f /im steam* 2>nul || exit /b 0"
```

> [!NOTE]
>
> 由于`taskkill`命令可能有没找到进程，返回非 0 退出代码，导致启动失败，所以需要设置退出代码：`exit /b 0`

> [!TIP]
>
> cmd 中`errorlevel`表示上一个命令的退出代码，0表示成功，非0表示失败。可以使用`exit /b 0`设置退出代码。
>
> ```cmd
> > taskkill /f /im steam*
> 错误: 没有找到进程 "steam*"。
> > echo %errorlevel%
> 128
> > ipconfig
> ...
> > echo %errorlevel%
> 0
> ```



<!-- div:right-panel -->

> [!RESULT]
>
> - ✅ steam 大屏幕：steam 输入
> - ✅ steam 游戏：steam 输入
>   - ✅ 震动
> - ✅ 非 steam 游戏：原生输入
>   - ✅ 震动
> - ✅ 桌面：steam 输入
>   - ❌ 自由运行游戏：原生输入 + steam 输入冲突

<!-- panels:end -->

---

### PC 连接手柄 + steam 输入（手柄） + 手柄伴侣

<!-- panels:start -->

<!-- div:left-panel -->

手柄伴侣：Controller Companion，能够替代 steam 输入（键鼠）进行桌面控制，且**可以用快捷键启用/停用，不会造成游戏时冲突**。

<!-- div:right-panel -->

> [!RESULT]
>
> - ✅ steam 大屏幕：steam 输入
> - ✅ steam 游戏：steam 输入/手柄伴侣
>   - ✅ 震动
> - ✅ 非 steam 游戏：原生输入/手柄伴侣
>   - ✅ 震动
> - ✅ 桌面：手柄伴侣
>   - ✅ 自由运行游戏：原生输入/手柄伴侣

<!-- panels:end -->

---

# Sunshine 配置

由于`PC 连接手柄 + steam 输入（手柄布局） + 手柄伴侣`方案已经不依赖 steam 输入（键鼠）了，所以不存在冲突，不再需要启动/关闭 steam。

##### Sunshine 中文

Configurations - lacate - 选择简体中文，重启 sunshine。

# ❌~~设置分辨率~~

启动串流时设置为客户端分辨率，关闭串流时恢复电脑分辨率。

do

```cmd
cmd /C D:\tools\qres\qres.exe /x:%SUNSHINE_CLIENT_WIDTH% /y:%SUNSHINE_CLIENT_HEIGHT%
```

undo

```cmd
cmd /C D:\tools\qres\qres.exe /x:2560 /y:1080
```

> [!NOTE]
>
> 使用 qres 工具实现。

# ✅切换虚拟显示器

效果：

- 串流时原物理显示器无显示，不会吵到眼睛
- 可以自由定制分辨率和帧率，秒杀各种显卡欺骗器

### 安装虚拟显示器

Virtual Display Driver 简称 VDD，可以安装一个虚拟显示器，自定义想要的分辨率和帧率，用于串流。

> 1. Download the latest version from the releases page, and extract the contents to a folder.
> 2. Copy `option.txt` to `C:\IddSampleDriver\option.txt` before installing the driver **(important!)**.
> 3. Right click and run the *.bat file **as an Administrator** to add the driver certificate as a trusted root certificate.
> 4. Don't install the inf. Open device manager, click on any device, then click on the "Action" menu and click "Add Legacy Hardware".
> 5. Select "Add hardware from a list (Advanced)" and then select Display adapters
> 6. Click "Have Disk..." and click the "Browse..." button. Navigate to the extracted files and select the inf file.
> 7. You are done! Go to display settings to customize the resolution of the additional displays. These displays show up in Sunshine, your Oculus or VR settings, and should be able to be streamed from.
> 8. You can enable/disable the display adapter to toggle the monitors.
>
> 1. 从发布页面下载最新版本，并将内容提取到文件夹中。
> 2. 在安装驱动程序之前将`option.txt`复制到`C:\IddSampleDriver\option.txt`（重要！）。
> 3. 右键单击并**以管理员身份**运行*. bat文件以将驱动程序证书添加为受信任的根证书。
> 4. 不要安装inf。打开设备管理器，单击任意设备，然后单击“操作”菜单并单击“添加旧版硬件”。
> 5. 选择“从列表中添加硬件（高级）”，然后选择显示适配器
> 6. 单击“从磁盘…”并单击“浏览…”按钮。导航到提取的文件并选择inf文件。
> 7. 你完成了！转到显示设置以自定义附加显示器的分辨率。这些显示器显示在阳光、您的Oculus或VR设置中，并且应该能够从中流式传输。
> 8. 您可以启用/禁用显示适配器以切换显示器
>
> [itsmikethetech/Virtual-Display-Driver: Add virtual monitors to your windows 10/11 device! Works with VR, OBS, Sunshine, and/or any desktop sharing software. (github.com)](https://github.com/itsmikethetech/Virtual-Display-Driver)

> [!TIP]
>
> 可以在`C:\IddSampleDriver\option.txt`中添加自己想要的分辨率和帧率🥰。

### 串流是切换虚拟显示器

按照 VDD 说的通过启用/禁用显示适配器以切换显示器，手动操作还是有些蛋疼，这时非常方便好用的 MultiMonitorTool 就很顶了

> [Enable/disable/configure multiple monitors on Windows (nirsoft.net)](https://www.nirsoft.net/utils/multi_monitor_tool.html)

利用`Sunshine`的`do` 和`undo`，在启动串流时，只启用虚拟服务器，结束串流时，只启用物理显示器，串流与用电脑两不误，美滋滋🥰。

do 脚本

```bash
@echo off
MultiMonitorTool.exe /enable LNX0000
MultiMonitorTool.exe /disable ACR067F
ping 127.0.0.1 -n 2 >nul
MultiMonitorTool.exe /SetMonitors "Name=LNX0000 Primary=1 Width=1920 Height=1080 DisplayFrequency=120"
exit 0
```

undo 脚本

```bash
@echo off
MultiMonitorTool.exe /enable ACR067F
MultiMonitorTool.exe /disable LNX0000
ping 127.0.0.1 -n 2 >nul
exit 0
```

> [!TIP]
>
> 在安装目录有一个 chm 文档。
>
> 控制最好用的命令是`/SetMonitors`，可以控制显示器所有参数。打开 exe，选中一个显示器，`Edit - Copy /SetMonitor Command`，可以复制他的`/SetMonitor`命令，非常方便：
>
> ```bash
> MultiMonitorTool.exe /SetMonitors "Name=Default_Monitor Primary=1 BitsPerPixel=32 Width=2560 Height=1080 DisplayFlags=0 DisplayFrequency=144 DisplayOrientation=0 PositionX=0 PositionY=0"
> ```
>
> `Name`参数决定了对哪一个显示器进行配置，可以是`Name`/`Short Monitor Id`/`Monitor Id`/`Serial Number(Name后面的数字)`等，实测序号会变动，使用短 id `Short Monitor Id`比较好，可以配置`Option - Copy /SetMonitor Command Mode - Use Short Monitor Id As Name`，这样上面复制的命令中的`Name`就是`Short Monitor Id`了。

# 启动 UWP

command

```cmd
E:\tools\UWPHook\UWPHook.exe Microsoft.SunriseBaseGame_8wekyb3d8bbwe!SunriseReleaseFinal ForzaHorizon4.exe
```

> [!TIP]
>
> UWP 应用的启动参数可以打开 UWPHook 查看。
>
> ![image-20240613194301018](assets/image-20240613194301018.png)

> [!NOTE]
>
> cmd 中打开 UWP 应用的方式还有：
>
> ```cmd
> explorer shell:AppsFolder\Microsoft.SunriseBaseGame_8wekyb3d8bbwe!SunriseReleaseFinal
> ```
>
> 但用这个命令无法正常串流启动游戏，提示受 DRM 保护的内容。
