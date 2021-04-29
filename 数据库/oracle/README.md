# oracle

# 聚合函数

### WM_CONCAT

> 字符串拼接，产生的数据类型为lob型，需要to_char
>
> ```sql
> to_char(WM_CONCAT(xxx))
> ```



# 表关联update

​	oracle 不支持多表update，要用merge

```sql
merge into YNYBJ_OA.T_OAMH_INFO m 
USING(select id,publishId from YNYBJ_OA.T_OAOPEN_INFO) o 
on (m.id = o.publishId) 
when MATCHED then 
update set m.appId = o.id
```

# 时间

```sql
# 系统时间
sysdate
# 前一天
sysdate - 1
# 时间差
sysdate - date
# 两个时间相减得到天数 (正负float)
select to_number(sysdate - to_date('2019-11-16 15:00:00', 'yyyy-mm-dd hh24:mi:ss')) * 24 from dual;
67.2913888888889
```

### 格式化

```sql
# 四舍五入
round
# 转换为数值型
to_number
# 星期，天一二三四五六 1234567
to_char(sysdate, 'D') 
# 转换为时间 
to_date 
to_date('2019-11-16 15:00:00', 'yyyy-mm-dd hh24:mi:ss')
# 日
trunc(sysdate, 'DD')
# 本周第一天（周日）
trunc(sysdate, 'D')
# 本周一
trunc(sysdate, 'D') + 1
```

> to_char 格式化为字符串 https://www.cnblogs.com/aipan/p/7941917.html
>
> trunc 截取、保留 https://www.cnblogs.com/mingforyou/p/7644308.html

# 字符串与数值

### REGEXP_SUBSTR(String, pattern, position, occurrence, modifier)

分割字符串

string:需要进行正则处理的字符串

pattern：进行匹配的正则表达式

position：起始位置，从字符串的第几个字符开始正则表达式匹配（默认为1） 注意：字符串最初的位置是1而不是0

occurrence：获取第几个分割出来的组（分割后最初的字符串会按分割的顺序排列成组）

modifier：模式（‘i’不区分大小写进行检索；‘c’区分大小写进行检索。默认为’c’）针对的是正则表达式里字符大小写的匹配
		

```sql
# 从字符串的首位（1）开始，以;分割字符串，取分割后的第二个分组
REGEXP_SUBSTR( '添加|add;修改|edit;删除|del', '[^;]+', 1, 2 )
修改|edit
# 正则表达式替换，清空非";"的字符
REGEXP_REPLACE('[^;]', '')
```
### length(String)

字符串长度（中文长度为1）


# 排序

```sql
order by score
```

### 倒序使null不排前

> oracle 认为 null 值最大，倒序会导致null值排遣

```sql
order by age desc nulls last
```

### 自定义排序

```sql
order by case when ...
order by (case type when '局领导' then 1 when '办公室' then 2 else 3)
```

