
(function(app) {
  var slide1 = new Slide({
    domEl: 'slide-1',
    onCreate: function() {
      this.domEl.innerHTML = '<h1>Slide 1</h1>';
    }
  });

  app.slides.push(slide1);
})(app);
