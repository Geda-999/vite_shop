<template>
    <div>
    <!-- 面包屑导航栏区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-4 text-xs">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card class="shadow-md">
            <el-row :gutter="20">
                <el-col :span="8">
                    <!-- 搜索与添加区域 -->
                    <!-- clearable:可清空 -->
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialgVisible = true">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <!-- :data是数据源  border：边框线 stripe：各行变色效果-->
            <el-table :data="userlist" border stripe class="mt-4 text-xs">
                <el-table-column type="index"></el-table-column><!-- 表格添加索引列 -->
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!-- 作用域插槽 -->
                    <!--  slot-scope:接收数据-->
                    <template slot-scope = "scope">
                        <!-- 能拿到所有数据 -->
                        <!-- {{scope.row}} -->
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <!-- 作用域插槽渲染操作 -->
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                           <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            class="mt-4">
            </el-pagination>
        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialgVisible"
            width="50%"
            @close="addDialogClosed">
            <!-- 内容主体区 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部按钮区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialgVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户的对话框 -->
        <el-dialog
            title="修改用户"
            :visible.sync="editDialogVisible"
            width="50%"
            @close="editDialogClosed">
            <el-form :model="editFrom" :rules="editFromRules" ref="editFromRef" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="editFrom.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editFrom.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editFrom.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色的对话框 -->
        <!-- 监听close事件 Dialog 关闭的回调 -->
        <el-dialog
            title="分配角色"
            :visible.sync="setRoleDialogVisible"
            width="50%"
            @close="setRoleDialogClosed">
            <div>
                <p class="mb-5">当前的用户：{{userinfo.username}}</p>
                <p class="mb-5">当前的角色：{{userinfo.role_name}}</p>
                <p>
                    分配新角色：
                    <!-- 通过 v-model双向绑定具体的值上 里面所有选项 通过for循环来生成 :label是咋们所看到的本文 :value是咋们真正选中的值 -->
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option
                            v-for="item in rolesList"
                            :key="item.id"
                            :label="item.roleName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>
   </div>
</template>

<script>

export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (regEmail.test(value)) {
        // 合法邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/

      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 定义get详情参数
      // 获取用户列表的参数对象
      queryInfo: {
        query: '', // 字串
        pagenum: 1, // 当前页码
        pagesize: 2// 当前每页显示多少条数据
      },
      // 数据保存到
      userlist: [], // 获取所有用户列表
      total: 0, // 总数据调数
      // 控制添加用户对话框的显示与隐藏
      addDialgVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3~10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '用户名的长度在6~15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editFrom: {},
      // 修改表单的验证规则对象
      editFromRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,

      // 需要被分配角色的用户信息
      userinfo: [],

      // 所有角色的数据列表
      rolesList: [],

      // 已选中的角色Id值
      selectedRoleId: ''
    }
  },
  // Vue的生命周期
  created() {
    //   在this来访问 和 调用
    // 在页面创建之前就会调用这个函数
    this.getUserList()
  },
  // 函数方法
  methods: {
  // 定义created里面的函数
  //   然后发起一个阿贾克斯
    async getUserList() {
    //   通过this调用$http点get函数发起一个请求（‘请求地址’，{携带一些get参数}）
    // 用到await就是得到一个数据对象 结构赋值一个data属性然后重命名为res
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      console.log(res)
      // 判断如果res点meta点status他不等于200数据就获取失败 然后return一个this点$message
      if (res.meta.status !== 200) {
        //   这是是如何没有return出去 数据就获取成功啦
        return this.$message.error('获取用户列表失败！')
      }
      // 这下就给他们赋值啦！
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize // pagesize: 2// 当前每页显示多少条数据
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      // 赋值
      this.queryInfo.pagenum = newPage
      // 获取数据
      this.getUserList()
    },
    // 监听 Switch 开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户的表单预设校验
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('users', this.addForm)

        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }

        this.$message.success('添加用户成功')
        // 隐藏添加用户的对话框
        this.addDialgVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
    //   console.log(id)
      const { data: res } = await this.$http.get(`users/${id}`)

      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }

      // 编辑后保存到editFrom表单数据上
      this.editFrom = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件 【修改用户-实现修改用户表单的重置操作】
    editDialogClosed() {
      this.$refs.editFromRef.resetFields()
    },
    // 修改用户信息并提交表单 【表单预设校验】
    editUserInfo() {
      this.$refs.editFromRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // 发起修改用户信息的数据请求
        // 发送网络请求    用户      id     信息
        // eslint-disable-next-line no-sequences
        const { data: res } = await this.$http.put('users/' + this.editFrom.id, {
          email: this.editFrom.email,
          mobile: this.editFrom.mobile
        })

        // 判断用户信息
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }

        // 必备三步走

        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    // 根据id删除对应的用户信息
    async removeUserById(id) {
    //   console.log(id)
    // 弹框询问用户是否测试数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err) // 简写法
      // }).catch(err => { return err }) 正常写法

      /*
        如果末个函数调用的结果返回值是Promise，咋们就是用 async await 来进行优化
        console.log(res)
      */

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      //   console.log(confirmResult)

      // 判断环节
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      //   console.log('确认了删除')

      const { data: res } = await this.$http.delete(`users/${id}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole(userinfo) {
      // 拿到userinfo之后 咋们就保存到data 共咋们页面去使用
      this.userinfo = userinfo

      // 在展示对话框之前，获取所有角色的列表
      //  发起请求 请求方法：get 请求路径：roles
      const { data: res } = await this.$http.get('roles')

      // 判断环节
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      // 如果没有return出去就 保存到一个数组 共咋们页面使用
      this.rolesList = res.data

      // 当点击分配角色 显示对话框
      this.setRoleDialogVisible = true
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }

      // 发起请求 请求方法：put 请求路径：users/:id/role
      const { data: res } = await this.$http.put(`users/${this.userinfo.id}/role`, { rid: this.selectedRoleId })

      // 判断环节
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      // 如果没有return 就更新成功了
      this.$message.success('更新角色成功！')

      // 同时咋们要刷新用户数据列表
      this.getUserList()

      // 紧接着隐藏咋们的对话框
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = '' // 重制为空
      this.userinfo = {} // 重制为空对象
    }

  }
}
</script>

<style lang="less" scoped>

</style>
