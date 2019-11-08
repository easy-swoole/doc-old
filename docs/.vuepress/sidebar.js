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
                            ['/Components/Orm/DefineModel/timestamp', '自动时间戳'],
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
            ['/Components/kafka', 'Kafka'],
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
            },
            ['/Components/smtp', 'Smtp']
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
const sidebarEn = [
  {
    title: 'Preface',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      ['/En/Preface/introduction', 'Project introduction'],
      ['/En/Preface/developerRead', 'Must read'],
      ['/En/Preface/updateLog', 'Update record'],
      ['/En/Preface/componentUpdateLog', 'Component update record'],
      ['/En/Preface/donation', 'Donation'],
      ['/En/Preface/contactAuthor', 'Contact author'],
      ['/En/Preface/team', 'Document maintenance team']
    ]
  },
  {
    title: 'Quick start',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      ['/En/Introduction/environment', 'Development environment'],
      ['/En/Introduction/install', 'Install'],
      ['/En/Introduction/helloWorld', 'Hello World'],
      ['/En/Introduction/docker', 'Docker'],
      ['/En/Introduction/config', 'Configuration file'],
      ['/En/Introduction/server', 'Service management'],
      ['/En/Introduction/proxy', 'Reverse proxy'],
      {
        title: 'Coroutine',
        collapsable: false,
        sidebarDepth: 0,
        children: [
          ['/En/Introduction/coroutineCreate', 'Create coroutine'],
          ['/En/Components/Component/waitGroup', 'WaitGroup'],
          ['/En/Components/Component/csp', 'Csp'],
        ]
      },
      ['/En/Introduction/example', 'Development example'],
      ['/En/Introduction/demo', 'Demo'],
    ]
  },
  {
    title: 'Core architecture',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      ['/En/Core/lifecycle', 'Life cycle'],
      ['/En/Components/Component/ioc', 'IOC container'],
      ['/En/Components/Component/context', 'Context manager'],
      {
        title: 'Global events',
        path: '/En/Core/event',
        collapsable: false,
        sidebarDepth: 0,
        children: [
          ['/En/Core/event/bootstrap', 'bootstrap'],
          ['/En/Core/event/initialize', 'initialize'],
          ['/En/Core/event/mainServerCreate', 'mainServerCreate'],
          ['/En/Core/event/onRequest', 'onRequest'],
          ['/En/Core/event/afterRequest', 'afterRequest']
        ]
      },
      ['/En/Components/annotation', 'Annotation'],
      ['/En/Core/other', 'Other architecture systems']
    ]
  },
  {
    title: 'Basic use',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      ['/En/BaseUsage/serverManager', 'Swoole example'],
      ['/En/BaseUsage/customCommand', 'Custom command'],
      ['/En/Components/Component/process', 'Custom process'],
      ['/En/BaseUsage/event', 'Custom events'],
      ['/En/Components/task', 'Task AsyncTask'],
      ['/En/Components/Component/timer', 'Timer timer'],
      ['/En/BaseUsage/crontab', 'Crontab planning tasks'],
      ['/En/BaseUsage/log', 'Log processing'],
      ['/En/Components/phpunit', 'Unit testing'],
      ['/En/Components/console', 'Remote console']
    ]
  },
  {
    title: 'HTTP service',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      ['/En/HttpServer/fastRoute', 'Rooter'],
      ['/En/HttpServer/controller', 'Controller'],
      ['/En/HttpServer/annotation', 'Annotation controller'],
      ['/En/HttpServer/request', 'Request'],
      ['/En/HttpServer/response', 'Response'],
      ['/En/Components/template', 'View'],
      {
        title: 'Verification Code',
        collapsable: true,
        sidebarDepth: 0,
        path: '/En/Components/VerifyCode/introduction',
        children: [
          ['/En/Components/VerifyCode/config', 'Configure'],
          ['/En/Components/VerifyCode/verifyCode', 'Use']
        ]
      },
      ['/En/HttpServer/uploadFile', 'File upload'],
      ['/En/HttpServer/validate', 'Validator'],
      ['/En/HttpServer/session', 'Session'],
      ['/En/HttpServer/exception', 'Errors and exceptions'],
      ['/En/HttpServer/static', 'Static resources and cross domain processing'],
      ['/En/HttpServer/problem', 'Common problem']
    ]
  },
  {
    title: 'Socket service',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      ['/En/Socket/tcp', 'TCP server'],
      ['/En/Socket/tcpSticky', 'TCP server handles packet sticking'],
      ['/En/Socket/webSocket', 'Websocket server'],
      ['/En/Socket/webSocketWss', 'Websocket supports WSS'],
      ['/En/Socket/webSocketShake', 'Websocket custom handshake'],
      ['/En/Socket/udp', 'UDP server'],
      ['/En/Socket/question', 'Common problem']
    ]
  },
  {
    title: 'Database',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      ['/En/Components/ddl', 'DDL definition'],
      {
        title: 'mysqli',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          ['/En/Components/Mysqli/install', 'Installation and use'],
          {
            title: 'Query Builder',
            collapsable: true,
            sidebarDepth: 0,
            children: [
              ['/En/Components/Mysqli/builder', 'Basic use'],

              ['/En/Components/Mysqli/query', 'Query'],
              ['/En/Components/Mysqli/insert', 'Insert'],
              ['/En/Components/Mysqli/update', 'Update'],
              ['/En/Components/Mysqli/delete', 'Delete'],
              {
                title: 'Chaining operations',
                collapsable: true,
                sidebarDepth: 0,
                children: [
                  ['/En/Components/Mysqli/Chain/limitMethod', 'limit'],
                  ['/En/Components/Mysqli/Chain/fieldsMethod', 'fields'],
                  ['/En/Components/Mysqli/Chain/whereMethod', 'where'],
                  ['/En/Components/Mysqli/Chain/orWhereMethod', 'orWhere'],
                  ['/En/Components/Mysqli/Chain/orderbyMethod', 'orderBy'],
                  ['/En/Components/Mysqli/Chain/groupbyMethod', 'groupBy'],
                  ['/En/Components/Mysqli/Chain/havingMethod', 'having'],
                  ['/En/Components/Mysqli/Chain/orHavingMethod', 'orHaving'],
                  ['/En/Components/Mysqli/Chain/joinMethod', 'join'],
                  ['/En/Components/Mysqli/Chain/joinWhereMethod', 'joinWhere'],
                  ['/En/Components/Mysqli/Chain/joinOrWhereMethod', 'joinOrWhere'],

                  ['/En/Components/Mysqli/Chain/unionMethod', 'union'],
                  ['/En/Components/Mysqli/Chain/lockInShareModeMethod', 'lockInShareMode'],
                  ['/En/Components/Mysqli/Chain/selectForUpdateMethod', 'selectForUpdate'],
                  ['/En/Components/Mysqli/Chain/setLockTableModeMethod', 'setLockTableMode'],
                  ['/En/Components/Mysqli/Chain/lockTableMethod', 'lockTable'],
                  ['/En/Components/Mysqli/Chain/unlockTableMethod', 'unlockTable'],
                  ['/En/Components/Mysqli/Chain/setQueryOptionMethod', 'setQueryOption'],

                  ['/En/Components/Mysqli/Chain/setPrefixMethod', 'setPrefix'],
                  ['/En/Components/Mysqli/Chain/withTotalCountMethod', 'withTotalCount'],
                  ['/En/Components/Mysqli/Chain/replaceMethod', 'replace'],
                  ['/En/Components/Mysqli/Chain/onDuplicateMethod', 'onDuplicate']
                ]
              }

            ]
          }
        ]
      },
      {
        title: 'ORM',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          ['/En/Components/Orm/install', 'Install'],
          ['/En/Components/Orm/configurationRegister', '配置信息注册'],
          {
            title: '定义模型',
            path: '/En/Components/Orm/defineModel',
            collapsable: false,
            sidebarDepth: 0,
            children: [
              ['/En/Components/Orm/DefineModel/defineTableStructure', '定义表结构'],
              ['/En/Components/Orm/DefineModel/specifyConnectionName', '指定连接名'],
              ['/En/Components/Orm/DefineModel/timestamp', '时间戳'],
            ]
          },
          ['/En/Components/Orm/customSqlExecution', '自定义SQL执行'],
          ['/En/Components/Orm/transactionOperations', '事务操作'],
          ['/En/Components/Orm/readWriteSeparation', '读写分离'],
          ['/En/Components/Orm/query', '查询'],
          ['/En/Components/Orm/add', '新增'],
          ['/En/Components/Orm/delete', '删除'],
          ['/En/Components/Orm/update', '更新'],
          ['/En/Components/Orm/coherentOperation', '连贯操作'],
          ['/En/Components/Orm/aggregation', '聚合'],
          ['/En/Components/Orm/getter', '获取器'],
          ['/En/Components/Orm/modifier', '修改器'],
          {
            title: '关联',
            collapsable: true,
            sidebarDepth: 0,
            children: [
              ['/En/Components/Orm/Associat/oneToOneAssociations', '一对一关联'],
              ['/En/Components/Orm/Associat/oneToManyAssociations', '一对多关联'],
            ]
          },
        ]
      }
    ]
  },
  {
    title: 'Cache',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      {
        title: 'Redis',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          ['/En/Components/Redis/introduction', 'Introduce'],
          ['/En/Components/Redis/install', 'Install'],
          ['/En/Components/Redis/config', 'Configure'],
          ['/En/Components/Redis/redis', 'Stand alone client'],
          ['/En/Components/Redis/cluster', 'Cluster client'],
          ['/En/Components/Redis/pool', 'Connection pool'],
          ['/En/Components/Redis/connection', 'Connection'],
          ['/En/Components/Redis/keys', 'Key'],
          ['/En/Components/Redis/string', 'String'],
          ['/En/Components/Redis/hash', 'Hash'],
          ['/En/Components/Redis/lists', 'Lists'],
          ['/En/Components/Redis/sets', 'Sets'],
          ['/En/Components/Redis/sortedSets', 'Sorted sets'],
          ['/En/Components/Redis/hyperLogLog', 'HyperLogLog'],
          ['/En/Components/Redis/pubSub', 'Pub/Sub'],
          ['/En/Components/Redis/transaction', 'Transaction'],
          ['/En/Components/Redis/geoHash', 'Geohash'],
          ['/En/Components/Redis/clusterMethod', 'Cluster'],
          ['/En/Components/Redis/pipe', 'Pipe']
        ]
      },
      {
        title: 'memcached',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          ['/En/Components/Memcache/memcache', 'Client'],
          ['/En/Components/Memcache/pool', 'Connection pool']
        ]
      },
      {
        title: 'FastCache',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          ['/En/Components/FastCache/fastCache', 'Basic use']
        ]
      }
    ]
  },
  {
    title: 'Queue service',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      {
        title: 'Queue',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          ['/En/Components/Queue/install', 'Install'],
          ['/En/Components/Queue/driver', 'Custom driver'],
          ['/En/Components/Queue/usage', 'Use example']
        ]
      },
      ['/En/Components/kafka', 'Kafka'],
      ['/En/Components/FastCache/fastCacheQueue', 'FastCache队列']
    ]
  },
  {
    title: 'Component library',
    collapsable: true,
    sidebarDepth: 0,
    children: [
      {
        title: 'Basic components',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          ['/En/Components/Component/singleton', 'Singleton'],
          ['/En/Components/Component/readyScheduler', 'Ready waiting'],
          ['/En/Components/Component/tableManager', 'Swoole Table'],
          ['/En/Components/Component/atomic', 'Atomic Counter']
        ]
      },
      {
        title: 'Spl component',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
          ['/En/Components/Spl/splArray', 'SplArray'],
          ['/En/Components/Spl/splBean', 'SplBean'],
          ['/En/Components/Spl/splEnum', 'SplEnum'],
          ['/En/Components/Spl/splStream', 'SplStream'],
          ['/En/Components/Spl/splFileStream', 'SplFileStream'],
          ['/En/Components/Spl/splString', 'SplString'],
        ]
      },
      {
        title: 'Universal connection pool',
        collapsable: true,
        sidebarDepth: 0,
        children: [
          ['/En/Components/Pool/introduction', 'Introduce'],
          ['/En/Components/Pool/config', 'Connection pool configuration'],
          ['/En/Components/Pool/demo', 'Example'],
          ['/En/Components/Pool/poolManage', 'Pool Manager'],
          ['/En/Components/Pool/abstractPool', 'Pool object method']
        ]
      },
      ['/En/Components/redisPool', 'Redis-pool connection pool'],
      {
        title: 'HTTP protocol client',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        path: '/En/Components/HttpClient/introduction',
        children: [
          ['/En/Components/HttpClient/request', 'Request'],
          ['/En/Components/HttpClient/response', 'Response'],
          ['/En/Components/HttpClient/webSocket', 'WebsocketClient'],
        ]
      },
      {
        title: 'Actor component',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
          ['/En/Components/Actor/actor', 'Install'],
          ['/En/Components/Actor/analysis', 'Interpretation of design']
        ]
      },
      ['/En/Components/whoops', 'Whoops'],
      {
        title: 'SyncInvoker',
        path: '/En/Components/syncInvoker',
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
          ['/En/Components/SyncInvoker/monggoDb', 'MonggoDb client case']
        ]
      },
      ['/En/Components/tracker', 'Link tracking'],
      ['/En/Components/policy', 'Policy permissions'],
      ['/En/Components/jwt', 'JWT'],
      ['/En/Components/atomicLimit', 'Atomic current limiter'],
      {
        title: 'words-match',   // 必要的
        path: '/En/Components/WordsMatch/WordsMatch',
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
          ['/En/Components/WordsMatch/ab', 'Performance testing']
        ]
      },
      {
        title: 'Miscellaneous tools',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
          ['/En/Components/Sundries/arrayToTextTable', 'ArrayToTextTable'],
          ['/En/Components/Sundries/file', 'File'],
          ['/En/Components/Sundries/hash', 'Hash'],
          ['/En/Components/Sundries/random', 'Random'],
          ['/En/Components/Sundries/snowFlake', 'SnowFlake'],
          ['/En/Components/Sundries/str', 'Str'],
          ['/En/Components/Sundries/time', 'Time']
        ]
      }
    ]
  },
  {
    title: 'WeChat Alipay SDK',   // 必要的
    collapsable: true, // 可选的, 默认值是 true,
    sidebarDepth: 0,    // 可选的, 默认值是 1
    children: [
      {
        title: 'Pay SDK',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
          ['/En/Components/Pay/ali', 'Alipay'],
          ['/En/Components/Pay/wechat', 'WeChat']
        ]
      },
      {
        title: 'Wechat SDK',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
          ['/En/Components/Wechat/miniProgram', 'Official account'],
          ['/En/Components/Wechat/officialAccount', 'Small program']
        ]
      },
    ]
  },
  {
    title: 'Microservice and distribution',   // 必要的
    collapsable: true, // 可选的, 默认值是 true,
    sidebarDepth: 0,    // 可选的, 默认值是 1
    children: [
      ['/En/Distribute/microService', 'What is microservice？'],
      ['/En/Distribute/loadbalance', 'How to realize distributed？'],
      ['/En/Distribute/atomicLimit', 'Service restriction'],
      {
        title: 'Rpc service',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        path: '/En/Components/Rpc/introduction',
        children: [
          ['/En/Components/Rpc/server', 'Service'],
          ['/En/Components/Rpc/client', 'Client'],
          ['/En/Components/Rpc/otherPlatform', 'Cross language'],
          ['/En/Components/Rpc/registerCenter', 'Service registry']
        ]
      },
      ['/En/Components/consul', 'Concul client'],
      {
        title: 'Configuration center',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
          ['/En/Components/apollo', 'Appolo configuration center'],
        ]
      }
    ]
  },
  {
    title: 'Public articles',   // 必要的
    collapsable: true, // 可选的, 默认值是 true,
    sidebarDepth: 0,    // 可选的, 默认值是 1
    children: [
      ['/En/Article/learnSwoole', 'How to learn swoole'],
      ['/En/Article/swooleIpLimit', 'How does swoole restrict access frequency to IP'],
      ['/En/Article/degradedService', 'Service flow restriction and degradation in microservice development']
    ]
  },
  {
    title: 'Common problem',   // 必要的
    collapsable: true, // 可选的, 默认值是 true,
    sidebarDepth: 0,    // 可选的, 默认值是 1
    children: [
      ['/En/Other/swooleTracker', 'SwooleTracker'],
      ['/En/Other/process', 'Queue consumption / custom process issues'],
      ['/En/Other/redisSubscribe', 'Redis/Kafka Subscribe'],
      ['/En/Other/kernelOptimization', 'Kernel optimization'],
      ['/En/Other/hotReload', 'Service hot overload'],
      ['/En/Other/random', 'Random generation problem'],
      ['/En/Other/traitSingleTon', 'Trait and Singleton'],
      ['/En/Other/mysqlIndexReduce', 'MySQL index dimensionality reduction'],
      ['/En/Other/tpORM', 'Tporm usage problems'],
      ['/En/Other/curlSsl', 'Curlssl error'],
      ['/En/Other/chromeHeadless', 'ChromeHeadless'],
      ['/En/Other/graphQL', 'GraphQL']
    ]
  }
];

module.exports = {sidebarCn, sidebarEn};
