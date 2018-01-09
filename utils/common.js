var util = require('./util.js')

// 接口
const api = [
  {
    "id": 0,
    "name": "用户卡片信息接口",
    "inapi": "http://10.10.141.70:28080/haommoney/UserCardInfo",
    "outapi": "https://api.whalegroup.cn/haomoney/UserCardInfo"
  },
  {
    "id": 1,
    "name": "用户消费接口",
    "inapi": "http://10.10.141.70:28080/haommoney/UserConsume",
    "outapi": "https://api.whalegroup.cn/haomoney/UserConsume"
  },
  {
    "id": 2,
    "name": "用户POS机设置",
    "inapi": "http://10.10.141.70:28080/haommoney/UserPosInfo",
    "outapi": "https://api.whalegroup.cn/haomoney/UserPosInfo"
  },
  {
    "id": 3,
    "name": "用户资金流水接口",
    "inapi": "http://10.10.141.70:28080/haommoney/UserCashTransLog",
    "outapi": "https://api.whalegroup.cn/haomoney/UserCashTransLog"
  },
  {
    "id": 4,
    "name": "系统POS机设置",
    "inapi": "http://10.10.141.70:28080/haommoney/PosInfo",
    "outapi": "https://api.whalegroup.cn/haomoney/PosInfo"
  }
]

// 卡片等级
const level = ['普卡', '金卡', '白金卡', '世界卡']

// 账单日
const billdate = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']

// 收益类型
const profit = ['开卡礼', '积分兑换', '促销羊毛', '理财收益', '股票收益', '其它收益']

const date = new Date()
const years = []
const months = []
const days = []
const hours = []
const minutes = []
const seconds = []
for (let i = 2017; i <= date.getFullYear(); i++) {
  years.push(i)
}
for (let i = 1; i <= 12; i++) {
  months.push(util.formatNumber(i))
}
for (let i = 1; i <= 31; i++) {
  days.push(util.formatNumber(i))
}
for (let i = 1; i < 24; i++) {
  hours.push(util.formatNumber(i))
}
for (let i = 1; i < 60; i++) {
  minutes.push(util.formatNumber(i))
}
for (let i = 1; i < 60; i++) {
  seconds.push(util.formatNumber(i))
}

const error = {
  show: false,
  msg: ""
}

module.exports = {
  api: api,
  level: level,
  billdate: billdate,
  profit: profit,
  date: [years, months, days, hours, minutes, seconds],
  error: error,
  toast: error
}