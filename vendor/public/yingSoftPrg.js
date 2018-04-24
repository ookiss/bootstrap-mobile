var G_Prg = new yingSoftPre();
function yingSoftPre() {
}

//获取地址栏参数
yingSoftPre.prototype.getQueryString = function (name, isURLEncode) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var value = window.location.search.substr(1).match(reg);
    if (!value) {
        return null;
    }
    if (isURLEncode) {
        return decodeURI(value[2]);
    } else {
        return unescape(value[2]);
    }

}

//验证是否为用户名a-z,A-Z,0-9 /
yingSoftPre.prototype.checkUserName = function (userName) {
    if (userName.length !== 0) {
        var userNameReg = /^[a-zA-Z0-9_]+$/;
        return userNameReg.test(userName);
    }
}

//验证是否为用户名0-9  
yingSoftPre.prototype.checkNumber = function (num) {
    if (num.length !== 0) {
        var userNumReg = /^[0-9]+$/;
        return userNumReg.test(num);
    }
}

//验证是否为手机号码  
yingSoftPre.prototype.checkCellPhone = function (phoneStr) {
    if (phoneStr.length !== 0) {
        var phoneReg = /^((13[0-9])|(14[0-9])|(15[0-9])|(18[0-9]))\d{8}$/;
        return phoneReg.test(phoneStr);
    }
}

//获取Cookie的值   
yingSoftPre.prototype.getCookie = function (cookieName) {
    var value = null;
    var arr;
    var reg = new RegExp("(^| )" + cookieName + "=([^;]*)(;|$)");
    arr = document.cookie.match(reg);
    if (arr) {
        value = unescape(arr[2]);
    }
    return (value) ? value : null;
}

//设置Cookie的值 
yingSoftPre.prototype.setCookie = function (name, value, isSetTime) {
    if (isSetTime === undefined || isSetTime === true) {
        var day = 30;
        var date = new Date();
        date.setTime(date.getTime() + Number(day) * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + "; path=/;expires = " + date.toGMTString();
    }
    else {
        document.cookie = name + "=" + escape(value) + "; path=/";
    }
}

//删除单个cookie
yingSoftPre.prototype.removeCookie = function (cookieName) {
    var date = new Date();
    date.setTime(date.getTime() - 10000);
    document.cookie = cookieName + "=;path=/;expires = " + date.toGMTString();
}

//清除所有Cookie  
yingSoftPre.prototype.cleanCookie = function () {
    var strCookie = document.cookie;
    var arrCookie = strCookie.split('; ');
    for (var i = 0; i < arrCookie.length; i++) {
        var arr = arrCookie[i].split("=");
        if (arr.length > 0) {
            this.removeCookie(arr[0]);
        }
    }
}

//时间格式化
yingSoftPre.prototype.datetimeFormat = function (datetimeStr, format) {
    format = format || "yyyy-MM-dd hh:mm";
    var datetime;
    if (!datetimeStr || datetimeStr === 'null' || datetimeStr.length === 0) {
        datetime = new Date();
    }
    else {
        var replaceStr = datetimeStr.toString();
        if (this.getBrowserVersion().indexOf('msie') > -1 || this.getBrowserVersion() == "unknown") {//
            var flag = false;
            replaceStr = datetimeStr.toString().replace(/-/g, '/');
            if (datetimeStr.toString().indexOf('T') > -1 && datetimeStr.toString().indexOf('Z') > -1) {
                replaceStr = replaceStr.toString().replace(/T/g, ' ');
                replaceStr = replaceStr.substring(0, replaceStr.length - 5);
                flag = true;
            }
            datetime = new Date(replaceStr);
            if (flag) {
                datetime.setHours(datetime.getHours() + 8);
            }
        } else {
            datetime = new Date(replaceStr);
        }
    }
    var date = {
        "M+": datetime.getMonth() + 1,
        "d+": datetime.getDate(),
        "h+": datetime.getHours(),
        "m+": datetime.getMinutes(),
        "s+": datetime.getSeconds(),
        "q+": Math.floor((datetime.getMonth() + 3) / 3),
        "S": datetime.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (datetime.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (date[k]) : (('00' + date[k]).substr(('' + date[k]).length)));
        }
    }
    return format;
}

//去除字符前后的空格
yingSoftPre.prototype.stringTrim = function (str) {
    if (str) {
        str = str.replace(/(^\s*)|(\s*$)/g, "");
    }
    return str;
}

//剔除文本中的html代码 
yingSoftPre.prototype.removeHTMLTag = function (str) {
    if (str) {
        str = str.replace(/<\/?[^>]*>/g, '');
        str = str.replace(/(^\s*)|(\s*$)/g, "");
        str = str.replace(/[ | ]*\n/g, '\n');
        str = str.replace(/\n[\s| | ]*\r/g, '\n');
        str = str.replace(/ /ig, '');
    }
    return str;
}

//检测cookie存在，并返回用户对象
yingSoftPre.prototype.userOnline = function () {
    var userinfo = G_Prg.getCookie("userinfo");
    if (userinfo) {
        return JSON.parse(userinfo);
    } else {
        $.alert('您的账号登录信息已过期,请重新登录', '温馨提示', function () {
            location.href = '../../login.html';
        });
    }
}

//数字转换成中文
yingSoftPre.prototype.getCNChar = function (index) {
    var chArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十'];
    return chArr[index];
}

//数字转大写英文
yingSoftPre.prototype.getENChar = function (index) {
    var enArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
    return enArr[index];
}

//获取页面地址名称
yingSoftPre.prototype.getUrlName = function (url) {
    var hrefArray = url.split("/");
    var names = hrefArray.slice(hrefArray.length - 1, hrefArray.length).toString().split(".");
    var name = names.slice(0, 1)[0];
    return name;
}

//原型进度条
yingSoftPre.prototype.reportCanvas = function (ele1, ele2, percent) {
    var canvas_1 = document.querySelector(ele1);
    var canvas_2 = document.querySelector(ele2);
    var ctx_1 = canvas_1.getContext('2d');
    var ctx_2 = canvas_2.getContext('2d');
    ctx_1.lineWidth = 10;
    ctx_1.strokeStyle = "#f3f3f3";
    //画底部的灰色圆环
    ctx_1.beginPath();
    ctx_1.arc(canvas_1.width / 2, canvas_1.height / 2, canvas_1.width / 2 - ctx_1.lineWidth / 2, 0, Math.PI * 2, false);
    ctx_1.closePath();
    ctx_1.stroke();
    if (percent < 0 || percent > 100) {
        // throw new Error('percent must be between 0 and 100');
        return
    }
    ctx_2.lineWidth = 10;
    ctx_2.strokeStyle = '#FFE05F';
    var angle = 0;
    var timer;
    (function draw() {
        timer = requestAnimationFrame(draw);
        ctx_2.clearRect(0, 0, canvas_2.width, canvas_2.height)
        //百分比圆环
        ctx_2.beginPath();
        ctx_2.arc(canvas_2.width / 2, canvas_2.height / 2, canvas_2.width / 2 - ctx_2.lineWidth / 2, 0, angle * Math.PI / 180, false);
        angle++;
        var percentAge = parseInt((angle / 360) * 100)
        if (angle > (percent / 100 * 360)) {
            percentAge = percent
            window.cancelAnimationFrame(timer);
        }
        ;
        ctx_2.stroke();
        ctx_2.closePath();
        ctx_2.save();
        ctx_2.beginPath();
        ctx_2.rotate(90 * Math.PI / 180)
        ctx_2.font = '60px Arial';
        ctx_2.fillStyle = '#FFE05F';
        var text = percentAge + '%';
        ctx_2.fillText(text, 80, -110);
        ctx_2.closePath();
        ctx_2.restore();
    })();
}

//li 上下滚动
yingSoftPre.prototype.textSlider = function (options) {
    var defaults = {
        scrollHeight: 30,
        line: 1,
        speed: 'normal',
        timer: 2000,
        ele: ""
    };
    var opts = $.extend(defaults, options);
    if (opts.ele == "") {
        alert("textSlider方法没有输入元素");
        return;
    }
    $(opts.ele).each(function () {
        var timerID;
        var obj = $(opts.ele);
        var $ul = obj.children("ul");
        var $height = $ul.find("li").height();
        var $Upheight = 0 - opts.line * $height;
        obj.hover(function () {
            clearInterval(timerID);
        }, function () {
            timerID = setInterval(moveUp, opts.timer);
        });
        function moveUp() {
            $ul.animate({"margin-top": $Upheight}, opts.speed, function () {
                for (var i = 0; i < opts.line; i++) { //只有for循环了才可以设置一次滚动的行数
                    $ul.find("li:first").appendTo($ul);
                }
                $ul.css("margin-top", 0);
            });
        };
        timerID = setInterval(moveUp, opts.timer);
    });
}

