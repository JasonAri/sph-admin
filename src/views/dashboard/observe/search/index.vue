<template>
  <!-- 卡片 -->
  <el-card>
    <!-- 卡片标题插槽 -->
    <div slot="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <!-- 下拉框 -->
        <el-dropdown trigger="click">
          <span>
            <i class="el-icon-more" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>关键字</el-dropdown-item>
            <el-dropdown-item>搜索量</el-dropdown-item>
            <el-dropdown-item>用户数</el-dropdown-item>
            <el-dropdown-item>更多</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- 卡片内容去 -->
    <div>
      <!-- 布局 -->
      <el-row :gutter="10">
        <!-- 左侧 -->
        <el-col :span="12">
          <!-- 折线图 -->
          <LineCharts
            title="搜索用户数"
            :count="homeData.searchUser"
            :growth="homeData.searchUserGrowth"
            :data="homeData.searchUserTrend"
          />
        </el-col>
        <!-- 右侧 -->
        <el-col :span="12">
          <!-- 折线图 -->
          <LineCharts
            title="人均搜索次数"
            :count="homeData.perCapitaSearch"
            :growth="homeData.perCapitaSearchGrowth"
            :data="homeData.perCapitaSearchTrend"
          />
        </el-col>
      </el-row>
    </div>
    <!-- table -->
    <el-table
      :data="tableData"
      style="width: 100%"
      border
      height="250"
      :default-sort="{ prop: 'count', order: 'descending' }"
    >
      <el-table-column type="index" label="排名" width="60px" align="center" />
      <el-table-column label="搜索关键字" width="100px" prop="word" />
      <el-table-column label="搜索量" prop="count" sortable />
      <el-table-column label="用户数" prop="user" sortable />
    </el-table>
  </el-card>
</template>

<script>
import LineCharts from './linecharts'
import { mapState } from 'vuex'
export default {
  name: '',
  components: {
    LineCharts
  },
  data() {
    return {
      tableData: [{}]
    }
  },
  computed: {
    ...mapState({ homeData: (state) => state.home.data })
  },
  watch: {
    homeData() {
      this.tableData = this.homeData.searchWord
    }
  }
}
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
</style>
