# MySQL

> MySQL 5.7 Reference Manual
>
> https://dev.mysql.com/doc/refman/5.7/en/

> SQL Function and Operator Reference
>
> https://dev.mysql.com/doc/refman/5.7/en/sql-function-reference.html

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