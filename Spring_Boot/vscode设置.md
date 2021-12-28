# vscode 设置

插件：`Extension Pack for Java`、`Spring Boot Extension Pack`

```json
{
  "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-1.8",
      "path": "D:\\tools\\java\\jdk1.8.0_181",
      "default": true,
    },
    {
      "name": "JavaSE-11",
      "path": "C:\\Program Files\\Eclipse Adoptium\\jdk-11.0.13.8-hotspot",
    }
  ],
  // "java.home": "C:\\Program Files\\Eclipse Adoptium\\jdk-11.0.13.8-hotspot",
  "spring-boot.ls.java.home": "C:\\Program Files\\Eclipse Adoptium\\jdk-11.0.13.8-hotspot",
  "files.exclude": {
    "**/.classpath": true,
    "**/.project": true,
    "**/.settings": true,
    "**/.factorypath": true
  },
  "java.configuration.maven.userSettings": "D:\\tools\\apache-maven-3.8.3\\conf\\settings.xml",
  "redhat.telemetry.enabled": false,
  "security.workspace.trust.untrustedFiles": "open",
  "workbench.colorCustomizations": {
    "debugConsole.infoForeground": "#cccccc",
  },
}
```

# 需要 jdk11

> [Visual Studio Code 显示"需要 Java 11 或更新版本才能运行。请下载并安装最近的 JDK" - 堆栈溢出 (stackoverflow.com)](https://stackoverflow.com/questions/63043585/visual-studio-code-showing-java-11-or-more-recent-is-required-to-run-please-do)
>
> `Language Support for Java(TM) by Red Hat`和`Spring Boot Tools`需要的jdk版本为11
>
> Spring Tools Language Server requires Java 11 or higher to be launched. Current Java D:\tools\java\jdk1.8.0_181\bin\java.exe. (Note Java 8 can still be used in your own projects. Java 11 is only required to launch the Spring Tools Language Server process)
>
> Spring Tools Language Server 需要 Java 11 或更高版本才能启动。当前 Java D：toolsjavajdk1.8.0_181binjava.exe。（注意 Java 8 仍然可以在您自己的项目中使用。Java 11 只需要启动 Spring Tools Language Server 进程）

```json
{
  "spring-boot.ls.java.home": "C:\\Program Files\\Eclipse Adoptium\\jdk-11.0.13.8-hotspot",
}
```

### 在项目中使用 jdk8

```java
{
  "java.configuration.runtimes": [
    {
      "name": "JavaSE-1.8",
      "path": "D:\\tools\\java\\jdk1.8.0_181",
      "default": true,
    },
    {
      "name": "JavaSE-11",
      "path": "C:\\Program Files\\Eclipse Adoptium\\jdk-11.0.13.8-hotspot",
    }
  ],
}
```

pom.xml

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.6.2</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.chunshu</groupId>
	<artifactId>ydxy</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<packaging>war</packaging>
	<name>ydxy</name>
	<description>Demo project for Spring Boot</description>
	<properties>
		<java.version>8</java.version>
		<shiro.version>1.8.0</shiro.version>
	</properties>
</project>
```

### 在 idea 中运行项目

```
Abnormal build process termination: 
D:\tools\java\jdk1.8.0_181\bin\java.exe -Xmx2800m -Djava.awt.headless=true -Djava.endorsed.dirs=\"\" ...
Exception in thread "main" java.lang.NoSuchMethodError: org.apache.log4j.PropertyConfigurator.configure(Ljava/io/InputStream;)V
	at org.jetbrains.jps.cmdline.LogSetup.initLoggers(LogSetup.java:38)
	at org.jetbrains.jps.cmdline.BuildMain.<clinit>(BuildMain.java:47)
	at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
	at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.jetbrains.jps.cmdline.Launcher.main(Launcher.java:43)
```

##### File - Project Structure - SDKs

添加 jdk11

##### File - Project Structure - Project

`Project SDK`选择 11，`Project language level`选择 8

# 修改 vscode 配色

> [VSCode 修改工作区配色|极客教程 (geek-docs.com)](https://geek-docs.com/vscode/vscode-tutorials/vscode-modifies-workspace-colors.html)
>
> [Theme Color | Visual Studio Code Extension API](https://code.visualstudio.com/api/references/theme-color)
>
> You can customize your active Visual Studio Code [color theme](https://code.visualstudio.com/docs/getstarted/themes) with the `workbench.colorCustomizations` user [setting](https://code.visualstudio.com/docs/getstarted/settings).
>
> ```
> {
>   "workbench.colorCustomizations": {
>     "activityBar.background": "#00AA00"
>   }
> }
> ```
>
> **Note**: If you want to use an existing color theme, see [Color Themes](https://code.visualstudio.com/docs/getstarted/themes) where you'll learn how to set the active color theme through the **Preferences: Color Theme** dropdown (Ctrl+K Ctrl+T).
>
> Theme colors are available as CSS variables in [webviews](https://code.visualstudio.com/api/extension-guides/webview), and [an extension](https://marketplace.visualstudio.com/items?itemName=connor4312.css-theme-completions) is available which provides IntelliSense for them.

##### 修改调试控制台（Debug Console）info 颜色

默认 info 蓝色可读性太差

```json
{  
  "workbench.colorCustomizations": {
    "debugConsole.infoForeground": "#cccccc",
  },
}
```

# 其他设置

```java
{
  // 调试控制台不自动换行
  "debug.console.wordWrap": false,
}
```



# 操作

`SPRING BOOT DASHBOARD`：启动项目/java 类

`MAVEN`：maven 命令

`shift+alt+o`：import java 类

`shift+alt+f`：格式化

右键 - 源代码操作：类似 eclipse 右键 - source
