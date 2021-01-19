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
      allDate: null // 服务器返回的数据
    }
  },
  methods: {
    // 初始化echartInstance对象
    initChart () {
      // 获取dom对象
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef)
    },
    // 获取服务器数据
    async getData () {
      const { data: res } = await this.$http.get('seller')
      this.allDate = res
      this.updateChart()
    },
    // 更新图标
    updateChart () {
      // 遍历数据提取name y轴数据
      const sellerNames = this.allDate.map(item => {
        return item.name
      })
      // x轴数据
      const sellerValues = this.allDate.map(item => {
        return item.value
      })
      const option = {
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          // y轴坐标轴使用遍历出来的name
          data: sellerNames
        },
        series: [
          {
            // 类型为柱状图
            type: 'bar',
            // x轴数据需要设置在series的data类型为遍历的value
            data: sellerValues
          }
        ]
      }
      // 渲染optio数据给dom对象
      this.chartInstance.setOption(option)
    }
  },
  // dom加载完成调用
  mounted () {
    this.initChart()
    this.getData()
  }
}
</script>
<style lang="less" scoped>
</style>
