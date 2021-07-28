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

### 检查是否配置成功

打开 plsql，不填写连接信息，直接点 connect，如报监听异常（ORA-12560：TNS：...）说明配置成功

##### 异常解决

1. 64位的 plsql 应使用64位的 oracle 客户端
2. 如 oci 库已正确设置，但仍然报错，安装 VC++2013 后重试

# 设置环境变量

解决 plsql 中文显示为 ?，oracle 中设置的字符集为 ZHS16GBK，需通过环境变量设置 plsql 默认字符集

NLS_LANG：SIMPLIFIED CHINESE_CHINA.ZHS16GBK

# 连接数据库

输入用户名、密码

Database 填 ip:端口/服务名

如 192.168.3.88:1521/PLATFORM

# 数据库导出

### 用户对象（表结构、约束、视图、索引等）

Export User Objects

选择用户 YNTSJY_NEFLOW，选中上方加载出的所有表和视图

勾选 Include Storage、Single File

> 此处不要勾选权限和所有者，不然 sql 会带上所有者导致导入失败

选择保存位置 YNTSJY_NEFLOW.sql，点击 Export

### 数据

Export Tables

选择用户，YNTSJY_NEFLOW，选中上方加载的所有表

选择 PL/SQL Developer，选择导出位置 YNTSJY_NEFLOW_data.pbe

> PL/SQL Developer 导出格式为 pbe，支持 clob 数据
>
> SQL Inserts 应该类似 exp 方式，导出格式为 sql，不支持 clob 数据

Export

> 设置环境变量 NLS_LANG：SIMPLIFIED CHINESE_CHINA.ZHS16GBK 后，导出报 access violation at address 0c0758c6 in module 'OraOCIICUS11.dll'，我 tm 也没办法😥，用 Navicat 导出解决

# 数据库导入

### 用户对象

Import Tables

选择 SQL Inserts

选择 YNTSJY_NEFLOW.sql，点击 Import

> 如导出用户对象表空间与导入数据库的表空间名称不一致会报错（Use Command Window 方式可查看报错信息），此时应编辑 sql 文件，将创建表空间部分删除，修改创建表、索引使用的表空间

### 数据

Import Tables

选择 PL/SQL Developer

选择 YNTSJY_NEFLOW.sql，点击 Import