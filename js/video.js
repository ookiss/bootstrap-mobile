/// <reference path="jquery.min.js" />
require.config({
    paths: {
        "video": "../vendor/video/zy.media.min",
    },
    shim: {
        video: {
            deps: ['css!../vendor/video/zy.media.min.css']
        }
    }
});
define(['video'], function () {
    var init = function () {

        app_init();

        video_init();
    }

    var video_init = function () {
        zymedia('video', {"mediaTitle": "dddddddddddddddddddddd", autoplay: true});
    }

    var vid = document.getElementsByTagName('video')[0];
    vid.addEventListener('ended', function () {        //结束
        //alert("sd11")
    }, false);


    vid.addEventListener('play', function () {        //播放
        //alert("sd22")
    }, false);

    vid.addEventListener('pause', function () {        //暂停
        //alert("sd333")
    }, false);

    vid.addEventListener('loadedmetadata', function () {        //载入完成
        //alert("sd444")
    }, false);


    var d = vid.currentTime;
    vid.addEventListener('timeupdate', function () {        //载入完成
        //console.log(vid.currentTime)
    }, false);


    var videoModule = {};
    videoModule.init = init;
    return videoModule;
})
;








