<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: '',
  props: ['paytrend'],
  data() {
    return { barCharts: null }
  },
  watch: {
    paytrend() {
      // 配置barcharts
      this.barCharts.setOption({
        xAxis: {
          show: false,
          type: 'category'
        },
        yAxis: {
          show: false
        },
        // 系列
        series: [
          {
            type: 'bar',
            data: this.paytrend,
            legendHoverLink: true
          }
        ],
        // 布局
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        }
      })
    }
  },
  mounted() {
    // 初始化echarts实例
    this.barCharts = echarts.init(this.$refs.charts)
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
