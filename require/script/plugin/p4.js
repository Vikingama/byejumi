// 将模块定义为一个函数
define(["../varia"], function (varia) {
    return function (title) {
        if (title = document.title) {
            console.log(varia);
        }
    }
})