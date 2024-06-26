# Markdown

> [慕课教程 - Markdown 简介](https://www.imooc.com/wiki/markdownlesson/markdownoverview.html)
>
> [Markdown Reference - Typora Support](https://support.typora.io/Markdown-Reference/)
>
> [基本撰写和格式语法 - GitHub Docs](https://docs.github.com/cn/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)

# 一级标题
```markdown
### 一级标题
```

---

### 三级标题
```markdown
### 三级标题
```

---

##### 五级标题
```markdown
##### 五级标题
```

---

**加粗**

```markdown
**加粗**
```

---

~~删除线~~

```markdown
~~删除线~~
```

---

> 引用
>
> 第二行

```markdown
> 引用
>
> 第二行
```

---

> [!NOTE]
>
> NOTE
```markdown
> [!NOTE]
>
> NOTE
```

> [!TIP]
>
> TIP
```markdown
> [!TIP]
>
> TIP
```

> [!WARNING]
>
> WARNING
```markdown
> [!WARNING]
>
> WARNING
```

> [!ATTENTION]
>
> ATTENTION
```markdown
> [!ATTENTION]
>
> ATTENTION
```

---

```java
// 代码
public static void main(String[] args) {

}
```

&#x60;&#x60;&#x60;java

public static void main(String[] args) {

}

&#x60;&#x60;&#x60;

行内代码

`xt.text`

```markdown
`xt.text`
```

---

表格

| tr1  | tr2  | 居左| 居中 | 居右|
| ---- | ---- | :-- |:---:|----:|
| td1  | td2  | td  | td  | td  |
| td3  | td4  | td  | td  | td  |

```markdown

| tr1  | tr2  | 居左| 居中 | 居右|
| ---- | ---- | :-- |:---:|----:|
| td1  | td2  | td  | td  | td  |
| td3  | td4  | td  | td  | td  |

```

---

[网页](https://github.com)

```markdown
[网页](https://github.com)
```

引用本工程文档：[工具/ffmpeg](工具/ffmpeg.md)

```markdown
[工具/ffmpeg - 推流](工具/ffmpeg.md)
```

引用本工程文档，定位到标题：[工具/ffmpeg - 推流](工具/ffmpeg.md#推流)

```markdown
[工具/ffmpeg - 推流](工具/ffmpeg.md#推流)
[工具/ffmpeg - 推流](工具/ffmpeg.md?id=推流)
```
> [!TIP]
>
> 链接中的`#`会自动转换为`?id=`

---

:dog:

```markdown
![图片](../con/test.png)
```

---

emoji shortcode: :dog:

```markdown
:dog:
```

> [!TIP]
>
> 或者直接输入，微软输入法按`i`

🤣

🥰

✅ Do this

☑️

❎

✔️

✖️

❌ Don't do this

---

分隔线

`---`

`***`

`___`

---

- 无序 1
- 无序 2
  - 无序 2.1

```markdown
- 无序 1
- 无序 2
  - 无序 2.1
```

---

1. 有序 1
2. 有序 2
   1. 有序 2.1

```markdown
1. 有序 1
2. 有序 2
   1. 有序 2.1
```
---

- [x] 任务 1
- [ ] 任务 2
  - [ ] 任务 2.1

```markdown
- [x] 任务 1
- [ ] 任务 2
  - [ ] 任务 2.1
```

---

<font color="#FF4081">HTML 样式</font>

```html
<font color="#FF4081">HTML 样式</font>
```



# 公式

> LaTeX 的数学模式有两种：行内模式 (inline) 和行间模式 (display)。前者在正文的行文中，插入数学公式；后者独立排列单独成行，并自动居中。
> 
> 在行文中，使用 $ ... $ 可以插入行内公式，使用 \\[ ... \\] 可以插入行间公式，如果需要对行间公式进行编号，则可以使用 equation 环境：
> 
> ```markdown
> \begin{equation}
> ...
> \end{equation}
> ```
>
> 行内公式也可以使用 \\(...\\) 或者 \begin{math} ... \end{math} 来插入，但略显麻烦。
无编号的行间公式也可以使用 \begin{displaymath} ... \end{displaymath} 或者 \begin{equation*} ... \end{equation*} 来插入，但略显麻烦。（equation* 中的 * 表示环境不编号）
>
> 也有 plainTeX 风格的 \$\$ ... \$\$ 来插入不编号的行间公式。但是在 LaTeX 中这样做会改变行文的默认行间距，不推荐。请参考我的回答。
>
> [Markdown/LaTeX数学符号、公式大全（一）](https://blog.csdn.net/weixin_43159148/article/details/88621318)
>
> [一份其实很短的 LaTeX 入门文档](https://liam.page/2014/09/08/latex-introduction/)
>
> [Latex常见符号对照表](https://blog.csdn.net/zgj926503/article/details/52757631)

### 一元二次方程求根公式
$$
ax^2 + bx + c = 0(a \neq 0)\\
判别式：\Delta = b^2 - 4ac\\
当\Delta \gt 0时，方程有两个不相等的实数根\\
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}\\
当\Delta = 0时，方程有两个相等的实数根\\
当\Delta \lt 0时，方程无实数解
$$

```markdown
$$
ax^2 + bx + c = 0(a \neq 0)\\
判别式：\Delta = b^2 - 4ac\\
当\Delta \gt 0时，方程有两个不相等的实数根\\
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}\\
当\Delta = 0时，方程有两个相等的实数根\\
当\Delta \lt 0时，方程无实数解
$$
```

### 上标、下标

上标符号：$x^2$  
下标符号：$y_1$  
组合符号：$a^{x^{2}+y^{2}}$  

```markdown
上标符号：$x^2$  
下标符号：$y_1$  
组合符号：$a^{x^{2}+y^{2}}$  
```

### 运算符

加减：$\pm$     
分数：$\frac{x}{y}$     
平均数符号：$\overline{xyz}$    
开二次方符号：$\sqrt x$       
开方符号：$\sqrt[3]{x+y}$   
对数符号：$\log(x) + log_2 10 + ln 7$  
极限符号：$\lim^{x \to \infty}_{y \to 0}{\frac{x}{y}}$  
极限符号：$\displaystyle \lim^{x \to \infty}_{y \to 0}{\frac{x}{y}}$  
求和符号：$\sum^{x \to \infty}_{y \to 0}{\frac{x}{y}}$  
求和符号：$\displaystyle \sum^{x \to \infty}_{y \to 0}{\frac{x}{y}}$  
积分符号：$\int^{\infty}_{0}{xdx}$  
积分符号：$\displaystyle \int^{\infty}_{0}{xdx}$ 
微分符号：`\partial`，如：$\frac{\partial x}{\partial y}$  
矩阵符号：$\left[ \begin{matrix} &1 &2 &\cdots &4 &5 &6 &\cdots &8\\ &\vdots &\ddots &\cdots &13 &14 &15 &\cdots &16\end{matrix} \right]$
```markdown
加减：$\pm$     
分数：$\frac{x}{y}$     
平均数符号：$\overline{xyz}$    
开二次方符号：$\sqrt x$       
开方符号：$\sqrt[3]{x+y}$   
对数符号：$\log(x) + log_2 10 + ln 7$ 
极限符号：$\lim^{x \to \infty}_{y \to 0}{\frac{x}{y}}$  
极限符号：$\displaystyle \lim^{x \to \infty}_{y \to 0}{\frac{x}{y}}$  
求和符号：$\sum^{x \to \infty}_{y \to 0}{\frac{x}{y}}$  
求和符号：$\displaystyle \sum^{x \to \infty}_{y \to 0}{\frac{x}{y}}$  
积分符号：$\int^{\infty}_{0}{xdx}$  
积分符号：$\displaystyle \int^{\infty}_{0}{xdx}$ 
微分符号：`\partial`，如：$\frac{\partial x}{\partial y}$  
矩阵符号：$\left[ \begin{matrix} &1 &2 &\cdots &4 &5 &6 &\cdots &8\\ &\vdots &\ddots &\cdots &13 &14 &15 &\cdots &16\end{matrix} \right]$
```

### 希腊字母

阿尔法：$\Alpha$，$\alpha$  
贝塔：$\Beta$，$\beta$  
伽玛：$\Gamma$，$\gamma$  
德尔塔：$\Delta$，$\delta$  
艾普西龙：$\Epsilon$，$\epsilon$  
捷塔：$\Zeta$，$\zeta$  
依塔：$\Eta$，$\eta$  
西塔：$\Theta$，$\theta$  
艾欧塔：$\Iota$，$\iota$  
喀帕：$\Kappa$，$\kappa$  
拉姆达：$\Lambda$，$\lambda$  
缪：$\Mu$，$\mu$  
拗：$\Nu$，$\nu$  
克西：$\Xi$，$\xi$  
欧麦克轮：$\Omicron$，$\omicron$  
派：$\Pi$，$\pi$  
柔：$\Rho$，$\rho$  
西格玛：$\Sigma$，$\sigma$  
套：$\Tau$，$\tau$  
宇普西龙：$\Upsilon$，$\upsilon$  
发艾：$\Phi$，$\phi$  
器：$\Chi$，$\chi$  
普赛：$\Psi$，$\psi$  
欧米伽：$\Omega$，$\omega$  

```markdown
阿尔法：$\Alpha$，$\alpha$  
贝塔：$\Beta$，$\beta$  
伽玛：$\Gamma$，$\gamma$  
德尔塔：$\Delta$，$\delta$  
艾普西龙：$\Epsilon$，$\epsilon$  
捷塔：$\Zeta$，$\zeta$  
依塔：$\Eta$，$\eta$  
西塔：$\Theta$，$\theta$  
艾欧塔：$\Iota$，$\iota$  
喀帕：$\Kappa$，$\kappa$  
拉姆达：$\Lambda$，$\lambda$  
缪：$\Mu$，$\mu$  
拗：$\Nu$，$\nu$  
克西：$\Xi$，$\xi$  
欧麦克轮：$\Omicron$，$\omicron$  
派：$\Pi$，$\pi$  
柔：$\Rho$，$\rho$  
西格玛：$\Sigma$，$\sigma$  
套：$\Tau$，$\tau$  
宇普西龙：$\Upsilon$，$\upsilon$  
发艾：$\Phi$，$\phi$  
器：$\Chi$，$\chi$  
普赛：$\Psi$，$\psi$  
欧米伽：$\Omega$，$\omega$  
```

### 转义

**\$Android_SDK**

```markdown
**\$Android_SDK**
```



# HTML/XML转义字符对照表&ASCII码对照表

> [HTML/XML转义字符对照表&ASCII码对照表_Haydroid的博客-CSDN博客_xml转义字符表](https://blog.csdn.net/haydroid/article/details/46380069)

### 特殊字符转义表

如：`&` -> `&#38;`或`&amp;`

| 字符                           | 十进制 | 转义字符 |
| :----------------------------- | :----- | :------- |
| "                              | \&#34;  | \&quot;   |
| &                              | \&#38;  | \&amp;    |
| <                              | \&#60;  | \&lt;     |
| >                              | \&#62;  | \&gt;     |
| 不断开空格(non-breaking space) | \&#160; | \&nbsp;   |

### 最常用的转义字符列表

如：`&` -> `&#38;`或`&amp;`

| 显示 | 说明           | 实体名称 | 十进制编号 |
| :--- | :------------- | :------- | :--------- |
|      | 半方大的空白   | \&ensp;   | \&#8194;    |
|      | 全方大的空白   | \&emsp;   | \&#8195;    |
|      | 不断行的空白格 | \&nbsp;   | \&#160;     |
| <    | 小于           | \&lt;     | \&#60;      |
| >    | 大于           | \&gt;     | \&#62;      |
| &    | &符号          | \&amp;    | \&#38;      |
| "    | 双引号         | \&quot;   | \&#34;      |
| ©    | 版权           | \&copy;   | \&#169;     |
| ®    | 已注册商标     | \&reg;    | \&#174;     |
| ™    | 商标（美国）   | \&trade;  | \&#8482;    |
| ×    | 乘号           | \&times;  | \&#215;     |
| ÷    | 除号           | \&divide; | \&#247;     |

### ASCII可显示字符

如：&#96; -> `&#96;`或`&#x60;`

| bin    | dec | hex | 符号        | bin    | dec | hex | 符号 | bin    | dec | hex | 符号 |
| --------- | ------ | -------- | ----------- | --------- | ------ | -------- | ---- | --------- | ------ | -------- | ---- |
| 0010 0000 | 32     | 20       | ␠ | 0100 0000 | 64     | 40       | @    | 0110 0000 | 96     | 60       | `    |
| 0010 0001 | 33     | 21       | !           | 0100 0001 | 65     | 41       | A    | 0110 0001 | 97     | 61       | a    |
| 0010 0010 | 34     | 22       | "           | 0100 0010 | 66     | 42       | B    | 0110 0010 | 98     | 62       | b    |
| 0010 0011 | 35     | 23       | #           | 0100 0011 | 67     | 43       | C    | 0110 0011 | 99     | 63       | c    |
| 0010 0100 | 36     | 24       | $           | 0100 0100 | 68     | 44       | D    | 0110 0100 | 100    | 64       | d    |
| 0010 0101 | 37     | 25       | %           | 0100 0101 | 69     | 45       | E    | 0110 0101 | 101    | 65       | e    |
| 0010 0110 | 38     | 26       | &           | 0100 0110 | 70     | 46       | F    | 0110 0110 | 102    | 66       | f    |
| 0010 0111 | 39     | 27       | '           | 0100 0111 | 71     | 47       | G    | 0110 0111 | 103    | 67       | g    |
| 0010 1000 | 40     | 28       | (           | 0100 1000 | 72     | 48       | H    | 0110 1000 | 104    | 68       | h    |
| 0010 1001 | 41     | 29       | )           | 0100 1001 | 73     | 49       | I    | 0110 1001 | 105    | 69       | i    |
| 0010 1010 | 42     | 2A       | *           | 0100 1010 | 74     | 4A       | J    | 0110 1010 | 106    | 6A       | j    |
| 0010 1011 | 43     | 2B       | +           | 0100 1011 | 75     | 4B       | K    | 0110 1011 | 107    | 6B       | k    |
| 0010 1100 | 44     | 2C       | ,           | 0100 1100 | 76     | 4C       | L    | 0110 1100 | 108    | 6C       | l    |
| 0010 1101 | 45     | 2D       | -           | 0100 1101 | 77     | 4D       | M    | 0110 1101 | 109    | 6D       | m    |
| 0010 1110 | 46     | 2E       | .           | 0100 1110 | 78     | 4E       | N    | 0110 1110 | 110    | 6E       | n    |
| 0010 1111 | 47     | 2F       | /           | 0100 1111 | 79     | 4F       | O    | 0110 1111 | 111    | 6F       | o    |
| 0011 0000 | 48     | 30       | 0           | 0101 0000 | 80     | 50       | P    | 0111 0000 | 112    | 70       | p    |
| 0011 0001 | 49     | 31       | 1           | 0101 0001 | 81     | 51       | Q    | 0111 0001 | 113    | 71       | q    |
| 0011 0010 | 50     | 32       | 2           | 0101 0010 | 82     | 52       | R    | 0111 0010 | 114    | 72       | r    |
| 0011 0011 | 51     | 33       | 3           | 0101 0011 | 83     | 53       | S    | 0111 0011 | 115    | 73       | s    |
| 0011 0100 | 52     | 34       | 4           | 0101 0100 | 84     | 54       | T    | 0111 0100 | 116    | 74       | t    |
| 0011 0101 | 53     | 35       | 5           | 0101 0101 | 85     | 55       | U    | 0111 0101 | 117    | 75       | u    |
| 0011 0110 | 54     | 36       | 6           | 0101 0110 | 86     | 56       | V    | 0111 0110 | 118    | 76       | v    |
| 0011 0111 | 55     | 37       | 7           | 0101 0111 | 87     | 57       | W    | 0111 0111 | 119    | 77       | w    |
| 0011 1000 | 56     | 38       | 8           | 0101 1000 | 88     | 58       | X    | 0111 1000 | 120    | 78       | x    |
| 0011 1001 | 57     | 39       | 9           | 0101 1001 | 89     | 59       | Y    | 0111 1001 | 121    | 79       | y    |
| 0011 1010 | 58     | 3A       | :           | 0101 1010 | 90     | 5A       | Z    | 0111 1010 | 122    | 7A       | z    |
| 0011 1011 | 59     | 3B       | ;           | 0101 1011 | 91     | 5B       | [    | 0111 1011 | 123    | 7B       | {    |
| 0011 1100 | 60     | 3C       | <           | 0101 1100 | 92     | 5C       | \    | 0111 1100 | 124    | 7C       | \|   |
| 0011 1101 | 61     | 3D       | =           | 0101 1101 | 93     | 5D       | ]    | 0111 1101 | 125    | 7D       | }    |
| 0011 1110 | 62     | 3E       | >           | 0101 1110 | 94     | 5E       | ^    | 0111 1110 | 126    | 7E       | ~    |
| 0011 1111 | 63     | 3F       | ?           | 0101 1111 | 95     | 5F       | _    |           |        |          |      |
