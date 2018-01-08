var util = require('../../utils/util.js')
var common = require('../../utils/common.js')
var bank = require('../../utils/bank.js')
var api = require('../../utils/network.js')
const app = getApp()

Page({
  data: {
    currtab: 0,
    bankName: "", // 银行卡名称
    error: common.error
  },
  onLoad: function () {
    var token = wx.getStorageSync('token') || "";
    if (!token) {
      return this.showError("登录过期")
    }

    var that = this
    wx.showNavigationBarLoading() // 显示导航条加载动画
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
  // 新增储蓄卡
  formSubmit: function (e) {
    var result = e.detail.value
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!result.cardNo) {
      return this.showError("请输入储蓄卡卡号")
    }
    api.request(common.api[0].outapi, {
      action: "add",
      token: wx.getStorageSync('token') || null,
      cardNo: result.cardNo,
      bankName: result.bankName,
      singleTransLimit: result.singleTransLimit,
      dayTransLimit: result.dayTransLimit,
      cardType: "debit"
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          wx.showToast({
            title: '创建成功',
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
