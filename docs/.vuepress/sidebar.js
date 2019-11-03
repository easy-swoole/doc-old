const sidebarCn = [
    {
        title: '前言',
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            ['/Preface/introduction', '项目介绍'],
            ['/Preface/developerRead', '开发者必读'],
            ['/Preface/updateLog', '更新记录'],
            ['/Preface/componentUpdateLog', '组件更新记录'],
            ['/Preface/donation', '捐赠'],
            ['/Preface/contactAuthor', '联系作者'],
            ['/Preface/team', '文档维护团队'],
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
            ['/Introduction/helloWorld', 'Hello World'],
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
                    ['/Components/Component/waitGroup', 'WaitGroup等待'],
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
            ['/Components/annotation', '注解支持'],
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
            ['/Components/Component/process', '自定义进程'],
            ['/BaseUsage/event', '自定义事件'],
            ['/Components/task', 'Task 异步任务'],
            ['/Components/Component/timer', 'Timer 定时器'],
            ['/BaseUsage/crontab', 'Crontab 计划任务'],
            ['/BaseUsage/log', '日志处理'],
            ['/Components/phpunit', '单元测试'],
            ['/Components/console', '远程控制台'],
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
            ['/Components/template', '视图'],
            {
                title: '验证码',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                path: '/Components/VerifyCode/introduction',
                children: [
                    ['/Components/VerifyCode/config', '配置'],
                    ['/Components/VerifyCode/verifyCode', '使用'],
                ]
            },
            ['/HttpServer/uploadFile', '文件上传'],
            ['/HttpServer/validate', '验证器'],
            ['/HttpServer/session', 'Session'],
            ['/HttpServer/exception', '错误与异常'],
            ['/HttpServer/static', '静态资源与跨域处理'],
            ['/HttpServer/problem', '常见问题'],
        ]
    },
    {
        title: 'Socket服务',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            ['/Socket/tcp', 'TCP服务器'],
            ['/Socket/tcpSticky', 'TCP服务器处理粘包'],
            ['/Socket/webSocket', 'Websocket服务器'],
            ['/Socket/webSocketWss', 'Websocket支持wss'],
            ['/Socket/webSocketShake', 'Websocket自定义握手'],
            ['/Socket/udp', 'UDP服务器'],
            ['/Socket/question', '常见问题'],
        ]
    },
    {
        title: '数据库',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            ['/Components/ddl', 'DDL定义'],
            {
                title: 'mysqli',
                collapsable: true,
                sidebarDepth: 0,
                children: [
                    ['/Components/Mysqli/install', '安装和使用'],
                    {
                        title: '查询构造器',
                        collapsable: true,
                        sidebarDepth: 0,
                        children: [
                            ['/Components/Mysqli/builder', '基本使用'],

                            ['/Components/Mysqli/query', '查询数据'],
                            ['/Components/Mysqli/insert', '添加数据'],
                            ['/Components/Mysqli/update', '更新数据'],
                            ['/Components/Mysqli/delete', '删除数据'],
                            {
                                title: '链式操作',
                                collapsable: true,
                                sidebarDepth: 0,
                                children: [
                                    // 要加_method 不然很多都是关键词
                                    ['/Components/Mysqli/Chain/limitMethod', 'limit'],
                                    ['/Components/Mysqli/Chain/fieldsMethod', 'fields'],
                                    ['/Components/Mysqli/Chain/whereMethod', 'where'],
                                    ['/Components/Mysqli/Chain/orWhereMethod', 'orWhere'],
                                    ['/Components/Mysqli/Chain/orderbyMethod', 'orderBy'],
                                    ['/Components/Mysqli/Chain/groupbyMethod', 'groupBy'],
                                    ['/Components/Mysqli/Chain/havingMethod', 'having'],
                                    ['/Components/Mysqli/Chain/orHavingMethod', 'orHaving'],
                                    ['/Components/Mysqli/Chain/joinMethod', 'join'],
                                    ['/Components/Mysqli/Chain/joinWhereMethod', 'joinWhere'],
                                    ['/Components/Mysqli/Chain/joinOrWhereMethod', 'joinOrWhere'],

                                    ['/Components/Mysqli/Chain/unionMethod', 'union'],
                                    ['/Components/Mysqli/Chain/lockInShareModeMethod', 'lockInShareMode'],
                                    ['/Components/Mysqli/Chain/selectForUpdateMethod', 'selectForUpdate'],
                                    ['/Components/Mysqli/Chain/setLockTableModeMethod', 'setLockTableMode'],
                                    ['/Components/Mysqli/Chain/lockTableMethod', 'lockTable'],
                                    ['/Components/Mysqli/Chain/unlockTableMethod', 'unlockTable'],
                                    ['/Components/Mysqli/Chain/setQueryOptionMethod', 'setQueryOption'],

                                    ['/Components/Mysqli/Chain/setPrefixMethod', 'setPrefix'],
                                    ['/Components/Mysqli/Chain/withTotalCountMethod', 'withTotalCount'],
                                    // ['/Components/Mysqli/Chain/get_method', 'get'],
                                    // ['/Components/Mysqli/Chain/getOne_method', 'getOne'],
                                    // ['/Components/Mysqli/Chain/insert_method', 'insert'],
                                    ['/Components/Mysqli/Chain/replaceMethod', 'replace'],
                                    ['/Components/Mysqli/Chain/onDuplicateMethod', 'onDuplicate'],

                                    // ['/Components/Mysqli/Chain/update_method', 'update'],
                                    // ['/Components/Mysqli/Chain/delete_method', 'delete'],

                                ]
                            },

                        ]
                    },
                ]
            },
            {
                title: 'ORM',
                collapsable: true,
                sidebarDepth: 0,
                children: [
                    ['/Components/Orm/install', '安装'],
                    // ['/Components/Orm/popular_science_concept', '科普概念'],
                    ['/Components/Orm/configurationRegister', '配置信息注册'],
                    {
                        title: '定义模型',
                        path: '/Components/Orm/defineModel',
                        collapsable: false,
                        sidebarDepth: 0,
                        children: [
                            ['/Components/Orm/DefineModel/defineTableStructure', '定义表结构'],
                            ['/Components/Orm/DefineModel/specifyConnectionName', '指定连接名'],
                        ]
                    },
                    ['/Components/Orm/customSqlExecution', '自定义SQL执行'],
                    ['/Components/Orm/transactionOperations', '事务操作'],
                    ['/Components/Orm/readWriteSeparation', '读写分离'],
                    ['/Components/Orm/query', '查询'],
                    ['/Components/Orm/add', '新增'],
                    ['/Components/Orm/delete', '删除'],
                    ['/Components/Orm/update', '更新'],
                    ['/Components/Orm/coherentOperation', '连贯操作'],
                    ['/Components/Orm/aggregation', '聚合'],
                    ['/Components/Orm/getter', '获取器'],
                    ['/Components/Orm/modifier', '修改器'],
                    {
                        title: '关联',
                        collapsable: true,
                        sidebarDepth: 0,
                        children: [
                            ['/Components/Orm/Associat/oneToOneAssociations', '一对一关联'],
                            ['/Components/Orm/Associat/oneToManyAssociations', '一对多关联'],
                        ]
                    },
                ]
            }
        ]
    },
    {
        title: '缓存',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            {
                title: 'Redis',
                collapsable: true,
                sidebarDepth: 0,
                children: [
                    ['/Components/Redis/introduction', '介绍'],
                    ['/Components/Redis/install', '安装'],
                    ['/Components/Redis/config', '配置'],
                    ['/Components/Redis/redis', '单机客户端'],
                    ['/Components/Redis/cluster', '集群客户端'],
                    ['/Components/Redis/pool', '连接池'],
                    ['/Components/Redis/connection', '连接(connection)'],
                    ['/Components/Redis/keys', '键(keys)'],
                    ['/Components/Redis/string', '字符串(string)'],
                    ['/Components/Redis/hash', '哈希(hash)'],
                    ['/Components/Redis/lists', '列表(lists)'],
                    ['/Components/Redis/sets', '集合(sets)'],
                    ['/Components/Redis/sortedSets', '有序集合(sorted sets)'],
                    ['/Components/Redis/hyperLogLog', 'HyperLogLog'],
                    ['/Components/Redis/pubSub', '发布/订阅(pub/sub)'],
                    ['/Components/Redis/transaction', '事务 (transaction)'],
                    ['/Components/Redis/geoHash', 'geohash'],
                    ['/Components/Redis/clusterMethod', '集群方法(cluster)'],
                    ['/Components/Redis/pipe', '管道(pipe)'],
                ]
            },
            {
                title: 'memcached',
                collapsable: true,
                sidebarDepth: 0,
                children: [
                    ['/Components/Memcache/memcache', '客户端'],
                    ['/Components/Memcache/pool', '连接池'],
                ]
            },
            {
                title: 'FastCache',
                collapsable: true,
                sidebarDepth: 0,
                children: [
                    ['/Components/FastCache/fastCache', '基础使用']
                ]
            }
        ]
    },
    {
        title: '队列服务',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            {
                title: 'Queue组件',
                collapsable: true,
                sidebarDepth: 0,
                children: [
                    ['/Components/Queue/install', '安装'],
                    ['/Components/Queue/driver', '自定义驱动'],
                    ['/Components/Queue/usage', '使用示例']
                ]
            },
            {
                title: 'Kafka组件',
                collapsable: true,
                sidebarDepth: 0,
                children: [
                    ['/Components/Kafka/install', '安装'],
                    ['/Components/Kafka/producer', '生产者'],
                    ['/Components/Kafka/consumer', '消费者'],
                ]
            },
            ['/Components/FastCache/fastCacheQueue', 'FastCache队列'],
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
                    ['/Components/Component/singleton', '单例'],
                    ['/Components/Component/readyScheduler', '就绪等待'],
                    ['/Components/Component/tableManager', 'Swoole Table'],
                    ['/Components/Component/atomic', 'Atomic 计数器'],
                ]
            },
            {
                title: 'Spl组件',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Components/Spl/splArray', 'SplArray'],
                    ['/Components/Spl/splBean', 'SplBean'],
                    ['/Components/Spl/splEnum', 'SplEnum'],
                    ['/Components/Spl/splStream', 'SplStream'],
                    ['/Components/Spl/splFileStream', 'SplFileStream'],
                    ['/Components/Spl/splString', 'SplString'],
                ]
            },
            {
                title: '通用连接池',
                collapsable: true,
                sidebarDepth: 0,
                children: [
                    ['/Components/Pool/introduction', '介绍'],
                    ['/Components/Pool/config', '连接池配置'],
                    ['/Components/Pool/demo', '示例'],
                    ['/Components/Pool/poolManage', '池管理器'],
                    ['/Components/Pool/abstractPool', '池对象方法'],
                ]
            },
            ['/Components/redisPool', 'redis-pool连接池'],
            {
                title: 'HTTP协程客户端',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                path: '/Components/HttpClient/introduction',
                children: [
                    ['/Components/HttpClient/request', '请求'],
                    ['/Components/HttpClient/response', '响应'],
                    ['/Components/HttpClient/webSocket', 'WebsocketClient'],
                ]
            },
            {
                title: 'Actor组件',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Components/Actor/actor', '安装与使用'],
                    ['/Components/Actor/analysis', '设计解读'],
                ]
            },
            ['/Components/whoops', 'Whoops'],
            {
                title: 'SyncInvoker',
                path: '/Components/syncInvoker',
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Components/SyncInvoker/monggoDb', 'MonggoDb客户端案例'],
                ]
            },
            ['/Components/tracker', '链路追踪'],
            ['/Components/policy', 'Policy策略权限'],
            ['/Components/jwt', 'JWT令牌'],
            ['/Components/atomicLimit', 'atomic限流器'],
            {
                title: 'words-match',   // 必要的
                path: '/Components/WordsMatch/WordsMatch',
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Components/WordsMatch/ab', '性能测试']
                ]
            },
            {
                title: '杂项工具',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Components/Sundries/arrayToTextTable', 'ArrayToTextTable'],
                    ['/Components/Sundries/file', 'File'],
                    ['/Components/Sundries/hash', 'Hash'],
                    ['/Components/Sundries/random', 'Random'],
                    ['/Components/Sundries/snowFlake', 'SnowFlake'],
                    ['/Components/Sundries/str', 'Str'],
                    ['/Components/Sundries/time', 'Time']
                ]
            }
        ]
    },
    {
        title: '微信支付宝SDK',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            {
                title: '支付SDK',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Components/Pay/ali', '支付宝'],
                    ['/Components/Pay/wechat', '微信'],
                ]
            },
            {
                title: '微信SDK',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Components/Wechat/miniProgram', '公众号'],
                    ['/Components/Wechat/officialAccount', '小程序'],
                ]
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
                path: '/Components/Rpc/introduction',
                children: [
                    ['/Components/Rpc/server', '服务端'],
                    ['/Components/Rpc/client', '客户端'],
                    ['/Components/Rpc/otherPlatform', '跨语言'],
                    ['/Components/Rpc/registerCenter', '服务注册中心'],
                ]
            },
            ['/Components/consul', 'Concul客户端'],
            {
                title: '配置中心',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Components/apollo', 'Appolo配置中心'],
                ]
            }
        ]
    },
    {
        title: '公开文章',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            ['/Article/learnSwoole', '如何学习swoole'],
            ['/Article/swooleIpLimit', 'swoole如何对ip限制访问频率'],
            ['/Article/degradedService', '微服务开发中的服务限流与降级'],
        ]
    },
    {
        title: '常见问题',   // 必要的
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
    }
];
const sidebarEn = [];

module.exports = {sidebarCn, sidebarEn};
