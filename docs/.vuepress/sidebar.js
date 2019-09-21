const sidebarCn = [
    ['/', '欢迎使用'],
    {
        title: '基础用法',   // 必要的
        collapsable: true, // 可选的, 默认值是 true,
        sidebarDepth: 0,    // 可选的, 默认值是 1
        children: [
            ['/BaseUsage/asyncTask', '异步任务'],
            ['/BaseUsage/serverManager', '服务管理'],
            {
                title: '服务管理子菜单',   // 必要的
                collapsable: true, // 可选的, 默认值是 true,
                sidebarDepth: 0,    // 可选的, 默认值是 1
                children: [
                    ['/BaseUsage/asyncTask', '异步任务'],
                ]
            }
        ]
    }
];
const sidebarEn = [];

module.exports = {sidebarCn, sidebarEn};