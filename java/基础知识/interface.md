# interface

java 接口中可以定义常量和方法，不可定义变量和方法实现，成员变量由 public static final 修饰，方法由 public abstract 修饰

> [java中接口（interface）详解_sun_shine56的博客-CSDN博客](https://blog.csdn.net/sun_shine56/article/details/86621481)

# 接口实现

```java
public interface Power {
    int vol = 220;
    void onSetTitle(String title);
}
```

```java
public class C implements Power {
    
    @Override
    public void onSetTitle(String title){
        System.out.println(title + vol);
    }
}
```

# Functional Interface

函数式接口：JDK8 中新增，含有一个抽象方法的接口，为 lambda 表达式和方法引用提供目标类型。

[java.util.function (Java Platform SE 8 ) (oracle.com)](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html)

JDK8 根据几种常见的输入输出类型，定义了一些函数式接口，来实现不同的功能，文档中看起来共有三四十种，且广泛的用在各种链式操作中，乍一看挺复杂，但概括下来就以下几种：

| 接口            | 抽象方法            | 功能   | 描述                       |
| --------------- | ------------------- | ------ | -------------------------- |
| `Predicate<T>`  | `boolean test(T t)` | 断言   | 输入`t`，输出`boolean`结果 |
| `Supplier<T>`   | `T get()`           | 生产者 | 输出`t`                    |
| `Consumer<T>`   | `void accept(T t)`  | 消费者 | 对输入`t`进行处理，不输出  |
| `Function<T,R>` | `R apply(T t)`      | 函数   | 输入`t`，输出`r`           |

> [!TIP]
>
> `Bi`开头的接口，表示：`Binary`，二元，指输入变为两个。如`BiPredicate<T, U>`：输入`t`和`u`，输出`boolean`结果。

> [!TIP]
>
> `xxBinaryOperator`：与`BiFunction`类似，基本都是输入`t`和`u`，输出`u`，另有一些静态的构造方法。

# Lambda 表达式

java8中一个非常重要的特性就是lambda表达式，我们可以把它看成是一种闭包，它允许把函数当做参数来使用，是面向函数式编程的思想，一定程度上可以使代码看起来更加简洁。

##### 原匿名内部类实现方式

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("内部类写法");
    }
}).start();
```

##### Lambda 写法

```java
new Thread(() -> System.out.println("lambda写法")).start();
```

### 示例

##### 入参为空

```java
public interface TestDemo {
    String hi();
}
```

```java
TestDemo no_param = () -> "hi, no param";
TestDemo no_param2 = () -> { return "hi, no param"; };
System.out.println(no_param.hi());
```

##### 单个入参

```java
public interface TestDemo2 {
    String hei(String name);
}
```

```java
TestDemo2 param = name -> name;
TestDemo2 param2 = name -> { return name;};
System.out.println(param.hei("hei, grils"));
```

##### 多个参数

```java
public interface TestDemo3 {
    String greet(String hello, String name);
}
```

```java
TestDemo3 multiple = (String hello, String name) -> hello + " " + name;
//一条返回语句，可以省略大括号和return
TestDemo3 multiple2 = (hello, name) -> hello + name;
//多条处理语句，需要大括号和return
TestDemo3 multiple3 = (hello, name) -> {
    System.out.println("进入内部");
    return hello + name;
};
System.out.println(multiple.greet("hello", "lambda"));
```

> [java8 lambda表达式 - 傻不拉几猫 - 博客园 (cnblogs.com)](https://www.cnblogs.com/kingsonfu/p/11047116.html)

# 封装 JDBC

```java
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Component;

public class DBSyncUtils {
    // private static Logger logger = LogManager.getLogger(SimpleImport.class.getName());
	
	public boolean start() {
		long start = System.currentTimeMillis();
		
		Connection conn = null;
		// 连接门户数据库同步
		try {
			conn = DBConn.startConn();
			
			getData(conn);
			return true;
		}catch(Exception e) {
			e.printStackTrace();
			return false;
		}finally {
			DBConn.closeConn(conn);
		}
	}

	private void getData(Connection conn) throws Exception{
		String sql = "";
		
		if(onDBConn != null) {
			sql = onDBConn.getSql();
		}

		Statement stmt = conn.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
		ResultSet resultset = stmt.executeQuery(sql);
		resultset.beforeFirst();
		
		if(onDBConn != null) {
			onDBConn.onGetResultSet(resultset);
		}
		
		resultset.close();
		stmt.close();
	}
	
	private OnDBConn onDBConn;
	
	public void setOnDBConn(OnDBConn onDBConn) {
		this.onDBConn = onDBConn;
	}
	
	public interface OnDBConn{
		String getSql();
		void onGetResultSet(ResultSet rs) throws Exception;
	}
}
```

DBConn

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Component;

import com.chunshu.common.utils.BeanUtils;
import com.chunshu.common.utils.StringUtil;
import com.chunshu.model.space.base.Org;
import com.chunshu.service.space.base.IOrgService;

public class DBConn {
	private static final String DRIVER = "org.postgresql.Driver";
	private static final String URL = "jdbc:postgresql://127.0.0.1:5433/postgres";
	private static final String USERNAME = "postgres";
	private static final String PASSWORD = "password";

	// private static final Logger logger= LoggerFactory.getLogger(DBConn.class);
	
	@PostConstruct 
	private void init() {
		IOrgService orgService = BeanUtils.getBean(IOrgService.class);
		org = orgService.selectById(ORGID);
	}
	
	public static Connection startConn() throws Exception {
		try {
			Class.forName(DRIVER);
			System.out.println("init driver success");
			
			Connection conn = DriverManager.getConnection(URL, USERNAME, PASSWORD);//用数据库连接地址、用户名、密码连接数据库
			System.out.println("connect to database success");
			
			return conn;
		} catch (ClassNotFoundException e) {
			System.out.println("init driver error");
			throw e;
			
		} catch (Exception e) {
			System.out.println("connect to database error");
			throw e;
		}
	}
	
	public static void closeConn(Connection conn) {
		try {
			if(conn != null) {
				conn.close();
			}
			System.out.println("connection close success");
			
		} catch (SQLException e) {
			System.out.println("connection close error");
			System.out.println(StringUtil.getTrace(e));
		}
	}
}
```



# 封装 http 同步 get 请求

```java
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSONObject;
import com.ruiger.common.utils.StringUtil;

import okhttp3.Call;
import okhttp3.ConnectionPool;
import okhttp3.HttpUrl;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class SyncGetRequest {

	private static Logger logger = Logger.getLogger(SyncGetRequest.class);

    private OkHttpClient client = new OkHttpClient().newBuilder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .connectionPool(new ConnectionPool(400, 20, TimeUnit.MINUTES)).build();
    
    Request.Builder requestBuilder = new Request.Builder();
    JSONObject params = new JSONObject();
    
    private OnSuccess onSuccess;
    private OnError onError;
    private String api;
    
    public SyncGetRequest setOnSuccess(OnSuccess onSuccess) {
    	this.onSuccess = onSuccess;
    	return this;
    }
    
    public SyncGetRequest setOnError(OnError onError) {
    	this.onError = onError;
    	return this;
    }
    
    public SyncGetRequest setApi(String api) {
		this.api = api;
    	return this;
	}

	public SyncGetRequest setParams(JSONObject params) {
		this.params = params;
    	return this;
	}

	public SyncGetRequest addHeader(String name, String value) {
		requestBuilder.addHeader(name, value);
    	return this;
	}
	
	public SyncGetRequest addParam(String name, String value) {
		params.put(name, value);
		return this;
	}

	public void call() {
        // 构建参数
		HttpUrl.Builder builder = HttpUrl.parse(api).newBuilder();
		for(Map.Entry<String, Object> o : params.entrySet()) {
			builder.addQueryParameter(o.getKey(), o.getValue().toString());
		}
		requestBuilder.url(builder.build());
        logger.info(StringUtil.printLabeled("api", api, "params", params));
                
        Request request = requestBuilder.build();
        Call call=client.newCall(request);
        
        try {
            Response response = call.execute();
            String resp = response.body().string();
            response.close();
            logger.info(StringUtil.printLabeled("api", api, "result", resp));

            if(onSuccess != null) {
            	onSuccess.onSuccess(resp);
            }

        } catch (Exception e) {
            logger.info(StringUtil.printLabeled("api", api, "result", StringUtil.getTrace(e)));
            if(onError != null) {
            	onError.onError(e);
            }
        }
    }
    
    public interface OnSuccess {
    	void onSuccess(String res);
    }
    
    public interface OnError {
    	void onError(Exception e);
    }
}
```

使用

```java
new SyncGetRequest()
    .setApi("https://cruzr-api.ubtrobot.com/api-cruzr/robot-state/query")
    .addParam("appId", appId)
    .addParam("serialNum", serialNum)
    .addParam("timestamp", timestamp)
    .addParam("version", "1.0")
    .addHeader("appId", CruzrApiSign.appId)
    .addHeader("version", "1.0")
    .addHeader("timestamp", timestamp)
    .addHeader("sign", CruzrApiSign.createQuerySign(serialNum, timestamp))
    .setOnSuccess(res -> {
        System.out.println(res);
    })
    .setOnError(e -> e.printStackTrace())
    .call();
```

