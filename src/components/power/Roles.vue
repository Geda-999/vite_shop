<template>
    <div>
        <!-- 面包屑导航栏区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-4 text-xs">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
        </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: []
    }
  },
  // 生命周期函数
  created() {
    // 咋们在这个生命周期函数中获取所有角色列表数据
    // 先定义一个方法
    this.getRoleList()
  },
  methods: {
    // 获取所有角色的列表
    async getRoleList() {
      // 要获取数据的话就要调用this点$http这个对象
      // 然后发起请求
      const { data: res } = await this.$http.get('roles')
      console.log(res)

      //   然后咋们就来判断了
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }

      // 哪如果没有失败的话，咋们需要将获取到了列表数据保存到rolelist的身上
      this.rolelist = res.data
      console.log(this.rolelist)
    }
  }
}
</script>

<style scoped>

</style>
