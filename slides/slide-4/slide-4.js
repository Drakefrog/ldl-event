(function(app) {
  var slide = app.addSlide('slide-4', {
    onCreate: function() {
      console.log('slide-4.context', this.context);
    },
    onEnter: function() {

    },
    onExit: function() {

    }
  });
})(app);