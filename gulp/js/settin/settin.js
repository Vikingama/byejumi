console.log(`Ea anim beef ribs minim.
Burgdoggen tempor pork belly sed nulla cow pig et aute.
Pork chop qui corned beef, ground round ad adipisicing pastrami.
Biltong beef pig picanha, doner nostrud bresaola.`);
function identifyDevice () {
    var device;
    var pc = "pc";
    var android = "android";
    var iPhone = "iPhone";
    var iPad = "iPad";
    var mobile = "mobile";
    var browser = {
        versions: function () {
            var u = navigator.userAgent,
                app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1,
                presto: u.indexOf('Presto') > -1,
                webKit: u.indexOf('AppleWebKit') > -1,
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                mobile: !!u.match(/AppleWebKit.*Mobile.*/),
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                iPhone: u.indexOf('iPhone') > -1,
                iPad: u.indexOf('iPad') > -1,
                webApp: u.indexOf('Safari') == -1
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
}

identifyDevice();

function SubForm () {
    var e = $(".snow_nm").val();
    var p = $(".snow_pwd").val();
    var bChecked = false;
    var kk = window.location.host;//for crypet
    if ($("#login_remember").is(':checked'))
        bChecked = true;
    if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(e) == false) {
        $("#login_noti").text("邮箱格式不正确!");
        $(".snow_nm").focus()
    } else if (p.length < 6) {
        $("#login_noti").text("密码长度过短!")
    } else {
        $.ajax({
            type: "post",
            url: "/common/api/login_new",
            error: function () {
                return false
            },
            data: {
                email: e,
                pwd: encrypt(p),
                bCheck: bChecked,
            },
            datatype: "json",
            timeout: 5000,
            beforeSend: function () { },
            success: function (msg) {
                //console.log(msg);
                if (msg != "") {
                    if (msg.indexOf('{') >= 0) {
                        var obj = eval('(' + msg + ')');
                        var bSign = obj[obj.length - 1];
                        if (typeof (bSign) != "undefined" && bSign) {
                        }
                        if (window.localStorage) {
                            localStorage.removeItem("sc_unm");
                            localStorage.removeItem("sc_uid");
                            localStorage.removeItem("sc_uhd");
                            localStorage.removeItem("sc_uts");
                            localStorage.setItem("sc_unm", obj["uname"]);
                            localStorage.setItem("sc_uid", obj["uid"]);
                            localStorage.setItem("sc_uhd", obj["header"]);
                            localStorage.setItem("sc_uts", Date.parse(new Date()));
                        }
                        window.location.reload();
                    } else {
                        $("#login_noti").text("用户名或密码有误!");
                    }
                }
            }
        })
    }
    return false;
}

function quit () {
    $.ajax({
        type: "post",
        url: "/common/api/logout_new",
        error: function () {
            return false
        },
        data: {},
        datatype: "json",
        timeout: 5000,
        beforeSend: function () { },
        success: function (msg) {
            if (window.localStorage) {
                localStorage.removeItem("sc_unm");
                localStorage.removeItem("sc_uid");
                localStorage.removeItem("sc_uhd");
                localStorage.removeItem("sc_uts");
            } else if (navigator.cookieEnabled) {
                console.log("where is the cookie?I need to use it!");
            }
            window.location.reload();
        }
    })
}

function view1Animate () {
    if ($(".choose_intro").is(":visible")) {
        $(".choose_intro span.item_1").animate({ "left": "0", "top": "0" }, 300);
        $(".choose_intro span.item_2").animate({ "left": "92%", "top": "90%" }, 300);
        $(".choose_intro span.item_3").animate({ "left": "0", "top": "90%" }, 300);
        $(".choose_intro span.item_4").animate({ "left": "92%", "top": "0" }, 300);
    } else {
        $(".anim_frame").animate({ "width": "620px" }, 400);
    }
}

function view2Animate (num) {
    var num = arguments[0] || 0;
    if (num > 6) return false;
    $(".what_can_do ul > li").eq(num).fadeIn(150, function () {
        view2Animate(++num);
    });
}
function view3Animate () {
    $(".box_wrapper").stop().animate({ "margin-top": "0", "opacity": "1" }, 500, function () { $(".box_wrapper").scrollTop(0); });
}
function view4Animate () {
    $("#cs-text").animate({ "height": "130px" }, 300, function () { $(this).animate({ "opacity": "1" }, 800) })
}
function recoverView1 () {
    if ($(".choose_intro").is(":visible")) {
        $(".choose_intro span.item_1").animate({ "left": "46%", "top": "42%" });
        $(".choose_intro span.item_2").animate({ "left": "46%", "top": "42%" });
        $(".choose_intro span.item_3").animate({ "left": "46%", "top": "42%" });
        $(".choose_intro span.item_4").animate({ "left": "46%", "top": "42%" });
    } else {
        $(".anim_frame").animate({ "width": "100%" });
    }
}
function recoverView2 () {
    $(".what_can_do ul > li").fadeOut(600);
}
function recoverView3 () {
    $(".box_wrapper").stop().animate({ "opacity": "0", "margin-top": "1000px" }, 3000);
}
function recoverView4 () {
    $("#cs-text").animate({ "opacity": "0" });
}


function LoadViews (index, from) {
    if (scrollLock == false) {
        return false;
    } else {
        scrollLock = false;
    }
    if (from != 1)
        eval("recoverView" + index + "()");
    var tmpObj = $("#main_wrapper");
    var lineHeight = tmpObj.find("#section_page_" + index).height();
    var calcHeight = '-' + (index - 1) * lineHeight;
    tmpObj.stop().animate({ "margin-top": calcHeight + "px" }, 600, function () {
        scrollLock = true;
        eval("view" + index + "Animate()");
    });
}

LoadViews(pageFlag, 0);

function planeFly (obj) {
    var y = obj.offset().top;
    var x = obj.offset().left;
    if (scrollLock == false) {
        return false;
    } else {
        scrollLock = false;
    }
    if (x < 0) {
        obj.stop().animate({ "left": "0px", "top": "0px" }, 1000, function () {
            $("._btn_nav span.item_cancel").toggle();
            scrollLock = true;
        });

    } else {
        obj.stop().animate({ "left": "200px", "top": "-200px" }, 300, function () {
            $("._btn_nav span.item_cancel").toggle();
            obj.css({ "left": "-2100px", "top": "1000px" });
            scrollLock = true;
        });
    }
}

function ToggleViews (direction) {
    if (scrollLock == false) {
        return false;
    } else {
        scrollLock = false;
    }
    eval("recoverView" + pageFlag + "()");
    var tmpObj = $("#main_wrapper");
    var lineHeight = tmpObj.find("#section_page_" + pageFlag).height();
    var speed = 1000;
    if (direction == "down") {
        pageFlag--;
        speed = 600;
    } else {
        pageFlag++;
    }
    var calcHeight = '-' + (pageFlag - 1) * lineHeight;

    eval("recoverView" + pageFlag + "()");
    tmpObj.animate({ "margin-top": calcHeight + "px" }, speed, function () {
        scrollLock = true;
        setTimeIcons(pageFlag);
        eval("view" + pageFlag + "Animate()");
    });
}

function encrypt (txt) {
    var code1 = Math.round(Math.random());
    var code2 = parseInt(Math.random() * 10);
    var code3 = parseInt(Math.random() * 3);
    var code4 = parseInt(Math.random() * 2);
    var tpl = Array('s', 'n', 'o', 'w', 'c', 'o', 'a', 'l', '+', '=');
    var res = txt;
    if (code1 > 0) {
        res = res.replace(/(.{4})/g, '$1' + tpl[code2]);
        res = tpl[9] + code1 + res + tpl[code4];
    } else {
        res = res.replace(/(.{2})/g, '$1' + tpl[code2]);
        res = tpl[9] + code1 + res + tpl[code4];
    }
    res = res.split("").reverse().join("");
    return res;
}

$.fn.chkbox = function () {
    return $(this).each(function (k, v) {
        var $this = $(v);
        if ($this.is(':checkbox') && !$this.data('checkbox-replaced')) {
            $this.data('checkbox-replaced', true);
            var $l = $('<label for="' + $this.attr('id') + '" class="chkbox"></label>');
            var $y = $('<span class="yes">checked</span>');
            var $n = $('<span class="no">unchecked</span>');
            var $t = $('<span class="toggle"></span>');
            $l.append($y, $n, $t).insertBefore($this);
            $this.addClass('replaced');
            $this.on('change', function () {
                if ($this.is(':checked')) { $l.addClass('on'); }
                else { $l.removeClass('on'); }
                $this.trigger('focus');
            });
            $this.on('focus', function () { $l.addClass('focus') });
            $this.on('blur', function () { $l.removeClass('focus') });
            if ($this.is(':checked')) { $l.addClass('on'); }
            else { $l.removeClass('on'); }
        }
    });
};
$(':checkbox').chkbox();

$(document).ready(function () {
    $("#nav_loading").hide();
    $("._btn_nav span.item_cancel").hide();
    var myDate = new Date();
    var todayV = myDate.getDate();
    $("._btn_nav , ._btn_nav span.item_plane").on({
        mouseenter: function () {
            if (!$("._btn_nav span.item_cancel").is(':visible'))
                $("._btn_nav").css("background-position", "0 -50px");
        },
        mouseleave: function () {
            if (!$("._btn_nav span.item_cancel").is(':visible'))
                $("._btn_nav").css("background-position", "0 0");
        },
        click: function () {
            planeFly($("._btn_nav span.item_plane"));
            $("#navgation").stop().fadeToggle("slow");
            if (!$("._btn_nav span.item_cancel").is(':visible'))
                $("._btn_nav").css("background-position", "0 -100px");
            else
                $("._btn_nav").css("background-position", "0 0px");
            return false;
        }
    });

    $("#navgation .top_nav ul li").click(function () {
        var lk = $(this).find("a").attr("href");
        if (typeof (lk) != "undefined")
            window.location.href = lk;
        return false;
    })

    $(".ipt_text").focus(function () {
        var txt = $(this).attr("data-holder");
        $(this).attr("placeholder", "")
        $(this).siblings("legend").html("&nbsp;" + txt + "&nbsp;");
    });
    $(".ipt_text").blur(function () {
        $(this).siblings("legend").html("");
        var val = $(this).val().trim();
        var data_holder = $(this).attr("data-holder");
        if (val.length > 0) {
        } else {
            $(this).attr("placeholder", data_holder)
        }
    });

    $(".time_zoom span.time_node").on({
        mouseenter: function () {
            var id = $(this).attr("data-id");
            if (id == pageFlag) {
                return false;
            }
        },
        mouseleave: function () {
            var id = $(this).attr("data-id");
            if (id == pageFlag) {
                return false;
            }
        },
        click: function () {
            var id = $(this).attr("data-id");
            if (id != pageFlag) {
                LoadViews(id, 0);
                pageFlag = id;
                setTimeIcons(id);
            }
            return false;
        }
    });

    document.onkeydown = function (event) {
        if (event.ctrlKey == 1) {
            return false;
        } else if (event.keyCode == 38) {
            if (pageFlag < 2) return false;
            ToggleViews("down");
            return false;
        } else if (event.keyCode == 40) {
            if (pageFlag > 3) return false;
            ToggleViews("top");
            return false;
        } else if (event.keyCode == 116) {
            window.location.reload();
            return false;
        } else if (event.keyCode == 27) {
            if ($("#navgation").is(':visible')) {
                planeFly($("._btn_nav span.item_plane"));
                $("#navgation").hide();
                $("._btn_nav").css("background-position", "0 0px");
            }
            return false;
        } else if (event.keyCode == 13) {
            $("#btn_sub_form").trigger("click");
        }
    }
    document.body.onmousewheel = function (event) {
        event = event || window.event;
        mousewheelEvent(event, event.wheelDelta);
    };

    if (document.attachEvent) {
        document.attachEvent("onmousewheel", function (e) {
            mousewheelEvent(e, e.wheelDelta);
        });
    }
    else if (document.addEventListener) {
        document.addEventListener("DOMMouseScroll", function (e) {
            mousewheelEvent(e, e.detail * -40);
        }, false);
    }

    $(window).resize(function () {
        LoadViews(pageFlag, 1);
    });
});