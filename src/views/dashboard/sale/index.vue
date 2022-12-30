<template>
  <div>
    <el-card class="box-card" style="margin: 10px 0px">
      <div slot="header" class="clearfix">
        <!-- 头部左侧内容 -->
        <el-tabs v-model="activeName" class="tab">
          <el-tab-pane label="销售额" name="sale" />
          <el-tab-pane label="访问量" name="visit" />
        </el-tabs>
        <!-- 头部右侧 -->
        <div class="right">
          <span @click="setToday">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            v-model="date"
            class="date-picker"
            size="mini"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="19">
            <!-- echart container -->
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="5" class="right">
            <h3>门店{{ activeName === 'sale' ? '销售' : '用户' }}排名</h3>
            <ul v-if="activeName === 'sale'">
              <li v-for="item in homeData.orderRank" :key="item.no">
                <span>{{ item.no }}</span>
                <span>{{ item.name }}</span>
                <span class="rvalue">¥{{ item.money }}</span>
              </li>
            </ul>
            <ul v-else>
              <li v-for="item in homeData.userRank" :key="item.no">
                <span>{{ item.no }}</span>
                <span>{{ item.name }}</span>
                <span class="rvalue">{{ item.money }}</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
  name: '',
  data() {
    return {
      activeName: 'sale',
      date: [],
      barCharts: null
    }
  },
  computed: {
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    },
    ...mapState({ homeData: (state) => state.home.data })
  },
  watch: {
    title() {
      this.setEcharts()
    },
    homeData() {
      this.setEcharts()
    }
  },
  mounted() {
    // 初始化实例
    this.barCharts = echarts.init(this.$refs.charts)
  },
  methods: {
    // echarts的配置方法
    setEcharts() {
      this.barCharts.setOption({
        title: { text: this.title },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.title === '销售额' ? this.homeData.orderFullYearAxis : this.homeData.userFullYearAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            data: this.title === '销售额' ? this.homeData.orderFullYear : this.homeData.userFullYear,
            color: 'orange'
          }
        ]
      })
    },
    // 今天
    setToday() {
      const d = dayjs().format('YYYY-MM-DD')
      this.date = [d, d]
    },
    setWeek() {
      const s = dayjs().day(0).format('YYYY-MM-DD')
      const e = dayjs().day(6).format('YYYY-MM-DD')
      this.date = [s, e]
    },
    setMonth() {
      const s = dayjs().startOf('month').format('YYYY-MM-DD')
      const e = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [s, e]
    },
    setYear() {
      const s = dayjs().startOf('year').format('YYYY-MM-DD')
      const e = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [s, e]
    }
  }
}
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
>>> .el-card__header {
  border-bottom: none;
}
>>> .el-tabs__item {
  font-size: 16px;
}
.right {
  position: absolute;
  right: 0;
}
.right span {
  margin: 0 5px;
  font-size: 14px;
  cursor: pointer;
}
.date-picker {
  width: 200px;
  margin: 0 0 0 20px;
}
.charts {
  width: 100%;
  height: 300px;
}
.right > h3 {
  margin: 0;
  padding: 0;
}
.right > ul {
  list-style: none;
  width: 100%;
  height: 300px;
  padding: 0;
}
.right > ul > li {
  height: 8%;
  padding: 18px 0;
}
.rindex {
  display: block;
  float: left;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #000;
  color: #fff;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>
