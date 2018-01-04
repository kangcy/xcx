//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    card: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.getCard()
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 我的卡片
  getCard: function (e) {
    var card = [{
      "Id": 1, "Bank": 1, "Name": "白金卡", "Price": 1888, "StatementDate": "05", "PaymentDueDay": "01.25", "Remainder": 1354.5
    }, {
      "Id": 2, "Bank": 2, "Name": "金卡", "Price": 1888, "StatementDate": "05", "PaymentDueDay": "01.25", "Remainder": 1354.5
    }, {
      "Id": 3, "Bank": 3, "Name": "普卡", "Price": 1888, "StatementDate": "05", "PaymentDueDay": "01.25", "Remainder": 1354.5
    }]
    card.forEach(x => {
      var result = getApp().globalData.bank.filter(y => { return y.Id === x.Bank });
      x.BankName = result[0].Name;
      x.Icon = "../../" + result[0].Icon;
    })
    this.setData({
      card: card
    })
  },
  // 卡片详细
  showCard: function (e) {
    console.log(JSON.stringify(e.currentTarget.id));
  }
})
