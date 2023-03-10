<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0px" @click="updateTradeMark('add')">添加</el-button>
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
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark('edit', row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="updateTradeMark('del', row)">删除</el-button>
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
    <!-- 对话框 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" style="width: 75%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'trademark',
  data() {
    // 自定义校验规则
    const validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('长度为2-10个字符'))
      } else {
        callback()
      }
    }
    return {
      // 代表分页器的页数
      page: 1,
      // 当前页数展示数据的条数
      limit: 3,
      total: 0,
      list: [],
      // 对话框的显示隐藏
      dialogFormVisible: false,
      // 上传图片的路径
      imageUrl: '',
      // 收集品牌的信息
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      rules: {
        tmName: [{ required: true, validator: validateTmName, trigger: 'blur' }],
        logoUrl: [{ required: true, message: '请选择品牌logo' }]
      }
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
    },
    // 添加、修改、删除按钮的回调
    updateTradeMark(type, row) {
      // 添加/修改
      if (type !== 'del') {
        // 置空
        this.tmForm = { tmName: '', logoUrl: '' }
        // 开启dialog
        this.dialogFormVisible = true
        if (type === 'edit') {
          this.tmForm = row
        }
      } else {
        // 删除
        this.$confirm(`确定删除${row.tmName}的品牌信息吗？`, '提示', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            // 发请求删除
            const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
            if (result.code === 200) {
              this.$message({ type: 'success', message: '删除成功' })
            }
            // 再次更新品牌
            this.getPageList()
          })
          .catch(() => {})
      }
    },
    // 上传成功的回调
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data
    },
    // 上传图片前会执行的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // dialog的确认按钮的回调
    addOrUpdateTradeMark() {
      // 验证表单
      this.$refs.ruleForm.validate(async (success) => {
        // 成功
        if (success) {
          this.dialogFormVisible = false
          // 发请求
          const result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code === 200) {
            // 弹出信息
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            })
            this.getPageList()
          }
        }
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
