(function(app) {
  var slide = app.addSlide('slide-1', {
    onCreate: function() {
      console.log('slide-1.context', this.context);
    },
    onEnter: function() {

    },
    onExit: function() {

    }
  });
})(app);