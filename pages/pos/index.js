const app = getApp()
var common = require('../../utils/common.js')
var api = require('../../utils/network.js')
Page({
  data: {
    card: [],
    currtab: 0
  },
  onLoad: function () {
    var that = this
    this.getCard()
    this.initPos(that)
  },
  // 我的卡片
  getCard: function (e) {
    var card = [{
      "Id": 1, "Bank": 1, "Name": "白金卡", "Price": 1888, "StatementDate": "05", "PaymentDueDay": "01.25", "Remainder": 1354.5
    }, {
      "Id": 2, "Bank": 2, "Name": "金卡", "Price": 1888, "StatementDate": "05", "PaymentDueDay": "01.25", "Remainder": 1354.5
    }, {
      "Id": 3, "Bank": 3, "Name": "普卡", "Price": 1888, "StatementDate": "05", "PaymentDueDay": "01.25", "Remainder": 1354.5
    }, {
      "Id": 4, "Bank": 4, "Name": "普卡", "Price": 1888, "StatementDate": "05", "PaymentDueDay": "01.25", "Remainder": 1354.5
    }, {
      "Id": 5, "Bank": 5, "Name": "普卡", "Price": 1888, "StatementDate": "05", "PaymentDueDay": "01.25", "Remainder": 1354.5
    }, {
      "Id": 6, "Bank": 6, "Name": "普卡", "Price": 1888, "StatementDate": "05", "PaymentDueDay": "01.25", "Remainder": 1354.5
    }]
    card.forEach(x => {
      var result = app.globalData.bank.filter(y => { return y.Id === x.Bank });
      x.BankName = result[0].Name;
      x.Icon = "../../" + result[0].Icon;
    })
    this.setData({
      card: card
    })
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
  // 编辑POS机
  showPos: function (e) {
    wx.showActionSheet({
      itemList: ["新增", "编辑"],
      success: function (res) {
        if (res.tapIndex === 0) {
          wx.navigateTo({
            url: "../editpos/index"
          })
        } else {
          wx.navigateTo({
            url: "../editpos/index?key=" + e.currentTarget.dataset.index
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})
