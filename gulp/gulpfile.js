// 目的：实现 js/css/html 的压缩合并、自动添加版本号和压缩 html...
var gulp = require("gulp"),
    // 压缩 html
    minify = require("gulp-html-minify"),
    // 压缩 css
    csso = require("gulp-csso"),
    // 过滤路径
    filter = require('gulp-filter'),
    // 压缩 js
    uglify = require("gulp-uglify"),
    // 生成版本号
    revall = require("gulp-rev-all"),
    // 替换引用
    useref = require("gulp-useref"),
    // 删除
    del = require("del");
gulp.task("del", function () {
    // 构建前先删除 dist 文件里的旧版本...
    del("./dist/*");
});
gulp.task("build", ["del"], function () {
    var htmlFilter = filter("./html/*.html", { restore: true });
    var cssFilter = filter("./css/*.css", { restore: true });
    var jsFilter = filter("./js/**/*.js", { restore: true });
    gulp.src("./html/*")
        .pipe(useref())
        .pipe(jsFilter)
        .pipe(uglify())
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe(csso())
        .pipe(cssFilter.restore)
        .pipe(revall.revision({
            dontRenameFile: [".html"],
            dontUpdateReference: [".html"]
        }))
        .pipe(htmlFilter)
        .pipe(minify())
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest("./dist"));
});