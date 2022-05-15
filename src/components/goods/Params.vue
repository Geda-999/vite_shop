<template>
  <div>
    <!-- 面包屑导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-4 text-xs">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告区域  Alert 警告 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <!-- 一行 -->
      <el-row class="my-4">
        <!-- 一列 -->
        <el-col>
           <span>选择商品分类：</span>
           <!-- 下面用到是ui框架中的 Cascader 级联选择器 -->
           <!-- 选择商品分类的级联选择框 -->
           <!-- expand-trigger:触发子菜单 options：是用来指定数据源了 props:用来配置节点选择框了  -->
           <!-- v-model：可以把咋们选中的那些id值，双向判定到对应的数组中 -->
           <!-- change：事件是判定了选择项改变的事件 -->
            <el-cascader
                expand-trigger="hover"
                :options="cateList"
                :props="cateProps"
                v-model="selectedCateKeys"
                @change="handleChange">
            </el-cascader>

            <!-- tab 页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板   many:是动态了 -->
                <el-tab-pane label="动态参数" name="many">
                    <!-- 添加参数的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>

                    <!-- 动态参数表格 :data="manyTableData"这是动态参数数据源 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <!-- 标题：参数名称 -->
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <!-- 标题：操作 -->
                        <el-table-column label="操作">
                            <!-- 作用域插槽 -->
                            <template slot-scope="scope">
                                <!-- 编辑按钮 -->
                                <!-- (scope.row.attr_id)给传到函数中 -->
                                <!-- 那要去哪接收呢，就去methods函数中的【showEditDialog(attr_id)】接收就行啦 -->
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <!-- 删除按钮 -->
                                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 添加静态属性的面板   only:是静态了 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>

                    <!-- 静态属性表格 :data="onlyTableData"这是静态属性数据源 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 展开行 -->
                        <el-table-column type="expand"></el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <!-- 标题：属性名称 -->
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <!-- 标题：操作 -->
                        <el-table-column label="操作">
                            <!-- 作用域插槽 -->
                            <template slot-scope="scope">
                                <!-- 编辑按钮 -->
                                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                                <!-- 删除按钮 -->
                                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加参数的对话框 -->
    <!--  @close="addDialogClosed"这是监听事件 -->
    <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed">
        <!-- 添加参数的对话框  Form 表单 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <!--  @close="addDialogClosed"这是监听事件 -->
    <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed">
        <!-- 添加参数的对话框  Form 表单 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
            <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editForm.attr_name"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      // 获取所有 商品分类列表 【这个就是数据源啦】
      cateList: [],
      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id', // 指定咋们选中的那个值   【咋们通过cat_id来做那个值】
        label: 'cat_name', // 指定你所看到那个名称 【咋们通过cat_name来做那个名称】
        children: 'children' // 父子节点的嵌套属性 【咋们通过children来做那个名称】
      },
      // 级联选择框双向判定到的数组
      selectedCateKeys: [],
      // 声明v-model
      activeName: 'many', // 被激活的页签的名称
      // 动态参数的数据
      manyTableData: [],
      // 静态属性的数据
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: '' // 要添加那个参数名称
      },
      // 添加表单的验证规则对象
      addFormRules: {
        // 为这个名称添加校验
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      },

      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,

      // 修改的表单数据对象
      editForm: {},

      // 修改表单的验证规则对象
      editFormRules: {
        // 为这个名称添加校验
        attr_name: [
          {
            required: true,
            message: '请输入参数名称',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    // 咋们来调用一个方法
    this.getCateList()
  },
  methods: {
    async getCateList() {
      // 通过this.$http 发起get请求
      const { data: res } = await this.$http.get('categories')

      // 判断环节
      if (res.meta.status !== 200) {
        //   如果失败就提示以下内容
        return this.$message.error('获取商品分类失败！')
      }

      // 成功之后
      // 注意： 获取所有商品 一定要先赋值到data中共页面使用
      this.cateList = res.data

      console.log(this.cateList)
    },

    // 级联选择框 选中项 变化，会触发这个函数
    handleChange() {
      // 调用这个函数
      this.getParamsData()
    },
    // tab 页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName)
      // 调用这个函数
      this.getParamsData()
    },

    // 获取参数的列表数据
    async getParamsData() {
    // 证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [] // 清空数组
        return
      }

      // 证明选中的是三级分类
      console.log(this.selectedCateKeys)

      // 发起请求啦！！！
      // 根据所选分类的Id，和当前所处的面板，获取对应的参数
      // 请求路径：categories/:id/attributes
      // 其中/:id/是个参数 代表当前选中的三级分类的id
      // 那么这个id呀 已经被咋们设计成了一个计算属性【cateId】直接拼接就行
      // 同时咋们需要 向服务发送一个get参数 名字叫做 sel 那么他的值可以直接咋们 判定到了v-model="activeName"身上进行获取
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`,
        { // 那咋们就这里写一个参数  params：指定get参数也是个对象 sel: 的值activeName
          params: { sel: this.activeName }
        }
      )

      // 查看是否请求成功 并且返回200回来
      //   console.log(res)

      // 结构重命名后就进行判断是否成功啦！！！
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败！')
      }

      // 如果没有return出去就咋们获取数据成功啦
      console.log(res.data)

      // 判断来啦
      // 如果 this.activeName 当前我们激活的那个tab页签 他的名字 如果等于many的话
      // 证明咋们获取动态参数里面的数据
      if (this.activeName === 'many') {
        // 哪接下来咋们可以把res.data挂载到一个专门的数据对象身上
        // this.动态表格数据
        this.manyTableData = res.data
      } else {
        // else 的话就证明 你获取到这个数据 不属于 动态的这个表格里
        // 哪应该把他挂载到 静态的表格中
        this.onlyTableData = res.data
      }
    },

    // 这是监听处理函数
    // 监听添加对话框的关闭事件
    addDialogClosed() {
      // 只要触发的关闭，咋们就将它重置一下
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加参数
    addParams() {
      // 验证环节
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        // 如果非valid 就预校验失败 就return出去
        if (!valid) return

        // 如果没有return出去就校验成功
        // 发起post请求 ，编辑这个功能
        // /:id/ 被咋们设计成计算属性了cateId    attr_name参数名称  attr_sel[only,many]
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName
          }
        )

        // 判断环节
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }

        // 如果没有return出去就成功了提示
        this.$message.success('添加参数成功！')

        // 同时咋们添加的对话框 要把他隐藏
        this.addDialogVisible = false

        // 刷新数据列表
        this.getParamsData()
      })
    },

    // 点击按钮，展示修改的对话框
    // eslint-disable-next-line camelcase
    async showEditDialog(attr_id) {
      // 发起请求拿数据啦
      // 第一个 /:id/   这个是【分页id】就是咋们计算属性
      // 第二个 :attrId 这个是当前【参数的id】

      // 这是查询当前参数的信息
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
        // 同时咋们还有提供一个新的参数
        {
          params: { attr_sel: this.activeName }
        }
      )

      // 判断环节来啦！！！
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败！')
      }

      // 那如果没有失败的话，咋们可以将获取到的信息保存到这个编辑的表单对象身上。 哪这个编辑的表单对象就是 :model="editForm" 就可以直接赋值啦
      // 如果没有return出去就直接赋值，共页面使用
      this.editForm = res.data

      // 同时咋们修改的对话框 要把他显示出来
      this.editDialogVisible = true
    },

    // 重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 点击按钮，修改参数信息
    editParams() {
      // 预验证   调用validate方法
      // 先拿到表单的引用【this.$refs.】表单的名称【ref="editFormRef"】点【validate】函数做一个验证，验证的结果通过【valid】来获取
      this.$refs.editFormRef.validate(async valid => {
        // 做一下判断 如果非valid 那么就验证失败 直接return
        if (!valid) return

        // 如果没有return出来就证明验证成功啦！！！

        // 发起请求拿数据啦
        // 咋们可以【this.$http.】发起一下put请求 请求路径
        // 第一个 /:id/   这个是【分页id】就是咋们计算属性
        // 第二个 :attrId 这个是当前【参数的id】
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          { // 同时要提交一下表单的数据对象
            attr_name: this.editForm.attr_name, // attr_name新属性的名字
            attr_sel: this.activeName // attr_sel属性的类型[many或only]
          }
          // 那么当这次发起请送成功之后 哪服务器会返回一个结果 那咋们来通过 await修饰 在【valid】之前加一个 async 来接收
          // 然后就结构赋值 判断了
        )

        // 判断环节
        if (res.meta.status !== 200) {
          // 失败就提示用户
          this.$message.error('修改参数失败！')
        }

        // 必备三步走起✨✨

        // 如果没有return出去就成功了提示
        this.$message.success('修改参数成功')

        // 刷新数据列表
        this.getParamsData()

        // 同时咋们添加的对话框 要把他隐藏
        this.editDialogVisible = false
      })
    }
  },

  // 计算属性 【布尔值】
  computed: {
    // 如果按钮需要被禁用，则返回true。否则返回false
    isBtnDisabled() {
      // 判断 选中项的length  不等于3的话那证明你没有 选中三级分类
      // 应该是禁用掉 就返回true就行了
      if (this.selectedCateKeys.length !== 3) {
        return true
      }

      return false
    },
    // 当前选中的三级分类的Id
    cateId() {
      // 判断 选中项的length  等于3的话那证明你选中三级分类
      // 那么咋们就直接return this.keys最后一项就是索引为2
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }

      // 如果没有return出去
      // 哪证明你没有选中三级分类 就返回 空
      // 证明没有这个Id值
      return null
    },
    // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style scoped></style>
