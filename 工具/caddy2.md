# caddy2

> Most people use Caddy as a web server or proxy, but at its core, Caddy is a server of servers. With the [requisite modules](https://caddyserver.com/docs/modules/), it can take on the role of any long-running process!
>
> Configuration is both dynamic and exportable with [Caddy's API](https://caddyserver.com/docs/api). Although no config files required, you can still use them; most people's favorite way of configuring Caddy is using the [Caddyfile](https://caddyserver.com/docs/caddyfile). The format of the config document takes many forms with [config adapters](https://caddyserver.com/docs/config-adapters), but Caddy's native config language is [JSON](https://caddyserver.com/docs/json/).
>
> Caddy compiles for all major platforms and has no runtime dependencies.
>
> 大多数人使用 Caddy 作为 Web 服务器或代理，但从本质上讲，Caddy 是服务器的服务器。有了必要的模块，它可以承担任何长时间运行的流程的角色！
>
> 配置是动态的，并且可以通过 Caddy 的 API 导出。虽然不需要配置文件，但您仍然可以使用它们；大多数人最喜欢的配置 Caddy 的方法是使用 Caddyfile。配置文档的格式采用配置适配器的多种形式，但 Caddy 的本机配置语言是 JSON。
>
> Caddy 可以针对所有主要平台进行编译，并且没有运行时依赖性。
>
> [Welcome — Caddy Documentation (caddyserver.com)](https://caddyserver.com/docs/)

> - [Static binaries](https://caddyserver.com/docs/install#static-binaries)
> - [Debian, Ubuntu, Raspbian packages](https://caddyserver.com/docs/install#debian-ubuntu-raspbian)
> - [Fedora, RedHat, CentOS packages](https://caddyserver.com/docs/install#fedora-redhat-centos)
> - [Arch Linux, Manjaro, Parabola packages](https://caddyserver.com/docs/install#arch-linux-manjaro-parabola)
> - [Docker image](https://caddyserver.com/docs/install#docker)
>
> 下载：[Install — Caddy Documentation (caddyserver.com)](https://caddyserver.com/docs/install#static-binaries)

> 下载非常方便，可以选择平台，选择包含的插件，下载二进制文件，而不需要自己编译
>
> [Download Caddy (caddyserver.com)](https://caddyserver.com/download)

```bash
# 运行，默认配置文件为同目录的Caddyfile（但caddy.json不会被作为默认配置文件）
caddy run
# 后台运行
caddy start

# 带配置文件运行
caddy run --config caddy.json
```

```bash
# 转换Caddyfile为json
caddy adapt
caddy adapt --config Caddyfile

# 也可以启动后访问http://127.0.0.1:2019/config查看当前的配置文件
```

```bash
# 生成配置文件中的密码
caddy hash-password -plaintext password

# 也可以只用caddy hash-password，会提示你输入密码
```

# 添加为系统服务

```bash
# cmd
sc.exe create caddy start= auto binPath= "\"C:\Program Files\Caddy\caddy.exe\" run"
# 删除
sc.exe delete caddy

# Powershell
New-Service -Name "caddy" -StartupType Automatic -BinaryPathName '"C:\Program Files\Caddy\caddy.exe" run'
```



# webdav

插件：[github.com/mholt/caddy-webdav](https://github.com/mholt/caddy-webdav)

```bash
{
	order webdav last
}
# 运行端口为2016
:2016 {
	# /files/路径作为浏览器访问入口（此处应该只是普通的http文件服务）
    handle_path /files/* {
        file_server {
			root E:/
            browse
        }
    }
    # 重写/files为/files/，否则/files不会被上面的handle拦截到
	redir /files /files/

	# 根目录作为webdav服务入口，访问E:\下的文件
    handle /* {
		webdav {
			root E:/
			prefix /
		}
	}

	# /Downloads/为下载目录服务入口，访问下载文件夹
    handle /Downloads/* {
		webdav {
			root C:\Users\lymly\Downloads
			prefix /Downloads
		}
	}
	redir /Downloads /Downloads/

	# 用户名和密码
	basicauth /* {
		test $2a$14$TZbfjwigowegioojiweolgrH1oUVHrnPIcr2XWzAOq8EWHJRtQCU2
	}
}
```

> [!TIP]
>
> webdav中的虚拟目录映射，即配置中`/Downloads/`一段，在根目录`/*`指向的`E:\`中创建一个名为`Downloads`的目录，webdav客户端访问根目录时，进入`Downloads`文件夹，会被`/Downloads/`拦截到，从而访问下载文件夹的内容，实现类似 ftp 虚拟目录的效果。

> [使用Caddy2作为文件服务器 - 简书 (jianshu.com)](https://www.jianshu.com/p/10d0d31bd1a0)
>
> [使用 Caddy 搭建 WebDAV 服务器（Windows, Linux 等全平台通用） - LY 的博客 (young-lord.github.io)](https://young-lord.github.io/posts/caddy-webdav)