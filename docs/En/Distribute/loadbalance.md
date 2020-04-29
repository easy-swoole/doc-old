---
title: How to achieve distributed
meta:
  - name: description
    content: EasySwoole Distributed Load Balancing
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|distributed|load balancing
---
# How to achieve distributed
Recently, many people are asking how to use EasySwoole for distributed load balancing. If the complexity is not explained, explain how to achieve the simplest load balancing.

## related information

### DNS rotation

A domain name resolves multiple ip A records. The DNS server allocates the resolution requests to different IPs in the order of A records, thus completing simple load balancing.

#### Advantages of DNS polling:

- Low cost: Just bind several A records on the DNS server, and domain registrars generally provide resolution services for free.
- Simple deployment: device amplification in the network topology, and then add records on the DNS server.

#### Disadvantages of DNS polling:

- Low reliability
    
    Suppose a domain name DNS polls multiple servers. If one of the servers fails, all requests to access the server will not respond, which is unwilling to be seen by anyone. Even if the IP of the server is removed from the DNS, on the Internet, broadband access providers such as telecommunications and Netcom in various regions store a large number of DNS in the cache to save access time. It takes several hours or more for the DNS records to take effect. Long. Therefore, although DNS polling solves the load balancing problem to a certain extent, it has the disadvantage of low reliability.

- Uneven load distribution (with, but not so much impact)

    DNS load balancing uses a simple polling algorithm. It does not distinguish between server differences. It does not reflect the current running state of the server. It cannot allocate more requests for servers with better performance. It may even result in client requests being concentrated on one server. On the situation. The DNS server is organized according to a certain hierarchical structure. The local DNS server caches the mapping of the resolved domain name to the IP address. This causes the user who uses the DNS server to access the same Web server for a period of time, resulting in the Web server. The load between the two is uneven. In addition, the user's local computer also caches the mapping of resolved domain names to IP addresses. When multiple user computers cache the mapping of a domain name to an IP address, and these users continue to access the web pages under the domain name, the load distribution between different web servers may also be uneven. The consequences of uneven load may be: some servers have low load, while others have high load and slow processing; high-configuration servers allocate fewer requests, while low-configuration servers allocate more requests.

## Unified gateway design
Assume that in a system, it can be split into three services: A, B, and C. In order to be uniformly exposed from the architecture layer, a gateway server is generally set up, and all application requests are all from the gateway server as a traffic portal, and the gateway The server distributes the request to the three servers A, B, and C according to the set rules, and returns the result to the client. For the outside world, the gateway is a complete application service.
- Shield internal implementation
- Do physical work, forward various packages
- Load balancing and load balancing of broadcast messages (also manual)
- Reduce bandwidth requirements. For example, set up multiple gateways to one server. Because the platform of a certain communication is the bandwidth fee for each machine, instead of collecting bandwidth traffic fees together.
- Routing. You can control the direction of client messages to the intranet and distribute them to different servers.

## Data center

In a typical scenario, as a service grows with the number of visits, there is always a high CPU in the stand-alone scenario, and even the risk of crashing. For this reason, the simplest and most rude solution (the database is not a system bottleneck) is Deploy the same code to N machines and use the gateway to evenly distribute requests to each machine.
After doing this, there is another problem: how the user state is shared among multiple machines (random forwarding or a scene where a machine suddenly goes offline). For example, in a classic HTTP application, a user logs in to the A machine. If the token assigned to the A user exists only in the local machine A, then the next time the user request is assigned to the B machine, the token is It will be invalid and requires the user to log in again. Obviously, this is very unreasonable.
And if we let ourselves achieve things like zookeeper, to achieve automatic data scheduling migration, it is obviously unrealistic. Therefore, we introduce the data center model, which is actually the idea of a typical distributed master-slave. Taking php Session as an example, we can design a Session driver for N machines as a redis driver and connect to a redis cluster. In this way, the user's token registered in the A or B machine is stored in the redis data center.
Therefore, regardless of whether the user request is assigned to the A or B machine, the user's token can be read as it is.

## Practical operation

### HTTP application
In fact, I think that most people's HTTP applications basically use the gateway distribution + data center design, basically can be solved, and most of the online also have corresponding tutorials, so I will not elaborate here.

### SOCKET application

We take WEB SOCKET as an example. Let's assume that in a large application of a game, in order to achieve a balanced load, we use a gateway, such as Nginx, to randomly distribute user connections to different machines.
At the moment, one problem is that in swoole, each link is marked with a self-incrementing fd identifier. In multiple swoole services, fd is repeated. Therefore, in the case of multiple machines, we can store the following data structures in redis or other storage:
```json
{
    "userId":"xxxxxx",
    "seerver":
    {
        "nodeId":"nodeId",
        "ip":"xxx.xxx.xxx.xxx",
        "rcpPort":9600
    },
    "fd":"fd"
}
```
And our Server, you can open an Http service, receive fd, parameters in the action, and then execute the send (fd, data) operation. Assume that the A and B users are connected to the two machines A1 and B1 respectively, and at this time, the fd assigned by the two people A and B may be the same, for example, all are 1.
If you want to send a message to any user at this time, then go to the data center to get the information about the machine where the user is located. So, you can use the Http call or other RPC methods to achieve cross-machine push.
