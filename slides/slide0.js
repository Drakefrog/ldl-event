
(function(app) {
  var slide0 = new Slide({
    domEl: 'slide-0',
    onCreate: function() {
      this.domEl.innerHTML = '<h1>Slide 0</h1>';
    }
  });

  app.slides.push(slide0);
})(app);
