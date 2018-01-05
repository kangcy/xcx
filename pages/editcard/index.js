var util = require('../../utils/util.js')
var common = require('../../utils/common.js')
var bank = require('../../utils/bank.js')
var api = require('../../utils/network.js')
const app = getApp()

Page({
  data: {
    currtab: 0,
    billDateArray: common.billdate,
    levelArray: common.level,
    profitArray: common.profit,
    bankName: "", // 银行卡名称
    validiteDate: "", // 卡片有效期
    quotaDate: "", // 临时额度到期日
    repaymentDate: "", // 本期还款日
    currBillDate: 0, // 当前账单日
    currLevel: 0, // 当前卡片等级
    isFixedAccount: false, // 是否固定账单日
    error: common.error
  },
  onLoad: function () {
    var that = this
    wx.showNavigationBarLoading() // 显示导航条加载动画
    var token = wx.getStorageSync("token") || ""
    if (token == "") {
      // token失效,跳转登录
    }
    wx.hideNavigationBarLoading() // 隐藏导航条加载动画
  },
  // 自动获取卡片名称
  bindBankName: function (e) {
    var that = this
    var cardNo = e.detail.value.toString();
    bank.getBankName(cardNo, function (name) {
      that.setData({
        bankName: name
      })
    })
  },
  // 下拉切换
  bindSelectChange: function (e) {
    var name = e.currentTarget.dataset.name;
    switch (name) {
      // 临时额度到期日
      case "quotaDate":
        this.setData({
          quotaDate: e.detail.value
        })
        break;
      // 卡片有效期
      case "validiteDate":
        this.setData({
          validiteDate: e.detail.value
        })
        break;
      // 账单日
      case "currBillDate":
        this.setData({
          currBillDate: e.detail.value
        })
        break;
      // 本期还款日
      case "repaymentDate":
        this.setData({
          repaymentDate: e.detail.value
        })
        break;
      default:
        break;
    }
  },
  // 选中切换
  bindSwitchChange: function (e) {
    var name = e.currentTarget.dataset.name;
    switch (name) {
      // 是否固定账单日
      case "isFixedAccount":
        this.setData({
          isFixedAccount: e.detail.value
        })
        break;
      // 卡片有效期
      case "validiteDate":
        this.setData({
          validiteDate: e.detail.value
        })
        break;
      // 账单日
      case "currBillDate":
        this.setData({
          currBillDate: e.detail.value
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
    api.request(common.api[0].outapi, {
      action: "add",
      token: app.globalData.token,
      cardNo: result.cardNo,
      bankName: result.bankName,
      totalAmount: result.totalAmount,
      fixAmount: result.fixAmount,
      tempAmount: result.tempAmount,
      tempAmountExpireTime: result.tempAmountExpireTime,
      validiteDate: result.validiteDate,
      billDate: result.billDate,
      payDayType: isFixedAccount ? "fix" : "day",
      payDateOrDay: result.payDateOrDay,
      level: result.level,
      yearprice: result.yearprice,
      singleTransLimit: result.singleTransLimit,
      dayTransLimit: result.dayTransLimit,
      cardType: "credit"
    }, function (res) {
      if (res.success) {
        if (res.data.result === 1) {

        }
      }
    }, function (res) { })
  }
})
