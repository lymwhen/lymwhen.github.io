# git

# 初次配置

```bash
git config --global user.name "lyml"
git config --global user.email "1074325187@qq.com"
```

生成 SSH Key

```bash
ssh-keygen -o
cat ~/.ssh/id_rsa.pub
```

将公钥配置到 git 服务器

# 新工程提交到git

```bash
git init
git remote add origin git@github.com:haiyiya/ddd.git
git add .
git commit -m "init"
git push -u origin master
```

# 命令

```bash
# 暂存所有文件
git add <file>
git add .
# 取消暂存的文件
git reset <file>
git reset
# 提交
git commit -m 'init'
# 拉取
git pull origin master
# # 推送（-u 表示下次可以使用 git push 推送到上次的远程地址）
git push -u origin master
# 强制推送（本地仓库覆盖远程）
git push -f origin master

# 回滚到某一版本（提交），本地资源库回到某一版本
git reset --hard 752c8cf43498a64488fd560cd22e72d2aa361e87
# 重置为本地的最新版本
git reset --hard head
# 回滚到某一版本（提交），本地 commit 被撤回
git reset --soft 752c8cf43498a64488fd560cd22e72d2aa361e87

# 查看提交记录（按 q 退出）
git log
# 查看远程地址
git remote -v
# 查看远程分支，红色为所在分支
git branch -a
# 查看修改内容
git status

# 添加远程地址
git remote add origin git@github.com:haiyiya/ddd.git
# 删除远程地址
git remote remove origin

# 添加safe文件夹
git config --global --add safe.directory D:/projects/jds_web/nzxxx_jwt
```

# 冲突处理

自己修改过的文件，其它人也修改并且提交了

```bash
# 查看本地修改的文件
git status
# 拉取
git pull

# 若报错
# 暂存、提交
git add .
git commit -m ''
# 拉去
git pull
# 处理冲突信息
# 在编辑器中合并或者手动处理<<<< HEAD 本地修改 ======= 远程修改 >>>>>>块

# 提交合并
git add .
git commit -m 'merge'
git push
```

> [git上多人对同一文件修改，发生冲突，如何合并_dair6的博客-CSDN博客_git 2个人同时改了一个文件,要同时合并dev,但相互又不能合并](https://blog.csdn.net/dair6/article/details/120724629)

# 大小写不敏感问题

git 默认大小写不敏感，修改文件名大小写提交的办法

```bash
# 重命名：Index.html -> 1Index.html
git add .
# 重命名：1Index.html -> index.html
git add .
```

或使用 git 命令

```bash
git mv -f src/views/List/Home.vue  src/views/list/Home.vue
git mv -f src/views/List/About.vue  src/views/list/About.vue
```

# 取消文件追踪

```bash
# 取消文件追踪
git rm -r cached .metadata
# 删除本地文件（也可以不删除）
git rm -r --f .metadata
```

每次使用git status 查看状态时总是会列出被跟踪的文件，可以通过 .gitignore文件来达到目的，在 .gitignore 文件中添加：

```
/.metadata
```



# 使用旧项目创建新项目保留提交记录

```bash
git remote remove origin
git remote add origin 新 git 地址
git push -u master origin
```

# 撤回push

```bash
git log 查看提交记录（按q退出）
本地回滚
git reset --soft 752c8cf43498a64488fd560cd22e72d2aa361e87
覆盖线上（覆盖后线上即无法看到之后的提交了）
git push -f origin master
重新 commit、push
```

> 如果仅是 commit，未 push，则 push 不需要 -f

# 撤回合并

`git reset --soft`提示

```bash
Cannot do a soft reset in the middle of a merge
```

```bash
git reset --merge
git reset --soft 752c8cf43498a64488fd560cd22e72d2aa361e87
```

# 将分支更新到 master

```bash
# 查看分支（当前分支有*号和绿色标注）
git branch
# 删除分支
git branch -D master
# 切换到分支
git checkout release
# 更新当前分支到master
git checkout -b master
```

# 使用代理

```bash
# 查询代理
git config --get --global http.proxy
# 设置代理
git config --global http.proxy 127.0.0.1:10809
# 单个项目设置代理
git config http.proxy 127.0.0.1:10809
# 取消
git config --unset --global http.proxy

# 关闭https证书校验
git config --global http.sslVerify false

# 替换git协议为http（待求证）
git config --global url."https://".insteadOf git://
```

> [!NOTE]
>
> http.proxy仅用于代理用于http协议，即远程链接为`https://`时

> Git支持四种协议 1 ，而除本地传输外，还有：git://, ssh://, 基于HTTP协议，这些协议又被分为哑协议（HTTP协议）和智能传输协议。对于这些协议，要使用代理的设置也有些差异：
>
> 1. 使用 `git协议` 时，设置代理需要配置 `core.gitproxy`
> 2. 使用 `HTTP协议` 时，设置代理需要配置 `http.proxy`
> 3. 而是用 `ssh协议` 时，代理需要配置ssh的 `ProxyCommand` 参数
>
> [Windows下git设置代理服务器 - wavemelody - 博客园 (cnblogs.com)](https://www.cnblogs.com/mymelody/p/6132728.html)

# Tree

> 安装 tree：[Windows下如何使用tree命令生成目录树 - 简书 (jianshu.com)](https://www.jianshu.com/p/7002eee46561)

git bash 的 tree 要比 windows 自带的 tree 要强大得多

```bash
tree src
# 显示3层
tree -L 3
tree src -L 3
```



# eclipse

### push/pull报错，命令行正常

eclipse 的 git 插件版本太高

Help - Install New Softwares - already installed

搜索 git，卸载 Git integration for Eclipse 开头的插件（它们的版本号是一样的）

如 5.11.0 -> 5.7.0

Install New Softwares - add - 2020-03 http://download.eclipse.org/releases/2020-03

搜索 git，安装上面卸载的插件（Git integration for Eclipse 开头的插件，注意版本号变为了5.7.0）

### pull报错 Nothing to fetch

打开 Git Repositories 窗口，检查配置

```ini
[core]
repositoryformatversion = 0
filemode = false
logallrefupdates = true
[branch "master"]
remote = origin
merge = refs/heads/master
rebase = false
[remote "origin"]
url = git@codeup.aliyun.com:chunshu/yyzhxy.git
fetch = +refs/heads/*:refs/remotes/origin/*
```

### author/commiter不对

git 用户配置不对

```bash
git config --global user.name "lyml"
git config --global user.email "10743187@qq.com"
```

