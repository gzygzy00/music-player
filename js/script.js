// var EventCenter = {
//     on: function(type, handler){
//         document.addEventListener(type, handler)
//     },               //有一个on的方法，声明（事件，处理方法）。
//     fire: function(type, data){
//         return document.dispatchEvent(new CustomEvent(type, {
//             detail: data
//         }))
//     }
// }
// //声明一个对象EventCenter
//
// EventCenter.on('hello', function(e){
//     console.log(e.detail)
// })        //EventCenter.on听到hello时，执行后面的方法，输出当前事件的内容。
//
// EventCenter.fire('hello', '你好')      //这里把事件hello触发传播出来了

var EventCenter = {
    on: function (type, handler) {
        $(document).on(type, handler)
    },
    fire: function (type, data) {
        $(document).trigger(type, data)
    }
}

var Footer = {
    init: function () {
        this.$footer = $('footer');
        this.$ul = this.$footer.find('ul')
        this.$box = this.$footer.find('.box')
        this.$leftButton = this.$footer.find('.icon-arrow_left')
        this.$rightButton = this.$footer.find('.icon-arrow_right')
        this.isToEnd = false
        this.isToStart = true
        this.isAnimate = false
        this.bind();
        this.render()
    },

    bind: function () {
        var _this = this

        $(window).resize(function () {
            _this.setStyle()
        })

        this.$rightButton.on('click', function () {
            var itemWidth = _this.$footer.find('li').outerWidth(true)
            var rowCount = Math.floor(_this.$box.width() / itemWidth)

            if (_this.isAnimate) return

            if (!_this.isToEnd) {
                _this.isAnimate = true
                _this.$ul.animate({
                    left: "-=" + rowCount * itemWidth
                }, 400, function () {
                    _this.isToStart = false
                    _this.isAnimate = false

                    if (_this.$box.width() - parseFloat(_this.$ul.css('left')) >= parseFloat(_this.$ul.css('width'))) {
                        _this.isToEnd = true

                        // _this.$rightButton.addClass('disabled')
                    }
                })
            }
        })

        this.$leftButton.on('click', function () {
            var itemWidth = _this.$footer.find('li').outerWidth(true)
            var rowCount = Math.floor(_this.$box.width() / itemWidth)
            if (_this.isAnimate) return
            if (!_this.isToStart) {
                _this.isAnimate = true
                _this.$ul.animate({
                    left: "+=" + rowCount * itemWidth
                }, 400, function () {
                    _this.isAnimate = false
                    _this.isToEnd = false
                    if (parseFloat(_this.$ul.css('left')) >= 0) {
                        _this.isToStart = true
                    }
                })
            }
        })

        this.$footer.on('click', 'li', function () {
            $(this).addClass('active')
                .siblings().removeClass('active')

            EventCenter.fire('select-album', $(this).attr('data-channel-id'))
        })


    },

    render:

        function () {
            var _this = this;
            $.getJSON('//api.jirengu.com/fm/getChannels.php').done(function (ret) {
                console.log(ret);
                _this.renderFooter(ret.channels)
            }).fail(function () {
                console.log('error');
            })
        },

    renderFooter: function (channels) {
        var _this = this;
        channels.forEach(function (channel) {
            template = `
                <li data-channel-id="">
                    <div class="cover" style="background-image:url(image/gudazi.jpeg)"></div>
                    <h3>咕哒子</h3>
                </li>`
            var $node = $(template)
            $node.attr('data-channel-id', channel.channel_id)
            $node.find('div').attr('style', 'background-image:url(' + channel.cover_small + ')')
            $node.find('h3').text(channel.name)
            _this.$ul.append($node)
        })
    },

    setStyle: function () {
        var count = this.$footer.find('ul li').length;
        var width = this.$footer.find('ul li').outerWidth(true)
        this.$ul.css({width: count * width + "px"})
    }
}


Footer.init()
EventCenter.on('select-album', function (e, data) {
    console.log('select', data);
})