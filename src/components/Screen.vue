<template>
  <div class="com-container">
    <div class="com-chart" ref="screenRef"></div>
    <span class="iconfont icon-arrow-lift arr-left" @click="toLeft" :style="comStyle"></span>
    <span class="iconfont icon-arrow-right arr-right" @click="toRight" :style="comStyle"></span>
    <span class="cat-name">{{catName}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allDate: null, // 服务器返回的数据
      currentIndex: 0, // 当前展示的一级分类数据
      titleFontSzie: 0
    }
  },
  methods: {
    // 初始化图表
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.screenRef, 'chalk')
      const initOption = {
        title: {
          text: '| 热销商品的占比',
          left: 20,
          top: 20
        },
        legend: {
          // 图例类型
          icon: 'circle',
          top: '15%'
        },
        // 工具提示
        tooltip: {
          show: true,
          // 工具提示的文字内容 支持函数
          formatter: arg => {
            const thirdCategory = arg.data.children
            // 数据总和默认为0
            let total = 0
            // 计算三级分类的总和
            thirdCategory.forEach(item => {
              total += item.value
            })
            console.log(total)
            let retStr = ''
            thirdCategory.forEach(item => {
              retStr += `${item.name}:${parseInt(item.value / total * 100) + '%'}`
            })
            return retStr
          }
        },
        series: [
          {
            // 类型为饼图
            type: 'pie',
            // 文字
            label: {
              // 文字隐藏
              show: false
            },
            // 饼图高亮
            emphasis: {
              label: {
                show: true
              },
              // 线
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    async getDate () {
      const { data: res } = await this.$http.get('hot')
      this.allDate = res
      console.log(this.allDate)
      // 渲染视图
      this.updateChart()
    },
    // 更新图表
    updateChart () {
      // 饼图所需的数据
      const seriesData = this.allDate[this.currentIndex].children.map(item => {
        return {
          name: item.name,
          value: item.value,
          children: item.children
        }
      })
      // 图例数据
      const legendData = this.allDate[this.currentIndex].children.map(item => {
        return item.name
      })
      const dataOption = {
        series: [
          {
            data: seriesData
          }
        ],
        legend: {
          data: legendData
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    // 分辨率的适配
    screenAdapter () {
      this.titleFontSzie = (this.$refs.screenRef.offsetWidth / 100) * 3.6
      // 屏幕相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSzie
          }
        },
        series: [
          {
            // 饼图大小
            radius: this.titleFontSzie * 4.5,
            // 确定饼图的位置
            center: ['50%', '60%']
          }
        ],
        legend: {
          // 图例图形宽度
          itemWidth: this.titleFontSzie / 2,
          itemHeight: this.titleFontSzie / 2,
          itemGap: this.titleFontSzie / 2,
          // 文字
          textStyle: {
            fontSize: this.titleFontSzie / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表对象的resize才能产生效果
      this.chartInstance.resize()
    },
    // 向左点击
    toLeft () {
      this.currentIndex--
      // 判断小于0 显示最后一个数据
      if (this.currentIndex < 0) {
        this.currentIndex = this.allDate.length - 1
      }
      // 更新图表
      this.updateChart()
    },
    // 向右点击
    toRight () {
      this.currentIndex++
      // 判断下标大于最后一个数据 回到第一个数据
      if (this.currentIndex > this.allDate.length - 1) {
        this.currentIndex = 0
      }
      // 更新图表
      this.updateChart()
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
  },
  computed: {
    catName () {
      if (!this.allDate) {
        return []
      } else {
        return this.allDate[this.currentIndex].name
      }
    },
    // 计算css样式
    comStyle () {
      return {
        fontSize: this.titleFontSzie + 'px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #fff;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #fff;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
}
</style>
