# MIX2S-win

> 官方教程：
>
> [安装教程 | Renegade Project (renegade-project.tech)](https://renegade-project.tech/zh/install)
>
> [【官方】在Mix2s等845设备上安装Win11的新方法~_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1PZ4y1Z7AZ/?vd_source=cfbed4eef00e94f603d6faffccca7c03)
>
> 其他非常有用的教程：
>
> [MIX2S刷入Windows11Arm教程 - Chr_小屋 (chrxw.com)](https://blog.chrxw.com/archives/2021/07/18/1582.html/comment-page-1?replyTo=623)
>
> [小米 MIX2S 安装 Windows 11 ARM64 双系统踩坑记录 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/577513622)



> 下载 ARM64 Windows 镜像：
>
> [uupdump.net](https://uupdump.net/known.php?q=windows+11)
>
> [UUP (Unified Update Platform) Generation Project (v2.4.18)](https://uup.rg-adguard.net/)
>
> [原版软件 (itellyou.cn)](https://next.itellyou.cn/Original/)

##### 亲测结果

仅测试了 MSDN 正式版镜像。

- Win11 22H2 + [2210.1-fix](https://github.com/edk2-porting/WOA-Drivers/releases/tag/2210.1-fix)/[v2.0rc2](https://github.com/edk2-porting/WOA-Drivers/releases/tag/v2.0rc2)：开机触屏无效
- Win11 21H2 + [2210.1-fix](https://github.com/edk2-porting/WOA-Drivers/releases/tag/2210.1-fix)：无法开机
- **Win11 21H2 + [v2.0rc2](https://github.com/edk2-porting/WOA-Drivers/releases/tag/v2.0rc2)/[v1.1](https://github.com/edk2-porting/WOA-Drivers/releases/tag/v1.1)：正常**

[2210.1-fix](https://github.com/edk2-porting/WOA-Drivers/releases/tag/2210.1-fix)是一个非常坑爹的驱动，我还以为是我的屏幕不是一个批次的呢:dog:

# 安装 USB 驱动

小米官方 USB 驱动：[图文详解小米手机驱动安装 (miui.com)](https://web.vip.miui.com/page/info/mio/mio/detail?postId=18464849&app_version=dev.20051)

或者通过 MiFlash 工具安装。

高通 USB 驱动（Qualcomm USB Driver）：[Qualcomm USB Driver (HS-USB QDLoader 9008) - Gsm Official](https://www.gsmofficial.com/qualcomm-usb-driver/)

# 备份基带

参看备份基带。

# 刷入 rec

```
fastboot flash recovery E:\flash\tools\recovery.img
```

> [!NOTE]
>
> 测试 TWRP 和 狐橙可以，LineageOS rec 没有`mkfs.fat`命令。
>
> 但 TWRP 测试无法解密 data，狐橙可以，所以用狐橙吧。

# 使用 parted 工具分区

手机重启到 rec

### 发送 parted 工具到手机

```bash
# push parted文件到手机
adb push E:\flash\tools\parted /tmp/

adb shell
chmod 755 /tmp/parted
```

### 取消挂载`data`下的分区

```bash
# 查看分区挂载情况
df -h
# 取消挂载分区，如
umount /data
umount /sdcard
```

> [!TIP]
>
> 如果`umount`提示：
>
> ```bash
> Device or resource busy
> ```
>
> 在 rec 中取消挂载

### 分区

查看分区情况

```bash
polaris:/tmp # parted /dev/block/sda
GNU Parted 3.2
Using /dev/block/sda
Welcome to GNU Parted! Type 'help' to view a list of commands.
(parted)
(parted) print
Model: TOSHIBA THGAF4G9N4LBAIRB (scsi)
Disk /dev/block/sda: 59.1GB
Sector size (logical/physical): 4096B/4096B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name        Flags
 1      24.6kB  41.0kB  16.4kB               switch
 2      41.0kB  73.7kB  32.8kB               ssd
 3      73.7kB  524kB   451kB                bk01
 4      524kB   786kB   262kB                bk02
 5      786kB   1049kB  262kB                bk03
 6      1049kB  1573kB  524kB                keystore
 7      1573kB  2097kB  524kB                frp
 8      2097kB  4194kB  2097kB               bk04
 9      4194kB  8389kB  4194kB               misc
10      8389kB  16.8MB  8389kB               logfs
11      16.8MB  33.6MB  16.8MB               oops
12      33.6MB  50.3MB  16.8MB               devinfo
13      50.3MB  67.1MB  16.8MB               bk05
14      67.1MB  134MB   67.1MB  ext4         persist
15      134MB   201MB   67.1MB  ext4         persistbak
16      201MB   268MB   67.1MB               logdump
17      268MB   403MB   134MB                minidump
18      403MB   1275MB  872MB   ext4         cust
19      1275MB  1342MB  67.1MB               recovery
20      1342MB  1611MB  268MB   ext4         cache
21      1611MB  59.1GB  57.5GB  ext4         userdata
```

在`userdata`分区中分出 windows 所需的`esp`和`系统分区`，剩下空间给`userdata`

> 64GB，留了800MB给ESP分区，留了40GB左右给Windows系统，~~留了4GB左右给PE系统~~，剩下7GB左右给安卓系统。

对于原来的`userdata`分区，可以修改大小（resizepart）或者删除（rm）

##### 删除

```
(parted) rm 21
```

##### 创建新分区

```bash
#创建820MB大小的esp分区，格式为fat32
mkpart esp fat32 1611MB 2500MB

#创建47GB大小的win分区，格式为NTFS
mkpart win ntfs 2500MB 50GB

#创建7GB大小的userdata分区，格式为ext4
mkpart userdata ext4 50GB 57.5GB

(parted) print
Model: TOSHIBA THGAF4G9N4LBAIRB (scsi)
Disk /dev/block/sda: 59.1GB
Sector size (logical/physical): 4096B/4096B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name        Flags
...
21      1611MB  2500MB  889MB   fat32        esp
22      2500MB  50.0GB  47.5GB  ntfs         win
23      50.0GB  57.5GB  7499MB  ext4         userdata

# 设置esp启动分区
set 21 esp on

(parted) print
Model: TOSHIBA THGAF4G9N4LBAIRB (scsi)
Disk /dev/block/sda: 59.1GB
Sector size (logical/physical): 4096B/4096B
Partition Table: gpt
Disk Flags:

Number  Start   End     Size    File system  Name        Flags
...
21      1611MB  2500MB  889MB   fat32        esp         boot, esp
22      2500MB  50.0GB  47.5GB  ntfs         win
23      50.0GB  57.5GB  7499MB  ext4         userdata
```

因为分区改变了，重启 rec，进入`adb shell`，格式化分区

```bash
#格式化esp分区
mkfs.fat -F32 -s1 /dev/block/by-name/esp
#格式化win分区
mkfs.ntfs -f /dev/block/by-name/win
#格式化userdata分区
mke2fs -t ext4 /dev/block/by-name/userdata
```

给 esp 分区添加标记

```bash
#添加esp标记，21是ESP分区的编号
set 21 esp on
```



# 刷入 Devcfg 分区

下载 Devcfg 文件：[设备 | Renegade Project (renegade-project.tech)](https://renegade-project.tech/zh/devices) 或 http://files.renegade-project.org/devcfg-polaris_FixTS.img

手机进入 fastboot

```bash
fastboot flash devcfg_ab E:\flash\tools\devcfg-polaris_FixTS_3.img
fastboot flash devcfg_a E:\flash\tools\devcfg-polaris_FixTS_3.img
fastboot flash devcfg_b E:\flash\tools\devcfg-polaris_FixTS_3.img
```

# 刷入 UEFI boot

下载 boot-polaris-v2.0rc2.img：[Renegade Project Download (renegade-project.tech)](https://download.renegade-project.tech/)

手机进入 fastboot

```bash
fastboot flash boot boot-polaris-v2.0rc2.img
```

> [!NOTE]
>
> 进行此步骤前，需要在 rec 备份 boot 分区，否则无法进入 Android

重启手机，将进入 UEFI 启动菜单

# 释放 Windows 镜像

### 进入大容量存储模式

使用音量键选择`UEFI Boot Menu`，接着选择`USB Attached SCSI (UAS) Storage` 以进入大容量存储模式。等待一会，电脑上将会出现多个磁盘分区。

### 释放映像

启动Dism++

`选项 - 详细设置`，勾选专家模式。

选择`文件 -> 释放镜像`，填入`映像路径` 和`安装路径` ，选中`添加引导`和`格式化`，然后点击确定。此时会提示会在xx磁盘xx分区添加引导，注意确认是上面分配的21分区。

映像路径：挂载 Windows ISO 镜像，选中里面的`sources/install.wim`文件

安装路径：系统分区（上面分配的大小约为 47G 的分区）

引导分区：esp分区（上面分配的大小约为 800M 的分区）

![image-20231023103146851](image-20231023103146851.png)

# 安装驱动

下载 WOA-Drivers：[Releases · edk2-porting/WOA-Drivers (github.com)](https://github.com/edk2-porting/WOA-Drivers/releases) 或 [Renegade Project Download (renegade-project.tech)](https://download.renegade-project.tech/)

打开 Dism++, **在面板上选择你的手机对应的系统**（请不要选择你的PC的C盘），然后点击`驱动管理 -> 添加驱动`，选择解压好的驱动文件夹，然后等待安装完成。

# 关闭驱动签名认证

### 设置 esp 分区卷标

```bash
diskpart
# 打印磁盘
DISKPART> list disk
# 选择手机对应的最大的磁盘，大概57G
DISKPART> select disk 7
# 打印分区
DISKPART> list part
# 选择esp分区（上面分配的21分区）
DISKPART> select part 21
# 设置卷标
DISKPART> assign letter=J 
DISKPART> exit
```



### 修改 esp 分区的 bcd 文件

```bash
cd /d J:\EFI\Microsoft\Boot
bcdedit /store BCD /set {default} testsigning on
bcdedit /store BCD /set {default} nointegritychecks on
```

> [!NOTE]
>
> 此处应用管理员 cmd，不然提示无权限。

# 进入 windows

强制关机，重启进入 windows 系统。大概8分钟后，进入引导界面。

### 跳过 OOBE

新版系统首次开机用户引导界面（OOBE）强制要求联网、登录微软账户，如果只想只使用本地账户，需要跳过 OOBE

在任意界面输入`shift`+`F10`，笔记本可能为`shift`+`Fn`+`F10`，打开命令行界面，输入：

```bash
OOBE\BYPASSNRO
```

等待设备自动重启。

> [!TIP]
>
> 触屏设备可以点击左下角或右下角的无障碍选项打开键盘。或者借助输入框打开键盘。

> [!NOTE]
>
> 在 OOBE 界面中不能连接网络，否则无法跳过登录微软账户。

### 关闭 Windows Defender

太占用 CPU

[Defender Control v2.1 (sordum.org)](https://www.sordum.org/9480/defender-control-v2-1/)

关闭后，观察任务管理器是否还有`Antimalware Service Executable`进程。

### 关闭 Windows 更新

亲测更新后，启动蓝屏

[Windows Update Blocker v1.8 (sordum.org)](https://www.sordum.org/9470/windows-update-blocker-v1-8/)

### 启用无密码远程连接

cmd `regedit`打开注册表编辑器，导航到**HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa**，再双击打开**“LimitBlankPasswordUse”**（若没有，则手动添加一项），将数值修改为0，重启系统。

> [win10 win11无密码远程桌面连接怎么设置 - Tank电玩&米多贝克 (mi-d.cn)](https://www.mi-d.cn/6114)

# 刷入 LineageOS

##### 备份 UEFI boot

进入 rec，备份 UEFI 的 boot。

由于刷入 Android 会格式化 data 分区，所以要将备份的 boot 拉到电脑上暂存：

```
adb pull /sdcard/Fox ./
```

在 adb 目录下，打开`Fox/BACKUPS`，下面会有一个备份的文件夹，将它改名为`Windows`

##### 刷入系统

开启 ADB Sideload，输入系统：

```bash
adb sideload xxx.zip
```

等待开机。

##### 备份 Android boot

进入 rec，备份 boot，将其改名为`Android`

##### 放回 UEFI boot 备份

将暂存的 UEFI boot 备份放回狐橙备份目录中

```bash
adb push ./Fox/BACKUPS/Windows /sdcard/Fox/BACKUPS
```

##### 利用 rec 切换启动的系统

此时 rec 第二个 tab 中，应该会显示`Android`、`Windows`两个备份，需要启动哪个系统，就还原哪一个即可。

# Simpleinit 启动菜单

> 目前`edk2-msm`内置了SimpleInit作为启动菜单，你可以通过修改`logfs`分区中的`simpleinit.static.uefi.cfg`来进行配置
>
> SimpleInit能自动检测到Windows并生成启动项，所以你不需要添加Windows启动项
>
> 目前仅有几款基于骁龙845的设备支持启动安卓
>
> [启动菜单 | Renegade Project (renegade-project.tech)](https://renegade-project.tech/zh/config/bootmenu)

##### 将 boot 分区导出到 esp 分区

进入 rec

如果此时的 boot 不是 Android boot，需要恢复它。

```bash
adb shell

# 挂载esp分区
mkdir /esp
mount /dev/block/by-name/esp /esp

# 提取boot分区到esp分区中
dd if=/dev/block/by-name/boot of=/esp/boot.img

# 挂载logfs分区
mkdir /logfs
mount /dev/block/by-name/logfs /logfs
exit

# 拉出logfs分区中的文件
adb pull /logfs ./
```

> [!TIP]
>
> 通过`df -h`可以看到，根目录`/`并未挂载在任何分区，所以再次创建的文件夹，重启之后需要重新创建。

在`logfs/simpleinit.static.uefi.cfg`文件中添加启动项配置

```nginx
# boot.default = "continue"
boot.default = "android-img"
boot.second = "simple-init"
boot.timeout = 10
boot.console_log = false
gui.guiapp.page = 1
language = "zh_CN"
logger {
    file_output = "@part_logfs:\\simpleinit.log"
    use_console = false
}
boot {
    // 默认启动项，请先删除simpleinit.uefi.cfg中的boot.default配置
    // default = "android"
    configs {
        // Recovery配置样例
        recovery {
            mode = "linux"
            desc = "Recovery"
            show = true
            enabled = true
            icon = "twrp.png"
            extra {
                use_uefi = false
                abootimg = "#part_rec"
                // boot镜像中的设备树model值，因设备而异，某些设备上能自动识别，从而不需要该项
                // 从/sys/firmware/devicetree/base/model读取
                dtb_model = "Xiaomi Technologies, Inc. Polaris P2 v2.1"
                // 指向下方locates配置中的dtbo分区，某些时候可能不需要
                // dtbo = "#part_dtbo"
                // dtbo id，因设备而异，某些时候可能不需要
                // dtbo_id = 6
            }
        }
        // 从文件启动安卓配置样例
        android-img {
            mode = "linux"
            desc = "Boot Android From File"
            show = true
            enabled = true
            icon = "distributor-logo-android.svg"
            extra {
                use_uefi = false
                // 从esp分区中的boot.img启动
                abootimg = "@part_esp:\\boot.img"
                dtb_id = 6
                // dtbo = "#part_dtbo"
                // boot镜像中的设备树model值，因设备而异，某些设备上能自动识别，从而不需要该项
                // 从/sys/firmware/devicetree/base/model读取
                dtb_model = "Xiaomi Technologies, Inc. Polaris P2 v2.1"
                // 指向下方locates配置中的dtbo分区，某些时候可能不需要
                // dtbo = "#part_dtbo"
                // dtbo id，因设备而异，某些时候可能不需要
                // dtbo_id = 6
            }
        }
    }
}
locates {
    part_boot {
        by_disk_label = "gpt"
        // 分区名
        by_gpt_name = "boot"
    }
    part_dtbo {
        by_disk_label = "gpt"
        by_gpt_name = "dtbo"
    }
    part_system {
        by_disk_label = "gpt"
        by_gpt_name = "system"
    }
    part_logfs {
        by_disk_label = "gpt"
        by_gpt_name = "logfs"
    }
    part_rec {
        by_disk_label = "gpt"
        by_gpt_name = "recovery"
    }
    part_esp {
        by_disk_label = "gpt"
        by_gpt_name = "esp"
    }
}
```

但是测试 LineageOS 21 无法进入，狐橙 rec 卡在启动画面。

所以改为不倒计时，直接启动 windows 吧，老老实实用 rec 切换系统：

```nginx
# -*- coding: utf-8 -*-
##
## Simple Init Configuration Store For UEFI
##

boot.default = "continue"
boot.second = "simple-init"
boot.timeout = 0
boot.console_log = false
gui.guiapp.page = 1

# vim: ts=8 sw=8

# language = "zh_CN"
```

将配置文件放回 logfs 分区：

```bash
adb shell
mkdir /logfs
mount /dev/block/by-name/logfs
exit

adb push ./logfs/simpleinit.static.uefi.cfg /logfs
```

