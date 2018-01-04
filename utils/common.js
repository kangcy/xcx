// 接口
const api = [
  {
    "id": 0,
    "name": "用户卡片信息接口",
    "inapi": "http://10.10.141.70:28080/haommoney/UserCardInfo",
    "outapi": "http://221.6.15.218:280/haommoney/UserCardInfo"
  },
  {
    "id": 1,
    "name": "用户消费接口",
    "inapi": "http://10.10.141.70:28080/haommoney/UserConsume",
    "outapi": "http://221.6.15.218:280/haommoney/UserConsume"
  },
  {
    "id": 2,
    "name": "用户POS机设置",
    "inapi": "http://10.10.141.70:28080/haommoney/UserPosInfo",
    "outapi": "http://221.6.15.218:280/haommoney/UserPosInfo"
  },
  {
    "id": 3,
    "name": "用户资金流水接口",
    "inapi": "http://10.10.141.70:28080/haommoney/UserCashTransLog",
    "outapi": "http://221.6.15.218:280/haommoney/UserCashTransLog"
  }
]

// 卡片等级
const level = ['普卡', '金卡', '白金卡', '世界卡']

// 账单日
const billdate = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']

// 收益类型
const profit = ['开卡礼', '积分兑换', '促销羊毛', '理财收益', '股票收益', '其它收益']

const error = {
  show: false,
  msg: ""
}

module.exports = {
  api: api,
  level: level,
  billdate: billdate,
  profit: profit,
  error: error,
  toast: error
}