# 生成数列

生成从1-16的数列

```sql
SELECT LEVEL AS lv FROM DUAL CONNECT BY LEVEL <= 16
```