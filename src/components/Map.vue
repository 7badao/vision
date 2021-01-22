<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="mapRef"></div>
  </div>
</template>

<script>
import axios from 'axios'
// 省份拼音数据
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  data () {
    return {
      chartInstance: null,
      allDate: null, // 服务器返回的数据
      mapData: {} // 省份地图数据缓存
    }
  },
  methods: {
    // 初始化图表
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.mapRef, 'chalk')
      // 获取中国地图的矢量数据
      const res = await axios.get('http://localhost:8999/static/map/china.json')
      // 通过registerMap(别名,数据)
      this.$echarts.registerMap('china', res.data)
      const initOption = {
        title: {
          text: '| 商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china', // china需要和registerMap中的第一个参数保持一致
          top: '5%',
          bottom: '5%',
          itemStyle: {
            // 省份的颜色
            areaColor: '#2E72BF',
            borderColor: '#333' // 地图线条颜色
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical' // 改变图例方向 竖直方向
        }
      }
      this.chartInstance.setOption(initOption)
      // 监听地图点击事件
      this.chartInstance.on('click', async arg => {
        // 点击的省份arg.name 中文的
        const provinceInfo = getProvinceMapInfo(arg.name)
        // 判断当前点击的省份数据是否存在
        if (!this.mapData[provinceInfo.key]) {
          // 不存在发请求
          const ret = await axios.get(`http://localhost:8999${provinceInfo.path}`)
          // 缓存省份矢量数据
          this.mapData[provinceInfo.key] = ret.data
          // 矢量数据
          this.$echarts.registerMap(provinceInfo.key, ret.data)
        }
        // 切换地图显示
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        // 呈现点击的省份地图
        this.chartInstance.setOption(changeOption)
      })
    },
    // 获取数据
    async getDate () {
      const { data: res } = await this.$http.get('map')
      console.log(res)
      this.allDate = res
      // 渲染视图
      this.updateChart()
    },
    // 更新图表
    updateChart () {
      const legendArr = this.allDate.map(item => {
        return item.name
      })
      const seriesArr = this.allDate.map(item => {
        // return 对象代表一个类别的散点数据
        // 如果想在地图中显示散点数据 需要在散点图表增加配置 coordinateSystem:geo
        return {
          type: 'effectScatter', // 涟漪动画
          name: item.name, // 散点类别名称
          data: item.children, // 这个类别的散点数据
          coordinateSystem: 'geo',
          rippleEffect: { // 涟漪特效
            period: 4, // 动画时间，值越小速度越快
            brushType: 'stroke', // 波纹绘制方式 stroke, fill stroke空心
            scale: 5 // 波纹圆环最大限制，值越大波纹越大
          }
        }
      })
      const dataOption = {
        series: seriesArr,
        legend: {
          data: legendArr
        }
      }
      this.chartInstance.setOption(dataOption)
    },
    // 分辨率的适配
    screenAdapter () {
      const titleFontSize = this.$refs.mapRef.offsetWidth / 100 * 3.6
      // 屏幕相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          },
          // 图例间隔
          itemGap: titleFontSize / 2
        }
      }
      this.chartInstance.setOption(adapterOption)
      // 手动调用图表对象的resize才能产生效果
      this.chartInstance.resize()
    },
    // 双击回到中国地图
    revertMap () {
      // 指定map为china
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      // 呈现中国地图
      this.chartInstance.setOption(revertOption)
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
