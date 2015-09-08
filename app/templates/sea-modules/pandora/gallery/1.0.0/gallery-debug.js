define("pandora/gallery/1.0.0/gallery-debug", [ "$-debug", "pandora/widget/1.0.0/widget-debug", "pandora/base/1.0.0/base-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug", "./fullscreen-debug", "pandora/overlay/1.0.0/overlay-debug", "./fullscreen-debug.css", "./fullscreen-debug.handlebars", "./thumbnails-debug", "./gallery-debug.css", "./gallery-debug.handlebars" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug"), Widget = require("pandora/widget/1.0.0/widget-debug"), // 全屏显示控件
    FullScreen = require("./fullscreen-debug"), // 缩略图导航条
    Thumbnails = require("./thumbnails-debug");
    // 样式表
    var importStyle = require("./gallery-debug.css"), styleImported;
    function detect() {
        var os = {}, ua = navigator.userAgent, webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/), android = ua.match(/(Android);?[\s\/]+([\d.]+)?/), ipad = ua.match(/(iPad).*OS\s([\d_]+)/), ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/), iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/), wp = ua.match(/Windows Phone ([\d.]+)/), chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/), ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/), firefox = ua.match(/Firefox\/([\d.]+)/), webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/);
        if (android) {
            os.android = true, os.version = android[2];
        }
        if (iphone && !ipod) {
            os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, ".");
        }
        if (ipad) {
            os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, ".");
        }
        if (ipod) {
            os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, ".") : null;
        }
        if (wp) {
            os.wp = true, os.version = wp[1];
        }
        if (webview) {
            os.webview = true;
        }
        os.tablet = !!(ipad || android && !ua.match(/Mobile/) || firefox && ua.match(/Tablet/) || ie && !ua.match(/Phone/) && ua.match(/Touch/));
        os.phone = !!(!os.tablet && !os.ipod && (android || iphone || chrome && ua.match(/Android/) || chrome && ua.match(/CriOS\/([\d.]+)/) || firefox && ua.match(/Mobile/) || ie && ua.match(/Touch/)));
        return os.phone || os.tablet;
    }
    /**
   * Gallery
   * 图集组件
   * 
   * @class Gallery
   * @extends Widget
   * @constructor
   */
    var Gallery = Widget.extend({
        defaults: {
            /**
       * 主元素的className
       * @attribute classPrefix
       * @type {String}
       * @default gb-gallery  
       */
            classPrefix: "gb-gallery",
            /**
       * 主元素的父元素
       * @attribute container
       * @type {String}
       * @default null  
       */
            container: null,
            /**
       * 主元素的选择器表达式
       * @attribute element
       * @type {String}
       * @default .gb-gallery  
       */
            element: ".gb-gallery",
            /**
       * 图片容器的className
       * @attribute imageWrapper
       * @type {String}
       * @default gb-gallery-image-wrapper 
       */
            imageWrapper: ".gb-gallery-viewport",
            /**
       * 图集的图片数据数组
       *
       * @attribute images
       * @type {Array}
       * @default null
       */
            images: [],
            /**
       * 图片数据字段
       * 
       * @attribute imageField
       * @type {String}
       * @default src
       */
            imageField: "src",
            /**
       * 图集标题
       * 
       * @attribute title
       * @type {String}
       * @default 标题
       */
            title: "图集",
            /**
       * 是否使用url锚点定位图片索引
       * 
       * @attribute anchor
       * @type {Boolean}
       * @default false
       */
            anchor: false,
            /**
       * 是否循环播放
       *
       * @attribute cycle
       * @type {Boolean}
       * @default false
       */
            cycle: false,
            /**
       * 是否自动轮播
       *
       * @attribute autoPlay
       * @type {Boolean}
       * @default false
       */
            autoPlay: false,
            /**
       * 当前加载中时是否可以继续切换图片
       *
       * @attribute autoPlay
       * @type {Boolean}
       * @default false
       */
            skipLoad: false,
            /**
       * 点击图片是否需要跳链外部
       *
       * @attribute autoPlay
       * @type {Boolean}
       * @default false
       */
            externalLink: false,
            /**
       * 自动轮播间隔(毫秒)
       *
       * @attribute interval
       * @type {int}
       * @default 3000
       */
            interval: 3e3,
            /**
       * 初始显示图片的索引
       *
       * @attribute startIndex
       * @type {int}
       * @default 0
       */
            startIndex: 0,
            /**
       * 图片显示方式
       *
       * @attribute display
       * @type {String}
       * @default natural
       */
            display: "limit",
            /**
       * 图片切换方式
       *
       * @attribute effect
       * @type {String}
       * @default fade
       */
            effect: "slide-hori",
            /**
       * 图片切换动画时长
       *
       * @attribute animationSpeed
       * @type {int}
       * @default 300
       */
            animationSpeed: 300,
            /**
       * 是否有全屏模式
       *
       * @attribute fullScreen
       * @type {Boolean}
       * @default false
       */
            fullscreen: true,
            /**
       * 是否显示缩略图列表
       *
       * @attribute thumbnails
       * @type {Boolean}
       * @default false
       */
            thumbnails: true,
            thumbHeight: "65px",
            thumbWidth: "20%",
            /**
       * 图片显示最大宽度，不限制则设置为0
       *
       * @attribute maxWidth
       * @type {int}
       * @default 0
       */
            maxWidth: 600,
            /**
       * 图片显示最大高度，不限制则设置为0
       *
       * @attribute maxHeight
       * @type {int}
       * @default 0
       */
            maxHeight: 400,
            /**
       * 是否引入默认css
       *
       * @attribute importStyle
       * @type {Boolean}
       * @default true
       */
            importStyle: true,
            /**
       * 上一组图信息
       *
       * @attribute prev
       * @type {Object}
       * @default null
       */
            prev: null,
            /**
       * 下一组图信息
       *
       * @attribute next
       * @type {Object}
       * @default null
       */
            next: null,
            template: require("./gallery-debug.handlebars"),
            data: {},
            /**
       * 绑定事件
       *
       * @attribute delegates
       * @type {Object}
       * @default {}
       */
            delegates: {
                "click [data-role=prev]": "prevImage",
                "click [data-role=next]": "nextImage",
                // 移动端滑动切换事件
                "touchstart .gb-gallery-viewport": function(e) {
                    var touch = e.originalEvent.targetTouches[0];
                    this.moveRecoder = {
                        startX: touch.pageX
                    };
                },
                "touchmove .gb-gallery-viewport": function(e) {
                    var touch = e.originalEvent.targetTouches[0];
                    this.moveRecoder.offsetX = this.moveRecoder.startX - touch.pageX;
                },
                "touchend .gb-gallery-viewport": function(e) {
                    if (this.moveRecoder && this.moveRecoder.offsetX > 0) {
                        // 向左滑动，查看下一张图片
                        this.nextImage();
                    } else if (this.moveRecoder && this.moveRecoder.offsetX < 0) {
                        // 向右滑动，查看上一张图片
                        this.prevImage();
                    } else {}
                },
                "mouseover [data-role=next]": function(e) {
                    if (!this.mobile && !this.option("externalLink")) {
                        this.role("next-icon").show();
                    }
                },
                "mouseout [data-role=next]": function(e) {
                    if (!this.mobile && !this.option("externalLink")) {
                        this.role("next-icon").hide();
                    }
                },
                "mouseover [data-role=prev]": function(e) {
                    if (!this.mobile && !this.option("externalLink")) {
                        this.role("prev-icon").show();
                    }
                },
                "mouseout [data-role=prev]": function(e) {
                    if (!this.mobile && !this.option("externalLink")) {
                        this.role("prev-icon").hide();
                    }
                },
                "click [data-role=fullscreen-trigger]": function() {
                    this.fullscreen && this.fullscreen.show();
                },
                "click [data-role=thumbnails-trigger]": function() {
                    this.thumbnails && this.thumbnails.toggle();
                }
            },
            events: {
                "before:showWhenLoaded": function(e) {
                    var self = e.target;
                    if (self.option("autoPlay") && self.option("interval")) {
                        self.interval = self.option("interval");
                    }
                },
                "after:render": function(e) {
                    var self = e.target;
                    if (self.mobile) {
                        self.role("prev-icon").add(self.role("next-icon")).css({
                            display: "block"
                        });
                    }
                }
            }
        },
        setup: function() {
            var self = this;
            self.images = self.getData();
            if (self.images.length <= 0) {
                return;
            }
            self.mobile = detect();
            self.locked = false;
            self.currentIndex = self._getStartIndex();
            self.inTransition = false;
            var title = self.option("title"), thumbnails = self.option("thumbnails"), thumbWidth = self.option("thumbWidth"), thumbHeight = self.option("thumbHeight"), fullscreen = self.option("fullscreen"), skipLoad = self.option("skipLoad"), prev = self.option("prev"), next = self.option("next");
            title && self.data({
                title: title
            });
            self.images && self.data({
                images: self.images
            });
            if (skipLoad) {
                self.skipLoadTimer = null;
            }
            if (thumbnails) {
                if (thumbWidth) {
                    // 如果设置值为像素
                    if (thumbWidth.indexOf("%") == -1) {
                        thumbWidth = thumbWidth.indexOf("px") == -1 ? thumbWidth + "px" : thumbWidth;
                    }
                }
                if (thumbHeight) {
                    // 如果设置值为像素
                    if (thumbHeight.indexOf("%") == -1) {
                        thumbHeight = thumbHeight.indexOf("px") == -1 ? thumbHeight + "px" : thumbHeight;
                    }
                }
                self.data({
                    thumbnails: thumbnails,
                    thumbHeight: thumbHeight,
                    thumbWidth: thumbWidth
                });
            }
            fullscreen && self.data({
                fullscreen: fullscreen
            });
            prev && self.data({
                prev: prev
            });
            next && self.data({
                next: next
            });
            if (this.option("importStyle") && !styleImported) {
                importStyle();
                styleImported = true;
            }
            self.render();
            self.imageWrapper = self.$(this.option("imageWrapper"));
            self.imageWrapperWidth = self.imageWrapper.width();
            self.imageWrapperHeight = self.imageWrapper.height();
            var wrappCss = {
                "text-align": "center",
                position: "relative"
            };
            if (self.option("display") == "limit") {
                wrappCss.height = self.option("maxHeight");
            }
            self.imageWrapper.css(wrappCss);
            self.loading(true);
            self.role("current").empty().append(self.currentIndex + 1);
            self.role("total").empty().append(self.images.length);
            if (!!self.option("maxWidth")) {
                self.role("gallery-content").css({
                    width: self.option("maxWidth") + "px"
                });
                self.imageWrapperWidth = self.option("maxWidth");
            }
            if (fullscreen) {
                self.fullscreen = new FullScreen({
                    gallery: self,
                    element: self.role("fullscreen"),
                    css: {
                        zIndex: 1001
                    }
                });
            }
            if (thumbnails) {
                self.thumbnails = new Thumbnails({
                    gallery: self,
                    element: self.role("thumbnails")
                });
            }
            self.showImage(self.currentIndex, function() {
                self.preloadImage(self.currentIndex + 1);
            });
            if (self.option("autoPlay")) {
                self.interval = self.option("interval");
                setInterval(function() {
                    if (!self.inTransition) {
                        self.interval -= 100;
                    }
                    if (self.interval <= 0) {
                        self.nextImage();
                        self.interval = self.option("interval");
                    }
                }, 100);
            }
            self.initDelegates({
                keydown: function(e) {
                    e.keyCode === 37 && this.prevImage();
                    e.keyCode === 39 && this.nextImage();
                }
            }, document);
            if (self.option("display") == "full") {
                self.initDelegates({
                    resize: function() {
                        Gallery.DISPLAY[self.option("display")].call(self, self.currentIndex, self.currentImage);
                    }
                }, self.viewport);
            }
        },
        /**
     * 从页面html中获取图集图片数据
     *
     * @method getData
     * @private
     */
        getData: function() {
            var self = this, data = [];
            if (self.option("images") && self.option("images").length > 0) {
                data = self.option("images");
            } else {
                var dataObj = self.role("data-list");
                if (dataObj.length > 0) {
                    dataObj.find("a").each(function() {
                        var imageData = {}, imgObj = $(this).find("img");
                        // 原图地址
                        imageData.original = $(this).attr("href");
                        // 图片跳链
                        imageData.link = $(this).attr("data-link") || null;
                        // 显示用图片地址
                        imageData.src = imgObj.data("src") || imageData.original;
                        // 缩略图片地址
                        imageData.thumb = imgObj.data("thumb") || imageData.src;
                        // 大图图片地址【然而并没有什么卵用】
                        imageData.big = imgObj.data("big") || imageData.src;
                        // 图片预设宽度
                        imageData.height = imgObj.data("height") || null;
                        // 图片预设高度
                        imageData.width = imgObj.data("width") || null;
                        // 图片描述
                        imageData.desc = imgObj.attr("alt");
                        data.push(imageData);
                    });
                }
            }
            return data;
        },
        /**
     * 切换显示图集中一张特定图片
     *
     * @param {int} [index] 图片在图集列表的索引
     * @param {Function} [callback] 切换成功后回调函数
     * @method showImage
     */
        showImage: function(index, callback) {
            var self = this;
            if (self.images[index] && !self.inTransition && !self.locked) {
                var image = self.images[index];
                if (self.option("skipLoad")) {
                    clearInterval(self.skipLoadTimer);
                    if (image.preloaded) {
                        self.inTransition = true;
                        self.showWhenLoaded(index, callback);
                    } else {
                        self.currentImage && self.currentImage.hide();
                        self.loading(true);
                        self.preloadImage(index);
                        self.skipLoadTimer = setInterval(function() {
                            if (image.preloaded) {
                                self.loading(false);
                                self.inTransition = true;
                                self.showWhenLoaded(index, callback);
                                clearInterval(self.skipLoadTimer);
                            }
                        }, 300);
                    }
                    self.showRelatedInfo(index);
                } else {
                    self.inTransition = true;
                    if (!image.preloaded) {
                        self.currentImage && self.currentImage.hide();
                        self.loading(true);
                        self.preloadImage(index, function() {
                            self.loading(false);
                            self.showWhenLoaded(index, callback);
                        });
                    } else {
                        self.showWhenLoaded(index, callback);
                    }
                }
            }
        },
        /**
     * 获取上一张图片索引
     *
     * @method prevIndex
     * @return {int} 上一张图片索引
     */
        prevIndex: function() {
            var prev = false;
            if (this.currentIndex === 0) {
                if (!this.option("cycle")) {
                    return false;
                }
                prev = this.images.length - 1;
            } else {
                prev = this.currentIndex - 1;
            }
            return prev;
        },
        /**
     * 显示上一张图片
     *
     * @param {Function} [callback] 切换成功后回调函数
     * @method prevImage
     */
        prevImage: function(callback) {
            var prev = this.prevIndex();
            if (prev === false) {
                return false;
            }
            this.showImage(prev, callback);
            this.preloadImage(prev - 1);
            return true;
        },
        /**
     * 获取下一张图片索引
     *
     * @method nextIndex
     * @return {int} 下一张图片索引
     */
        nextIndex: function() {
            var next = false;
            if (this.currentIndex === this.images.length - 1) {
                if (!this.option("cycle")) {
                    return false;
                }
                next = 0;
            } else {
                next = this.currentIndex + 1;
            }
            return next;
        },
        /**
     * 显示下一张图片
     *
     * @param {Function} [callback] 切换成功后回调函数
     * @method nextImage
     */
        nextImage: function(callback) {
            var next = this.nextIndex();
            if (next === false) {
                return false;
            }
            this.showImage(next, callback);
            this.preloadImage(next + 1);
            return true;
        },
        /**
     * 显示原图
     *
     * @method showOriginal
     */
        showOriginal: function(src) {
            this.role("original").attr("href", src);
        },
        /**
     * 切换加载状态
     *
     * @param {Boolean} [bool] 是否处于加载状态
     * @method loading
     */
        loading: function(bool) {
            this.isloading = bool;
            if (bool) {
                this.imageWrapper.addClass("loading");
            } else {
                this.imageWrapper.removeClass("loading");
            }
        },
        /**
     * 预加载图片
     *
     * @param {int} [index] 图片在图集列表的索引
     * @method _preloadImage
     * @private
     */
        preloadImage: function(index, callback) {
            var self = this;
            if (self.images[index]) {
                var image = self.images[index];
                if (!image.preloaded) {
                    var $img = $(new Image());
                    $img.attr("src", image[self.option("imageField")]);
                    if (!self.isImageLoaded($img[0])) {
                        $img.load(function() {
                            image.preloaded = true;
                            image.size = {
                                width: this.width,
                                height: this.height
                            };
                            self.fireCallback(callback);
                        }).error(function() {
                            image.error = true;
                            image.preloaded = false;
                            image.size = false;
                        });
                    } else {
                        image.preloaded = true;
                        image.size = {
                            width: $img[0].width,
                            height: $img[0].height
                        };
                        self.fireCallback(callback);
                    }
                } else {
                    self.fireCallback(callback);
                }
            }
        },
        /**
     * 获取起始图片索引
     *
     * @method _getStartIndex
     * @private
     */
        _getStartIndex: function() {
            var startIndex = parseInt(this.option("startIndex"), 10);
            var anchor = this.option("anchor");
            if (anchor && window.location.hash && window.location.hash.indexOf("#" + anchor) >= 0) {
                startIndex = parseInt(window.location.hash.replace(/[^0-9]+/g, ""), 10);
                if (startIndex * 1 != startIndex) {
                    startIndex = parseInt(this.option("startIndex"), 10);
                }
                if (startIndex >= this.images.length) {
                    startIndex = 0;
                }
            }
            return startIndex;
        },
        /**
     * 校验图片是否加载完成
     *
     * @param {Image} [img] Image对象
     * @method isImageLoaded
     * @private
     */
        isImageLoaded: function(img) {
            if (typeof img.complete != "undefined" && !img.complete) {
                return false;
            }
            if (typeof img.naturalWidth != "undefined" && img.naturalWidth === 0) {
                return false;
            }
            return true;
        },
        /**
     * 预加载完成后显示图片
     *
     * @param {int} [index] 图片在图集列表的索引
     * @param {Function} [callback] 切换成功后回调函数
     * @method showWhenLoaded
     * @private
     */
        showWhenLoaded: function(index, callback) {
            if (!this.images[index]) {
                return;
            }
            var self = this;
            var image = self.images[index];
            var $img = $(new Image());
            $img.attr("src", image[self.option("imageField")]);
            var $imgContainer = $(document.createElement("div")).addClass("gb-gallery-viewport-con").css({
                position: "absolute",
                width: "100%",
                left: "0",
                top: "0"
            });
            $imgContainer.append($img);
            if (self.option("externalLink")) {
                $imgContainer.wrapInner(!!image.link ? '<a href="' + image.link + '" target="_blank"></a>' : '<a href="javascript:;"></a>');
            }
            self.imageWrapper.prepend($imgContainer);
            Gallery.DISPLAY[self.option("display")].call(self, index, $imgContainer);
            //animation related
            var animationSpeed = this.option("animationSpeed");
            var easing = "swing";
            var direction = "right";
            if (self.currentIndex < index) {
                direction = "left";
            }
            var animation = Gallery.EFFECTS[self.option("effect")].call(this, $imgContainer, direction);
            if (typeof animation.speed != "undefined") {
                animationSpeed = animation.speed;
            }
            if (typeof animation.easing != "undefined") {
                easing = animation.easing;
            }
            var oldImage;
            if (self.currentImage) {
                oldImage = self.currentImage;
                oldImage.animate(animation.oldImage, animationSpeed, easing);
            }
            $imgContainer.animate(animation.newImage, animationSpeed, easing, function() {
                if (!!oldImage) {
                    oldImage.remove();
                }
                self.currentImage = $imgContainer;
                if (!self.option("skipLoad")) {
                    self.showRelatedInfo(index);
                }
                self.inTransition = false;
                self.fireCallback(callback);
            });
        },
        showRelatedInfo: function(index) {
            var self = this;
            self.currentIndex = index;
            if (self.thumbnails) {
                self.thumbnails.go(index);
            }
            self.role("current").empty().append(parseInt(index, 10) + 1);
            self.role("desc").empty().append(self.images[index].desc);
            self.showOriginal(self.images[index].original);
            if (self.option("anchor")) {
                window.location.hash = "#" + self.option("anchor") + index;
            }
        },
        lock: function() {
            this.locked = true;
        },
        unlock: function() {
            this.locked = false;
        },
        /**
     * 执行回调函数
     *
     * @param {Function} [fn] 回调函数
     * @param {Object} [p] 回调函数的参数
     * @method fireCallback
     * @private
     */
        fireCallback: function(fn, p) {
            if ($.isFunction(fn)) {
                fn.call(this, p);
            }
        },
        /**
     * 销毁，或绑定销毁事件回调
     *
     * @param {Function} [callback] 事件回调函数
     * @method destroy
     */
        destroy: function(callback) {
            if (callback) {
                return this.on("destroy", callback);
            }
            // 先销毁全屏对象
            this.fullscreen && this.fullscreen.destroy();
            // 再销毁缩略图对象
            this.thumbnails && this.thumbnails.destroy();
            Gallery.superclass.destroy.apply(this);
        }
    });
    Gallery.DISPLAY = {
        "width-first": function(index, imgContainer) {
            // var imgH = this.images[index].size.height,
            // imgW = this.images[index].size.width,
            // ratio = imgH / imgW,
            // $img = imgContainer.find('img');
            // var mh = !!this.option('maxHeight')? this.option('maxHeight') : this.imageWrapperHeight;
            // if (imgW > this.imageWrapperWidth) {
            //   imgW = this.imageWrapperWidth;
            //   imgH = parseInt(this.imageWrapperWidth * ratio, 0);
            // }
            // if (imgH > mh) {
            //   imgH = mh;
            //   imgW = parseInt(imgH / ratio, 0);
            // }
            // this.imageWrapperHeight = imgH;
            // this.imageWrapper.height(this.imageWrapperHeight);
            // $img.css({
            //   'height': imgH,
            //   'width': imgW
            // }).parent().css({'top': parseInt((this.imageWrapperHeight - imgH)/2, 0) + 'px'});
            // var prevIcon = this.imageWrapper.find('[data-role=prev-icon]'), nextIcon = this.imageWrapper.find('[data-role=next-icon]');
            // prevIcon.add(nextIcon).css({
            //   top:(this.imageWrapperHeight-nextIcon.height())/2
            // });
            // fix-bug: 修正了宽度优先撑满，高度自适应的算法
            var $img = imgContainer.find("img"), maxWidth = this.option("maxWidth");
            if (maxWidth == "0") {
                maxWidth = "100%";
            } else if (("" + maxWidth).indexOf("%") == -1 && ("" + maxWidth).indexOf("px") == -1) {
                maxWidth += "px";
            }
            $img.css({
                height: "auto",
                width: maxWidth,
                "max-width": "100%"
            });
            var prevIcon = this.imageWrapper.find("[data-role=prev-icon]"), nextIcon = this.imageWrapper.find("[data-role=next-icon]");
            prevIcon.add(nextIcon).css({
                top: (this.imageWrapper.height() - nextIcon.height()) / 2
            });
        },
        "height-first": function(index, imgContainer) {
            // var imgH = this.images[index].size.height,
            // imgW = this.images[index].size.width,
            // ratio = imgH / imgW,
            // $img = imgContainer.find('img');
            // var mh = !!this.option('maxHeight')? this.option('maxHeight') : this.imageWrapperHeight,
            // mw = !!this.option('maxWidth')? this.option('maxWidth') : this.imageWrapperWidth;
            // if (imgH > mh) {
            //   imgH = mh;
            //   imgW = parseInt(imgH / ratio, 0);
            // }
            // if (imgW > mw) {
            //   imgW = mw;
            //   imgH = parseInt(imgH * ratio, 0);
            // }
            // this.imageWrapperHeight = imgH;
            // this.imageWrapper.height(this.imageWrapperHeight);
            // $img.css({
            //   'height': imgH,
            //   'width': imgW
            // }).parent().css({'top': parseInt((this.imageWrapperHeight - imgH)/2, 0) + 'px'});
            // var prevIcon = this.imageWrapper.find('[data-role=prev-icon]'), nextIcon = this.imageWrapper.find('[data-role=next-icon]');
            // prevIcon.add(nextIcon).css({
            //   top:(this.imageWrapperHeight-nextIcon.height())/2
            // });
            // fix-bug: 修正了高度优先撑满，宽度自适应的算法
            var $img = imgContainer.find("img"), maxHeight = this.option("maxHeight");
            if (maxHeight == "0") {
                maxHeight = "100%";
            } else if (("" + maxHeight).indexOf("%") == -1 && ("" + maxHeight).indexOf("px") == -1) {
                maxHeight += "px";
            }
            $img.css({
                height: maxHeight,
                "max-height": "100%",
                width: "auto"
            });
            var prevIcon = this.imageWrapper.find("[data-role=prev-icon]"), nextIcon = this.imageWrapper.find("[data-role=next-icon]");
            prevIcon.add(nextIcon).css({
                top: (this.imageWrapper.height() - nextIcon.height()) / 2
            });
        },
        limit: function(index, imgContainer) {
            var imgH = this.images[index].size.height, imgW = this.images[index].size.width, ratio = imgH / imgW, areaRatio = this.option("maxHeight") / this.option("maxWidth"), $img = imgContainer.find("img");
            var mh = !!this.option("maxHeight") ? this.option("maxHeight") : this.imageWrapperHeight, mw = !!this.option("maxWidth") ? this.option("maxWidth") : this.imageWrapperWidth;
            this.imageWrapperHeight = mh;
            this.imageWrapper.height(this.imageWrapperHeight);
            if (ratio > areaRatio) {
                imgH = mh > imgH ? imgH : mh;
                imgW = parseInt(imgH / ratio, 0);
            } else {
                imgW = mw > imgW ? imgW : mw;
                imgH = parseInt(imgW * ratio, 0);
            }
            $img.css({
                height: imgH,
                width: imgW
            }).parents(".gb-gallery-viewport-con").css({
                top: parseInt((this.imageWrapperHeight - imgH) / 2, 0) + "px"
            });
        },
        // limit的前提下贴紧底部
        "close-bottom": function(index, imgContainer) {
            var imgH = this.images[index].size.height, imgW = this.images[index].size.width, ratio = imgH / imgW, areaRatio = this.option("maxHeight") / this.option("maxWidth"), $img = imgContainer.find("img");
            var mh = !!this.option("maxHeight") ? this.option("maxHeight") : this.imageWrapperHeight, mw = !!this.option("maxWidth") ? this.option("maxWidth") : this.imageWrapperWidth;
            this.imageWrapperHeight = mh;
            this.imageWrapper.height(this.imageWrapperHeight);
            if (ratio > areaRatio) {
                imgH = mh > imgH ? imgH : mh;
                imgW = parseInt(imgH / ratio, 0);
            } else {
                imgW = mw > imgW ? imgW : mw;
                imgH = parseInt(imgW * ratio, 0);
            }
            var imgTop = parseInt(this.imageWrapperHeight - imgH, 0);
            $img.css({
                height: imgH,
                width: imgW
            }).parents(".gb-gallery-viewport-con").css({
                top: imgTop + "px"
            });
        },
        full: function(index, imgContainer) {
            var imgH = this.images[index].size.height, imgW = this.images[index].size.width, scaleWidth, scaleHeight;
            var ratio = imgH / imgW;
            var $img = imgContainer.find("img");
            imgContainer.css({
                width: "100%",
                height: "100%"
            });
            this.imageWrapperWidth = this.viewport.document.documentElement.clientWidth || this.viewport.document.body.clientWidth || 0;
            this.imageWrapperHeight = this.viewport.document.documentElement.clientHeight || this.viewport.document.body.clientHeight || 0;
            if (imgH > this.imageWrapperHeight) {
                scaleWidth = Math.round(this.imageWrapperHeight / ratio);
                $img.attr("width", scaleWidth).attr("height", this.imageWrapperHeight);
            } else if (imgW > this.imageWrapperWidth) {
                scaleHeight = Math.round(this.imageWrapperWidth * ratio);
                $img.attr("width", this.imageWrapperWidth).attr("height", scaleHeight).css({
                    "margin-top": (this.imageWrapperHeight - scaleHeight) / 2 + "px"
                });
            } else {
                $img.css({
                    "margin-top": (this.imageWrapperHeight - imgH) / 2 + "px"
                });
            }
            this.role("next-icon").add(this.role("prev-icon")).css({
                top: "50%"
            });
        }
    };
    Gallery.EFFECTS = {
        "slide-vert": function(imgContainer, direction, desc) {
            var currentTop = parseInt(imgContainer.css("top"), 10), oldImageTop = "0px";
            if (direction == "left") {
                oldImageTop = "-" + this.imageWrapperHeight + "px";
                imgContainer.css("top", this.imageWrapperHeight + "px");
            } else {
                oldImageTop = this.imageWrapperHeight + "px";
                imgContainer.css("top", "-" + this.imageWrapperHeight + "px");
            }
            if (desc) {
                desc.css("bottom", "-" + desc[0].offsetHeight + "px");
                desc.animate({
                    bottom: 0
                }, this.option("animationSpeed") * 2);
            }
            if (this.currentDescription) {
                this.currentDescription.animate({
                    bottom: "-" + this.currentDescription[0].offsetHeight + "px"
                }, this.option("animationSpeed") * 2);
            }
            return {
                oldImage: {
                    top: oldImageTop
                },
                newImage: {
                    top: currentTop
                }
            };
        },
        "slide-hori": function(imgContainer, direction, desc) {
            var currentLeft = parseInt(imgContainer.css("left"), 10), oldImageLeft = "0px";
            if (direction == "left") {
                oldImageLeft = "-" + this.imageWrapperWidth + "px";
                imgContainer.css("left", this.imageWrapperWidth + "px");
            } else {
                oldImageLeft = this.imageWrapperWidth + "px";
                imgContainer.css("left", "-" + this.imageWrapperWidth + "px");
            }
            if (desc) {
                desc.css("bottom", "-" + desc[0].offsetHeight + "px");
                desc.animate({
                    bottom: 0
                }, this.option("animationSpeed") * 2);
            }
            if (this.currentDescription) {
                this.currentDescription.animate({
                    bottom: "-" + this.currentDescription[0].offsetHeight + "px"
                }, this.option("animationSpeed") * 2);
            }
            return {
                oldImage: {
                    left: oldImageLeft
                },
                newImage: {
                    left: currentLeft
                }
            };
        },
        resize: function(imgContainer, direction, desc) {
            var imageWidth = imgContainer.width();
            var imageHeight = imgContainer.height();
            var currentLeft = parseInt(imgContainer.css("left"), 10);
            var currentTop = parseInt(imgContainer.css("top"), 10);
            imgContainer.css({
                width: 0,
                height: 0,
                top: this.imageWrapperHeight / 2,
                left: this.imageWrapperWidth / 2
            });
            return {
                oldImage: {
                    width: 0,
                    height: 0,
                    top: this.imageWrapperHeight / 2,
                    left: this.imageWrapperWidth / 2
                },
                newImage: {
                    width: imageWidth,
                    height: imageHeight,
                    top: currentTop,
                    left: currentLeft
                }
            };
        },
        fade: function(imgContainer, direction, desc) {
            imgContainer.css("opacity", 0);
            return {
                oldImage: {
                    opacity: 0
                },
                newImage: {
                    opacity: 1
                }
            };
        },
        none: function(imgContainer, direction, desc) {
            imgContainer.css("opacity", 0);
            return {
                oldImage: {
                    opacity: 0
                },
                newImage: {
                    opacity: 1
                },
                speed: 0
            };
        }
    };
    module.exports = Gallery;
});

define("pandora/gallery/1.0.0/fullscreen-debug", [ "$-debug", "pandora/overlay/1.0.0/overlay-debug", "pandora/widget/1.0.0/widget-debug", "pandora/base/1.0.0/base-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug"), Overlay = require("pandora/overlay/1.0.0/overlay-debug");
    // 样式表
    var importStyle = require("pandora/gallery/1.0.0/fullscreen-debug.css"), styleImported;
    /**
   * FullScreen
   * 图集组件
   * 
   * @class FullScreen
   * @extends Widget
   * @constructor
   */
    var FullScreen = Overlay.extend({
        defaults: {
            /**
       * 主元素的父元素
       * @attribute container
       * @type {String}
       * @default .ue-gallery  
       */
            container: null,
            /**
       * 主元素的选择器表达式
       * @attribute element
       * @type {String}
       * @default .ue-gallery  
       */
            element: "[data-role=fullscreen]",
            /**
       * 缩略图导航依附的图集对象
       * @attribute gallery
       * @type {Gallery}
       * @default null
       */
            gallery: null,
            /**
       * 实例化后是否自动显示
       *
       * @attribute autoShow
       * @default false
       * @type {Boolean}
       */
            autoShow: false,
            css: {
                position: !!window.ActiveXObject && !window.XMLHttpRequest ? "absolute" : "fixed",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                display: "none",
                background: "#000",
                opacity: 1
            },
            data: {
                loader: "http://ue.17173cdn.com/a/hd/index/2014/images/loading-with-text.gif"
            },
            /**
       * 绑定事件
       *
       * @attribute delegates
       * @type {Object}
       * @default {}
       */
            delegates: {
                "click [data-role=close]": function(e) {
                    this.close();
                },
                "click [data-role=desc-trigger]": function(e) {
                    if (this.descShow) {
                        $(e.currentTarget).removeClass("btn-down").addClass("btn-up");
                        this.role("desc-box").removeClass("info-box-hover");
                        this.role("desc").slideUp(300);
                    } else {
                        $(e.currentTarget).removeClass("btn-up").addClass("btn-down");
                        this.role("desc-box").addClass("info-box-hover");
                        this.role("desc").slideDown(300);
                    }
                    this.descShow = !this.descShow;
                }
            },
            importStyle: true
        },
        setup: function() {
            var self = this;
            if (self.option("gallery")) {
                self.linkedGallery = self.option("gallery");
                if (self.option("descShow")) {
                    self.descShow = self.option("descShow");
                    self.data({
                        descShow: self.descShow
                    });
                }
                if (this.option("importStyle") && !styleImported) {
                    importStyle();
                    styleImported = true;
                }
                this.element.css({
                    visibility: "hidden"
                });
                this.render();
                self.initGallery();
                self.close(function() {
                    self.linkedGallery.showImage(self.gallery.currentIndex);
                });
                self.initDelegates({
                    keydown: function(e) {
                        e.keyCode === 27 && this.is(":visible") && this.close();
                    }
                }, document);
            }
        },
        initGallery: function() {
            var self = this;
            self.gallery = new self.linkedGallery.constructor({
                css: {
                    width: "100%",
                    height: "100%"
                },
                images: self.linkedGallery.images,
                imageField: "big",
                template: require("pandora/gallery/1.0.0/fullscreen-debug.handlebars"),
                data: {
                    descShow: self.data("descShow")
                },
                element: self.linkedGallery.role("fullscreen-gallery"),
                effect: "fade",
                imageWrapper: ".screen-image-box",
                display: "full",
                cycle: this.linkedGallery.option("cycle"),
                autoPlay: this.linkedGallery.option("autoPlay"),
                interval: this.linkedGallery.option("interval"),
                startIndex: this.linkedGallery.currentIndex,
                fullscreen: false,
                thumbnails: false,
                skipLoad: this.linkedGallery.option("skipLoad"),
                prev: self.linkedGallery.option("prev"),
                next: self.linkedGallery.option("next")
            });
        },
        /**
     * 点击关闭按钮，或绑定关闭事件回调
     *
     * @param {Function} [callback] 事件回调函数
     * @method close
     */
        show: function() {
            this.gallery.showImage(this.linkedGallery.currentIndex);
            FullScreen.superclass.show.apply(this);
        },
        /**
     * 退出全屏
     *
     * @param {Function} [callback] 事件回调函数
     * @method close
     */
        close: function(callback) {
            if (callback) {
                return this.on("close", callback);
            } else {
                /**
         * 通知关闭事件
         *
         * @event close
         * @param {object} e Event.
         */
                if (this.fire("close") !== false) {
                    this.hide();
                }
            }
        },
        /**
     * 销毁，或绑定销毁事件回调
     *
     * @param {Function} [callback] 事件回调函数
     * @method destroy
     */
        destroy: function(callback) {
            if (callback) {
                return this.on("destroy", callback);
            }
            FullScreen.superclass.destroy.apply(this);
        }
    });
    module.exports = FullScreen;
});

define("pandora/gallery/1.0.0/fullscreen-debug.css", [ "pandora/importstyle/1.0.0/importstyle-debug" ], function(require, exports, module) {
    var importStyle = require("pandora/importstyle/1.0.0/importstyle-debug");
    module.exports = function() {
        importStyle(".gb-gallery-fullscreen{background:#000}.gb-gallery-fullscreen .gb-gallery .loading{background:url(http://ue.17173cdn.com/a/hd/index/2014/images/loading-with-text.gif) no-repeat center center}.gb-gallery-fullscreen .screen-image-box{overflow:hidden;*zoom:1;width:100%}.gb-gallery-fullscreen .screen-image-box .loader{display:none;position:absolute;z-index:0}.gb-gallery-fullscreen .pic-box .pic{max-height:1080px;max-width:1920px}.gb-gallery-fullscreen .info-box{position:absolute;z-index:100;width:100%;margin-top:-33px;bottom:0;left:0}.gb-gallery-fullscreen .info-box-in{position:relative;overflow:hidden;*zoom:1}.gb-gallery-fullscreen .info-box-hover{position:absolute;left:0;bottom:0;margin-top:0}.gb-gallery-fullscreen .info-box .top-box{padding:5px 0}.gb-gallery-fullscreen .info-box .top-box .btn{display:block;background:url(http://ue1.17173cdn.com/a/hd/index/2014/images/arrow3.png) 0 0 no-repeat;width:55px;height:23px;margin:0 auto;cursor:pointer;_background:0;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='http://ue1.17173cdn.com/a/hd/index/2014/images/arrow3.png')}.gb-gallery-fullscreen .info-box .top-box .btn-down{background:url(http://ue2.17173cdn.com/a/hd/index/2014/images/arrow4.png) 0 0 no-repeat;_background:0;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='http://ue2.17173cdn.com/a/hd/index/2014/images/arrow4.png')}.gb-gallery-fullscreen .info-box .txt-box{color:#fff;text-align:left;padding:7px 30px 27px;display:none;font-size:12px}.gb-gallery-fullscreen .mask{position:absolute;top:0;left:0;width:100%;height:40em;background:#000;filter:alpha(opacity:80);opacity:.8;z-index:-1}:root .gb-gallery-fullscreen .mask{filter:none \\0}.gb-gallery-fullscreen .btn-c{display:none;width:60px;height:80px;top:50%;margin-top:-40px;background:url(http://ue1.17173cdn.com/a/hd/index/2014/images/spritesnew.png) 0 -232px no-repeat;position:absolute}.gb-gallery-fullscreen .next,.prev{position:absolute;width:50%;top:0;z-index:2;height:100%;cursor:pointer;background:#fff;opacity:0;filter:alpha(opacity=0)}.gb-gallery-fullscreen .next{right:0}.gb-gallery-fullscreen .prev{left:0}.gb-gallery-fullscreen .btn-prev{left:0}.gb-gallery-fullscreen .btn-prev:hover{background-position:0 -312px}.gb-gallery-fullscreen .btn-next{background-position:0 -72px;right:0}.gb-gallery-fullscreen .btn-next:hover{background-position:0 -152px}.gb-gallery-fullscreen .btn-esc{display:block;width:40px;height:36px;background:url(http://ue1.17173cdn.com/a/hd/index/2014/images/spritesnew.png) 0 0 no-repeat;position:absolute;top:20px;right:20px;z-index:10}.gb-gallery-fullscreen .btn-esc:hover{background-position:0 -36px}.gb-gallery-fullscreen .tip{position:absolute;top:377px;left:50%;top:50%;margin-left:-100px;margin-top:-23px;line-height:46px;color:#888;font-size:14px;width:200px;text-align:center;z-index:100;overflow:hidden;cursor:pointer;-webkit-border-radius:20px;-moz-border-radius:20px;border-radius:20px}.gb-gallery-fullscreen .tip .mask{width:200px;height:46px}.gb-gallery-fullscreen .view-pic{position:absolute;right:0;top:-26px}.gb-gallery-fullscreen .view-pic-item{display:block;color:#fff;background-color:#294c8e;padding:3px 5px}.gb-gallery-fullscreen .view-pic-item:hover{background-color:#3760ad;text-decoration:none}.gb-gallery-fullscreen .view-pic .ico{width:14px;height:14px;background:url(http://ue2.17173cdn.com/a/hd/index/2014/images/view-pic-ico.png) no-repeat 0 0;_background:0;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='http://ue2.17173cdn.com/a/hd/index/2014/images/view-pic-ico.png');margin-right:4px;display:inline-block;vertical-align:middle;overflow:hidden}.gb-gallery-fullscreen .ad-image-box .view-pic{top:auto;bottom:10px;right:10px;z-index:2}", "pandora/gallery/1.0.0/fullscreen.css");
    };
});

define("pandora/gallery/1.0.0/fullscreen-debug.handlebars", [ "gallery/handlebars/1.3.0/handlebars-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-debug");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, self = this;
        function program1(depth0, data) {
            return "info-box-hover";
        }
        function program3(depth0, data) {
            return "btn-down";
        }
        function program5(depth0, data) {
            return "btn-up";
        }
        function program7(depth0, data) {
            return 'style="display: block;"';
        }
        buffer += '<div class="screen-box-in" style="width: 100%;  height: 100%;">\r\n	<div class="screen-image-box" style="width: 100%;  height: 100%;"></div>\r\n	<div class="prev" data-role="prev"></div>\r\n	<a href="javascript:;" class="btn-c btn-prev" data-role="prev-icon"></a>\r\n	<div class="next" data-role="next"></div>\r\n	<a href="javascript:;" class="btn-c btn-next" data-role="next-icon"></a>\r\n	<a href="javascript:;" class="btn-esc" title="退出全屏" data-role="close"></a>\r\n	<div class="info-box ';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.descShow, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '" data-role="desc-box">\r\n		<div class="view-pic">\r\n			<a href="javascript:;" target="_blank" title="查看原图" class="view-pic-item" data-role="original"><i class="ico png"></i>查看原图</a>\r\n		</div>\r\n		<div class="info-box-in">\r\n			<div class="top-box">\r\n				<div class="btn ';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.descShow, {
            hash: {},
            inverse: self.program(5, program5, data),
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '" data-role="desc-trigger"></div>						\r\n			</div>\r\n			<p class="txt-box" ';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.descShow, {
            hash: {},
            inverse: self.noop,
            fn: self.program(7, program7, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += ' data-role="desc"></p>\r\n			<b class="mask"></b>\r\n		</div>\r\n	</div>\r\n</div>';
        return buffer;
    });
});

define("pandora/gallery/1.0.0/thumbnails-debug", [ "$-debug", "pandora/widget/1.0.0/widget-debug", "pandora/base/1.0.0/base-debug", "pandora/class/1.0.0/class-debug", "pandora/events/1.0.0/events-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug"), Widget = require("pandora/widget/1.0.0/widget-debug");
    /**
   * Thumbnails
   * 缩略图导航条
   * 
   * @class Thumbnails
   * @extends Widget
   * @constructor
   */
    var Thumbnails = Widget.extend({
        defaults: {
            /**
       * 主元素的父元素
       * @attribute container
       * @type {String}
       * @default null  
       */
            container: null,
            //'.ue-gallery-cnt',
            /**
       * 主元素的选择器表达式
       * @attribute element
       * @type {String}
       * @default .ue-gallery  
       */
            element: "[data-role=thumbnails]",
            /**
       * 缩略图导航依附的图集对象
       * @attribute gallery
       * @type {Gallery}
       * @default null
       */
            gallery: null,
            higtLightClass: "gb-gallery-thumbs-item-active",
            navDisplayWidth: 0,
            scrollJump: 0,
            effect: "fade",
            slideshow: {
                enable: true,
                autostart: false,
                speed: 5e3,
                startLabel: "Start",
                stopLabel: "Stop",
                stopOnScroll: true,
                countdownPrefix: "(",
                countdownSufix: ")",
                onStart: false,
                onStop: false
            },
            /**
       * 绑定事件
       *
       * @attribute delegates
       * @type {Object}
       * @default {}
       */
            delegates: {
                "click [data-role=thumb-item]": function(e) {
                    this.gallery && this.gallery.showImage($(e.currentTarget).index());
                },
                "click [data-role=back]": "click",
                "mouseover [data-role=back]": function(e) {
                    !this.gallery.mobile && this.mouseoverHandler(e);
                },
                "mouseout [data-role=back]": function(e) {
                    !this.gallery.mobile && this.mouseoutHandler(e);
                },
                "click [data-role=forward]": "click",
                "mouseover [data-role=forward]": function(e) {
                    !this.gallery.mobile && this.mouseoverHandler(e);
                },
                "mouseout [data-role=forward]": function(e) {
                    !this.gallery.mobile && this.mouseoutHandler(e);
                },
                // 移动端滑动切换事件
                "touchstart .gb-gallery-thumbs-con": function(e) {
                    var touch = e.originalEvent.targetTouches[0];
                    this.moveRecoder = {
                        startX: touch.pageX
                    };
                },
                "touchmove .gb-gallery-thumbs-con": function(e) {
                    var touch = e.originalEvent.targetTouches[0];
                    this.moveRecoder.offsetX = this.moveRecoder.startX - touch.pageX;
                },
                "touchend .gb-gallery-thumbs-con": function(e) {
                    if (this.moveRecoder && this.moveRecoder.offsetX > 0) {
                        // 向左滑动，查看下一张图片
                        this.role("forward").trigger("click");
                    } else if (this.moveRecoder && this.moveRecoder.offsetX < 0) {
                        // 向右滑动，查看上一张图片
                        this.role("back").trigger("click");
                    } else {}
                }
            }
        },
        setup: function() {
            if (this.option("gallery")) {
                var self = this;
                self.gallery = this.option("gallery");
                self.hasScrolled = 0;
                self.thumbsLoaded = false;
                self.thumbsScrollInterval = false;
                self.render();
                self.thumbsWrapper = self.role("thumbswrapper");
            }
        },
        /**
     * 切换缩略图导航显示与隐藏
     *
     * @method toggle
     */
        toggle: function() {
            if (this.element.is(":visible")) {
                this.hide();
            } else {
                this.show();
            }
        },
        show: function(callback) {
            if (callback) {
                return this.on("show", callback);
            }
            Thumbnails.EFFECTS[this.option("effect")].show.call(this, Thumbnails.superclass.show);
            return this;
        },
        hide: function(callback) {
            if (callback) {
                return this.on("hide", callback);
            }
            Thumbnails.EFFECTS[this.option("effect")].hide.call(this, Thumbnails.superclass.hide);
            return this;
        },
        /**
     * 切换显示图集中一张特定图片
     *
     * @param {int} [index] 图片在图集列表的索引
     * @method go
     */
        go: function(index) {
            var self = this;
            var scrollThumb = setInterval(function() {
                self.highLightThumb(index);
                clearInterval(scrollThumb);
            }, 10);
        },
        highLightThumb: function(index) {
            var self = this;
            var hlClass = self.option("higtLightClass");
            self.$("." + hlClass).removeClass(hlClass);
            var thumb = self.role("thumb-item").eq(index);
            thumb.addClass(hlClass);
            var left = self.thumbsWrapper[0].offsetLeft;
            left = self.thumbsWrapper.parent()[0].offsetWidth / 2 - thumb[0].offsetWidth * (index + .5);
            var maxRight = self.thumbsWrapper.parent().width() - self.role("thumb-item").width() * self.role("thumb-item").length;
            if (left < maxRight) {
                left = maxRight;
            }
            if (left > 0) {
                left = 0;
            }
            this.thumbsWrapper.stop().animate({
                left: left + "px"
            });
        },
        click: function(e) {
            var self = this;
            var width = self.thumbsWrapper.parent().width();
            if (self.option("scrollJump") > 0) {
                width = self.option("scrollJump");
            }
            var left = self.thumbsWrapper[0].offsetLeft;
            if (self.$(e.currentTarget).attr("data-role") == "forward") {
                left -= width;
            } else {
                left += width;
            }
            var maxRight = self.thumbsWrapper.parent().width() - self.role("thumb-item").width() * self.role("thumb-item").length;
            if (left < maxRight) {
                left = maxRight;
            }
            if (left > 0) {
                left = 0;
            }
            self.thumbsWrapper.animate({
                left: left + "px"
            });
            return false;
        },
        mouseoverHandler: function(e) {
            var self = this, direction = "left";
            if (self.$(e.currentTarget).attr("data-role") == "forward") {
                direction = "right";
            }
            self.thumbsScrollInterval = setInterval(function() {
                self.hasScrolled++;
                var left = self.thumbsWrapper.css("left") + "" == "NaN" ? "0" : parseInt(self.thumbsWrapper.css("left"), 0);
                if (direction == "left") {
                    left++;
                } else {
                    left--;
                }
                var maxRight = self.thumbsWrapper.parent().width() - self.role("thumb-item").width() * self.role("thumb-item").length;
                if (left < maxRight) {
                    left = maxRight;
                    clearInterval(self.thumbsScrollInterval);
                }
                if (left > 0) {
                    left = 0;
                    clearInterval(self.thumbsScrollInterval);
                }
                self.thumbsWrapper.css({
                    left: left + "px"
                });
            }, 10);
        },
        mouseoutHandler: function(e) {
            var self = this;
            self.hasScrolled = 0;
            clearInterval(self.thumbsScrollInterval);
        },
        loadThumb: function(index) {
            var self = this;
            var height = self.gallery.images[index].height, width = self.gallery.images[index].width, $imgObj = self.$("img").eq(index);
            if (height && width) {
                self.centerImage($imgObj, height, width);
            } else if (self.gallery.images[index].preloaded) {
                self.centerImage($imgObj, self.gallery.images[index].size.height, self.gallery.images[index].size.width);
            } else {
                var $img = $(new Image());
                $img.attr("src", $imgObj.attr("src"));
                $img.load(function() {
                    self.centerImage($imgObj, $img[0].height, $img[0].width);
                });
            }
        },
        centerImage: function($img, height, width) {
            var ratio = height / width;
            if (ratio > 1) {
                $img.css({
                    width: "100%"
                });
            } else {
                var outerHeight = $img.parent().height(), outerWidth = $img.parent().width();
                $img.css({
                    height: "100%",
                    margin: "0 0 0 " + Math.round((outerWidth - outerHeight / ratio) / 2) + "px"
                });
            }
        },
        setWidth: function() {
            var self = this;
            var wrapperWidth = self.element.width();
            if (/\d+/.test(self.thumbsWrapper.css("left"))) {
                wrapperWidth -= parseInt(self.thumbsWrapper.css("left"), 10) * 2;
            }
            if (/\d+/.test(self.thumbsWrapper.css("right"))) {
                wrapperWidth -= parseInt(self.thumbsWrapper.css("right"), 10) * 2;
            }
            self.thumbsWrapper.css({
                width: wrapperWidth + "px"
            });
            var $thumbItem = self.role("thumb-item");
            self.$(".js-thumb-list").width(($thumbItem.width() + parseInt($thumbItem.css("margin-left"), 0) + parseInt($thumbItem.css("margin-right"), 0)) * self.gallery.images.length);
        },
        saveThumbStatus: function() {},
        /**
     * 销毁，或绑定销毁事件回调
     *
     * @param {Function} [callback] 事件回调函数
     * @method destroy
     */
        destroy: function(callback) {
            if (callback) {
                return this.on("destroy", callback);
            }
            Thumbnails.superclass.destroy.apply(this);
        }
    });
    Thumbnails.EFFECTS = {
        none: {
            show: function(callback) {
                callback.call(this);
            },
            hide: function(callback) {
                callback.call(this);
            }
        },
        fade: {
            show: function(callback) {
                var self = this;
                self.element.fadeIn(200, function() {
                    callback.call(self);
                });
            },
            hide: function(callback) {
                var self = this;
                self.element.fadeOut(200, function() {
                    callback.call(self);
                });
            }
        }
    };
    module.exports = Thumbnails;
});

define("pandora/gallery/1.0.0/gallery-debug.css", [ "pandora/importstyle/1.0.0/importstyle-debug" ], function(require, exports, module) {
    var importStyle = require("pandora/importstyle/1.0.0/importstyle-debug");
    module.exports = function() {
        importStyle(".gb-gallery p{margin:0}.gb-gallery a{text-decoration:none}.gb-gallery img{max-width:100%;max-height:100%;border:0;vertical-align:middle}.gb-gallery .loading{background:url(http://ue2.17173cdn.com/a/lib/img/loading-white-16x16.gif) no-repeat center center}.gb-gallery .gb-gallery-in{overflow:hidden;*zoom:1;position:relative}.gb-gallery .gb-gallery-btn i{position:absolute;top:50%;background:url(http://ue1.17173cdn.com/a/lib/pandora/gallery/1.0.0/assets/img/b.png) no-repeat;cursor:pointer}.gb-gallery .gb-gallery-btn-prev{left:0}.gb-gallery .gb-gallery-btn-next{right:0}.gb-gallery-viewport{position:relative}.gb-gallery-viewport-con{text-align:center}.gb-gallery-viewport .gb-gallery-btn{position:absolute;top:0;width:50%;height:100%;background:url(http://ue1.17173cdn.com/a/lib/pandora/gallery/1.0.0/assets/img/b.png) no-repeat -73px 0}.gb-gallery-viewport .gb-gallery-btn i{display:none;_display:block;width:35px;height:55px;margin-top:-27px}.gb-gallery-viewport .gb-gallery-btn-prev i{left:10px;background-position:0 0}.gb-gallery-viewport .gb-gallery-btn-next i{right:10px;background-position:-37px 0}.gb-gallery-detail{position:relative;*zoom:1;padding:.3em 0 .8em}.gb-gallery-detail .gb-gallery-num{overflow:hidden;position:absolute;bottom:-1.5em;height:36px;padding:0;font:400 16px/1.2 Georgia;color:#999}.gb-gallery-detail .gb-gallery-num-cur{font-size:30px;color:#cc1b1b}.gb-gallery-detail .gb-gallery-desc{color:#666;line-height:1.75}.gb-gallery-tools{float:right;padding-bottom:.8em}.gb-gallery-tools .gb-gallery-btn{overflow:hidden;_display:inline;float:left;height:17px;margin-left:2em;font-size:14px;line-height:17px;color:#666;background:url(http://ue1.17173cdn.com/a/lib/pandora/gallery/1.0.0/assets/img/b.png) no-repeat}.gb-gallery-tools .gb-gallery-btn:visited,.gb-gallery-tools .gb-gallery-btn:hover,.gb-gallery-tools .gb-gallery-btn:active{color:#333}.gb-gallery-tools .gb-gallery-btn-zoom{padding-left:20px;background-position:-56px -56px}.gb-gallery-tools .gb-gallery-btn-full{padding-left:19px;background-position:-56px -84px}.gb-gallery-tools .gb-gallery-btn-thumbs{width:15px;background-position:0 -84px}.gb-gallery-tools .gb-gallery-btn-thumbs-active{width:15px;background-position:-16px -84px}.gb-gallery-thumbs{clear:both;position:relative;padding:2px 30px}.gb-gallery-thumbs-con{position:relative;overflow:hidden;width:100%;height:100%;margin:-2px;padding:2px}.gb-gallery-list-thumbs{position:relative;height:100%;font-size:0;white-space:nowrap}.gb-gallery-thumbs-item{display:inline-block;*display:inline;*zoom:1;margin:0;padding:0;height:100%;vertical-align:top}.gb-gallery-thumbs-item-in{height:100%;margin:0 5px}.gb-gallery-thumbs-item a{display:block;overflow:hidden;width:100%;height:100%;background:#dedede}.gb-gallery-thumbs-item a img{display:block;margin:0 auto}.gb-gallery-thumbs-item a:hover,.gb-gallery-thumbs-item-active a{position:relative;margin:-2px;border:2px solid #ffcd00}.gb-gallery-thumbs .gb-gallery-btn{position:absolute;top:0;width:30px;height:100%;background:url(http://ue1.17173cdn.com/a/lib/pandora/gallery/1.0.0/assets/img/b.png) no-repeat -73px 0}.gb-gallery-thumbs .gb-gallery-btn i{width:15px;height:25px;margin:-12px 0 0 7px}.gb-gallery-thumbs .gb-gallery-btn-prev i{background-position:0 -57px}.gb-gallery-thumbs .gb-gallery-btn-next i{background-position:-17px -57px}", "pandora/gallery/1.0.0/gallery.css");
    };
});

define("pandora/gallery/1.0.0/gallery-debug.handlebars", [ "gallery/handlebars/1.3.0/handlebars-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.3.0/handlebars-debug");
    module.exports = Handlebars.template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 4, ">= 1.0.0" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            return '\r\n		<a href="javascript:void(0);" class="gb-gallery-btn gb-gallery-btn-full" data-role="fullscreen-trigger">全屏查看</a>\r\n		';
        }
        function program3(depth0, data) {
            return '\r\n		<a href="javascript:void(0);" class="gb-gallery-btn gb-gallery-btn-thumbs gb-gallery-btn-thumbs-active" data-role="thumbnails-trigger"></a>\r\n		';
        }
        function program5(depth0, data) {
            var buffer = "", stack1, helper;
            buffer += '\r\n	<div class="gb-gallery-thumbs" data-role="thumbnails" style="height:';
            if (helper = helpers.thumbHeight) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.thumbHeight;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + ';">\r\n		<div class="gb-gallery-thumbs-con">\r\n			<div class="gb-gallery-list-thumbs" data-role="thumbswrapper">\r\n				';
            stack1 = helpers.each.call(depth0, depth0 && depth0.images, {
                hash: {},
                inverse: self.noop,
                fn: self.programWithDepth(6, program6, data, depth0),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '\r\n			</div>\r\n		</div>\r\n		<a href="javascript:void(0);" class="gb-gallery-btn gb-gallery-btn-prev" data-role="back"><i></i></a>\r\n		<a href="javascript:void(0);" class="gb-gallery-btn gb-gallery-btn-next" data-role="forward"><i></i></a>\r\n	</div>\r\n	';
            return buffer;
        }
        function program6(depth0, data, depth1) {
            var buffer = "", stack1, helper;
            buffer += '\r\n					<div class="gb-gallery-thumbs-item" data-role="thumb-item" style="width:' + escapeExpression((stack1 = depth1 && depth1.thumbWidth, 
            typeof stack1 === functionType ? stack1.apply(depth0) : stack1)) + ';">\r\n						<div class="gb-gallery-thumbs-item-in">\r\n							<a href="javascript:void(0);" title="';
            if (helper = helpers.desc) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.desc;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '">\r\n								<img src="';
            if (helper = helpers.thumb) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.thumb;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" alt="';
            if (helper = helpers.desc) {
                stack1 = helper.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                helper = depth0 && depth0.desc;
                stack1 = typeof helper === functionType ? helper.call(depth0, {
                    hash: {},
                    data: data
                }) : helper;
            }
            buffer += escapeExpression(stack1) + '" />\r\n							</a>\r\n						</div>\r\n					</div>\r\n				';
            return buffer;
        }
        function program8(depth0, data) {
            return '\r\n	<div class="gb-gallery-fullscreen" data-role="fullscreen">\r\n		<div class="screen-box" data-role="fullscreen-gallery"></div>\r\n	</div>\r\n	';
        }
        buffer += '<div class="gb-gallery-in">\r\n	<div class="gb-gallery-viewport">\r\n		<a href="javascript:void(0);" class="gb-gallery-btn gb-gallery-btn-prev" data-role="prev"><i data-role="prev-icon"></i></a>\r\n		<a href="javascript:void(0);" class="gb-gallery-btn gb-gallery-btn-next" data-role="next"><i data-role="next-icon"></i></a>\r\n	</div>\r\n	<div class="gb-gallery-detail">\r\n		<p class="gb-gallery-num">\r\n			<span class="gb-gallery-num-cur" data-role="current"></span>/<span class="gb-gallery-num-sum" data-role="total">16</span>\r\n		</p>\r\n		<div class="gb-gallery-desc" data-role="desc"></div>\r\n	</div>\r\n	<div class="gb-gallery-tools">\r\n		<a href="javascript:void(0);" target="_blank" class="gb-gallery-btn gb-gallery-btn-zoom" data-role="original">查看原图</a>\r\n		';
        stack1 = helpers["if"].call(depth0, depth0 && depth0.fullscreen, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n		";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.thumbnails, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n	</div>\r\n	";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.thumbnails, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n	";
        stack1 = helpers["if"].call(depth0, depth0 && depth0.fullscreen, {
            hash: {},
            inverse: self.noop,
            fn: self.program(8, program8, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n</div>";
        return buffer;
    });
});
