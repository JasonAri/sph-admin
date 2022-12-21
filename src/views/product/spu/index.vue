<template>
  <div>
    <!-- 三级分类 -->
    <el-card style="margin: 20px 0px">
      <CategorySelect :isdisable="isdisableCS" @getCategoryId="getCategoryId" />
    </el-card>
    <!-- 下方展示区 -->
    <el-card>
      <!-- SPU展示 -->
      <div v-show="scene == 0">
        <!-- 添加SPU的按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="scene = 1">添加SPU</el-button>
        <!-- SPU列表 -->
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" align="center" width="80px" />
          <el-table-column prop="spuName" label="SPU名称" width="width" />
          <el-table-column prop="description" label="SPU描述" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加SPU" />
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改SPU" @click="updateSpu(row)" />
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看当前SPU全部SKU列表" />
              <HintButton type="danger" icon="el-icon-delete" size="mini" title="删除SPU" />
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          :total="total"
          layout="prev,pager,next,jumper,->,sizes,total"
          style="text-align: center"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 添加/修改SPU的部分 -->
      <SpuForm v-show="scene == 1" ref="spuForm" @changeScene="changeScene" />
      <!-- 添加SKU的部分 -->
      <SkuForm v-show="scene == 2" @changeScene="changeScene" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from './spuform'
import SkuForm from './skuform'
export default {
  name: 'spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      // 三级分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 是否禁用三级分类
      isdisableCS: false,
      // 分页器选项
      page: 1,
      limit: 3,
      total: 0,
      // SPU列表数据
      records: [],
      // 场景标志 0:SPU列表, 1:添加修改SPU, 2:添加SKU
      scene: 0
    }
  },
  methods: {
    // 分页器回调
    handleCurrentChange(page) {
      this.page = page
      this.getSpuList()
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 三级分类列表改变的自定事件回调
    getCategoryId(cForm) {
      // 解构并重新赋值id
      const { category1Id, category2Id, category3Id } = cForm
      this.category1Id = category1Id
      this.category2Id = category2Id
      this.category3Id = category3Id

      // 三个分类id齐了再发请求
      if (category1Id && category2Id && category3Id) {
        // 获取spu
        this.getSpuList()
      } else {
        // 清空数据
        this.records = []
      }
    },
    // 更新spu列表
    async getSpuList() {
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code === 200) {
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 修改某个SPU的回调
    updateSpu(row) {
      this.scene = 1
      // 在父组件中通过$refs来获取子组件
      this.$refs.spuForm.initSpuData(row)
    },
    // 改变场景的回调
    changeScene(scene) {
      this.scene = scene
    }
  }
}
</script>

<style></style>
