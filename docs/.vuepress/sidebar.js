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
        title: '基础入门',
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
                collapsable: true,
                sidebarDepth: 0,
                children: [
                    ['/BaseUsage/Socket/tcp', 'TCP服务器'],
                    ['/BaseUsage/Socket/websocket', 'Websocket服务器'],
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
                collapsable: true,
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
                collapsable: false,
                sidebarDepth: 0,
                children: [
                    ['/Video/404', '单例'],
                    ['/Video/404', '就绪等待'],
                    ['/Video/404', 'Swoole Table'],
                    ['/Video/404', 'Atomic 计数器'],
                    ['/Video/404', 'Spl组件'],
                ]
            },
            ['/Video/404', 'Pool池管理器'],
            ['/Video/404', 'HTTPClient协程客户端'],
            ['/Video/404', 'Task组件'],
            ['/Video/404', 'Actor组件'],
            ['/Video/404', 'Whoops'],
            ['/Video/404', 'SyncInvoker'],
            ['/Video/404', 'Tracker'],
            ['/Video/404', 'Policy策略权限'],
        ]
    }

];
const sidebarEn = [];

module.exports = {sidebarCn, sidebarEn};