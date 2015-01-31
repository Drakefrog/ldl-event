var fs = require('fs'),
    path = require('path'),
    jsdom = require("jsdom"),
    CleanCSS = require('clean-css'),
    mkdirp = require('mkdirp').sync,
    serializeDocument = require("jsdom").serializeDocument,

    ROOT = path.resolve(__dirname, '..'),
    DEST = ROOT + '/dist',
    SLIDES_DIR = ROOT + '/slides',
    writeToFile = fs.writeFileSync,
    builder = require('../slide-builder');

mkdirp(DEST);

jsdom.env({
  file: ROOT + '/index.html',
  done: processDocument
});

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

function copyFileList(lst, srcDir, destDir, done, onProgress) {
  var count = 0, nTasks = lst.length;

  lst.forEach(function(file) {
    var relativePath = path.relative(srcDir, file),
        d = path.resolve(destDir, path.dirname(relativePath)),
        target = path.resolve(destDir, relativePath);

    mkdirp(d);
    copyFile(file, target, function() {
      doneOne(relativePath);
    });
  });

  function doneOne(file) {
    count += 1;
    if (typeof onProgress === 'function') {
      onProgress(count, nTasks, file);
    }

    if (count >= nTasks) done(count);
  }
}

function slurp(file) {
  return fs.readFileSync(file, 'utf8');
}

function processJS(document) {
  var scripts = document.getElementsByTagName('script'),
      localScriptEls = Array.prototype.filter.call(scripts, function(el) {
        return isLocalScript(el);
      }),
      allJS,
      allJSEl;

  // Replace all local script tag with single compiled one
  localScriptEls.forEach(function(el) {
    el.parentNode.removeChild(el);
  });

  allJS = localScriptEls.map(function getJSStr(el) {
    if (el.src) {
      return slurp(path.resolve(ROOT, el.src));
    }

    if (el.textContent) {
      return el.textContent;
    }

    return '';
  }).join('\n');

  // console.log("allJS = ", allJS);
  // return;

  allJSEl = document.createElement('script');
  allJSEl.textContent = minifyJS(allJS);

  document.body.appendChild(allJSEl);

  function minifyJS(js) {
    return js;
  }

  function isLocalScript(scriptEl) {
    if (scriptEl.src) {
      if (/^\/\//.test(scriptEl.src)) return false;
      return true;
    }

    if (scriptEl.textContent) return true;

    return false;
  }

}

function toArray(arrayLike) {
  return Array.prototype.slice.call(arrayLike);
}

function processCSS(document) {
  var links = toArray(document.getElementsByTagName('link')),
      // FIXME: it seens inline style does not work in jsdom...
      styles = toArray(document.getElementsByTagName('style')),
      localLinks,
      cssFromLinks,
      cssFromInlineStyles,
      allCSS = '',
      allCSSEl;

  localLinks = links.filter(function isLocalLink(linkEl) {
    if (linkEl.href) {
      if (/^\/\//.test(linkEl.href)) return false;
      return true;
    }

    return false;
  });

  localLinks.forEach(function(el) {
    el.parentNode.removeChild(el);
  });

  styles.forEach(function(el) {
    el.parentNode.removeChild(el);
  });

  cssFromLinks = localLinks.map(function getCSSStr(el) {
    if (el.href) {
      return slurp(path.resolve(ROOT, el.href));
    }

    if (el.textContent) {
      return el.textContent;
    }

    return '';
  }).join('\n');

  cssFromInlineStyles = styles.map(function(el) {
    return el.textContent;
  }).join('\n');

  allCSS += cssFromLinks;
  allCSS += cssFromInlineStyles;

  allCSSEl = document.createElement('style');
  allCSSEl.textContent = minify(allCSS);

  document.head.appendChild(allCSSEl);

  // console.log("allCSS = ", allCSS);
  // console.log("mini = ", minify(allCSS));

  function minify(source) {
    return new CleanCSS().minify(source).styles;
  }
}

function outputHTML(document, dest) {
  var html = serializeDocument(document);
  writeToFile(dest, html);
  console.log("Done writing HTML to " + dest);
}

function copyAssets(src, dest) {
  var slideSrc = path.resolve(src, 'slides'),
      slideDest = path.resolve(dest, 'slides'),
      fontsSrc = path.resolve(src, 'fonts'),
      fontsDest = path.resolve(dest, 'fonts'),
      libSrc = path.resolve(src, 'lib'),
      libDest = path.resolve(dest, 'lib'),
      dataSrc = path.resolve(src, 'data'),
      dataDest = path.resolve(dest, 'data'),

      assets,
      slidePngs = builder.loadSlidesList(slideSrc).map(function(slide) {
        return slide && slide.contents && slide.contents.png || [];
      }).reduce(function(all, cur) {
        cur.forEach(function(item) {
          all.push(item.fullpath);
        });
        return all;
      }, []),
      libPngs = [
        path.resolve(libSrc, 'ss-arrow.gif')
      ],
      fonts = [
        path.resolve(fontsSrc, 'mengnajianchaoganghei.otf')
      ],
      dataFiles = fs.readdirSync(dataSrc).map(function(file) {
        return path.resolve(dataSrc, file);
      });

  assets = slidePngs
    .concat(fonts)
    .concat(libPngs)
    .concat(dataFiles);

  copyFileList(assets, src, dest, function(count) {
    console.log('Done copy ' + count + ' files from ' + src + ' to ' + dest);
  }, function(count, total, file) {
    console.log(count + '/' + total + ': ' + file);
  });
}

function processDocument(err, window) {
  if (err) {
    console.log(err);
    return;
  }

  var document = window.document;

  processJS(document);
  processCSS(document);
  outputHTML(document, DEST + '/index.html');
  copyAssets(ROOT, DEST);
  return;
}
