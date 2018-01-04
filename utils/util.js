const formatTime = (date, format) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  switch (format) {
    case "yyyyMMddhhmmss":
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
      break;
    case "yyyyMMdd":
      return [year, month, day].map(formatNumber).join('-')
      break;
    default:
      return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
      break;
  }
}

// 格式化数字
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 校验是否数字及范围
const checkNumber = (num, min, max) => {
  if (!num || num == undefined) {
    return false
  }
  if (isNaN(num)) {
    return false
  }
  if (num < min || num > max)
    return false
  return true
}

module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  checkNumber: checkNumber
}
