const sidebarCn = [
    // ['/', '欢迎使用'],
    // {
    //     title: '基础用法',   // 必要的
    //     collapsable: true, // 可选的, 默认值是 true,
    //     sidebarDepth: 0,    // 可选的, 默认值是 1
    //     children: [
    //         ['/BaseUsage/asyncTask', '异步任务'],
    //         ['/BaseUsage/serverManager', '服务管理'],
    //         {
    //             title: '服务管理子菜单',   // 必要的
    //             collapsable: true, // 可选的, 默认值是 true,
    //             sidebarDepth: 0,    // 可选的, 默认值是 1
    //             children: [
    //                 ['/BaseUsage/asyncTask', '异步任务'],
    //             ]
    //         }
    //     ]
    // },
    {
        title: '前言',
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            ['/Preface/Introduction', '项目介绍'],
            ['/Preface/DeveloperRead', '开发者必读'],
            ['/Preface/UpdateLog', '更新记录'],
            ['/Preface/Donation', '捐赠'],
            ['/Preface/ContactAuthor', '联系作者'],
        ]
    },
    {
        title: '视频教程',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            ['/Video/introduction', '入门教程'],
            ['/Video/base', '基础部分'],
            ['/Video/http', 'HTTP部分'],
            ['/Video/database', '数据库部分'],
            ['/Video/other', '其他额外部分'],
        ]
    },
    // {
    //     title: 'PHP新手理论基础知识',
    //     collapsable: true, // 可选的, 默认值是 true,
    //     sidebarDepth: 0,    // 可选的, 默认值是 1
    //     children: [
    //         {
    //             title: '运行模式',
    //             collapsable: true, // 可选的, 默认值是 true,
    //             sidebarDepth: 0,    // 可选的, 默认值是 1
    //             children: [

    //             ]
    //         },
    //         {
    //             title: '网络协议',
    //             collapsable: true, // 可选的, 默认值是 true,
    //             sidebarDepth: 0,    // 可选的, 默认值是 1
    //             children: [

    //             ]
    //         },
    //         {
    //             title: '会话管理',
    //             collapsable: true, // 可选的, 默认值是 true,
    //             sidebarDepth: 0,    // 可选的, 默认值是 1
    //             children: [

    //             ]
    //         },
    //         {
    //             title: 'Linux基础',
    //             collapsable: true, // 可选的, 默认值是 true,
    //             sidebarDepth: 0,    // 可选的, 默认值是 1
    //             children: [

    //             ]
    //         },
    //         {
    //             title: 'PHP7.0',
    //             collapsable: true, // 可选的, 默认值是 true,
    //             sidebarDepth: 0,    // 可选的, 默认值是 1
    //             children: [

    //             ]
    //         },
    //         {
    //             title: 'PHP回调/闭包',
    //             collapsable: true, // 可选的, 默认值是 true,
    //             sidebarDepth: 0,    // 可选的, 默认值是 1
    //             children: [

    //             ]
    //         },
    //         {
    //             title: 'PHP多进程',
    //             collapsable: true, // 可选的, 默认值是 true,
    //             sidebarDepth: 0,    // 可选的, 默认值是 1
    //             children: [

    //             ]
    //         },
    //         ['/NoobCourse/sync','同步/异步'],
    //         ['/NoobCourse/block','阻塞/非阻塞'],
    //         ['/NoobCourse/coroutine','协程'],
    //         {
    //             title: 'Swoole',
    //             collapsable: true, // 可选的, 默认值是 true,
    //             sidebarDepth: 0,    // 可选的, 默认值是 1
    //             children: [

    //             ]
    //         },
    //         {
    //             title: 'Composer使用',
    //             collapsable: true, // 可选的, 默认值是 true,
    //             sidebarDepth: 0,    // 可选的, 默认值是 1
    //             children: [

    //             ]
    //         },
    //         {
    //             title: 'EasySwoole',
    //             collapsable: true, // 可选的, 默认值是 true,
    //             sidebarDepth: 0,    // 可选的, 默认值是 1
    //             children: [

    //             ]
    //         },
    //         ['/NoobCourse/artOfAskingQuestions','提问的艺术']
    //     ]
    // },
    {
        title: '快速开始',
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            ['/Introduction/environment', '环境要求'],
            ['/Introduction/install', '框架安装'],
            ['/Introduction/docker', 'Docker镜像'],
            ['/Introduction/config', '配置文件'],
            ['/Introduction/server', '服务管理'],
            ['/Introduction/proxy', '反向代理'],
            {
                title: '协程操作指南',   // 必要的
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Introduction/Coroutine/create', '创建协程'],
                    ['/Introduction/Coroutine/waitgroup', 'WaitGroup等待'],
                    ['/Introduction/Coroutine/csp', 'Csp并发'],
                ]
            },
            ['/Introduction/example', '基础开发示例'],
            ['/Introduction/demo', 'Demo'],
        ]
    },
    {
        title: '核心架构',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            ['/Core/lifecycle', '生命周期'],
            ['/Core/ioc', 'IOC容器'],
            ['/Core/context', '上下文管理器'],
            {
                title: '全局事件',
                path: '/Core/event',
                collapsable: false,
                sidebarDepth: 0,
                children: [
                    ['/Core/event/bootstrap', 'bootstrap事件'],
                    ['/Core/event/initialize', 'initialize事件'],
                    ['/Core/event/mainServerCreate', 'mainServerCreate事件'],
                    ['/Core/event/onRequest', 'onRequest事件'],
                    ['/Core/event/afterRequest', 'afterRequest事件'],
                ]
            },
            ['/Core/annotation', '注解支持'],
            ['/Core/other', '其他架构体系'],
        ]
    },
    {
        title: '基础使用',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            ['/BaseUsage/serverManager', 'Swoole实例'],
            {
                title: 'Socket服务',
                collapsable: false,
                sidebarDepth: 0,
                children: [
                    ['/BaseUsage/Socket/tcp', 'TCP服务器'],
                    ['/BaseUsage/Socket/tcp_sticky', 'TCP服务器处理粘包'],
                    ['/BaseUsage/Socket/websocket', 'Websocket服务器'],
                    ['/BaseUsage/Socket/websocket_wss', 'Websocket支持wss'],
                    ['/BaseUsage/Socket/websocket_shake', 'Websocket自定义握手'],
                    ['/BaseUsage/Socket/udp', 'UDP服务器'],
                    ['/BaseUsage/Socket/question', '常见问题'],
                ]
            },
            ['/BaseUsage/customCommand', '自定义命令'],
            ['/BaseUsage/process', '自定义进程'],
            ['/BaseUsage/event', '自定义事件'],
            ['/BaseUsage/asyncTask', 'Task 异步任务'],
            ['/BaseUsage/timer', 'Timer 定时器'],
            ['/BaseUsage/crontab', 'Crontab 计划任务'],
            ['/BaseUsage/log', '日志处理'],
            {
                title: '缓存',
                collapsable: false,
                sidebarDepth: 0,
                children: [
                    ['/BaseUsage/Cache/cache', 'Cache'],
                    ['/BaseUsage/Cache/fastcache', 'Fast-cache'],
                    ['/BaseUsage/Cache/fastcache-queue', 'Fast-cache-queue'],
                ]
            },
            ['/BaseUsage/phpunit', '单元测试'],
            ['/BaseUsage/console', '远程控制台'],
        ]
    },
    {
        title: 'HTTP服务',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            ['/HttpServer/fastRoute', '路由'],
            ['/HttpServer/controller', '控制器'],
            ['/HttpServer/annotation', '注解控制器'],
            ['/HttpServer/request', '请求'],
            ['/HttpServer/response', '响应'],
            ['/HttpServer/template', '视图'],
            // ['/HttpServer/', 'URL'],
            ['/HttpServer/uploadFile', '文件上传'],
            ['/HttpServer/validate', '验证器'],
            ['/HttpServer/session', 'Session'],
            ['/HttpServer/exception', '错误与异常'],
            ['/HttpServer/static', '静态资源处理'],
            // ['/HttpServer/', '常见问题'],
        ]
    },
    {
        title: '数据库',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            ['/Database/quickstart', '快速入门'],
            ['/Database/quickstart', 'Mysqli'],
            ['/Database/mysqliPool', 'Mysqli连接池'],
            ['/Database/queryBuilder', '查询构造器'],
            ['/Database/orm', 'ORM'],
            ['/Database/createTable', '建表工具'],
            {
                title: 'Redis',
                collapsable: false,
                sidebarDepth: 0,
                children: [
                    ['/Database/Redis/redis', 'Redis操作'],
                    ['/Database/Redis/redisPool', 'Redis连接池'],
                    {
                        title: 'Redis协程客户端',   // 必要的
                        collapsable: true, // 可选的, 默认值是 true,
                        sidebarDepth: 1,    // 可选的, 默认值是 1
                        children: [
                            ['/Database/Redis/RedisClient/introduction', '介绍'],
                            ['/Database/Redis/RedisClient/install', '安装'],
                            ['/Database/Redis/RedisClient/config', '配置'],
                            ['/Database/Redis/RedisClient/cluster', '集群'],
                            ['/Database/Redis/RedisClient/connection', '连接(connection)'],
                            ['/Database/Redis/RedisClient/keys', '键(keys)'],
                            ['/Database/Redis/RedisClient/string', '字符串(string)'],
                            ['/Database/Redis/RedisClient/hash', '哈希(hash)'],
                            ['/Database/Redis/RedisClient/lists', '列表(lists)'],
                            ['/Database/Redis/RedisClient/sets', '集合(sets)'],
                            ['/Database/Redis/RedisClient/sortedSets', '有序集合(sorted sets)'],
                            ['/Database/Redis/RedisClient/hyperLogLog', 'HyperLogLog'],
                            ['/Database/Redis/RedisClient/pubSub', '发布/订阅(pub/sub)'],
                            ['/Database/Redis/RedisClient/transaction', '事务 (transaction)'],
                            ['/Database/Redis/RedisClient/geoHash', 'geohash'],
                            ['/Database/Redis/RedisClient/clusterMethod', '集群方法(cluster)'],
                            ['/Database/Redis/RedisClient/pipe', '管道(pipe)'],
                        ]
                    }
                ]
            },
            ['/Database/memcache', 'Memcache'],
            ['/Database/mongoDB', 'MongoDB'],
        ]
    },
    {
        title: '组件库',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            {
                title: '基础组件',
                collapsable: true,
                sidebarDepth: 0,
                children: [
                    ['/Components/singleton', '单例'],
                    ['/Components/readyScheduler', '就绪等待'],
                    ['/Components/tableManager', 'Swoole Table'],
                    ['/Components/atomic', 'Atomic 计数器'],
                    {
                        title: 'Spl组件',   // 必要的
                        collapsable: true, // 可选的, 默认值是 true,
                        sidebarDepth: 0,    // 可选的, 默认值是 1
                        children: [
                            ['/Components/array', 'SplArray'],
                            ['/Components/bean', 'SplBean'],
                            ['/Components/enum', 'SplEnum'],
                            ['/Components/splStream', 'SplStream'],
                            ['/Components/splFileStream', 'SplFileStream'],
                            ['/Components/string', 'SplString'],
                        ]
                    }
                ]
            },
            ['/Components/pool', 'Pool池管理器'],
            {
                title: 'HTTPClient协程客户端',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                path: '/Components/introduction',
                children: [
                    ['/Components/request', '请求'],
                    ['/Components/response', '响应'],
                    ['/Components/websocket', 'WebsocketClient'],
                ]
            },
            ['/Components/task', 'Task组件'],
            {
                title: 'Actor组件',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                path: '/Components/actor',
                children: [
                    ['/Components/analysis', '设计解读'],
                ]
            },
            ['/Components/whoops', 'Whoops'],
            ['/Components/syncInvoker', 'SyncInvoker'],
            ['/Components/tracker', 'Tracker'],
            ['/Components/policy', 'Policy策略权限'],
            ['/Components/jwt', 'JWT令牌'],
        ]
    },
    {
        title: '其他问题',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            ['/Other/swooleTracker', 'SwooleTracker'],
            ['/Other/process', '队列消费/自定义进程问题'],
            ['/Other/redisSubscribe', 'Redis/Kafka订阅'],
            ['/Other/kernelOptimization', '内核优化'],
            ['/Other/hotReload', '服务热重载'],
            ['/Other/random', '随机生成问题'],
            ['/Other/traitSingleTon', 'Trait与单例'],
            ['/Other/mysqlIndexReduce', 'MySQL索引降维'],
            ['/Other/tpORM', 'tpORM使用问题'],
            ['/Other/curlSsl', 'CurlSSL错误'],
            ['/Other/chromeHeadless', 'ChromeHeadless'],
            ['/Other/graphQL', 'GraphQL'],
        ]
    },
    {
        title: '微信支付宝SDK',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            {
                title: '微信SDK',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                path: '/Sdk/wechat',
                children: [
                    ['/Sdk/openPlatform', '公众号'],
                    ['/Sdk/miniProgram', '小程序'],
                    ['/Sdk/wxPay', '微信支付'],
                ]
            },
            {
                title: '支付宝SDK',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                path: '/Sdk/pay',
                // children: [
                //     ['/Distribute/server', '服务端'],
                //     ['/Distribute/client', '客户端'],
                //     ['/Distribute/otherPlatform', '跨语言'],
                //     ['/Distribute/registerCenter', '服务注册中心'],
                // ]
            },

        ]
    },
    {
        title: '微服务与分布式',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            ['/Distribute/microService', '什么是微服务？'],
            ['/Distribute/loadbalance', '如何实现分布式？'],
            ['/Distribute/atomicLimit', '服务限流'],
            {
                title: 'Rpc服务',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                path: '/Distribute/introduction',
                children: [
                    ['/Distribute/server', '服务端'],
                    ['/Distribute/client', '客户端'],
                    ['/Distribute/otherPlatform', '跨语言'],
                    ['/Distribute/registerCenter', '服务注册中心'],
                ]
            },
            ['/Distribute/consul', 'Concul客户端'],
            {
                title: '配置中心',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Distribute/apollo', 'Appolo配置中心'],
                ]
            }
        ]
    },


];
const sidebarEn = [];

module.exports = {sidebarCn, sidebarEn};