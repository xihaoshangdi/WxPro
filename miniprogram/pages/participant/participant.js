// pages/participant/Participant.js
//Toast
import Toast from '../../vant-dist/toast/toast'
//
const db = wx.cloud.database();
//得到数据库实例
const Contestant = db.collection('Contestant')
Page({

 
  data: {
    vote_id:null,
    team_name:null,
    team_member:null,
    team_tel:null,
    team_introduce:null,
    imagePath:null,
    imgstatus:"未选择"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        vote_id: options.id
      })
   
  },
  onChangName(e) {
    this.setData({
      team_name: e.detail
    })
  },
  onChangMember(e) {
    this.setData({
      team_member: e.detail
    })
  },
  onChangTel(e) {
    this.setData({
      team_tel: e.detail
    })
  },
  onChangIntroduce(e) {
    this.setData({
      team_introduce: e.detail
    })
  },
  
  selectImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          imagePath: res.tempFilePaths[0],
          imgstatus: "已选择",
        })
      }
    })
  },
  onSubmit() {
    Toast.loading({
      mask: true,
      message: '提交申请中...'
    });
    wx.cloud.uploadFile({
      cloudPath: `${Math.floor(Math.random() * 100000)}`,
      filePath: this.data.imagePath,
    }).then(res => {
      // console.log(this.data.team_name)
      // console.log(this.data.team_member)
      // console.log(this.data.team_tel)
      // console.log(this.data.team_introduce)
      if (this.data.team_name && this.data.team_member && this.data.team_tel && this.data.team_introduce){
        Contestant.add({
          data: {
            vote_id: this.data.vote_id,
            team_name:this.data.team_name,
            team_member:this.data.team_member,
            team_introduce: this.data.team_introduce,
            team_tel:this.data.team_tel,
            team_image: res.fileID,
            team_status:"待审核"
          }
        }).then(res => {
          Toast.success('提交成功');
          //跳转回主页
          wx.reLaunch({
            url: '../index/index'
          })

        }).catch(error => {
          Toast.fail('提交失败');
          console.error
        })
      }else{
        Toast.fail('提交失败');
      }   
    }).catch(error => {
      Toast.fail('图片提交失败');
      console.error
    })
  }

})