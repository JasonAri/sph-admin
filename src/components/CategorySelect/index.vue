<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择">
          <el-option v-for="(c1, index) in list1" :key="c1.id" :label="c1.name" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择">
          <el-option v-for="(c2, index) in list2" :key="c2.id" :label="c2.name" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择">
          <el-option v-for="(c3, index) in list3" :key="c3.id" :label="c3.name" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelect',
  data() {
    return {
      list1: [],
      list2: [],
      list3: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },
  watch: {
    // 监听一级分类
    'cForm.category1Id': async function (value) {
      // 置空后面的分类
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''

      // 给父组件传categoryId
      this.$emit('getCategoryId', this.cForm)

      // 获取二级分类
      const result = await this.$API.attr.reqCategory2List(value)
      if (result.code === 200) {
        this.list2 = result.data
      }
    },
    // 监听二级分类
    'cForm.category2Id': async function (value) {
      // 置空后面的分类
      this.cForm.category3Id = ''

      // 给父组件传categoryId
      this.$emit('getCategoryId', this.cForm)

      // 若为空则return
      if (!value) return

      // 获取三级分类
      const result = await this.$API.attr.reqCategory3List(value)
      if (result.code === 200) {
        this.list3 = result.data
      }
    },
    // 监听三级分类
    'cForm.category3Id': async function (value) {
      // 给父组件传categoryId
      this.$emit('getCategoryId', this.cForm)

      // 若为空则return
      if (!value) return
    }
  },
  mounted() {
    this.getCategory1List()
  },
  methods: {
    async getCategory1List() {
      const result = await this.$API.attr.reqCategory1List()
      if (result.code === 200) {
        this.list1 = result.data
      }
    }
  }
}
</script>

<style></style>
