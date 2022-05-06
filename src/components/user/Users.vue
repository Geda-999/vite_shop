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
                    <el-input placeholder="请输入内容" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表区域 -->
            <!-- :data是数据源  border：边框线 stripe：各行变色效果-->
            <el-table :data="userlist" border stripe class="mt-4 text-xs">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state"></el-table-column>
                <el-table-column label="操作"></el-table-column>
            </el-table>
        </el-card>
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
        pagesize: 2// 每页显示条数
      },
      // 数据保存到
      userlist: [], // 获取所有用户列表
      total: 0 // 总数据调数
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
    }

  }
}
</script>

<style lang="less" scoped>

</style>
