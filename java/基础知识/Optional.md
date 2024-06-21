# Optional

`Optional`是一个容器，它可能包含也可能不包含一个非空值。可以非常简洁地进行控制处理，类似`Stream`使用链式操作，两者也可以搭配使用。

### 典型案例

一个接口返回值`JSONObject obj`结构如下：

```json
{
	"a":{
		"b":{
			"c":2
		}
	}
}
```

`a/b/c`每层结构都可能为`null`，甚至整个`obj`都可能为`null`，要求当`c`有值时，返回`c`值，否则返回`0`。

```java
int x = Optional.ofNullable(obj)
    .map(v -> v.getJSONObject("a"))
    .map(v -> v.getJSONObject("b"))
    .map(v -> v.getInteger("c"))
    .orElse(0)
```

> [!TIP]
>
> `Stream`中的`map`会对流中每一个值使用编程函数进行处理，根据返回值形成一个新的流，同样`Optional`中的`map`中的每一个值（当然最多会有一个）进行处理，根据返回值形成一个新的`Optional`，当`Optional`中没有值（即为`null`），`map`就不会对它处理，所以**map**只会处理有值的情况，自然就简洁高效地规避了空指针问题。

`Optional`与`Stream`搭配可以非常简洁、安全地从复杂结构中提取信息

```java
// Optional嵌套Optional
String xx = Optional.ofNullable(codesSelectedMimeTypeMap.get(m.getName()))
                    .orElse(Optional.ofNullable(m.getSupportedTypes()).map(v -> v[0]).orElse(null);
// Optional与Stream配合
String xx = Optional.ofNullable(c.colorFormats)
                    .map(v -> Arrays.stream(v)
                            .mapToObj(w -> StringUtils.deNullToStr(Constants.COLOR_FORMAT_MAP.get(w), w))
                            .collect(Collectors.joining("\n")))
                    .orElse(null)
```

