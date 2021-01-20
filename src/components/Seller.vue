<template>
  <div class="com-container">
    <div class="com-chart" ref="sellerRef"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 初始化的图表
      chartInstance: null,
      allDate: null, // 服务器返回的数据
      currentPage: 1, // 当前显示的页数
      totalPage: 0, // 一共有多少页
      timerId: null // 定时器标识
    }
  },
  methods: {
    initChart () {
      // 初始化图表
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, 'chalk')
      // 对图表初始化配置的控制
      const initOption = {
        title: {
          text: '| 商家销售统计',
          left: 20,
          top: 20
        },
        // 坐标轴配置
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          // 距离包含坐标轴文字
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        series: [
          {
            // 类型为柱状图
            type: 'bar',
            // 柱文字 默认不展示
            label: {
              show: true,
              // 文字靠右显示
              position: 'right',
              textStyle: {
                // 颜色为白色
                color: 'white'
              }
            },
            // 控制柱的每一项
            itemStyle: {
              // 线性渐变
              // 指定不同百分比的颜色数值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  // 百分之0的样式
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  // 百分之百
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line', // 默认为直线，可选为：'line' | 'shadow'
            z: 0, // 背景层级
            lineStyle: {
              color: '#2D3443' // 背景颜色
            }
          }
        }
      }
      this.chartInstance.setOption(initOption)
      // 鼠标监听事件 移入停止定时器 移除关闭定时器
      // 移入
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      // 移出
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器的数据
    async getData () {
      const { data: res } = await this.$http.get('seller')
      this.allDate = res
      // 对返回的数据进行从小打到排序 sort方法
      this.allDate.sort((a, b) => {
        return a.value - b.value
      })
      // 计算总页数
      this.totalPage = this.allDate.length % 5 === 0 ? this.allDate.length / 5 : this.allDate.length / 5 + 1
      this.updateChart()
      // 启动定时器
      this.startInterval()
    },
    // 更新图表
    updateChart () {
      const start = (this.currentPage - 1) * 5// 为1的时候 0
      const end = (this.currentPage * 5)// 为1的时候还是5
      // slice 从什么位置开始截取 到什么结束 包含start
      const showDate = this.allDate.slice(start, end)
      // y轴类目轴的数据
      const sellerNames = showDate.map(item => {
        return item.name
      })
      // x轴的数据
      const sellerValues = showDate.map(item => {
        return item.value
      })
      const dataOption = {
        yAxis: {
          // y轴坐标轴使用遍历出来的name
          data: sellerNames
        },
        series: [
          {
            // x轴数据需要设置在series的data类型为遍历的value
            data: sellerValues
          }
        ]
      }
      this.chartInstance.setOption(dataOption)
    },
    // 定时获取数据
    startInterval () {
      this.timerId = setInterval(() => {
        this.currentPage++
        // 判断当前页数是否大于总页数
        if (this.currentPage > this.totalPage) {
          // 页数重置为1
          this.currentPage = 1
        }
        this.updateChart()
      }, 3000)
    },
    // 屏幕适配方法 当浏览器窗口大小发生改变触发
    screenAdapter () {
      // 标题大小
      const titleFontSize = this.$refs.sellerRef.offsetWidth / 100 * 3.6
      // 分辨率大小相关的配置
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            // 柱的宽度
            barWidth: titleFontSize,
            // 控制柱的每一项
            itemStyle: {
              // 控制柱的圆角半径
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ],
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize // 背景宽度
            }
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表对象的resize才能产生效果
      this.chartInstance.resize()
    }
  },
  // mounted钩子函数调用
  mounted () {
    this.initChart()
    this.getData()
    // 对窗口事件监听
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    // 销毁定时器
    clearInterval(this.timerId)
    // 组件销毁取消事件监听
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>

<style>
</style>
