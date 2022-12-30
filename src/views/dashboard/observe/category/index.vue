<template>
  <el-card>
    <div slot="header">
      <div class="category-header">
        <span>销售额类别占比</span>
        <div>
          <el-radio-group v-model="radio" size="small">
            <el-radio-button label="全部渠道" />
            <el-radio-button label="线上" />
            <el-radio-button label="门店" />
          </el-radio-group>
        </div>
      </div>
      <!-- 饼图 -->
      <div>
        <div class="charts" ref="charts"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: '',
  props: ['salerank'],
  data() {
    return {
      radio: '全部渠道',
      pieCharts: null
    }
  },
  watch: {
    radio() {
      // 初始化数据data
      let data = []
      if (this.radio === '线上') {
        data = this.salerank.online.value.map((item, i) => {
          return { value: item, name: this.salerank.online.name[i] }
        })
      } else if (this.radio === '门店') {
        data = this.salerank.shop.value.map((item, i) => {
          return { value: item, name: this.salerank.shop.name[i] }
        })
      } else {
        // 全部渠道
        data = this.salerank.online.value.map((item, i) => {
          return { value: item + this.salerank.shop.value[i], name: this.salerank.online.name[i] }
        })
      }
      this.setOptions(data)
    },
    salerank() {
      const data = this.salerank.online.value.map((item, i) => {
        return { value: item + this.salerank.shop.value[i], name: this.salerank.online.name[i] }
      })
      this.setOptions(data)
    }
  },
  mounted() {
    this.pieCharts = echarts.init(this.$refs.charts)
    this.pieCharts.on('mouseover', (params) => {
      this.pieCharts.setOption({
        title: {
          text: params.name,
          subtext: params.value,
          top: 'center',
          left: 'center'
        }
      })
    })
  },
  methods: {
    // 配置项的回调
    setOptions(data) {
      this.pieCharts.setOption({
        title: {
          text: this.radio,
          subtext: '',
          top: 'center',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'outside'
            },
            labelLine: {
              show: true
            },
            data
          }
        ]
      })
    }
  }
}
</script>

<style scoped>
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts {
  width: 100%;
  height: 350px;
}
</style>
