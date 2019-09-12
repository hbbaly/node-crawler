// https://segmentfault.com登陆模仿

const request = require('superagent')
const cheerio = require('cheerio')
let token = ''
let PHPSESSID = ''
const requestIndex = () => {
  return new Promise((resolve) => {
    request.get('https://segmentfault.com/').end((err, res) => {
      const $ = cheerio.load(res.text)
      let th = res.text.match(/\<script((.|\n)*?)(.*)\<\/script\>/gi)[12]
      console.log(th)
      let str = "var ddosMode = false;"
      th = th.slice(0, th.indexOf(str))
      th = $(th).html()
      let fn = new Function('window',  th+ ';return window.SF.token')
      token = fn({})

      
      let PHPSESSIDREG = /PHPSESSID=(.*); path=\//
      let matchCont = res.headers['set-cookie'][0]
      PHPSESSID = matchCont.match(PHPSESSIDREG)[1]
      // 登陆
      resolve()
    })
  })
}

const login = (PHPSESSID, token) => {
  let header = {
    'accept': '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-length': '47',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'cookie': `PHPSESSID=${PHPSESSID};`,
    'origin': 'https://segmentfault.com',
    'referer': 'https://segmentfault.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest'
  }
  return new Promise(resolve => {

  request.post('https://segmentfault.com/api/user/login').query({"_": token}).set(header).send({
    "remember": 1,
    "username": 13297006713,
    "password": "hb9209122710"
  }).type('form').end((err, res) => {
    console.log(res.status)
    resolve()
  })
})

}

const getNewList = (PHPSESSID, token) => {
  let header = {
    'accept': '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'zh-CN,zh;q=0.9',
    'content-length': '47',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'cookie': `PHPSESSID=${PHPSESSID};`,
    'origin': 'https://segmentfault.com',
    'referer': 'https://segmentfault.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest'
  }
  request.get('https://segmentfault.com/api/user/homepage/description/edit')
  .query({'_': token})
  .set(header)
  .type('form')
  .send({
    description: '努力cod'
  }).end((err, res) => {
    console.log(res.status)
  })
}
requestIndex().then(res => {
  console.log(PHPSESSID, token, '==========')
  login(PHPSESSID, token).then(res1 => {
    console.log(PHPSESSID, token, '=====2222222222=====')
    getNewList(PHPSESSID, token)
  })
})
