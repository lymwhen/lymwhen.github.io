# 集成 Quartz

Spring Boot 配置参考：[quartz（四）如何在job中使用spring自动注入 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/341155330)

> Quartz is a [richly featured](http://www.quartz-scheduler.org/documentation/2.4.0-SNAPSHOT/introduction.html#features), open source job scheduling library that can be integrated within virtually any Java application - from the smallest stand-alone application to the largest e-commerce system. Quartz can be used to create simple or complex schedules for executing tens, hundreds, or even tens-of-thousands of jobs; jobs whose tasks are defined as standard Java components that may execute virtually anything you may program them to do. The Quartz Scheduler includes many enterprise-class features, such as support for JTA transactions and clustering.
>
> [Quartz Enterprise Job Scheduler (quartz-scheduler.org)](http://www.quartz-scheduler.org/)
>
> [教程 Tutorials (quartz-scheduler.org)](https://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/)
>
> [示例 Examples (quartz-scheduler.org)](https://www.quartz-scheduler.org/documentation/quartz-2.3.0/examples/)
>
> [说明书 Cookbook (quartz-scheduler.org)](https://www.quartz-scheduler.org/documentation/quartz-2.3.0/cookbook/)

> ### Jobs and Triggers
>
> A Job is a class that implements the ***Job\*** interface, which has only one simple method:
>
> **The Job Interface**
>
> ```java
> package org.quartz;
> 
> public interface Job {
> 
>  public void execute(JobExecutionContext context)
>    throws JobExecutionException;
> }
> ```
>
> When the Job’s trigger fires (more on that in a moment), the execute(..) method is invoked by one of the scheduler’s worker threads. The *JobExecutionContext* object that is passed to this method provides the job instance with information about its “run-time” environment - a handle to the Scheduler that executed it, a handle to the Trigger that triggered the execution, the job’s JobDetail object, and a few other items.
>
> The *JobDetail* object is created by the Quartz client (your program) at the time the Job is added to the scheduler. It contains various property settings for the Job, as well as a *JobDataMap*, which can be used to store state information for a given instance of your job class. It is essentially the definition of the job instance, and is discussed in further detail in the next lesson.
>
> *Trigger* objects are used to trigger the execution (or ‘firing’) of jobs. When you wish to schedule a job, you instantiate a trigger and ‘tune’ its properties to provide the scheduling you wish to have. Triggers may also have a JobDataMap associated with them - this is useful to passing parameters to a Job that are specific to the firings of the trigger. Quartz ships with a handful of different trigger types, but the most commonly used types are SimpleTrigger and CronTrigger.
>
> SimpleTrigger is handy if you need ‘one-shot’ execution (just single execution of a job at a given moment in time), or if you need to fire a job at a given time, and have it repeat N times, with a delay of T between executions. CronTrigger is useful if you wish to have triggering based on calendar-like schedules - such as “every Friday, at noon” or “at 10:15 on the 10th day of every month.”
>
> Why Jobs AND Triggers? Many job schedulers do not have separate notions of jobs and triggers. Some define a ‘job’ as simply an execution time (or schedule) along with some small job identifier. Others are much like the union of Quartz’s job and trigger objects. While developing Quartz, we decided that it made sense to create a separation between the schedule and the work to be performed on that schedule. This has (in our opinion) many benefits.
>
> For example, Jobs can be created and stored in the job scheduler independent of a trigger, and many triggers can be associated with the same job. Another benefit of this loose-coupling is the ability to configure jobs that remain in the scheduler after their associated triggers have expired, so that that it can be rescheduled later, without having to re-define it. It also allows you to modify or replace a trigger without having to re-define its associated job.
>
> [Tutorial 2 (quartz-scheduler.org)](https://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/tutorial-lesson-02.html)
>
> [Quartz学习笔记（二）Job、JobDetail、JobDataMap__飞飞飞飞的博客-CSDN博客](https://blog.csdn.net/qq_38846242/article/details/88650112)

# pom.xml

```xml
<!-- https://mvnrepository.com/artifact/org.quartz-scheduler/quartz -->
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz</artifactId>
    <version>2.3.2</version>
</dependency>

<!-- https://mvnrepository.com/artifact/org.quartz-scheduler/quartz -->
<dependency>
    <groupId>org.quartz-scheduler</groupId>
    <artifactId>quartz</artifactId>
    <version>2.3.2</version>
</dependency>
```

# quartz.properties

```properties
org.quartz.scheduler.instanceName=learn-quartz-SpringMVC
org.quartz.scheduler.instanceId=AUTO
org.quartz.threadPool.threadCount=20

org.quartz.jobStore.class=org.quartz.impl.jdbcjobstore.JobStoreTX
org.quartz.jobStore.driverDelegateClass=org.quartz.impl.jdbcjobstore.StdJDBCDelegate
org.quartz.jobStore.useProperties=true
org.quartz.jobStore.misfireThreshold=60000
# 数据表前缀
org.quartz.jobStore.tablePrefix=QRTZ_
org.quartz.plugin.shutdownHook.class=org.quartz.plugins.management.ShutdownHookPlugin
org.quartz.plugin.shutdownHook.cleanShutdown=TRUE
```

> [Tutorial 9 (quartz-scheduler.org)](https://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/tutorial-lesson-09.html)

# dispatcher-servlet.xml

```xml
<!-- 创建SchedulerFactoryBean -->  
<bean id="schedulerFactoryBean" class="org.springframework.scheduling.quartz.SchedulerFactoryBean">  
    <property name="dataSource" ref="dataSource"/>  
    <property name="schedulerName" value="scheduler-spring-mvc"/>  
    <!--可选，QuartzScheduler 启动时更新己存在的Job，这样就不用每次修改targetObject后删除qrtz_job_details表对应记录了 -->  
    <property name="overwriteExistingJobs" value="true"/>  
    <!--可以在web关闭的时候关闭线程-->  
    <property name="waitForJobsToCompleteOnShutdown" value="true"/>  
    <property name="configLocation" value="WEB-INF/quartz.properties"/>
</bean>
```

# 集群配置

```properties
org.quartz.jobStore.isClustered=true
org.quartz.scheduler.instanceId=AUTO
org.quartz.threadPool.threadCount=50
```



> ### Clustering
>
> Clustering currently works with the JDBC-Jobstore (JobStoreTX or JobStoreCMT) and the TerracottaJobStore. Features include load-balancing and job fail-over (if the JobDetail’s “request recovery” flag is set to true).
>
> 集群已经可用于`JDBC-Jobstore`，包括负载均衡和故障转移等特性
>
> 将jobDetail 的`requestRecovery`标志位被设为`true`启动故障转移，指示`job`在遇到`recovery`或`fail-over`时将被重新执行
>
> \####Clustering With JobStoreTX or JobStoreCMT Enable clustering by setting the “org.quartz.jobStore.isClustered” property to “true”. Each instance in the cluster should use the same copy of the quartz.properties file. Exceptions of this would be to use properties files that are identical, with the following allowable exceptions: Different thread pool size, and different value for the “org.quartz.scheduler.instanceId” property. Each node in the cluster MUST have a unique instanceId, which is easily done (without needing different properties files) by placing “AUTO” as the value of this property.
>
> JobStoreTX 集群开启方式为`org.quartz.jobStore.isClustered=true`，集群的每一个实例应该使用相同的代码和配置文件，但允许每个实例设置不同的线程池、不同的实例id"`org.quartz.scheduler.instanceId`"。集群里的每一个节点必须有唯一的实例id，它可以被设置为`AUTO`，以便可以使用相同的配置文件。
>
> > Never run clustering on separate machines, unless their clocks are synchronized using some form of time-sync service (daemon) that runs very regularly (the clocks must be within a second of each other). See http://www.boulder.nist.gov/timefreq/service/its.htm if you are unfamiliar with how to do this.
> >
> > 运行集群必须保证时钟同步（在1秒之内）
>
> > Never fire-up a non-clustered instance against the same set of tables that any other instance is running against. You may get serious data corruption, and will definitely experience erratic behavior.
> >
> > 几个非集群实例使用相同的表会发生错误
>
> Only one node will fire the job for each firing. What I mean by that is, if the job has a repeating trigger that tells it to fire every 10 seconds, then at 12:00:00 exactly one node will run the job, and at 12:00:10 exactly one node will run the job, etc. It won’t necessarily be the same node each time - it will more or less be random which node runs it. The load balancing mechanism is near-random for busy schedulers (lots of triggers) but favors the same node that just was just active for non-busy (e.g. one or two triggers) schedulers.
>
> 每次触发只会发生在一个节点，负载均衡机制随机决定由哪个节点运行；但如果不繁忙的时候，更倾向于在同一个节点触发。
>
> \####Clustering With TerracottaJobStore Simply configure the scheduler to use TerracottaJobStore (covered in [Lesson 9: JobStores](https://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/tutorial-lesson-09.html)), and your scheduler will be all set for clustering.
>
> You may also want to consider implications of how you setup your Terracotta server, particularly configuration options that turn on features such as persistence, and running an array of Terracotta servers for HA.
>
> [Tutorial 11 (quartz-scheduler.org)](https://www.quartz-scheduler.org/documentation/quartz-2.3.0/tutorials/tutorial-lesson-11.html)

# Cron 表达式

> Cron expressions are comprised of 6 required fields and one optional field separated by white space. The fields respectively are described as follows:
>
> cron 表达式由6个必需字段和1个可选字段组成，使用空格隔开。
>
> | Field Name        |      | Allowed Values     |      | Allowed Special Characters |
> | ----------------- | ---- | ------------------ | ---- | -------------------------- |
> | `Seconds`         |      | `0-59`             |      | `, - * /`                  |
> | `Minutes`         |      | `0-59`             |      | `, - * /`                  |
> | `Hours`           |      | `0-23`             |      | `, - * /`                  |
> | `Day-of-month`    |      | `1-31`             |      | `, - * ? / L W`            |
> | `Month`           |      | `0-11 or JAN-DEC`  |      | `, - * /`                  |
> | `Day-of-Week`     |      | `1-7 or SUN-SAT`   |      | `, - * ? / L #`            |
> | `Year (Optional)` |      | `empty, 1970-2199` |      | `, - * /`                  |
>
> The '\*' character is used to specify all values. For example, "\*" in the minute field means "every minute".
>
> `*`表示所有值，如每一分钟
>
> The '?' character is allowed for the day-of-month and day-of-week fields. It is used to specify 'no specific value'. This is useful when you need to specify something in one of the two fields, but not the other.
>
> `?`表示没有特定的值，只用于`day-of-month`和`day-of-week`
>
> The '-' character is used to specify ranges For example "10-12" in the hour field means "the hours 10, 11 and 12".
>
> `-`表示范围，如10-12
>
> The ',' character is used to specify additional values. For example "MON,WED,FRI" in the day-of-week field means "the days Monday, Wednesday, and Friday".
>
> `,`表示多个附加值，如1,2，MON,WED,FRI
>
> The '/' character is used to specify increments. For example "0/15" in the seconds field means "the seconds 0, 15, 30, and 45". And "5/15" in the seconds field means "the seconds 5, 20, 35, and 50". Specifying '*' before the '/' is equivalent to specifying 0 is the value to start with. Essentially, for each field in the expression, there is a set of numbers that can be turned on or off. For seconds and minutes, the numbers range from 0 to 59. For hours 0 to 23, for days of the month 0 to 31, and for months 0 to 11 (JAN to DEC). The "/" character simply helps you turn on every "nth" value in the given set. Thus "7/6" in the month field only turns on month "7", it does NOT mean every 6th month, please note that subtlety.
>
> `/`表示起始/增量，
>
> The 'L' character is allowed for the day-of-month and day-of-week fields. This character is short-hand for "last", but it has different meaning in each of the two fields. For example, the value "L" in the day-of-month field means "the last day of the month" - day 31 for January, day 28 for February on non-leap years. If used in the day-of-week field by itself, it simply means "7" or "SAT". But if used in the day-of-week field after another value, it means "the last xxx day of the month" - for example "6L" means "the last friday of the month". You can also specify an offset from the last day of the month, such as "L-3" which would mean the third-to-last day of the calendar month. *When using the 'L' option, it is important not to specify lists, or ranges of values, as you'll get confusing/unexpected results.*
>
> The 'W' character is allowed for the day-of-month field. This character is used to specify the weekday (Monday-Friday) nearest the given day. As an example, if you were to specify "15W" as the value for the day-of-month field, the meaning is: "the nearest weekday to the 15th of the month". So if the 15th is a Saturday, the trigger will fire on Friday the 14th. If the 15th is a Sunday, the trigger will fire on Monday the 16th. If the 15th is a Tuesday, then it will fire on Tuesday the 15th. However if you specify "1W" as the value for day-of-month, and the 1st is a Saturday, the trigger will fire on Monday the 3rd, as it will not 'jump' over the boundary of a month's days. The 'W' character can only be specified when the day-of-month is a single day, not a range or list of days.
>
> The 'L' and 'W' characters can also be combined for the day-of-month expression to yield 'LW', which translates to "last weekday of the month".
>
> The '#' character is allowed for the day-of-week field. This character is used to specify "the nth" XXX day of the month. For example, the value of "6#3" in the day-of-week field means the third Friday of the month (day 6 = Friday and "#3" = the 3rd one in the month). Other examples: "2#1" = the first Monday of the month and "4#5" = the fifth Wednesday of the month. Note that if you specify "#5" and there is not 5 of the given day-of-week in the month, then no firing will occur that month. If the '#' character is used, there can only be one expression in the day-of-week field ("3#1,6#3" is not valid, since there are two expressions).
>
> 
>
> The legal characters and the names of months and days of the week are not case sensitive.
>
> **NOTES:**
>
> - Support for specifying both a day-of-week and a day-of-month value is not complete (you'll need to use the '?' character in one of these fields).
> - Overflowing ranges is supported - that is, having a larger number on the left hand side than the right. You might do 22-2 to catch 10 o'clock at night until 2 o'clock in the morning, or you might have NOV-FEB. It is very important to note that overuse of overflowing ranges creates ranges that don't make sense and no effort has been made to determine which interpretation CronExpression chooses. An example would be "0 0 14-6 ? * FRI-MON".
>
> [CronExpression (Quartz Enterprise Job Scheduler 2.3.0-SNAPSHOT API) (quartz-scheduler.org)](https://www.quartz-scheduler.org/api/2.3.0/org/quartz/CronExpression.html)
