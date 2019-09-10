const request = require('superagent')
const cheerio = require('cheerio')
//用来解决不是utf8摘取到的内容乱码问题
const superagent=require('superagent-charset')(request)
// 公用组件
const helpers = require('./helpers')
const host = 'https://www.12zw.com/'
const type = 8
const category = 8169
const url = `${host}/${type}/${category}`
superagent.get(url).charset('gbk').end((err, res) => {
  if (err) {
    // 如果访问失败或者出错，会这行这里
    console.log(`抓取失败 - ${err}`)
  } else {
    helpers.mkdir(`${type}/${category}`)
    const $ = cheerio.load(res.text)
    let current_book = {}
    current_book.chapter = []
    // title
    current_book.title = $('#info h1').text()
    current_book.author = $('#info p').eq(0).text().split('：')[1]
    current_book.last_update = $('#info p').eq(2).text().split('：')[1]
    current_book.last_chapter = $('#info p').eq(3).text().split('：')[1]
    current_book.intro = $('#intro').html()
    // 章节
    $('#list a').each((index, item) => {
      let title = $(item).text()
      let num = $(item).attr('href').replace('.html', '')
      let href = $(item).attr('href')
      current_book.chapter.push({
        title,
        num,
        href
      })
    })
    helpers.write_config(`${type}/${category}`, current_book)
  }
});
