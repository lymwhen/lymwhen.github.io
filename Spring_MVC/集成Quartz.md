# 集成 Quartz

Quartz is a [richly featured](http://www.quartz-scheduler.org/documentation/2.4.0-SNAPSHOT/introduction.html#features), open source job scheduling library that can be integrated within virtually any Java application - from the smallest stand-alone application to the largest e-commerce system. Quartz can be used to create simple or complex schedules for executing tens, hundreds, or even tens-of-thousands of jobs; jobs whose tasks are defined as standard Java components that may execute virtually anything you may program them to do. The Quartz Scheduler includes many enterprise-class features, such as support for JTA transactions and clustering.

[Quartz Enterprise Job Scheduler (quartz-scheduler.org)](http://www.quartz-scheduler.org/)

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

