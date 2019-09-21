const sidebar = require('./sidebar');

module.exports = {
    dest: 'publish',
    locales: {
        '/': {
            lang: 'zh-CN',
            title: 'EASYSWOOLE',
            description: 'easySwoole是一款高度封装了swoole拓展而依旧保持swoole原有特性的一个高性能分布式微服务框架，旨在提供一个高效、快速、优雅的框架给php开发者'
        },
        '/en/': {
            lang: 'en-US',
            title: 'EASYSWOOLE',
            description: 'an height-performance base on swoole extension,which is fully support swoole coroutine'
        }
    },
    themeConfig: {
        logo: '/resources/logo.png',
        theme: 'vuepress-theme-easyswoole',
        sidebar: 'auto',
        locales: {
            '/': {
                selectText: '选择语言',
                label: '简体中文',
                editLinkText: '在 GitHub 上编辑此页',
                sidebar: sidebar.sidebarCn,
                nav: [
                    {text: '源码仓库', link: 'https://github.com/easy-swoole'},
                ]
            },
            '/en/': {
                selectText: 'translate',
                label: 'ENGLISH',
                editLinkText: 'Edit this page on GitHub',
                sidebar: sidebar.sidebarEn,
                nav: [
                    {text: 'Repository', link: 'https://github.com/easy-swoole'},
                ]
            },
        }
    }
};