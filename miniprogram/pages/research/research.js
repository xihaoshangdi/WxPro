//获取数据库连接
const db = wx.cloud.database();
//得到数据库实例
const votTable = db.collection('votTable')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperCurrent: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 800,
    circular: true,
    imgUrls: []
  },
  onShow() {
    votTable.
      field({
        imgCloudPath: true
      })
      .where({
        status: "pass"
      })
      .get().then(res => {
        let imglist=[];
        let idList=[];
        res.data.filter((e)=>{
          imglist.push(e.imgCloudPath);
        })
        this.setData({
          imgUrls: imglist
        })
      }).catch(console.error)
  },
  //轮播图的切换事件
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },
  openCreat() {
    wx.navigateTo({
      url: '../investigation/investigation',
    })
  }

})