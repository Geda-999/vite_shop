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
            <el-table :data="rolelist" border stripe>
                <!-- 展开列 type="expand" -->
                <el-table-column type="expand">
                    <!-- 插槽  -->
                    <template slot-scope="scope">
                    <!-- Layout 布局 -->
                    <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'flex','items-center']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                        <!-- 总共有24列  :span="5"让他站五列 -->
                        <!-- 渲染一级权限 -->
                        <el-col :span="5">
                            <!-- Tag 标签 -->
                            <el-tag closable @close="removeRightByIs(scope.row, item1.id)">{{item1.authName}}</el-tag>
                            <!-- 三角形 icon -->
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二级和三级权限 -->
                        <el-col :span="19">
                            <!-- 通过 for 循环 嵌套渲染二级权限 -->
                            <el-row :class="[i2 === 0 ? '' : 'bdtop', 'flex','items-center']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                <el-col :span="6">
                                    <el-tag type="success" closable @close="removeRightByIs(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightByIs(scope.row, item3.id)">
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                     <!-- 结构信息美化 对象 -->
                     <!-- <pre>
                        {{scope.row}}
                     </pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <!-- 插槽 Button 按钮 -->
                    <template>
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
    },
    // 根据Id删除对应的权限
    async removeRightByIs(role, rightId) {
      // 弹框提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 结果的判断用户是否删除对应的权限
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      //   console.log('确认删除')

      // 接下来就发起删除的请求了
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)

      // 判断环节了
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }

      // 删除成功 就重新刷新数据列表【不建议去调这个函数，会发生页面完整渲染】
      //   this.getRoleList()

      // 咋们可以当前这个角色信息 重新赋值一下权限就行了
      // 注意点 一定要 把服务器返回最新的权限，直接赋值给当前角色了children属性【这种就防止整个列表的刷新】
      role.children = res.data
    }
  }
}
</script>

<style scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
</style>
