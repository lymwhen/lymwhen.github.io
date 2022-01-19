# sqlplus

# 安装 Instant Client

下载 Instant Client（plsql 只支持 32 位的 oracle 客户端）

> [Instant Client 下载 | Oracle 中国](https://www.oracle.com/cn/database/technology/instant-client.html)

至少下载 basic 和 sqlplus，下载后合并到一个文件夹

# 连接

```bash
E:\oracle\product\11.1.0\db_1\BIN>sqlplus /?

SQL*Plus: Release 11.1.0.6.0 - Production on 星期三 1月 19 15:34:38 2022

Copyright (c) 1982, 2007, Oracle.  All rights reserved.


SQL*Plus: Release 11.1.0.6.0 - Production

Copyright (c) 1982, 2007, Oracle.  All rights reserved.

使用 SQL*Plus 执行 SQL, PL/SQL 和 SQL*Plus 语句。

用法 1: sqlplus -H | -V

    -H             显示 SQL*Plus 版本和
                   用法帮助。
    -V             显示 SQL*Plus 版本。

用法 2: sqlplus [ [<option>] [<logon>] [<start>] ]

  <option> 为: [-C <version>] [-L] [-M "<options>"] [-R <level>] [-S]

    -C <version>   将受影响的命令的兼容性设置为
                   <version> 指定的版本。该版本具有
                   "x.y[.z]" 格式。例如, -C 10.2.0
    -F             为 RAC 环境启用故障转移模式。
    -L             只尝试登录一次, 而不是
                   在出错时再次提示。
    -M "<options>" 设置输出的自动 HTML 标记。选项
                   的格式为:
                   HTML [ON|OFF] [HEAD text] [BODY text] [TABLE text]
                   [ENTMAP {ON|OFF}] [SPOOL {ON|OFF}] [PRE[FORMAT] {ON|OFF}]
    -R <level>     设置受限模式, 以禁用与文件系统交互的
                    SQL*Plus 命令。级别可以
                   是 1, 2 或 3。最高限制级别为 -R 3, 该级别
                   禁用与文件系统交互的
                   所有用户命令。
    -S             设置无提示模式, 该模式隐藏
                   命令的 SQL*Plus 标帜, 提示和回显
                   的显示。

  <logon> 为: (<username>[/<password>][@<connect_identifier>] | /)
              [AS SYSDBA | AS SYSOPER | AS SYSASM] | /NOLOG | [EDITION=value]

    指定数据库帐户用户名, 口令和数据库连接
    的连接标识符。如果没有连接
    标识符, SQL*Plus 将连接到默认数据库。

    AS SYSDBA, AS SYSOPER 和 AS SYSASM 选项是数据库
    管理权限。

    <connect_identifier> 的形式可以是 Net 服务名
    或轻松连接。

      @[<net_service_name> | [//]Host[:Port]/<service_name>]

        <net_service_name> 是服务的简单名称, 它解析
        为连接描述符。

        示例: 使用 Net 服务名连接到数据库, 且
                 数据库 Net 服务名为 ORCL。

           sqlplus myusername/mypassword@ORCL

        Host 指定数据库服务器计算机的主机名或 IP
        地址。

        Port 指定数据库服务器上的监听端口。

        <service_name> 指定要访问的数据库的
        服务名。

        示例: 使用轻松连接连接到数据库, 且
                 服务名为 ORCL。

           sqlplus myusername/mypassword@Host/ORCL

    /NOLOG 选项可启动 SQL*Plus 而不连接到
    数据库。

    EDITION 指定应用程序
    版本的值

  <start> 为: @<URL>|<filename>[.<ext>] [<parameter> ...]

    使用将分配给脚本中的替代变量的指定参数
    从 Web 服务器 (URL) 或本地文件系统 (filename.ext)
    运行指定的 SQL*Plus 脚本。

在启动 SQL*Plus 并且执行 CONNECT 命令后, 将运行站点概要
文件 (例如, $ORACLE_HOME/sqlplus/admin/glogin.sql) 和用户概要文件
(例如, 工作目录中的 login.sql)。这些文件
包含 SQL*Plus 命令。

有关详细信息, 请参阅 SQL*Plus 用户指南和参考。
```

```bash
# 普通用户
sqlplus TEST/password
# 以管理员登录（SYS）
sqlplus TEST/password as sysdba
# 服务名登录
sqlplus TEST/password@ORCL
# 实例名登录
sqlplus TEST/password@orcl
# 远程服务名登录
sqlplus TEST/password@192.168.3.101/ORCL
# 远程管理员登录
sqlplus TEST/password@192.168.3.101/ORCL as sysdba
# 操作系统登录（服务器本地登录）
sqlplus / as sysdba
# 启动sqlplus而不连接到数据库
sqlplus /nolog
```

# 常用 SQL
```sql
-- 查询当前用户
select user from dual;
-- 修改某用户密码
alter user TEST identified by 123456;
-- 查看所有用户、表空间
select username,default_tablespace from dba_users;
-- 查看当前用户的所有表
select table_name from user_tables;
-- 查看某用户的所有表
select * from all_tab_comments where owner = 'TEST'
-- 修改某用户密码
alter user TEST identified by 123456;
-- 提交
commit;

-- 查看数据库版本
select * from v$version
-- 查看实例名（platform）
select instance_name from v$instance
-- 查看服务名（PLATFORM）
select global_name from global_name
```

# 创建表空间、用户

### 查询已有表空间信息

```sql
select * from dba_data_files;
```

### 创建表空间

```sql
# 如果不带 datafile 参数则创建在默认位置
create tablespace TEST2 
datafile 'E:\APP\ADMINISTRATOR\PRODUCT\11.1.0\DB_1\DATABASE\TEST2' 
size 10m autoextend on next 10m maxsize unlimited
```

### 	创建用户

```sql
create user TEST2 
identified by "password" 
default tablespace TEST2 
profile DEFAULT 
ACCOUNT UNLOCK;
```

### 	授权

```sql
-- 授予角色
grant dba to TEST2;
grant connect to TEST2;
grant resource to TEST2;
grant dba,connect,resource to TEST2;
-- 移除角色
revoke dba from TEST2;
```

> sid: 实例名
> 服务名：监听程序名字

# 备份

### 导出

```sql
 exp YQZHZX_OA/password@ORCL file=d:\test2.dmp owner=(YQZHZX_OA)
```

### 导入

```sql
imp YNYBJ_EFLOW_TEST/password@ORCL 
file=D:\test2.dmp full=y log=jss.log ignore=y rows=y
```

```sql
imp 'YNYBJ_EFLOW_TEST/password@192.168.1.124/PLATFORM as sysdba' 
file=E:\ynybj_oa_20201015.dmp full=y log=jss.log ignore=y rows=y
```

# 账户

```sql
-- 修改密码
alter user TEST identified by 123456;
-- 锁定
alter user TEST account lock;
-- 解锁
alter user TEST account unlock;
```

# 权限

> dba_sys_privs：系统权限，如`CREATE TABLE`
>
> dba_role_privs：拥有角色，如`CONNECT`
>
> dba_tab_privs：表权限，如`SELECT ON YNTSJY_NEFLOW.T_USER`

### 系统角色 CONNECT/RESOURCE 权限

```sql
SQL> select * from dba_sys_privs where grantee in ('RESOURCE','CONNECT') order by 1;

GRANTEE                        PRIVILEGE                                ADMIN_OPTION
------------------------------ ---------------------------------------- ------------
CONNECT                        CREATE SESSION                           NO
RESOURCE                       CREATE CLUSTER                           NO
RESOURCE                       CREATE INDEXTYPE                         NO
RESOURCE                       CREATE OPERATOR                          NO
RESOURCE                       CREATE PROCEDURE                         NO
RESOURCE                       CREATE SEQUENCE                          NO
RESOURCE                       CREATE TABLE                             NO
RESOURCE                       CREATE TRIGGER                           NO
RESOURCE                       CREATE TYPE                              NO

9 rows selected
```

### 用户 YNTSJY_NAPP 拥有角色

```sql
SQL> select * from dba_role_privs where grantee = 'YNTSJY_NAPP';

GRANTEE                        GRANTED_ROLE                   ADMIN_OPTION DEFAULT_ROLE
------------------------------ ------------------------------ ------------ ------------
YNTSJY_NAPP                    CONNECT                        NO           YES
YNTSJY_NAPP                    RESOURCE                       NO           YES
```

> CONNECT角色：仅具有创建SESSION的权限
>
> RESOURCE角色：仅具有创建CLUSTER,INDEXTYPE,OPERATOR,PROCEDEURE,SEQUENCE,TABLE,TRIGGER,TYPE的权限。同时，当把ORACLE resource角色授予一个user的时候，不但会授予ORACLE resource角色本身的权限，而且还有unlimited tablespace权限，但是，当把resource授予一个role时，就不会授予unlimited tablespace权限。
>
> 确实没有创建视图的权限，由此看来如果需要创建视图权限，只能单独授权：`GRANT CREATE VIEW TO 用户;`

> [ORACLE的CONNECT和RESOURCE角色权限 - 据说撸撸更健康 - 博客园 (cnblogs.com)](https://www.cnblogs.com/jsllgjk/p/3954006.html)

### 自建角色授权

##### 创建角色

```sql
SQL> create role ROLE_YNTSJY_WEB_APP not identified;

Role created.
```

> 如果创建带密码的角色，只能在登录后执行`set role ROLE_NAME identified by 123456;`使角色中的权限生效，仅作用于当前 session，所以<font color="#FF4081">如果仅通过该角色授予用户`CREATE SESSION`权限，该用户无法登录</font>

##### 授予系统权限

```
SQL> grant CREATE SESSION,CREATE TABLE,CREATE CLUSTER,CREATE SEQUENCE,CREATE PROCEDURE,CREATE TRIGGER,CREATE TYPE,CREATE OPERATOR,CREATE INDEXTYPE,CREATE VIEW,UNLIMITED TABLESPACE to ROLE_YNTSJY_WEB_APP;

Grant succeeded.
```

> = `CONNECT`+`RESOURCE`+`CREATE VIEW` +`UNLIMITED TABLESPACE`

> [Oracle权限一览表 - xuzhengzhu - 博客园 (cnblogs.com)](https://www.cnblogs.com/HondaHsu/p/3529719.html)
>
> 可通过`select * from dba_sys_privs where grantee in ('RESOURCE','CONNECT') order by 1;`查询系统角色的权限作参考

##### 授予其他用户表权限

```sql
grant select on YNTSJY_NEFLOW.T_COMMENT to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.T_DONE to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.T_FLOWPROCESS to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.T_FLOWRECORD to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.T_FLOWRECORDWORKITEM to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.T_GROUP to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.T_GROUPUSER to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.T_ORGANIZATION to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.T_ORGUNIT to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.T_TODO to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.T_USER to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.T_WORKITEM to ROLE_YNTSJY_WEB_APP;

grant select on YNTSJY_NEFLOW.V_E_GROUP to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.V_E_GROUPUSER to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.V_E_ORG to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.V_E_TXL to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.V_E_UNIT to ROLE_YNTSJY_WEB_APP;
grant select on YNTSJY_NEFLOW.V_E_USER to ROLE_YNTSJY_WEB_APP;

grant insert on YNTSJY_NEFLOW.T_GROUP to ROLE_YNTSJY_WEB_APP;
grant insert on YNTSJY_NEFLOW.T_GROUPUSER to ROLE_YNTSJY_WEB_APP;
grant insert on YNTSJY_NEFLOW.T_ORGANIZATION to ROLE_YNTSJY_WEB_APP;
grant insert on YNTSJY_NEFLOW.T_ORGUNIT to ROLE_YNTSJY_WEB_APP;
grant insert on YNTSJY_NEFLOW.T_USER to ROLE_YNTSJY_WEB_APP;

grant update on YNTSJY_NEFLOW.T_COMMENT to ROLE_YNTSJY_WEB_APP;
grant update on YNTSJY_NEFLOW.T_DONE to ROLE_YNTSJY_WEB_APP;
grant update on YNTSJY_NEFLOW.T_FLOWPROCESS to ROLE_YNTSJY_WEB_APP;
grant update on YNTSJY_NEFLOW.T_FLOWRECORD to ROLE_YNTSJY_WEB_APP;
grant update on YNTSJY_NEFLOW.T_FLOWRECORDWORKITEM to ROLE_YNTSJY_WEB_APP;
grant update on YNTSJY_NEFLOW.T_GROUP to ROLE_YNTSJY_WEB_APP;
grant update on YNTSJY_NEFLOW.T_GROUPUSER to ROLE_YNTSJY_WEB_APP;
grant update on YNTSJY_NEFLOW.T_ORGANIZATION to ROLE_YNTSJY_WEB_APP;
grant update on YNTSJY_NEFLOW.T_ORGUNIT to ROLE_YNTSJY_WEB_APP;
grant update on YNTSJY_NEFLOW.T_TODO to ROLE_YNTSJY_WEB_APP;
grant update on YNTSJY_NEFLOW.T_USER to ROLE_YNTSJY_WEB_APP;
grant update on YNTSJY_NEFLOW.T_WORKITEM to ROLE_YNTSJY_WEB_APP;

grant delete on YNTSJY_NEFLOW.T_DONE to ROLE_YNTSJY_WEB_APP;
grant delete on YNTSJY_NEFLOW.T_GROUP to ROLE_YNTSJY_WEB_APP;
grant delete on YNTSJY_NEFLOW.T_GROUPUSER to ROLE_YNTSJY_WEB_APP;
grant delete on YNTSJY_NEFLOW.T_ORGANIZATION to ROLE_YNTSJY_WEB_APP;
grant delete on YNTSJY_NEFLOW.T_ORGUNIT to ROLE_YNTSJY_WEB_APP;
grant delete on YNTSJY_NEFLOW.T_TODO to ROLE_YNTSJY_WEB_APP;
grant delete on YNTSJY_NEFLOW.T_USER to ROLE_YNTSJY_WEB_APP;
```

> 系统权限和表权限不可在同一条sql中授予，会报错

> 向用户授予其他用户表权限，可以授予 DBA 角色 `grant dba to YNTSJY_NAPP;`；如果不能授予 dba 角色，就只能逐个表授权

##### 授予用户创建的角色

```sql
SQL> grant ROLE_YNTSJY_WEB_APP to YNTSJY_NAPP;
```

##### 设为默认角色

```sql
SQL> alter user YNTSJY_NAPP default role ROLE_YNTSJY_WEB_APP;
```

> 注：角色的生效是一个什么概念呢？假设用户a有b1,b2,b3三个角色，那么如果b1未生效，则b1所包含的权限对于a来讲是不拥有的，只有角色生效了，角色内的权限才作用于用户，最大可生效角色数由参数MAX_ENABLED_ROLES设定；在用户登录后，oracle将所有直接赋给用户的权限和用户默认角色中的权限赋给用户。
>
> [Oracle 用户，角色，权限等 - 一泽涟漪 - 博客园 (cnblogs.com)](https://www.cnblogs.com/ilifeilong/p/7624329.html)

##### 登录查看拥有的权限

```sql
SQL> select * from session_privs;

PRIVILEGE
----------------------------------------
CREATE SESSION
UNLIMITED TABLESPACE
CREATE TABLE
CREATE CLUSTER
CREATE VIEW
CREATE SEQUENCE
CREATE PROCEDURE
CREATE TRIGGER
CREATE TYPE
CREATE OPERATOR
CREATE INDEXTYPE

11 rows selected.
```

