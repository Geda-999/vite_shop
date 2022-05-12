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
                    <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
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
                    <template  slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                        <!-- 分配权限 -->
                        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限的对话框 -->
        <el-dialog
            title="分配权限"
            :visible.sync="setRightDialogVisible"
            width="50%"
            @close="setRightDialogClosed">
            <!-- 树形控制 通过data：绑定数据源，通过props: 指定咋们的属性绑定对象 -->
            <!-- 树形控件
                bug点:  写出:data="rolesList"  改成 :data="rightsList"
                #
                注意点: 这个  node-key="id"  id 猜测是从
                        :data="rightsList"绑定的rightsList: []数组对象取出来每单个对象的id
            -->
            <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

            <!-- 添加角色的对话框 -->
        <el-dialog
            :visible.sync="addRoleDialogVisible"
            title="添加角色"
            width="35%"
            @close="addDialogClosed">
            <!-- 内容主体区域 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
                <!-- prop=username 对应了 addFormRules中的username校验规则-->
                <el-form-item label="角色名称" label-width="85px" prop="roleName">
                <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" label-width="85px" prop="roleDesc">
                <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],

      // 控制分配权限对话框显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],

      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName', // 看到那个属性的值
        children: 'children' // 通过父子节点 来实现咋们的嵌套了
      },
      // 默认选中的节点Id值数据组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: '',
      // 控制添加角色对话框的显示与隐藏
      addRoleDialogVisible: false,
      // 添加角色
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 6,
            message: '角色名称长度在 2 到 6 个字符',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }
        ]
      }
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
    },

    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      // 把 id 保存到data中
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')

      //   然后咋们就来判断了
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }

      //   赋值环节
      // 把获取到的权限数据保存到 data 中
      this.rightslist = res.data

      // 验证获取成功的打印一下
      console.log(this.rightslist)

      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys)

      // 当前分配权限点击的时候就弹出对话框来
      this.setRightDialogVisible = true
    },

    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
    getLeafKeys(node, arr) {
      // 如果当前 node 节点不包含 children 属性节点
      if (!node.children) {
        return arr.push(node.id)
      }

      // 递归环节
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },

    // 监听分配权限对话框的关闭事件 [注意这个小bug哦]
    setRightDialogClosed() {
      this.defKeys = [] // 重新赋值就好了
    },

    // 点击为角色分配权限
    async allotRights() {
      // 在这个数组中获取所有被选中、叶子节点的key和半选中节点的key,
      const keys = [
        // 我们把两个数组给合并成一个新数组了
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      // 打印这个新新数组
      //   console.log(keys) // 获取所有id

      // 已英文的逗号来拼接的字符串
      const idStr = keys.join(',')

      // 发起请求  请求方法：post
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })

      // 紧接着 咋们判断环节来
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      // 如果没有return出去就更新权限成功了
      this.$message.success('分配权限成功！')

      // 成功之后咋们需要做重新刷新 这个数据列表
      this.getRoleList()

      // 刷新数据列表之后呢，咋们还要把整个对话框给隐藏
      this.setRightDialogVisible = false
    },

    // 添加角色
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('roles', this.addForm)

        // 判断环节
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }

        // 如果没有return出去就添加成功了
        this.$message.success('添加用户成功！')

        // 成功之后咋们需要做 重新刷新 这个数据列表
        this.getRoleList()

        // 隐藏添加用户的对话框
        this.addRoleDialogVisible = false
      })
    },
    // 监听 添加角色对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
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
