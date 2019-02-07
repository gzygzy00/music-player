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

            EventCenter.fire('select-album', {
                channelId: $(this).attr('data-channel-id'),
                channelName: $(this).attr('data-channel-name')
            })
        })


    },

    render:

        function () {
            var _this = this;
            $.getJSON('//jirenguapi.applinzi.com/fm/getChannels.php').done(function (ret) {
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
                <li data-channel-id="" data-channel-name="">
                    <div class="cover" style="background-image:url(image/gudazi.jpeg)"></div>
                    <h3>咕哒子</h3>
                </li>`
            var $node = $(template)
            $node.attr('data-channel-id', channel.channel_id)
            $node.attr('data-channel-name', channel.name)
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

var Fm = {
    init: function () {
        this.$container = $('.page-music')
        this.audio = new Audio()
        this.audio.autoplay = true
        this.bind()
    },

    bind: function () {
        var _this = this
        EventCenter.on('select-album', function (e, channelObj) {
            _this.channelId = channelObj.channelId
            _this.channelName = channelObj.channelName
            // console.log('select', channelId)
            _this.loadMusic(function () {
                _this.setMusic()
            })
        })

        this.$container.find('.button-play').on('click', function () {
            var $btn = $(this)
            if ($btn.hasClass('icon-play')) {
                $btn.removeClass('icon-play').addClass('icon-pause')
                _this.audio.play()
            } else {
                $btn.removeClass('icon-pause').addClass('icon-play')
                _this.audio.pause()
            }
        })

        this.$container.find('.button-next').on('click', function () {
            _this.loadMusic(function () {
                _this.setMusic()
            })
        })

        this.audio.addEventListener('play', function () {
            console.log('play');
            setInterval(function () {
                clearInterval(_this.statusClock)
                _this.statusClock = _this.updateStatus()
            }, 1000)
        })

        this.audio.addEventListener('pause', function () {
            console.log('pause');
            clearInterval(_this.statusClock)
        })
    },

    loadMusic: function (callback) {
        var _this = this
        console.log('load music');
        $.getJSON('//jirenguapi.applinzi.com/fm/getSong.php', {channel: this.channelId}).done(function (ret) {
            _this.song = ret.song[0]
            callback()
        }).fail(function () {
            console.log('error..');
        })
    },

    setMusic: function () {
        this.audio.src = this.song.url
        console.log('set music');
        console.log(this.song);
        $('.background').css('background-image', `url(${this.song.picture})`)
        this.$container.find('.picture figure').css('background-image', `url(${this.song.picture})`)
        this.$container.find('.name .song-name').text(this.song.title)
        this.$container.find('.name .author').text(this.song.artist)
        this.$container.find('.name .album-name').text(this.channelName)
    },

    updateStatus: function () {
        var minute = Math.floor(this.audio.currentTime / 60)
        var second = Math.floor(this.audio.currentTime % 60) + ''
        //加空格变成字符串
        second = second.length === 2 ? second : '0' + second
        this.$container.find('.current-time').text(`${minute}:${second}`)
        this.$container.find('.progress-bar .bar').css('width', this.audio.currentTime / this.audio.duration * 100 + '%')
        console.log('+1s')
    }
}


Footer.init()
Fm.init()