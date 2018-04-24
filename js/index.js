/// <reference path="jquery.min.js" />

require.config({
    paths: {
        "lCalendar": "../vendor/lCalendar/lCalendar",
    },
    shim: {
        lCalendar: {
            deps: ['css!../vendor/lCalendar/lCalendar.css', 'css!../css/index.css']
        }
    }
});
define(["lCalendar"], function () {
    var myScroll;
    var init = function () {
        app_init();
        iScroll_init($(".studybox .content-iScroll")[0]);
        G_Prg.reportCanvas('#canvas_1', '#canvas_2', 35);
    }

    //模块显示隐藏
    $(document).on("click", ".init-show", function () {
        $(".navbar-bottom-box .active").removeClass("active");
        var showEle = $(this).attr("data-show");
        var hideEle = $(this).attr("data-hide");
        $(hideEle).hide();
        $(showEle).show();
        $(this).addClass("active")

        myScroll.destroy();
        myScroll = null;
        iScroll_init($(showEle+" .content-iScroll")[0]);
    });

    //退出
    $(document).on("click", ".loginExit", function () {
        $(this).button('loading');//这个只是设置状态  显示的文字是data-loading-text
        setTimeout(function () {
            window.location = "login.html"
        }, 500);
    });

    //进入页面
    $(document).on("click", ".gourl", function () {
        var url = $(this).attr("data-url");
        $.router.loadPage(url);
    });

    //初始化iScroll
    var iScroll_init = function(tag){
        myScroll = new iScroll(tag, {
            scrollbarClass: 'myScrollbar', /* 重要样式 */
            useTransition: false, /* 此属性不知用意，本人从true改为false */
            click: true ,// 允许点击事件
        })

        //初始化绑定iScroll控件
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    var calendartime = new lCalendar();
    calendartime.init({
        'trigger': '#demo1',
        'type': 'date',
        'minDate': '1900-01-01',
        'maxDate': '2020-9-31'
    });

    var indexModule = {};
    indexModule.init = init;
    return indexModule;
});