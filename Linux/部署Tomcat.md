# 安装 Tomcat

# 上传

```bash
# 解压
cd /usr/local
tar zxvf apache-tomcat-9.0.37.tar.gz
tar zxvf eflow.tar.gz
```

# 配置

### JDK（若不配置使用环境变量中的JDK）

```bash
vi /usr/local/eflow/bin/setclasspath.sh
# 在文件顶部添加
export JAVA_HOME=/usr/local/java/jdk1.6.0_45
export JRE_HOME=/usr/local/java/jdk1.6.0_45/jre
```

### 内存

> 堆 -Xms256m -Xmx512m，非堆 -XX:PermSize=128m -XX:MaxPermSize=256m
>
> Tomcat 8 以上不支持配置非堆内存

bin下 catalina.bat/sh 顶部加入

```bash
# Linux
JAVA_OPTS="-Xms256m -Xmx512m -XX:PermSize=128m -XX:MaxPermSize=256m"
# Windows
set JAVA_OPTS=-Xms256m -Xmx512m -XX:PermSize=128m -XX:MaxPermSize=256m
```

​        

# 启动 Tomcat

```bash
# oa
/usr/local/oa/bin/startup.sh | tail -f /usr/local/oa/logs/catalina.out
# 流程引擎
/usr/local/eflow/bin/startup.sh | tail -f /usr/local/eflow/logs/catalina.out
# 全部启动
/usr/local/eflow/bin/startup.sh | /usr/local/oa/bin/startup.sh | tail -f /usr/local/oa/logs/catalina.out
```

# 关闭 Tomcat

```bash
/usr/local/eflow/bin/shutdown.sh | /usr/local/oa/bin/shutdown.sh
# 关闭后检查java进程
ps aux|grep java
```



# 查看控制台打印

```bash
# oa
tail -f /usr/local/oa/logs/catalina.out
# 流程引擎
tail -f /usr/local/eflow/logs/catalina.out
```

# 创建软连接

```bash
ln -s /usr/local/oa/bin/startup.sh /usr/bin/oa
ln -s /usr/local/eflow/bin/startup.sh /usr/bin/eflow
ln -s /usr/local/oa/bin/shutdown.sh /usr/bin/oa-shutdown
ln -s /usr/local/eflow/bin/shutdown.sh /usr/bin/eflow-shutdown
```

# 启动与关闭

> 带上tail 表示实时Tomcat打印

```bash
oa | tail -f /usr/local/oa/logs/catalina.out
eflow | tail -f /usr/local/eflow/logs/catalina.out
oa-shutdown
eflow-shutdown
oa | eflow | tail -f /usr/local/oa/logs/catalina.out
```

# 更便捷地重启 Tomcat

### 配置 tomcat CATALINA_PID

在 bin/catalina.sh 中`PRGDIR=dirname "$PRG"`下方加入

```bash
CATALINA_PID=$PRGDIR/tomcat.pid
```

### 在 bin 目录下创建脚本

restart.sh

```bash
#!/bin/bash
curUser=$(whoami)
if [[ $curUser == "root" ]]; then
echo "user root can't execute this script!"
exit 0
fi

cd `dirname $0`

if [ -f ./tomcat.pid ]; then
echo "kill tomcat..."
kill -9 `cat ./tomcat.pid`
rm ./tomcat.pid
else
echo "tomcat is not running."
fi

echo "start tomcat..."
if [ ! -f ../logs/catalina.out ]; then
touch ../logs/catalina.out
chmod 775 ../logs/catalina.out
fi
echo $(date) > ../logs/catalina.out
nohup ./startup.sh &
tail -f ../logs/catalina.out
```

stop.sh

```bash
#!/bin/bash
cd `dirname $0`

if [ -f ./tomcat.pid ]; then
	echo "kill tomcat..."
	kill -9 `cat ./tomcat.pid`
	rm ./tomcat.pid
	echo "killed tomcat."
else
	ps aux | grep java
	echo "tomcat is not running?"
fi
```

> [!NOTE]
>
> 脚本必须为`unix`格式
>
> vim：命令`set ff=unix`
>
> notepad++：右下角确认编码为`Unix (LF)`，否则右键切换。

授权

```bash
chmod 700 restart.sh
chmod 700 stop.sh
```

> [!TIP]
>
> 重启脚本应由tomcat用户执行，可以防止：
>
> - 应用权限过高，如果存在安全漏洞会导致严重安全问题
> - 其他用户创建的 log 或生成的文件导致权限问题
>
> 所以设置了`700`或`744`权限，同时在脚本中判断禁止root执行。

# 问题

### 乱码

Linux 不存在控制台编码问题，项目 log4j.properties 和 Tomcat logging.properties 中的编码均配置为UTF-8

Windows 项目 log4j.properties 中的编码配置为GBK，Tomcat logging.properties 

```
java.util.logging.ConsoleHandler.encoding = UTF-8
```

### 启动提示增大缓存的最大空间

```log
资源添加到Web应用程序[]的缓存中，因为在清除过期缓存条目后可用空间仍不足 - 请 考虑增加缓存的最大空间
```

/conf/context.xml `Context`标签中添加

```xml
<Resources cachingAllowed="true" cacheMaxSize="100000" />
```
