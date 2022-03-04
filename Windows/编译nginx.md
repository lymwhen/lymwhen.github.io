# 编译 nginx

> [Building nginx on the Win32 platform with Visual C](http://nginx.org/en/docs/howto_build_on_win32.html)

# 编译环境

官网环境要求：

> To build nginx on the Microsoft Win32® platform you need:
>
> Microsoft Visual C compiler. Microsoft Visual Studio® 8 and 10 are known to work.
>
> MSYS or MSYS2.
>
> Perl, if you want to build OpenSSL® and nginx with SSL support. For example ActivePerl or Strawberry Perl.
>
> Mercurial client.
>
> PCRE, zlib and OpenSSL libraries sources.

### MSVC 编译器

可以使用 Visual Studio Installer 安装，安装社区版 VS 2019（其他版应该也可以），工具选择`使用 C++ 的桌面开发`，组件应该至少选择：

- MSVC v142 - VS 2019 C++ x64/x86 生成工具
- Windows 10 SDK (10.0.19041.0)

> [!NOTE]
> 没有具体测试，如果不行就安装`使用 C++ 的桌面开发`中默认勾选的组件

##### 环境变量

Path

- C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Tools\MSVC\14.29.30133\bin\Hostx64\x64 **(nmake.exe等)**
- C:\Program Files (x86)\Windows Kits\10\bin\10.0.19041.0\x64 **(rc.exe)**
- C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\usr\bin **(sed.exe等)**

INCLUDE **(.h头文件)**

- C:\Program Files (x86)\Windows Kits\10\Include\10.0.19041.0\ucrt
- C:\Program Files (x86)\Windows Kits\10\Include\10.0.19041.0\um
- C:\Program Files (x86)\Windows Kits\10\Include\10.0.19041.0\winrt
- C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Tools\MSVC\14.29.30133\include
- C:\Program Files (x86)\Windows Kits\10\Include\10.0.19041.0\shared

LIB **(.lib库文件)**

- C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Tools\MSVC\14.29.30133\lib\x64
- C:\Program Files (x86)\Windows Kits\10\Lib\10.0.19041.0\um\x64
- C:\Program Files (x86)\Windows Kits\10\Lib\10.0.19041.0\ucrt\x64

### bash 工具

即 `MSYS or MSYS2`

可以使用 Git 中的 bash

### ActivePerl

> [ActivePerl Download](https://www.activestate.com/products/activeperl/downloads/)

根据网站的提示登录账号，复制命令到 CMD 中运行安装

### Mercurial client

Mercurial 是版本管理工具，用于下载 nginx 的源码

> [Mercurial Download](https://www.mercurial-scm.org/wiki/Download)

##### 环境变量

Path

- C:\Program Files\Mercurial **(hg.exe)**

### NASM

> [!NOTE]
> 据说64位下编译不需要，nginx官网也没有提及

> [Index of /pub/nasm/releasebuilds/2.14.02/win32](https://www.nasm.us/pub/nasm/releasebuilds/2.14.02/win32/)

##### 环境变量

Path

- D:\tools\nasm-2.14.02\

# 编译

以官网的 zlib, PCRE and OpenSSL 库为例

### 下载 nginx 源码

```bash
hg clone http://hg.nginx.org/nginx
```

### 在 nginx 目录下创建`objs/lib`，解压所需组件

```bash
mkdir objs
mkdir objs/lib
cd objs/lib
tar -xzf ../../pcre2-10.39.tar.gz
tar -xzf ../../zlib-1.2.11.tar.gz
tar -xzf ../../openssl-1.1.1m.tar.gz
```

### 运行配置脚本（在 bash 中）

```bash
auto/configure \
    --with-cc=cl \
    --with-debug \
    --prefix= \
    --conf-path=conf/nginx.conf \
    --pid-path=logs/nginx.pid \
    --http-log-path=logs/access.log \
    --error-log-path=logs/error.log \
    --sbin-path=nginx.exe \
    --http-client-body-temp-path=temp/client_body_temp \
    --http-proxy-temp-path=temp/proxy_temp \
    --http-fastcgi-temp-path=temp/fastcgi_temp \
    --http-scgi-temp-path=temp/scgi_temp \
    --http-uwsgi-temp-path=temp/uwsgi_temp \
    --with-cc-opt=-DFD_SETSIZE=1024 \
    --with-pcre=objs/lib/pcre2-10.39 \
    --with-zlib=objs/lib/zlib-1.2.11 \
    --with-openssl=objs/lib/openssl-1.1.1m \
    --with-openssl-opt=no-asm \
    --with-http_ssl_module
```

> [!TIP]
> 模块的格式为`--with-xxx=objs/lib/xxx`，文件夹名和版本要预命令相对应

### 编译

```bash
nmake
```

> [Additional MSVC build tools NMAKE reference Running NMAKE - Microsoft Docs](https://docs.microsoft.com/zh-cn/cpp/build/reference/running-nmake?view=msvc-170)

##### 64位编译 openssl 会报错

openssl 报错

```bash
NMAKE : fatal error U1077: “"C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Tools\MSVC\14.29.30133\bin\Hostx64\x64\cl.EXE"”: 返回代码“0x2”
Stop.
```

> 编辑 nginx/auto/lib/openssl，将`VC-WIN32`改为`VC-WIN64A`，将`ms\do_ms`改为`ms\do_win64a`
>
> ```bash
> 
> # Copyright (C) Igor Sysoev
> # Copyright (C) Nginx, Inc.
> 
> 
> all:
> 	cd $(OPENSSL)
> 
> 	perl Configure VC-WIN64A no-shared				\
> 		--prefix="%cd%/openssl" 				\
> 		--openssldir="%cd%/openssl/ssl" 			\
> 		$(OPENSSL_OPT)
> 
> 	if exist ms\do_win64a.bat (						\
> 		ms\do_win64a						\
> 		&& $(MAKE) -f ms\nt.mak					\
> 		&& $(MAKE) -f ms\nt.mak install				\
> 	) else (							\
> 		$(MAKE)							\
> 		&& $(MAKE) install_sw					\
> 	)
> ```
> 
> [nginx flv/rtmp/hls for Windows x64](https://www.jianshu.com/p/a429c87c1b04)

##### nginx-http-flv-module 报 `32 位移位的结果被隐式转换为 64 位`

```bash
ngx_rtmp_flv_module.c
objs/lib/nginx-http-flv-module/ngx_rtmp_flv_module.c(508): error C2220: 以下警告被视为错误
objs/lib/nginx-http-flv-module/ngx_rtmp_flv_module.c(508): warning C4334: “<<”: 32 位移位的结果被隐式转换为 64 位(是否希望进行 64 位移位?)
objs/lib/nginx-http-flv-module/ngx_rtmp_flv_module.c(521): warning C4334: “<<”: 32 位移位的结果被隐式转换为 64 位(是否希望进行 64 位移位?)
NMAKE : fatal error U1077: “"C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Tools\MSVC\14.29.30133\bin\Hostx64\x64\cl.EXE"”: 返回代码“0x2”
Stop.
```

> 修改 nginx/objs/Makefile，将“-WX”删除，否则nmake时会报错“nginx error:c2220:警告被视为错误 - 没有生成object文件”
> 
> ```bash
> CFLAGS =  -O2  -W3 -nologo -MT -Zi -Fdobjs/nginx.pdb -DFD_SETSIZE=1024 -DNO_SYS_TYPES_H
> ```
> [nginx flv/rtmp/hls for Windows x64](https://www.jianshu.com/p/a429c87c1b04)

> [!NOTE]
> 如果环境变量配置不正确，编译时会报错提示找不到`.h`/`.lib`/`.exe`文件，分别对应环境变量`INCLUDE`/`LIB`/`PATH`，**可以使用 Everything 搜索找不到的文件，将其所在文件夹添加到对应的环境变量中**
>
> [nmake 环境变量配置](https://blog.csdn.net/oqqsoap1234567/article/details/102980111)
> 
>
> 从古早以来，一直到现在，C/C++ 编译器都需要这三个环境变数。
> 
> ●以 Visual C++ 为例
> 
> 以 Visual C++ 为例，如果安装後的档案布局如下：
> 
> C:\MSDEV\VC98\BIN : 这里放有编译器 CL.EXE
> 
> C:\MSDEV\VC98\INCLUDE : 这里放有 C/C++ header files
> 
> C:\MSDEV\VC98\LIB : 这里放有 C/C++ standard libraries
> 如果你写的程式不只是单纯的 C/C++ 程式，还用到了 MFC，一样可以在 console mode 下编译，这时候你的环境变数应该如此设定：
> 
> set PATH=C:\MSDEV\VC98\BIN;C:\MSDEV\COMMON\MSDEV98\BIN
> 
> set INCLUDE=C:\MSDEV\VC98\INCLUDE;C:\MSDEV\VC98\MFC\INCLUDE
> 
> set LIB=C:\MSDEV\VC98\LIB;C:\MSDEV\VC98\MFC\LIB
> 
> 多指定了 MFC\INCLUDE 和 MFC\LIB，就可以让编译器和联结器找到 MFC 的 header files 和 libraries。如果你还需要用到 ATL，就得在 INCLUDE 环境变数中再加上 C:\MSDEV\VC98\ATL\INCLUDE。
> 
> =========================================
> 
> 我的VC++安装在D:\Program Files\Microsoft Visual Studio下，所以改写批次档如下：
> 
> set PATH=D:\Program Files\Microsoft Visual Studio\VC98\Bin;D:\Program Files\Microsoft Visual Studio\Common\MSDev98\Bin
> 
> set INCLUDE=D:\Program Files\Microsoft Visual Studio\VC98\Include;D:\Program Files\Microsoft Visual Studio\VC98\MFC\Include
> 
> set LIB=D:\Program Files\Microsoft Visual Studio\VC98\Lib;D:\Program Files\Microsoft Visual Studio\VC98\MFC\Lib
> 
> [我要用nmake来编译，问环境变量怎么设置](https://bbs.csdn.net/topics/340045118)

# nginx-http-flv-module

可以 rtmp 转 flv/hls/DASH

> [winshining/nginx-http-flv-module: Media streaming server based on nginx-rtmp-module. In addtion to the features nginx-rtmp-module provides, HTTP-FLV, GOP cache and VHOST (one IP for multi domain names) are supported now.](https://github.com/winshining/nginx-http-flv-module)

下载`nginx-http-flv-module`源码到 nginx/objs/lib下

`auto/configure` 命令中加上：

```bash
--add-dynamic-module=/objs/lib/nginx-http-flv-module
```

> 也可以使用 github 上开源的预构建，包含了常用的`zlib`/`pcre`/`openssl`和`nginx-http-flv-module`
>
> [AlfredWei/nginx-rtmp-httpflv-1.17.1-windows-prebuilt: A prebuilt windows x86 nginx binary with http-flv module added, support rtmp/http-flv stream](https://github.com/AlfredWei/nginx-rtmp-httpflv-1.17.1-windows-prebuilt)