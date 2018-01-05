var util = require('../../utils/util.js')
var common = require('../../utils/common.js')
var bank = require('../../utils/bank.js')
var api = require('../../utils/network.js')
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
    billDateArray: common.billdate,
    levelArray: common.level,
    profitArray: common.profit,
    posArray: [],
    creditCardArray: [], // 信用卡列表
    debitCardArray: [], // 储蓄卡列表
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
    // 日期控件
    years: years,
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
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
    this.initPos(that)
    this.initCard(that)
    wx.hideNavigationBarLoading() // 隐藏导航条加载动画
  },
  // POS机列表
  initPos: function (that) {
    api.request(common.api[2].outapi, {
      action: "get",
      token: app.globalData.token,
      posId: "",
      posName: ""
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          if (res.data.dataObj) {
            that.setData({
              posArray: res.data.dataObj
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
      token: app.globalData.token,
      cardNo: "",
      bankName: ""
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          if (res.data.dataObj) {
            var credit = res.data.dataObj.filter(x => {
              return x.cardType === "credit"
            })
            var debit = res.data.dataObj.filter(x => {
              return x.cardType === "debit"
            })
            that.setData({
              creditCardArray: credit,
              debitCardArray: debit
            })
          }
        }
      }
    }, function (res) { })
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
  },
  // 新增储蓄卡
  formSubmit1: function (e) {
    var result = e.detail.value
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!result.cardNo) {
      return this.showError("请输入储蓄卡卡号")
    }
    api.request(common.api[0].outapi, {
      action: "add",
      token: app.globalData.token,
      cardNo: result.cardNo,
      bankName: result.bankName,
      singleTransLimit: result.singleTransLimit,
      dayTransLimit: result.dayTransLimit,
      cardType: "debit"
    }, function (res) {
      if (res.success) {
        if (res.data.result === 1) {

        }
      }
    }, function (res) { })
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
    api.request(common.api[1].outapi, {
      action: "add",
      token: app.globalData.token,
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
        if (res.data.result === 1) {

        }
      }
    }, function (res) { })
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
    api.request(common.api[2].outapi, {
      action: "add",
      token: app.globalData.token,
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
