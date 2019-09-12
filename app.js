const Koa = require('koa');
const Renderer = require('docsify-easyswoole-renderer');
const readFileSync = require('fs').readFileSync;

const app = new Koa();

// init renderer
const renderer = new Renderer({
    template: readFileSync('./templates/ssr.template.html', 'utf-8'),
    config: {
        name: 'EasySwoole',
        repo: 'https://github.com/easy-swoole',
        maxLevel: 6,
        subMaxLevel: 2,
        loadNavbar: 'NAVBAR.md',
        loadSidebar: 'SUMMARY.md',
        auto2top: true,
        basePath: '/docs/',
        autoHeader: true,
        routerMode: 'history',
        alias: {
            // '/README.md': '/Cn/README.md',
            // '/NAVBAR.md': '/Cn/NAVBAR.md',
            // '/SUMMARY.md': '/Cn/SUMMARY.md',
        },
        search: {
            maxAge: 3600000,
            paths: 'auto',
            placeholder: '聪明的人都善用搜索 ^_^',
            noData: '哎呀!搜不到您想要的东东o(╥﹏╥)o',
        }
    }
});

// koa renderer middleware
app.use(async ctx => {
    let requestUrl = ctx.request.url;
    await renderer.renderToString(requestUrl).then(html => {

        //  如果渲染成功说明找到了文件 注入元数据等信息
        let footer = readFileSync('./templates/footer.template.html', 'utf-8');
        let metaRegexp = new RegExp("<!--\\*(.*?)\\*-->", 'ig');
        let metaData = html.match(metaRegexp);

        if (metaData) {
            for (let i = 0; i < metaData.length; i++) {
                let metaNames = ['title', 'keywords', 'description'];
                let matchValue = metaData[i].substr(5, metaData[i].length - 10).split(':', 2);
                if (matchValue.length === 2 && metaNames.indexOf(matchValue[0].trim()) !== -1) {
                    let metaName = matchValue[0].trim();
                    let metaValue = matchValue[1].trim();
                    html = html.replace(new RegExp(("<!--" + 'inject-' + metaName + "-->"), 'g'), metaValue);
                }
            }
        }

        // 后备逻辑 如果仍然有未替换完的meta标签则进行后备替换
        html = html.replace(new RegExp(("<!--" + 'inject-title' + "-->"), 'g'), 'EasySwoole');
        html = html.replace(new RegExp(("<!--" + 'inject-keyword' + "-->"), 'g'), 'EasySwoole');
        html = html.replace(new RegExp(("<!--" + 'inject-description' + "-->"), 'g'), 'EasySwoole');

        html = html.replace(new RegExp(("<!--" + 'inject-footer' + "-->"), 'g'), footer);
        ctx.response.body = html;
    }).catch(err => {
        ctx.response.body = 'Render Exception: ' + err.toString()
    })
});

app.listen(3000);