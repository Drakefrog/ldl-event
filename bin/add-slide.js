
var slideName = process.argv[2],
    mkdirp = require('mkdirp').sync,
    destFolder = __dirname + '/../slides/' + slideName,
    fs = require('fs'),
    write = fs.writeFileSync,
    read = fs.readFileSync,
    hbsStr, cssStr, jsStr, jsonStr,
    match, index = 0;

function randomColor() { return '#'+Math.floor(Math.random()*16777215).toString(16); }

if (!slideName) {
  throw new Error('Not slide name provided!');
}

match = /^.*-([0-9]+)$/.exec(slideName);
if (match) {
  index = parseInt(match[1]);
}

hbsStr = [
  '<div id="{{name}}" class="ss-slide ss-{{posX}}-{{posY}} {{name}}">',
  '  <h1>{{title}}</h1>',
  '</div>'
].join('\n');

cssStr = [
  '.' + slideName + ' { background-color: ' + randomColor() + '; }'
].join('\n');

jsStr = [
  '(function(app) {',
  '  var slide = app.addSlide(\'' + slideName + '\', {',
  '    onCreate: function() {',
  '      console.log(\'' + slideName + '.context\', this.context);',
  '    },',
  '    onEnter: function() {',
  '',
  '    },',
  '    onExit: function() {',
  '',
  '    }',
  '  });',
  '})(app);'
].join('\n');

jsonStr = JSON.stringify({
  "name": slideName,
  "title": slideName,
  "index": index,
  "posX": 0,
  "posY": index
}, null, 4);

mkdirp(destFolder);
write(destFolder + '/' + slideName + '.hbs', hbsStr);
write(destFolder + '/' + slideName + '.css', cssStr);
write(destFolder + '/' + slideName + '.js', jsStr);
write(destFolder + '/' + slideName + '.json', jsonStr);
