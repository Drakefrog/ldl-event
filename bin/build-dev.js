
var builder = require(__dirname + '/../slide-builder'),
    template = 'index',
    dest = __dirname +  '/../index.html',
    fs = require('fs'),
    html = builder.render(template);

fs.writeFileSync(dest, html);
