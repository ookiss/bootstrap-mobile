/// <reference path="../vendor/public/jquery-2.1.4.min.js" /> 
/*全局css文件 不能在这里异步加载 */
var cssArray = [
    'vendor/bootstrap/bootstrap.min.css',
    'vendor/bootstrap-dialog/bootstrap-dialog.css',
    'vendor/offline/offline-language-cn.css',
    'vendor/offline/offline-theme-chrome.css',
    'vendor/font-awesome/font-awesome.min.css',
    'vendor/router/router.css',
    'vendor/iscroll4/iscroll.css',
    'css/base.css'
];

for (var i = 0; i < cssArray.length; i++) {
    AddJsFiles(cssArray[i]);
}

//刷新 或者 第一次加载 显示加载框
var node = document.createElement("div");
node.className = "loadingDiv";
document.body.appendChild(node);

//动态添加css
function AddJsFiles(URL) {
    var oHead = document.getElementsByTagName('HEAD').item(0);
    var addheadfile = "";
    addheadfile = document.createElement("link");
    addheadfile.rel = "stylesheet";
    addheadfile.href = URL;
    oHead.appendChild(addheadfile);
    if (URL == "css/base.css") {
        addheadfile.onload = function(){
            var textnode = document.createElement("p");
            textnode.innerHTML = "加载中...";
            node.appendChild(textnode);
        }
    }
}

require.config({
    paths: {
        urlArgs: "r=" + (new Date()).getTime(),
        "jquery": "../vendor/public/jquery-2.1.4.min",
    }
});

//弹出框 公共名称
var BootstrapDialog;
//初始化fastclick
var FastClick;

require(['jquery'], function ($) {
    require.config({
        paths: {
            "bootstrap": "../vendor/bootstrap/bootstrap.min",
            "bootstrap-dialog": "../vendor/bootstrap-dialog/bootstrap-dialog",
            "bootstrapDialog": "../vendor/bootstrap-dialog/bootstrapDialog",
            "fastclick": "../vendor/fastclick/fastclick",
            "iscroll": "../vendor/iscroll4/iscroll",
            "offline": "../vendor/offline/offline.min",
            "router": "../vendor/router/router",
            "yingSoftPrg": "../vendor/public/yingSoftPrg",
            "app": "../js/app",
        }
    });
    //只会执行一次  主要用于第一次加载 或者 刷新
    require([
        "bootstrap-dialog",
        "bootstrap",
        'bootstrapDialog',
        'fastclick',
        'iscroll',
        'offline',
        'router',
        "yingSoftPrg",
        "app"], function (_, a, b, c) {
        FastClick = c;
        BootstrapDialog = _;

        var name = G_Prg.getUrlName(location.href);
        eval(name + "()");
        $('.page-current').addClass("page-inited")
    });

    $(document).on("pageInit", function (e, pageId, $page) {
        var name = pageId.replace('-html', "");
        eval(name + "()");
        console.log("进入完成" + pageId)
    })

    //后退立即清除
    $(document).on("pageReinit", function (e, pageId, $page) {
        console.log("退完成" + pageId);

        var id = $(".page-end").attr("id");
        //$("#" + id).remove();


        //css 删除了 就不会再次添加了 所以不能删除
        //var a = sessionStorage.getItem(id);
        //if (a) {
        //    a = JSON.parse(a);
        //} else {
        //    a = []
        //} 
        //for (var i = 0; i < a.length; i++) {
        //    $("script[src='js/" + a[i] + ".js']").remove();
        //    $("link[href='js/" + a[i] + "']").remove();
        //}
        //sessionStorage.removeItem(id); 
    })

});









