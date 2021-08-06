# Microsoft Office

# jacob

> https://github.com/freemansoft/jacob-project

> Jacob is a Java library that lets Java applications communicate with Microsoft Windows DLLs or COM libraries. It does this through the use of a custom DLL that the Jacob Java classes communicate with via JNI. The Java library and dll isolate the Java developer from the underlying windows libraries so that the Java developer does not have to write custom JNI code.Jacob is not used for creating ActiveX plugins or other modules that live inside of Microsoft Windows applications.

jacob 可以在 java 中调用 DLL

### 集成

- 将`jacob.jar`导入到项目 
- 将`jacob-1.20-x64.dll`拷贝到`%JAVA_HOME%/jre/bin/`下

# Office VBA 参考

> https://docs.microsoft.com/zh-cn/office/vba/api/overview/excel

# VBA 对象浏览器

使用对象浏览器可以查看类成员、方法参数、返回值类型、枚举值等，可配合 VBA 参考文档查看

### 打开方式

Excel - 开发工具 - Visual Basic

在 VS 窗口中点击视图 - 对象浏览器

> Excel 帮助 - 搜索对象浏览器 - 查找有关使用 Visual Basic 编辑器的帮助
>
> 1. 在“**开发工具**”选项卡上，单击“**Visual Basic**”。
>
>    如果未能看到“**开发工具**”选项卡：
>
>    1. 单击“**文件**”>“**选项**”。
>    2. 单击“**自定义功能区**”，然后在“**主选项卡**”下，选中“**开发工具**”复选框。
>    3. 单击“**确定**”。
>
> 2. 在 Visual Basic 编辑器的“**帮助**”菜单上，单击“**Microsoft Visual Basic for Applications 帮助**”。
>
> 3. 如果未曾使用过 Excel VBA 帮助，系统将要求你选择想要在其中显示帮助的浏览器。
>
> 4. 在浏览器左窗格的“**Excel**”下，展开“**Excel VBA 参考**”。
>
> 5. 在左窗格中，浏览以查找需要查看其帮助的概念、过程或对象，或者在屏幕右上角的搜索框中键入一个查询。

### 如查看纸张方向 PageSetup.PaperSize 的值 XlPaperSize 枚举

在左侧找到 PageSetup，右侧出现 成员

在成员中找到并点击 PaperSize，下方出现 PageSize 的描述

> Property PaperSize As XlPaperSize
>     Excel.PageSetup 的成员

点击 XlPaperSize，可在左侧看到所有枚举

点击 xlPaperA3（A3 纸张），下方出现 xlPaperA3 的描述

> Const xlPaperA3 = 8
>     Excel.XlPaperSize 的成员

##### 设置纸张为 A3

```java
Dispatch.put(pageSetup, "PaperSize", new Variant(8));
```

