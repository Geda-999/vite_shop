<template>
    <div>
    <!-- 面包屑导航栏区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-4 text-xs">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 一行 -->
            <el-row>
                <!-- 一列 -->
                <el-col>
                    <!-- 添加按钮 -->
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <!-- 导入第三方插件库 -->
            <!-- data: 是数据源   selection-type：是复选框  expand-type：展开栏 show-index：是否显示数据索引[序号]  index-text：数据索引名称[#]  border：是否显示纵向边框  show-row-hover：鼠标悬停时，是否高亮当前行 -->
            <tree-table class="mt-4" :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border :show-row-hover="false">
                <!-- 定义插槽 -->
                <!-- scope：接收这一列数据 -->
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
                    <i class="el-icon-error" v-else  style="color:red"></i>
                </template>

                <!-- 排序 -->
                <!-- size:图标大小 type：图标颜色 -->
                <!-- scope：接收这一列数据 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>
                </template>

                <!-- 操作 -->
                <!-- size:图标大小 type：图标颜色 -->
                <!-- scope：接收这一列数据 -->
                <template  slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCateById(scope.row.cat_id)">删除</el-button>
                </template>

            </tree-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[3, 5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <!-- close:清空重置表单数据 -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            @close="addCateDialogClosed">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                                <!-- prop:验证规则 -->
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级名称：">
                    <!-- Cascader 级联选择器 -->
                    <!-- options:用来指定数据源 -->
                    <!-- props:用来指定配置对象 -->
                    <el-cascader
                        expand-trigger="hover"
                        :options="parentCateList"
                        :props="cascaderProps"
                        v-model="selectedKeys"
                        @change="parentCateChanged"
                        clearable
                        change-on-select>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改分类的对话框 -->
        <el-dialog :visible.sync="editCateDialogVisible" title="修改分类" @close="editCateDialogClosed">
            <el-form ref="editCateFormRef" :model="editCateForm" label-width="100px">
                <el-form-item label="分类名称: " prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCate">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
  data() {
    return {
      // 查询条件
      queryInfo: {
        type: 3, // 值
        pagenum: 1, // 当前页码值
        pagesize: 5 // 每页显示多少条数据
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      //  总数据条数
      total: 0,
      // 为table指定列的定义
      //   label：列标题名称   prop：对应列内容的属性名
      columns: [
        {
          label: '分类名称', // 标题
          prop: 'cat_name' // 商品名称
        },
        {
          label: '是否有效', // 标题
          type: 'template', // 表示，将当前列定义为模板列
          // template属性指定具体的作用域插槽  插槽名称：isok
          template: 'isok' // 表示当前这一列使用模板名称
        },
        {
          label: '排序', // 标题
          type: 'template', // 表示，将当前列定义为模板列
          // template属性指定具体的作用域插槽  插槽名称：isok
          template: 'order' // 表示当前这一列使用模板名称
        },
        {
          label: '操作', // 标题
          type: 'template', // 表示，将当前列定义为模板列
          // template属性指定具体的作用域插槽  插槽名称：isok
          template: 'opt' // 表示当前这一列使用模板名称
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级，默认要添加的是一级分类
        cat_level: 0
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      //   指定级联选择器的配置对象
      cascaderProps: {
        value: 'cat_id', // 你所选中的值的属性
        label: 'cat_name', // 你所看的值的属性
        children: 'children', // 父子嵌套的属性
        // 从el-cascader标签的属性,中移动到这个cascadeProps中
        expandTrigger: 'hover'
      },

      // 选中的父级分类的Id数组
      selectedKeys: [],
      // 控制修改分类对话框的显示与隐藏
      editCateDialogVisible: false,
      // 修改分类的表单数据对象
      editCateForm: {}

    }
  },
  created() {
    // 咋们来调用一个方法
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      // 发起一个get的请求  请求方法：get 请求路径：categories
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })

      //   接着咋们要【判断这的请求是否成功
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }

      console.log(res.data)
      // 把数据列表，赋值给 cateList
      this.cateList = res.data.result
      // 为总数据queryInfo条数赋值  赋值一下值
      this.total = res.data.total
    },

    // 监听 pagesize 改变
    handleSizeChange(newSize) {
      // 赋值
      this.queryInfo.pagesize = newSize
      // 赋值完毕立即刷新数据列表
      this.getCateList()
    },

    // 监听 pagenum 改变
    handleCurrentChange(newPage) {
      // 赋值
      this.queryInfo.pagenum = newPage
      // 赋值完毕立即刷新数据列表
      this.getCateList()
    },
    // 点击按钮，展示添加分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      // 调用this.$http 发起一个get请求
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }

      console.log(res.data)

      // 给parentCateList赋值
      //  保存到parentCateList数组中共咋们页面使用
      this.parentCateList = res.data
    },

    // 选择发生变化触发这个函数
    parentCateChanged() {
      console.log(this.selectedKeys)
      // 如果 selectedKeys 数组中的 length 大于0 证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }
      // 父级分类的Id
      this.addCateForm.cat_pid = 0
      // 为当前分类的等级赋值
      this.addCateForm.cat_level = 0
    },

    // 点击按钮，添加新的分类
    addCate() {
    //   console.log(this.addCateForm)
    // 预验证   调用validate方法
      this.$refs.addCateFormRef.validate(async valid => {
        //   如果非valid 就预校验失败 就return出去
        if (!valid) return

        // 如果没有return出去就校验成功
        // 发起post请求 ，添加这个功能
        const { data: res } = await this.$http.post('categories', this.addCateForm)

        // 判断环节
        if (res.meta.status !== 201) {
          // 失败就提示用户
          return this.$message.error('添加分类失败！')
        }

        // 必备三步走✨✨

        // 如果没有return出去就成功了提示
        this.$message.success('添加分类成功！')

        // 刷新数据列表
        this.getCateList()

        // 同时咋们添加的对话框 要把他隐藏
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据 【就是清空表单】
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()

      // 注意点: 重置下拉框和表单里面的数据!!!
      this.selectedKeys = [] // 清空数组
      this.addCateForm.cat_level = 0 // 分类当前层级
      this.addCateForm.cat_pid = 0 // 分类父 ID
    },
    // 展现修改对话框的显示与隐藏
    async showEditDialog(id) {
      // 发起get请求
      const { data: res } = await this.$http.get(`categories/${id}`)

      // 判断环节
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败！')
      }

      // 如果没有return出去就直接赋值，共页面使用
      this.editCateForm = res.data
      // 同时咋们编辑的对话框 要把他隐藏
      this.editCateDialogVisible = true
    },
    // 点击按钮 编辑分类
    editCate() {
      this.$refs.editCateFormRef.validate(async valid => {
        // console.log(valid)
        //   如果非valid 就预校验失败 就return出去
        if (!valid) return

        // 如果没有return出去就校验成功
        // 发起put请求 ，编辑这个功能
        const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`,
          {
            cat_name: this.editCateForm.cat_name
          }
        )

        // 判断环节
        if (res.meta.status !== 200) {
          this.$message.error('更新分类失败')
        }

        // 如果没有return出去就成功了提示
        this.$message.success('更新分类成功')

        // 刷新数据列表
        this.getCateList()

        // 同时咋们添加的对话框 要把他隐藏
        this.editCateDialogVisible = false
      })
    },

    // 监听 修改分类对话框的关闭事件
    editCateDialogClosed() {
      this.$refs.editCateFormRef.resetFields()
    },

    // 根据分类id删除分类
    async removeCateById(id) {
      // 弹框询问用户是否直接删除数据
      // MessageBox 弹框
      const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })

      if (confirmResult === 'confirm') {
        console.log('确认了删除')
        // 发起delete请求
        const { data: res } = await this.$http.delete(`categories/${id}`)

        // 判断环节
        if (res.meta.status !== 200) {
          // 如果 不等于200就提示以下内容
          return this.$message.error('删除分类失败！')
        }

        // 如果没有return出去就成功了提示
        this.$message.success('删除分类成功！')

        // 刷新数据列表
        this.getCateList()
      }
    }

  }
}
</script>

<style scoped>
.el-cascader{
    width: 100%;
}
</style>
