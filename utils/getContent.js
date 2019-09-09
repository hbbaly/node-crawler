// 获取meta标签

exports.getRegContent = function(html, reg){
  let value = ''
  if (html.match(reg)) value = html.match(reg)[1]
  return value
}