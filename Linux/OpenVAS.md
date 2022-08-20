# OpenVAS

> OpenVAS is a full-featured vulnerability scanner. Its capabilities include unauthenticated and authenticated testing, various high-level and low-level internet and industrial protocols, performance tuning for large-scale scans and a powerful internal programming language to implement any type of vulnerability test.
> The scanner obtains the tests for detecting vulnerabilities from a [feed](https://www.greenbone.net/en/feed-comparison/) that has a long history and daily updates.
>
> OpenVAS has been developed and driven forward by the company [Greenbone Networks](https://www.openvas.org/) since 2006. As part of the commercial vulnerability management product family Greenbone Enterprise Appliance, the scanner forms the [Greenbone Community Edition](https://greenbone.github.io/docs/latest/background.html#architecture) together with other open-source modules.
>
> Read more about the history of OpenVAS [here](https://greenbone.github.io/docs/latest/background.html#history-of-the-openvas-project).
>
> OpenVAS 是一个全功能的漏洞扫描器。它的功能包括未经身份验证和经过身份验证的测试、各种高级和低级互联网和工业协议、大规模扫描的性能调整以及用于实施任何类型漏洞测试的强大内部编程语言。
>
> 扫描程序从具有悠久历史和每日更新的提要中获取用于检测漏洞的测试。
>
> OpenVAS 自 2006 年以来由 Greenbone Networks 公司开发和推动。作为商业漏洞管理产品系列 Greenbone Enterprise Appliance 的一部分，扫描仪与其他开源模块一起构成了 Greenbone 社区版。
>
> [OpenVAS - Open Vulnerability Assessment Scanner](https://www.openvas.org/)

# 镜像安装

折腾了一次，扫描报 Error

> [漏洞扫描工具OpenVas安装与使用详解 - 搁刀听雨 - 博客园 (cnblogs.com)](https://www.cnblogs.com/sniepr/p/14190588.html)

# kali 安装 OpenVAS

### 更新 kaili

```bash
vim /etc/apt/sources.list

deb https://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
deb-src https://mirrors.ustc.edu.cn/kali kali-rolling main non-free contrib
 
#阿里云
deb https://mirrors.aliyun.com/kali kali-rolling main non-free contrib
deb-src https://mirrors.aliyun.com/kali kali-rolling main non-free contrib
 
#清华大学
deb http://mirrors.tuna.tsinghua.edu.cn/kali kali-rolling main contrib non-free
deb-src https://mirrors.tuna.tsinghua.edu.cn/kali kali-rolling main contrib non-free
 
#浙大
deb http://mirrors.zju.edu.cn/kali kali-rolling main contrib non-free
deb-src http://mirrors.zju.edu.cn/kali kali-rolling main contrib non-free
```

> [Kali Linux 国内源 - AlexANSO - 博客园 (cnblogs.com)](https://www.cnblogs.com/R-S-PY/p/12949006.html)

```
apt-get update 
apt-get upgrade
apt-get dist-upgrade
apt-get clean
```

### 安装 OpenVAS

> [!NOTE]
>
> 有博主踩坑说需要改 postgresql，亲测改了貌似导致 configuration - post list 中的记录为空，可能最新版已经解决这个问题
>
> 端口 5432 改为 5433 。（我的是postgres 14 总之改成5433就对了）
>
> ```bash
> vim /etc/postgresql/(版本号)/main/postgresql.conf
> ```
>
> 重启服务
>
> ```sql
> systemctl start postgresql
> ```
> [kali上安装 OpenVas （避坑版）_weixin_42451330的博客-CSDN博客_kali openvas](https://blog.csdn.net/weixin_42451330/article/details/123254375)

> 有博主解决 configuration - scan config 列表为空：`Failed to find config 'daba56c8-73ec-11df-a475-002264764cea'`问题，是在安装之前彻底卸载 postgresql
>
> Well, solved my missing configus by dropping kali and openvas. Reinstalled kali from iso, then purged postgresql (
>
> 1. sudo apt-get --purge remove postgresql.
> 2. sudo apt-get purge postgresql*
> 3. sudo apt-get --purge remove postgresql postgresql-doc postgresql-common.
>    Then reinstalled gvm from scratch
>    [The Absolute Best Way To Install OpenVAS On Kali Linux 117](https://www.hackingloops.com/install-openvas-kali-linux/). or
>    1.sudo apt-get update
>    2.sudo apt install gvm
>    3.sudo gvm-setup
>    4.sudo gvm-start (It really was already started by step3)
>
> Wait 30 minutes for all the feed updates to appear and it works!
>
> Suspect that the main issue revolves around Postgres 13 to 14 conversion.
>
> [Unable to create scanner configs, and no default configs are provided - Greenbone Community Edition - Greenbone Community Portal](https://community.greenbone.net/t/unable-to-create-scanner-configs-and-no-default-configs-are-provided/7929/8)

```bash
apt install gvm
gvm-setup
gvm-start
gvm-check-setup
```

`gvm-setup`完成后会提示 admin 用户密码

```log
[+] Done
[*] Please note the password for the admin user
[*] User created with password '75b058c7-a34a-40dd-89fd-2e81f7a16542'.

[>] You can now run gvm-check-setup to make sure everything is correctly configured
```

直接修改密码：

```bash
gvmd --user=admin --new-password=123456
runuser -u _gvm -- gvmd --user=admin --new-password=123456
```

`gvm-start`完成后会提示浏览器地址：https://127.0.0.1:9392 

升级特征库

后续使用需用更新，有一说跟 configuration - scan config 列表为空：`Failed to find config 'daba56c8-73ec-11df-a475-002264764cea'`也有关系。

```
gvm-feed-update
```

> [kali上安装 OpenVas （避坑版）_weixin_42451330的博客-CSDN博客_kali openvas](https://blog.csdn.net/weixin_42451330/article/details/123254375)
>
> [Kali搭建GVM(OpenVAS) - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/512816528)
>
> [kali-linux-2021.2安装openvas（gvm），附上密码修改等命令_林超男的博客-CSDN博客_openvas修改密码](https://blog.csdn.net/qq_40846669/article/details/119034841)

### 问题

##### Failed to find port_list ‘33d0cd82-57c6-11e1-8ed1-406186ea4fc5‘

直接原因：configuration - port list 列表为空

按照踩坑博主的教程安装之前修改 postgresql 5432 端口导致，新版安装貌似已经不存在这个问题。不修改端口直接安装，问题解决。

> 有博主是在 /var/lib/gvm/data-objects/gvmd/版本号/port_lists 中发现没有文件，测试没有发现这种问题
>
> [GVM踩坑记录之 Failed to find port_list ‘33d0cd82-57c6-11e1-8ed1-406186ea4fc5‘_热热闹闹孤孤单单的博客-CSDN博客](https://blog.csdn.net/WSA1635/article/details/119256792)

##### Failed to find config 'daba56c8-73ec-11df-a475-002264764cea

直接原因：configuration - scan configs 列表为空

可能有几个原因：

1. gvm 不是最新版

```bash
apt update gvm
```

2. postgresql 不是最新版

亲测很有可能是这个原因，先彻底卸载 postgresql，然后直接安装 gvm

> 这个博主就是最终更新搞好的，可能就是更新了 postgresql
>
> [GVM(openVAS)中scan configs为空的问题解决_Atrix·M的博客-CSDN博客](https://blog.csdn.net/ArthasMenethil110/article/details/120260578)

3. 更新特征库

有博主说反复 setup 和更新特征库，不知有无作用

```bash
gvm-setup
gvm-feed-update
```

> [OpenVAS Failed to find config ‘daba56c8-73ec-11df-a475-002264764cea‘_娃娃啊哇哇的博客-CSDN博客](https://blog.csdn.net/csdn_NN/article/details/125431982)

4. 源中软件版本低，导致以上的安装、更新不到最新版

配置多个源

> [【2022KaliLinux】openvas/gvm 没有scan configs 或者是 scan config error “XXXXXXXXXXX”_zbossz的博客-CSDN博客](https://blog.csdn.net/weixin_54130714/article/details/125344745)
