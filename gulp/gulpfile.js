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
    // 生成版本号 ---> 放在压缩后
    revall = require("gulp-rev-all"),
    // 替换引用
    useref = require("gulp-useref"),
    // 删除
    del = require("del");
gulp.task("del", function () {
    // 构建前先删除 dist 文件里的旧版本...
    del("./dist/*");
});
gulp.task("jsCompress", function () {
    gulp.src("./js/**/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"));
});
gulp.task("jsRevision", ["jsCompress"], function () {
    gulp.src("./dist/js/**/*.js")
        .pipe(revall.revision({
            dontUpdateReference: [".html", ".png", ".jpg"]
        }))
        .pipe(gulp.dest("./dist/js"));
});
gulp.task("cssCompress", function () {
    gulp.src("./css/**/*.css")
        .pipe(csso())
        .pipe(gulp.dest("./dist/css"));
});
gulp.task("cssRevision", ["cssCompress"], function () {
    gulp.src("./dist/css/**/*.css")
        .pipe(revall.revision({
            dontUpdateReference: [".html", ".png", ".jpg"]
        }))
        .pipe(gulp.dest("./dist/css"));
});
gulp.task("htmlRevision", ["cssRevision", "jsRevision"], function () {
    gulp.src("./html/**/*.html")
        .pipe(useref())
        .pipe(gulp.dest("./dist/html"));
});
gulp.task("htmlCompress", ["htmlRevision"], function () {
    gulp.src("./dist/html/*.html")
        .pipe(minify())
        .pipe(gulp.dest("./dist/html"));
});
gulp.task("build", ["del", "cssCompress", "cssRevision", "jsCompress", "jsRevision"]);