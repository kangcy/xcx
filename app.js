//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    /*wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        //登录态过期
        wx.login() //重新登录
      }
    })*/

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        /*if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://test.com/onLogin',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }*/
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        // 判断是否授权获取用户信息
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    token: "",
    toast: {
      show: false,
      msg: ""
    },
    error: {
      show: false,
      msg: ""
    },
    bank: [
      { Id: 1, Name: "北京", Icon: "images/bank/北京.png" },
      { Id: 2, Name: "工商", Icon: "images/bank/工行.png" },
      { Id: 3, Name: "光大", Icon: "images/bank/光大.png" },
      { Id: 4, Name: "广发", Icon: "images/bank/广发.png" },
      { Id: 5, Name: "建设", Icon: "images/bank/建设.png" },
      { Id: 6, Name: "民生", Icon: "images/bank/民生.png" },
      { Id: 7, Name: "农业", Icon: "images/bank/农行.png" },
      { Id: 8, Name: "浦发", Icon: "images/bank/浦发.png" },
      { Id: 9, Name: "上海", Icon: "images/bank/上海.png" },
      { Id: 10, Name: "兴业", Icon: "images/bank/兴业.png" },
      { Id: 11, Name: "邮储", Icon: "images/bank/邮储.png" },
      { Id: 12, Name: "招商", Icon: "images/bank/招商.png" },
      { Id: 13, Name: "中国", Icon: "images/bank/中行.png" },
      { Id: 14, Name: "中信", Icon: "images/bank/中信.png" },
      { Id: 15, Name: "平安", Icon: "images/bank/平安.png" },
      { Id: 16, Name: "南京", Icon: "images/bank/中信.png" }],
    plan: [
      { Id: 1, Name: "餐饮", Icon: "images/plan/1.png" },
      { Id: 2, Name: "购物", Icon: "images/plan/2.png" },
      { Id: 3, Name: "汽车", Icon: "images/plan/3.png" },
      { Id: 4, Name: "奢侈品", Icon: "images/plan/4.png" }]
  }
})