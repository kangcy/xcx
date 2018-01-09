var util = require('../../utils/util.js')
var common = require('../../utils/common.js')
var bank = require('../../utils/bank.js')
var api = require('../../utils/network.js')
const app = getApp()
const date = new Date()
Page({
  data: {
    currBill: {},
    posArray: [],
    creditCardArray: [], // 信用卡列表
    debitCardArray: [], // 储蓄卡列表
    merchantArray: [{ Id: 1, Name: '服装' }, { Id: 2, Name: '餐饮' }],
    currCard: 0, // 当前信用卡
    currMerchant: 0, // 当前商户类型
    isRealAccount: false, // 是否真实消费
    isCash: false, // 是否刷卡套现
    isPosUsed: false, // 是否使用POS机
    consumptionScene: [{ Name: '套现', Value: 'simulate', Checked: 'true' }, { Name: '真实消费', Value: 'real' }], // 消费场景
    error: common.error,
    // 日期控件
    years: common.date[0],
    months: common.date[1],
    days: common.date[2],
    hours: common.date[3],
    minutes: common.date[4],
    seconds: common.date[5],
    year: date.getFullYear(),
    month: util.formatNumber(date.getMonth() + 1),
    day: util.formatNumber(date.getDate()),
    hour: util.formatNumber(date.getHours()),
    minute: util.formatNumber(date.getMinutes()),
    second: util.formatNumber(date.getSeconds()),
    dissipateDate: [date.getFullYear(), date.getMonth(), date.getDate() - 1, date.getHours() - 1, date.getMinutes() - 1, date.getSeconds() - 1],
    isDatePickerVisible: false // 时间选择控件
  },
  onLoad: function () {
    var token = wx.getStorageSync('token') || "";
    if (!token) {
      return this.showError("登录过期")
    }

    var that = this
    wx.showNavigationBarLoading() // 显示导航条加载动画
    this.initPos(that)
    this.initCard(that)
    wx.hideNavigationBarLoading() // 隐藏导航条加载动画
  },
  // POS机列表
  initPos: function (that) {
    api.request(common.api[2].outapi, {
      action: "get",
      token: wx.getStorageSync("token")
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          if (res.data.dataObj) {
            that.setData({
              posArray: res.data.dataObj,
              ["currBill.posId"]: res.data.dataObj[0].id,
              ["currBill.posName"]: res.data.dataObj[0].posName
            })
          }
        }
      }
    }, function (res) { })
  },
  // 卡片列表
  initCard: function (that) {
    api.request(common.api[0].outapi, {
      action: "get",
      token: wx.getStorageSync("token") || null,
      cardNo: "",
      bankName: ""
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          if (res.data.dataObj) {
            var credit = res.data.dataObj.filter(x => {
              return x.cardType === "credit"
            })
            that.setData({
              creditCardArray: credit,
              ["currBill.cardNo"]: credit[0].cardNo,
              ["currBill.bankName"]: credit[0].bankName
            })
          }
        }
      }
    }, function (res) { })
  },
  // 选中切换
  bindSelectChange: function (e) {
    var name = e.currentTarget.dataset.name;
    switch (name) {
      // POS机
      case "posId":
        this.setData({
          ["currBill.posId"]: this.data.posArray[e.detail.value].id,
          ["currBill.posName"]: this.data.posArray[e.detail.value].posName
        })
        break;
      // 信用卡
      case "cardNo":
        this.setData({
          ["currBill.cardNo"]: this.data.creditCardArray[0].cardNo,
          ["currBill.bankName"]: this.data.creditCardArray[0].bankName
        })
        break;
      // 商户类型
      case "currMerchant":
        this.setData({
          currMerchant: e.detail.value
        })
        break;
      // 是否有积分
      case "hasIntegral":
        this.setData({
          ["currBill.hasIntegral"]: e.detail.value ? 1 : 0
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
  bindDateChange: function (e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]],
      hour: this.data.hours[val[3]],
      minute: this.data.minutes[val[4]],
      second: this.data.seconds[val[5]]
    })
  },
  // 切换时间选择控件
  toggleDatePicker: function (e) {
    this.setData({
      isDatePickerVisible: parseInt(e.currentTarget.dataset.show) == 0 ? false : true
    })
  },
  // 新增账单
  formSubmit: function (e) {
    var token = wx.getStorageSync('token') || "";
    if (!token) {
      return this.showError("登录过期")
    }
    var result = e.detail.value;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!result.posId) {
      return this.showError("请选择POS机")
    }
    if (!result.cardNo) {
      return this.showError("请选择信用卡")
    }
    if (!result.merchantId) {
      return this.showError("请输入商户名称")
    }
    if (!util.checkNumber(result.amount, 0, 1000000)) {
      return this.showError("请输入正确的消费金额")
    }
    api.request(common.api[1].outapi, {
      action: "add",
      token: wx.getStorageSync('token') || null,
      cardNo: result.cardNo,
      bankName: result.bankName,
      posId: result.posId,
      merchantId: result.merchantId,
      merchantClassify: result.merchantClassify,
      amount: result.amount,
      scene: result.scene,
      hasIntegral: result.hasIntegral
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
