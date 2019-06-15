# EasySwoole RPC
Many traditional Phper don't know what RPC is. RPC is called Remote Procedure Call, which is translated into remote procedure call in Chinese. In fact, you can understand it as an architectural design or a solution.
For example, in a large shopping mall system, you can split the whole shopping mall into N micro-services (which can be understood as N independent small modules), such as:
    
- Order System
- User Management System
- Commodity Management System
- ellipsis ...

In such an architecture, there will be an Api gateway concept, or service integrator. My Api gateway's job is to make a request
Divide it into N small requests, distribute it to each small service, integrate the results of each small service, and return it to users. For example, in a request for an order, it is probably
The logic of transmission is as follows:
- Api Gateway Accepts Requests
- Api Gateway Extracts User Parameters, Requests User Management System, Gets User Balance and Other Information, Waits for Results
- Api gateway extracts commodity parameters, requests commodity management system, obtains information such as commodity surplus inventory and price, and waits for the result.
- Api gateway integrates the return results of user management system and commodity management system, and makes the next call (assuming the purchase conditions are met)
- Api gateway calls user management information system for deduction, commodity management system for inventory deduction, and order system for order placing (transaction logic and withdrawal can be guaranteed by request id, or other logical scheduling by itself)
- APi Gateway Returns Comprehensive Information to Users

The above behavior is called remote procedure call. There are many communication protocols implemented by calling process, such as common HTTP protocol. EasySwoole RPC is implemented by a custom short-link TCP protocol. Each request package is a JSON, which facilitates cross-platform invocation.

What is service fuse?

Rough to understand, it is usually caused by a service failure or exception, similar to the "fuse" in the real world, when an exception condition is triggered, the whole service is directly fused, rather than waiting until the service timeout.

What is service degradation?

Rough to understand, generally from the overall load considerations, that is, when a service breaks down, the server will no longer be invoked, at this time the client can prepare a local fallback, return a default value, do so, although the level of service declines, but for better or worse, than hanging up directly.
The service degradation process is implemented on the client side and has nothing to do with the server side.

What is Service Current Limitation?

To understand roughly, for example, when a server can handle only 100 requests at most, or when the CPU load reaches 80 percent, in order to protect the stability of the service, it is no longer desirable to continue receiving it.
New connection. At this point, the client is required to stop making requests for it. So EasySwoole RPC provides the NodeManager interface, which you can use in any form.
Monitor your service provider and return the corresponding server node information in the getServiceNode method.

## New features of EasySwoole RPC
- Cooperative scheduling
- Automatic Service Discovery
- Service Fusion
- Service degradation
- Openssl Encryption
- Cross-platform, cross-language support
- Support access to third party registries
## install
```
composer require easyswoole/rpc=3.x
```
