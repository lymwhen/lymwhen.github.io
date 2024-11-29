# 升级 OpenSSH

众所周知服务器扫描安全漏洞，一定一大堆 OpenSSH 高危漏洞:dog:。

下载 OpenSSH 和 OpenSSL 备用：

- [OpenSSH: Release Notes](https://www.openssh.com/releasenotes.html)
- [OpenSSL - Downloads | Library](https://openssl-library.org/source/)

### 安装依赖

```bash
# openssh
yum -y install pam-devel gcc zlib zlib-devel openssl-devel libselinux-devel
# openssl
yum install -y gcc gcc-c++ zlib-devel libtool autoconf automake perl perl-IPC-Cmd perl-Data-Dumper perl-CPAN
```



### 检查 openssl 是否满足 openssh 要求

```bash
tar -zxvf openssh-9.9p1.tar.gz
cd /tmp/openssh-9.9p1
./configure
checking for openssl... /bin/openssl
checking for openssl/opensslv.h... yes
checking OpenSSL header version... 100020bf (OpenSSL 1.0.2k  26 Jan 2017)
checking for OpenSSL_version... no
checking for OpenSSL_version_num... no
checking OpenSSL library version... configure: error: OpenSSL >= 1.1.1 required (have "100020bf (OpenSSL 1.0.2k-fips  26 Jan 2017)")
```

如果检查满足要求，则可以只升级 openssh，但是这两基本上是一起升级了，经常会有这些原因：

- openssl 版本过低
- openssl header 版本和 library 版本不一致
- openssl 1.X 版本和 3.X 版本共存，`openssl version`和 openssh `./configure`不一致

各种奇怪的原因，遇事不决，一起升级:dog:

# 升级 OpenSSL

```bash
# 解压源代码
tar -zxvf openssl-3.4.0.tar.gz
cd openssl-3.4.0
# 配置
./config --prefix=/usr/local/openssl-3.4.0 shared zlib-dynamic enable-ec_nistp_64_gcc_128
# 编译和安装，这里make的时间可能需要10分钟
make && make install

# 备份原openssl和库文件
mkdir -p /data/bak/20241120
mv /usr/lib64/libcrypto.so.3 /data/bak/20241120/
mv /usr/lib64/libssl.so.3 /data/bak/20241120/
mv /usr/bin/openssl /data/bak/20241120/
# 创建新openssl软链接
ln -s /usr/local/openssl-3.4.0/lib64/libcrypto.so.3 /usr/lib64/libcrypto.so.3
ln -s /usr/local/openssl-3.4.0/lib64/libssl.so.3 /usr/lib64/libssl.so.3
ln -s /usr/local/openssl-3.4.0/bin/openssl /usr/bin/openssl

# 将openssl bin目录添加到环境变量
vim /etc/profile
export PATH=$PATH:/usr/local/openssl-3.4.0/bin
source /etc/profile
# 查看版本
> openssl version
OpenSSL 3.4.0 22 Oct 2024 (Library: OpenSSL 3.4.0 22 Oct 2024)
```



# 升级 OpenSSH

```bash
# 解压源代码
tar -zxvf openssh-9.9p1.tar.gz
cd /tmp/openssh-9.9p1
# 配置，--with-ssl-dir配置openssl的安装目录/usr/local/openssl-3.4.0
./configure   --prefix=/usr   --sysconfdir=/etc/ssh    --with-md5-passwords   --with-pam --with-zlib   --with-tcp-wrappers    --with-ssl-dir=/usr/local/openssl-3.4.0   --without-hardening
# 编译
make
# 卸载原openssh，这里最好等到编译成功了，再卸载
rpm -e --nodeps `rpm -qa | grep openssh`
# 安装
chmod 600 /etc/ssh/ssh_host_rsa_key /etc/ssh/ssh_host_ecdsa_key /etc/ssh/ssh_host_ed25519_key
make install
# 复制二进制和pam
cp -a contrib/redhat/sshd.init  /etc/init.d/sshd
cp -a contrib/redhat/sshd.pam /etc/pam.d/sshd.pam
# 添加文件所有者（root）的执行权限
chmod u+x /etc/init.d/sshd
# 配置ssh，默认进制root远程登录、启用密码认证，符合安全要求
vim /etc/ssh/sshd_config
# 配置加密算法，添加到最后即可
Ciphers aes128-ctr,aes192-ctr,aes256-ctr
# 开机启动
chkconfig --add sshd
chkconfig sshd on
# 验证版本
> ssh -V
SSHp1, OpenSSL 3.4.0 22 Oct 2024
# 重新启动
systemctl restart sshd
```

> [!ATTENTION]
>
> 在卸载原 openssh 之后，将无法进行新的 ssh 连接，但不会影响已有的的连接，所以卸载之前，最好：
>
> - 确保 openssh 编译成功
> - 在网络稳定的环境
> - 多开一个 ssh 和 sftp 终端
>
> 如果中途意外断开，只能到物理服务器进行操作。