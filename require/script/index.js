console.log("i am index.js");
require.config({
    // 所有模块根目录(默认值是加载 require.js 的 HTML 所处的位置)...
    baseUrl: "script",
    paths: {
        jquery: "https://cdn.bootcss.com/jquery/3.3.1/jquery.min",
        main: "main/main",
        submix: "submix/submix",
        plugin: "plugin"
    }
});
