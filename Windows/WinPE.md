# WinPE

- [微PE工具箱 - 超好用的装机维护工具 (wepe.com.cn)](https://www.wepe.com.cn/)

# BIOS/启动项

一般的服务器都会在启动过程中显示BIOS和启动项快捷键，一般名称为：

BIOS名称：BIOS xxx、system config、system setting

启动项名称：Boot Manager、Boot Menu

> [!TIP]
>
> 选择启动分区（启动项）时，U盘启动项一般带着 U盘 厂商名称或者 USB 字样

### DELL服务器

BIOS：F2，启动项：F11

##### 从bios设置启动项

system config - boot settings，在下方可以配置启动项顺序，但这种方式貌似需要系统和 PE 同为 BIOS/UEFI 的一种，不然会启动出错

##### 从启动项菜单进入

按 F11，自检完成后，会出现图像界面，显示：

Normal Boot：正常启动

BIOS Boot Menu：bios启动项

UEFI Boot Menu：UEFI启动项

根据 PE 类型选择，然后选择启动的分区。