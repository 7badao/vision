<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <div @click="showChose=!showChose">
        <span>{{ '| ' + showTitle}}</span>
        <span class="iconfont icon-arrow-down title-icon" :style="comStyle"></span>
      </div>
      <div class="select-con" v-show="showChose" :style="marginStyle">
        <div
          class="select-item"
          v-for="i in selectTypes"
          @click="handelSelect(i.key)"
          :key="i.type"
        >{{i.text}}</div>
      </div>
    </div>
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allDate: null, // 服务器返回的数据
      showChose: false, // 是否显示可选项
      choiceType: 'map', // 显示数据类型
      titleFontSize: 0 // 标题字体大小

    }
  },
  methods: {
    // 初始化图表
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trendRef, 'chalk')
      const initOption = {
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: false
        },
        // 坐标轴位置
        grid: {
          top: '35%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        // 工具提示
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          left: 20,
          top: '15%',
          // 图例为圆形
          icon: 'circle'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    async getDate () {
      const { data: res } = await this.$http.get('trend')
      this.allDate = res
      console.log(this.allDate)
      // 渲染视图
      this.updateChart()
    },
    // 更新图表
    updateChart () {
      // x轴的数据
      const timeArr = this.allDate.common.month
      const valueArr = this.allDate[this.choiceType].data
      // 半透明的颜色值
      const colorArr1 = ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)', 'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)', 'rgba(250, 105, 0, 0.5)']
      // 全透明的颜色值
      const colorArr2 = ['rgba(11, 168, 44, 0)', 'rgba(44, 110, 255, 0)', 'rgba(22, 242, 217, 0)', 'rgba(254, 33, 30, 0)', 'rgba(250, 105, 0, 0)']
      // 处理y轴数据
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          stack: this.choiceType,
          data: item.data,
          // 空对象 以颜色进行填充
          areaStyle: {
            // 颜色渐变 从上往下
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                // 百分之0的样式
                offset: 0,
                color: colorArr1[index]
              },
              {
                // 百分之百
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      // 图例的数据
      const legendArr = valueArr.map(item => {
        return item.name
      })
      const dataOption = {
        xAxis: {
          data: timeArr
        },
        series: seriesArr,
        legend: {
          data: legendArr
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    // 分辨率的适配
    screenAdapter () {
      // 标题大小
      this.titleFontSize = this.$refs.trendRef.offsetWidth / 100 * 3.6
      // 屏幕相关的配置项
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize, // 图例间距
          textStyle: {
            fontSize: this.titleFontSize / 2 // 文字大小
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表对象的resize才能产生效果
      this.chartInstance.resize()
    },
    // 切换图表
    handelSelect (i) {
      this.choiceType = i
      this.updateChart()
      this.showChose = false
    }
  },
  mounted () {
    this.initChart()
    this.getDate()
    // 监听屏幕大小变化
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  computed: {
    // 计算下拉框的值
    selectTypes () {
      if (!this.allDate) {
        return []
      } else {
        return this.allDate.type.filter(item => {
          return item.key !== this.choiceType
        })
      }
    },
    // 计算title值
    showTitle () {
      if (!this.allDate) {
        return []
      } else {
        return this.allDate[this.choiceType].title
      }
    },
    // 设置给标题的对象
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    }
  },
  destroyed () {
    // 移除监听事件
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  .select-item {
    cursor: pointer;
  }
  color: #fff;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
}
.select-con {
  background-color: #222333;
}
</style>
