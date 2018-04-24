/// <reference path="jquery.min.js" />

var tempArray = [
    {
        style: "ATEST",
        testCount: 2,
        type: "单选题每题有4个选项，选择一个你认为对的，每题1分，答错不得分",
        testItem: [
            {
                style: "ATEST",
                id: "1",
                title: "中药1",
                itemCount: 12,
                selectItem: [
                    "A.ssssssss",
                    "B.ssssssss",
                    "C.ssssssss",
                    "D.单选题每题有4个选项，选择一个你认为对的，每题1分，答错不得分单选题每题有4个选项，选择一个你认为对的，每题1分，答错不得分",
                    "A.ssssssss",
                    "B.ssssssss",
                    "C.ssssssss",
                    "D.ssssssss",
                    "A.ssssssss",
                    "B.ssssssss",
                    "C.ssssssss",
                    "D.ssssssss",
                ]
            },
            {
                style: "ATEST",
                id: "2",
                title: "中药2",
                itemCount: 4,
                selectItem: [
                    "A.ssssssss",
                    "B.ssssssss",
                    "C.ssssssss",
                    "D.ssssssss",
                ]
            }

        ]
    },
    {
        style: "XTEST",
        testCount: 2,
        type: "多选题每题有4个选项，选择你认为对的，每题1分，答错不得分",
        testItem: [
            {
                style: "XTEST",
                id: "3",
                title: "中药1",
                itemCount: 4,
                selectItem: [
                    "A.ssssssss",
                    "B.ssssssss",
                    "C.ssssssss",
                    "D.ssssssss",
                ]
            },
            {
                style: "XTEST",
                id: "4",
                title: "中药2",
                itemCount: 12,
                selectItem: [
                    "A.ssssssss",
                    "B.ssssssss",
                    "C.ssssssss",
                    "D.单选题每题有4个选项，选择一个你认为对的，每题1分，答错不得分单选题每题有4个选项，选择一个你认为对的，每题1分，答错不得分",
                    "A.ssssssss",
                    "B.ssssssss",
                    "C.ssssssss",
                    "D.ssssssss",
                    "A.ssssssss",
                    "B.ssssssss",
                    "C.ssssssss",
                    "D.ssssssss",
                ]
            }

        ]
    },
    {
        style: "TKTEST",
        testCount: 2,
        type: "填空题",
        testItem: [
            {
                style: "TKTEST",
                id: "5",
                title: "中药_____sfnk_______1",
                itemCount: 2
            },
            {
                style: "TKTEST",
                id: "6",
                title: "中药_____sfnk_______2",
                itemCount: 2
            }

        ]
    }
];
var examArray = [];
var swiper = "";//swiper对象   
var examDoArray = [];
var ksExamArray = [];//答案集合 
$(document).ready(function() {
    bootstrapDialog.showPreloader();
    $.when(
            getTest()
        ).done(function(data) {
            bootstrapDialog.hidePreloader()
        });
});

//获取试题数据
function getTest() {
    var defer = $.Deferred();
    setTimeout(function() {
        //整理试题 
        for (var i = 0; i < tempArray.length; i++) {
            for (var j = 0; j < tempArray[i].testItem.length; j++) {
                tempArray[i].testItem[j].type = tempArray[i].type;
                var order = i;
                tempArray[i].testItem[j].order = order++;
                examArray.push(tempArray[i].testItem[j]);
            }
        }

        //渲染答题卡
        drawCard(examArray.length);
        //初始化swiper
        //控件的 disableTouchControl  不好用 快速滑动 有bug 
        //滑动之后 出现遮罩 500ms 再消失
        swiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            observer: true,
            observeParents: true,
            onSlideChangeStart: function() {
                $(".swiper-container").scrollTop(0);
                $("#test-masks").show();
            },
            onTransitionEnd: function() {
                swiperAutoHeight()
            },
            onTouchEnd: function(swipers) {
                var activeIndex = Number($(".swiper-slide-active").attr("name"));
                if (swipers.swipeDirection == "prev") {
                    if (!examArray[activeIndex - 1]) {
                        bootstrapDialog.msg("已经是第一题了", 5);
                        return;
                    }
                }
                if (swipers.swipeDirection == "next") {
                    if (!examArray[activeIndex + 1]) {
                        bootstrapDialog.msg("已经是最后一题了", 5);

                    }
                }
            },
            onSlidePrevEnd: function(swipers) {
                var i = Number($(".swiper-slide:first").attr("name"));
                var activeIndex = Number($(".swiper-slide-active").attr("name"));
                if (activeIndex > 0) {
                    if (activeIndex == 0 || activeIndex == examArray.length - 2) {
                        swiperAutoHeight();
                        return;
                    }
                    if (examArray[i - 1]) {
                        swiper.removeSlide(Number($(".swiper-slide").length) - 1);
                        testSwiper(i - 1, "prependSlide");
                    }
                }
                swiperAutoHeight()
            },
            onSlideNextEnd: function(swipers) {

                var i = Number($(".swiper-slide:last").attr("name"));
                var activeIndex = Number($(".swiper-slide-active").attr("name"));
                if (activeIndex < examArray.length - 1) {
                    if (activeIndex == 1 || activeIndex == examArray.length - 1) {
                        swiperAutoHeight();
                        return;
                    }
                    if (examArray[i + 1]) {
                        swiper.removeSlide(0);
                        testSwiper(i + 1, "appendSlide");
                    }
                }
                swiperAutoHeight()
            }
        });

        //渲染试题 直接用html数据
        var count = examArray.length > 3 ? 3 : examArray.length;
        for (var i = 0; i < count; i++) {
            testSwiper(i, "appendSlide");
        }
        swiperAutoHeight();
        //时间开始计时
        var time = 20;//分钟
        initToServer(time * 60);
        defer.resolve("111111111111")
    }, 1000);
    return defer.promise();
}

//全屏可以切换
function swiperAutoHeight() {
    setTimeout(function() {
        var activeHeight = $(".swiper-slide-active").height();
        var sysHeight = $(document).height() - 100;
        if (activeHeight < sysHeight) {
            $(".swiper-container").css("overflow-y", "hidden");
        } else {
            $(".swiper-container").css("overflow-y", "auto");
        }
        $("#test-masks").hide();
    }, 500)
}

//跳到试题
$(document).on("click", ".cardTable td", function() {
    $("#test-masks").show();
    var id = Number($(this).text()) - 1;
    swiper.removeAllSlides();
    var count = examArray.length > 3 ? 3 : examArray.length;
    if (id == 0) {
        for (var i = 0; i < count; i++) {
            testSwiper(i, "appendSlide");
        }
    } else if (id == examArray.length - 1) {
        testSwiper(id - 2, "appendSlide");
        testSwiper(id - 1, "appendSlide");
        testSwiper(id, "appendSlide");
        swiper.slideTo(3, 10, true);
    } else {
        testSwiper(id - 1, "appendSlide");
        testSwiper(id, "appendSlide");
        testSwiper(id + 1, "appendSlide");
        swiper.slideTo(1, 10, true);
    }
    swiperAutoHeight();
});

//提交 ATEST PDTEST
$(document).on("click", ".swiper-slide-active .radio", function(e) {
    $(".swiper-slide-active").find(".testItem").removeAttr("style");
    $(".swiper-slide-active").find(".testItem .fa-check-circle").attr("class", "fa fa-circle-o fa-lg");
    $(this).find(".fa-circle-o").attr("class", "fa fa-check-circle fa-lg");
    var useranswer = $(this).attr("data-optionitem");//用户答案  
    var id = $(this).attr("data-id");//试题ID 
    var style = $(this).attr("data-style");//试题ID
    progressbar(id, "add");//添加
    $(".swiper-slide-active").find(".testItem[data-optionitem='" + useranswer + "']").css({ "background": "#f3f3f4" });
});

//提交 XTEST
$(document).on("click", ".swiper-slide-active .checkbox", function(e) {
    if ($(this).find("i").hasClass("fa-check-square fa-lg")) {
        $(this).find(".fa-check-square").attr("class", "fa fa-square-o fa-lg");
        $(this).removeAttr("style");
    } else {
        $(this).find(".fa-square-o").attr("class", "fa fa-check-square fa-lg");
        $(this).css({ "background": "#f3f3f4" });
    }

    var id = 0;
    var useranswer = "";
    $(".swiper-slide-active").find(".testItem").each(function() {
        id = $(this).attr("data-id");
        if ($(this).find("i").hasClass("fa-check-square")) {
            var answer = $(this).attr("data-optionitem");
            useranswer = useranswer + answer;
        }
    });

    if (useranswer == "") {
        progressbar(id, "remove");//删除
    } else {
        progressbar(id, "add");//添加
    }
});

//提交 TKTEST
$(document).on("blur", ".swiper-slide-active input", function(e) {
    var answer = [];
    var id = 0;
    $(".swiper-slide-active").find("input").each(function(index, temp) {
        id = $(this).attr("data-id");
        var o = G_Prg.removeHTMLTag($(this).val());
        if (o !== "") {
            answer.push(o);
        }
    });
    if (answer == "") {
        progressbar(id, "remove");//删除
    } else {
        progressbar(id, "add");//添加
        var useranswer = answer.join("｜");
    }
});

//提交试卷
$(document).on("click", ".slideSubmit", function() {
    swal({ 
        text: "提交试卷之后，将不能再次作答，确定提交吗？",
        type: 'question',
        showCancelButton: true,
        animation: false,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
    }).then(function(isConfirm) {
        if (isConfirm) {
            swal({
                text: "提交成功",
                type: "success",
                confirmButtonText: "我知道了",
            }).then(function(isConfirm) {
                location.href = 'login.html';
            });
        } else {
            swal.close();
        }
    })
});

//显示选择框
$(document).on("click", ".model", function() {
    var o = [
        {
            'text': '做题模式',
            'onClick': function() {
                bootstrapDialog.msg("做题模式", 5);
            }
        },
       {
           'text': '背题模式',
           'onClick': function() {
               bootstrapDialog.msg("背题模式", 5)
           }
       }
    ];
    var c = {
        'text': '取消'
    };
    bootstrapDialog.actionbox(o, c);
});

//自动交卷 
function initToServer(time) {
    if (0 == time) {
        // AllTestToServer("考试时间到了，系统已经自动帮您提交试卷");
        return;
    }
    time -= 1;
    time = time <= 0 ? 0 : time;
    var m = formatSeconds(time);
    $(".examTime").html(m);
    setTimeout(function() {
        initToServer(time);
    }, 1000)
}

//秒换成小时分钟
function formatSeconds(value) {
    var second = parseInt(value);// 秒 
    var minutes = 0;// 分 
    var hour = 0;// 小时  
    if (second > 60) {
        minutes = parseInt(second / 60);
        second = parseInt(second % 60);
        if (minutes > 60) {
            hour = parseInt(minutes / 60);
            minutes = parseInt(minutes % 60);
        }
    }
    var result = "";
    if (hour > 0) {
        result = parseInt(hour) < 10 ? "0" + parseInt(hour) + ":" : parseInt(hour) + ":";
    } else {
        result = "00:";
    }

    if (minutes > 0) {
        result += parseInt(minutes) < 10 ? "0" + parseInt(minutes) + ":" : parseInt(minutes) + ":";

    } else {
        result += "00:";
    }

    if (second > 0) {
        result += parseInt(second) < 10 ? "0" + parseInt(second) : parseInt(second);
    } else {
        result += "00";
    }

    return result;
}

//题目展示
function testSwiper(i, type) {
    if (!examArray[i]) {
        return;
    }
    var data = examArray[i];
    var html = "";
    html += '<div class="mainTitle">' + G_Prg.getCNChar(data.order + 1) + "、" + data.type + '</div>';
    html += '<div class="testTitle">' + (i + 1) + '、' + data.title + '</div>';
    if (data.style == "ATEST") {
        for (var k = 0; k < data.itemCount; k++) {
            html += '<div class="testItem radio" data-style="' + data.style + '" data-optionitem="' + G_Prg.getENChar(k) + '" data-id="' + data.id + '">';
            html += '<div class="fabox"><i class="fa fa-circle-o fa-lg"></i></div>';
            html += '<div class="selectItem">' + data.selectItem[k];
            html += '</div></div>';
        }
    }

    if (data.style == "XTEST") {
        for (var k = 0; k < data.itemCount; k++) {
            html += '<div class="testItem checkbox" data-style="' + data.style + '" data-optionitem="' + G_Prg.getENChar(k) + '" data-id="' + data.id + '">';
            html += '<div class="fabox"><i class="fa fa-square-o fa-lg"></i></div>';
            html += '<div class="selectItem">' + data.selectItem[k];
            html += '</div></div>';
        }
    }


    if (data.style == "TKTEST") {
        for (var k = 0; k < data.itemCount; k++) {
            html += "<input type='text' class='form-control' style='width: 100%;margin: 15px 0;'  data-id='" + data.id + "'>";
        }
    }
    if (type == "appendSlide") {
        swiper.appendSlide('<div class="swiper-slide" name="' + i + '">' + html + '</div>');
    } else {
        swiper.prependSlide('<div class="swiper-slide" name="' + i + '">' + html + '</div>');
    }
}

//答题卡
function progressbar(id, hander) {
    if (hander == "remove") {
        $("#" + id).removeClass();
    } else {
        if ($.inArray(id, examDoArray) == -1) {
            $("#" + id).addClass("btn-primary");
        }
    }

}

//绘制答题卡
function drawCard(count) {
    var num = 0;//换行标志 
    //为了自适应美观 动态计算列数 设定td是35px;
    var w = $(document).width() - 30;
    var col = Math.floor(w / 35);//列数
    var html = "<table class='table table-bordered'><tr>";
    for (var i = 0; i < count; i++) {
        num++;
        if (i != (count - 1)) {
            if (num < col) {
                html += "<td id='" + examArray[i].id + "' class='init-show back'  data-show='#testbox' data-hide='#cardbox'>" + (i + 1) + "</td>";
            } else {
                html += "<td id='" + examArray[i].id + "' class='init-show back'  data-show='#testbox' data-hide='#cardbox'>" + (i + 1) + "</td></tr><tr>";
                num = 0;
            }
        } else {
            html += "<td id='" + examArray[i].id + "' class='init-show back'  data-show='#testbox' data-hide='#cardbox'>" + (i + 1) + "</td></tr>";
        }
    }
    html += "</table>";
    $(".cardTable").html(html);
}

Number.prototype.toFixed = function(d) {
    var s = this + "";
    if (!d) d = 0;
    if (s.indexOf(".") == -1) s += ".";
    s += new Array(d + 1).join("0");
    if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
        var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
        if (a == d + 2) {
            a = s.match(/\d/g);
            if (parseInt(a[a.length - 1]) > 4) {
                for (var i = a.length - 2; i >= 0; i--) {
                    a[i] = parseInt(a[i]) + 1;
                    if (a[i] == 10) {
                        a[i] = 0;
                        b = i != 1;
                    } else break;
                }
            }
            s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");

        }
        if (b) s = s.substr(1);
        return (pm + s).replace(/\.$/, "");
    }
    return this + "";

};
