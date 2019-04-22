define(["jquery"], function($) {
    /*
        define([id], [dependencies], factory)
            id: 可选参数，定义模块的标识，如果没有提供该参数，则使用脚本文件名...
            dependencies: 可选参数，当前模块依赖的模块名称数组...
            factory: 工厂方法，模块初始化要执行的函数（只被执行一次）或对象（模块的输出值）...
    */
    var diva = "tianhou sung by csa";
    function printSong() {
        $("body").append("<hr>" + diva);
    }
    return {
        printSong: printSong
    };
});
