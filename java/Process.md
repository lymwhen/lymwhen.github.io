# Process

> rocessBuilder.start() 和 Runtime.exec 方法创建本机进程并返回 Process 子类的实例，该实例可用于控制进程并获取有关进程的信息。 Process 类提供了从进程执行输入、向进程执行输出、等待进程完成、检查进程的退出状态以及销毁（终止）进程的方法。
>
> The [`ProcessBuilder.start()`](https://docs.oracle.com/javase/8/docs/api/java/lang/ProcessBuilder.html#start--) and [`Runtime.exec`](https://docs.oracle.com/javase/8/docs/api/java/lang/Runtime.html#exec-java.lang.String:A-java.lang.String:A-java.io.File-) methods create a native process and return an instance of a subclass of `Process` that can be used to control the process and obtain information about it. The class `Process` provides methods for performing input from the process, performing output to the process, waiting for the process to complete, checking the exit status of the process, and destroying (killing) the process.
>
> [Process (Java Platform SE 8 ) (oracle.com)](https://docs.oracle.com/javase/8/docs/api/java/lang/Process.html)

> [【精选】Java Runtime.exec()方法的使用（很实用）_~见贤思齐~的博客-CSDN博客](https://blog.csdn.net/junior77/article/details/115497020)

# 执行 shell 命令

```java
public static String cmdExec(String cmd, File dir) throws Exception{
    String[] cmdArr;
    if(OSUtils.getOS() == OSUtils.OS_WINDOWS) {
        cmdArr = new String[]{"cmd","/C", cmd};
    } else if (OSUtils.getOS() == OSUtils.OS_LINUX) {
        cmdArr = new String[]{"/bin/sh","-c", cmd};
    } else {
        throw new Exception("unsupported operate system");
    }
    return processExec(cmdArr, null, dir);
}

public static String processExec(String[] cmdArr, String[] envp, File dir) throws Exception{
    Process p = Runtime.getRuntime().exec(cmdArr, envp, dir);
    InputStream fis=p.getInputStream();
    InputStreamReader isr=new InputStreamReader(fis);
    BufferedReader br=new BufferedReader(isr);
    StringBuilder result = new StringBuilder();
    String line=null;
    while((line=br.readLine())!=null) {
        if (result.length() > 0) {
            result.append("\n");
        }
        result.append(line);
    }
    fis.close();
    return result.toString();
}
```

# 通过 node 执行 js 脚本



通过 node 执行 js 方法获得返回返回值

```java
node strEnc.js xxx 'xxx' ipca apex
```

##### java

```java
String tenderProjectCodeEnc = ProcessUtils.cmdExec(StringUtil.format("node strEnc.js {} \"{}\" ipca apex", code, StringUtil.getDateStr(new Date(), "yyyy-MM-dd HH")), new File("C:\\Users\\xxx\\Desktop\\test1"));
```

##### strEnc.js

```java
let args = process.argv.splice(2)

var des = require('./des')
// 通过console.log将结果输出给java
console.log(des.strEnc(args[0], args[1], args[2], args[3]))
```

> [Java使用cmd调用nodejs脚本_cmd访问node-CSDN博客](https://blog.csdn.net/qq_30038111/article/details/111085842)