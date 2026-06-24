# k8s

一、kubeadm：Kubernetes集群快速构建工具

kubeadm是Kubernetes的一个子项目，用于快速构建Kubernetes集群。它提供了简单的命令行接口，用于初始化和管理Kubernetes集群。通过kubeadm，用户可以轻松地创建和管理Kubernetes集群，而无需深入了解底层的复杂配置。

在实际应用中，kubeadm可以帮助我们快速搭建一个可用的Kubernetes环境，为后续的容器部署和管理提供基础。它简化了集群的初始化过程，降低了部署和维护的复杂度。

二、kubectl：Kubernetes命令行工具

kubectl是Kubernetes的命令行工具，用于与Kubernetes集群进行交互。通过kubectl，用户可以部署和管理应用，查看各种资源，创建、删除和更新各种组件。kubectl提供了一组丰富的命令行指令，可以满足用户在Kubernetes集群上的各种操作需求。

在实际应用中，kubectl是我们与Kubernetes集群交互的主要工具。无论是部署应用、管理资源，还是查看集群状态，都可以通过kubectl轻松实现。它的强大功能和易用性使得Kubernetes集群的管理变得更加简单和高效。

三、kubelet：负责启动Pod和容器的运行时

kubelet是运行在Kubernetes集群所有节点上的代理，负责启动Pod和容器。它以系统服务的形式出现，并与Kubernetes的Master节点保持通信。kubelet接收来自Master节点的指令，并在本地执行相应的操作，如启动容器、监控容器状态等。

在实际应用中，kubelet是Kubernetes集群中每个节点上的重要组件。它负责将Master节点的指令转化为实际的容器操作，确保容器能够按照预期的方式运行。同时，kubelet还负责监控容器的状态，并将相关信息反馈给Master节点，以便进行集群的管理和调度。

# 搭建

[Kubernetes最新版2023.07v1.27.4安装和集群搭建保姆级教程 - 知乎](https://zhuanlan.zhihu.com/p/641521752)

# 复制机器形成新 node

修改复制机器的网络和 hostname

```bash
# 修改ip地址为新的同网段地址
vim /etc/sysconfig/network-scripts/ifcfg-enp0s8
IPADDR="10.0.3.24"
# 重启网络
service network restart
Restarting network (via systemctl):                        [  OK  ]

# 修改hostname
hostnamectl set-hostname k8s-node-3
# 修改hosts文件
vim /etc/hosts
127.0.0.1   k8s-node-3 localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         k8s-node-3 localhost localhost.localdomain localhost6 localhost6.localdomain6
```

```bash
# 重置k8s节点
kubeadm reset -f --cri-socket=unix:///var/run/cri-dockerd.sock
rm -f /etc/cni/net.d
# 重启
reboot

# 在master创建token（需要在master节点运行）
kubeadm token create --print-join-command
kubeadm join 10.0.3.21:6443 --token hax3r2.kxwi1oegxp7esh8e --discovery-token-ca-cert-hash sha256:66040a7a8153c3743a580cf986be08bb032d579376dc055c6573183639f6d41d 
# 节点加入集群
kubeadm join 10.0.3.21:6443 --token hax3r2.kxwi1oegxp7esh8e --discovery-token-ca-cert-hash sha256:66040a7a8153c3743a580cf986be08bb032d579376dc055c6573183639f6d41d  --cri-socket=unix:///var/run/cri-dockerd.sock

# 在master上查看节点，注意刚加入可能要稍等一会状态才会变为Ready
kubectl get nodes
```

> [!NOTE]
>
> 如果伸缩时出问题，可以尝试重启新机器和被复制的机器。

> [!NOTE]
>
> 在 node 执行`reset`或`join`时，或者 master 上执行`init`，可能会报错：
>
> ```bash
> Found multiple CRI endpoints on the host
> ```
>
> 这是因为这台机器上有多个容器运行时接口（CRI）端点：cri-dockerd、containerd，需要在命令中加上`crl-socket`参数，选择其中一个：
>
> ```
> --cri-socket=unix:///var/run/cri-dockerd.sock
> --cri-socket=unix:///var/run/containerd/containerd.sock
> ```

可能用到的清理命令：

```
kubeadm reset -f --cri-socket=unix:///var/run/cri-dockerd.sock
sudo systemctl restart kubelet
sudo rm -rf /etc/kubernetes/
sudo rm -rf /var/lib/kubelet/
sudo rm -rf /var/lib/cni/
sudo rm -rf /etc/cni/net.d/
sudo rm -rf /run/flannel/
sudo rm -rf /opt/cni/bin/
ip link delete cni0
ip link delete flannel.1
ip link delete kube-ipvs0
```

