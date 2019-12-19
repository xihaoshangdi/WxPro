//数据库
const db = wx.cloud.database();
const votTable = db.collection('votTable')
const Contestant = db.collection('Contestant')
const voteSet = db.collection('VoteSet')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始化数据
    vote_id: null,
    event: null,
    contestantList: null,
    current: 'homepage',
    //活动页数据
    serial:null,
    check_status: true,
    contestant: null,
    //排名页数据
    rankdata:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      vote_id: options.id
    })
    //获取活动信息
    votTable.doc(options.id).get().then(res => {
      this.setData({
        event: res.data
      })
    }).catch(console.error)
  },
  onShow: function () {
    //获取参赛队信息
    Contestant.where({
      vote_id: this.data.vote_id,
      team_status: "pass"
    }).get().then(res => {
      this.setData({
        contestantList: res.data
      })
      this.getRank()
    }).catch(console.error)
  },
  //报名
  toParticipant() {
    console.log(this.data.event)
    wx.redirectTo({
      url: '../participant/participant?id=' + this.data.event._id
    })
  },
  //
  getSerial(event){
    this.setData({
      serial: event.detail.detail.value
    })
    if (this.data.serial.length!=0){
      const data = this.data.contestantList[this.data.serial - 1];
      this.setData({
        check_status: false,
        contestant: {
          _id: data._id,
          team_name: data.team_name,
          team_image: data.team_image,
          serial:this.data.serial
        }
      })
    }
  },
  //
  getRank(){
    voteSet.
      field({
        poll: true,
        contestant_name:true
      }).where({
        vote_id: this.data.vote_id
      })
      .orderBy('poll', 'desc')
      .get()
      .then(res=>{
        this.setData({
          rankdata:res.data
        })
      })
      .catch(console.error)
  },
  //tabBar
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  }


})