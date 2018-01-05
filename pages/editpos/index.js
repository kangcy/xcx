var util = require('../../utils/util.js')
var common = require('../../utils/common.js')
var bank = require('../../utils/bank.js')
var api = require('../../utils/network.js')
const app = getApp()

Page({
  data: {
    currtab: 0,
    debitCardArray: [], // 储蓄卡列表
    bankName1: "", // 储蓄卡号
    currDepositCard: 0, // 当前储蓄卡
    isPosUsed: false, // 是否使用POS机
    error: common.error
  },
  onLoad: function () {
    var that = this
    wx.showNavigationBarLoading() // 显示导航条加载动画
    this.initCard(that)
    wx.hideNavigationBarLoading() // 隐藏导航条加载动画
  },
  // 卡片列表
  initCard: function (that) {
    api.request(common.api[0].outapi, {
      action: "get",
      token: app.globalData.token,
      cardNo: "",
      bankName: ""
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          if (res.data.dataObj) {
            var debit = res.data.dataObj.filter(x => {
              return x.cardType === "debit"
            })
            that.setData({
              debitCardArray: debit
            })
          }
        }
      }
    }, function (res) { })
  },
  // 下拉切换
  bindSelectChange: function (e) {
    var name = e.currentTarget.dataset.name;
    switch (name) {
      // 储蓄卡
      case "currDepositCard":
        this.setData({
          currDepositCard: e.detail.value
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
      // 是否使用POS机
      case "isPosUsed":
        this.setData({
          isPosUsed: e.detail.value
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
  // 新增POS
  formSubmit: function (e) {
    var token = wx.getStorageSync('token') || "";
    if (!token) {
      return this.showError("登录过期")
    }
    var result = e.detail.value;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!result.posId) {
      return this.showError("请输入POS机名称")
    }
    if (!util.checkNumber(result.cardRate, 0, 1)) {
      return this.showError("请输入正确的刷卡费率")
    }
    if (!util.checkNumber(result.flashRate, 0, 1)) {
      return this.showError("请输入正确的闪付费率")
    }
    if (!util.checkNumber(result.t0Rate, 0, 1)) {
      return this.showError("请输入正确的T0费率")
    }
    if (!util.checkNumber(result.t1Rate, 0, 1)) {
      return this.showError("请输入正确的T1费率")
    }
    if (!util.checkNumber(result.redeemRate, 0, 1)) {
      return this.showError("请输入正确的当日赎回费率")
    }
    if (!util.checkNumber(result.redeemFee, 0, 500)) {
      return this.showError("请输入正确的当日赎回费用")
    }
    api.request(common.api[2].outapi, {
      action: "add",
      token: token,
      posId: result.posId,
      cardRate: result.cardRate,
      flashRate: result.flashRate,
      t0Rate: result.t0Rate,
      t1Rate: result.t1Rate,
      redeemRate: result.redeemRate,
      redeemFee: result.redeemFee,
      bindCardNo: result.bindCardNo,
      status: result.status ? "use" : "delete"
    }, function (res) {
      if (res.success) {
        if (res.data.result === 1) {

        }
      }
    }, function (res) { })
  }
})
