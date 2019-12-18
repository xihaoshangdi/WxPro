// pages/user/user.js
//数据库
const db = wx.cloud.database();
const votTable = db.collection('votTable')
Page({
  data: {
    defaultAvatar: '../../images/user/default-avatar.png',
    defaultText: '未登录',
    resbtn: true,

    _select: "creat",

    _openid: null,
    userData: null
  },
  onLoad() {
    //检测用户是否授权
    this.checkRoot();
    this.getOpenid();

  },
  onShow() {
    //获取用户opind
    this.getCreatData();
  },
  /* */
  userInfo(event) {
    const userInfo = event.detail.userInfo;
    this.setData({
      defaultAvatar: userInfo.avatarUrl,
      defaultText: userInfo.nickName,
      resbtn: false
    })
  },
  /**/
  trsCheck(e) {
    if (e.target.id === "creat") {
      this.getCreatData();
      this.setData({
        _select: "creat"
      })
    } else {
      this.setData({
        _select: "login"
      })
    }
  },
  // 获取用户openid并请求数据
  getOpenid() {
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        this.setData({
          _openid: res.result.openid
        })
        //请求数据
        this.getCreatData();
      }
    })
  },
  //检测用户是否授权
  checkRoot() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                defaultAvatar: res.userInfo.avatarUrl,
                defaultText: res.userInfo.nickName,
                resbtn: false
              })
            }
          })
        }
      },
    });
  },
  //请求数据
  getCreatData() {
    //根据opin请求并获取数据
    votTable.
      field({
        title: true,
        endDate: true
      })
      .where({
        _openid: this.data._openid,
        status: "pass"
      }).get().then(res => {
        this.setData({
          userData: res.data,
        })
      }).catch(console.error)
  }


})