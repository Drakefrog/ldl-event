(function(app) {
  var slide = app.addSlide('slide-2', {
    onCreate: function() {
      console.log('slide-2.context', this.context);
    },
    onEnter: function() {

    },
    onExit: function() {

    }
  });
})(app);