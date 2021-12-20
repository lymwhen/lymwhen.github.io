# WinForms



### 程序安装目录

`AppDomain.CurrentDomain.BaseDirectory`

```c#
public static string configIni = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "config.ini");
static IniUtils() {
    if (!File.Exists(IniUtils.iniPath))
        File.Create(IniUtils.iniPath);//创建INI文件
}
```



# C#

### 静态构造函数

```
class SimpleClass
{
    // Static constructor
    static SimpleClass()
    {
        //...
    }
}
```

> [C# 静态代码块（静态构造函数）_我是传奇-CSDN博客_c# 静态块](https://blog.csdn.net/gladyoucame/article/details/8601754)

