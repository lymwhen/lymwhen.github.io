# 安装 PLSQL

下载安装plsql

下载 Instant Client（plsql 只支持 32 位的 oracle 客户端）

> [Instant Client 下载 | Oracle 中国](https://www.oracle.com/cn/database/technology/instant-client.html)



# 设置 PLSQL 的 oci 库

首次打开 plsql，登录界面点取消

configure - Preferences 进入设置

在 connection 中设置

Oracle Home：G:\instantclient_12_2

OCI library：G:\instantclient_12_2\oci.dll

重启 plsql

# 连接数据库

输入用户名、密码

Database 填 ip:端口/服务名

如 192.168.3.88:1521/PLATFORM

