(function(app) {
  var slide = app.addSlide('slide-3', {
    onCreate: function() {
      console.log('slide-3.context', this.context);
    },
    onEnter: function() {

    },
    onExit: function() {

    }
  });
})(app);