const router = require('koa-router')()
const fs = require('fs')
const schedule = require('node-schedule')
const requestChapter = require('@novel/crawler')
const getContent = require('@utils/getContent')
// const getStat = require('@utils/judePath')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!',
    con: '<h2>hbb</h2>'
  })
})

// 某个书籍章节列表
router.get('/:type/:category', async (ctx, next) => {
  const type = ctx.params.type
  const category = ctx.params.category
  const novelD = `${type}/${category}`
  let content = null
  // 定时任务，每天凌晨获取最新list
  schedule.scheduleJob('0 0 0 * * ?', async() => {
    console.log('The answer to life, the universe, and everything!');
    await requestChapter()
  });
  
  content = await fs.readFileSync('views/'+novelD+'/book.json','utf-8')
  content = content ? JSON.parse(content) : content
  await ctx.render('index', {
    content: content,
    category,
    title: content.title,
    keywords: content.info,
    description: content.info
  })
})

// 某篇文章
router.get('/:type/:category/:chapter', async (ctx, next) => {
  const host = 'https://www.12zw.com/'
  const type = ctx.params.type
  const category = ctx.params.category
  const chapter = ctx.params.chapter
  const novelD = `${type}/${category}`
  
  const request = require('superagent')
  const cheerio = require('cheerio')
  const superagent=require('superagent-charset')(request)
  let content = await new Promise((resolve, reject) => {
    superagent.get(`${host}/${novelD}/${chapter}.html`).charset('gbk').end((err, res) => {
      if (err) {
        // 如果访问失败或者出错，会这行这里
        console.log(`抓取失败 - ${err}`)
      } else {
        const $ = cheerio.load(res)
        let reg = /<div id="content">(.*)<\/div>/
        let contentHtml = res.text
        let content = getContent.getRegContent(contentHtml, reg)
        let title = getContent.getRegContent(contentHtml, /<title>(.*)<\/title>/)
        let keywords = getContent.getRegContent(contentHtml, /<meta name="keywords" content=(.*) \/>/)
        let description = getContent.getRegContent(contentHtml, /<meta name="description" content=(.*) \/>/).replace('笔趣阁', '')
        
        let prev = getContent.getRegContent(contentHtml, /<a href="(\d+).html">上一章<\/a>/)
        let next =getContent.getRegContent(contentHtml, /<a href="(\d+).html">下一章<\/a>/)
        resolve({content, title, keywords, description, prev, next})
      }
    })
  })
  await ctx.render('chapter', {
    content: content.content,
    title: content.title,
    keywords: content.keywords,
    description: content.description,
    prev: content.prev,
    next: content.next,
    type,
    category
  })
})

module.exports = router
