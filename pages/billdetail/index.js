//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    cardid: 0,
    card: {},
    swiper: [],
    plan: [], // 计划
    currtab: 0,
    scrollHeight: 0
  },
  onLoad: function (option) {
    this.data.cardid = option.key
    wx.setNavigationBarTitle({
      title: "信用卡详细" + this.data.cardid
    })
    var that = this
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        // 计算主体部分高度,单位为px
        that.setData({
          // 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * (240 + 10 + 36 * 2 + 40 + 30)
        })
      }
    })
    this.getCard()
    this.initPlan()
  },
  // 我的卡片
  getCard: function () {
    var card = { "Id": 1, "Bank": 1, "Name": "白金卡", "Price": 1888, "StatementDate": "05", "PaymentDueDay": "01.25", "Remainder": 1354.5 }
    var result = app.globalData.bank.filter(x => { return x.Id === card.Bank });
    card.BankName = result[0].Name;
    card.Icon = "../../" + result[0].Icon;
    this.setData({
      card: card
    })
  },
  initPlan: function () {
    var plan = [{ "Id": 1, "Plan": 1, "Price": 1888 }, { "Id": 2, "Plan": 2, "Price": 2888 }, { "Id": 3, "Plan": 3, "Price": 4888 }, { "Id": 4, "Plan": 4, "Price": 4888 }, { "Id": 5, "Plan": 1, "Price": 1888 }, { "Id": 6, "Plan": 2, "Price": 2888 }, { "Id": 7, "Plan": 3, "Price": 4888 }, { "Id": 8, "Plan": 4, "Price": 4888 }]

    plan.forEach(x => {
      var result = app.globalData.plan.filter(y => { return y.Id === x.Plan });
      x.PlanName = result[0].Name;
      x.Icon = "../../" + result[0].Icon;
    })
    this.setData({
      plan: plan
    })
  },
  // 切换标签
  changeTab: function (e) {
    this.setData({
      currtab: parseInt(e.currentTarget.dataset.index)
    })
  }
})
