/**
 * MSS_Iframe.js
 * Mosn 2015.4.16
 * From MosnWork
 */

/*
@ 主函数 MSS_Iframe
@ init 初始化
*/
MSS_Iframe = (function() {
    //接受一个全局的菜单函数
    var menuList = "";
    var im = 0;

    //面板配置
    var init = function(data) {
        menuList = data;
        //设置高宽
        $(".mssm-nav-box ul").css({
            "width": $(document).width() - 58 + "px"
        });
        $(".mssm-main").css({
            "height": $(window).height() - 60 + "px"
        });
        $(".mssm-sidebar").css({
            "height": $(window).height() - 78 + "px"
        });
        $(".mssm_iframe").css({
            "width": $(document).width() - 205 + "px"
        });
        $(".mssm_iframe ul").css({
            "height": $(".mssm_iframe").height() - 51 + "px"
        });
        $(".mssm-i-box-nav").css({
            "width": $(".mssm-i-box").width() - 28 + "px"
        });

        window.onresize = function() {
            $(".mssm-nav-box ul").css({
                "width": $(document).width() - 58 + "px"
            });
            $(".mssm-main").css({
                "height": $(window).height() - 60 + "px"
            });
            $(".mssm-sidebar").css({
                "height": $(window).height() - 78 + "px"
            });
            $(".mssm_iframe").css({
                "width": $(document).width() - 205 + "px"
            });
            $(".mssm_iframe ul").css({
                "height": $(".mssm_iframe").height() - 51 + "px"
            });
            $(".mssm-i-box-nav").css({
                "width": $(".mssm-i-box").width() - 28 + "px"
            });
        }

        //开始写入顶级菜单
        var topHtml = "";
        for (var i = 0; i < menuList.length; i++) {
            if (menuList[i].parent == 0) {
                topHtml += "<li data-key='" + menuList[i].id + "'>" + menuList[i].text + "</li>";
            }
        }
        $(".mssm-nav-box ul").html(topHtml);
        $(".mssm-nav-box li").click(function() {
            $(this).addClass("mssm_selected").siblings().removeClass("mssm_selected");
            writeNav($(this).attr("data-key"));
        })
        $($(".mssm-nav-box").find("li")[0]).click();

        //开始监控移动导航的左右按钮
        $(".mssm-i-box-nav").delegate("dt", "click mousedown", function(e) {
            var d = e.srcElement ? e.srcElement : e.target;
            if (d.nodeName.toUpperCase() != "I") {
                $(this).addClass("mssm-i-box-selected").siblings().removeClass("mssm-i-box-selected");
                changeData($(this).attr('data-key'));
                changeCookie($(this).attr('data-key'));
                if (e.which == 3) {
                    e ? e.stopPropagation() : event.cancelBubble = true;
                    writeYmenu($(this), e.pageX, e.pageY, $(this).attr('data-key'));
                }
            }
        });

        //点击除指定input外，隐藏
        $(document).on("click", function(e) { //点击除指定input外，隐藏
            if ($(e.target).parents(".mssm-i-box-nav").length > 0 || $(e.target).parents(".mssm-right-box").length > 0) {

            } else {
                $(".mssm-right-box").remove();
            }
        });

        $(".mssm-i-box-nav").on("contextmenu", function(e) {
            return false;
        });

        $(".mssm-i-box .mssm-i-box-left").click(function() {
            im = im - 1;
            changeMove();
        });
        $(".mssm-i-box .mssm-i-box-right").click(function() {
            im = im + 1;
            changeMove();
        });
        $(".icon-home").click(function() {
            im = 0;
            changeMove();
            $($(".mssm-i-box-nav").find("dt")[0]).click();
        });
        //判断当前是否存在
        if (getCookie("mssmNav").split("_").length > 1) {
            reduction(getCookie("mssmNav").split("_"));
        }
    };

    //还原已打开
    var reduction = function(ln) {
        //var li = ln.split(",");
        for (var i = 1; i < ln.length; i++) {
            for (var s = 0; s < menuList.length; s++) {
                if (menuList[s].id == ln[i]) {
                    topLi(menuList[s].id, menuList[s].href, menuList[s].text);
                }
            }

        }

        var dang = ln[0].split("-")[2];
        var sn = $(".mssm-i-box-nav").find("dt");
        if (dang == undefined || dang == "undefined") {
            $(sn[0]).click();
        } else {
            for (var i = 0; i < sn.length; i++) {
                if ($(sn[i]).attr("data-key") == dang) {
                    $(sn[i]).click();
                }
            }
        }
    }

    //获取移动导航的最大宽度
    var getNavWidth = function(p) {
        var ln = $(".mssm-i-box-nav").find("dt");
        var width = 0;
        for (var i = 0; i < p; i++) {

            width += $(ln[i]).width() + 25;
        }
        return width;
    }

    //左右开始计算正式移动
    var changeMove = function() {
        if (im < 0) {
            im = 0;
        }
        if (im > $(".mssm-i-box-nav").find("dt").length + 1) {
            im = $(".mssm-i-box-nav").find("dt").length + 1;
        }
        if (getNavWidth($(".mssm-i-box-nav").find("dt").length + 1) > $(".mssm-i-box-nav").width() + getNavWidth(im)) {
            $(".mssm-i-box-nav dl").stop().animate({
                "left": getNavWidth(im) * -1 + "px"
            }, 500);
        } else if (getNavWidth($(".mssm-i-box-nav").find("dt").length + 1) - $(".mssm-i-box-nav").width() > 0) {
            $(".mssm-i-box-nav dl").stop().animate({
                "left": (getNavWidth($(".mssm-i-box-nav").find("dt").length + 1) - $(".mssm-i-box-nav").width()) * -1 + "px"
            }, 500);
        }
        //校正数为0的数量
        if (im == 0) {
            $(".mssm-i-box-nav dl").stop().animate({
                "left": "0px"
            }, 500);
        }

        //校正位移
        if (getNavWidth($(".mssm-i-box-nav").find("dt").length) < $(".mssm-i-box-nav").width()) {
            $(".mssm-i-box-nav dl").stop().animate({
                "left": "0px"
            }, 500);
        }
    }

    //导航菜单写入
    var writeNav = function(navid) {
        //开始写入
        var html = "";
        for (var i = 0; i < menuList.length; i++) {
            if (menuList[i].parent == navid) {
                html += "<div class='mssm-leftnav-box'>";
                html += "<p data-href='" + menuList[i].href + "' data-key='" + menuList[i].id + "'><i class='icon-folder-open'></i>" + menuList[i].text + "</p>";
                html += "<ul>";
                for (var s = 0; s < menuList.length; s++) {
                    if (menuList[s].parent == menuList[i].id) {
                        html += "<li data-href='" + menuList[s].href + "'  data-key='" + menuList[s].id + "'><i class='icon-file'></i>" + menuList[s].text + "</li>";
                    }
                }
                html += "</ul>";
                html += "</div>";
            }
        }
        $(".mssm-sidebar").html(html);
        $(".mssm-sidebar p").unbind();
        $(".mssm-sidebar p").click(function() {
            var item = $(this).next('ul');
            if (item.height() > 0) {
                item.stop().animate({
                    "height": "0px"
                }, 500);
            } else {
                item.stop().animate({
                    "height": 25 * item.find("li").length + "px"
                }, 500);
            }
        });
        $(".mssm-sidebar li").unbind();
        $(".mssm-sidebar li").click(function() {
            //去检查下是否可以点击
            var ln = $(".mssm-i-box-nav").find("dt");
            for (var n = 0; n < ln.length; n++) {
                if ($(ln[n]).attr("data-key") == $(this).attr('data-key')) {
                    $(ln[n]).click();
                    //先把左侧菜单选中调整下
                    var sn = $(".mssm-sidebar").find("li");
                    for (var i = 0; i < sn.length; i++) {
                        if ($(sn[i]).attr("data-key") != ikey) {
                            $(sn[i]).removeClass("mssm_selected");
                        }
                    }
                    $(this).addClass("mssm_selected");
                    return false;
                }
            }
            //可以点击的情况
            $(this).addClass("mssm_selected")
            var ikey = $(this).attr('data-key');
            var ihref = $(this).attr('data-href');
            var itext = $(this).html().split("i>")[$(this).html().split("i>").length - 1];
            //添加到COOKIE
            addCookie(ikey);
            //先把左侧菜单选中调整下
            var sn = $(".mssm-sidebar").find("li");
            for (var i = 0; i < sn.length; i++) {
                if ($(sn[i]).attr("data-key") != ikey) {
                    $(sn[i]).removeClass("mssm_selected");
                }
            }
            topLi(ikey, ihref, itext);
        });
    }

    //导航菜单点击
    var topLi = function(ikey, ihref, itext) {
        //吧需要写入的内容写入
        $("<li data-key='" + ikey + "'><iframe width='100%' height='100%' frameborder='0' src='" + ihref + "'></iframe></li>").appendTo("#mssm-box-iframe").addClass("mssm_selected").siblings().removeClass("mssm_selected");
        $("<dt data-key='" + ikey + "'>" + itext + "<i class='icon-remove'></i></dt>").appendTo(".mssm-i-box-nav dl").addClass("mssm-i-box-selected").siblings().removeClass("mssm-i-box-selected");

        //修正一下是否可以显示
        if (getNavWidth($(".mssm-i-box-nav").find("dt").length) > $(".mssm-i-box-nav").width()) {
            im = 99999;
            changeMove();
        }
        $(".mssm-i-box-nav .icon-remove").unbind();
        $(".mssm-i-box-nav .icon-remove").click(function(evt) {
            var dang;
            if ($(this).parent().hasClass("mssm-i-box-selected")) {
                //先切换到上一个tabs
                var $item = $(this).parent().prev();
                $item.addClass("mssm-i-box-selected").siblings().removeClass("mssm-i-box-selected");
                changeData($item.attr('data-key'));
                dang = $item.attr('data-key');
            } else {
                dang = $(this).parent().attr('data-key');
            }
            //开始删除当前tabs
            var deln = $("#mssm-box-iframe").find("li");
            for (var d = 0; d < deln.length; d++) {
                if ($(deln[d]).attr("data-key") == $(this).parent().attr("data-key")) {
                    $(deln[d]).remove();
                }
            }
            //删除COOKIE值
            deleteCookie($(this).parent().attr("data-key"), dang);
            $(this).parent().remove();
            //校正移动导航
            im = im - 1;
            changeMove();
            return false;
        });
    }

    //校正数据
    var changeData = function(key) {
        //显示一下真实页面
        var cn = $("#mssm-box-iframe").find("li");
        for (var s = 0; s < cn.length; s++) {
            if ($(cn[s]).attr("data-key") == key) {
                $(cn[s]).addClass("mssm_selected").siblings().removeClass("mssm_selected");
            }
        }
    }

    //cookie操作 添加
    var addCookie = function(value) {
        if (getCookie("mssmNav") == "") {
            var cookieString = "mssmNav=" + "-1-" + value + "_" + escape(value);
            document.cookie = cookieString;
        } else {
            var cookieString = "mssmNav=" + getCookie("mssmNav") + "_" + escape(value);
            document.cookie = cookieString;
        }
    }

    //cookie操作 获取
    var getCookie = function(name) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for (var i = 0; i < arrCookie.length; i++) {
            var arr = arrCookie[i].split("=");
            if (arr[0] == name) {
                return arr[1];
            };
        }
        return "";
    }

    //cookie操作 删除
    var deleteCookie = function(value, dang) {
        if (getCookie("mssmNav") != "") {
            var arrNav = getCookie("mssmNav").split("_");
            var cookieString = "mssmNav=-1-" + dang + "_";
            for (var i = 0; i < arrNav.length; i++) {
                if (arrNav[i] != value && i > 0) {
                    cookieString += arrNav[i] + "_";
                }
            }
            cookieString = cookieString.substring(0, cookieString.length - 1);
            document.cookie = cookieString;
        }
    }

    //cookie操作 改写
    var changeCookie = function(dang) {
        if (getCookie("mssmNav") != "") {
            var arrNav = getCookie("mssmNav").split("_");
            var cookieString = "mssmNav=-1-" + dang + "_";
            for (var i = 0; i < arrNav.length; i++) {
                cookieString += arrNav[i] + "_";
            }
            cookieString = cookieString.substring(0, cookieString.length - 1);
            document.cookie = cookieString;
        }
    }

    //冒泡
    var stopPropagation = function(e) {
        if (e.stopPropagation) { //支持W3C标准
            e.stopPropagation();
        } else { //IE8及以下浏览器
            e.cancelBubble = true;
        }
    }

    //右击菜单
    var writeYmenu = function(obj, x, y, key) {
        $(".mssm-right-box").remove();
        var html = "<div class='mssm-right-box' style='left:" + x + "px;top:" + y + "px;'><ul>";
        html += "<li data-handle='refresh'><i class='icon-refresh'></i>刷新当前页</li>";
        html += "<li data-handle='remove'><i class='icon-remove'></i>关闭当前页</li>";
        html += "<li data-handle='left'><i class='icon-remove-sign'></i>关闭左侧</li>";
        html += "<li data-handle='right'><i class='icon-remove-sign'></i>关闭右侧</li>";
        html += "</ul></div>";
        var Ymenu = $(html).appendTo("body");
        Ymenu.on("click", "li", function(e) {
            //阻止冒泡
            e ? e.stopPropagation() : event.cancelBubble = true;
            var $li = $(e.target).attr("data-handle");
            Ymenuhandle($li, key);
        });
    }

    //菜单4中操作
    var Ymenuhandle = function(hal, key) {
        //当前tabs
        var ifs = $("#mssm-box-iframe").find("li");
        var ils = $(".mssm-i-box-nav").find("dt");
        switch (hal) {
            case "refresh":
                //找到节点刷新
                for (var i = 0; i < ifs.length; i++) {
                    if ($(ifs[i]).attr("data-key") == key) {
                        $(ifs[i]).find("iframe")[0].contentWindow.location.reload(true);
                    }
                }
                break;
            case "remove":
                //找到节点删除
                for (var i = 0; i < ils.length; i++) {
                    if ($(ils[i]).attr("data-key") == key) {
                        $(ils[i]).find(".icon-remove").click();
                    }
                }
                break;
            case "left":
                //找到节点删除
                for (var i = 1; i < ils.length; i++) {
                    if ($(ils[i]).attr("data-key") == key) {
                        break;
                    } else {
                        $(ils[i]).find(".icon-remove").click();
                    }
                }
                break;
            case "right":
                //找到节点删除
                var isclode = false;
                for (var i = 1; i < ils.length; i++) {
                    if (isclode == true) {
                        $(ils[i]).find(".icon-remove").click();
                    }
                    if ($(ils[i]).attr("data-key") == key) {
                        isclode = true;
                    }
                }
                break;
        }
        $(".mssm-right-box").remove();
    }

    //打开新窗口
    var openIframe = function(opsg) {
        var ifs = $("#mssm-box-iframe").find("li");
        if (opsg.title == undefined || opsg.url == undefined || opsg.key == undefined) {
            console.log("什么玩意，参数补全");
            return false;
        }
        //找到节点刷新
        var myDate = new Date();
        for (var i = 0; i < ifs.length; i++) {
            if ($(ifs[i]).attr("data-key") == opsg.key) {
                console.log("什么玩意，参数重置");
                opsg.key = opsg.key + myDate.getTime();
            }
        }
        topLi(opsg.key, opsg.url, opsg.title);
    }

    //关闭窗口
    var closeIframe = function(key) {
        var ils = $(".mssm-i-box-nav").find("dt");
        //找到节点删除
        for (var i = 0; i < ils.length; i++) {
            if ($(ils[i]).attr("data-key") == key) {
                $(ils[i]).find(".icon-remove").click();
            }
        }
    }

    return {　　　　　
        init: init,
        openIframe: openIframe,
        closeIframe: closeIframe
    };
})();