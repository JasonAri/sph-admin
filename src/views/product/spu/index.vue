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
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <!-- SPU列表 -->
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" align="center" width="80px" />
          <el-table-column prop="spuName" label="SPU名称" width="width" />
          <el-table-column prop="description" label="SPU描述" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加SKU" @click="addSku(row)" />
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改SPU" @click="updateSpu(row)" />
              <HintButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前SPU全部SKU列表"
                @click="showSkuList(row)"
              />
              <el-popconfirm :title="`确定删除${row.spuName}吗`" @onConfirm="deleteSpu(row)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除SPU" />
              </el-popconfirm>
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
      <SkuForm v-show="scene == 2" ref="skuForm" @changeScene="changeScene" />
    </el-card>
    <!-- Sku详情列表 -->
    <el-dialog :title="`${spu.spuName}SKU列表`" :visible.sync="dialogTableVisible" :before-close="dialogClose">
      <!-- skuList table展示位置 -->
      <el-table v-loading="loading" style="width: 100%" border :data="skuList">
        <el-table-column property="skuName" label="名称" />
        <el-table-column property="price" label="价格" width="80px" />
        <el-table-column property="weight" label="重量" width="80px" />
        <el-table-column label="默认图片" width="110px">
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
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
      scene: 0,
      // sku列表显示标志
      dialogTableVisible: false,
      // spu的信息
      spu: {},
      skuList: [],
      loading: true
    }
  },
  watch: {
    // 监视场景值
    scene: function () {
      if (this.scene === 0) {
        // 展示场景，不禁用
        this.isdisableCS = false
      } else {
        // 其他场景禁用分类选择器
        this.isdisableCS = true
      }
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
    // 添加spu
    addSpu() {
      this.scene = 1
      // 在父组件中通过$refs来获取子组件
      this.$refs.spuForm.initSpuData(undefined, this.category3Id)
    },
    // 修改某个SPU的回调
    updateSpu(row) {
      this.scene = 1
      // 在父组件中通过$refs来获取子组件
      this.$refs.spuForm.initSpuData(row, this.category3Id)
    },
    // 改变场景的回调
    changeScene({ scene, toPage }) {
      // 切换场景
      this.scene = scene
      // 指定切换第几页
      if (toPage) {
        this.page = toPage
      }
      // 更新数据
      this.getSpuList()
    },
    // 删除spu按钮的回调
    async deleteSpu(row) {
      // 发请求删除
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        // 判断此spu是否为本页最后一条数据
        if (this.records.length <= 1) {
          // 是则将page往前置一页，且page最小为1
          this.page - 1 > 0 ? (this.page -= 1) : (this.page = 1)
        }
        // 更新
        this.getSpuList()
      }
    },
    // 点击添加sku的回调
    addSku(row) {
      // 切换场景
      this.scene = 2
      // 调用子组件的方法
      this.$refs.skuForm.getData(this.category1Id, this.category2Id, row)
    },
    // 查看sku列表的回调
    async showSkuList(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      // 获取sku列表的数据
      const result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code === 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    // 关闭对话框的回调
    dialogClose(done) {
      this.loading = true
      this.skuList = []
      done()
    }
  }
}
</script>

<style></style>
