<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: '',
  props: ['visittrend'],
  data() {
    return {
      lineCharts: null
    }
  },
  watch: {
    visittrend() {
      // 配置echarts
      this.setEchartsOptions()
    }
  },
  mounted() {
    // 初始化echarts实例
    this.lineCharts = echarts.init(this.$refs.charts)
  },
  methods: {
    // 配置echarts的回调
    setEchartsOptions() {
      this.lineCharts.setOption({
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
            type: 'line',
            data: this.visittrend,
            // 拐点
            itemStyle: {
              opacity: 0
            },
            // 线条样式
            lineStyle: {
              color: 'purple'
            },
            smooth: true,
            // 填充颜色
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'purple'
                  },
                  {
                    offset: 1,
                    color: 'white'
                  }
                ],
                global: false
              }
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
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
