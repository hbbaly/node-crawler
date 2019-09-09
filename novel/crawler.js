const request = require('superagent')
const cheerio = require('cheerio')
const superagent=require('superagent-charset')(request)
// const helpers = require('./helpers')
const host = 'https://www.12zw.com/'
const type = 8
const category = 8169
const url = `${host}/${type}/${category}`
superagent.get(url).charset('gbk').end((err, res) => {
  if (err) {
    // 如果访问失败或者出错，会这行这里
    console.log(`热点新闻抓取失败 - ${err}`)
  } else {
   const $ = cheerio.load(res.text)
    $('#list a').each((index, item) => {
      console.log($(item).text())
    })
  }
});