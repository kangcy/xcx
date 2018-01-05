function request(url, params, success, fail) {
  this.requestLoading(url, params, "", success, fail)
}
function requestLoading(url, params, message, success, fail) {
  wx.showNavigationBarLoading()
  if (message) {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    data: params,
    header: {
      'Content-Type': 'application/json'
      //'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      wx.hideNavigationBarLoading()
      if (message) {
        wx.hideLoading()
      }
      success(res)
    },
    fail: function (res) {
      wx.hideNavigationBarLoading()
      if (message) {
        wx.hideLoading()
      }
      fail(res)
    },
    complete: function (res) {

    },
  })
}
module.exports = {
  request: request,
  requestLoading: requestLoading,
}