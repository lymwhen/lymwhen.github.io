# CefSharp

[CefSharp](https://cefsharp.github.io/) lets you embed Chromium in .NET apps. It is a lightweight .NET wrapper around the [Chromium Embedded Framework (CEF)](https://bitbucket.org/chromiumembedded/cef) by Marshall A. Greenblatt. About 30% of the bindings are written in C++/CLI with the majority of code here is C#. It can be used from C# or VB, or any other CLR language. CefSharp provides both WPF and WinForms web browser control implementations.

> [cefsharp/CefSharp: .NET (WPF and Windows Forms) bindings for the Chromium Embedded Framework (github.com)](https://github.com/cefsharp/CefSharp)
>
> [Home · cefsharp/CefSharp Wiki (github.com)](https://github.com/cefsharp/CefSharp/wiki)
>
> [CefSharp中文帮助文档 · cefsharp/CefSharp Wiki (github.com)](https://github.com/cefsharp/CefSharp/wiki/CefSharp中文帮助文档#1基础知识)

> [ooxxoo/CefSharp.MinimalExample: Minimal example of how the CefSharp library can be used (github.com)](https://github.com/ooxxoo/CefSharp.MinimalExample)

# 引入 CefSharp

项目 - 管理 NuGet 程序包

搜索 CefSharp，下载 `CefSharp.WinForms`

依赖 `CefSharp.Common`、`cef.redist.x64`、`cef.redist.x86`会被自动下载

> 官方文档建议：安装完NuGet包之后，关闭vs然后重新打开，避免VS自带的智能感知引用有问题

# 初始化浏览器

```c#
Browser browser = null;

private void InitBrowser(string bimUrl)
{
    browser = new Browser(bimUrl);
    browserPanel.Controls.Add(browser);
    browser.Dock = DockStyle.Fill;
    
    // 地址改变事件
    browser.AddressChanged += delegate (object sender, AddressChangedEventArgs args)
    {
        this.InvokeOnUiThreadIfRequired(() => {
            urlText.Text = args.Address;
        });
    };
    
    // 加载状态改变事件
    browser.LoadingStateChanged += delegate (object sender, LoadingStateChangedEventArgs args)
    {
        this.InvokeOnUiThreadIfRequired(() => { 
            if (!args.IsLoading)
            {
                loadingLabel.Visible = false;
            }
        });
    };
}
```

CefSharp 的事件在 CEF UI 线程中回调，而非程序 UI 线程，因此更新 UI 需要使用`InvokeOnUiThreadIfRequired`方法，在 UI 线程中执行 

```c#
public static class ControlExtensions
{
	/// <summary>
	/// Executes the Action asynchronously on the UI thread, does not block execution on the calling thread.
	/// </summary>
	/// <param name="control">the control for which the update is required</param>
	/// <param name="action">action to be performed on the control</param>
	public static void InvokeOnUiThreadIfRequired(this Control control, Action action)
	{
		if (control.InvokeRequired)
		{
			control.BeginInvoke(action);
		}
		else
		{
			action.Invoke();
		}
	}
}
```

# 不安全的 https 处理

在`InitBrowser`方法中加入

```c#
//忽略https证书的问题
var settings = new CefSettings();
settings.CefCommandLineArgs.Add("--ignore-urlfetcher-cert-requests", "1");
settings.CefCommandLineArgs.Add("--ignore-certificate-errors", "1");
//禁止启用同源策略安全限制，禁止后不会出现跨域问题
settings.CefCommandLineArgs.Add("--disable-web-security", "1"); 
Cef.Initialize(settings);
```

> [cefsharp中发起https请求显示(canceled)_火焰-CSDN博客_cefsharp https](https://blog.csdn.net/u010476739/article/details/103201191)

> [List of Chromium Command Line Switches « Peter Beverloo](https://peter.sh/experiments/chromium-command-line-switches/)

# 修改默认字体

> 低版本的 CefSharp 默认字体为宋体

```c#
public class Browser : ChromiumWebBrowser
{
    public Browser(string address)
        : base(address)
        {
            SetStyle(System.Windows.Forms.ControlStyles.AllPaintingInWmPaint, true);
            SetStyle(System.Windows.Forms.ControlStyles.ResizeRedraw, false);
            SetStyle(System.Windows.Forms.ControlStyles.OptimizedDoubleBuffer, true);
            //this.DownloadHandler = new DownloadHandler();
            //this.IsBrowserInitializedChanged += Browser_IsBrowserInitializedChanged;
            //this.RegisterJsObject("Test", this);
            //重写默认字体为微软雅黑
            BrowserSettings = new BrowserSettings();
            BrowserSettings.StandardFontFamily = BrowserSettings.SansSerifFontFamily = BrowserSettings.SerifFontFamily = BrowserSettings.FantasyFontFamily = BrowserSettings.FixedFontFamily = BrowserSettings.CursiveFontFamily = "Microsoft YaHei";
        }
}
```

> [Cefsharp 开源项目默认字体 - 简书 (jianshu.com)](https://www.jianshu.com/p/ab86ddf738ce)

# 支持 H.264 播放

> CefSharp 默认不支持 H.264 播放

用 NuGet 安装`cef.redist.x64.3.3239.1723`、`cef.redist.x86.3.3239.1723`

下载[leoparddne/CEFSharp.wpf.H.264: 添加对CEFSharp for wpf组件对H.264的支持 (github.com)](https://github.com/leoparddne/CEFSharp.wpf.H.264)，替换工程目录/Packages 下的`cef.redist.x64.3.3239.1723`、`cef.redist.x86.3.3239.1723`文件夹

> [leoparddne/CEFSharp.wpf.H.264: 添加对CEFSharp for wpf组件对H.264的支持 (github.com)](https://github.com/leoparddne/CEFSharp.wpf.H.264)

> 此版本貌似不支持 AnyCPU 和 x64，需要配置 x86 运行

# js 与 C# 交互

> [WinForm CefSharp 笔记一（入门篇）_爱莫能助-CSDN博客_cefsharp](https://blog.csdn.net/yh0503/article/details/86648682)

# 常用方法

```c#
// 加载
browser.Load(url);
// 刷新
browser.Reload();
// 开发者工具
browser.ShowDevTools();
```

# 打包

> vs 2019

### 安装 Microsoft Visual Studio Installer Projects 扩展

扩展 - 管理扩展

搜索`Microsoft Visual Studio Installer Projects`，安装

> 如果安装失败，可点击右侧`详细信息`，在网页下载插件后安装

### 创建 setup 项目

右键解决方案 - 添加 - 添加项目

搜索`setup`，选择`Setup Project`，创建完成后可在解决方案中看到`Setup`项目

### 添加文件

右键`Setup`项目 - View - 文件系统

右键`Application Folder` - Add - 文件

打开`\bin\x86\Release`目录，选择目录下所有文件 - 确定

> 一定要选择`文件`，添加所有文件，而不是`主输出`，不然 CefSharp.core.dll 报错

### 修改 .Net 版本

##### CefSharp 项目

右键 CefSharp 项目 - 属性 - 目标框架

##### Setup 项目

双击`Detected Dependencies/Microsoft .NET Framework`，点击`Launch Conditions`窗口的`.NET Framework`，属性窗口`Version`

### 修改默认安装路径

点击`Application Folder`，属性窗口`DefaultLocation`

### 修改生成的安装包名称

右键`Setup`项目 - 属性 - Output file name

### 安装时安装必备组件

右键`Setup`项目 - 属性 - Prerequisites

### 修改产品名称、作者等信息

`Setup`项目属性窗口

### 生成安装包

右键`Setup`项目 - 生成