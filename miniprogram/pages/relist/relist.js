const db = wx.cloud.database();
//得到数据库实例
const contestant = db.collection('Contestant')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vote_id: null,
    participantData: null
  },
  onLoad: function (options) {
    this.setData({
      vote_id: options.id
    })
  },
  onShow() {
    contestant.
      field({
        team_name: true,
        team_status: true,
        team_image:true
      })
      .where({
        vote_id: this.data.vote_id,
        team_status:"待审核"
      }).get().then(res => {
        this.setData({
          participantData: res.data,
        })
        console.log(this.data.participantData)
      }).catch(console.error)
  }
})