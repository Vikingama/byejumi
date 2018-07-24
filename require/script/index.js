console.log("i am index.js");
requirejs.config({
    baseUrl: "script",
    paths: {
        jquery: "//cdn.bootcss.com/jquery/3.3.1/jquery.min.js",
        main: "main/main",
        submix: "submix/submix",
    }
});
