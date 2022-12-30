<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: '',
  props: ['rate'],
  data() {
    return {
      barCharts: null
    }
  },
  watch: {
    rate() {
      // 配置
      this.barCharts.setOption({
        xAxis: {
          show: false,
          min: 0,
          max: 100
        },
        yAxis: {
          show: false,
          type: 'category'
        },
        // 系列
        series: [
          {
            type: 'bar',
            data: [this.rate],
            legendHoverLink: true,
            barWidth: 10,
            color: 'yellowgreen',
            showBackground: true,
            backgroundStyle: {
              color: '#eee'
            },
            label: {
              show: true,
              formatter: '|',
              position: 'right'
            }
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
