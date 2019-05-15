const fs = require('fs');
const path = require('path');
const replace = require('replace');
const WEB_CONFIG_FILE = './web.config';

if (fs.existsSync(path.resolve(WEB_CONFIG_FILE))) {
  replace({
    regex: 'url="index.js"',
    replacement: 'url="lib/index.js"',
    paths: ['./web.config'],
    recursive: false,
    silent: true
  });
}
