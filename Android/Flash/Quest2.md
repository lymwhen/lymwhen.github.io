# Quest2

# 开发者模式

1. [进入页面](https://developer.oculus.com/manage/)，注册为开发者，组织名称自己看着设就行；
2. [进入页面](https://developer.oculus.com/downloads/package/oculus-adb-drivers/)，同意协议后即可下载驱动包；
3. **不要双击打开压缩包，请对着压缩包右键，将压缩包解压至单独文件夹**；
4. 进入解压出来的文件夹，找到`android_winusb.inf`，对着该文件右键，选择安装；
5. 在手机上打开Oculus应用：`设置` > `Oculus Quest xxx ▽` > `┅ 更多设置` > `开发者模式` > `打开开关`；
6. 使用手机的USB线（而不是Quest附送的）将Quest连接至电脑，并在VR中允许USB调试。

 如果你没有信用卡，也不用担心不能申请开发者，你可以让已经注册为开发者的玩家通过以下操作邀请你成为开发者：[点我打开页面](https://developer.oculus.com/manage/) → 左侧 `Members` → 右上 `Add Member`

# 网络连接受限

### Captive Portal

早先版本（50版本以前）：

```bash
# Android 7.0 之后
adb shell "settings put global captive_portal_http_url http://connect.rom.miui.com/generate_204"
adb shell "settings put global captive_portal_https_url https://connect.rom.miui.com/generate_204"
```

最新版本（59版本）

```bash
# 关闭检测
adb shell settings put global captive_portal_mode 0
```

> [【quest相关】解决quest2 更新后 无法投屏 wifi 网络受限问题_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1XB4y117e7/?vd_source=cfbed4eef00e94f603d6faffccca7c03)

### 系统时间

> [!NOTE]
>
> 这是很容易被忽略的点，长时间不使用 quest，时间会变慢、停滞，时间偏差太多网络认证会异常。就算没有显示网络连接受限，依然无法访问网络，浏览器访问网络报`NET::ERR_CERT_DATE_INVALID`，代理也无法正常使用。

```bash
adb shell am start -a android.intent.action.VIEW -d com.oculus.tv -e uri com.android.settings/.DevelopmentSettings com.oculus.vrshell/.MainActivity
```

在调出的安卓设置界面中设置时间，注意可能被别的窗口遮挡。

> [解决meta quest2时间对不上问题_codearena的博客-CSDN博客](https://blog.csdn.net/weixin_51585107/article/details/125065944)

# 投屏

最好用的投屏是 CastReceiver，可在此下载：[Android Apps & Games (APK) Free Download - FileCR](https://filecr.com/android/?id=885593410000)

> [!NOTE]
>
> 在局域网使用，在解决掉网络连接受限后，且没有使用代理才能正常使用。

