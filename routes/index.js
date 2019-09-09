const router = require('koa-router')()
const fs = require('fs')

const getContent = require('@utils/getContent')
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
  
  const Crawler = require('crawler')

  const c = new Crawler({
    maxConnections : 100,
    forceUTF8:true,
  });
  let content = await new Promise((resolve, reject) => {
    c.queue([{
      uri: `${host}/${novelD}/${chapter}.html`,
      forceUTF8: true,
      callback: async function (error, res, done) {
        const $ = res.$
        let reg = /<div id="content">(.*)<\/div>/
        let contentHtml = res.body
        let content = getContent.getRegContent(contentHtml, reg)
        let title = getContent.getRegContent(contentHtml, /<title>(.*)<\/title>/)
        let keywords = getContent.getRegContent(contentHtml, /<meta name="keywords" content=(.*) \/>/)
        let description = getContent.getRegContent(contentHtml, /<meta name="description" content=(.*) \/>/).replace('笔趣阁', '')
        
        let prev = getContent.getRegContent(contentHtml, /<a href="(\d+).html">上一章<\/a>/)
        let next =getContent.getRegContent(contentHtml, /<a href="(\d+).html">下一章<\/a>/)
        resolve({content, title, keywords, description, prev, next})
      }
    }]);
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
