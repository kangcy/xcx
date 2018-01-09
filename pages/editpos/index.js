var util = require('../../utils/util.js')
var common = require('../../utils/common.js')
var bank = require('../../utils/bank.js')
var api = require('../../utils/network.js')
const app = getApp()

Page({
  data: {
    posid: 0,
    currPos: {},
    systemPosArray: [],
    debitCardArray: [], // 储蓄卡列表
    currDepositCard: 0, // 当前储蓄卡
    isPosUsed: false, // 是否使用POS机
    error: common.error
  },
  onLoad: function (option) {
    this.data.posid = option.key
    wx.setNavigationBarTitle({
      title: this.data.posid ? "编辑POS机" : "新增POS机"
    })
    var token = wx.getStorageSync('token') || "";
    if (!token) {
      return this.showError("登录过期")
    }
    var that = this
    that.data.posid = '5'
    wx.showNavigationBarLoading()
    this.initCard(this, this.data.posid, function () {
      that.initPos(that, that.data.posid, function (posid) {
        that.initSystemPos(that, that.data.posid)
      })
    })
    wx.hideNavigationBarLoading()
  },
  // 初始化系统POS机列表
  initSystemPos: function (that, posid) {
    api.request(common.api[4].outapi, {
      action: "get",
      token: wx.getStorageSync("token")
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          if (res.data.dataObj) {
            var index = 0;
            var systemposid = res.data.dataObj[0].posId;
            var name = res.data.dataObj[0].posName;
            var system = res.data.dataObj[0];
            res.data.dataObj.forEach((x, i) => {
              if (x.posId === posid) {
                index = i
                systemposid = x.posId
                name = x.posName
                system = x
              }
            })
            // 调用系统模板
            if (!posid) {
              that.data.currPos = system
              that.data.currPos.id = 0
              that.data.currPos.posIdIndex = index
              that.data.currPos.posId = systemposid
              that.data.currPos.systemPosName = name
              that.data.currPos.bindCardNoIndex = 0
              that.data.currPos.bindCardNo = that.data.debitCardArray[0].cardNo
              that.data.currPos.bindCardName = that.data.debitCardArray[0].bankName
              that.setData({
                systemPosArray: res.data.dataObj,
                currPos: that.data.currPos
              })
            } else {
              that.setData({
                systemPosArray: res.data.dataObj,
                ["currPos.posIdIndex"]: index,
                ["currPos.posId"]: systemposid,
                ["currPos.systemPosName"]: name,
              })
            }
          }
        }
      }
    }, function (res) { })
  },
  // 切换系统POS机
  changeSystemPos: function (index) {
    var that = this
    var system = this.data.systemPosArray[index]
    this.data.currPos = system
    this.data.currPos.posIdIndex = index
    this.data.currPos.posId = system.posId
    this.data.currPos.systemPosName = system.posName
    that.data.currPos.bindCardNoIndex = 0
    that.data.currPos.bindCardNo = that.data.debitCardArray[0].cardNo
    that.data.currPos.bindCardName = that.data.debitCardArray[0].bankName
    this.setData({
      currPos: that.data.currPos
    })
  },
  // POS机列表
  initPos: function (that, posid, callback) {
    if (!posid) {
      callback(0)
      return
    }
    api.request(common.api[2].outapi, {
      action: "get",
      token: wx.getStorageSync("token"),
      id: posid
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          if (res.data.dataObj) {
            var item = res.data.dataObj[0]
            var index = 0;
            var name = "";
            that.data.debitCardArray.forEach((x, i) => {
              if (x.cardNo === item.bindCardNo) {
                index = i
                name = x.bankName
              }
            })
            item.bindCardNoIndex = index
            item.bindCardName = name
            that.setData({
              currPos: item
            })
            callback(item.posId)
          }
        }
      }
    }, function (res) { })
  },
  // 卡片列表
  initCard: function (that, posid, callback) {
    api.request(common.api[0].outapi, {
      action: "get",
      token: wx.getStorageSync("token") || null,
      cardNo: "",
      bankName: ""
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          if (res.data.dataObj) {
            var debit = res.data.dataObj.filter(x => {
              return x.cardType === "debit"
            })
            that.setData({
              debitCardArray: debit
            })
            if (!posid) {
              that.setData({
                ["currPos.bindCardNoIndex"]: 0,
                ["currPos.bindCardNo"]: debit[0].cardNo,
                ["currPos.bindCardName"]: debit[0].bankName
              })
            }
            callback()
          }
        }
      }
    }, function (res) { })
  },
  // 选中切换
  bindSelectChange: function (e) {
    var name = e.currentTarget.dataset.name;
    switch (name) {
      // 储蓄卡
      case "bindCardNo":
        this.setData({
          ["currPos.bindCardNo"]: this.data.debitCardArray[e.detail.value].cardNo,
          ["currPos.bindCardName"]: this.data.debitCardArray[e.detail.value].bankName
        })
        break;
      // 是否使用POS机
      case "status":
        this.setData({
          ["currPos.status"]: e.detail.value ? "use" : "delete"
        })
        break;
      // 系统POS机
      case "posId":
        this.changeSystemPos(e.detail.value)
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
  // 新增POS
  formSubmit: function (e) {
    var token = wx.getStorageSync('token') || null;
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
    var that = this
    api.request(common.api[2].outapi, {
      action: that.data.posid ? "set" : "add",
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
    }, function (res) {
      if (res.success) {
        if (res.data.statuecode === 0) {
          wx.showToast({
            title: '编辑成功',
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
