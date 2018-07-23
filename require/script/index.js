console.log("i am index.js");
require.config({
    baseUrl: "script",
    paths: {
        jquery: "https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js",
        main: "main/main.js",
        submix: "submix/submix.js"
    }
});
