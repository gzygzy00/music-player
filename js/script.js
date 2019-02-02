var Footer = {
    init: function () {
        this.$footer = $('footer');
        this.$ul = this.$footer.find('ul')
        this.bind();
        this.render()
    },

    bind: function () {
        var _this = this
        $(window).resize(function () {
            console.log('ok');
            _this.setStyle()
        })
    },

    render: function () {
        var _this = this;
        $.getJSON('http://api.jirengu.com/fm/getChannels.php').done(function (ret) {
            console.log(ret);
            _this.renderFooter(ret.channels)
        }).fail(function () {
            console.log('error');
        })
    },

    renderFooter: function (channels) {
        console.log('renderFooter');
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
        console.log(count, width);
    }
    //刷新的时候正常 resize屏幕后效果消失
}


Footer.init()