<template>
  <div>
    <!-- 表格 -->
    <el-table styel="width:100%" border :data="records">
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="skuName" label="名称" />
      <el-table-column prop="skuDesc" label="描述" />
      <el-table-column label="默认图片" width="120px">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80px" />
      <el-table-column prop="price" label="价格" width="80px" />
      <el-table-column prop="prop" label="操作" width="240px">
        <template slot-scope="{ row, $index }">
          <el-button v-if="row.isSale === 0" type="success" icon="el-icon-sort-down" size="mini" @click="isSale(row)" />
          <el-button v-else type="success" icon="el-icon-sort-up" size="mini" @click="isSale(row)" />
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit" />
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuById(row)" />
          <el-button type="danger" icon="el-icon-delete" size="mini" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev,pager,next,jumper,->,sizes,total"
      :total="total"
      @current-change="handleCurrentChange"
      @size-change="handleSizechange"
    />
    <el-drawer :visible.sync="drawer" direction="rtl" size="50%" :show-close="false" :before-close="handleClose">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            v-for="(attr, index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            style="margin-right: 10px"
            type="success"
          >
            {{ attr.attrId }}--{{ attr.valueId }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'sku',
  data() {
    return {
      page: 1,
      limit: 10,
      records: [],
      total: 0,
      skuInfo: {},
      // 抽屉显示标志
      drawer: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    async getSkuList() {
      const { page, limit } = this
      const result = await this.$API.sku.reqSkulist(page, limit)
      if (result.code === 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    handleCurrentChange(page) {
      this.page = page
      this.getSkuList()
    },
    handleSizechange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 上架/下架sku的回调
    async isSale(row) {
      // 分辨上下架
      const msg = row.isSale === 0 ? '上架' : '下架'
      // 发请求
      const result = await this.$API.sku.reqIsSale(row.id, row.isSale)
      if (result.code === 200) {
        // 提示用户
        this.$message({ type: 'success', message: `${msg}成功` })
        // 更新页面
        this.getSkuList()
      } else {
        this.$message({ type: 'error', message: `${msg}失败` })
      }
    },
    // 编辑sku的回调
    edit() {
      this.$message({ type: 'icon', message: `正在开发中` })
    },
    // 获取sku的回调
    async getSkuById(row) {
      // 打开抽屉
      this.drawer = true
      // 发请求
      const result = await this.$API.sku.reqSkuById(row.id)
      if (result.code === 200) {
        this.skuInfo = result.data
      }
    },
    // 关闭抽屉
    handleClose() {
      this.drawer = false
    }
  }
}
</script>

<style scoped>
/* 局部样式 */
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
}
.el-col {
  margin: 10px;
}
>>> .el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: red;
}
</style>
