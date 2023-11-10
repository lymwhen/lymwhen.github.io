# Kodi skin-unity

Kodi 是一款相当强大的开源 TV 软件，包含了音乐、视频、电视、图片、游戏等功能，拥有强大的插件系统，且官方插件商店的插件都是免费且开源的，可玩性可以说是相当强了。

Unity 是一款设计相当前卫的皮肤，Material Design 风格，界面相当优美，还可以自定义菜单。

音乐使用 chen310 大佬的网易云插件[chen310/plugin.audio.music163: 网易云音乐 Kodi 插件 (github.com)](https://github.com/chen310/plugin.audio.music163)，在电视上用手机的 VIP，着实很爽，但播放界面有点操蛋：

- 打开播放页，歌曲信息和歌词叠加显示，歌词还有背景框:dog:，等一会才会只显示歌词，而且背景一片黑
- 返回关闭歌词，然后一片黑，再返回才退出播放页

用了 chen310 大佬修改的 Unity 皮肤[【图片】在 Kodi 中使用网易云音乐插件听歌【kodi吧】_百度贴吧 (baidu.com)](https://tieba.baidu.com/p/8021470008)：

- 歌词背景框没了
- 歌词居中
- 歌词有歌曲图片背景了

但：

- 打开播放页，歌曲信息和歌词叠加显示，等一会才会只显示歌词
- 返回关闭歌词，然后一片黑，再返回才退出播放页

看来大佬已经把难搞的部分搞好了，开源的么，整来看看能不能解决下剩余的问题。

zip 解包大佬修改的 skin.unity，打开代码一看，全是布局文件，拿界面中的文字去搜索，根本找不到，拿布局文件名去搜索，也是找不到，完全不知道是怎么调用的。。。

经过研究，玩明白的：

### 语法

歌曲封面图：`$INFO[MusicPlayer.offset(0).Cover]`

还有外面再套一层`$INFO[]`的，不知道是何意

逻辑表达式：

```java
// 与
Player.ShowInfo + Window.IsActive(MusicOSD)
// 或
Player.ShowInfo | Window.IsActive(MusicOSD)
// 嵌套
[Player.ShowInfo | Window.IsVisible(script-cu-lrclyrics-main.xml)] + Window.IsActive(MusicOSD)
```

设置项：`Skin.HasSetting(HideVisualizationFanart)`

是否有可视化插件：`String.IsEmpty(Window(Visualisation).Property(ArtistSlideshow.Image))`

歌曲控件是否显示：`Window.IsActive(MusicOSD)`

歌词是否打开：`Window.IsVisible(script-cu-lrclyrics-main.xml)`

### Window | 窗口

全部窗口：[Kodi Development: WindowIDs (xbmc.github.io)](https://xbmc.github.io/docs.kodi.tv/master/kodi-dev-kit/window_ids.html)

窗口是否可见：`Window.IsVisible(SelectDialog)`

### Control | 控件

```xml
<control type="image">
    <description>Fanart Image for Artist</description>
    <aspectratio>scale</aspectratio>
    <fadetime>400</fadetime>
    <animation effect="fade" start="0" end="100" time="400">WindowOpen</animation>
    <animation effect="fade" start="100" end="0" time="300">WindowClose</animation>
    <animation effect="fade" start="100" end="75" condition="Control.IsVisible(2)">Conditional</animation>
    <left>0</left>
    <top>0</top>
    <width>100%</width>
    <height>100%</height>
    <texture background="true">$INFO[MusicPlayer.offset(0).Cover]</texture>
    <visible>String.IsEmpty(Window(Visualisation).Property(ArtistSlideshow.Image)) + !Skin.HasSetting(HideVisualizationFanart)</visible>
</control>
```

居中：`<centerleft>50%</centerleft>`（中心距左边50%，可不就是居中么）

被显示时的动画：`<animation effect="fade" start="0" end="100" time="200">Visible</animation>`

被隐藏时的动画：`<animation effect="fade" start="100" end="0" time="200">Hidden</animation>`

全部属性：[Default control tags - Official Kodi Wiki](https://kodi.wiki/view/Default_control_tags)

> [Kodi Development: Skin Development (xbmc.github.io)](https://xbmc.github.io/docs.kodi.tv/master/kodi-dev-kit/skin_parts.html)

连官方都说皮肤复杂，可算是大概了解它怎么运作的了：页面操作逻辑、调用是程序固定的，皮肤只是可以修改界面、动画等，所以单纯从皮肤里，是找不到调用逻辑的

### 页面

播放页：`xml\MusicVisualisation.xml`

音乐控件：`xml\MusicOSD.xml`

歌词：`xml\script-cu-lrclyrics-main.xml`

# 播放页面的黑色改为歌曲封面

在播放页中可以看到这样一段：

```xml
<control type="visualisation" id="2">
    <description>visualisation</description>
    <left>0</left>
    <top>0</top>
    <width>100%</width>
    <height>100%</height>
    <visible>!String.IsEmpty(Visualisation.Name)</visible>
</control>
<control type="image">
    <description>Fanart Image for Artist</description>
    <aspectratio>scale</aspectratio>
    <fadetime>400</fadetime>
    <animation effect="fade" start="0" end="100" time="400">WindowOpen</animation>
    <animation effect="fade" start="100" end="0" time="300">WindowClose</animation>
    <animation effect="fade" start="100" end="75" condition="Control.IsVisible(2)">Conditional</animation>
    <left>0</left>
    <top>0</top>
    <width>100%</width>
    <height>100%</height>
    <texture background="true">$INFO[Player.Art(fanart)]</texture>
    <visible>String.IsEmpty(Window(Visualisation).Property(ArtistSlideshow.Image)) + !Skin.HasSetting(HideVisualizationFanart)</visible>
</control>
<control type="image">
    <aspectratio>scale</aspectratio>
    <fadetime>400</fadetime>
    <animation effect="fade" start="0" end="100" time="400">WindowOpen</animation>
    <animation effect="fade" start="100" end="0" time="300">WindowClose</animation>
    <animation effect="fade" start="100" end="75" condition="Control.IsVisible(2)">Conditional</animation>
    <left>0</left>
    <top>0</top>
    <width>100%</width>
    <height>100%</height>
    <texture background="true">$INFO[Window(Visualisation).Property(ArtistSlideshow.Image)]</texture>
    <visible>!String.IsEmpty(Window(Visualisation).Property(ArtistSlideshow.Image)) + !Skin.HasSetting(HideVisualizationFanart) + !Skin.HasSetting(DisableArtistSlideshow)</visible>
</control>
```

共有三个大小100%的控件

- 第一个是可视化
- 第二个是在可视化插件没有图片的情况显示个什么`Player.Art?`
- 第三个是在可视化插件有图片的情况显示可视化的图片

不知道可视化图片是个什么，就改第二个吧

```xml
<control type="image">
    <description>Fanart Image for Artist</description>
    <aspectratio>scale</aspectratio>
    <fadetime>400</fadetime>
    <animation effect="fade" start="0" end="100" time="400">WindowOpen</animation>
    <animation effect="fade" start="100" end="0" time="300">WindowClose</animation>
    <animation effect="fade" start="100" end="75" condition="Control.IsVisible(2)">Conditional</animation>
    <left>0</left>
    <top>0</top>
    <width>100%</width>
    <height>100%</height>
    <texture background="true">$INFO[MusicPlayer.offset(0).Cover]</texture>
    <visible>String.IsEmpty(Window(Visualisation).Property(ArtistSlideshow.Image)) + !Skin.HasSetting(HideVisualizationFanart)</visible>
</control>
```

这里显示着图，大佬改的歌词界面的图就没必要了，删掉这一段：

```xml
<control type="image">
    <description>background image</description>
    <top>-80</top>
    <width>100%</width>
    <height>100%</height>
    <aspectratio>scale</aspectratio>
    <animation effect="fade" start="0" end="100" time="300">WindowOpen</animation>
    <animation effect="fade" start="100" end="0" time="200">WindowClose</animation>
    <texture colordiffuse="C2AAAAAA">$INFO[MusicPlayer.offset(0).Cover]</texture>
</control>
```

这样已改效果就好多了

# 歌曲信息显示

![1699621350222](assets/1699621350222.png)

我更希望播放页面这样：

- 一直显示歌曲信息（默认或从歌词返回后）
- 显示歌词时隐藏歌曲信息

播放页往下找，可以看到这样一个控件

```xml
<control type="group">
    <centerleft>50%</centerleft>
    <top>283r</top>
    <width>1140</width>
```

观察里面的控件，包含了小封面、歌手、歌曲、时间等信息，这一块就是歌曲信息，他的`visible`属性为：

```java
[Skin.HasSetting(AlwaysShowMusicInfo) | Player.ShowInfo | Window.IsActive(MusicOSD)] + ![Window.IsVisible(AddonSettings) | Window.IsVisible(SelectDialog) | Window.IsVisible(VisualisationPresetList) | Window.IsVisible(PVROSDChannels) | Window.IsVisible(PVRChannelGuide) | Window.IsVisible(PVRRadioRDSInfo) | Window.IsVisible(Addon)]
```

逻辑是：皮肤设置了总是展示歌曲信息，或控件显示，或`Player.ShowInfo`，并且没有打开窗口时，显示歌曲信息，要修改这里就很简单了：

- 在显示的情况中添加歌词未显示
- 在隐藏的情况中添加歌词显示

```java
[Skin.HasSetting(AlwaysShowMusicInfo) | Player.ShowInfo | Window.IsActive(MusicOSD) | !Window.IsVisible(script-cu-lrclyrics-main.xml)] + ![Window.IsVisible(script-cu-lrclyrics-main.xml) | Window.IsVisible(AddonSettings) | Window.IsVisible(SelectDialog) | Window.IsVisible(VisualisationPresetList) | Window.IsVisible(PVROSDChannels) | Window.IsVisible(PVRChannelGuide) | Window.IsVisible(PVRRadioRDSInfo) | Window.IsVisible(Addon)]
```

### OSD 处理

经上述修改，测试发现，歌曲信息已经按预期显示隐藏，但控件部分不受控制，原因是**控件并未包含在上述的 control 中，而是独立的名为`MusicOSD`的控件**，以目前的掌握程度，这个控件的显示隐藏似乎很难去控制了（或者不能控制）。

既然如此，那就从它带来的影响着手解决了：小封面的高度 = 歌曲信息 + OSD，所以 OSD 隐藏掉后会很难看，解决办法：

- OSD 显示时，小封面的高度 = 歌曲信息 + OSD
- OSD 隐藏时，小封面的高度 = 歌曲信息

真是一个天才的想法🥰

复制一份小封面并修改位置大小信息：

```xml
<control type="image">
    <description>cover image</description>
    <left>-250</left>
    <top>-2</top>
    <width>263</width>
    <height>263</height>
    <visible>Window.IsActive(musicosd)</visible>
    <animation effect="fade" start="0" end="100" time="200">Visible</animation>
    <animation effect="fade" start="100" end="0" time="200">Hidden</animation>
    <texture fallback="DefaultAlbumCover.png">$INFO[MusicPlayer.offset(0).Cover]</texture>
    <aspectratio aligny="bottom">keep</aspectratio>
    <bordertexture border="8">ThumbShadow.png</bordertexture>
    <bordersize>8</bordersize>
</control>
<control type="image">
    <description>cover image</description>
    <left>-180</left>
    <top>-2</top>
    <width>193</width>
    <height>193</height>
    <visible>!Window.IsActive(musicosd)</visible>
    <animation effect="fade" start="0" end="100" time="200">Visible</animation>
    <animation effect="fade" start="100" end="0" time="200">Hidden</animation>
    <texture fallback="DefaultAlbumCover.png">$INFO[MusicPlayer.offset(0).Cover]</texture>
    <aspectratio aligny="bottom">keep</aspectratio>
    <bordertexture border="8">ThumbShadow.png</bordertexture>
    <bordersize>8</bordersize>
</control>
```

计算方式：PS 测量小封面高 247px（控件中`width`属性包含边框，所以不一致），歌曲信息高 177px，存在 70px 的差值，所以

- 宽高直接减去 70
- 小封面相对父控件左位置为负，更小的封面应该少负 70

后记：OSD 无法控制显示，但它内部的控件都在`MusicOSD`文件中，所以隐藏还是可以控制的