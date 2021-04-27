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

# 乱码问题

Linux 不存在控制台编码问题，项目 log4j.properties 和 Tomcat logging.properties 中的编码均配置为UTF-8

Windows 项目 log4j.properties 中的编码配置为GBK，Tomcat logging.properties 

```
java.util.logging.ConsoleHandler.encoding = UTF-8
```

