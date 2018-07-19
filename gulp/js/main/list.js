define(['jumi', 'nav', 'tab', 'scrolltotop', 'asyncload', 'getPara', 'vue', 'weixin', 'md5', 'load'], function (jumi, nav, tab, scrolltotop, asyncload, getPara, vue, weixin, md5, load) {
    var token = sessionStorage.getItem("token");
    var para = getPara.get();
    var parainit = {
        itemName: decodeURI(para.itemName),
        currentPage: 1,
        pageSize: 10,
        status: para.status,
        type: para.type,
        requestSource: 'WAP'
    };
    $.ajax({
        url: "/item/getBorrowListByCondition",
        type: 'post',
        dataType: 'json',
        data: parainit,
        success: function (data) {
            new vue({
                el: 'body',
                components: {
                    'my-search': {
                        template: '#searchTemplate',
                        data: function () {

                        }
                    },
                    'my-list': {
                        template: '#listTemplate',
                        data: function () {
                            return {
                                lists: data.data,
                                currentPage: 1,
                                isLoading: 0
                            }
                        },
                        methods: {
                            highlight: function () {
                                var patrn_null = /^\S{0}$/;
                                var userpwdrealproving = $("#userpwdreal").attr("proving") == 1 ? 1 : 0;
                                var userconfirmpwdrealproving = $("#userconfirmpwdreal").attr("proving") == 1 ? 1 : 0;
                                var boolNull = !patrn_null.test(this.userpwdreal) && !patrn_null.test(this.userconfirmpwdreal);
                                var boolproving = userpwdrealproving && userconfirmpwdrealproving;
                                if (boolNull && boolproving) {
                                    $(".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus").removeAttr("disabled", "disabled");
                                    $(".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus").css({ "color": "#ec6121" });
                                } else {
                                    $(".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus").attr("disabled", "disabled");
                                    $(".ui-dialog-upgrade .ui-dialog-footer button.ui-dialog-autofocus").css({ "color": "#999" });
                                }
                            },
                            userpwdrealKeyup: function () {
                                var patrn_number = /^[0-9]*$/;
                                if (!patrn_number.test(this.userpwdreal)) {
                                    $("#userpwdreal").attr("proving", 0);
                                    jumi.tips('支付密码格式错误！');
                                    this.userpwdreal = '';
                                    return;
                                }
                                if (this.userpwdreal.length == 6) {
                                    $("#userpwdreal").attr("proving", 1);
                                } else {
                                    $("#userpwdreal").attr("proving", 0);
                                }
                                this.highlight();
                            },
                            userconfirmpwdrealKeyup: function () {
                                var confirmpwdlen = this.userconfirmpwdreal.length;
                                if (confirmpwdlen == 6) {
                                    if (this.userconfirmpwdreal == this.userpwdreal) {
                                        $("#userconfirmpwdreal").attr("proving", 1);
                                    } else {
                                        $("#userconfirmpwdreal").attr("proving", 0);
                                        jumi.tips('两次设置的支付密码不一致！');
                                    }
                                } else {
                                    $("#userconfirmpwdreal").attr("proving", 0);
                                }
                                this.highlight();
                            }
                        }
                    }
                },
                ready: function () {
                    var that = this;
                    nav.setActiveNav("project");
                    $('.async').asyncload();
                    $('#myloading').remove();
                    weixin.setTitle()
                        .setDesc()
                        .setImg()
                        .setUrl()
                        .share();
                    var paraalert = {
                        token: token,
                        requestSource: 'WAP'
                    };
                    $.ajax({
                        url: '/common/getResetPayPasswordIndex',
                        type: 'post',
                        datatype: 'json',
                        data: paraalert,
                        success: function (data) {
                            if (data.code == '0000') {
                                if (data.data.isLogin == 1) {
                                    if (data.data.hasChangePaypassword == 0) {
                                        jumi.alert({
                                            title: '',
                                            content: '<div class="textcenter"><p>尊敬的用户：</p><p>聚米众筹进行了4.0账户安全升级，</p><p>请完成账户升级操作</p></div>',
                                            button: [{
                                                value: '立即前往',
                                                callback: function () {
                                                    $("#realname").html(data.data.realname);
                                                    $("#idNumber").html(data.data.idNumber);
                                                    jumi.alert({
                                                        title: '',
                                                        skin: 'ui-dialog-upgrade',
                                                        content: document.getElementById('upgradeWrap'),
                                                        button: [{
                                                            value: '立即修改',
                                                            callback: function () {
                                                                var parapwd = {
                                                                    password: md5(that.$children[0].userpwdreal).toLocaleUpperCase(),
                                                                    newPassword: md5(that.$children[0].userpwdreal).toLocaleUpperCase(),
                                                                    confirmPassword: md5(that.$children[0].userconfirmpwdreal).toLocaleUpperCase(),
                                                                    pwdType: 'paypassword',
                                                                    token: token,
                                                                    requestSource: 'WAP'
                                                                };
                                                                $.ajax({
                                                                    url: '/userCenter/setting/resetPayPassword',
                                                                    type: 'post',
                                                                    datatype: 'json',
                                                                    data: parapwd,
                                                                    success: function () {
                                                                        if (data.code == '0000') {
                                                                            jumi.alert({
                                                                                title: '',
                                                                                skin: 'ui-dialog-upsuccess',
                                                                                content: document.getElementById('upsuccess'),
                                                                                button: [{
                                                                                    value: '完成',
                                                                                    callback: function () {

                                                                                    }
                                                                                }]
                                                                            });
                                                                        } else {
                                                                            jumi.tips(data.msg);
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        }]
                                                    });
                                                    $(".ui-dialog .ui-dialog-footer button.ui-dialog-autofocus").attr("disabled", "disabled");
                                                }
                                            }]
                                        });
                                    }
                                }
                            }
                        }
                    });
                    load.pullup({
                        button: '#loadMoreButton',
                        callback: function (options) {
                            var component = that.$children[1];
                            options.currentPage++;
                            var paraload = {
                                itemName: decodeURI(para.itemName),
                                pageSize: 10,
                                currentPage: options.currentPage,
                                status: para.status,
                                type: para.type,
                                requestSource: 'WAP'
                            };
                            $.ajax({
                                url: "/item/getBorrowListByCondition",
                                type: 'post',
                                dataType: 'json',
                                data: paraload,
                                success: function (data) {
                                    if (data.code == '0000') {
                                        if (data.data != null && data.data.length > 0) {
                                            for (var i = 0; i < data.data.length; i++) {
                                                component.lists.push(data.data[i]);
                                            }
                                            setTimeout(function () {
                                                $('.async').asyncload();
                                            }, 0);
                                            options.isLoading = 0;
                                        } else {
                                            options.isLoading = 2;
                                            $(options.button).html('-- 我已倾囊相授 --');
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});