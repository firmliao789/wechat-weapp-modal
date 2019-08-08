Component({
  options: {
    styleIsolation: 'isolated',
  },
  /**
   * 组件的属性列表
   */
  properties: {
    animation: {
      type: String,
      value: 'from-down-up', //'none' 'from-down-up' 'from-left-right'
    },
    height: {
      type: String,
      value: '100vh'
    },
    showPopup: {
      type: Boolean,
      value: false,
      observer(n) {
        if (n)
          this.setData({
            hierarchy: true
          }, () => this.startAnimation(n))
        else
          this.startAnimation(n)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    animationData: {},
    hierarchy: false
  },
  lifetimes: {
    attached() {
      this.animation = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
      })
      this.animationBackDrop = wx.createAnimation({
        duration: 400,
        timingFunction: 'ease',
      })
    },
    detached() {
      clearTimeout(this.timer);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    startAnimation(n) {
      const {
        height
      } = this.properties;
      clearTimeout(this.timer);
      switch (this.properties.animation) {
        case 'from-down-up':
          this.animation.translate3d(0, `${n ? '-' : ''}${height}`, 0).step()
          break;
        case 'from-left-right':
          this.animation.translate3d(`${n?'-':''}100vw`, 0, 0).step()
          break;
        default:
          this.animation.opacity(n ? 1 : 0).step();
      }
      this.animationBackDrop.opacity(n ? 0.5 : 0).step();
      this.setData({
        animationData: this.animation.export(),
        animationDataBackDrop: this.animationBackDrop.export()
      }, () => {
        if (!n) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => this.setData({
            hierarchy: false
          }), 400)
        }
      })
    },
    backdroptap() {
      this.triggerEvent('backdroptap');
    }
  }
})
