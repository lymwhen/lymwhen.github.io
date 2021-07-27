# sqlplus

# 安装 Instant Client

下载 Instant Client（plsql 只支持 32 位的 oracle 客户端）

> [Instant Client 下载 | Oracle 中国](https://www.oracle.com/cn/database/technology/instant-client.html)

至少下载 basic 和 sqlplus，下载后合并到一个文件夹

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
grant dba to TEST2;
grant connect to TEST2;
grant resource to TEST2;
```

### 数据库版本

```sql
select * from v$version
```

### 实例名

```sql
select instance_name from v$instance
```

### 服务名

```sql
select global_name from global_name
```

> sid: 实例名
> 服务名：监听程序名字

# 连接

### 通过实例连接（存疑）

```sql
sqlplus YNYBJ_EFLOW/ynybj_eflow@10.xxx.xxx.xxx/LDDB.LDDB1
```

### 通过服务连接

```sql
sqlplus YNYBJ_EFLOW/ynybj_eflow@10.xxx.xxx.xxx/LDDB
```

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

