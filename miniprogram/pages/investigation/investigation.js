// pages/creatEvent/creatEvent.js
//Toast
import Toast from '../../vant-dist/toast/toast'
//获取数据库连接
const db = wx.cloud.database();
//得到数据库实例
const votTable = db.collection('votTable')
Page({
  data: {
    steps: [{
        text: '基本信息',
        desc: '活动简述和介绍'
      },
      {
        text: '图片',
        desc: '活动宣传图'
      },
      {
        text: '日期|次数',
        desc: '起始/截至|投票次数'
      }
    ],
    activeColor: '#4facfe',
    active: 0,

    title: '',
    introduce: '',

    imagePath: null,
    imgstatus: "未选择",

    dateShow: false,
    startDate: "点击选择起始时间",
    startPop: false,
    startTime: null,
    endDate: "点击选择结束时间",
    endPop: false,
    endTime: null,
    minDate: new Date().getTime(),
    maxDate: new Date(2022, 10, 1).getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },

    voteCount: 1,

    btnShow: false,
    btnText: "下一步"
  },
  onTitleChange(event) {
    this.setData({
      title: event.detail
    })
    if (this.data.title.length && this.data.introduce.length) {
      this.setData({
        btnShow: true
      })
    } else {
      this.setData({
        btnShow: false
      })
    }
  },
  onIntroduceChange(event) {
    this.setData({
      introduce: event.detail
    })
    if (this.data.title.length && this.data.introduce.length) {
      this.setData({
        btnShow: true
      })
    } else {
      this.setData({
        btnShow: false
      })
    }
  },
  startDate() {
    this.setData({
      dateShow: true,
      startPop: true
    });
  },
  endDate() {
    this.setData({
      dateShow: true,
      endPop: true
    });
  },
  dateClose() {
    this.setData({
      dateShow: false,
      startPop: false,
      endPop: false
    });
  },
  onStartConfirm(event) {
    this.setData({
      startTime: event.detail,
      startDate: new Date(event.detail).toDateString(),
      dateShow: false,
      startPop: false
    });
  },
  onEndConfirm(event) {
    this.setData({
      endTime: event.detail,
      endDate: new Date(event.detail).toDateString(),
      dateShow: false,
      endPop: false
    });
  },
  voteCount(event) {
    this.setData({
      voteCount: event.detail
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
          btnShow: !this.data.btnShow
        })
      }
    })
  },
  btnTap() {
    switch (this.data.active) {
      case 0:
        {
          this.setData({
            active: this.data.active + 1,
            btnShow: false
          })
          break;
        }
      case 1:
        {
          this.setData({
            active: this.data.active + 1,
            btnText: "提交审核活动",
          })
          break;
        }
      case 2:{
        this.onSubmit();
      }
    }
  },
  onSubmit() {
    Toast.loading({
      mask: true,
      message: '提交申请中...'
    });
    if (this.data.startTime <= this.data.endTime && this.data.startTime && this.data.endTime){
      wx.cloud.uploadFile({
        cloudPath: `${Math.floor(Math.random() * 100000)}`,
        filePath: this.data.imagePath,
      }).then(res => {
        votTable.add({
          data: {
            title: this.data.title,
            introduce: this.data.introduce,
            imgCloudPath: res.fileID,
            startDate: this.data.startDate,
            startTime: this.data.startTime,
            endDate: this.data.endDate,
            endTime: this.data.endTime,
            voteCount: this.data.voteCount,
            participant: 0,
            status: 'draft'
          }
        }).then(res => {
          Toast.success('提交成功');
          wx.navigateBack({
            delta: 1
          })
        }).catch(error => {
          Toast.fail('提交失败');
          console.error
        })
      }).catch(error => {
        console.error
      })
    }else{
      Toast.fail('时间错误，提交失败');
    }
  }
})