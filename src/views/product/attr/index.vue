<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table style="width: 100%" border="" :data="attrInfoList">
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="attrName" label="属性名称" width="150" />
        <el-table-column prop="prop" label="属性值列表">
          <template slot-scope="{ row, $index }">
            <el-tag v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id" type="success" style="margin: 0 10px">
              {{ attrValue.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <el-button type="warning" icon="el-icon-edit" size="mini" />
          <el-button type="danger" icon="el-icon-delete" size="mini" />
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'attr',
  data() {
    return {
      attrInfoList: []
    }
  },
  methods: {
    // 自定义事件的回调
    async getCategoryId(cForm) {
      const { category1Id, category2Id, category3Id } = cForm
      // 获取attrInfoList
      const result = await this.$API.attr.reqAttrInfoList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrInfoList = result.data
      }
    }
  }
}
</script>

<style></style>
