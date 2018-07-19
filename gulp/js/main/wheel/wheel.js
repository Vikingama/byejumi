define([
    "nav",
    "bigwheel",
    "asyncload",
    "weixin",
    "isLogin",
    "isLoginwx",
    "vue"
], function (nav, bigwheel, asyncload, weixin, isLogin, isLoginwx, vue) {
    var token = sessionStorage.getItem("token");
    var parainit = {
        token: token,
        requestSource: "WAP"
    };
    $.ajax({
        url: "/activity/getTurnTableIndex",
        type: "post",
        dataType: "json",
        data: parainit,
        success: function (data) {
            if (data.code == "0000") {
                new vue({
                    el: "body",
                    components: {
                        "my-wheel": {
                            template: "#wheelTemplate",
                            data: function () {
                                return {
                                    data: data.data,
                                    awardList: data.data.jmAwardList,
                                    freetimes: data.data.freeTimes,
                                    isIOSShow: sessionStorage.fromapp == "ios"
                                };
                            },
                            methods: {
                                toLogin: function () {
                                    isLogin();
                                },
                                viewshistory: function () {
                                    isLogin(function () {
                                        location.href = "/h5/views/wheel/wheelRecord.html";
                                    });
                                }
                            }
                        }
                    },
                    ready: function () {
                        var url = location.href.split("?code=")[0];
                        var locationCodepar = location.href.split("?code=")[1];
                        if (locationCodepar) {
                            var locationCode = locationCodepar.split("&state=")[0];
                            isLoginwx(locationCode, url);
                        }
                        var that = this;
                        nav.setActiveNav("discover");
                        $(".async").asyncload();
                        $("#myloading").remove();
                        $("#wheelBox").luckDraw({
                            width: "25",
                            height: "25",
                            line: 3,
                            list: 3,
                            click: ".wheel-start",
                            callback: function (data) {
                                that.$children[0].freetimes = data.data.freetimes;
                            }
                        });
                        weixin
                            .setTitle("聚米众筹天天转盘，富力转不停")
                            .setDesc()
                            .setImg()
                            .setUrl()
                            .share();
                    }
                });
            }
        }
    });
});
