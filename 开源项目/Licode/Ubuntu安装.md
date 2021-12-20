# Ubuntu 安装

### 从源代码安装 Licode 需要 Ubuntu 20.04 系统

用低版本安装时发现 mongod 需要 glibc-2.29

> 查看支持的 glibc 版本
>
> ```bash
> sudo apt install -y binutils
> strings /lib/x86_64-linux-gnu/libm.so.6|grep GLIBC_
> ```



> 20版本貌似没有`server`版，只有`live-server`版本，服务器离线安装只能用`desktop`版本了



# 更换 apt 源

```bash
# 安装vim
sudo apt install -y vim

# 更换源为阿里云
cd /etc/apt
sudo rm sources.list
sudo vim sources.list
deb http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-security main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-updates main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-proposed main restricted universe multiverse

deb http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ focal-backports main restricted universe multiverse
```

> [ubuntu镜像-ubuntu下载地址-ubuntu安装教程-阿里巴巴开源镜像站 (aliyun.com)](https://developer.aliyun.com/mirror/ubuntu?spm=a2c6h.13651102.0.0.3e221b11Oam5QW)

# clone 代码

```bash
cd ~
git clone https://github.com/lynckia/licode.git
cd licode
```

# 安装依赖

```bash
./scripts/installUbuntuDeps.sh
```

网络环境问题会导致安装失败，或者卡住的情况，可以切换网络后再次执行脚本

### 脚本的主要流程

```bash
set -e

SCRIPT=`pwd`/$0
FILENAME=`basename $SCRIPT`
PATHNAME=`dirname $SCRIPT`
# ~/licode
ROOT=$PATHNAME/..
# ~/licode/build
BUILD_DIR=$ROOT/build
CURRENT_DIR=`pwd`
# ~/licode/scripts/checkNvm.sh
NVM_CHECK="$PATHNAME"/checkNvm.sh

# ~/licode/build/libdeps
LIB_DIR=$BUILD_DIR/libdeps
# ~/licode/build/libdeps/build/
PREFIX_DIR=$LIB_DIR/build/
FAST_MAKE=''

# 7
gcc_version=0

# ...
# ...
# ...

parse_arguments $*

mkdir -p $PREFIX_DIR

check_sudo
install_apt_deps
install_mongodb
install_conan
check_proxy
install_openssl
install_libsrtp
install_opus
install_cpplint

if [ "$ENABLE_GPL" = "true" ]; then
  install_mediadeps
else
  install_mediadeps_nogpl
fi

if [ "$CLEANUP" = "true" ]; then
  echo "Cleaning up..."
  cleanup
fi
```

### mogondb

安装位置: `~/licode/build/libdeps/mongodb-linux-x86_64-ubuntu2004-4.4.4`

##### 启动

```bash
mongod --dbpath ~/licode/build/db --logpath ~/licode/build/mongo.log --fork
# ~/licode/build/libdeps/mongodb-linux-x86_64-ubuntu2004-4.4.4/bin/mongod --dbpath ~/licode/build/db --logpath ~/licode/build/mongo.log --fork
```

> 可打开`./scripts/installNuve.sh`查看 mongodb 的启动命令
>
> [linux下安装mongodb、启动、停止 - 简书 (jianshu.com)](https://www.jianshu.com/p/348615ebb7b6)

##### mongodb-linux-x86_64-ubuntu2004-4.4.4.tgz 下载失败

先下载 https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-4.4.4.tgz 放入`~/licode/build/libdeps`

在`./scripts/installUbuntuDeps.sh`中注释下载

```bash
install_mongodb(){
  if [ -d $LIB_DIR ]; then
    echo "Installing mongodb-org from tar"
    sudo apt-get install -y libcurl4 openssl liblzma5
    #wget -P $LIB_DIR https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-4.4.4.tgz
    tar -zxvf $LIB_DIR/mongodb-linux-x86_64-ubuntu2004-4.4.4.tgz -C $LIB_DIR
    sudo ln -s $LIB_DIR/mongodb-linux-x86_64-ubuntu2004-4.4.4/bin/* /usr/local/bin/
  else
    mkdir -p $LIB_DIR
    install_mongodb
  fi
}
```

重新执行脚本

### 重新执行脚本运行失败

如果执行到后面报错或者卡住，重新执行因为前面已经安装，可能报错中断，可观察成功执行到了哪里，注释前面的部分

如：

```bash
#check_sudo
#install_apt_deps
#install_mongodb
#install_conan
#check_proxy
#install_openssl
install_libsrtp
install_opus
install_cpplint
```

# 安装 Nvue

```bash
./scripts/installNuve.sh
```

### glibc-2.29

```bash
/lib/aarch64-linux-gnu/libm.so.6: version `GLIBC_2.29‘ not found
```

mongod 需要 glibc-2.29

> 查看支持的 glibc 版本
>
> ```bash
> sudo apt install -y binutils
> strings /lib/x86_64-linux-gnu/libm.so.6|grep GLIBC_
> ```

更换 Ubuntu 20.04

> 可在 Ubuntu 18.04 安装 glibc-2.29，不过没有成功
>
> [/lib/aarch64-linux-gnu/libm.so.6: version `GLIBC_2.29‘ not found_hongguo87的博客-CSDN博客](https://blog.csdn.net/hongguo87/article/details/118378891)

# 安装 Erizo

```bash
./scripts/installErizo.sh
```

### conan

Conan是一个分散的包管理器，具有客户端 - 服务器架构。这意味着客户端可以从不同的服务器（“远程”）获取软件包以及上传软件包，类似于git远程控制器的“git”推拉模型。

在较高的层面上，服务器只是包存储。他们不构建也不创建包。这些包由客户端创建，如果二进制文件是从源构建的，则该编译也由客户端应用程序完成。

##### 命令

```bash
# 仓库列表
conan remote list
# 移除仓库
conan remote remote conancenter
# 添加仓库
conan remote remote add conan-center https://center.conan.io
```

> https://docs.conan.io/en/latest/reference/commands/misc/remote.html

##### 报错：GCC OLD ABI COMPATIBILITY

根据提示修改 conan 配置文件

```bash
vim ~/.conan/profiles/default
# 修改为
compiler.libcxx=libstdc++1
```

##### 报错：ERROR: HTTPSConnectionPool(host='conan.bintray.com', port=443)

默认安装的1.34版本conan有bug，更换为1.40.3版本

```bash
sudo pip3 uninstall conan
sudo pip3 install conan==1.40.3
```

> 也可以在安装依赖前修改`./scripts/installUbuntuDeps.sh`脚本中的 conan 版本
>
> [Build error due to conan-center problem with LetsEncrypt cacert · Issue #1759 · lynckia/licode (github.com)](https://github.com/lynckia/licode/issues/1759)

# 启动

```bash
#初始化存储目录？
#mongod --repair --dbpath /home/lyml/licode/build/db
# 启动 mongodb
mongod --dbpath /home/lyml/licode/build/db --logpath /home/lyml/licode/build/mongo.log --fork
#~/licode/build/libdeps/mongodb-linux-x86_64-ubuntu2004-4.4.4/bin/mongod --dbpath ~/licode/build/db --logpath ~/licode/build/mongo.log --fork
# 启动licode
./scripts/initLicode.sh
# 启动示例
./scripts/initBasicExample.sh
```

访问示例程序：

http://127.0.0.1:3001

https://127.0.0.1:3004

### Licode 正常运行时的进程

```bash
rabbitmq    6950  0.4  1.0 5357184 85324 ?       Sl   Oct03   3:27 /usr/lib/erlang/erts-10.6.4/bin/beam.smp -W w -A 128 -MBas ageffcbf -MHas ageffcbf -MBlmbcs 512 -MHlmbcs 512 -MMmcs 30 -P 1048576 -t 5000000 -stbt db -zdbbl 128000 -K true -- -root /usr/lib/erlang -progname erl -- -home /var/lib/rabbitmq -- -pa /usr/lib/rabbitmq/lib/rabbitmq_server-3.8.2/ebin  -noshell -noinput -s rabbit boot -sname rabbit@ubuntu -boot start_sasl -kernel inet_default_connect_options [{nodelay,true}] -sasl errlog_type error -sasl sasl_error_logger false -rabbit lager_log_root "/var/log/rabbitmq" -rabbit lager_default_file "/var/log/rabbitmq/rabbit@ubuntu.log" -rabbit lager_upgrade_file "/var/log/rabbitmq/rabbit@ubuntu_upgrade.log" -rabbit feature_flags_file "/var/lib/rabbitmq/mnesia/rabbit@ubuntu-feature_flags" -rabbit enabled_plugins_file "/etc/rabbitmq/enabled_plugins" -rabbit plugins_dir "/usr/lib/rabbitmq/plugins:/usr/lib/rabbitmq/lib/rabbitmq_server-3.8.2/plugins" -rabbit plugins_expand_dir "/var/lib/rabbitmq/mnesia/rabbit@ubuntu-plugins-expand" -os_mon start_cpu_sup false -os_mon start_disksup false -os_mon start_memsup false -mnesia dir "/var/lib/rabbitmq/mnesia/rabbit@ubuntu" -ra data_dir "/var/lib/rabbitmq/mnesia/rabbit@ubuntu/quorum" -kernel inet_dist_listen_min 25672 -kernel inet_dist_listen_max 25672 --
lyml      153517  0.3  0.7 893696 58148 pts/0    Sl   03:31   0:08 node nuve.js
lyml      160055  0.0  0.5 660724 43388 pts/1    Sl   03:55   0:00 node erizoAgent.js
lyml      160421  0.2  0.6 744084 55208 pts/1    Sl   03:55   0:02 node erizoController.js
lyml      160746  0.0  0.5 857296 42496 pts/1    Sl   03:55   0:00 node basicServer.js
lyml      161907  5.3  0.7 3043988 59160 ?       Ssl  03:56   0:47 node ./../erizoJS/erizoJS.js 6fa7f46f-2ea4-6ac9-aba3-341076dbce96 192.168.86.132 192.168.86.132
lyml      168257  0.0  0.0   6388  2436 pts/1    S+   04:11   0:00 grep --color=auto node
```

# 部署到其他服务器

### 打包 licode 目录

```bash
cd ~
tar -zcvf licode.tar.gz licode licode
```

### 拷贝到其他服务器当前，解压

```bash
tar -zxvf licode.tar.gz
```

### 安装依赖

```bash
sudo apt install -y rabbitmq-server
sudo apt install -y libcurl4
sudo apt install -y coturn
```

> 根据`./scripts/installUbuntuDeps.sh`查看所需的依赖。

### 启动

```bash
#初始化存储目录？

# 启动turn
turnserver -o -a -f -v --mobility -m 100 --max-bps=100000 --min-port=32355 --max-port=65535 --user=nzjdsturn:bf10127Tku -r nzjdsturn
#mongod --repair --dbpath /home/lyml/licode/build/db
# 启动 mongodb
~/licode/build/libdeps/mongodb-linux-x86_64-ubuntu2004-4.4.4/bin/mongod --dbpath ~/licode/build/db --logpath ~/licode/build/mongo.log --fork
# 启动licode
./scripts/initLicode.sh
# 启动示例
./scripts/initBasicExample.sh
```



# ./scripts/installUbuntuDeps.sh

```bash
#!/usr/bin/env bash

set -e

SCRIPT=`pwd`/$0
FILENAME=`basename $SCRIPT`
PATHNAME=`dirname $SCRIPT`
ROOT=$PATHNAME/..
BUILD_DIR=$ROOT/build
CURRENT_DIR=`pwd`
NVM_CHECK="$PATHNAME"/checkNvm.sh

LIB_DIR=$BUILD_DIR/libdeps
PREFIX_DIR=$LIB_DIR/build/
FAST_MAKE=''

gcc_version=0

check_version(){
  if [[ $(lsb_release -rs) == "18.04" ]] || [[ $(lsb_release -rs) == "20.04" ]]
  then
     gcc_version=7
  else
     gcc_version=5
  fi
}

check_sudo(){
  if [ -z `command -v sudo` ]; then
    echo 'sudo is not available, will install it.'
    apt-get update -y
    apt-get install sudo
  fi
}

parse_arguments(){
  while [ "$1" != "" ]; do
    case $1 in
      "--enable-gpl")
        ENABLE_GPL=true
        ;;
      "--cleanup")
        CLEANUP=true
        ;;
      "--fast")
        FAST_MAKE='-j4'
        ;;
    esac
    shift
  done
}

check_proxy(){
  if [ -z "$http_proxy" ]; then
    echo "No http proxy set, doing nothing"
  else
    echo "http proxy configured, configuring npm"
    npm config set proxy $http_proxy
  fi

  if [ -z "$https_proxy" ]; then
    echo "No https proxy set, doing nothing"
  else
    echo "https proxy configured, configuring npm"
    npm config set https-proxy $https_proxy
  fi
}

install_nvm_node() {
  if [ -d $LIB_DIR ]; then
    export NVM_DIR=$(readlink -f "$LIB_DIR/nvm")
    if [ ! -s "$NVM_DIR/nvm.sh" ]; then
      git clone https://github.com/creationix/nvm.git "$NVM_DIR"
      cd "$NVM_DIR"
      git checkout `git describe --abbrev=0 --tags --match "v[0-9]*" origin`
      cd "$CURRENT_DIR"
    fi
    . $NVM_CHECK
    nvm install
  else
    mkdir -p $LIB_DIR
    install_nvm_node
  fi
}

install_apt_deps(){
  install_nvm_node
  nvm use
  npm install
  sudo apt-get update -y
  sudo apt-get install -qq python3-software-properties -y
  sudo apt-get install -qq software-properties-common -y
  sudo add-apt-repository ppa:ubuntu-toolchain-r/test -y
  sudo apt-get update -y
  check_version
  echo "Installing gcc $gcc_version"
  sudo apt-get install -qq git make gcc-$gcc_version g++-$gcc_version python3-pip libssl-dev cmake pkg-config rabbitmq-server curl autoconf libtool automake -y
  sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-$gcc_version 60 --slave /usr/bin/g++ g++ /usr/bin/g++-$gcc_version
  echo "done"


  sudo chown -R `whoami` ~/.npm ~/tmp/ || true
}

install_mongodb(){
  if [ -d $LIB_DIR ]; then
    echo "Installing mongodb-org from tar"
    sudo apt-get install -y libcurl4 openssl liblzma5
    wget -P $LIB_DIR https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu2004-4.4.4.tgz
    tar -zxvf $LIB_DIR/mongodb-linux-x86_64-ubuntu2004-4.4.4.tgz -C $LIB_DIR
    sudo ln -s $LIB_DIR/mongodb-linux-x86_64-ubuntu2004-4.4.4/bin/* /usr/local/bin/
  else
    mkdir -p $LIB_DIR
    install_mongodb
  fi
}

install_conan(){
  sudo pip3 install conan==1.34
}

install_cpplint(){
   sudo pip3 install cpplint==1.5.4
}



download_openssl() {
  OPENSSL_VERSION=$1
  OPENSSL_MAJOR="${OPENSSL_VERSION%?}"
  echo "Downloading OpenSSL from https://www.openssl.org/source/$OPENSSL_MAJOR/openssl-$OPENSSL_VERSION.tar.gz"
  curl -OL https://www.openssl.org/source/openssl-$OPENSSL_VERSION.tar.gz
  tar -zxvf openssl-$OPENSSL_VERSION.tar.gz
  DOWNLOAD_SUCCESS=$?
  if [ "$DOWNLOAD_SUCCESS" -eq 1 ]
  then
    echo "Downloading OpenSSL from https://www.openssl.org/source/old/$OPENSSL_MAJOR/openssl-$OPENSSL_VERSION.tar.gz"
    curl -OL https://www.openssl.org/source/old/$OPENSSL_MAJOR/openssl-$OPENSSL_VERSION.tar.gz
    tar -zxvf openssl-$OPENSSL_VERSION.tar.gz
  fi
}

install_openssl(){
  if [ -d $LIB_DIR ]; then
    cd $LIB_DIR
    OPENSSL_VERSION=`node -pe process.versions.openssl`
    if [ ! -f ./openssl-$OPENSSL_VERSION.tar.gz ]; then
      download_openssl $OPENSSL_VERSION
      cd openssl-$OPENSSL_VERSION
      ./config --prefix=$PREFIX_DIR --openssldir=$PREFIX_DIR -fPIC
      make $FAST_MAKE -s V=0
      make install_sw
    else
      echo "openssl already installed"
    fi
    cd $CURRENT_DIR
  else
    mkdir -p $LIB_DIR
    install_openssl
  fi
}

install_opus(){
  [ -d $LIB_DIR ] || mkdir -p $LIB_DIR
  cd $LIB_DIR
  if [ ! -f ./opus-1.1.tar.gz ]; then
    curl -L https://github.com/xiph/opus/archive/v1.1.tar.gz -o opus-1.1.tar.gz
    tar -zxvf opus-1.1.tar.gz
    cd opus-1.1
    ./autogen.sh
    ./configure --prefix=$PREFIX_DIR
    make $FAST_MAKE -s V=0
    make install
  else
    echo "opus already installed"
  fi
  cd $CURRENT_DIR
}

install_mediadeps(){
  install_opus
  sudo apt-get -qq install yasm libvpx. libx264.
  if [ -d $LIB_DIR ]; then
    cd $LIB_DIR
    if [ ! -f ./v11.9.tar.gz ]; then
      curl -O -L https://github.com/libav/libav/archive/v11.9.tar.gz
      tar -zxvf v11.9.tar.gz
      cd libav-11.9
      PKG_CONFIG_PATH=${PREFIX_DIR}/lib/pkgconfig ./configure --prefix=$PREFIX_DIR --enable-shared --enable-gpl --enable-libvpx --enable-libx264 --enable-libopus --disable-doc
      make $FAST_MAKE -s V=0
      make install
    else
      echo "libav already installed"
    fi
    cd $CURRENT_DIR
  else
    mkdir -p $LIB_DIR
    install_mediadeps
  fi

}

install_mediadeps_nogpl(){
  install_opus
  sudo apt-get -qq install yasm libvpx.
  if [ -d $LIB_DIR ]; then
    cd $LIB_DIR
    if [ ! -f ./v11.9.tar.gz ]; then
      curl -O -L https://github.com/libav/libav/archive/v11.9.tar.gz
      tar -zxvf v11.9.tar.gz
      cd libav-11.9
      PKG_CONFIG_PATH=${PREFIX_DIR}/lib/pkgconfig ./configure --prefix=$PREFIX_DIR --enable-shared --enable-libvpx --enable-libopus --disable-doc
      make $FAST_MAKE -s V=0
      make install
    else
      echo "libav already installed"
    fi
    cd $CURRENT_DIR
  else
    mkdir -p $LIB_DIR
    install_mediadeps_nogpl
  fi
}

install_libsrtp(){
  if [ -d $LIB_DIR ]; then
    cd $LIB_DIR
    curl -o libsrtp-2.1.0.tar.gz https://codeload.github.com/cisco/libsrtp/tar.gz/v2.1.0
    tar -zxvf libsrtp-2.1.0.tar.gz
    cd libsrtp-2.1.0
    CFLAGS="-fPIC" ./configure --enable-openssl --prefix=$PREFIX_DIR --with-openssl-dir=$PREFIX_DIR
    make $FAST_MAKE -s V=0 && make uninstall && make install
    cd $CURRENT_DIR
  else
    mkdir -p $LIB_DIR
    install_libsrtp
  fi
}

cleanup(){
  if [ -d $LIB_DIR ]; then
    cd $LIB_DIR
    rm -r libsrtp*
    rm -r libav*
    rm -r v11*
    rm -r openssl*
    rm -r opus*
    rm -r mongodb*.tgz
    cd $CURRENT_DIR
  fi
}

parse_arguments $*

mkdir -p $PREFIX_DIR

check_sudo
install_apt_deps
install_mongodb
install_conan
check_proxy
install_openssl
install_libsrtp
install_opus
install_cpplint

if [ "$ENABLE_GPL" = "true" ]; then
  install_mediadeps
else
  install_mediadeps_nogpl
fi

if [ "$CLEANUP" = "true" ]; then
  echo "Cleaning up..."
  cleanup
fi

```

# ./scripts/installNuve.sh

```bash
#!/usr/bin/env bash

set -e

SCRIPT=`pwd`/$0
FILENAME=`basename $SCRIPT`
PATHNAME=`dirname $SCRIPT`
ROOT=$PATHNAME/..
BUILD_DIR=$ROOT/build
CURRENT_DIR=`pwd`
DB_DIR="$BUILD_DIR"/db

check_result() {
  if [ "$1" -eq 1 ]
  then
    exit 1
  fi
}

install_nuve(){
  cd $ROOT/nuve
  ./installNuve.sh
  check_result $?
  cd $CURRENT_DIR
}

create_credentials(){
  mongo $dbURL --eval "db.services.insert({name: 'superService', key: '$RANDOM', rooms: []})"
  SERVID=`mongo $dbURL --quiet --eval "db.services.findOne()._id"`
  SERVKEY=`mongo $dbURL --quiet --eval "db.services.findOne().key"`
  SERVID=`echo $SERVID| cut -d'"' -f 2`
  SERVID=`echo $SERVID| cut -d'"' -f 1`
}
add_credentials(){
  RESULT=`mongo $dbURL --quiet --eval "db.services.insert({name: 'superService', _id: ObjectId('$SERVID'), key: '$SERVKEY', rooms: []})"`
  echo $RESULT
  NOTFOUND=`echo $RESULT | grep "writeError"`
  if [[ ! -z "$NOTFOUND" ]]; then
    SERVID=""
    SERVKEY=""
  fi
}

check_credentials(){
  RESULT=`mongo $dbURL --quiet --eval "db.services.find({name: 'superService', _id: ObjectId('$SERVID'), key: '$SERVKEY', rooms: []})"`
  echo $RESULT
  if [[ -z "$RESULT" ]]; then
    add_credentials
  fi
}

get_or_create_superservice_credentials(){
  if [[ -z "$SERVID" && -z "$SERVKEY" ]]; then
    create_credentials
  else
    check_credentials
  fi
}

populate_mongo(){

  if ! pgrep mongod; then
    echo [licode] Starting mongodb
    if [ ! -d "$DB_DIR" ]; then
      mkdir -p "$DB_DIR"/db
    fi
    mongod --repair --dbpath $DB_DIR
    mongod --dbpath $DB_DIR --logpath $BUILD_DIR/mongo.log --fork
    sleep 5
  else
    echo [licode] mongodb already running
  fi

  dbURL=`grep "config.nuve.dataBaseURL" $PATHNAME/licode_default.js`

  dbURL=`echo $dbURL| cut -d'"' -f 2`
  dbURL=`echo $dbURL| sed 's/mongodb:\/\///'`

  echo [licode] Creating superservice in $dbURL
  get_or_create_superservice_credentials

  if [[ -z "$SERVID" && -z "$SERVKEY" ]]; then
    echo "We could not get or create superservice credentials"
    exit 1
  else
    echo "We got superservice credentials"
  fi


  if [ -f "$BUILD_DIR/mongo.log" ]; then
    echo "Mongo Logs: "
    cat $BUILD_DIR/mongo.log
  fi

  echo [licode] SuperService ID $SERVID
  echo [licode] SuperService KEY $SERVKEY
  cd $BUILD_DIR
  replacement=s/_auto_generated_ID_/${SERVID}/
  sed $replacement $PATHNAME/licode_default.js > $BUILD_DIR/licode_1.js
  replacement=s/_auto_generated_KEY_/${SERVKEY}/
  sed $replacement $BUILD_DIR/licode_1.js > $ROOT/licode_config.js
  rm $BUILD_DIR/licode_1.js
}

install_nuve
populate_mongo

```

# ./scripts/installErizo.sh

```bash
#!/usr/bin/env bash

set -e

SCRIPT=`pwd`/$0
FILENAME=`basename $SCRIPT`
PATHNAME=`dirname $SCRIPT`
ROOT=$PATHNAME/..
BUILD_DIR=$ROOT/build
CURRENT_DIR=`pwd`
LIB_DIR=$BUILD_DIR/libdeps
PREFIX_DIR=$LIB_DIR/build/
NVM_CHECK="$PATHNAME"/checkNvm.sh
FAST_MAKE=''

NUM_CORES=1;
if [ "$(uname)" == "Darwin" ]; then
  NUM_CORES=$(sysctl -n hw.ncpu);
elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then
  NUM_CORES=$(grep -c ^processor /proc/cpuinfo);
fi

export ERIZO_HOME=$ROOT/erizo

usage()
{
cat << EOF
usage: $0 options

Compile erizo libraries:
- Erizo is the C++ core
- Erizo API is the Javascript layer of Erizo (require Erizo to be compiled)
- Erizo Controller implements the signaling, communication with clients and room management
- Spine is a node.js based Erizo client

OPTIONS:
   -h      Show this message
   -r      Compile Erizo (Only Release)
   -e      Compile Erizo (Release and Debug)
   -a      Compile Erizo API
   -c      Install Erizo node modules
   -d      Delete Erizo object files
   -f      Use 4 threads to build
   -s      Install Spine
   -t      Run Tests
EOF
}

pause() {
  read -p "$*"
}

check_result() {
  if [ "$1" -ne 0 ]
  then
    exit $1
  fi
}

install_erizo_release(){
  echo 'Installing erizo...'
  cd $ROOT/erizo
  cd utils/conan-include-paths
  conan export . lynckia/includes
  cd ../..
  if [ "$(uname)" == "Darwin" ]; then
    conan install . --build IncludePathsGenerator
  else
    conan install . --build IncludePathsGenerator -s compiler.libcxx=libstdc++11
  fi
  ./generateProject.sh -r
  ./buildProject.sh $FAST_MAKE
  if [ "$DELETE_OBJECT_FILES" == "true" ]; then
    ./cleanObjectFiles.sh
  fi
  check_result $?
  cd $CURRENT_DIR
}

install_erizo(){
  echo 'Installing erizo...'
  cd $ROOT/erizo
  cd utils/conan-include-paths
  conan export . lynckia/includes
  cd ../..
  if [ "$(uname)" == "Darwin" ]; then
    conan install . --build IncludePathsGenerator
  else
    conan install . --build IncludePathsGenerator -s compiler.libcxx=libstdc++11
  fi
  ./generateProject.sh
  ./buildProject.sh $FAST_MAKE
  if [ "$DELETE_OBJECT_FILES" == "true" ]; then
    ./cleanObjectFiles.sh
  fi
  check_result $?
  cd $CURRENT_DIR
}

install_erizo_api_release(){
  echo 'Installing erizoAPI...'
  cd $ROOT/erizoAPI
  . $NVM_CHECK
  nvm use
  $FAST_BUILD npm install --unsafe-perm -no_debug=1
  check_result $?
  cd $CURRENT_DIR
}

install_erizo_api(){
  echo 'Installing erizoAPI...'
  cd $ROOT/erizoAPI
  . $NVM_CHECK
  nvm use
  $FAST_BUILD npm install --unsafe-perm
  check_result $?
  cd $CURRENT_DIR
}

install_erizo_controller(){
  echo 'Installing erizoController...'
  cp $PATHNAME/rtp_media_config_default.js $ROOT/rtp_media_config.js
  cp $PATHNAME/bw_distributor_config_default.js $ROOT/bw_distributor_config.js
  cd $ROOT/erizo_controller
  ./installErizo_controller.sh
  check_result $?
  cd $CURRENT_DIR
}

install_spine(){
  echo 'Installing erizo_native_client...'
  cd $ROOT/spine
  ./installSpine.sh
  check_result $?
  cd $CURRENT_DIR
}

execute_tests(){
  echo 'Testing erizo...'
  cd $ROOT/erizo
  ./runTests.sh
  check_result $?
  cd $CURRENT_DIR
}

if [ "$#" -eq 0 ]
then
  install_erizo
  install_erizo_api
  install_erizo_controller
  install_spine
else
  while getopts “heEaAcstfd” OPTION
  do
    case $OPTION in
      h)
        usage
        exit 1
        ;;
      E)
        install_erizo_release
        ;;
      e)
        install_erizo
        ;;
      A)
        install_erizo_api_release
        ;;
      a)
        install_erizo_api
        ;;
      c)
        install_erizo_controller
        ;;
      s)
        install_spine
        ;;
      t)
        execute_tests
        ;;
      f)
        FAST_MAKE="-j$NUM_CORES"
        FAST_BUILD="env JOBS=$NUM_CORES"
        echo "Compiling using $NUM_CORES threads"
        ;;
      d)
        DELETE_OBJECT_FILES='true'
        ;;
      ?)
        usage
        exit
        ;;
    esac
  done
fi

```

# ./scripts/initLicode.sh

```bash
#!/usr/bin/env bash

SCRIPT=`pwd`/$0
FILENAME=`basename $SCRIPT`
PATHNAME=`dirname $SCRIPT`
ROOT=$PATHNAME/..
BUILD_DIR=$ROOT/build
CURRENT_DIR=`pwd`
EXTRAS=$ROOT/extras

export PATH=$PATH:/usr/local/sbin

if ! pgrep -f rabbitmq; then
  sudo echo
  sudo rabbitmq-server > $BUILD_DIR/rabbit.log &
  sleep 5
fi

cd $ROOT/nuve
./initNuve.sh

sleep 5

export ERIZO_HOME=$ROOT/erizo/

cd $ROOT/erizo_controller
./initErizo_controller.sh
./initErizo_agent.sh

echo [licode] Done, run ./scripts/initBasicExample.sh

```

# ./scripts/initBasicExample.sh

```bash
#!/usr/bin/env bash

set -e

SCRIPT=`pwd`/$0
FILENAME=`basename $SCRIPT`
PATHNAME=`dirname $SCRIPT`
ROOT=$PATHNAME/..
BUILD_DIR=$ROOT/build
CURRENT_DIR=`pwd`
NVM_CHECK="$PATHNAME"/checkNvm.sh

DB_DIR="$BUILD_DIR"/db
EXTRAS=$ROOT/extras

. $NVM_CHECK

cd $EXTRAS/basic_example

cp -r ${ROOT}/erizo_controller/erizoClient/dist/assets public/


nvm use
npm install --loglevel error
cd $CURRENT_DIR
```

