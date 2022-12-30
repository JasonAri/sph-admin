<template>
  <!-- 布局 -->
  <el-row :gutter="10">
    <!-- 左侧 -->
    <el-col :span="12">
      <!-- 搜索 -->
      <Search />
    </el-col>
    <!-- 右侧 -->
    <el-col :span="12">
      <!-- 分类 -->
      <Category :salerank="homeData.saleRank" />
    </el-col>
  </el-row>
</template>

<script>
import Category from './category'
import Search from './search'
import { mapState } from 'vuex'
export default {
  name: '',
  components: { Category, Search },
  computed: {
    ...mapState({ homeData: (state) => state.home.data })
  }
}
</script>

<style></style>
