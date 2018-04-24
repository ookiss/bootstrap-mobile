/// <reference path="jquery.min.js" />  
define(['css!../css/login.css'], function () {
    var winHeight = window.innerHeight;
    var myScroll;
    var init = function () {

        app_init();

        iScroll_init($("#select-box .content-iScroll")[0]);

        /*判断软键盘弹出
         android上，当软键盘状态改变的时候，会触发window的resize事件，
         所以我们可以进入页面的时候保存一次window.innerHeight的值，当window的resize事件触发的时候，
         比较window.innerHeight的值与前一次保存的window.innerHeight的值大小来判断软键盘的收拢和弹出状态。*/
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

        if (isAndroid) {
            window.addEventListener('resize', function (e) {
                var tempHeight = window.innerHeight;
                if (tempHeight < winHeight) {
                    $('.login-more,.register-more').hide();
                } else {
                    $('.login-more,.register-more').show();
                }
            });
        }
        /*ios上，软键盘状态改变的时候，不会触发window的resize事件，
         但是当软键盘的“完成”按钮被点击的时候，会触发onblur事件。
         所以正常通过onfocus和onblur事件来判断就行。*/
        if (isIOS) {
            $("input").focus(function () {
                $('.login-more,.register-more').hide();
            });
            $("input").blur(function () {
                $('.login-more,.register-more').show();
            });
        }
    }


    //进入登录
    $("#go-login").click(function () {
        $("#login-box").removeClass().addClass("container-fluid").slideDown(2000);
        $("#select-box").removeClass().addClass("container-fluid").addClass("animated fadeOutUp").slideUp(800)
        $("#login-box").find(".navbar-top-box").fadeIn(1000);

        myScroll.destroy();
        myScroll = null;
        iScroll_init($("#login-box .content-iScroll")[0]);
    });

    //退出登录
    $(".login-back").click(function () {
        $("#login-box").removeClass().addClass("container-fluid").addClass("animated fadeOutDown").slideUp(800)
        $("#select-box").removeClass().addClass("container-fluid").slideDown(1000);
        $("#login-box").find(".navbar-top-box").fadeOut(1000);

        myScroll.destroy();
        myScroll = null;
        iScroll_init($("#select-box .content-iScroll")[0]);
    });


    //进入注册
    $("#go-register").click(function () {
        $("#register-box").removeClass().addClass("container-fluid").slideDown(2000);
        $("#select-box").removeClass().addClass("container-fluid").addClass("animated fadeOutUp").slideUp(800)
        $("#register-box").find(".navbar-top-box").fadeIn(1000)

        myScroll.destroy();
        myScroll = null;
        iScroll_init($("#register-box .content-iScroll")[0]);
    });


    //退出注册
    $(".register-back").click(function () {
        $("#register-box").removeClass().addClass("container-fluid").addClass("animated fadeOutDown").slideUp(800)
        $("#select-box").removeClass().addClass("container-fluid").slideDown(1000);
        $("#register-box").find(".navbar-top-box").fadeOut(1000);
        myScroll.destroy();
        myScroll = null;
        iScroll_init($("#select-box .content-iScroll")[0]);
    });


//登录
    $(document).on("click", ".loginEnter", function () {
        $(this).button('loading');//这个只是设置状态  显示的文字是data-loading-text
        setTimeout(function () {
            $(".loginEnter").button('reset');
            $.router.replacePage("index.html");
        }, 500);
    });


//登录显示选择框
    $(document).on("click", ".login-more", function () {
        var o = [
            {
                'text': '注册',
                'onClick': function () {
                    bootstrapDialog.msg("注册", 5);
                }
            },
            {
                'text': '忘记密码',
                'onClick': function () {
                    bootstrapDialog.msg("忘记密码", 5)
                }
            },
            {
                'text': '登录遇到问题',
                'onClick': function () {
                    bootstrapDialog.alert("温馨提示", "联系：14793855420")
                }
            }
        ];
        var c = {
            'text': '取消'
        };
        bootstrapDialog.actionbox(o, c);
        //bootstrapDialog.actionbox(o);
    });

//注册显示选择框
    $(document).on("click", ".register-more", function () {
        var o = [
            {
                'text': '登录',
                'onClick': function () {
                    bootstrapDialog.msg("登录", 5);
                }
            },
            {
                'text': '注册遇到问题',
                'onClick': function () {
                    bootstrapDialog.alert("温馨提示", "联系：14793855420")
                }
            }
        ];
        var c = {
            'text': '取消'
        };
        bootstrapDialog.actionbox(o, c);
        //bootstrapDialog.actionbox(o);
    });

//初始化iScroll
    var iScroll_init = function (tag) {
        myScroll = new iScroll(tag, {
            scrollbarClass: 'myScrollbar', /* 重要样式 */
            useTransition: false, /* 此属性不知用意，本人从true改为false */
            click: true,// 允许点击事件
        })

        //初始化绑定iScroll控件
        document.addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
    }

    var loginModule = {};
    loginModule.init = init;
    return loginModule;
})
;








