const fs = require('fs')
const debug = require('debug')('crawler')
exports.mkdir = function(folder) {
  const mkdirp = require('mkdirp')
  mkdirp.sync('views/'+folder, function (err) {
    if (err) console.error(err)
    else debug('pow!')
  })
}
exports.write_config = function (pagePath, content) {
  let book = JSON.stringify(content, null, 4)
  fs.writeFileSync('views/'+pagePath+'/book.json',book, function (err) {
    if (err) throw err;
    debug('It\'s saved!');
  });
}
exports.write_chapter = function(pagePath, chapter, content) {
  fs.writeFileSync('views/'+pagePath+'/'+chapter.num+'.html', content, function (err) {
    if (err) throw err;
    debug('It\'s saved!');
  })
}