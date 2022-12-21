<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌">
          <el-option v-for="(tm, index) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" placeholder="描述" rows="4" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select placeholder="还有3未选择" value> <el-option label="option" /></el-select>
        <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
        <el-table style="100%" border>
          <el-table-column type="index" label="序号" width="80px"></el-table-column>
          <el-table-column prop="prop" label="属性名" width="width"></el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width"></el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('changeScene', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // spu信息
      spu: {
        category3Id: 0,
        description: 'string',
        id: 0,
        spuImageList: [
          {
            id: 0,
            imgName: 'string',
            imgUrl: 'string',
            spuId: 0
          }
        ],
        spuName: 'string',
        spuSaleAttrList: [
          {
            baseSaleAttrId: 0,
            id: 0,
            saleAttrName: 'string',
            spuId: 0,
            spuSaleAttrValueList: [
              {
                baseSaleAttrId: 0,
                id: 0,
                isChecked: 'string',
                saleAttrName: 'string',
                saleAttrValueName: 'string',
                spuId: 0
              }
            ]
          }
        ],
        tmId: 0
      },
      // 品牌列表
      tradeMarkList: [],
      // 图片列表
      spuImageList: [],
      // 销售属性列表
      saleAttrList: [],
      // 照片墙初始数据
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    // 初始化spuForm的数据
    async initSpuData(spu) {
      // 获取spu信息
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取图片
      const spuImageListResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageListResult.code === 200) {
        // 数据需要有name、url字段
        const listArr = spuImageListResult.data
        listArr.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listArr
      }
      // 获取平台销售属性列表
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 删除图片时触发
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    // 预览图片时触发
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style></style>
