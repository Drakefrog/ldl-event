(function(app) {
  var $ = app.$,
      compile = app.compile,
      template = compile($('#slide-2-template').html());

  app.addSlide('slide-2', {
    onCreate: function() {
      var $text = $(template(this.context));
      $(this.domEl).append($text);
      this.$text = $text;
      this.$girl = $('.slide-2-girl', this.domEl);
      this.$superman = $('.slide-2-superman', this.domEl);
    },
    onEnter: function() {
      this.$text.velocity({
        opacity: 1.0
      }, {
        duration: 2000
      });

      this.$girl.velocity({
        left: "46%"
      }, {
        duration: 2000
      });

      this.$superman.velocity({
        left: "64%"
      }, {
        duration: 2000
      });
    },
    onExit: function() {
      this.$text.velocity('stop');
      this.$girl.velocity('stop');
      this.$superman.velocity('stop');

      this.$text.css('opacity', '');
      this.$girl.css('left', '');
      this.$superman.css('left', '');
    }
  });
})(app);
