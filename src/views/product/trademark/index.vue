<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px">添加</el-button>
    <el-table style="width: 100%" border="border" :data="list">
      <el-table-column type="index" prop="prop" label="序号" width="80px" align="center" />
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center" />
      <el-table-column prop="prop" label="品牌logo" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      layout="prev,pager,next,jumper,->,sizes,total"
      style="margin-top: 20px; text-align: center"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>

<script>
export default {
  name: 'trademark',
  data() {
    return {
      // 代表分页器的页数
      page: 1,
      // 当前页数展示数据的条数
      limit: 3,
      total: 0,
      list: []
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    async getPageList() {
      const { page, limit } = this
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      // console.log(result)
      if (result.code === 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handleCurrentChange(pager) {
      // console.log(pager)
      this.page = pager
      this.getPageList()
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    }
  }
}
</script>

<style></style>
