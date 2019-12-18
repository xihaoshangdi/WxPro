//获取数据库连接
const db = wx.cloud.database();
//得到数据库实例
const votTable = db.collection('votTable')
Page({
  data: {
    voteList: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow() {
    votTable.
      field({
        title: true,
        imgCloudPath: true,
        endDate: true,
        participant: true
      })
      .where({
        //状态为pass的可以显示
        status: "pass"
      }).get().then(res => {
        this.setData({
          voteList: res.data,
        })
      }).catch(console.error)
  }
})