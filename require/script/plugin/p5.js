// 简单包装 CommonJS 来定义模块
define(function (require, exports, module) {
    console.log(require);
    console.log(exports);
    console.log(module);
})