<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <!-- 总销售额 -->
          <Detail title="总销售额" :count="`¥ ${homeData.salesTotal}`">
            <template slot="charts">
              <span class="growth">月同比 {{ homeData.salesGrowthLastMonth }}% <i class="el-icon-caret-top" /></span>
              <span class="growth">日同比 {{ homeData.salesGrowthLastDay }}% <i class="el-icon-caret-bottom" /> </span>
            </template>
            <template slot="footer">
              <span>日销售额¥ {{ homeData.salesToday }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 访问量 -->
          <Detail title="访问量" :count="homeData.visitTotal">
            <template slot="charts">
              <LineCharts :visittrend="homeData.visitTrend" />
            </template>
            <template slot="footer">
              <span>日访问量 {{ homeData.visitToday }}</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 支付笔数 -->
          <Detail title="支付笔数" :count="homeData.payTotal">
            <template slot="charts">
              <BarCharts :paytrend="homeData.payTrend" />
            </template>
            <template slot="footer">
              <span>转化率 {{ homeData.payRate }}%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <!-- 运营活动效果 -->
          <Detail title="运营活动效果" :count="`${homeData.activityRate}%`">
            <template slot="charts">
              <ProgressCharts :rate="homeData.activityRate" />
            </template>
            <template slot="footer">
              <span class="growth">
                月同比 {{ homeData.activityGrowthLastMonth }}% <i class="el-icon-caret-top" />
              </span>
              <span class="growth">
                日同比 {{ homeData.activityGrowthLastDay }}% <i class="el-icon-caret-bottom" />
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './detail'
import LineCharts from './linechart'
import BarCharts from './barcharts'
import ProgressCharts from './progresscharts'
import { mapState } from 'vuex'
export default {
  name: 'Card',
  components: { Detail, LineCharts, BarCharts, ProgressCharts },
  computed: {
    ...mapState({ homeData: (state) => state.home.data })
  },
  watch: {},
  methods: {}
}
</script>

<style scoped>
>>> .el-icon-caret-top {
  color: red;
}
>>> .el-icon-caret-bottom {
  color: green;
}
.growth {
  font-size: 12px;
}
</style>
