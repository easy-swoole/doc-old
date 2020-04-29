---
title: What is microservice
meta:
  - name: description
    content: Microservices based concept science
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|microservices
---
# Microservice

## The meaning of microservices

For example, in a basic shopping mall system, we may be divided into user modules, commodity modules, order modules, activity modules, etc., in the initial stage of system construction,
For the sake of fast online and cost savings, we are a direct set of module code, all written in a project code.
After the late traffic comes up, we will find that the entire service is often caused by the failure of the module of a certain module. For example, activity modules, and commodity modules are the easiest to smash under high traffic. For example, in the double eleventh event in 2018,
A certain shopping mall system spent a lot of money to advertise, resulting in very high traffic directly into the mall system, and before this, there was no service split, then the high flow of the activity module caused the database and bandwidth to be completely unsupportable, the entire mall All of them enter the black hole state, and the user cannot enter the activity page, and even the normal shopping mall homepage cannot be opened.
Later, under the suggestion of the Easyswoole project team, the mall system is split into modular services. For example, the active system is an independent service. When the user participates in the activity, the active service interface is called directly from the client, and the active service needs to be verified. When goods and user data are used, data interaction between services is performed through RPC calls. in order to fulfill
The pressure is no longer allowed to accumulate all service pressures on a single server or database, and in the worst case, even if the active module is paralyzed, it will not cause the entire mall system to be unavailable.

Therefore, the main significance of microservices is that traffic is divided, the module is highly autonomous, and service isolation is protected.

## What is a microservices framework
In fact, the so-called microservices framework is a misnomer. Microservices are an architectural concept that has nothing to do with the framework. For example, in the above case, the mutual invocation of our services can be implemented using HTTP or the native TCP protocol, so in fact, there is no semi-finance relationship with the framework. And if it is really far-fetched to say that it is a micro-service framework, then it is nothing more than some frameworks that do some component packaging, making it easier for you to implement RPC calls. For example, Easyswoole provides RCP encapsulation and basic service discovery and registration centers. But in fact, this is just a tool, the real micro-service, the core is actually how to do the minimum granularity between services, which is actually the scope of architectural planning.

## Service current limit
Let's take another example of our lives: some popular tourist attractions often have strict restrictions on the number of daily visitors, such as Gulangyu in Xiamen and the Forbidden City in Beijing, which will only sell a fixed number of tickets per day. You are late, maybe the ticket for the day is already sold out, and you can't go in for the day.
Why do tourist attractions have to do this? Is it better to sell more tickets and earn more money?

In fact, for tourist attractions, they are also very helpless, because the service resources of the attractions are limited, the number of people who can serve every day is limited. Once the restrictions are released, the staff of the attractions will not be enough, and the health will not be enough. To the protection, there are hidden dangers to safety, and the ultra-intensive people will seriously affect the experience of tourists.
However, due to the famous reputation of the scenic spot, the number of passengers who come to play is endless, far beyond the carrying capacity of the scenic spot. Therefore, the scenic spot has to make measures to limit the daily flow of personnel.

In the same way, in the IT software industry, system services are also like this. If your system theory is that you can serve 100W users in the time unit, but today you suddenly come to 300W users. Due to the randomness of user traffic, if you do not limit the flow, it is very likely that the 300W users will suddenly crush the system. Causes everyone to be out of service.
Therefore, in order to ensure that the system can provide normal services for at least 100W users, we need to limit the flow design of the system.

Some people may think that since there will be 300W users to visit, why is the system not designed to support such a large number of users?
This is a good question. If the system is accessed by a 300W user for a long time, it is definitely to be upgraded, but often the situation is that the daily traffic of the system is 100W, but there are occasional short-term traffic caused by unpredictable specific reasons. The surge, at this time, companies often do not expand our system to the largest size for an uncommon spike for cost-saving reasons.

## How to limit current

In practical applications, the traffic entry should be:
```
Firewall --> Api Gateway -> Service
```
Therefore, in fact, we have three places to limit the flow. Then, the firewall, and the API gateway, we will not explain it, it is the operation and maintenance. What we are talking about is the self-protection of the API gateway. In Easyswoole, there is a basic AtomicLimit component, the principle is similar to the token bucket, and interested students can go and see. Of course, Easyswoole also supports other methods of current limiting, you can intercept in the onRequest method of the traffic entry.

## Fuse protection

This mode requires the system to be taken into account at the beginning of the design. When there is a problem in the system, if it cannot be repaired in a short time, the system should automatically make a judgment, turn on the fuse switch, reject the traffic access, and avoid the overload request of the large traffic to the back end. The system should also be able to dynamically monitor the repair of the backend program. When the program has stabilized, the fuse switch can be turned off to resume normal service.

## Service downgrade

All the functional services of the system are classified. When there is a problem in the system and emergency current limiting is required, the less important functions can be downgraded and the service can be stopped, which can release more resources for the core functions.

For example, in the e-commerce platform, if the burst traffic surges, the non-core functions such as commodity reviews and points can be temporarily downgraded, the services are stopped, and resources such as machines and CPUs are released to ensure normal order placement, and these degraded functions are provided. The service can wait for the entire system to return to normal, and then start to perform the replenishment/compensation process.
In addition to functional degradation, you can also use the method of not directly operating the database, but all read cache and write cache as a temporary downgrade scheme.


## Delayed processing

This mode requires a traffic buffer pool at the front end of the system to buffer all requests into this pool and not process them immediately. Then the backend real business handlers take the requests from this pool in turn, and the common ones can be implemented in queue mode. This is equivalent to reducing the processing pressure of the backend in an asynchronous manner, but when the traffic is large, the processing capacity of the backend is limited, and the request in the buffer pool may not be processed in time, and there is a certain degree of delay.

## Privilege processing

This mode needs to classify users, and through the preset classification, the system prioritizes the user groups that need high security. The requests of other user groups are delayed or not processed directly.


::: warning 
Of course, there are still many things in microservices. This article is just a basic concept of science. You can ask the architect.
:::
