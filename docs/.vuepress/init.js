const sidebar = require('./sidebar');
const fs = require("fs");
const path = require("path");

// 遍历并创建不存在的文件
const createChildrenFile = (item) => {
    if (item instanceof Array) {
        for (let arrayItem of item) {
            if (arrayItem instanceof Array) {
                let markdown = arrayItem[0];
                let realPath = path.resolve(__dirname + '/..' + markdown + '.md').toString();
                fs.exists(realPath, function (exists) {
                    if (!exists) {
                        console.warn('Create: ' + realPath);
                        if (!fs.existsSync(path.parse(realPath).dir)) {
                            mkdirSync(path.parse(realPath).dir)
                        } else {
                            fs.writeFile(realPath, '# ' + path.parse(realPath).name, 'utf8', function (error) {
                                if (error) {
                                    console.log(error);
                                    return false;
                                }
                            });
                        }
                    }
                });
            } else {
                createChildrenFile(arrayItem)
            }
        }
    }
};

// 递归创建目录
function mkdirSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

for (let sub of sidebar.sidebarCn) {
    createChildrenFile(sub.children);
}

