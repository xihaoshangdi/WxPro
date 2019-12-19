// pages/contestant/contestant.js
import Toast from '../../vant-dist/toast/toast'
const db = wx.cloud.database();
const votTable = db.collection('votTable')
const contestant = db.collection('Contestant')
const voteSet = db.collection('VoteSet')
const countTable = db.collection('CountTable')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contestant_id: null,
    // vote-poll表ID
    vote_poll: null,

    serial: null,
    contestant: null,

    voteCount: null,
    sendCount: 1,

    poll: null,
    rank: null,

    status: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      contestant_id: options.id,
      serial: options.serial
    })
    //获取每日可投票次数
    votTable.
      field({
        voteCount: true
      })
      .get()
      .then(res => {
        this.setData({
          voteCount: res.data[0].voteCount
        })
      })
      .catch(console.error)
    //获取参赛者信息
    this.getContestMsg();
  },

  getContestMsg() {
    contestant.doc(this.data.contestant_id).get().then(res => {
      this.setData({
        contestant: res.data
      })
      //获取参赛者票数和名次
      this.getPollMsg();
      //获取名次
      this.getRankMsg();
    }).catch(console.error)
  },
  //
  getPollMsg() {
    voteSet.
      where({
        contestant_id: this.data.contestant_id
      }).get().then(res => {
        this.setData({
          poll: res.data[0].poll,
          vote_poll: res.data[0]._id
        })
        this.checkSend()
      }).catch(console.error)
  },
  //
  getRankMsg() {
    voteSet.
      field({
        poll: true,
        contestant_id: true
      }).where({
        vote_id: this.data.contestant.vote_id
      })
      .orderBy('poll', 'desc')
      .get()
      .then(this.getRank)
      .catch(console.error)
  },
  //
  getRank(result) {
    const data = result.data
    const count = data.length;
    for (let i = 0; i < count; i++) {
      if (data[i].contestant_id === this.data.contestant_id) {
        this.setData({
          rank: i + 1
        })
        break;
      }
    }
  },
  //检测是否能投票
  checkSend(){
    countTable.where({
      vote_poll: this.data.vote_poll
    }).get().then(res => {
      if(res.data[0]!=null){
        this.setData({
          status: res.data[0].status
        })
      } 
    })
  }, 
  //
  sendVote() {
    if (this.data.status !== 'fail') {  
      if (this.data.sendCount <= this.data.voteCount) {
        Toast.success('投票成功')
        wx.cloud.callFunction({
          name: 'updataPoll',
          data: {
            poll: this.data.poll + 1,
            vote_poll: this.data.vote_poll,
          },
          success: res => {
            this.getPollMsg();
            this.getRankMsg();
          }
        })
        this.setData({
          sendCount:this.data.sendCount+1
        })
      } else {
        countTable.add({
          data: {
            vote_poll:this.data.vote_poll,
            status:'fail'
          }
        })
          .then(res => {
            this.setData({
            status:'fail'
          })
          })
          .catch(console.error)
      }
    }else{
      Toast.fail('今日投票已达上限');
    }
  }


})