(function(app) {
  var $ = app.$,
      compile = app.compile,
      template = compile($('#slide-1-template').html());

  app.addSlide('slide-1', {
    onCreate: function() {
      var $text = $(template(this.context));
      $(this.domEl).append($text);
      this.$text = $text;
      this.$text1 = $('.slide-1-text-1', $text);
      this.$text2 = $('.slide-1-text-2', $text);
      this.$foot = $('.slide-1-foot', this.domEl);
      this.$sky = $('.slide-1-sky', this.domEl);
    },
    onEnter: function() {
      this.$sky.velocity({
        left: '5%'
      }, {
        duration: 1000
      });

      this.$text1.velocity({
        opacity: 1.0
      }, {
        duration: 1000
      });

      this.$foot.velocity({
        left: '-5%'
      }, {
        delay: 1000,
        duration: 1200,
        easing: [300, 8]
      });

      this.$text2.velocity({
        opacity: 1.0
      }, {
        duration: 1200,
        delay: 1000
      });
    },
    onExit: function() {
      this.$foot.velocity('stop');
      this.$foot.css('left', '');

      this.$sky.velocity('stop');
      this.$sky.css('left', '');

      this.$text1.velocity('stop');
      this.$text1.css('opacity', '');

      this.$text2.velocity('stop');
      this.$text2.css('opacity', '');
    }
  });
})(app);
