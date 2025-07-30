# kkFileView

kkFileView为文件文档在线预览解决方案，该项目使用流行的spring boot搭建，易上手和部署，基本支持主流办公文档的在线预览，如doc,docx,xls,xlsx,ppt,pptx,pdf,txt,zip,rar,图片,视频,音频等等

> [kkFileView - 在线文件预览](https://www.kkview.cn/zh-cn/index.html)

# Docker 构建

[kkFileView - 在线文件预览 - 编译指南](https://www.kkview.cn/zh-cn/docs/build.html)

下载 kkfile：[kekingcn/kkFileView: Universal File Online Preview Project based on Spring-Boot](https://github.com/kekingcn/kkFileView)

在 Release 页可以看到，github 进提供了源码，安装包需要社区获取：

> kkFileView-4.4.0.zip (Windows版)
> kkFileView-4.4.0.tar.gz (Linux或MacOS版)
> kkFileView-4.4.0-docker_x64.tar (x86架构Docker离线文件版)
> kkFileView-4.4.0-docker_arrch.tar (arm64架构Docker离线文件版)
>
> 以上安装包请加入 [kk开源社区](https://t.zsxq.com/09ZHSXbsQ) 获取

所以，自行构建吧，首先下载源码，文档结构：

```
$ tree -L 2
.
|-- Dockerfile
|-- LICENSE
|-- README.cn.md
|-- README.md
|-- doc
|   |-- gitee\320\307\307\362.png
|   `-- github\320\307\307\362.png
|-- docker
|   `-- kkfileview-base
|-- pom.xml
`-- server
    |-- LibreOfficePortable
    |-- lib
    |-- pom.xml
    |-- src
    `-- target

8 directories, 8 files
```

### 1. 从码云仓库拉取代码

或者使用上述下载的源码

```bash
git clone https://gitee.com/kekingcn/file-online-preview.git
```

### 2. 使用maven编译打包

对应主工程

```bash
cd file-online-preview
mvn clean package -DskipTests
```

### 3. 构建镜像kkfileview-base依赖镜像

对应 docker 目录

```
cd docker\kkfileview-base
docker build -t keking/kkfileview-base:v4.4.0 .
```

### 4. 使用docker构建镜像

对应主工程

```bash
docker build -t keking/kkfileview:v4.4.0 .
```

总之，需要进行一次 maven 构建，然后进行两次 docker 构建。

> [!TIP]
>
> 生产环境部署的几种方式：
>
> 1. 本地 maven 构建后，拷到服务器进行后续的 docker 构建
>
>    毕竟一般服务器是没有 maven 环境的
>
> 2. 本地 maven、docker构建后，docker save 镜像后到服务器 docker load
>
>    这个方式更好一些，服务器不需要准备 maven 环境，也不需要构建 kkfileview-base 镜像，同时一次构建可以在多个服务器快速部署（保持同架构即可，如 intel 和 海光 CPU 都是 x86_64 架构，是可以通用的）
