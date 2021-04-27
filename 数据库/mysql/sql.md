# sql

# 右表最新一条

```sql
select * from base_dorm d left join base_dormstudent ds on d.id = ds.dormid and ds.id = (select id from base_dormstudent where dormid = d.id order by userid desc limit 1)
```

# 生成数列

```sql
select (@count := @count + 1) as count from 
	(select @count := 0) t1,
	(select 1
	union all
	select 1
	union all
	select 1
	union all
	select 1) t2,
	(select 1
	union all
	select 1
	union all
	select 1
	union all
	select 1
) t3;
```

>生成从1-16的数列

# 本周的7天

```sql
select DATE_ADD(CURDATE(),INTERVAL (-WEEKDAY(CURDATE()) + CAST(help_topic_id AS signed)) DAY) from mysql.help_topic where help_topic_id < 7
```

# 去重

根据找出的id删除重复项，反复执行，直到受影响行数为0

```sql
delete from data_dicset where id in (
	# 取出重复项数为2（即重复）的id
	select t.id from (
		# 根据唯一标识符聚合（orgId、dicId、name唯一确定一条字典），取出重复项其中的一个id，计算重复项数
		select max(id) as id, count(id) as count from data_dicset group by orgId,dicId,name order by id
	) t where t.count = 2
)
```

# cxjsxy 设备channelId 生成

```sql
update attend_device dr left join (
select * from( -- 套一层查询 防止sql优化掉排序结果
select d.id as id , d.ip as ip, (@count := @count + 1) as count from attend_device d, (select @count := -1 ) t order by d.ip) d 
) d on dr.id = d.id
set dr.channelId = concat('1000044$1$0$', d.count)
```

# 查询连续多少天

```sql
SELECT
	*
FROM
	(
		SELECT
			@count := (
				CASE
-- 遇到新的姓名统计值置为1
				WHEN @last_name = t. NAME
				AND (
-- 前提条件：只有周一至周五有记录且最多一条
-- 排除周末
-- 上一条时间为星期五则与下一条时间差为3天
-- 上一条时间不为星期五则与下一条时间差为1天
					(WEEKDAY(@last_date) = 4 AND TIMESTAMPDIFF(DAY ,@last_date, t.date) = 3)
					OR (WEEKDAY(@last_date) <> 4 AND TIMESTAMPDIFF(DAY ,@last_date, t.date) = 1)
				) THEN
					(@count + 1)
				ELSE
					1
				END
			) AS count,
			t. NAME AS NAME,
			t.date AS date,
-- 最后记录本次的日期和姓名
			@last_date := t.date,
			@last_name := t. NAME
		FROM
			timetest t,
			(SELECT @count := 0 ,@last_date = '' ,@last_name = '') tt
-- 按姓名日期升序排列
		ORDER BY
			NAME,
			date
	) r
WHERE
	DATE_FORMAT(date, '%Y-%m-%d') = DATE_SUB(
		DATE_SUB('2019-08-17', INTERVAL 1 DAY),
		INTERVAL (CASE WEEKDAY(DATE_SUB('2019-08-17', INTERVAL 1 DAY)) WHEN 5 THEN 1 WHEN 6 THEN 2 ELSE 0 END) DAY
	)
```

