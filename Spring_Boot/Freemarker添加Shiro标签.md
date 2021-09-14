# Freemarker 添加 Shiro 标签



# 注入 FreeMarkerConfigurer 进行配置

```java
@Component
public class FreemarkerShiroTags {

    @Autowired
    private FreeMarkerConfigurer freeMarkerConfigurer;

    @PostConstruct
    public void setFreeMarkerShiroTags(){
        freemarker.template.Configuration cfg = freeMarkerConfigurer.getConfiguration();
        cfg.setSharedVariable("shiro", new ShiroTags());
    }
}
```

也可注入 Configuration 进行配置

```java
@Component
public class FreemarkerShiroTags {

    @Autowired
    private freemarker.template.Configuration configuration;

    @PostConstruct
    public void setFreeMarkerShiroTags(){
        configuration.setSharedVariable("shiro", new ShiroTags());
    }
}
```

也可定义 FreeMarkerConfigurer bean

```java
@Configuration
public class FreemarkerShiroTags {

    @Bean
    public FreeMarkerConfigurer freeMarkerConfigurer(){
        FreeMarkerConfigurer configurer = new FreeMarkerConfigurer();
        freemarker.template.Configuration cfg = configurer.getConfiguration();
        cfg.setSharedVariable("shiro", new ShiroTags());
        return configurer;
    }
}
```

> 此方法会使配置文件中的配置失效，所以其他配置项也要在此处配置