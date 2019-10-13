const sidebarCn = [
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
                    ['/Introduction/coroutineCreate', '创建协程'],
                    ['/Components/Component/waitgroup', 'WaitGroup等待'],
                    ['/Components/Component/csp', 'Csp并发'],
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
            ['/Components/Component/ioc', 'IOC容器'],
            ['/Components/Component/context', '上下文管理器'],
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
        title: 'Socket服务',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            ['/Socket/tcp', 'TCP服务器'],
            ['/Socket/tcp_sticky', 'TCP服务器处理粘包'],
            ['/Socket/websocket', 'Websocket服务器'],
            ['/Socket/websocket_wss', 'Websocket支持wss'],
            ['/Socket/websocket_shake', 'Websocket自定义握手'],
            ['/Socket/udp', 'UDP服务器'],
            ['/Socket/question', '常见问题'],
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
                path:'/Components/introduction',
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
                path:'/Components/actor',
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
                path:'/Sdk/wechat',
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
                path:'/Sdk/pay',
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
                path:'/Distribute/introduction',
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