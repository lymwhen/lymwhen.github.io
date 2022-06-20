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
git add .
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
git config --global user.email "1074325187@qq.com"
```

