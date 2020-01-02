---
title: Kernel parameter adjustment
meta:
  - name: description
    content: Easyswoole, kernel parameter adjustment
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|kernel parameter adjustment
---
## Kernel parameter adjustment

Ulimit setting
----
Ulimit -n should be adjusted to 100000 or more. Execute ulimit -n 100000 from the command line to modify it. If you can't modify it, you need to set /etc/security/limits.conf to join.
```text
* soft nofile 262140
* hard nofile 262140
root soft nofile 262140
root hard nofile 262140
* soft core unlimited
* hard core unlimited
root soft core unlimited
root hard core unlimited
```
Note that after modifying the `limits.conf` file, you need to restart the system to take effect.

Kernel settings
------
The `Linux` operating system has three ways to modify kernel parameters:

* Modify the `/etc/sysctl.conf` file, add configuration options, the format is `key = value`, modify the save and call `sysctl -p` to load the new configuration.
* Use the `sysctl` command to temporarily modify it, such as: `sysctl -w net.ipv4.tcp_mem="379008 505344 758016"`
* Directly modify the files in the `/proc/sys/` directory, such as: `echo "379008 505344 758016" > /proc/sys/net/ipv4/tcp_mem`

::: warning 
 The first method will take effect automatically after the operating system restarts, and the second and third methods will fail after restarting.
:::


###net.unix.max_dgram_qlen = 100###
Swoole uses unix socket dgram for interprocess communication. If the request volume is large, you need to adjust this parameter. The system defaults to 10 and can be set to 100 or greater.  
Or increase the number of worker processes and reduce the amount of requests allocated by a single worker process.

### net.core.wmem_max###
Modify this parameter to increase the memory size of the socket cache. 

```
net.ipv4.tcp_mem  =   379008       505344  758016
net.ipv4.tcp_wmem = 4096        16384   4194304
net.ipv4.tcp_rmem = 4096          87380   4194304
net.core.wmem_default = 8388608
net.core.rmem_default = 8388608
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
```

### net.ipv4.tcp_tw_reuse ###
Whether socket reuse, the function of this function is to quickly re-use the listening port when the server restarts. If this parameter is not set, the port will not be released in time and the startup will fail when the server is restarted.
### net.ipv4.tcp_tw_recycle ###
Use socket to quickly recycle. Short connection server needs to enable this parameter. This parameter indicates that the fast recovery of TIME-WAIT sockets in the TCP connection is enabled. In Linux, the default is 0, which means it is closed. Turning on this parameter may cause the NAT user connection to be unstable. Please test it carefully before turning it on.

Message queue settings
-----
This kernel parameter needs to be adjusted when using Message Queuing as the interprocess communication method.

* kernel.msgmnb = 4203520, The maximum number of bytes in the message queue
* kernel.msgmni = 64, How many message queues are allowed to be created
* kernel.msgmax = 8192, Message queue single data maximum length

FreeBSD/MacOS
----
* sysctl -w net.local.dgram.maxdgram=8192
* sysctl -w net.local.dgram.recvspace=200000
Modify the buffer area size of Unix Socket

Open CoreDump
------
Set kernel parameters
```
kernel.core_pattern = /data/core_files/core-%e-%p-%t
```

View the current limit of the coredump file by using the ulimit -c command
```
ulimit -c
```
If it is 0, you need to modify /etc/security/limits.conf to set the limit.

::: warning 
After core-dump is turned on, the process is exported to a file once an exception occurs in the program. Great help for investigating procedural issues
:::
  


Other important configurations
-----

* net.ipv4.tcp_syncookies=1
* net.ipv4.tcp_max_syn_backlog=81920
* net.ipv4.tcp_synack_retries=3
* net.ipv4.tcp_syn_retries=3
* net.ipv4.tcp_fin_timeout = 30
* net.ipv4.tcp_keepalive_time = 300
* net.ipv4.tcp_tw_reuse = 1
* net.ipv4.tcp_tw_recycle = 1
* net.ipv4.ip_local_port_range = 20000    65000
* net.ipv4.tcp_max_tw_buckets = 200000
* net.ipv4.route.max_size = 5242880

Check whether the configuration takes effect
----
Such as: modify net.unix.max_dgram_qlen = 100, through
```
cat /proc/sys/net/unix/max_dgram_qlen
```
If the modification is successful, here is the newly set value.
