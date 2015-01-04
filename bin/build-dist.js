var fs = require('fs'),
    jsdom = require("jsdom"),
    mkdirp = require('mkdirp').sync,
    serializeDocument = require("jsdom").serializeDocument,
    ROOT = __dirname + '/..',
    DEST = ROOT + '/dist',
    doc = jsdom.env({
      file: ROOT + '/index.html',
      done: processDocument
    }),
    distHTML,
    writeToFile = fs.writeFileSync;

mkdirp(DEST);
mkdirp(DEST + '/lib');
mkdirp(DEST + '/fonts');
// TODO: concat css
mkdirp(DEST + '/slides/slide-0');
mkdirp(DEST + '/slides/slide-1');
mkdirp(DEST + '/slides/slide-2');
mkdirp(DEST + '/slides/slide-3');
mkdirp(DEST + '/slides/slide-4');
mkdirp(DEST + '/slides/slide-5');

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done();
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

function processDocument(err, window) {
  if (err) {
    console.log(err);
    return;
  }

  var document = window.document,
      scripts = document.getElementsByTagName('script'),
      localScripts = Array.prototype.filter.call(scripts, function(el) {
        return isLocal(el);
      }),
      allJS,
      allJSEl;

  localScripts.forEach(function(el) {
    el.parentNode.removeChild(el);
  });

  allJS = localScripts.map(function(el) {
    return getScriptSrc(el);
  }).join('\n');

  allJSEl = document.createElement('script');
  allJSEl.textContent = minifyJS(allJS);

  document.body.appendChild(allJSEl);

  distHTML = serializeDocument(document);

  writeToFile(DEST + '/index.html', distHTML);


  function done() {}

  copyFile(ROOT + '/lib/ss-arrow.png', DEST + '/lib/ss-arrow.png', done);
  copyFile(ROOT + '/fonts/mengnajianchaoganghei.otf', DEST + '/fonts/mengnajianchaoganghei.otf', done);

  // TODO: concat css
  copyFile(ROOT + '/app.css', DEST + '/app.css', done);
  copyFile(ROOT + '/slides/slide-0/slide-0.css', DEST + '/slides/slide-0/slide-0.css', done);
  copyFile(ROOT + '/slides/slide-1/slide-1.css', DEST + '/slides/slide-1/slide-1.css', done);
  copyFile(ROOT + '/slides/slide-2/slide-2.css', DEST + '/slides/slide-2/slide-2.css', done);
  copyFile(ROOT + '/slides/slide-3/slide-3.css', DEST + '/slides/slide-3/slide-3.css', done);
  copyFile(ROOT + '/slides/slide-4/slide-4.css', DEST + '/slides/slide-4/slide-4.css', done);
  copyFile(ROOT + '/slides/slide-5/slide-5.css', DEST + '/slides/slide-5/slide-5.css', done);
  // TODO: copy assets for each slide

  // console.log('html:', distHTML);
}

function minifyJS(js) {
  return js;
}

function isLocal(scriptEl) {
  if (scriptEl.src) {
    if (/^\/\//.test(scriptEl.src)) return false;
    return true;
  }

  if (scriptEl.textContent) return true;

  return false;
}

function getScriptSrc(scriptEl) {
  if (scriptEl.src) {
    return fs.readFileSync(scriptEl.src, 'utf8');
  }

  if (scriptEl.textContent) {
    return scriptEl.textContent;
  }

  return '';
}
