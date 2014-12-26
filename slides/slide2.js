
(function(app) {
  var slide2 = new Slide({
    domEl: 'slide-2',
    onCreate: function() {
      this.domEl.innerHTML = '<h1>Slide 2</h1>';
    }
  });

  app.slides.push(slide2);
})(app);
