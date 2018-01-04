var util = require('../../utils/util.js')
var common = require('../../utils/common.js')
var bank = require('../../utils/bank.js')
const app = getApp()
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
Page({
  data: {
    currtab: 0,
    showSwiper: false,
    billDateArray: common.billdate,
    levelArray: common.level,
    profitArray: common.profit,
    posArray: [{ Id: 1, Name: 'POS机1' }, { Id: 2, Name: 'POS机2' }],
    cardArray: [{ Id: 1, Name: '信用卡1', CardNo: '1234' }, { Id: 2, Name: '信用卡2', CardNo: '1234' }],
    depositCardArray: [{ Id: 1, Name: '储蓄卡1', CardNo: '1234' }, { Id: 2, Name: '储蓄卡2', CardNo: '1234' }],
    merchantArray: [{ Id: 1, Name: '服装' }, { Id: 2, Name: '餐饮' }],
    bankName: "", // 信用卡号
    bankName1: "", // 储蓄卡号
    validiteDate: "", // 卡片有效期
    quotaDate: "", // 临时额度到期日
    repaymentDate: "", // 本期还款日
    currBillDate: 0, // 当前账单日
    currLevel: 0, // 当前卡片等级
    currCard: 0, // 当前信用卡
    currDepositCard: 0, // 当前储蓄卡
    currPos: 0, // 当前pos机
    currProfit: 0, //当前收益类型
    currMerchant: 0, // 当前商户类型
    isFixedAccount: false, // 是否固定账单日
    isRealAccount: false, // 是否真实消费
    isCash: false, // 是否刷卡套现
    isPosUsed: false, // 是否使用POS机
    hasIntegral: false, // 是否有积分
    consumptionScene: [{ Name: '套现', Value: 'simulate', Checked: 'true' }, { Name: '真实消费', Value: 'real' }], // 消费场景
    error: common.error,
    // 数组中保存的可选日期
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    // 默认的顶部日期
    year: date.getFullYear(),
    month: util.formatNumber(date.getMonth() + 1),
    day: util.formatNumber(date.getDate()),
    hour: util.formatNumber(date.getHours()),
    minute: util.formatNumber(date.getMinutes()),
    second: util.formatNumber(date.getSeconds()),
    // 消费时间
    // dissipateDate: util.formatTime(new Date, "yyyyMMdd"), // 消费时间
    dissipateDate: [date.getFullYear(), date.getMonth(), date.getDate() - 1, date.getHours() - 1, date.getMinutes() - 1, date.getSeconds() - 1],
    isDatePickerVisible: false // 时间选择控件
  },
  onLoad: function () {
    var that = this
    wx.showNavigationBarLoading() // 显示导航条加载动画

    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          // 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * (80)
        })
      }
    })
    this.initPos()
    this.initCard()
    this.setData({
      showSwiper: true
    })

    app.globalData.toast = { show: true, msg: "操作成功" }

    setTimeout => { }

    wx.hideNavigationBarLoading() // 隐藏导航条加载动画
  },
  initPos: function () {

  },
  initCard: function () {

  },
  // 切换标签
  changeTab: function (e) {
    this.setData({
      currtab: parseInt(e.currentTarget.dataset.index)
    })
  },
  // 计划、账单、费用切换
  swiperChange: function (e) {
    this.setData({
      currtab: parseInt(e.detail.current)
    })
  },
  // 自动获取卡片名称
  bindBankName: function (e) {
    var name = e.currentTarget.dataset.name;
    var cardNo = e.detail.value.toString();
    var index = -1;
    if (isNaN(cardNo) || cardNo.length < 16 || cardNo.length > 19) {
      this.changeBankName(name, "");
      return;
    }
    // 6位Bin号  
    var cardbin_6 = cardNo.substring(0, 6);
    for (var i = 0; i < bank.bankbin.length; i++) {
      if (cardbin_6 == bank.bankbin[i]) {
        index = i;
      }
    }
    if (index != -1) {
      this.changeBankName(name, bank.bankname[index]);
      return;
    }
    // 8位Bin号  
    var cardbin_8 = cardNo.substring(0, 8);
    for (var i = 0; i < bank.bankbin.length; i++) {
      if (cardbin_8 == bank.bankbin[i]) {
        index = i;
      }
    }
    if (index != -1) {
      this.changeBankName(name, bank.bankname[index]);
      return;
    }
    this.changeBankName(name, "");
  },
  // 自动填充银行
  changeBankName(fieldname, name) {
    switch (fieldname) {
      case "bankName":
        this.setData({
          bankName: name
        })
        break;
      case "bankName1":
        this.setData({
          bankName1: name
        })
        break;
      default:
        break;
    }
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
      // POS机
      case "currPos":
        this.setData({
          currPos: e.detail.value
        })
        break;
      // 信用卡
      case "currCard":
        this.setData({
          currCard: e.detail.value
        })
        break;
      // 储蓄卡
      case "currDepositCard":
        this.setData({
          currDepositCard: e.detail.value
        })
        break;
      // 商户类型
      case "currMerchant":
        this.setData({
          currMerchant: e.detail.value
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
      // 是否使用POS机
      case "isPosUsed":
        this.setData({
          isPosUsed: e.detail.value
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
      // POS机
      case "currPos":
        this.setData({
          currPos: e.detail.value
        })
        break;
      // 信用卡
      case "currCard":
        this.setData({
          currCard: e.detail.value
        })
        break;
      // 是否有积分
      case "hasIntegral":
        this.setData({
          hasIntegral: e.detail.value
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
    console.log(JSON.stringify(val))
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
  // 新增信用卡
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    //获取远程数据
    /*wx.request({
      url: 'https://raw.githubusercontent.com/jiangzy27/how_to_react/master/score.json',
      header: {
        "Content-Type": "application/json"
      },
      data: {},
      success: function (res) {
        that.setData({ removeData: res.data.data });
      },
    })*/
  },
  // 新增账单
  formSubmit2: function (e) {
    var token = wx.getStorageSync('token') || "";
    if (!token) {
      return this.showError("登录过期")
    }
    var result = e.detail.value;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!result.merchantId) {
      return this.showError("请输入商户名称")
    }
    if (!util.checkNumber(result.amount, 0, 1000000)) {
      return this.showError("请输入正确的消费金额")
    }
    wx.request({
      url: common.api[1].outapi,
      header: {
        "Content-Type": "application/json"
      },
      data: {
        action: "add",
        token: token,
        cardNo: result.cardNo,
        bankName: result.bankName,
        posId: result.posId,
        merchantId: result.merchantId,
        merchantClassify: result.merchantClassify,
        amount: result.amount,
        scene: result.scene,
        hasIntegral: result.hasIntegral
      },
      success: function (res) {
        if (res.success) {
          if (res.data.result === 1) {

          }
        }
      },
    })
  },
  // 新增POS
  formSubmit4: function (e) {
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
    return
    wx.request({
      url: common.api[2].outapi,
      header: {
        "Content-Type": "application/json"
      },
      data: {
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
      },
      success: function (res) {
        if (res.success) {
          if (res.data.result === 1) {

          }
        }
      },
    })
  }
})
