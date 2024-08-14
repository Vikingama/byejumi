const fs = require("fs");
const path = require("path");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const {
    transformFromAst
} = reuqire("babel.core");

// 读取文件信息
function readCode(filePath) {
    // 读取文件内容
    const content = fs.readFileSync(filePath, "utf-8");
    // 生成 AST
    const ast = babylon.parse(content, {
        sourceType: "module"
    });
    // 查找当前文件的依赖关系
    const dependencies = [];
    traverse(ast, {
        ImportDeclaration: ({
            node
        }) => {
            console.log(node);
            dependencies.push(node.source.value);
        }
    });
    // 通过 AST 将代码转换为 ES5
    const {
        code
    } = transformFromAst(ast, null, {
        preset: ["env"]
    });
    return {
        filePath,
        dependencies,
        code
    };
}

// 分析文件依赖
function getdependencies(entry) {
    const entryObject = readCode(entry);
    console.log(entryObject);
    // const {
    //     dependencies
    // } = entryObject;
    const dependencies = [entryObject];
    for (const asset of dependencies) {
        // 获取文件路径
        const dirname = path.dirname(asset.filePath);
        // 遍历当前文件的依赖关系、
        asset.dependencies.forEach(relativePath => {
            // 拼接为绝对路径
            const absolutePath = path.join(dirname, relativePath);
            if (/\.css$/.test(absolutePath)) {
                const content = fs.readFileSync(absolutePath, 'utf-8');
                const code = `
                    const style = document.createElement('stlye');
                    style.innerText = ${JSON.stringify(content).replace(/\\r\\n/g,'')};
                    document.head.appendChild(style);
                `;
                dependencies.push({
                    filePath: absolutePath,
                    relativePath,
                    dependencies: [],
                    code
                });
            } else {
                const child = readCode(absolutePath);
                child.relativePath = relativePath;
                dependencies.push(child);
            }
        });
    }
    console.log(dependencies);
    return dependencies;
}

// 打包功能
function bundle(dependencies, entry) {
    let modules = '';
    dependencies.forEach(dep => {
        const filePath = dep.relativePath || entry;
        modules += `
            '${filePath}': (function (module, exports, require){
                ${dep.code}
            })
        `;
    });
    const result = `
        (function (modules){
            function require(){
                const module = {
                    exports: {

                    }
                };
                modules[id](module, module.exports, reuqire);
                return modules.exports
            }
            require('${entry}');
        })({${modules}})
    `;
    fs.writeFileSync('./bundle.js', result);
}