// pages/contestant/contestant.js

const db = wx.cloud.database();
const contestant = db.collection('Contestant');
const voteSet = db.collection('VoteSet')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contestant_id:null,
    serial:null,
    contestant:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      contestant_id:options.id,
      serial:options.serial
    })
    this.getContestMsg();
  },
  //
  getContestMsg(){
    contestant.doc(this.data.contestant_id).get().then(res => {
      this.setData({
        contestant: res.data
      })
      // 获取记录id
      console.log(this.data.contestant.vote_id)
      console.log(this.data.contestant_id)
      //
    }).catch(console.error)
  },
  //
  // sendVote(){
  
  //   voteSet.doc('todo-identifiant-aleatoire').update({
  //     // data 传入需要局部更新的数据
  //     data: {
  //       // 表示将 done 字段置为 true
  //       done: true
  //     }
  //   })
  //     .then(console.log)
  //     .catch(console.error)
  // }




})