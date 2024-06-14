# Moonlight

# 编译 iperf-3.17.1

##### 创建一个新的 Android 空工程，选 no Activity

app build.gradle

```gradle
plugins {
    alias(libs.plugins.android.application)
}

android {
    namespace 'com.example.myapplication'
    compileSdk 34

    defaultConfig {
        applicationId "com.example.myapplication"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    
    # 加上ndk配置
    ndkVersion "22.0.7026061"

    externalNativeBuild{
        ndkBuild{
            path file("src/main/jni/Android.mk")
        }
    }
}

dependencies {

    implementation libs.appcompat
    implementation libs.material
    testImplementation libs.junit
    androidTestImplementation libs.ext.junit
    androidTestImplementation libs.espresso.core
}
```

##### 在 ubuntu 上下载源码，如 wsl 的 ubuntu

```
wget https://downloads.es.net/pub/iperf/iperf-3.17.1.tar.gz
tar -zxvf iperf-3.17.1.tar.gz
```

> [davidBar-On/android-iperf3: Pre-compiled iperf3 binaries for Android + Dockerfile with SDK and NDK for manual build (github.com)](https://github.com/davidBar-On/android-iperf3/tree/master)

##### 生成必要的头文件

```bash
# 安装gcc
sudo apt install gcc
# configure
cd iperf-3.17.1
./configure
```

> iPerf 源码中 iperf_config.h 和 version.h 两个头文件是由 configure 脚本生成的，所以我们还是要和上面一样在源码根目录执行 ./configure，不过这里可以不用加参数了，因为我们只是用它生成必要的头文件，不会再用它生成的 Makefile 进行编译。
>
> ```bash
> $ ./configure
> ```

##### 将源码目录拷到 app\src\main\jni 下

app\src\main\jni\iperf-3.17.1

##### 添加 Android.mk

创建 app\src\main\jni\Android.mk

此处可以参考官方 Android 项目 [android-iperf3/iperf-3.17.1/Android.mk at master - iperf-3.17.1/Android.mk · davidBar-On/android-iperf3 (github.com)](https://github.com/davidBar-On/android-iperf3/blob/master/iperf-3.17.1/Android.mk)

```bash
LOCAL_PATH := $(call my-dir)
include $(CLEAR_VARS)
LOCAL_MODULE := iperf3.17.1
LOCAL_MODULE_PATH := $(TARGET_OUT_OPTIONAL_EXECUTABLES)
LOCAL_SRC_FILES := \
		iperf-3.17.1/src/cjson.c \
		iperf-3.17.1/src/dscp.c \
		iperf-3.17.1/src/iperf_api.c \
		iperf-3.17.1/src/iperf_auth.c \
		iperf-3.17.1/src/iperf_client_api.c \
		iperf-3.17.1/src/iperf_error.c \
		iperf-3.17.1/src/iperf_locale.c \
		iperf-3.17.1/src/iperf_sctp.c \
		iperf-3.17.1/src/iperf_server_api.c \
		iperf-3.17.1/src/iperf_tcp.c \
		iperf-3.17.1/src/iperf_time.c \
		iperf-3.17.1/src/iperf_udp.c \
		iperf-3.17.1/src/iperf_util.c \
		iperf-3.17.1/src/iperf_pthread.c \
		iperf-3.17.1/src/main.c \
		iperf-3.17.1/src/net.c \
		iperf-3.17.1/src/tcp_info.c \
		iperf-3.17.1/src/timer.c \
		iperf-3.17.1/src/units.c \

LOCAL_CFLAGS += -pie -fPIE -fPIC -s
LOCAL_C_INCLUDES += $(LOCAL_PATH)/iperf-3.17.1/src
include $(BUILD_EXECUTABLE)
```

##### build

```bash
cd app/src/main/jni
D:\tools\Android\Sdk\ndk\22.0.7026061\ndk-build.cmd
```

> 清楚 ndk 构建
>
> ```bash
> D:\tools\Android\Sdk\ndk\22.0.7026061\ndk-build.cmd clean
> ```

# 报错

##### 打包报错

```log
4: Task failed with an exception.
-----------
* What went wrong:
Execution failed for task ':app:buildNdkBuildRelease[x86_64]-2'.
> com.android.ide.common.process.ProcessException: C++ build system [build] failed while executing:
      @echo off
      "D:\\tools\\Android\\Sdk\\ndk\\26.2.11394342\\ndk-build.cmd" ^
        "NDK_PROJECT_PATH=null" ^
        "APP_BUILD_SCRIPT=D:\\projectsAlpha\\moonlight-android\\app\\src\\main\\jni\\Android.mk" ^
        "NDK_APPLICATION_MK=D:\\projectsAlpha\\moonlight-android\\app\\src\\main\\jni\\Application.mk" ^
        "APP_ABI=x86_64" ^
        "NDK_ALL_ABIS=x86_64" ^
        "NDK_DEBUG=0" ^
        "APP_PLATFORM=android-21" ^
        "NDK_OUT=D:\\projectsAlpha\\moonlight-android\\app\\build\\intermediates\\cxx\\Release\\162c612r/obj" ^
        "NDK_LIBS_OUT=D:\\projectsAlpha\\moonlight-android\\app\\build\\intermediates\\cxx\\Release\\162c612r/lib" ^
        "PRODUCT_FLAVOR=nonRoot" ^
        moonlight-core
    from D:\projectsAlpha\moonlight-android\app
  ????????????��????
```

```
SDK processing. This version only understands SDK XML versions up to 3 but an SDK XML file of version 4 was encountered. T
```

clean

重新安装 ndk，在 SDK Manager 中取消勾选 SDK 和 NDK，重新 build 让它自动下载。

