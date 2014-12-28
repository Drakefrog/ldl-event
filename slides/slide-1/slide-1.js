(function(app) {
  var slide = app.addSlide('slide-1', {
    onCreate: function() {
      this.$foot = $('.slide-1-foot', this.domEl);
    },
    onEnter: function() {
      this.$foot.velocity({
        left: '-5%'
      }, {
        duration: 1200,
        easing: [300, 8]
      });
    },
    onExit: function() {
      this.$foot.css('left', '');
    }
  });
})(app);
