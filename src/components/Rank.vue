<template>
  <div class="com-container">
    <div class="com-chart" ref="rankRef"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allDate: null, // 服务器返回的数据
      startValue: 0, // 区域缩放起点值
      endValue: 9, // 区域缩放终点值
      timerId: null
    }
  },
  methods: {
    // 初始化图表
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.rankRef, 'chalk')
      const initOption = {
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ],
        title: {
          text: '| 地区销售排行',
          left: 20,
          top: 20
        },
        legend: {
          left: 20,
          top: 20
        },
        // 坐标轴位置
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        // 工具提示
        tooltip: {
          // trigger: 'axis'
          show: true
        }
      }
      this.chartInstance.setOption(initOption)
      // 对图表进行鼠标事件监听
      // 鼠标移入取消定时器
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      // 鼠标移出开启定时器
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取数据
    async getDate () {
      const { data: res } = await this.$http.get('rank')
      this.allDate = res
      console.log(this.allDate)
      // 对数据进行从大到小排序
      this.allDate.sort((a, b) => {
        return b.value - a.value
      })
      // 渲染视图
      this.updateChart()
      // 开启定时器
      this.startInterval()
    },
    // 更新图表
    updateChart () {
      // 渐变色数组
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      // 处理x轴的数据 省份数组
      const provinceArr = this.allDate.map(item => {
        return item.name
      })
      // 处理y轴的数据 对应销售金额
      const valueArr = this.allDate.map(item => {
        return item.value
      })
      const dataOption = {
        xAxis: {
          data: provinceArr
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              // 判断不同数值的颜色
              color: arg => {
                // 颜色变量
                let targetColorArr = null
                if (arg.value > 300) {
                  targetColorArr = colorArr[0]
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1]
                } else {
                  targetColorArr = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  // 0%
                  { offset: 0, color: targetColorArr[0] },
                  // 100%
                  { offset: 1, color: targetColorArr[1] }
                ])
              }
            }
          }
        ],
        // 区域缩放 平移动画
        dataZoom: {
          show: false, // 隐藏组件
          startValue: this.startValue,
          endValue: this.endValue
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    // 分辨率的适配
    screenAdapter () {
      const titleFontSzie = (this.$refs.rankRef.offsetWidth / 100) * 3.6
      // 屏幕相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            // 字体大小
            fontSize: titleFontSzie
          }
        },
        series: [
          {
            // 柱的宽度
            barWidth: titleFontSzie,
            // 每个柱
            itemStyle: {
              // 柱的圆角 顺时针
              barBorderRadius: [titleFontSzie / 2, titleFontSzie / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表对象的resize才能产生效果
      this.chartInstance.resize()
    },
    // 改变柱形图 区域缩放起始与终点值的函数
    startInterval () {
      // 判断定时器是否存在 存在先清除
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        // 控制起点和终点的值
        // 如果最后一个数据大于返回的数据重置
        if (this.endValue > this.allDate.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }
        // 更新图表
        this.updateChart()
      }, 2000)
    }
  },
  mounted () {
    this.initChart()
    this.getDate()
    // 监听屏幕大小变化
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    // 移除监听事件
    window.removeEventListener('resize', this.screenAdapter)
    // 清除定时器
    clearInterval(this.timerId)
  }
}
</script>

<style>
</style>
