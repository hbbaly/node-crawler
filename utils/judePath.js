// 判断文件是否存在
const fs = require('fs')
const getStat = (path) => {
  return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
          if(err){
              resolve(false);
          }else{
              resolve(stats);
          }
      })
  })
}
module.exports = getStat