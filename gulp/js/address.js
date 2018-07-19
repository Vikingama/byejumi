define(["jumi", "isLogin", "isLoginwx", "vue", "weixin"], function (
    jumi,
    isLogin,
    isLoginwx,
    vue,
    weixin
) {
    var token = sessionStorage.getItem("token");
    var parainit = {
        token: token,
        requestSource: "WAP"
    };
    isLogin(function () {
        $.ajax({
            type: "post",
            url: "/userCenter/setting/getUserAddress",
            dataType: "json",
            data: parainit,
            success: function (data) {
                if (data.code == "0000") {
                    new vue({
                        el: "body",
                        components: {
                            "my-address": {
                                template: "#addressTemplate",
                                data: function () {
                                    return {
                                        data: data.data,
                                        addressList: data.data.addressList
                                    };
                                },
                                methods: {
                                    setDefault: function (id, isUse) {
                                        var that = this;
                                        var paraset = {
                                            addressId: id,
                                            isUse: isUse,
                                            requestSource: "WAP",
                                            token: token
                                        };
                                        $.ajax({
                                            type: "post",
                                            url: "/userCenter/setting/updateIsUse",
                                            data: paraset,
                                            dataType: "json",
                                            success: function (data) {
                                                if (data.code == "0000") {
                                                    that.data = data;
                                                    jumi.tips("修改成功！");
                                                    location.reload();
                                                } else {
                                                    jumi.tips(data.msg);
                                                }
                                            }
                                        });
                                    },
                                    editAddress: function (id) {
                                        location.href = "addressEdit.html?address_id=" + id;
                                    },
                                    createAddress: function () {
                                        location.href = "addressCreate.html";
                                    },
                                    delAddress: function (id) {
                                        var that = this;
                                        var paradel = {
                                            addressId: id,
                                            requestSource: "WAP",
                                            token: token
                                        };
                                        jumi.alert({
                                            skin: "ui-dialog-bankcard",
                                            content: "确认删除？",
                                            button: [
                                                {
                                                    value: "确认",
                                                    callback: function () {
                                                        $.ajax({
                                                            type: "post",
                                                            url: "/userCenter/setting/deleteAddress",
                                                            data: paradel,
                                                            dataType: "json",
                                                            success: function (data) {
                                                                if (data.code == "0000") {
                                                                    that.data = data;
                                                                    jumi.tips("删除成功！");
                                                                    location.reload();
                                                                } else {
                                                                    jumi.tips(data.msg);
                                                                }
                                                            }
                                                        });
                                                    }
                                                },
                                                {
                                                    value: "取消"
                                                }
                                            ]
                                        });
                                    }
                                }
                            }
                        },
                        ready: function () {
                            $("#myloading").remove();
                            weixin
                                .setTitle()
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
    var url = location.href.split("?code=")[0];
    var locationCodepar = location.href.split("?code=")[1];
    if (locationCodepar) {
        var locationCode = locationCodepar.split("&state=")[0];
        isLoginwx(locationCode, url);
    }
});
