<template>
  <div class="com-container">
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allDate: null // 服务器返回的数据
    }
  },
  methods: {
    // 初始化图表
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.trendRef)
      const initOption = {}
      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    getDate () {
      // 渲染视图
      this.updateChart()
    },
    // 更新图表
    updateChart () {
      const dataOption = {}
      this.chartInstance.setOption(dataOption)
    },
    // 分辨率的适配
    screenAdapter () {
      // 屏幕相关的配置项
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表对象的resize才能产生效果
      this.chartInstance.resize()
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
  }
}
</script>

<style>
</style>
