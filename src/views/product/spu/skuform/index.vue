<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" type="number" placeholder="价格(元)" />
      </el-form-item>
      <el-form-item label="重量(千克)"> <el-input v-model="skuInfo.weight" placeholder="重量(千克)" /></el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="attr in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.saleAttrIdAndValueId" placeholder="请选择">
              <el-option
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50px" align="center" />
          <el-table-column prop="prop" label="图片" width="180px" align="center">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" />
          <el-table-column prop="prop" label="操作" width="180px">
            <template slot-scope="{ row, $index }">
              <el-button v-if="row.isDefault == 0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      spu: {},
      // 收集图片的字段
      imageList: [],
      // 收集sku数据的字段
      skuInfo: {
        // 父组件带来的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 需要数据双向绑定手机的
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 需要代码收集
        skuDefaultImg: '',
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   isDefault: 'string',
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0,
          // }
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: 'string',
          //   saleAttrValueId: 0,
          //   saleAttrValueName: 'string',
          //   skuId: 0,
          //   spuId: 0
          // }
        ]
      }
    }
  },
  methods: {
    // 获取skuForm数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给的数据
      this.spu = spu
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId

      const res1 = await this.$API.spu.reqSpuImageList(spu.id)
      if (res1.code === 200) {
        const list = res1.data
        list.forEach((item) => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      const res2 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (res2.code === 200) {
        this.spuSaleAttrList = res2.data
      }
      const res3 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (res3.code === 200) {
        this.attrInfoList = res3.data
      }
    },
    // 取消按钮的回调
    cancel() {
      this.$emit('changeScene', { scene: 0, type: 'cancel' })
      Object.assign(this._data, this.$options.data())
    },
    // table多选框回调
    handleSelectionChange(params) {
      // 获取选中图片的信息
      this.imageList = params
    },
    // 更改默认
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0
      })
      row.isDefault = 1
      // 收集默认图片地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 保存按钮的回调
    async saveSkuInfo() {
      // 解构
      const { attrInfoList, spuSaleAttrList, imageList, skuInfo } = this
      // 处理品牌数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      // 处理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleAttrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 图片列表
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      // 发请求
      const result = await this.$API.spu.reqSaveSkuInfo(skuInfo)
      if (result.code === 200) {
        this.$message({ message: '保存成功！', type: 'success' })
        // 切换场景
        this.$emit('changeScene', { scene: 0, toPage: '' })
        // 清空数据
        Object.assign(this._data, this.$options.data())
      } else {
        this.$message({ message: '保存失败', type: 'error' })
      }
    }
  }
}
</script>

<style></style>
