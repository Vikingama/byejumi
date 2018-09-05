(function ($) {
    //自定义滚动替换以允许基于间隔的轮询，而不是检查每一个像素...
    var uniqueCntr = 0;
    $.fn.scrolled = function (waitTime, fn) {
        //this --- $(window)
        //fn --- RenderElementsCurrentlyInViewport()
        if (typeof waitTime === 'function') {
            fn = waitTime;
            waitTime = 200;
        }
        var tag = 'scrollTimer' + uniqueCntr++;
        this.scroll(function () {
            var self = $(this);//$(window)
            var timer = self.data(tag);
            console.log(self[0]); //window
            console.log(timer); //undefined, 3, 4, 5...
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                self.removeData(tag);
                fn.call(self[0]);
            }, waitTime);
            self.data(tag, timer);
        });
    };
    $.fn.AniView = function (options) {
        //默认设置，动画阈值控制触发点...
        var settings = $.extend({
            animateThreshold: 0,
            scrollPollInterval: 20
        }, options);
        //将匹配的元素保存在一个变量中
        var collection = this; //$(绑定的元素)
        //将匹配的元素包裹起来，然后将匹配的元素的透明度军置为 0...
        $(collection).each(function (index, element) {
            $(element).wrap('<div class="av-container"></div>');
            $(element).css('opacity', 0);
        });
        //根据元素顶部是否进入视口底部的结果，返回布尔值...
        function EnteringViewport (element) {
            var elementOffset = $(element).offset();
            var elementTop = elementOffset.top + $(element).scrollTop();
            var viewportBottom = $(window).scrollTop() + $(window).height();
            return (elementTop < (viewportBottom - settings.animateThreshold)) ? true : false;
        }
        //循环每个匹配的元素，确保每个应该加载动画的元素都进入了视口...
        function RenderElementsCurrentlyInViewport (collection) {
            $(collection).each(function (index, element) {
                var elementParentContainer = $(element).parent('.av-container');
                if ($(element).is('[data-av-animation]') && !$(elementParentContainer).hasClass('av-visible') && EnteringViewport(elementParentContainer)) {
                    $(element).css('opacity', 1);
                    $(elementParentContainer).addClass('av-visible');
                    $(element).addClass('animated ' + $(element).attr('data-av-animation'));
                }
            });
        }
        //页面加载完成时，加载当前在视口中的元素的动画
        RenderElementsCurrentlyInViewport(collection);
        //打开滚动时间计时器，观察每个即将进入视口的元素...
        $(window).scrolled(settings.scrollPollInterval, function () {
            RenderElementsCurrentlyInViewport(collection);
        });
    };
})(jQuery);