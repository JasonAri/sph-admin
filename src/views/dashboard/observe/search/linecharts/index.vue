<template>
  <div>
    <div class="header">
      <span class="header-title">{{ title }}</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="main">
      <span class="main-title">{{ count }}</span>
      <span>{{ growth }}%</span>
      <i v-if="growth > 0" class="el-icon-caret-top" />
      <i v-else class="el-icon-caret-bottom" />
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: '',
  props: ['title', 'count', 'growth', 'data'],
  data() {
    return {
      lineCharts: null
    }
  },
  watch: {
    data() {
      // 配置项
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
            data: this.data,
            // 拐点
            itemStyle: {
              opacity: 0
            },
            // 线条样式
            lineStyle: {
              color: 'skyblue'
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
                    color: 'skyblue'
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
  },
  mounted() {
    this.lineCharts = echarts.init(this.$refs.charts)
  }
}
</script>

<style scoped>
>>> .el-icon-info {
  color: gray;
}
>>> .el-icon-caret-top {
  color: red;
}
>>> .el-icon-caret-bottom {
  color: green;
}
.header-title {
  margin-right: 10px;
}
.main-title {
  display: inline-block;
  margin: 10px 15px 10px 0;
  font-size: 28px;
}
.charts {
  width: 100%;
  height: 50px;
}
</style>
