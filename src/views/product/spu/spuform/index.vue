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
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}未选择`">
          <el-option
            v-for="unSelect in unSelectSaleAttr"
            :key="unSelect.id"
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
          />
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-left: 5px"
          :disabled="!attrIdAndAttrName"
          @click="addSpuSaleAttrList"
        >
          添加销售属性
        </el-button>
        <el-table style="100%;margin:10px 0;" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="saleAttrName" label="属性名" width="100px" align="center" />
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                v-for="tag in row.spuSaleAttrValueList"
                :key="tag.id"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="80px">
            <template slot-scope="{ row, $index }">
              <!-- 删除按钮 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="!spu.spuName" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
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
        description: '',
        spuImageList: [],
        spuName: '',
        spuSaleAttrList: [],
        tmId: ''
      },
      // 用于收集新增的spuSaleAttrList的id和name
      attrIdAndAttrName: '',
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
  computed: {
    unSelectSaleAttr() {
      return this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item1.saleAttrName !== item.name
        })
      })
    }
  },
  methods: {
    // 初始化spuForm的数据
    async initSpuData(spu, category3Id) {
      // 获取品牌信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取平台销售属性列表
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
      //  若为修改spu模式
      if (spu) {
        // 获取spu信息
        const spuResult = await this.$API.spu.reqSpu(spu.id)
        if (spuResult.code === 200) {
          this.spu = spuResult.data
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
      } else {
        // 添加模式
        this.spu.category3Id = category3Id
      }
    },
    // 图片上传成功的回调
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.spuImageList = fileList
      }
    },
    // 删除图片的回调
    handleRemove(file, fileList) {
      // 删除图片
      this.spuImageList = fileList
    },
    // 预览图片时触发
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 添加销售属性按钮的回调
    addSpuSaleAttrList() {
      // 切割数组
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')

      // 创建一个新销售属性
      const newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      // push
      this.spu.spuSaleAttrList.push(newSaleAttr)
      // 清空数据
      this.attrIdAndAttrName = ''
    },
    // 属性值名称列表中添加按钮的回调
    addSaleAttrValue(row) {
      // 添加响应式属性
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
    },
    // 失去焦点的回调
    handleInputConfirm(row) {
      // 关闭input框
      row.inputVisible = false
      const { baseSaleAttrId, inputValue } = row
      // 校验字段为空则return
      if (!inputValue || inputValue.trim() === '') return
      // 重复则return
      const isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName === inputValue
      })
      if (isRepeat) return

      // 校验通过，创建新属性值对象
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      // push
      row.spuSaleAttrValueList.push(newSaleAttrValue)
    },
    // 删除属性值
    handleClose(tag) {
      console.log(tag)
    },
    // 保存spuform的回调
    async addOrUpdateSpu() {
      // 整理spu
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.data : item.url
        }
      })
      // 发请求
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '保存成功！' })
        // 通知父组件切换场景
        this.$emit('changeScene', { scene: 0, type: this.spu.id ? 'edit' : 'add' })
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 取消按钮的回调
    cancel() {
      // 清除数据
      Object.assign(this._data, this.$options.data())
      // 切换
      this.$emit('changeScene', { scene: 0, type: 'cancel' })
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
