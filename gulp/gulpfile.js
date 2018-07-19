var gulp = require("gulp");
var uglify = require("gulp-uglify");
/*
    gulp 基于管道的思想
    --->通过 src 读取文件产生数据流
        --->经过一系列 pipe 操作
            --->通过 dest 方法将数据流写入文件中...
*/
gulp.task("default", function () {
    // 默认任务代码/函数，直接 gulp 即可调用
});
gulp.task("taskName", function () {
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
    */
});
/*
    gulp.src(globs[,options]);
        输出符合所提供的匹配模式或匹配模式数组的文件夹，可以被 pipe 到别的插件中。
        gulp.src('client/templates/*.jade')
        .pipe(jade())
        .pipe(minify())
        .pipe(
            gulp.dest('build/minifiedTemplates')
        );
    watch 方法用于指定需要监视符合所提供的匹配模式或者匹配模式的数组的文件。
    一旦这些文件发生变动，就运行指定任务。
    gulp.watch(glob, function () {
    // 任务代码/函数
    })
*/
gulp.task("minify", function () {
    gulp.src('js/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest("build"));
});