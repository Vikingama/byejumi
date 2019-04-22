console.log("i am index.js");
require.config({
    // 所有模块根目录(默认值是加载 require.js 的 HTML 所处的位置)...
    baseUrl: "script",
    // 起始位置是相对于 baseUrl，不应含有 .js 后缀名，因为可能会映射到目录...
    paths: {
        jquery: [
            "https://cdn.bootcss.com/jquery/3.3.1/jquery.min",
            // 如果从 CDN 加载失败，就会取本地的 jquery...
            "jquery"
        ],
        backbone: "http://backbonejs.org/backbone-min",
        underscore: "https://underscorejs.org/underscore-min",
        main: "main/main",
        submix: "submix/submix",
        plugin: "plugin",
        varia: "varia"
    },
    // 用来配置那些没有使用 define() 声明依赖关系、设置模块的"浏览器全局变量注入"型脚本做依赖和导出配置...
    shim: {
        // shim 配置仅设置了代码的依赖关系，想要实际加载 shim 指定的或涉及的模块，仍然需要一个常规的 require/define 调用；设置 shim 本身不会触发代码的加载...
        backbone: {
            /*
                加载 backbone 之前，应该先加载 underscore、jquery...
                这里仅作展示，不要在一个 build 中混用 CDN 加载和 shim 配置，因为 shim 配置仅延时加载到所有的依赖已加载，而不会做任何 define 的自动装裹...
            */
            deps: ["underscore", "jquery"], // 指定要加载的一个依赖数组...
            callback: function() {
                // 在 deps 加载完毕后执行的函数，试了试好像并没有调用...
            },
            exports: "backbone"
        }
    },
    // 对于给定的模块前缀，使用一个不同的模块 ID 来加载该模块...
    map: {},
    /*
        将配置信息传给一个模块，这些配置往往是 application 级别的信息，需要一个手段将它们向下传递给模块...
        要获取这些信息的模块可以加载特殊的依赖 "module"，并调用 module.config()...
    */
    config: {
        "plugin/p4": {
            apiKey: "5fg4fd5gt5fedf5g45drt5"
        },
        i18n: {
            locale: "zh-cn"
        }
    },
    // 从 Common JS 包中加载模块...
    packages: [{}],
    // 在放弃加载一个脚本之前等待的秒数，0 表示禁用等待超时。默认为 7 秒...
    waitSeconds: 10,
    // 命名一个加载上下文，允许在同一页面上加载模块的多个版本...
    context: "",
    // 如果设置为 true，则当一个脚本不是通过 define() 定义且不具备可供检查的 shim 导出字串值时，就会抛出错误...
    enforceDefine: false,
    // 如果设置为 true，则使用 document.createElementNS() 去创建 script 元素...
    xhtml: false
});
require.onError = error => {
    console.log(error);
};
