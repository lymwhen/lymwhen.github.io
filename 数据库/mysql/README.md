# MySQL

> MySQL 5.7 Reference Manual
>
> https://dev.mysql.com/doc/refman/5.7/en/

> SQL Function and Operator Reference
>
> https://dev.mysql.com/doc/refman/5.7/en/sql-function-reference.html

# 性能优化

> 可以看 mysql 默认的配置文件
>
> ```bash
> vim /opt/mysql/conf/my.cnf
> [mysqld]
> # Remove leading # and set to the amount of RAM for the most important data
> # cache in MySQL. Start at 70% of total RAM for dedicated server, else 10%.
> # innodb_buffer_pool_size = 128M
> #
> # Remove the leading "# " to disable binary logging
> # Binary logging captures changes between backups and is enabled by
> # default. It's default setting is log_bin=binlog
> # disable_log_bin
> #
> # Remove leading # to set options mainly useful for reporting servers.
> # The server defaults are faster for transactions and fast SELECTs.
> # Adjust sizes as needed, experiment to find the optimal values.
> # join_buffer_size = 128M
> # sort_buffer_size = 2M
> # read_rnd_buffer_size = 2M
> #
> # Remove leading # to revert to previous value for default_authentication_plugin,
> # this will increase compatibility with older clients. For background, see:
> # https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_default_authentication_plugin
> # default-authentication-plugin=mysql_native_password
> ```
>
> 1. **InnoDB Buffer Pool Size**:
>
>    - 建议将`innodb_buffer_pool_size`设置为大多数重要数据缓存的RAM量。
>    - 对于专用服务器，建议从总RAM的70%开始设置。
>    - 对于非专用服务器，建议从总RAM的10%开始设置。
>    - 如果不特意配置，这个值设置为128MB。
>
>    **通常这个是生产环境中 MYSQL 唯一需要的性能参数**，如`innodb_buffer_pool_size=12G`。
>
> 2. **Binary Logging**:
>
>    - 二进制日志记录了备份之间的更改，并默认启用（`log_bin=binlog`）。
>    - 如果要禁用二进制日志，可以移除`disable_log_bin`前的注释符号`#`。
>
> 3. **Reporting Servers**:
>
>    - 如果服务器主要用于报告生成，可以调整以下缓冲区大小以优化性能：
>      - `join_buffer_size`：用于连接操作的缓冲区大小。
>      - `sort_buffer_size`：用于排序操作的缓冲区大小。
>      - `read_rnd_buffer_size`：用于随机读取操作的缓冲区大小。
>
>    **默认情况下，这些值被设置为适合快速事务和快速SELECT查询的值。增大这些值，性能可能反而会下降**，因为分配内存也是花费时间，而大多数查询并不需要很大的缓冲区，所以通常不需要更改这些值。
>
> 4. **Default Authentication Plugin**:
>
>    - 从MySQL 8.0开始，默认的身份验证插件是`caching_sha2_password`，这可能会与旧版本的客户端不兼容。
>    - 如果需要提高与旧客户端的兼容性，可以将`default_authentication_plugin`的值改回`mysql_native_password`。
>    - 要这样做，需要移除`default-authentication-plugin=mysql_native_password`前的注释符号`#`。



# 事务

MySQL 事务主要用于处理操作量大，复杂度高的数据。比如说，在人员管理系统中，你删除一个人员，你既需要删除人员的基本资料，也要删除和该人员相关的信息，如信箱，文章等等，这样，这些数据库操作语句就构成一个事务！

- 在 MySQL 中只有使用了 Innodb 数据库引擎的数据库或表才支持事务。
- 事务处理可以用来维护数据库的完整性，保证成批的 SQL 语句要么全部执行，要么全部不执行。
- 事务用来管理 insert,update,delete 语句

一般来说，事务是必须满足4个条件（ACID）：：原子性（**A**tomicity，或称不可分割性）、一致性（**C**onsistency）、隔离性（**I**solation，又称独立性）、持久性（**D**urability）。

- **原子性：**一个事务（transaction）中的所有操作，要么全部完成，要么全部不完成，不会结束在中间某个环节。事务在执行过程中发生错误，会被回滚（Rollback）到事务开始前的状态，就像这个事务从来没有执行过一样。
- **一致性：**在事务开始之前和事务结束以后，数据库的完整性没有被破坏。这表示写入的资料必须完全符合所有的预设规则，这包含资料的精确度、串联性以及后续数据库可以自发性地完成预定的工作。
- **隔离性：**数据库允许多个并发事务同时对其数据进行读写和修改的能力，隔离性可以防止多个事务并发执行时由于交叉执行而导致数据的不一致。事务隔离分为不同级别，包括读未提交（Read uncommitted）、读提交（read committed）、可重复读（repeatable read）和串行化（Serializable）。
- **持久性：**事务处理结束后，对数据的修改就是永久的，即便系统故障也不会丢失。

> 在 MySQL 命令行的默认设置下，事务都是自动提交的，即执行 SQL 语句后就会马上执行 COMMIT 操作。因此要显式地开启一个事务务须使用命令 BEGIN 或 START TRANSACTION，或者执行命令 SET AUTOCOMMIT=0，用来禁止使用当前会话的自动提交。

### 事务隔离级别

SQL标准定义了4类隔离级别，包括了一些具体规则，用来限定事务内外的哪些改变是可见的，哪些是不可见的。低级别的隔离级一般支持更高的并发处理，并拥有更低的系统开销。

#### Read Uncommitted（读取未提交内容）

在该隔离级别，所有事务都可以看到其他未提交事务的执行结果。本隔离级别很少用于实际应用，因为它的性能也不比其他级别好多少。读取未提交的数据，也被称之为脏读（Dirty Read）。

#### Read Committed（读取提交内容）

这是大多数数据库系统的默认隔离级别（但不是MySQL默认的）。它满足了隔离的简单定义：一个事务只能看见已经提交事务所做的改变。这种隔离级别 也支持所谓的不可重复读（Nonrepeatable Read），因为同一事务的其他实例在该实例处理其间可能会有新的commit，所以同一select可能返回不同结果。

#### Repeatable Read（可重读）

这是MySQL的默认事务隔离级别，它确保同一事务的多个实例在并发读取数据时，会看到同样的数据行。不过理论上，这会导致另一个棘手的问题：幻读 （Phantom Read）。简单的说，幻读指当用户读取某一范围的数据行时，另一个事务又在该范围内插入了新行，当用户再读取该范围的数据行时，会发现有新的“幻影” 行。InnoDB和Falcon存储引擎通过多版本并发控制（MVCC，Multiversion Concurrency Control）机制解决了该问题。

#### Serializable（可串行化）

这是最高的隔离级别，它通过强制事务排序，使之不可能相互冲突，从而解决幻读问题。简言之，它是在每个读的数据行上加上共享锁。在这个级别，可能导致大量的超时现象和锁竞争。

这四种隔离级别采取不同的锁类型来实现，若读取的是同一个数据的话，就容易发生问题。例如：

> - 脏读(Drity Read)：某个事务已更新一份数据，另一个事务在此时读取了同一份数据，由于某些原因，前一个RollBack了操作，则后一个事务所读取的数据就会是不正确的。
> - 不可重复读(Non-repeatable read):在一个事务的两次查询之中数据不一致，这可能是两次查询过程中间插入了一个事务更新的原有的数据。
> - 幻读(Phantom Read):在一个事务的两次查询中数据笔数不一致，例如有一个事务查询了几列(Row)数据，而另一个事务却在此时插入了新的几列数据，先前的事务在接下来的查询中，就有几列数据是未查询出来的，如果此时插入和另外一个事务插入的数据，就会报错。

在MySQL中，实现了这四种隔离级别，分别有可能产生问题如下所示：

![img](assets/856cf031b7ef4796d760bb5633da4bf4.png)

> [MySQL 四种事务隔离级别详解介绍_mysql中的四种事务隔离级别是什么-CSDN博客](https://blog.csdn.net/justlpf/article/details/106835122)，这里包含了隔离级别的测试哦。

### 事务控制语句：

- BEGIN 或 START TRANSACTION 显式地开启一个事务；
- COMMIT 也可以使用 COMMIT WORK，不过二者是等价的。COMMIT 会提交事务，并使已对数据库进行的所有修改成为永久性的；
- ROLLBACK 也可以使用 ROLLBACK WORK，不过二者是等价的。回滚会结束用户的事务，并撤销正在进行的所有未提交的修改；
- SAVEPOINT identifier，SAVEPOINT 允许在事务中创建一个保存点，一个事务中可以有多个 SAVEPOINT；
- RELEASE SAVEPOINT identifier 删除一个事务的保存点，当没有指定的保存点时，执行该语句会抛出一个异常；
- ROLLBACK TO identifier 把事务回滚到标记点；
- SET TRANSACTION 用来设置事务的隔离级别。InnoDB 存储引擎提供事务的隔离级别有READ UNCOMMITTED、READ COMMITTED、REPEATABLE READ 和 SERIALIZABLE。

### MYSQL 事务处理主要有两种方法：

1、用 BEGIN, ROLLBACK, COMMIT来实现

- **BEGIN** 开始一个事务
- **ROLLBACK** 事务回滚
- **COMMIT** 事务确认

2、直接用 SET 来改变 MySQL 的自动提交模式:

- **SET AUTOCOMMIT=0** 禁止自动提交
- **SET AUTOCOMMIT=1** 开启自动提交

```sql
begin;
insert into user (name, age) values ('xiaoming', 12);
commit;
```

# 数据类型

### Decimal

> decimal
>
> 美/ˈdesɪm(ə)l/ 英/'desɪm(ə)l/
>
> adj.十进位的, 小数的
>
> n.小数

Decimal 表示为 `DECIMAL(*`M`*,*`D`*)`，`M`为总位数，默认值10，最大65，`D`为小数位数，默认值0。整数部分位数为`M`-`D`。

整数部分和小数部分占用字节数分开计算，位数与占用关系如下：

| 位数 | 占用字节数 |
| :--- | :--------- |
| 0    | 0          |
| 1–2  | 1          |
| 3–4  | 2          |
| 5–6  | 3          |
| 7–9  | 4          |

所以一个非常常用的 Decimal：`Decimal(11, 2)`，整数9位，小数2位，共占用5字节，取值范围 -999999999.99 - 999999999.99。

> The declaration syntax for a [`DECIMAL`](https://dev.mysql.com/doc/refman/5.7/en/fixed-point-types.html) column is . The ranges of values for the arguments are as follows: `DECIMAL(*`M`*,*`D`*)`
>
> - *`M`* is the maximum number of digits (the precision). It has a range of 1 to 65.
> - *`D`* is the number of digits to the right of the decimal point (the scale). It has a range of 0 to 30 and must be no larger than *`M`*.
>
> If *`D`* is omitted, the default is 0. If *`M`* is omitted, the default is 10.
>
> The maximum value of 65 for *`M`* means that calculations on [`DECIMAL`](https://dev.mysql.com/doc/refman/5.7/en/fixed-point-types.html) values are accurate up to 65 digits. This limit of 65 digits of precision also applies to exact-value numeric literals, so the maximum range of such literals differs from before. (There is also a limit on how long the text of [`DECIMAL`](https://dev.mysql.com/doc/refman/5.7/en/fixed-point-types.html) literals can be; see [Section 12.22.3, “Expression Handling”](https://dev.mysql.com/doc/refman/5.7/en/precision-math-expressions.html).)
>
> Values for [`DECIMAL`](https://dev.mysql.com/doc/refman/5.7/en/fixed-point-types.html) columns are stored using a binary format that packs nine decimal digits into 4 bytes. The storage requirements for the integer and fractional parts of each value are determined separately. Each multiple of nine digits requires 4 bytes, and any remaining digits left over require some fraction of 4 bytes. The storage required for remaining digits is given by the following table.
>
> | Leftover Digits | Number of Bytes |
> | :-------------- | :-------------- |
> | 0               | 0               |
> | 1–2             | 1               |
> | 3–4             | 2               |
> | 5–6             | 3               |
> | 7–9             | 4               |
>
> [MySQL ：： MySQL 5.7 参考手册 ：： 12.22.2 十进制数据类型特征](https://dev.mysql.com/doc/refman/5.7/en/precision-math-decimal-characteristics.html)

### Text

text 类型超过长度报错：`Data truncation: Data too long for column 'nodeStr'`

TEXT 最大长度约为65535（64k）。

MEDIUMTEXT最大长度约为16777215（16MB）。

LONGTEXT最大长度为4294967295(4GB)。

# 字符串

### left(str, 5)

截取左起5位

### right(right, 5)

截取右起5位

### locate(substr,str,5)

substr 在 str 中的位置，第三个参数为起始位数

```sql
locate('/','122/x/y')
4
locate('/','122/x/y',5)
6
# 配合left/right
left('122/x/y', locate('/','122/x/y'))
122/
```

### char_length(operation)

字符串长度，中文文字长度为1

### length(operation)

字符串长度，中文文字长度为3（utf-8）

### SUBSTRING(timestr, 1, 4) 

截取字符串，从1开始，第二个参数是位数
从头截取到倒数第二位substring(operation, 1, char_length(operation) - 1)

### 	SUBSTRING_INDEX(str,delim,count)

str：截取字符串

delim：定界符

count：返回第几个定界符之前的内容（负数则为倒数第几个定界符之后的内容）

```sql
SUBSTRING_INDEX('123;456;789',';',2)
123;456
```

```sql
SUBSTRING_INDEX(SUBSTRING_INDEX('添加|add;修改|edit;删除|del', ';', 2), ';', - 1)
修改|edit
```

> 两个substring_index方法并用，实现截取分割字符串的第n个分组，类似oracle regexp_substr

# 聚合函数

```sql
min
max
avg
sum
count
```

> left join 统计时，如果右表记录为空,count(1)/count(*) 会统计为1，count(右表.id) 统计为0
>
> 统计字段的值为null同理

### GROUP_CONCAT(ip)

聚合字符串

```sql
group_concat(xx)
x1,x2,x3
```

> 列中null值也会被加入，如xx,null,xx



# 时间

> [!TIP]
>
> `datetime`格式默认精确到秒，四舍五入舍弃毫秒。
>
> 对于要求时间精确的场景存在问题：`2022-10-10 23:59:59.999`存入数据库后变为`2022-10-11 00:00:00`，将字段长度设为`3`即可存储完整的毫秒，若小于`3`同样会四舍五入舍弃低位。

```sql
# 当前时间
now()
# 今天0点
CURDATE()
# 时间加减
DATE_ADD(date, INTERVAL 1 SECOND/MINUTE/HOUR/DAT/MONTH/YEAR)
DATE_SUB(date, INTERVAL 1 SECOND/MINUTE/HOUR/DAT/MONTH/YEAR)
```

### 格式化

```sql
# 时分秒 %T 相当于 %H:%i:%S
DATE_FORMAT(date, format)
# 本月
DATE_FORMAT(now(),'%m')
# 本年
year(now())

# 本周
YEARWEEK(now())
# ❌
and YEARWEEK(date_format(scoreDate,'%Y-%m-%d')) &gt;= (YEARWEEK(now())+#{week}) and YEARWEEK(date_format(scoreDate,'%Y-%m-%d')) &lt; (YEARWEEK(now())+#{week}+1)
# ✔
and YEARWEEK(date_format(patrolDate,'%Y-%m-%d')) = (YEARWEEK(now())+0)

# 星期(1-7)
YEARWEEK('2019-12-21',1)
# 本小时开始
DATE_FORMAT(now(), '%Y-%m-%d %H:00:00')
# 本月开始
DATE_FORMAT(now(), '%Y-%m-01 00:00:00')
# 本周开始时间
DATE_SUB(DATE_FORMAT(now(),'%Y-%m-%d 00:00:00'),INTERVAL WEEKDAY(now()) DAY)
# 本周结束时间（下周第一天）
DATE_ADD(DATE_FORMAT(now(),'%Y-%m-%d 00:00:00'),INTERVAL (7 - WEEKDAY(now())) DAY)
```

> mysql 会自动将存入的时间毫秒部分四舍五入，如 2018-03-31 20:04:04.568 将会自动转换为 2018-03-31 20:04:05
>
> 解决办法，舍弃毫秒部分后再存入数据库：
> 		1. java SimpleDateFormat格式化
> 		2. 表单填入的时间
> 		3. java Calendar舍弃
>
> ```java
> Calendar c = Calendar.getInstance();
> c.setTime(date);
> c.set(Calendar.MILLISECOND, 0);
> ```

# 判断空

### isnull(expr)

null返回1，not null 返回0

### ifnull(score,0)

如果score为null，返回0

```sql
ifnull('a', '1')
a

ifnull(null, '1')
1
```

# 行转列
```sql
select 
    count(case type when '数学' then 1 else null end) as shuxueCount, 
    count(case type when '文学' then 1 else null end) as wenxueCount
from book

select 
    sum(case type when '数学' then 1 else 0 end) as shuxueCount, 
    sum(case type when '文学' then 1 else 0 end) as wenxueCount
from book
```

# 排序

```sql
order by score
```

### 倒序使null排前（非正常需求）

> mysql 认为 null 值最小，正常倒序null值不会排前

```sql
order by isnull(score) desc, score desc
```

### 自定义排序

```sql
# 从左到右升序，其他值最小，如c,a,b
by field(subject,'a','b')
```