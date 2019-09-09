const Crawler = require('crawler')
const jsdom = require('jsdom')
const helpers = require('./helpers')
const host = 'https://www.12zw.com/'
const type = 8
const category = 8169
const url = `${host}/${type}/${category}`
const c = new Crawler({
  maxConnections : 100,
  forceUTF8:true,
  callback : function (error, res, done) {
    if(error){
        console.log(error);
    }else{
      const $ = res.$
      const current_book = {}
      // 书籍信息
      current_book.title = $('#info h1').text()
      current_book.img = host + $('#fmimg img').attr('src')
      let author = $('#info p').eq(0).text()
      let update_time = $('#info p').eq(2).text()
      current_book.author = removeSomething(author)
      current_book.last_update = removeSomething(update_time)
      current_book.last_chaper = $('#info p').eq(3).find('a').text()
      current_book.info = $('#intro').text()

      function removeSomething (value) {
        return value && typeof value === 'string' && value.indexOf('：') >= 0 ? value.split('：')[1] : value
      }

      // 生成该数据的目录
      helpers.mkdir(`${type}/${category}`)
      
      // 章节信息
      let chaperArr = $('#list a')
      current_book.chaper = []
      chaperArr.each(function(){
        let url = $(this).attr('href')
        let title = $(this).text()
        current_book.chaper.push({
          url,
          title,
          num: url.replace('.html', '')
        })

        crawlerOne({
          url,
          title,
          num: url.replace('.html', '')
        })
      })
      // 先生成书籍json数据
      helpers.write_config(`${type}/${category}`, current_book)
    }
  }
});

c.queue(url)

function crawlerOne (chapter) {
  c.queue([{
    uri: `${url}/${chapter.num}.html`,
    forceUTF8: true,
    // The global callback won't be called
    callback: function (error, res, done) {
      const $ = res.$
      let reg = /<div id="content">(.*)<\/div>/
      let content = res.body.match(reg)
      console.log(content)
      helpers.write_chapter(`${type}/${category}`, chapter, content)
      process.exit()
    }
  }]);
}