// 将模块定义为一个函数
define(["module", "varia"], function (module, varia) {
    console.log(module.config().apiKey);
    return function (title) {
        if (title = document.title) {
            console.log(varia.boom);
        }
    }
})