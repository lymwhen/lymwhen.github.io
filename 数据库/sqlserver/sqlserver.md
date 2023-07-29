# SQL Server

```sql
-- 转换空值
isnull(out_time, '')
-- 当前时间
getdate()
```

# 存储过程

```sql
-- 赋值
DECLARE @data varchar(max);
set @data='time=1' 
```



### 调用 api

```sql
begin
declare @ServiceUrl as varchar(1000) 
set @ServiceUrl = 'http://192.168.55.210:8080/apianon/water/push'
DECLARE @data varchar(max);
--发送数据
set @data='time=1'                   

Declare @Object as Int
Declare @ResponseText AS  varchar(8000)   ;      
Exec sp_OACreate 'Msxml2.ServerXMLHTTP.3.0', @Object OUT;
Exec sp_OAMethod @Object, 'open', NULL, 'POST',@ServiceUrl,'false'
Exec sp_OAMethod @Object, 'setRequestHeader', NULL, 'Content-Type','application/x-www-form-urlencoded'
Exec sp_OAMethod @Object, 'send', NULL, @data --发送数据
Exec sp_OAMethod @Object, 'responseText', @ResponseText OUTPUT
EXEC sp_OAGetErrorInfo @Object --异常输出
Select  @ResponseText 
Exec sp_OADestroy @Object
end
GO
```

> [!TIP]
>
> 需要开启组件
>
> ```sql
> sp_configure 'show advanced options', 1;
> GO
> RECONFIGURE;
> GO
> sp_configure 'Ole Automation Procedures', 1;
> GO
> RECONFIGURE;
> GO
> EXEC sp_configure 'Ole Automation Procedures';
> GO
> ```
>
> [Sqlserver调用api - cloud_li - 博客园 (cnblogs.com)](https://www.cnblogs.com/lflyq/p/6065160.html)



# 触发器

### INSERT/UPDATE/DELETE

产生的逻辑表：

- `insert`: inserted
- `update`: inserted/deleted
- `delete`: deleted

inserted: `insert`/`update` 后的新数据

deleted: `update`/`delete` 前的旧数据



> 判断操作类型
>
> CREATE   TRIGGER   tr_T_A   ON     T_A   for   INSERT,UPDATE,DELETE         
>
> 如IF   exists   (select   *   from   inserted)   and   not   exists   (select   *   from   deleted)   则为   INSERT
>
> 如IF   exists(select   *   from   inserted   )   and   exists   (select   *   from   deleted)   则为   UPDATE 
>
> 如IF   exists   (select   *   from   deleted)   and   not   exists   (select   *   from   inserted)则为   DELETE  
>
> 
>
> 插入操作（Insert）：Inserted表有数据，Deleted表无数据 
>
> 删除操作（Delete）：Inserted表无数据，Deleted表有数据 
>
> 更新操作（Update）：Inserted表有数据（新数据），Deleted表有数据（旧数据）
>
> [SQLSERVER触发器触发INSERT,UPDATE,DELETE三种状态 - *（00）* - 博客园 (cnblogs.com)](https://www.cnblogs.com/zouhao/p/12572985.html)

##### 触发器中获取插入/删除的行值

```
DECLARE @data varchar(max);
select @data=id from inserted;
```

##### 将插入/更新的行值 POST 到接口

```sql
use XX_DB
go
CREATE TRIGGER INS_UPD_ON_Inoutls ON XX_DB.dbo.XX_test1 
FOR INSERT, UPDATE 
AS   
BEGIN
	
declare @ServiceUrl as varchar(1000)
set @ServiceUrl = 'http://192.168.55.210:8080/apianon/water/push'
DECLARE @data varchar(200);
--发送数据
-- set @data='time=1'  
select @data = CAST(P_KEY AS VARCHAR) + '|' + Carno + '|' + ISNULL(CONVERT(VARCHAR, In_time, 20), '') + '|' + ISNULL(CONVERT(VARCHAR, Out_time, 20), '') from inserted;                

Declare @Object as Int
Declare @ResponseText AS  varchar(8000)   ;      
Exec sp_OACreate 'Msxml2.ServerXMLHTTP.3.0', @Object OUT;
Exec sp_OAMethod @Object, 'open', NULL, 'POST',@ServiceUrl,'false'
Exec sp_OAMethod @Object, 'setRequestHeader', NULL, 'Content-Type','application/x-www-form-urlencoded'
Exec sp_OAMethod @Object, 'send', NULL, @data --发送数据

END
GO
```

