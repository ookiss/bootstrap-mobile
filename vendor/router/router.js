/*!
 * =====================================================
 * light7 V0.4.3 - http://light7.org/
 *
 * =====================================================
 */
/* global $:true */
+function ($) {
    "use strict";

    //全局配置
    var defaults = {
        autoInit: false, //自动初始化页面
        showPageLoadingIndicator: true, //push.js加载页面的时候显示一个加载提示
        router: true, //默认使用router
        swipePanel: "left", //滑动打开侧栏
        swipePanelOnlyClose: false,  //只允许滑动关闭，不允许滑动打开侧栏
        pushAnimationDuration: 400  //不要动这个，这是解决安卓 animationEnd 事件无法触发的bug
    };

    $.smConfig = $.extend(defaults, $.config);

}($);


/* global $:true */
/* global WebKitCSSMatrix:true */

(function ($) {
    "use strict";
    ['width', 'height'].forEach(function (dimension) {
        var Dimension = dimension.replace(/./, function (m) {
            return m[0].toUpperCase();
        });
        $.fn['outer' + Dimension] = function (margin) {
            var elem = this;
            if (elem) {
                var size = elem[dimension]();
                var sides = {
                    'width': ['left', 'right'],
                    'height': ['top', 'bottom']
                };
                sides[dimension].forEach(function (side) {
                    if (margin) size += parseInt(elem.css('margin-' + side), 10);
                });
                return size;
            } else {
                return null;
            }
        };
    });

    $.noop = function () {
    };
    $.fn.datas = function(key, value) {
        if (typeof value === 'undefined') {
            // Get value
            if (this[0] && this[0].getAttribute) {
                var dataKey = this[0].getAttribute('data-' + key);

                if (dataKey) {
                    return dataKey;
                } else if (this[0].smElementDataStorage && (key in this[0].smElementDataStorage)) {


                    return this[0].smElementDataStorage[key];

                } else {
                    return undefined;
                }
            } else return undefined;

        } else {
            // Set value
            for (var i = 0; i < this.length; i++) {
                var el = this[i];
                if (!el.smElementDataStorage) el.smElementDataStorage = {};
                el.smElementDataStorage[key] = value;
            }
            return this;
        }
    };
    //support
    $.support = (function () {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
        return support;
    })();

    $.touchEvents = {
        start: $.support.touch ? 'touchstart' : 'mousedown',
        move: $.support.touch ? 'touchmove' : 'mousemove',
        end: $.support.touch ? 'touchend' : 'mouseup'
    };


    $.requestAnimationFrame = function (callback) {
        if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
        else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
        else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
        else {
            return window.setTimeout(callback, 1000 / 60);
        }
    };

    $.cancelAnimationFrame = function (id) {
        if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
        else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
        else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
        else {
            return window.clearTimeout(id);
        }
    };


    $.fn.transitionEnd = function (callback) {
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i, dom = this;

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }

        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    };
    $.fn.dataset = function () {
        var el = this[0];
        if (el) {
            var dataset = {};
            if (el.dataset) {

                for (var dataKey in el.dataset) { // jshint ignore:line
                    dataset[dataKey] = el.dataset[dataKey];
                }
            } else {
                for (var i = 0; i < el.attributes.length; i++) {
                    var attr = el.attributes[i];
                    if (attr.name.indexOf('data-') >= 0) {
                        dataset[$.toCamelCase(attr.name.split('data-')[1])] = attr.value;
                    }
                }
            }
            for (var key in dataset) {
                if (dataset[key] === 'false') dataset[key] = false;
                else if (dataset[key] === 'true') dataset[key] = true;
                else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] = dataset[key] * 1;
            }
            return dataset;
        } else return undefined;
    };

    $.fn.animationEnd = function (callback) {
        var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
            i, dom = this;

        function fireCallBack(e) {
            callback(e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }

        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    };
    $.fn.transition = function (duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };
    $.fn.transform = function (transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return this;
    };
})($);


/* global $:true */
+function ($) {
    "use strict";

    $.getCurrentPage = function () {
        return $(".page")[0] || document.body;
    };
}($);



// jshint ignore: start
/*
 * 路由器
 */
+function ($) {
    "use strict";

    if (!window.CustomEvent) {
        window.CustomEvent = function (type, config) {
            var e = document.createEvent('CustomEvent');
            e.initCustomEvent(type, config.bubbles, config.cancelable, config.detail, config.id);
            return e;
        };
    }

    var Router = function () {
        this.state = sessionStorage;
        this.state.setItem("stateid", parseInt(this.state.getItem("stateid") || 1) + 1);
        this.state.setItem("currentStateID", this.state.getItem("stateid"));
        this.stack = sessionStorage;
        this.stack.setItem("back", "[]");  //返回栈, {url, pageid, stateid}
        this.stack.setItem("forward", "[]");  //前进栈, {url, pageid, stateid}
        this.extras = {}; //page extra: popup, panel...
        this.init();
        this.xhr = null;
    }

    Router.prototype.defaults = {
        transition: true
    };

    Router.prototype.init = function () {
        var currentPage = this.getCurrentPage();
        if (!currentPage[0]) currentPage = $(".page").eq(0).addClass("page-current");
        var hash = location.hash;
        if (currentPage[0] && !currentPage[0].id) currentPage[0].id = (hash ? hash.slice(1) : this.genRandomID());

        if (!currentPage[0]) throw new Error("can't find .page element");
        var newCurrentPage = $(hash);


        if (newCurrentPage[0] && (!currentPage[0] || hash.slice(1) !== currentPage[0].id)) {
            currentPage.removeClass("page-current");
            newCurrentPage.addClass("page-current");
            currentPage = newCurrentPage;
        }

        //第一次加载的时候，初识话当前页面的state
        var state = history.state;
        if (!state) {
            var id = this.genStateID();
            this.replaceState(location.href, id);
            this.setCurrentStateID(id);
        }


        var self = this;

        setTimeout(function () {
            window.addEventListener('popstate', $.proxy(self.onpopstate, self));
        }, 30);

        //解决safari的一个bug，safari会在首次加载页面的时候触发 popstate 事件，通过setTimeout 做延迟来忽略这个错误的事件。
        //参考 https://github.com/visionmedia/page.js/pull/239/files
        //window.addEventListener('load', function () {
        //    setTimeout(function () {
        //        window.addEventListener('popstate', $.proxy(self.onpopstate, self));
        //    }, 0);
        //}, false);
    }

    //load new page, and push to history
    Router.prototype.loadPage = function (url, noAnimation, replace, reload) {

        var param = url;

        if (noAnimation === undefined) {
            noAnimation = !this.defaults.transition;
        }

        if (typeof url === typeof "a") {
            param = {
                url: url,
                noAnimation: noAnimation,
                replace: replace
            }
        }

        var url = param.url, noAnimation = param.noAnimation, replace = param.replace;

        this.getPage(url, function (page, extra) {

            var currentPage = this.getCurrentPage();

            var pageid = currentPage[0].id;

            var action = "pushBack";
            if (replace) action = "replaceBack";
            if (reload) action = "reloadBack";
            this[action]({
                url: location.href,
                pageid: "#" + pageid,
                id: this.getCurrentStateID(),
                animation: !noAnimation
            });

            //remove all forward page
            var forward = JSON.parse(this.state.getItem("forward") || "[]");
            var self = this;
            for (var i = 0; i < forward.length; i++) {
                $(forward[i].pageid).each(function () {
                    var $page = $(this);
                    if ($page.datas("page-remote")) {
                        var pageExtra = self.extras[$page[0].id];
                        pageExtra && pageExtra.remove();
                        self.extras[$page[0].id] = undefined;
                        $page.remove();
                    }
                });
            }
            this.state.setItem("forward", "[]");  //clearforward

            var duplicatePage = $("#" + $(page)[0].id);

            page.insertBefore($(".page")[0]);

            if (duplicatePage[0] !== page[0]) duplicatePage.remove(); //if inline mod, the duplicate page is current page

            if (extra) self.extras[page[0].id] = extra.appendTo(document.body);

            var id = this.genStateID();
            this.setCurrentStateID(id);

            this[replace || reload ? "replaceState" : "pushState"](url, id);

            this.forwardStack = [];  //clear forward stack

            this.animatePages(this.getCurrentPage(), page, null, noAnimation);
            $('.page-current').removeClass("page-end")
        });
    }

    //load new page and replace current page inhistory
    Router.prototype.replacePage = function (url, noAnimation) {
        return this.loadPage(url, noAnimation, true);
    }

    //reload current page
    Router.prototype.reloadPage = function () {
        return this.loadPage(location.href, true, false, true);
    }

    Router.prototype.animatePages = function (leftPage, rightPage, leftToRight, noTransition) {
        var removeClasses = 'page-left page-right page-from-center-to-left page-from-center-to-right page-from-right-to-center page-from-left-to-center';
        if (noTransition) {
            if (!leftToRight) {
                rightPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
                leftPage.removeClass(removeClasses).removeClass('page-current');
                rightPage.removeClass(removeClasses).addClass("page-current");
                rightPage.trigger("pageInitInternal", [rightPage[0].id, rightPage]);

                if (rightPage.hasClass("no-tabbar")) {
                    $(document.body).addClass("tabbar-hidden");
                } else {
                    $(document.body).removeClass("tabbar-hidden");
                }
            } else {
                leftPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
                rightPage.removeClass(removeClasses).removeClass('page-current');
                leftPage.removeClass(removeClasses).addClass("page-current");

                if (leftPage.hasClass("no-tabbar")) {
                    $(document.body).addClass("tabbar-hidden");
                } else {
                    $(document.body).removeClass("tabbar-hidden");
                }
                rightPage.trigger("pageInitInternal", [leftPage[0].id, leftPage]);
            }
        } else {
            if (!leftToRight) {
                rightPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
                leftPage.removeClass(removeClasses).addClass("page-from-center-to-left").removeClass('page-current');
                rightPage.removeClass(removeClasses).addClass("page-from-right-to-center page-current");

                leftPage.animationEnd(function () {
                    leftPage.removeClass(removeClasses);
                });
                rightPage.animationEnd(function () {
                    afterAnimation(rightPage);
                });

                if (rightPage.hasClass("no-tabbar")) {
                    $(document.body).addClass("tabbar-hidden");
                } else {
                    $(document.body).removeClass("tabbar-hidden");
                }
                rightPage.trigger("pageInitInternal", [rightPage[0].id, rightPage]);
            } else {
                leftPage.trigger("pageAnimationStart", [rightPage[0].id, rightPage]);
                rightPage.removeClass(removeClasses).addClass("page-from-center-to-right").removeClass('page-current');
                leftPage.removeClass(removeClasses).addClass("page-from-left-to-center page-current");

                leftPage.animationEnd(function () {
                    afterAnimation(leftPage);
                });
                rightPage.animationEnd(function () {
                    rightPage.removeClass(removeClasses);
                });
                if (leftPage.hasClass("no-tabbar")) {
                    $(document.body).addClass("tabbar-hidden");
                } else {
                    $(document.body).removeClass("tabbar-hidden");
                }
                rightPage.trigger("pageInitInternal", [leftPage[0].id, leftPage]);
            }
        }

        function afterAnimation(page) {
            page.removeClass(removeClasses);
            page.trigger("pageAnimationEnd", [page[0].id, page]);
        }

    }
    Router.prototype.getCurrentPage = function () {
        return $(".page-current");
    }
    //如果无法前进，则加载对应的url
    Router.prototype.forward = function (url) {
        var stack = JSON.parse(this.stack.getItem("forward"));
        if (stack.length) {
            history.forward();
        } else {
            location.href = url;
        }
    }
    //如果无法后退，则加载对应的url
    Router.prototype.back = function (url) {
        var stack = JSON.parse(this.stack.getItem("back"));
        if (stack.length) {
            history.back();
        } else if (url) {
            location.href = url;
        } else {
            history.back();
        }
    }

    //后退
    Router.prototype._back = function () {
        var h = this.popBack();
        if (!h) return;
        var currentPage = this.getCurrentPage();
        var newPage = $(h.pageid);
        if (!newPage[0]) return;
        this.pushForward({
            url: location.href,
            pageid: "#" + currentPage[0].id,
            id: this.getCurrentStateID(),
            animation: h.animation
        });
        this.setCurrentStateID(h.id);
        this.animatePages(newPage, currentPage, true, !h.animation);
    }

    //前进
    Router.prototype._forward = function () {
        var h = this.popForward();
        if (!h) return;
        var currentPage = this.getCurrentPage();
        var newPage = $(h.pageid);
        if (!newPage[0]) return;
        this.pushBack({
            url: location.href,
            pageid: "#" + currentPage[0].id,
            id: this.getCurrentStateID(),
            animation: h.animation
        });
        this.setCurrentStateID(h.id);
        this.animatePages(currentPage, newPage, false, !h.animation);
    }

    Router.prototype.pushState = function (url, id) {
        history.pushState({url: url, id: id}, '', url);
    }

    Router.prototype.replaceState = function (url, id) {
        history.replaceState({url: url, id: id}, '', url);
    }

    Router.prototype.onpopstate = function (d) {
        var state = d.state;
        if (!state) {
            return true;
        }

        if (state.id === this.getCurrentStateID()) {
            return false;
        }
        var forward = state.id > this.getCurrentStateID();
        if (forward) this._forward();
        else this._back();
    }


    //根据url获取页面的DOM，如果是一个内联页面，则直接返回，否则用ajax加载
    Router.prototype.getPage = function (url, callback) {
        if (url[0] === "#") return callback.apply(this, [$(url)]);

        this.dispatch("pageLoadStart");

        if (this.xhr && this.xhr.readyState < 4) {
            this.xhr.onreadystatechange = $.noop;
            this.xhr.abort();
            this.dispatch("pageLoadCancel");
        }

        var self = this;

        this.xhr = $.ajax({
            url: url,
            success: $.proxy(function (data, s, xhr) {
                var html = this.parseXHR(xhr);
                var $page = html[0];
                var $extra = html[1];
                if (!$page[0].id) $page[0].id = this.genRandomID();
                $page.datas("page-remote", 1);
                callback.apply(this, [$page, $extra]);
            }, this),
            error: function () {
                self.dispatch("pageLoadError");
            },
            complete: function () {
                self.dispatch("pageLoadComplete");
            }
        });
    }
    Router.prototype.parseXHR = function (xhr) {
        var response = xhr.responseText;
        var body = response.match(/<body[^>]*>([\s\S.]*)<\/body>/i);
        var html = body ? body[1] : response;
        html = "<div>" + html + "</div>";
        var tmp = $(html);

        var $extra = tmp.find(".popup, .popover, .panel, .panel-overlay");

        var $page = tmp.find(".page");
        if (!$page[0]) $page = tmp.addClass("page");
        return [$page, $extra];
    }

    Router.prototype.genStateID = function () {
        var id = parseInt(this.state.getItem("stateid")) + 1;
        this.state.setItem("stateid", id);
        return id;
    }
    Router.prototype.getCurrentStateID = function () {
        return parseInt(this.state.getItem("currentStateID"));
    }
    Router.prototype.setCurrentStateID = function (id) {
        this.state.setItem("currentStateID", id);
    }
    Router.prototype.genRandomID = function () {
        return "page-" + (+new Date());
    }

    Router.prototype.popBack = function () {
        var stack = JSON.parse(this.stack.getItem("back"));
        if (!stack.length) return null;
        var h = stack.splice(stack.length - 1, 1)[0];
        this.stack.setItem("back", JSON.stringify(stack));
        return h;
    }
    Router.prototype.pushBack = function (h) {
        var stack = JSON.parse(this.stack.getItem("back"));
        stack.push(h);
        this.stack.setItem("back", JSON.stringify(stack));
    }
    Router.prototype.replaceBack = function (h) {
        var stack = JSON.parse(this.stack.getItem("back"));
        stack.pop();
        stack.push(h);
        this.stack.setItem("back", JSON.stringify(stack));
    }
    Router.prototype.reloadBack = function (h) {
        //do nothing;
        return;
    }
    Router.prototype.popForward = function () {
        var stack = JSON.parse(this.stack.getItem("forward"));
        if (!stack.length) return null;
        var h = stack.splice(stack.length - 1, 1)[0];
        this.stack.setItem("forward", JSON.stringify(stack));
        return h;
    }
    Router.prototype.pushForward = function (h) {
        var stack = JSON.parse(this.stack.getItem("forward"));
        stack.push(h);
        this.stack.setItem("forward", JSON.stringify(stack));
    }

    Router.prototype.dispatch = function (event) {
        var e = new CustomEvent(event, {
            bubbles: true,
            cancelable: true
        });

        window.dispatchEvent(e);
    };


    $(function () {
        if (!$.smConfig.router) return;

        var router = $.router = new Router();
        router.defaults = Router.prototype.defaults;

        $(document).on("click", "a", function (e) {
            var $target = $(e.currentTarget);
            if ($target.hasClass("external") ||
                $target[0].hasAttribute("external")
            ) return;
            e.preventDefault();
            var url = $target.attr("href");
            if ($target.hasClass("back")) {
                router.back(url);
                $('.page-current').addClass("page-end");//记录退出的ID
                return;
            }

            if (!url || url === "#" || /javascript:.*;/.test(url)) return;
            router.loadPage(url, $target.hasClass("no-transition") ? true : undefined, $target.hasClass("replace") ? true : undefined);  //undefined is different to false
        })
    });
}($);
// jshint ignore: end

/* global $:true */
/*jshint unused: false*/
+function ($) {
    "use strict";

    var getPage = function () {
        var $page = $(".page-current");
        if (!$page[0]) $page = $(".page").addClass("page-current");
        return $page;
    };


    if ($.smConfig.showPageLoadingIndicator) {
        //这里的 以 push 开头的是私有事件，不要用
        $(window).on("pageLoadStart", function () {
            bootstrapDialog.showIndicator();
        });
        $(document).on("pageAnimationStart", function () {
            bootstrapDialog.hideIndicator();
        });
        $(window).on("pageLoadCancel", function () {
            bootstrapDialog.hideIndicator();
        });
        $(window).on("pageLoadError", function () {
            bootstrapDialog.hideIndicator();
            bootstrapDialog.msg("加载失败");
        });
    }


    $.init = function () {
        var $page = getPage();
        var id = $page[0].id;
        if ($page.hasClass("page-inited")) {
            $page.trigger("pageReinit", [id, $page]);
        } else {
            $page.addClass("page-inited");
            $page.trigger("pageInit", [id, $page]);
        }
    };

    $(function () {
        if ($.smConfig.autoInit) {
            $.init();
        }

        $(document).on("pageInitInternal", function (e, id, $page) {
            $.init();
        });
    });


}($);
