# VirtualBox

### 安装组件

安装 VirtualBox 时，选择所需要的组件

- 如果使用`桥接模式`，可只选桥接
- 如果使用`NAT`，需要选择`Host-Only`

> [!TIP]
>
> - 桥接模式：虚拟机桥接到网卡，直接连入局域网，与主机平级
> - NAT：网络地址转换，用于虚拟机上网
> - Host-Only：仅主机，用于虚拟机与主机互访

# 桥接模式

优点：

- 虚拟机与主机、其他虚拟机、局域网中的其他设备互访方便

缺点：

- 比较依赖于局域网，如果主机连入了另一个网络需要重新配置虚拟机 IP
- 有的网络可能不支持桥接

虚拟机设置 - 网络，选择桥接，选择主机联网的网卡

```properties
vim /etc/sysconfig/network-scripts/ifcfg-enp0s3

TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
DEFROUTE=yes
IPADDR="192.168.2.201"
NETMASK="255.255.255.0"
GATEWAY="192.168.2.1"
DNS1="114.114.114.114"
DNS2="4.2.2.1"
NAME=enp0s3
DEVICE=enp0s3
ONBOOT=yes

# 重启网卡
systemctl restart network
```

# NAT + Host-Only

通常虚拟机上网和与主机互访都是必要的，所以这两个一起使用，作为**虚拟机的两个网卡**。

### 配置全局 NAT 网络

管理 - 工具 - 网络管理器

![image-20240628160909392](assets/image-20240628160909392.png)

### 配置全局 Host-Only 网络

![image-20240628160950447](assets/image-20240628160950447.png)

### 设置虚拟机网卡

虚拟机设置 - 网络

网卡1

![image-20240628161124958](assets/image-20240628161124958.png)

网卡2

![image-20240628161146912](assets/image-20240628161146912.png)

### 配置虚拟机

```properties
ip addr
```

![image-20240628161413048](assets/image-20240628161413048.png)

可以看到，给虚拟机配置`NAT`和`Host-Only`两个网络（网卡）

- enp0s3：NAT 网络（192.168.2.0段），用于虚拟机上网，可以随便给它配置一个 ip，与主机互访用不到
- enp0s8：Host-Only 网络（192.168.3.0段），用于与主机互访，需要配置一个我们记得的 ip

> [!NOTE]
>
> 上述网络管理器 - Host-Only 的配置中，我们并没有启用 DHCP 服务器，所以默认不会有 Host-Only 网卡的 IP 地址。
>
> 当然我们可以启用 DHCP 服务器，这样主机就可以直接访问虚拟机了，只是我们更希望自己给它设置一个静态 IP，便于以后访问。各系统设置静态 IP 的方式参看下文。 

##### CentOS 7

```properties
vim /etc/sysconfig/network-scripts/ifcfg-enp0s3
```

enp0s3

```properties
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
DEFROUTE=yes
IPADDR="192.168.2.201"
NETMASK="255.255.255.0"
GATEWAY="192.168.2.1"
DNS1="114.114.114.114"
DNS2="4.2.2.1"
NAME=enp0s3
DEVICE=enp0s3
ONBOOT=yes
```

enp0s8

```properties
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
DEFROUTE=yes
IPADDR="192.168.3.201"
NETMASK="255.255.255.0"
NAME=enp0s8
DEVICE=enp0s8
ONBOOT=yes
```

> [!NOTE]
>
> Host-Only 模式对应的网卡`enp0s8`，不应改配置默认网关和 DNS 服务器，因为它仅仅用于跟主机通信。参看下面的问题版块。

> [!TIP]
>
> 如果在`/etc/sysconfig/network-scripts`下找不到对应网卡的配置文件，可以复制其他网卡的配置文件，**注意文件名后缀、`NAME`、`DEVICE`**与`ip addr`中的网卡名对应。

##### ubuntu 22.04.5

网卡配置文件位于`/etc/netplan/`下，名称各不一样，注意看它里面应该包含有 NAT 网卡`enp0s3`的配置。

```yml
sudo vim /etc/netplan/01-network-manager-all.yaml
# This file is generated from information provided by the datasource.  Changes
# to it will not persist across an instance reboot.  To disable cloud-init's
# network configuration capabilities, write a file
# /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg with the following:
# network: {config: disabled}
network:
    ethernets:
        enp0s3:
            dhcp4: true
        enp0s8:
            addresses:
              - 192.168.3.12/24
    version: 2
```

文件中有说明，该配置重启后会被覆盖，可以在`/etc/cloud/cloud.cfg.d/99-disable-network-config.cfg`中配置`network: {config: disabled}`

```bash
sudo /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg
network: {config: disabled}
```

不知两者能否同时生效，实测这样是生效的：

修改`99-disable-network-config.cfg` → 重启 → 修改`netplan`配置 → 重启

> [Ubuntu Server 22.04.5 LTS重启后IP被重置问题_ubuntu server修改ip地址重启恢复-CSDN博客](https://blog.csdn.net/hjl_and_djj/article/details/144293107)

##### 最终

主机访问虚拟机：192.168.3.201

虚拟机访问主机：192.168.3.1

> [VirtualBox 使用 NAT网络、仅主机（Host-only）网络 实现双网卡上网并与宿主机连接。_virtualbox host only-CSDN博客](https://blog.csdn.net/u010606397/article/details/115350392)

# 问题

### ssh 连接特别慢

```bash
sudo vi /etc/ssh/sshd_config
在 vi 中, 将注释掉的 #UseDNS=yes 改为 UseDNS=no
systemctl restart sshd
```

> [解决: ssh 远程登录虚拟机 Linux 速度很慢的问题 · Issue #136 · jwenjian/ghiblog (github.com)](https://github.com/jwenjian/ghiblog/issues/136)

### 虚拟机中已配置 Host-Only 静态 IP，但是主机连接不到，主机中也无法 ping 通自己（192.168.3.1）

可能是一段时间不用，各种配置出问题了，打开 VirtualBox - 管理 - 工具 - 网络管理器

- 将 Host-Only 网卡全部删除，然后重新配置
- 打开虚拟机网络配置，将 Host-Only 网卡取消勾选，保存，然后重新配置 Host-Only 网卡

### 虚拟机中网络慢，无法打开某些网址

```bash
# 测试情况比较诡异，百度通，但是github不通
curl https://www.baidu.com
curl https://github.com
```

虚拟机中 Host-Only 网卡不应该配置默认网关和 DNS，因为它仅用于跟主机通信。配置 IP 和子网掩码即可。