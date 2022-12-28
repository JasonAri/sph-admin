<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="¥ 126560">
            <template slot="charts">
              <span>周同比 56.67% <i class="el-icon-caret-top" /></span>
              <span>日同比 19.96% <i class="el-icon-caret-bottom" /> </span>
            </template>
            <template slot="footer">
              <span>日销售额¥ 12539</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineCharts />
            </template>
            <template slot="footer">
              <span>日访问量 1253</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="80000">
            <template slot="charts">
              <BarCharts />
            </template>
            <template slot="footer">
              <span>转化率 64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressCharts />
            </template>
            <template slot="footer">
              <span>周同比 12% <i class="el-icon-caret-top" /></span>
              <span>日同比 11% <i class="el-icon-caret-bottom" /> </span>
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
export default {
  name: 'Card',
  components: { Detail, LineCharts, BarCharts, ProgressCharts }
}
</script>

<style></style>
