
var DEFAULT_SLIDES_DIR = __dirname + '/slides',
    DEFAULT_VIEWS_DIR = __dirname + '/views',
    _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    handlebars = require('hbs').handlebars,
    isDir = function(p) { return fs.existsSync(p) && fs.lstatSync(p).isDirectory(); };

function loadSlidesList(aDir) {
  var dir = aDir || DEFAULT_SLIDES_DIR,
      slides = fs.readdirSync(dir).filter(function(p) {
        return isDir(path.join(dir, p));
      }).map(function(folder) {
        var items = fs.readdirSync(path.join(dir, folder))
              .filter(function(file) {
                return /^[^\.]/.test(file);
              })
              .map(function(file) {
                return {
                  path: path.join('slides', folder, file),
                  fullpath: path.join(dir, folder, file),
                  ext: path.extname(file).slice(1)
                };
              });
        return { name: folder, contents: _.groupBy(items, function(item) { return item.ext; }) };
      });
  return slides;
}

function loadConfig(slides) {
  slides.forEach(function(slide) {
    var configFile = slide.contents && slide.contents.json &&
          slide.contents.json[0] && slide.contents.json[0].fullpath,
        config;

    if (configFile) {
      try {
        config = JSON.parse(fs.readFileSync(configFile));
      } catch(err) {
        console.log('Error parsing json file: ' + configFile);
        throw err;
      }
    }
    config.basePath = 'slides/' + config.name;
    slide.config = config;
  });
}

function compileHTMLForEachSlides(slides) {
  slides.forEach(function(slide) {
    var hbsFiles = slide.contents && slide.contents.hbs,
        data = slide.config,
        html = '';
    if (hbsFiles) {
      html = hbsFiles.map(function(item) {
        var templateFile = item.fullpath,
            source = fs.readFileSync(templateFile, 'utf8'),
            compiled = handlebars.compile(source);
        return compiled(data);
      }).join('\n');
    }
    slide.html = html;
  });
}

function injectConfigs(slides) {
  var merged = slides.reduce(function(sofar, slide) {
    sofar[slide.name] = slide.config || {};
    return sofar;
  }, {});
  return JSON.stringify(merged);
}

function load(dir) {
  var slides = loadSlidesList(dir);
  loadConfig(slides);
  compileHTMLForEachSlides(slides);
  return slides;
}

function render(template, aContext) {
  var context = aContext || {},
      source = fs.readFileSync(DEFAULT_VIEWS_DIR + '/' + template + '.hbs', 'utf8'),
      compiled;

  context.slides = context.slides || load(context.slidesDir);
  context.config = injectConfigs(context.slides);

  compiled = handlebars.compile(source);
  return compiled(context);
}

exports.load = load;
exports.loadSlidesList = loadSlidesList;
exports.render = render;

if (!module.parent) {
  var slides = load();
  console.log("slides = ", JSON.stringify(slides, null, 4));
  console.log("conf = ", JSON.stringify(JSON.parse(injectConfigs(slides)), null, 4));
}
