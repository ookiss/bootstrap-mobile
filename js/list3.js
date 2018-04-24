/// <reference path="jquery.min.js" />
define([
    "css!../css/list3.css",
    "css!../vendor/switch/switch.css",
    "css!../vendor/swiper/swiper.min.css",
    "css!../vendor/address/ydui.css",
    "../vendor/swiper/swiper.min",
    "../vendor/address/ydui.citys",
    "../vendor/address/ydui"
], function () {
    var init = function () {
        app_init();
        G_Prg.textSlider({
            line: 1,
            ele: ".box"
        });

        var $target = $('#J_Address2');
        $target.citySelect({});

        $target.on('click', function (event) {
            event.stopPropagation();
            $target.citySelect('open');
        });

        $target.on('done.ydui.cityselect', function (ret) {
            $(this).val(ret.provance + ' ' + ret.city + ' ' + ret.area);
        });
    }

    /*tab 切换*/
    var mySwiper = new Swiper('.swiper-container', {
        onSlideChangeEnd: function (swiper) {
            var j = mySwiper.activeIndex;
            $('.tab-item').removeClass('tab-active')
            $('.tab-item[data-item=' + j + ']').addClass('tab-active');
        }
    })

    /*列表切换*/
    $('.tab-item').on('click', function (e) {
        var i = $(this).attr("data-item");
        $('.tab-item').removeClass('tab-active');
        $(this).addClass('tab-active');
        mySwiper.slideTo(i, 1000, false);
    });

    $(document).on("click", ".switch_fath", function (e) {
        var ele = $(this).children(".switch_move");
        if (ele.attr("data-state") == "on") {
            ele.animate({
                left: "0"
            }, 300, function () {
                ele.attr("data-state", "off");
            });
            $(this).removeClass("on").addClass("off");
        } else if (ele.attr("data-state") == "off") {
            ele.animate({
                left: '35px'
            }, 300, function () {
                $(this).attr("data-state", "on");
            });
            $(this).removeClass("off").addClass("on");
        }
    });

    $(document).on("click", ".radio", function (e) {
        $(".radio[data-name='sex']").find("i").removeClass("fa-check-circle text-primary").addClass("fa-circle-o");
        $(this).find("i").removeClass("fa-circle-o").addClass("fa-check-circle text-primary");
    });

    $(document).on("click", ".checkbox", function () {
        if ($(this).find("i").hasClass("fa-check-square")) {
            $(this).find("i").removeClass("fa-check-square text-primary").addClass("fa-square-o");
        } else {
            $(this).find("i").removeClass("fa-square-o").addClass("fa-check-square text-primary");
        }
    });


    var list3Module = {};
    list3Module.init = init;
    return list3Module;
});
