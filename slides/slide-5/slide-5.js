(function(app) {
  var slide = app.addSlide('slide-5', {
    onCreate: function() {
      console.log('slide-5.context', this.context);
    },
    onEnter: function() {

    },
    onExit: function() {

    }
  });
})(app);