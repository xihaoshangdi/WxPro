
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  openCreat() {
    wx.navigateTo({
      url: '../investigation/investigation',
    })
  },
  openSign() {
    wx.navigateTo({
      url: '../drafts/drafts',
    })
  },
  openVote() {
    wx.navigateTo({
      url: '../drafts/drafts',
    })
  }

})