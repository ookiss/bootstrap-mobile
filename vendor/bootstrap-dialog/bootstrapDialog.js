/// <reference path="../../js/jquery.min.js" /> 
/*bootstrapDialog封装类
 * 调用bootstrapDialog.alert 
 * */
var bootstrapDialog = (function() {
    var Dialog = function() {
        //弹出框
        this.alert = function(title, message, callback) {
             BootstrapDialog.show({
                title: title,
                message: message,
                type: BootstrapDialog.TYPE_PRIMARY,
                buttons: [{
                    hotkey: 13,
                    label: '我知道了',
                    cssClass: 'btn-primary',
                    action: function(dialogRef) {
                        if (callback) {
                            callback(dialogRef)
                        } else {
                            dialogRef.close();
                        }
                    }
                }]
            });
        }

        //确认框
        this.confirm = function(title, message, callback_ok, callback_cancel) {
            BootstrapDialog.show({
                title: title,
                message: message,
                type: BootstrapDialog.TYPE_PRIMARY,
                buttons: [
                {
                    label: '确定',
                    cssClass: 'btn-primary',
                    hotkey: 13,
                    action: function(dialogRef) {
                        callback_ok(dialogRef)
                    }
                }, {
                    label: '取消',
                    cssClass: 'btn-default',
                    action: function(dialogRef) {
                        if (callback_cancel) {
                            callback_cancel(dialogRef);
                        } else {
                            dialogRef.close();
                        }
                    }
                }]
            });
        }

        //支持html弹出框
        this.html = function(title, message, height, width, callback_ok, callback_cancel) {
            BootstrapDialog.show({
                title: title,
                message: message,
                type: BootstrapDialog.TYPE_PRIMARY,
                onshown: function() {
                    $(".modal-dialog").css({ "width": width })
                    $(".bootstrap-dialog-message").css({ "height": height })
                    $(".modal-content").css({ "height": Number($(".modal-body").height(true)) + Number($(".modal-header").height(true)) + Number($(".modal-footer").height(true)) })
                },
                buttons: [
                {
                    label: '确定',
                    cssClass: 'btn-primary',
                    hotkey: 13,
                    action: function(dialogRef) {
                        callback_ok(dialogRef)
                    }
                }, {
                    label: '取消',
                    cssClass: 'btn-default',
                    action: function(dialogRef) {
                        if (callback_cancel) {
                            callback_cancel(dialogRef);
                        } else {
                            dialogRef.close();
                        }
                    }
                }]
            });
        }

        //textarea弹出框
        this.textarea = function(title, placeholder, callback_ok, callback_cancel) {
            BootstrapDialog.show({
                title: title,
                message: $('<textarea class="form-control" placeholder="' + placeholder + '"></textarea>'),
                buttons: [{
                    label: '确定',
                    cssClass: 'btn-primary',
                    hotkey: 13,
                    action: function(dialogRef) {
                        callback_ok(dialogRef)
                    }
                }, {
                    label: '取消',
                    cssClass: 'btn-default',
                    action: function(dialogRef) {
                        if (callback_cancel) {
                            callback_cancel(dialogRef);
                        } else {
                            dialogRef.close();
                        }
                    }
                }]
            });
        }

        //input弹出框
        this.input = function(title, placeholder, callback_ok, callback_cancel) {
            BootstrapDialog.show({
                title: title,
                message: '<input type="text" class="form-control" maxlength="30" placeholder="' + placeholder + '">',
                onshown: function(dialogRef) {
                    $(".modal-dialog input").focus()
                },
                buttons: [
                  {
                      label: '确定',
                      cssClass: 'btn-primary',
                      hotkey: 13,
                      action: function(dialogRef) {
                          callback_ok(dialogRef)
                      }
                  }, {
                      label: '取消',
                      cssClass: 'btn-default',
                      action: function(dialogRef) {
                          if (callback_cancel) {
                              callback_cancel(dialogRef);
                          } else {
                              dialogRef.close();
                          }
                      }
                  }]
            });
        }

        //载入地址弹出框
        this.loadHtml = function(title, url, height, width) {
            BootstrapDialog.show({
                title: title,
                onshown: function() {
                    $(".modal-dialog").css({ "width": width })
                    $(".bootstrap-dialog-message").css({ "height": height })
                    $(".modal-content").css({ "height": Number($(".modal-body").height(true)) + Number($(".modal-header").height(true)) })
                },
                message: "<iframe frameborder=no  src='" + url + "' style='width:100%;height:98%;'></iframe>"
            });
        }

        //定时弹出框
        this.timeOut = function(title, message, timeOut, callback_ok) {
            timeOut = timeOut / 1000;
            BootstrapDialog.show({
                title: title,
                message: message,
                type: BootstrapDialog.TYPE_PRIMARY,
                onhide: function() {
                    clearInterval(i);
                },
                buttons: [{
                    id: 'timeOut',
                    hotkey: 13,
                    label: '我知道了(' + timeOut + ")",
                    cssClass: 'btn-primary',
                    action: function(dialogRef) {
                        callback_ok(dialogRef)
                    }
                }]
            });
            var num = 0;
            var i = setInterval(function() {
                if (num == timeOut) {
                    $(".modal-dialog #timeOut").click();
                    clearInterval(i);
                }
                num++;
                if (timeOut >= num) {
                    $(".modal-dialog #timeOut").html('我知道了(' + (timeOut - num) + ')')
                }
            }, 1000);
        }

        //即时消息
        this.msg = function(message, info) {
            var arrayMsg = ["bg-primary", "bg-success", "bg-info", "bg-warning", "bg-danger", "bg-black"];
            var html = '<p id="popMsg" class="' + arrayMsg[info] + '">' + message + '</p>';
            $("body").append(html);
            setTimeout(function() {
                $("p[id='popMsg']").remove();
            }, 2000)
        }

        //头部加载条
        this.progressInit = function() {
            $("#progressBar").remove();
            $("body").prepend(' <div id="progressBar" class="bg-primary" style="position: absolute; z-index: 999999;top: 0px;"></div>');
            $('#progressBar').width(0);
            $('#progressBar').height(2);
            $('#progressBar').animate({ width: window.screen.width / 5 * 4 }, 3000, 'swing', function() { });
        }

        //隐藏头部加载条
        this.progressExit = function() {
            $('#progressBar').animate({ width: window.screen.width }, 300, 'swing', function() {
                $('#progressBar').animate({ height: 0 }, 30, 'swing', function() {
                    $("#progressBar").remove();
                });
            });
        }

        //底部操作表
        this.actionbox = function(opt,optCan) {
            var defaults = [{
                'background': '#fff',
                'text': '取消',
                'onClick': function() {
                    $(".actionbox").remove();
                }
            }];
            var options = $.extend([], defaults, opt)
            var html = "";
            html += '<div class="masks actionbox"></div>'
            html += '<div class="actionbox-container actionbox">'
            html += '<ul class="list-group">'
            for (var i = 0; i < options.length; i++) {
                html += '<li class="list-group-item text-center" style="background-color:' + (options[i].background || defaults[0].background) + '">' + options[i].text + '</li>'
            }
            html += '</ul>'
            if (optCan) {
                html += '<ul class="list-group">' 
                html += '<li class="list-group-item text-center cancel"  style="background-color:' + (optCan.background || defaults[0].background) + '">' + optCan.text + '</li>'
                html += '</ul>'
            }
            html += '</div>'
            $("body").append(html);
            $(".masks").off("click").on("click", function() {
                defaults[0].onClick();
            });

            $(".actionbox li").off("click").on("click", function() {
                if ($(this).hasClass("cancel")) {
                    defaults[0].onClick();
                    return;
                };
                var index = $(this).index();
                if (options[index]) {
                    options[index].onClick();
                    defaults[0].onClick();
                    return;
                } else {
                    defaults[0].onClick();
                }
            });
        }

        //显示迷你加载器
        this.showIndicator = function() {
            var html = "";
            html += '<div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>'
            $("body").append(html);
        }

        //隐藏迷你加载器
        this.hideIndicator = function() {
            $(".preloader-indicator-modal").remove();
        }

        //显示加载器
        this.showPreloader = function(title) {
            var html = "";
            html += '<div class="masks"></div>'
            html += '<div class="preloader-model">'
            html += '<div class="preloader-model-inner">'
            html += '<div class="preloader-model-title">' + (title || "正在加载...") + '</div>'
            html += '<div class="preloader-model-text"><div class="preloader"></div></div>'
            html += '</div></div>'
            $("body").append(html);
        }

        //隐藏加载器
        this.hidePreloader = function() {
            $(".preloader-model,.masks").remove();
        }
    };
    return new Dialog();
})();

