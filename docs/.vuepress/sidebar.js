const sidebarCn = [
    {
        title: '前言',
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            ['/Preface/introduction', '项目介绍'],
            ['/Preface/developerRead', '开发者必读'],
            ['/Preface/updateLog', '更新记录'],
            ['/Preface/donation', '捐赠'],
            ['/Preface/contactAuthor', '联系作者'],

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
            ['/Introduction/hello_world', 'Hello World'],
            ['/Introduction/docker', 'Docker镜像'],
            ['/Introduction/config', '配置文件'],
            ['/Introduction/server', '服务管理'],
            ['/Introduction/proxy', '反向代理'],
            {
                title: '协程操作指南',   // 必要的
                collapsable: false, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Introduction/coroutine_create', '创建协程'],
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
            ['/HttpServer/fast_route', '路由'],
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
                    ['/Components/VerifyCode/verify_code', '使用'],
                ]
            },
            ['/HttpServer/uploadFile', '文件上传'],
            ['/HttpServer/validate', '验证器'],
            ['/HttpServer/session', 'Session'],
            ['/HttpServer/exception', '错误与异常'],
            ['/HttpServer/static', '静态资源处理'],
        ]
    },
    {
        title: 'Socket服务',
        collapsable: true,
        sidebarDepth: 0,
        children: [
            ['/Socket/tcp', 'TCP服务器'],
            ['/Socket/tcpSticky', 'TCP服务器处理粘包'],
            ['/Socket/websocket', 'Websocket服务器'],
            ['/Socket/websocketWss', 'Websocket支持wss'],
            ['/Socket/websocketShake', 'Websocket自定义握手'],
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
                                    ['/Components/Mysqli/Chain/limit_method', 'limit'],
                                    ['/Components/Mysqli/Chain/fields_method', 'fields'],
                                    ['/Components/Mysqli/Chain/where_method', 'where'],
                                    ['/Components/Mysqli/Chain/or_where_method', 'orWhere'],
                                    ['/Components/Mysqli/Chain/orderby_method', 'orderBy'],
                                    ['/Components/Mysqli/Chain/groupby_method', 'groupBy'],
                                    ['/Components/Mysqli/Chain/having_method', 'having'],
                                    ['/Components/Mysqli/Chain/or_having_method', 'orHaving'],
                                    ['/Components/Mysqli/Chain/join_method', 'join'],
                                    ['/Components/Mysqli/Chain/join_where_method', 'joinWhere'],
                                    ['/Components/Mysqli/Chain/join_or_where_method', 'joinOrWhere'],

                                    ['/Components/Mysqli/Chain/union_method', 'union'],
                                    ['/Components/Mysqli/Chain/lockInShareMode_method', 'lockInShareMode'],
                                    ['/Components/Mysqli/Chain/selectForUpdate_method', 'selectForUpdate'],
                                    ['/Components/Mysqli/Chain/setLockTableMode_method', 'setLockTableMode'],
                                    ['/Components/Mysqli/Chain/lockTable_method', 'lockTable'],
                                    ['/Components/Mysqli/Chain/unlockTable_method', 'unlockTable'],
                                    ['/Components/Mysqli/Chain/setQueryOption_method', 'setQueryOption'],

                                    ['/Components/Mysqli/Chain/setPrefix_method', 'setPrefix'],
                                    ['/Components/Mysqli/Chain/withTotalCount_method', 'withTotalCount'],
                                    // ['/Components/Mysqli/Chain/get_method', 'get'],
                                    // ['/Components/Mysqli/Chain/getOne_method', 'getOne'],
                                    // ['/Components/Mysqli/Chain/insert_method', 'insert'],
                                    ['/Components/Mysqli/Chain/replace_method', 'replace'],
                                    ['/Components/Mysqli/Chain/onDuplicate_method', 'onDuplicate'],

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
                    ['/Components/Orm/connection', '连接管理'],
                    ['/Components/Orm/model', '模型对象']
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
                    ['/Components/FastCache/fastcache', '基础使用'],
                    ['/Components/FastCache/fastcache-queue', '队列'],
                ]
            }
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
                    ['/Components/Component/ready_scheduler', '就绪等待'],
                    ['/Components/Component/table_manager', 'Swoole Table'],
                    ['/Components/Component/atomic', 'Atomic 计数器'],
                ]
            },
            {
                title: 'Spl组件',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Components/Spl/spl_array', 'SplArray'],
                    ['/Components/Spl/spl_bean', 'SplBean'],
                    ['/Components/Spl/spl_enum', 'SplEnum'],
                    ['/Components/Spl/spl_stream', 'SplStream'],
                    ['/Components/Spl/spl_filestream', 'SplFileStream'],
                    ['/Components/Spl/spl_string', 'SplString'],
                ]
            },
            {
                title: '通用连接池',
                collapsable: true,
                sidebarDepth: 2,
                children: [
                    ['/Components/Pool/introduction', '介绍'],
                    ['/Components/Pool/config', '连接池配置'],
                    ['/Components/Pool/demo', '示例'],
                    ['/Components/Pool/pool_manage', '池管理器'],
                    ['/Components/Pool/abstract_pool', '池对象方法']
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
                    ['/Components/HttpClient/websocket', 'WebsocketClient'],
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
            {
                title: 'Kafka',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/Components/Kafka/install', '安装'],
                    ['/Components/Kafka/consumer', '消费者'],
                    ['/Components/Kafka/producer', '生产者']
                ]
            },
            ['/Components/whoops', 'Whoops'],
            ['/Components/syncInvoker', 'SyncInvoker'],
            ['/Components/tracker', '链路追踪'],
            ['/Components/policy', 'Policy策略权限'],
            ['/Components/jwt', 'JWT令牌'],
            ['/Components/atomicLimit', 'atomic限流器']
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
                    ['/Components/Wechat/mini_program', '公众号'],
                    ['/Components/Wechat/official_account', '小程序'],
                ]
            },
        ]
    },
    {
        title: '微服务与分布式',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            ['/Distribute/micro_service', '什么是微服务？'],
            ['/Distribute/loadbalance', '如何实现分布式？'],
            ['/Distribute/atomic_limit', '服务限流'],
            {
                title: 'Rpc服务',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                path: '/Components/Rpc/introduction',
                children: [
                    ['/Components/Rpc/server', '服务端'],
                    ['/Components/Rpc/client', '客户端'],
                    ['/Components/Rpc/other_platform', '跨语言'],
                    ['/Components/Rpc/register_center', '服务注册中心'],
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
