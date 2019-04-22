/*
    gulp 基于管道的思想...测试、检查、合并、压缩、格式化、浏览器自动刷新、部署文件生成...
    --->通过 src 读取文件产生数据流
        --->经过一系列 pipe 操作
            --->通过 dest 方法将数据流写入文件中...
    全局安装 gulp 是为了执行 gulp 任务，本地安装 gulp 则是为了调用 gulp 插件的功能...
*/
// 一一引用，一一加载...
var gulp = require("gulp"),
    uglify = require("gulp-uglify");
/*
    使用 gulp-load-plugins 模块，可以加载 package.json 文件中所有的 gulp 模块...
    var gulp = require('gulp'),
        gulpLoadPlugins = require('gulp-load-plugins'),
        plugins = gulpLoadPlugins();
*/
gulp.task("taskName", function() {
    /*
        任务代码/函数，通过 gulp taskName 调用...
        task 将以最大的并发数执行，gulp 会一次性运行所有的 task 并且不做任何等待；
        如果你想要创建一个序列化的 task 队列，并以特定的顺序执行，你需要做两件事：
            给出一个提示，来告知 task 什么时候执行完毕；
            告知一个 task 依赖另一个 task 的完成...
        gulp.task("one", function (cb){
            cb(err);
        });
        gulp.task("two", ["one"], function (){
            // one 完成之后...
        });
        gulp.task("default", ["one", "two"]);
        // 执行 gulp 任务
        gulp.run(taskName);
    */
});
/*
    gulp.src(globs[,options]);
        输出符合所提供的匹配模式或匹配模式数组的文件夹，可以被 pipe 到别的插件中。
        gulp.src('client/templates/*.jade')
        .pipe(jade())
        .pipe(minify())
        .pipe(
            gulp.dest('build/miniTemplates')
        );
    watch 方法用于指定需要监视符合所提供的匹配模式或者匹配模式的数组的文件，一旦这些文件发生变动，就运行指定任务。
    gulp.watch(glob, function () {
        // 任务代码/函数
    })
*/
gulp.task("js", ["css"], function() {
    // js/app.js：指定确切的文件名...
    // js/*.js：某个目录所有后缀名为js的文件...
    // js/**/*.js：某个目录及其所有子目录中的所有后缀名为js的文件...
    // !js/app.js：除了 js/app.js 以外的所有文件...
    // *.+(js css)：匹配项目根目录下，所有后缀名为 js 或 css 的文件...
    gulp.src("js/**/*.js")
        // gulp.src(['js/**/*.js', '!js/**/*.min.js'])
        .pipe(uglify())
        .pipe(
            gulp.dest("dist/js", {
                // 写入路径的基准目录...(默认当前目录...)
                cwd: "./",
                // 可读可写可执行...
                mode: 0777
            })
        )
        // 自动刷新浏览器...
        .pipe(livereload());
});
/*
    default 任务由 html\css\js 三个任务组成...
    task 方法会并发执行三个任务，每个任务异步调用(不是按照先后顺序执行的)...
*/
// 默认任务代码/函数，直接 gulp 即可调用
gulp.task("default", ["html", "css", "js"]);
// 设置任务依赖可以使个个任务按顺序执行...
gulp.task("html", function() {});
// ["html"] ---> html 执行完后才会执行 css 任务
gulp.task("css", ["html"], function() {});
