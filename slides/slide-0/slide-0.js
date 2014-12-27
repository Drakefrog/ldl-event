(function(app) {
  var slide = app.addSlide('slide-0', {
    onCreate: function() {
      console.log('slide-0.context', this.context);
    },
    onEnter: function() {

    },
    onExit: function() {

    }
  });
})(app);