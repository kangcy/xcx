const app = getApp()
var common = require('../../utils/common.js')
var api = require('../../utils/network.js')
Page({
  data: {
    pos: [],
    token: null
  },
  onLoad: function () {
    this.data.token = wx.getStorageSync('token') || "";
    if (!this.data.token) {
      return this.showError("登录过期")
    }
    var that = this
    wx.showNavigationBarLoading()
    this.initPos(this)
    wx.hideNavigationBarLoading()
  },
  // POS机列表
  initPos: function (that) {
    api.request(common.api[2].outapi, {
      action: "get",
      token: that.data.token
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          if (res.data.dataObj) {
            that.setData({
              pos: res.data.dataObj
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
