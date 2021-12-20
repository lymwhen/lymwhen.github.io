# CentOS

# 物理机安装

### 选择`install CentOS`安装报错

U盘盘符名称与安装脚本不一致

在`install CentOS`界面按e

将脚本中U盘盘符名称删除几位，与U盘一致，`ctrl+x`保存

# 设置静态IP

```bash
vim /etc/sysconfig/network-scripts/ifcfg-enp

BOOTPROTO=static
IPADDR="19.37.33.66 # 设置的静态IP地址
NETMASK="255.255.255.0" # 子网掩码 
GATEWAY="19.37.33.1" # 网关地址
DNS1="192.168.241.2"
DNS2="192.168.241.1"
ONBOOT="yes" # 开机启动
```

> 貌似可以不用引号
