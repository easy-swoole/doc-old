---
title: RPC service
meta:
  - name: description
    content: RPC service implementation in EasySwoole
  - name: keywords
    content: Easyswoole|RPC Service|RPC|swoole RPC
---

# EasySwoole RPC
Many traditional Phpies don't understand what RPC is. RPC is called Remote Procedure Call. Chinese is translated as a remote procedure call. In fact, you can understand it as an architectural design or a solution.
For example, in a huge shopping mall system, you can split the entire mall into N micro-services (understand as N independent small modules), for example:
    
- Order System
- User Management System
- Commodity management system
- and many more 

Then in such an architecture, there will be a concept of an Api gateway, or a service integrator. The responsibility of my Api gateway is to split a request into N small requests, distribute them to each small service, and then integrate the results of each small service and return it to the user. For example, in an order request, the logic that is probably sent is as follows:
- Api gateway accepts the request
- Api gateway extracts user parameters, requests user management system, obtains user balance and other information, waits for results
- The Api gateway extracts the product parameters, requests the merchandise management system, obtains the remaining stock and price of the merchandise, and waits for the result.
- The Api gateway fuses the results of the user management system and the commodity management system, and makes the next call (assuming the purchase conditions are met)
- The Api gateway calls the user management information system to debit, calls the commodity management system for inventory deduction, and calls the order system to place an order (transaction logic and withdrawal can be guaranteed with the request id, or implement other logical scheduling by itself)
- The APi gateway returns comprehensive information to the user

The behavior that occurs above is called a remote procedure call. There are many communication protocols implemented by the calling process, such as the common HTTP protocol. The EasySwoole RPC is implemented using a custom short-link TCP protocol. Each request packet is a JSON, which facilitates cross-platform calls.

What is service blow?
 
Roughly understood, it is usually caused by a service failure or an abnormality. Similar to the real-world ‘fuse’, when an abnormal condition is triggered, the entire service is directly blown, instead of waiting until the service times out.

What is service downgrade?

Rough to understand, generally considering the overall load, that is, when a service is blown, the server will no longer be called, at this time the client can prepare a local fallback to return, return a default value, do so, although Service levels have dropped, but they are better than direct hangs.
Service downgrade processing is done on the client side and has nothing to do with the server.

What is service restriction?

Roughly understand, for example, a server can only process 100 requests at the same time, or when the CPU load reaches 80%, in order to protect the stability of the service, it is not expected to continue to receive.
New connection. Then at this point, the client is required to no longer make a request for it. So EasySwoole RPC provides the NodeManager interface, you can come in any form
Monitor your service provider and return the corresponding server node information in the getServiceNode method.

## New features of EasySwoole RPC
 - Coroutine scheduling
 - Service automatic discovery
 - Service blown
 - Service downgrade
 - Openssl encryption
 - Cross-platform, cross-language support
 - Support access to third-party registration centers
## Installation
```
composer require easyswoole/rpc=4.x
```

### EasySwoole RPC execution process

Server:  
Register the RPC service and create the corresponding service swoole table (ps: record the number of successful and failed calls)
Register worker, tick process
  
Woker process listener:
The client sends a request -> unpacks into the corresponding format -> executes the corresponding service -> returns the result -> client

Tick process:
The registration timer sends a heartbeat packet to the node manager.
Enable broadcast: send each node's service information to other nodes every few seconds.
Enable monitoring: listen for information sent by other nodes, send corresponding commands (heartbeat | offline) to node manager processing
The process is closed: the information of the node is deleted actively, and the offline broadcast is sent to other nodes.

![](/resources/rpcDesign.png)