# music-player
[响应式音乐播放器](https://gzygzy00.github.io/music-player/)
* XD Music Player
* 一个简单的响应式页面音乐播放器，可以点击页面下方专辑进行音乐播放，已有暂停、播放下一首等功能，可以显示对应歌曲相关信息，并加入了一个可以显示 CSS3 动画的小功能来改变歌词字体效果。
1. 使用'vh'代替'px'使页面具有响应式；
2. js 中分为 Footer（专辑频道）和 Fm（音乐播放和相关信息）两块；JQuery $.getJSON；
3. 为了能够实现点击对应专辑频道获取对应歌曲，使用了自定义事件，在获取数据时保存下次获取数据需要参数，并在 Footer.bind 中(fire)发射相关对象，在Fm.bind 中(on)触发，从而获得对象用于参数中；
4. 正则匹配，实现歌词功能……
* 熟悉了音乐播放使用的 html dom audio 功能、自定义事件、CSS3 animate、ES6 模板字符串，渲染页面进一步熟练……
* 技术栈关键字：jQuery、CSS3、响应式
