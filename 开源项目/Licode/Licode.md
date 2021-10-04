# Licode

An Open Source WebRTC Communications Platform.

With Licode you can host your own WebRTC conference provider and build applications on top of it with easy to use APIs: [client-side](http://licode.readthedocs.io/en/master/client_api/) and [server-side](http://licode.readthedocs.io/en/master/server_api/).

### Building your own conference provider.

##### Erizo

> It's the WebRTC Multipoint Control Unit (MCU). It's written in C++ and is 100% compatible with WebRTC standard and its protocols.

 WebRTC 多点控制单元 （MCU），用C++编写，100% 符合 WebRTC 标准及其协议。

##### Erizo API

> A Node.js addon wrapper for Erizo. It configures and manages all aspects of Erizo from your Node.js applications!

node.js的附加包装，从node.js应用程序配置和管理 Erizo 的所有方面

##### Erizo Controller

> It's the core of the service. It provides Rooms to users in order to make multiconference sessions. It also supplies enough security mechanisms and additional capabilities: data, user lists, events, and so on.

服务的核心，为用户提供房间以进行多会议回话，提供足够的安全机制和附加功能：数据、用户列表、事件等。

##### Nuve

> This videoconference management API offers Room management, Users access control and service registration to third-party applications. It also provides Cloud scalability to the service.

视频会议管理 API，为第三方应用程序提供房间管理、用户访问控制和服务注册。它还为服务提供云可扩展性。

> 官网：[Licode (lynckia.com)](http://lynckia.com/licode/)
>
> github：[lynckia/licode: Open Source Communication Provider based on WebRTC and Cloud technologies (github.com)](https://github.com/lynckia/licode)
>
> 安装手册：[From Source - Documentation (licode.readthedocs.io)](https://licode.readthedocs.io/en/master/from_source/)



# Overview

This guide will guide you through the basics of getting a Licode instance with a basic videoconferencing application up and running.

# Prerequisites

Licode installation from source is officially compatible with **Ubuntu 20.04**.

We do maintain compatibility with **Mac OS X** for **development and testing purposes**.

| Ubuntu 20.04 | Mac OS X > 10.11         |
| :----------- | :----------------------- |
| git          | Xcode Command Line Tools |
|              | git                      |

# Clone Licode

Let's start by cloning the Licode repository

```
git clone https://github.com/lynckia/licode.git
cd licode
```

The repository contains scripts for the rest of the steps of this guide.

# Install dependencies

This step installs the dependencies of all the Licode components. This is the only step that depends on your OS

#### Ubuntu

```
./scripts/installUbuntuDeps.sh
```

#### Mac OS X

```
./scripts/installMacDeps.sh
```

# Install Licode

Here we will install all the Licode components in your computer.

```
./scripts/installNuve.sh
./scripts/installErizo.sh
```

# Install basicExample

The basicExample is a really simple node-based web application that relies on Licode to provide a videoconferencing room.

```
./scripts/installBasicExample.sh
```

# Start Licode!

At this points, you have successfully installed all the Licode components in your computer and also a simple application that will let you try it. Let's use the convenience script to start all Licode components:

```
./scripts/initLicode.sh
```

After that, we just have to start our node application, we also have a script for that:

```
./scripts/initBasicExample.sh
```

**Now you can connect to \*http://localhost:3001\* with Chrome or Firefox and test your basic videoconference example!**

# What's next?

Well you now have a taste of what Licode can do. You can start by modifying basicExample. You can find the code in `licode/extras/basic_example`: * `basicServer.js` is the node.js server that manages the communication between the clients and Nuve. Here you can add your own methods using the server side API (NuveAPI)

Head to [Licode Architecture](https://licode.readthedocs.io/en/master/) for more information about different Licode components, or start developing your custom service getting into the client or server APIs.