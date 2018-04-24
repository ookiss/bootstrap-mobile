
var app_init = function () {
    //初始化fastclick.js
    FastClick.attach(document.body);

    //隐藏加载框
    $(".loadingDiv").hide();
    $(".page-current").show();

}

//加载login.js
var login = function () {
    require(["../js/login"], function (fn) {
        fn.init();
    });
}

//加载index.js
var index = function () {
    require(["../js/index"], function (fn) {
        fn.init();
    });
}

//加载list.js
var list = function () {
    require(["../js/list"], function (fn) {
        fn.init();
    });
}

//加载list3.js
var list3 = function () {
    require(["../js/list3"], function (fn) {
        fn.init();
    });
}

//加载video.js
var video = function () {
    require(["../js/video"], function (fn) {
        fn.init();
    });
}

