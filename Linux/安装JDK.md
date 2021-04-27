# 安装 JDK

# 检查是否已安装

```bash
# 查询已安装的 jdk
rpm -qa | grep jdk
# 如果安装，全部卸载（除copy-jdk-configs）
# yum -y remove ...
rpm -e --nodeps ...
```



# 上传

使用 WinSCP 上传 JDK 到服务器 /usr/local/java/

```bash
# 解压
cd /usr/local/java
tar -zxvf jdk-8u261-linux-x64.tar.gz
```

# 配置环境变量

```
vi /etc/profile
```

在文件末尾添加如下配置：

```bash
export JAVA_HOME=/usr/local/java/jdk1.8.0_261
export JRE_HOME=${JAVA_HOME}/jre
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
```

使配置生效

```bash
source /etc/profile
```

# 检查 JDK

```bash
java -version
```

# 安装 bin 格式 JDK（1.6）

```bash
cd /usr/local/java
# 修改权限
chmod 777 jdk-6u45-linux-x64.bin
# 安装
./jdk-6u45-linux-x64.bin
```


