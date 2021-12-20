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

# ITEM_IN_SET

两个set是否有交集，如`'12,34'`和`'12,56'`

```sql
CREATE FUNCTION `ITEM_IN_SET`( arg1 VARCHAR ( 1000 ), arg2 VARCHAR ( 1000 ) ) RETURNS int(11)
BEGIN
    DECLARE
        i INT DEFAULT 0;
    DECLARE
        p INT DEFAULT 0;
    DECLARE
        pLastFlag INT DEFAULT 1;
    DECLARE
        s VARCHAR(100) DEFAULT null;
    DECLARE
        tmpsi INT DEFAULT 1;
    -- arg1和arg2存在一个空认为无交集
    IF
        arg1 IS NULL or arg2 IS NULL THEN
            RETURN 0;
    END IF;

    loop_name :
    LOOP
        -- 向后寻找','的位置，大于0说明上一个','之后还存在','
        SET p = LOCATE( ',', arg1, p + 1 );
        -- item的索引递增
        SET i = i + 1;
        -- 取出下一个item
        SET s = SUBSTRING_INDEX( SUBSTRING_INDEX( arg1, ',', i ), ',', - 1 );
        -- 将item使用FIND_IN_SET与arg2比较
        SET tmpsi = FIND_IN_SET( s, arg2 );
        -- item存在arg2中，说明存在交集
        IF
            tmpsi > 0 THEN
                RETURN tmpsi;
        END IF;
        -- 往后无','，说明不存在交集（放在最后判断是为了未找到','时再取出一个item，即最后一个item）
        IF
            p = 0 THEN
                RETURN 0;
        END IF;

    END LOOP;

END
```

> 将arg1中参数逐个取出，使用`FIND_IN_SET`查看是否在arg2中
