# 外网yum源

> [超简单配置阿里云yum源 - 简书 (jianshu.com)](https://www.jianshu.com/p/23729b982e82)

```bash
cd /etc/yum.repos.d
mkdir bak
mv CentOS-Base.repo ./bak

# 当前为 `/etc/yum.repos.d/`目录
wget http://mirrors.aliyun.com/repo/Centos-7.repo
# 或者 网易 源 
wget http://mirrors.163.com/.help/CentOS7-Base-163.repo
# 重命名
mv CentOS7-Base-163.repo CentOS-Base.repo
# 更新yum源
yum clean all
yum makecache
yum update
```

