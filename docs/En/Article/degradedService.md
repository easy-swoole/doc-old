---
title: Common downgrades in swoole microservice development
meta:
  - name: description
    content: Why do you need downgrade and fuse protection under the microservice architecture
  - name: keywords
    content: swoole|swoole extension|swoole framework|Easyswoole|swoole microservices|swoole downgrade|swoole fuse protection
---

# Service blown current limit and downgrade

The core idea: just do not get the best, then take a step back and use the general to guarantee the service.

## Why should fusible current limit

First of all, we can clarify one thing, no matter how the algorithm and operation and maintenance are optimized, the carrying capacity of a single server is limited. For example, in a common game server, suppose that our stand-alone machine can carry a normal game of 100,000 users. One day
As the market has been promoted, there have been 200,000 10,000 users coming in at once. So what should we do if we can't expand in a short time? That is the fuse current limit. We are still accepting the top 100,000 users who log in, and the next 100,000 users let them line up. It seems like it will still let
Half of the users are not happy, but this is also the best option. If not, it could lead to 200,000, that is, all users have no way to have a good experience.

## Why are you downgrading?

For example, an application scenario has a real-time statistical leaderboard in a game service. Under normal circumstances, the request comes in, and is forwarded to the statistics service in real time for statistics. And one day, because of the activity, the pressure is too large, the statistics server crashes, or because
Other factors have caused the statistical services to go offline. At this time, the request comes in, then it must return NULL data to the front end, resulting in a poor user experience. Therefore, we can do downgrade services, for example, the simplest, real-time statistics can not be done, then I pull the cache results of the last statistics, always.


## How to achieve fuse limiting

When it comes to fuse limiting, the most contacted in daily life, it should be the token bucket restrictor. EasySwoole provides a token bucket limiter, you can see the document component library. Under normal circumstances, there will be a pressure test before our service goes online. According to the 28th principle, when the load reaches 80% of the load and the user response time is controlled below 200ms, we define the user load at the moment as the optimal load, so at this time, we will limit the current limiter. The number is limited to this optimal load capacity. The same is true for downgrading services. When a service is accessed multiple times and a service is unavailable, we believe that the service needs to be downgraded.
