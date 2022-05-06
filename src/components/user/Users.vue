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
                    <template>
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                           <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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
            width="50%">
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
                <el-button type="primary" @click="addDialgVisible = false">确 定</el-button>
            </span>
        </el-dialog>
   </div>
</template>

<script>

export default {
  data() {
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
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ]
      }
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
    }

  }
}
</script>

<style lang="less" scoped>

</style>
