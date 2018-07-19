define(['jumi', 'nav', 'asyncload', 'vue', 'getPara', 'isLogin', 'md5', 'weixin'], function (jumi, nav, asyncload, vue, getPara, isLogin, md5, weixin) {
    var para = getPara.get();
    var token = sessionStorage.getItem("token");
    var parainit = {
        token: token,
        requestSource: 'WAP'
    };
    isLogin(function () {
        $.ajax({
            url: '/userCenter/userAccount/initOpenAccountOrBindCard',
            type: 'post',
            dataType: 'json',
            data: parainit,
            success: function (data) {
                if (data.code == '0000') {
                    new vue({
                        el: 'body',
                        data: function () {
                            return {
                                data: data,
                                realname: data.data.realname,
                                idNumber: data.data.idNumber,
                                backcardList: data.data.bankList,
                                bankcard: '',
                                paypassword: '',
                                reservephone: '',
                                phonecode: '',
                                originOrderNo: '',
                                clickstatus: true
                            }
                        },
                        methods: {
                            highlight: function () {
                                var patrn_null = /^\S{0}$/;
                                var bankcardproving = $("#bankcard").attr("proving") == 1 ? 1 : 0;
                                var reservephoneproving = $("#reservephone").attr("proving") == 1 ? 1 : 0;
                                var phonecodeproving = $("#phonecode").attr("proving") == 1 ? 1 : 0;
                                var boolNull = !patrn_null.test(this.bankcard) && !patrn_null.test(this.reservephone) && !patrn_null.test(this.phonecode);
                                var boolproving = bankcardproving && reservephoneproving && phonecodeproving;
                                if (boolNull && boolproving) {
                                    $(".button-fill.button.disabled").removeClass('disabled');
                                } else {
                                    $(".button-fill.button").addClass('disabled');
                                }
                            },
                            supportBankcard: function () {
                                jumi.alert({
                                    title: '支持绑定的银行卡',
                                    content: document.getElementById('bankcardListBox'),
                                    button: false
                                })
                            },
                            bankcardKeyup: function (event) {
                                var patrn_number = /^[\d ]*$/;
                                var bankcardAppear = "";
                                var bankcardStr = "";
                                if (!patrn_number.test(this.bankcard)) {
                                    $("#userpwdreal").attr("proving", 0);
                                    jumi.tips('请输入有效的银行卡号！');
                                    return;
                                }
                                for (var i = 0; i < this.bankcard.length; i++) {
                                    bankcardStr = this.bankcard.substr(i, 1);
                                    if (!isNaN(bankcardStr) && (bankcardStr != " ")) {
                                        bankcardAppear = bankcardAppear + bankcardStr;
                                    }
                                }
                                this.bankcard = "";
                                for (var i = 0; i < bankcardAppear.length; i++) {
                                    if (i == 6) this.bankcard = this.bankcard + " ";
                                    if (i == 12) this.bankcard = this.bankcard + " ";
                                    this.bankcard = this.bankcard + bankcardAppear.substr(i, 1);
                                }
                                this.highlight();
                            },
                            bankcardBlur: function () {
                                var backCardnum = /[\d ]{17,21}/;
                                if (!backCardnum.test(this.bankcard)) {
                                    $("#bankcard").attr("proving", 0);
                                    jumi.tips('请输入正确的银行卡号！');
                                    return;
                                } else {
                                    $("#bankcard").attr("proving", 1);
                                }
                                this.highlight();
                            },
                            resetpayStatus: function () {
                                var that = this;
                                var fakeinput = $(".fake input");
                                that.paypassword = '';
                                $('.active').css('left', 0 + 'px');
                                var pwd = that.paypassword.trim();
                                var len = pwd.length;
                                for (var i = 0; i < len; i++) {
                                    fakeinput.eq(i).val(pwd[i]);
                                    if (fakeinput.eq(i).next().length) {
                                        $('.active').css('left', fakeinput.eq(i + 1).offset().left - fakeinput.eq(0).offset().left - parseInt($('.wrap').css('padding-left')) + 'px');
                                    }
                                }
                                fakeinput.each(function (k, v) {
                                    if (k >= len) {
                                        $(this).val("");
                                    }
                                });
                            },
                            inputpwdKeyup: function () {
                                var that = this;
                                var fakeinput = $(".fake input");
                                var patrn_number = /^[0-9]*$/;
                                if (!that.paypassword) {
                                    $('.active').css('left', 0 + 'px');
                                }
                                if (patrn_number.test(that.paypassword)) {
                                    var pwd = that.paypassword.trim();
                                    var len = pwd.length;
                                    for (var i = 0; i < len; i++) {
                                        fakeinput.eq(i).val(pwd[i]);
                                        if (fakeinput.eq(i).next().length) {
                                            $('.active').css('left', fakeinput.eq(i + 1).offset().left - fakeinput.eq(0).offset().left - parseInt($('.wrap').css('padding-left')) + 'px');
                                        }
                                    }
                                    fakeinput.each(function (k, v) {
                                        if (k >= len) {
                                            $(this).val("");
                                        }
                                    });
                                    if (len == 6) {
                                        var bankcard = that.bankcard.replace(/[ ]/g, "");
                                        var parapaypwd = {
                                            bankCardId: bankcard,
                                            payPassword: md5(that.paypassword).toLocaleUpperCase(),
                                            confirmPayPassword: md5(that.paypassword).toLocaleUpperCase(),
                                            requestSource: 'WAP',
                                            token: token,
                                            originOrderNo: that.originOrderNo,
                                            phone: that.reservephone,
                                            phoneCode: that.phonecode,
                                        };
                                        $.ajax({
                                            url: '/userCenter/userAccount/bindCard',
                                            type: 'post',
                                            dataType: 'json',
                                            data: parapaypwd,
                                            success: function (data) {
                                                if (data.code == '0000') {
                                                    location.href = "/h5/views/account/settings/openaccountSuccess.html" + location.search;
                                                } else if (data.code == '1059') {
                                                    jumi.tips(data.msg);
                                                    that.resetpayStatus();
                                                    document.getElementById("real").focus();
                                                } else {
                                                    location.href = "/h5/views/account/settings/bankcardToBindFail.html?errorMessage=" + data.msg + "&" + location.search.substring(1);
                                                }
                                            }
                                        });
                                    }
                                } else {
                                    jumi.tips('请输入6位数字支付密码');
                                    that.resetpayStatus();
                                }
                            },
                            reservephoneKeyup: function () {
                                var patrn_number = /^[0-9]*$/;
                                var patrn = /^(13|14|15|17|18|19)\d{9}$/;
                                var phonelen = this.reservephone.length;
                                if (!patrn_number.test(this.reservephone)) {
                                    jumi.tips('手机号码格式不正确！');
                                    return;
                                }
                                if (phonelen == 11) {
                                    if (!patrn.test(this.reservephone)) {
                                        jumi.tips('手机号码格式不正确！');
                                        return;
                                    } else {
                                        $(".havacode").css("opacity", "1");
                                        $(".havacode").removeAttr("disabled", "disabled");
                                        $("#reservephone").attr("proving", 1);
                                    }
                                } else {
                                    $(".havacode").css("opacity", "0.5");
                                    $(".havacode").attr("disabled", "disabled");
                                    $("#reservephone").attr("proving", 0);
                                }
                                this.highlight();
                            },
                            phonecodeKeyup: function () {
                                var patrn_number = /^[0-9]*$/;
                                var len = this.phonecode.length;
                                if (!patrn_number.test(this.phonecode)) {
                                    $("#phonecode").attr("proving", 0);
                                    jumi.tips('请输入数字！');
                                    return;
                                }
                                if (len == 6) {
                                    $("#phonecode").attr("proving", 1);
                                } else {
                                    $("#phonecode").attr("proving", 0);
                                }
                                this.highlight();
                            },
                            havacode: function () {
                                var that = this;
                                if (that.clickstatus) {
                                    that.clickstatus = false;
                                    var bankcard = that.bankcard.replace(/[ ]/g, "");
                                    var count = 60;
                                    var paraPhonecode = {
                                        realname: that.realname,
                                        idNumber: that.idNumber,
                                        bankCardId: bankcard,
                                        phone: that.reservephone,
                                        token: token,
                                        requestSource: 'WAP'
                                    };
                                    $.ajax({
                                        url: '/userCenter/userAccount/getBankCode',
                                        type: 'post',
                                        dataType: 'json',
                                        data: paraPhonecode,
                                        success: function (data) {
                                            if (data.code == '0000') {
                                                var countdown = setInterval(function () {
                                                    count--;
                                                    $(".havacode").html(count + 's');
                                                    if (count <= 0) {
                                                        clearInterval(countdown);
                                                        $(".havacode").html("重新获取");
                                                        $(".havacode").css("opacity", "1");
                                                        $(".havacode").removeAttr("disabled", "disabled");
                                                    }
                                                }, 1000);
                                                that.originOrderNo = data.data.orderNo;
                                            } else {
                                                jumi.tips(data.msg);
                                                that.clickstatus = true;
                                            }
                                        }
                                    });
                                }
                            },
                            next: function () {
                                var that = this;
                                that.resetpayStatus();
                                var bankcard = that.bankcard.replace(/[ ]/g, "");
                                jumi.alert({
                                    skin: 'ui-dialog-paypwd',
                                    title: '请输入6位数字支付密码',
                                    content: document.getElementById('phonecodeWrap'),
                                    button: [{
                                        value: '忘记密码？',
                                        callback: function () {
                                            location.href = "/h5/views/account/settings/forgetPaypwd.html";
                                        }
                                    }]
                                });
                            }
                        },
                        ready: function () {
                            nav.setActiveNav("account");
                            $('#myloading').remove();
                            $('img.async').asyncload();
                            weixin.setTitle()
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
});