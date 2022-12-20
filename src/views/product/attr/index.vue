<template>
  <div>
    <!-- 三级分类列表 -->
    <el-card style="margin: 20px 0px">
      <CategorySelect :isdisable="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>

    <!-- 下方属性展示卡 -->
    <el-card>
      <!-- 属性表格展示 -->
      <div v-show="isShowTable">
        <!-- 添加属性按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 属性表格 -->
        <el-table style="width: 100%" border="" :data="attrInfoList">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="150" />
          <el-table-column prop="prop" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                type="success"
                style="margin: 0 10px"
              >
                {{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" />
              <el-button type="danger" icon="el-icon-delete" size="mini" />
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加属性｜修改属性的结构 -->
      <div v-show="!isShowTable">
        <!-- 属性名操作 -->
        <el-form ref="form" :inline="true">
          <el-form-item label="属性名" :model="attrInfo">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <!-- 上方添加属性值的按钮 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">
          添加属性值
        </el-button>
        <el-button>取消</el-button>
        <!-- 属性值操作 -->
        <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
          <!-- 序号 -->
          <el-table-column align="center" type="index" label="序号" width="80px" />
          <!-- 属性值 -->
          <el-table-column prop="prop" label="属性名称">
            <template slot-scope="{ row, $index }">
              <!-- 这里的结构需要切换展示 -->
              <el-input
                v-if="row.flag"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              />
              <span v-else style="display: block" @click="toEdit(row, $index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗?`" @onConfirm="deleteAttrValue($index)">
                <!-- 删除按钮 -->
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 下方保存/取消按钮 -->
        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="saveAttrInfo">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入深拷贝
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'attr',
  data() {
    return {
      isShowTable: true,
      // 三级分类id
      category1Id: '',
      category3Id: '',
      // 属性列表
      attrInfoList: [],
      // 收集/修改属性
      attrInfo: {
        attrName: '',
        attrValueList: [],
        categoryId: 0, // 三级分类的id
        categoryLevel: 3
      }
    }
  },
  methods: {
    // 自定义事件的回调
    getCategoryId(cForm) {
      // 接收解构表单带来的id
      const { category1Id, category2Id, category3Id } = cForm
      // 更新三个id
      this.category1Id = category1Id
      this.category2Id = category2Id
      this.category3Id = category3Id
      // 获取属性列表
      this.getAttrInfolist()
    },
    // 更新属性table的回调
    async getAttrInfolist() {
      const { category1Id, category2Id, category3Id } = this
      // 三个id全齐才发请求，否则清空属性列表
      if (category1Id && category2Id && category3Id) {
        // 获取attrInfoList
        const result = await this.$API.attr.reqAttrInfoList(category1Id, category2Id, category3Id)
        if (result.code === 200) {
          this.attrInfoList = result.data
        }
      } else {
        // 三级id不齐，清空数据
        this.attrInfoList = []
      }
    },
    // 添加属性按钮的回调
    addAttr() {
      // 隐藏table
      this.isShowTable = false
      // 收集三级分类的id，并初始化其他数据
      this.attrInfo = {
        attrName: '',
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      }
    },
    // 属性编辑的回调
    updateAttr(row) {
      // 隐藏table
      this.isShowTable = false
      // 选中的属性赋值(数据对象中有数组，数组里又有对象，需要用深拷贝)
      this.attrInfo = cloneDeep(row)
      // 添加flag标记
      this.attrInfo.attrValueList.forEach((item) => {
        // item.flag = false // 这样添加的flag不是响应式数据
        this.$set(item, 'flag', false)
      })
    },
    // 添加属性值的回调
    addAttrValue() {
      // 向属性对象的attrValueList中添加属性
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: '',
        // flag控制input和span的切换
        flag: true
      })
      // 自动聚焦
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 失去焦点事件的回调
    toLook(row) {
      // 校验输入为空or全空格
      if (!row.valueName.trim()) {
        this.$message({ message: '输入不能为空！', type: 'warning' })
        return
      }
      // some方法检查是否重复
      const isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 剔除row本身再判断
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      // 校验是否重复
      if (isRepeat) {
        this.$message({ message: '属性值已存在！', type: 'warning' })
        return
      }
      // 切换为span
      row.flag = false
    },
    // 点击属性值span的回调
    toEdit(row, index) {
      row.flag = true
      // console.log(this.$refs[index]) // 输出undefine，DOM树更新还没有ref
      // nextTick页面渲染完毕后会执行一次
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 气泡确认框成功的回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮的回调
    async saveAttrInfo() {
      // 整理参数(这里的filter不需要return接收结果，因为操作的是数组里的对象)
      this.attrInfo.attrValueList.filter((item) => {
        delete item.flag
      })
      // 发请求
      const result = await this.$API.attr.reqSaveAttrInfo(this.attrInfo)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        this.getAttrInfolist()
        this.isShowTable = true
      } else {
        this.$message({ type: 'error', message: `保存失败:${result.data}` })
      }
    }
  }
}
</script>

<style></style>
