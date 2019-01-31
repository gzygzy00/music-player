var Footer = {
    init: function () {
        this.$footer = $('footer');
        this.bind();
        this.render()
    },

    bind: function () {

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
        var _this = this
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
            $('footer ul').append($node)
        })

    }
}


Footer.init()