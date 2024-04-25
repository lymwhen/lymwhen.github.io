# cmd

```bash
cmd /?
启动 Windows 命令解释器的一个新实例

CMD [/A | /U] [/Q] [/D] [/E:ON | /E:OFF] [/F:ON | /F:OFF] [/V:ON | /V:OFF]
    [[/S] [/C | /K] string]

/C      执行字符串指定的命令然后终止
/K      执行字符串指定的命令但保留
/S      修改 /C 或 /K 之后的字符串处理(见下)
/Q      关闭回显
/D      禁止从注册表执行 AutoRun 命令(见下)
/A      使向管道或文件的内部命令输出成为 ANSI
/U      使向管道或文件的内部命令输出成为
        Unicode
/T:fg   设置前台/背景颜色(详细信息见 COLOR /?)
/E:ON   启用命令扩展(见下)
/E:OFF  禁用命令扩展(见下)
/F:ON   启用文件和目录名完成字符(见下)
/F:OFF  禁用文件和目录名完成字符(见下)
/V:ON   使用 ! 作为分隔符启用延迟的环境变量
        扩展。例如，/V:ON 会允许 !var! 在执行时
        扩展变量 var。var 语法会在输入时
        扩展变量，这与在一个 FOR
        循环内不同。
/V:OFF  禁用延迟的环境扩展。

注意，如果字符串加有引号，可以接受用命令分隔符 "&&"
分隔多个命令。另外，由于兼容性
原因，/X 与 /E:ON 相同，/Y 与 /E:OFF 相同，且 /R 与
/C 相同。任何其他开关都将被忽略。
```

```bash
cmd /c D:\tools\caddy\Caddyfile
# 路径中包含空格时
cmd /c " "D:\tools\caddy\caddy.exe" run --config "D:\tools\caddy\Caddyfile" "
```

# 实例

##### ADB

- 打开命令行
- 修改标题
- cd 到 ADB 目录
- 开头显示 ADB 版本

右键新建快捷方式，输入：

```bash
C:\Windows\System32\cmd.exe /K " title Android Debug Bridge & cd /d "D:\tools\platform-tools" & "D:\tools\platform-tools\adb.exe" version "
```

