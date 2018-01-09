var util = require('../../utils/util.js')
var common = require('../../utils/common.js')
var bank = require('../../utils/bank.js')
var api = require('../../utils/network.js')
const app = getApp()

Page({
  data: {
    cardid: 0,
    currCard: { billDayIndex: 0, billDay: common.billdate[0], payDateOrDayIndex: 0, payDateOrDay: common.billdate[0], cardLevelIndex: 0, cardLevel: common.level[0] },
    billDateArray: common.billdate,
    levelArray: common.level,
    profitArray: common.profit,
    error: common.error
  },
  onLoad: function (option) {
    this.data.cardid = option.key
    wx.setNavigationBarTitle({
      title: this.data.cardid ? "编辑信用卡" : "新增信用卡"
    })

    var token = wx.getStorageSync('token') || "";
    if (!token) {
      return this.showError("登录过期")
    }
    wx.showNavigationBarLoading()
    //this.data.cardid = '6225880252246930'
    this.initCard(this, this.data.cardid)
    wx.hideNavigationBarLoading()
  },
  initCard: function (that, cardno) {
    if (!cardno) {
      return
    }
    api.request(common.api[0].outapi, {
      action: "get",
      token: wx.getStorageSync("token") || null,
      cardNo: cardno,
      bankName: ""
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          if (res.data.dataObj) {
            var item = res.data.dataObj[0]
            item.Icon = bank.getBankIcon(item.bankName)
            item.cardLevelIndex = util.getIndex(that.data.levelArray, item.cardLevel)
            item.billDayIndex = util.getIndex(that.data.billDateArray, item.billDay)
            item.payDateOrDayIndex = util.getIndex(that.data.billDateArray, item.payDateOrDay)
            that.setData({
              currCard: item
            })
          }
        }
      }
    }, function (res) { })
  },
  // 自动获取卡片名称
  bindBankName: function (e) {
    var that = this
    var cardNo = e.detail.value.toString();
    bank.getBankName(cardNo, function (name) {
      that.setData({
        ["currCard.bankName"]: name
      })
    })
  },
  // 选择切换
  bindSelectChange: function (e) {
    var name = e.currentTarget.dataset.name;
    switch (name) {
      // 临时额度到期日
      case "tempAmountExpireTime":
        this.setData({
          ["currCard.tempAmountExpireTime"]: e.detail.value
        })
        break;
      // 卡片有效期
      case "validDate":
        this.setData({
          ["currCard.validDate"]: e.detail.value
        })
        break;
      // 账单日
      case "billDay":
        this.setData({
          ["currCard.billDay"]: this.data.billDateArray[e.detail.value]
        })
        break;
      // 到期日
      case "payDateOrDay":
        this.setData({
          ["currCard.payDateOrDay"]: this.data.billDateArray[e.detail.value]
        })
        break;
      // 卡片等级
      case "cardLevel":
        this.setData({
          ["currCard.cardLevel"]: e.detail.value
        })
        break;
      // 是否固定账单日
      case "payDayType":
        this.setData({
          ["currCard.payDayType"]: e.detail.value ? "fix" : "day"
        })
        break;
      default:
        break;
    }
  },
  showError: function (msg) {
    this.setData({
      error: { show: true, msg: msg }
    })
    setTimeout(x => {
      this.hideError()
    }, 2500)
  },
  hideError: function () {
    this.setData({
      error: { show: false, msg: "" }
    })
  },
  // 新增信用卡
  formSubmit: function (e) {
    var result = e.detail.value
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    return;
    if (!result.cardNo) {
      return this.showError("请输入信用卡卡号")
    }
    if (!util.checkNumber(result.totalAmount, 0, 1000000)) {
      return this.showError("请输入当前剩余可用额度")
    }
    if (!util.checkNumber(result.fixAmount, 0, 1000000)) {
      return this.showError("请输入固定额度")
    }
    if (result.tempAmount) {
      if (!util.checkNumber(result.tempAmount, 0, 100000)) {
        return this.showError("请输入正确的临时额度")
      }
      if (!result.tempAmountExpireTime) {
        return this.showError("请设置临时额度到期日")
      }
    }
    if (!result.validiteDate) {
      return this.showError("请设置卡片有效期")
    }
    var that = this
    api.request(common.api[0].outapi, {
      action: that.data.cardid ? "set" : "add",
      token: wx.getStorageSync('token') || null,
      cardNo: result.cardNo,
      bankName: result.bankName,
      totalAmount: result.totalAmount,
      fixAmount: result.fixAmount,
      tempAmount: result.tempAmount,
      tempAmountExpireTime: result.tempAmountExpireTime,
      validiteDate: result.validiteDate,
      billDate: result.billDate,
      payDayType: result.payDayType ? "fix" : "day",
      payDateOrDay: result.payDateOrDay,
      cardLevel: result.level,
      yearprice: result.yearprice,
      singleTransLimit: result.singleTransLimit,
      dayTransLimit: result.dayTransLimit,
      cardType: "credit"
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          wx.showToast({
            title: '编辑成功',
            icon: 'success',
            duration: 2000,
            complete: function () {
              wx.navigateBack()
            }
          })
        }
      } else {
        this.showError(res.data.message)
      }
    }, function (res) { })
  }
})
