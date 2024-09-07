# mysql8 新特性



# WITH 子句 - 公共表表达式 CTE

> **WITH clause (Common Table Expressions)**
>
> A common table expression (CTE) is a named temporary result set that exists within the scope of a single statement and that can be referred to later within that statement, possibly multiple times. The following discussion describes how to write statements that use CTEs.
>
> 公共表表达式，简称 CTE，是一个具名的临时结果，作用范围是`statement`。
>
> - [Common Table Expressions - CTE](https://dev.mysql.com/doc/refman/8.0/en/with.html#common-table-expressions)
> - [Recursive Common Table Expressions - 递归 CTE](https://dev.mysql.com/doc/refman/8.0/en/with.html#common-table-expressions-recursive)
> - [Limiting Common Table Expression Recursion - 递归限制](https://dev.mysql.com/doc/refman/8.0/en/with.html#common-table-expressions-recursion-limits)
> - [Recursive Common Table Expression Examples - 递归 CTE 示例](https://dev.mysql.com/doc/refman/8.0/en/with.html#common-table-expressions-recursive-examples)
> - [Common Table Expressions Compared to Similar Constructs - 与 CTE 相似的构造](https://dev.mysql.com/doc/refman/8.0/en/with.html#common-table-expressions-similar-constructs)
>
> For information about CTE optimization, see [Section 10.2.2.4, “Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization”](https://dev.mysql.com/doc/refman/8.0/en/derived-table-optimization.html).
>
> [MySQL :: MySQL 8.0 Reference Manual :: 15.2.20 WITH (Common Table Expressions)](https://dev.mysql.com/doc/refman/8.0/en/with.html#common-table-expressions)

### CTE

在 with 子句中，使用逗号隔开，可以在后续的查询中引用。

语法

```sql
with_clause:
    WITH [RECURSIVE]
        cte_name [(col_name [, col_name] ...)] AS (subquery)
        [, cte_name [(col_name [, col_name] ...)] AS (subquery)] ...
```



```sql
WITH
  cte1 AS (SELECT a, b FROM table1),
  cte2 AS (SELECT c, d FROM table2)
SELECT b, d FROM cte1 JOIN cte2
WHERE cte1.a = cte2.c;
```

##### 可指定列

```sql
WITH cte (col1, col2) AS
(
  SELECT 1, 2
  UNION ALL
  SELECT 3, 4
)
SELECT col1, col2 FROM cte;
```

##### 可用于 [`SELECT`](https://dev.mysql.com/doc/refman/8.0/en/select.html), [`UPDATE`](https://dev.mysql.com/doc/refman/8.0/en/update.html), and [`DELETE`](https://dev.mysql.com/doc/refman/8.0/en/delete.html) statements.

```sql
WITH ... SELECT ...
WITH ... UPDATE ...
WITH ... DELETE ...
```

##### 可用于子查询，包括派生表子查询

```sql
SELECT ... WHERE id IN (WITH ... SELECT ...) ...
SELECT * FROM (WITH ... SELECT ...) AS dt ...
```

##### 可用于紧接`Select`之前的语句

```sql
INSERT ... WITH ... SELECT ...
REPLACE ... WITH ... SELECT ...
CREATE TABLE ... WITH ... SELECT ...
CREATE VIEW ... WITH ... SELECT ...
DECLARE CURSOR ... WITH ... SELECT ...
EXPLAIN ... WITH ... SELECT ...
```

##### 一个语句中允许有多个 WITH 子句，只要位于不同的层

```sql
WITH cte1 AS (SELECT 1)
SELECT * FROM (WITH cte2 AS (SELECT 2) SELECT * FROM cte2 JOIN cte1) AS dt;
```

##### 一个 CTE 可以引用其他 CTE：

- 同一 with 子句中，只有后面的 CTE 可以引用前面的 CTE
- 只有在递归 CTE 中，CTE 可以引用自身
- 外层的 CTE 可以引用内层的 CTE

### 递归 CTE - Recursive CTE

语法

递归 CTE 包含两部分，由 [`UNION ALL`](https://dev.mysql.com/doc/refman/8.0/en/union.html) or [`UNION [DISTINCT\]]`](https://dev.mysql.com/doc/refman/8.0/en/union.html) 分开

```sql
SELECT ...      -- return initial row set
UNION ALL
SELECT ...      -- return additional row sets
```

```sql
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte WHERE n < 5
)
SELECT * FROM cte;
```

```
+------+
| n    |
+------+
|    1 |
|    2 |
|    3 |
|    4 |
|    5 |
+------+
```

### 递归 CTE 的限制

```sql
WITH RECURSIVE cte (n) AS
(
  SELECT 1
  UNION ALL
  SELECT n + 1 FROM cte
)
SELECT * FROM cte;
```

By default, [`cte_max_recursion_depth`](https://dev.mysql.com/doc/refman/8.0/en/server-system-variables.html#sysvar_cte_max_recursion_depth) has a value of 1000, causing the CTE to terminate when it recurses past 1000 levels. Applications can change the session value to adjust for their requirements:

默认最大递归深度为 1000，可以改变 session 值调整：

```sql
SET SESSION cte_max_recursion_depth = 10;      -- permit only shallow recursion
SET SESSION cte_max_recursion_depth = 1000000; -- permit deeper recursion
```

### CTE 与 派生表

相同点：

- 具名构造
- 作用域为一个 SQL 语句

CTE 的优势：

- CTE 可以多次被引用
- CTE 可被自身引用（递归）
- CTE 可以被其他 CTE 引用
- CTE 位于 SQL 语句开头，可读性更高
