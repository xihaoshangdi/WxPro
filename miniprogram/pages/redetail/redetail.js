// pages/reviewDetail/reviewDetail.js
const db = wx.cloud.database();
//得到数据库实例
const contestant = db.collection('Contestant')
const votTable = db.collection('votTable')
const voteSet = db.collection('VoteSet')
Page({

  data: {
    participantData: null,
    participant_id: null
  },
  onLoad: function (options) {
    this.setData({
      participant_id: options.id
    })
    //获取参赛者数据
    contestant.doc(options.id)
      .get().then(res => {
        this.setData({
          participantData: res.data,
        })
      }).catch(console.error)
  },
  //更新数据
  update(e) {
    const status = e.target.id;
    if (status === "pass") {
      //更新投票表,初始化票数为0
      voteSet.add({
        data: {
          contestant_id: this.data.participant_id,
          vote_id: this.data.participantData.vote_id,
          poll: 0
        }
      })
        .then(this.updateVoteTable())
        .catch(console.error)
    }
    this.updateTeamStatus(status)
  },
  //设置活动表参赛人数+1
  updateVoteTable() {
    votTable.doc(this.data.participantData.vote_id)
      .field({
        participant: true
      })
      .get().then(res => {
        votTable.doc(res.data._id).update({
          data: {
            participant: res.data.participant + 1
          }
        })
          .then()
          .catch(console.error)
      })

  },


  //更新参赛者队伍状态(云函数)
  updateTeamStatus(status) {
    wx.cloud.callFunction({
      name: 'update',
      data: {
        team_status: status,
        participant_id: this.data.participant_id
      },
      success: res => {
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }


})