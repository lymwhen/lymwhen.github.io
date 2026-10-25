# minikube

Minikube是k8s官方出品的一个开源工具，用于在本地开发环境中快速搭建一个单节点的Kubernetes集群。它支持多种虚拟化技术，在不同平台上都可以运行，如VirtualBox、Hyper-V、KVM等。

通过Minikube，开发人员可以方便地在本地环境中测试、构建和部署应用程序，并尝试不同的Kubernetes功能和配置。

### minikube 适合新手的核心理由

1. **隔离安全**：集群是独立环境，随便删资源、搞崩集群，一条 `minikube delete` 干净重置，不会弄坏宿主机的网络、服务
2. **配套工具对新手更友好**：`minikube dashboard` 一键打开图形面板；
3. **教程、案例最多**：网上 90% 的 K8s 入门教程、CKA 练习环境都是 minikube，踩坑时很容易搜到相同问题的解法
4. 驱动丰富：支持 docker、podman、hyperv、virtualbox，Windows/Mac/Linux 都很好适配
5. 大量一键 addon 插件：dashboard、ingress、metrics-server、registry；
6. `minikube service xxx-svc` 一键暴露 svc，可不经 ingress 直接访问 service
7. `minikube tunnel` 一键暴露 LoadBalancer，教程全网最多，CKA 学习首选

### Docker Compose 与 Kubernetes比较

| 项目   | Docker Compose                          | Kubernetes                                         |
| ------ | --------------------------------------- | -------------------------------------------------- |
| 定位   | 单机多容器编排，开发 / 小规模测试       | 集群编排，多节点、自愈、扩缩容、滚动更新、流量治理 |
| 故障   | 容器挂了不会自动重建；节点挂了全部寄    | 节点 / 容器异常自动调度重建                        |
| 扩缩容 | 手动改副本，重启                        | 一键扩缩、HPA 自动弹性                             |
| 流量   | 内部网络、端口映射，简单 Nginx 反向代理 | Service、Ingress、负载均衡、流量切分               |
| 配置   | env / env_file                          | ConfigMap、Secret，解耦更规范                      |
| 存储   | 本地 volume、bind mount                 | PV/PVC，存储抽象，和节点解耦                       |

一句话：**Compose 是 “在一台机器上把一堆容器跑起来”；K8s 是 “一批机器组成资源池，按声明保证服务持续运行”**。

### 基本概念

- Pod：最小调度单元，一个 / 多个紧耦合容器（相当于 Compose 里一个服务实例）
- Deployment：无状态应用（Java 服务、Nginx），管理 Pod 副本、滚动更新、回滚
- StatefulSet：有状态应用（MySQL、Redis，有稳定网络标识、持久存储）
- Service：给一组 Pod 提供**固定不变的访问入口 + 内置负载均衡，屏蔽 pod 漂移**（Pod IP 会变，Service IP 不变）
- Ingress：集群入口，七层反向代理（对应你熟悉的 Nginx）
- ConfigMap / Secret：配置、密钥，和镜像解耦
- Namespace：资源隔离，类似环境划分（dev/test/prod）
- Node：集群节点（minikube 单节点，只有一个 Node）
- Controller：控制器，Deployment 就是一种控制器

# 启动集群

### 安装

- 下载 minikube exe 打开安装：[minikube start | minikube 中文](https://minikube.kubernetes.ac.cn/docs/start/?arch=%2Fwindows%2Fx86-64%2Fstable%2F.exe+download)
- 下载 kubectl，添加到环境变量：[安装工具 | Kubernetes (K8s) 容器编排系统](https://kubernetes.ac.cn/docs/tasks/tools/)

> [!NOTE]
>
> 如果电脑上已安装 Docker Desktop，他会自带一个用不了的 kubectl，需要将刚刚下载的 kubectl path条目放在 Docker Desktop 之前，可以通过`where kubectl`验证是否处于顶部。

### 启动

```bash
# 启动集群，使用docker驱动
# 似乎在有docker desktop环境下，使用virtualbox驱动会失败
minikube start --driver=docker
# 删除集群
minikube delete

# 电脑重启后，可直接使用start启动
minikube start
```

```bash
# 查看集群信息
kubectl cluster-info
# 打开 minikube 内置 dashboard（可视化面板，非常适合新手）
minikube dashboard
```



> [!TIP]
>
> start、dashboard等过程都会拉镜像，最好在有科学环境下。如果启动报错、dashboard命令卡住，可尝试手动 pull 日志中的镜像。

### 基本操作

```bash
# 查看资源，默认是default命名空间
# pod=pods，deploy=deployments，svc=service
kubectl get pods
kubectl get deployments
kubectl get svc
# 同时查看多种
kubectl get deploy,pod,svc,ingress
kubectl get all
# 查看指定命名空间
kubectl get pod -n ingress-nginx
# 查看所有命名空间的资源
kubectl get pod -a
# 实时监听pod状态
kubectl get pod -n ingress-nginx -w

# 查看详情（排查问题，对应 docker inspect）
kubectl describe pod xxx

# 日志（对应 docker logs）
kubectl logs xxx

# 进入容器（对应 docker exec）
kubectl exec -it xxx -- /bin/sh

# 删除资源
kubectl delete pod xxx
kubectl delete deployment xxx

# 应用 yaml（声明式核心命令，重中之重）
kubectl apply -f xxx.yaml
# 删除 yaml 定义资源
kubectl delete -f xxx.yaml
```

### 

# 部署第一个应用

**外部直接访问 80 端口 → 进入 Nginx 服务**，标准 K8s 方案用 **Nginx Ingress（Ingress Controller）**生产标准七层入口

nginx-app.yaml：后端服务和 service

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx-demo
  template:
    metadata:
      labels:
        app: nginx-demo
    spec:
      containers:
      - name: nginx
        image: nginx:alpine
        ports:
        - containerPort: 80
---
# Service：集群内部访问入口，ClusterIP（默认，集群内可见，不对外）
apiVersion: v1
kind: Service
metadata:
  name: nginx-svc
spec:
  selector:
    app: nginx-demo
  ports:
  - port: 80        # Service端口
    targetPort: 80  # Pod内nginx端口
  type: ClusterIP
```

nginx-ingress.yaml：ingress 资源、路由规则

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress-demo
spec:
  ingressClassName: nginx 
  rules:
#  - host: nginx.demo.local   # 自定义域名，你随便起
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-svc
            port:
              number: 80
```

启动minikube的ingress插件

```bash
minikube addons enable ingress
# 检查ingress-nginx状态，看到running才算就绪
kubectl get pods -n ingress-nginx -w
```

应用配置文件

```bash
kubectl apply -f nginx-app.yaml
kubectl get deploy,svc,pod
kubectl apply -f nginx-ingress.yaml
kubectl get ingress

# 启动隧道
minikube tunnel
```

> [!TIP]
>
> 正常 ingress 已经能够对外访问，但由于 minikube 是 docker 驱动，即运行在 docker 容器内的集群，所以在宿主机直接访问是不通的，需要通过隧道进行访问。