var util = require('../../utils/util.js')
var bank = require('../../utils/bank.js')
var common = require('../../utils/common.js')
var api = require('../../utils/network.js')
const app = getApp()

Page({
  data: {
    card: [],
    scrollHeight: 0
  },
  onLoad: function () {
    var token = wx.getStorageSync('token') || "";
    if (!token) {
      return this.showError("登录过期")
    }

    var that = this
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        // console.log(res);
        // 可使用窗口宽度、高度
        // 计算主体部分高度,单位为px
        that.setData({
          // 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          scrollHeight: res.windowHeight - res.windowWidth / 750 * (36 * 2 + 20 + 10)
        })
      }
    })
    this.initCard(that)
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
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
            res.data.dataObj.forEach(x => {
              x.Icon = bank.getBankIcon(x.bankName)
            })
            that.setData({
              card: res.data.dataObj
            })
          }
        }
      }
    }, function (res) { })
  },
  // 编辑卡片
  showCard: function (e) {
    wx.showActionSheet({
      itemList: ["新增", "查看", "编辑"],
      success: function (res) {
        if (res.tapIndex === 0) {
          wx.showActionSheet({
            itemList: ["信用卡", "储蓄卡"],
            success: function (res) {
              if (res.tapIndex === 0) {
                wx.navigateTo({
                  url: "../editcard/index"
                })
              } else {
                wx.navigateTo({
                  url: "../editdebit/index"
                })
              }
            },
            fail: function (res) {
              console.log(res.errMsg)
            }
          })
        } else if (res.tapIndex === 1) {
          wx.navigateTo({
            url: "../billdetail/index?key=" + e.currentTarget.dataset.index
          })
        } else if (res.tapIndex === 2) {
          if (e.currentTarget.dataset.type == "credit") {
            wx.navigateTo({
              url: "../editcard/index?key=" + e.currentTarget.dataset.index
            })
          } else {
            wx.navigateTo({
              url: "../editdebit/index?key=" + e.currentTarget.dataset.index
            })
          }
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
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
