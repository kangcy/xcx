//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    card: [],
    swiper: [],
    currtab: 0,
    scrollHeight: 0,
    showSwiper: false
  },
  onLoad: function () {
    var that = this
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * (250 + 40 + 20 + 36 * 2)
        })
      }
    })
    this.getSwiper()
    this.getCard()
    this.setData({
      showSwiper: true,
      swiper: that.data.swiper,
      card: that.data.card
    })
  },
  // 微信分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      imageUrl: '',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 我的卡片
  getCard: function (e) {
    this.data.card = [{
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
    this.data.card.forEach(x => {
      var result = app.globalData.bank.filter(y => { return y.Id === x.Bank });
      x.BankName = result[0].Name;
      x.Icon = "../../" + result[0].Icon;
    })
  },
  // 我的卡片
  getSwiper: function (e) {
    this.data.swiper = [{
      Id: 1, Name: "今日计划", Price: 1888, Num: 1, CardNum: 1, Link: ""
    }, {
      Id: 2, Name: "明日计划", Price: 2888, Num: 2, CardNum: 2, Link: ""
    }, {
      Id: 3, Name: "后日计划", Price: 3888, Num: 3, CardNum: 3, Link: ""
    }]
  },
  // 卡片详细
  showCard: function (e) {
    wx.navigateTo({
      url: "../billdetail/billdetail?key=" + e.currentTarget.dataset.hi
    })
  },
  // 切换标签
  changeTab: function (e) {
    this.setData({
      currtab: parseInt(e.currentTarget.dataset.hi)
    })
  },
  // 计划、账单、费用切换
  swiperChange: function (e) {
    this.setData({
      currtab: e.detail.current
    })
  }
})
