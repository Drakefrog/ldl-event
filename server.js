
var express = require('express'),
    hbs = require('hbs'),
    builder = require('./slide-builder'),
    app = express();

app.set('view engine', 'hbs');

app.get('/', function(req, res) {
  res.send(builder.render('index', {
    title: "Slide show"
  }));
});

app.use(express.static(__dirname));

app.listen(process.env.PORT || 3000);
