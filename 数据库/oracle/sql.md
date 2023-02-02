# sql

分页

```
SELECT rn AS 序号, ename AS 姓名, sal AS 工资
FROM(
    SELECT rownum AS rn, sal, ename 
    FROM(
        SELECT sal, ename, FROM emp WHERE sal IS NOT NULL order by sal
    ) 
    WHERE rownum <= 10
)
WHERE rn >= 6

--另外一种写法
SELECT rn AS 序号, ename AS 姓名, sal AS 工资
FROM(
    SELECT rownum AS rn, sal, ename 
    FROM(
        SELECT sal, ename, FROM emp WHERE sal IS NOT NULL order by sal
    )
) a
WHERE a.rn between 6 and 10
```

> [Oracle数据库实现分页_Maggnno的博客-CSDN博客](https://blog.csdn.net/qq_24448899/article/details/78198548)

# 生成数列

生成从1-16的数列

```sql
SELECT LEVEL AS lv FROM DUAL CONNECT BY LEVEL <= 16
```