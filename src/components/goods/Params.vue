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
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加参数</el-button>
                </el-tab-pane>

                <!-- 添加静态属性的面板   only:是静态了 -->
                <el-tab-pane label="静态属性" name="only">
                    <!-- 添加属性的按钮 -->
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled">添加属性</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-col>
      </el-row>
    </el-card>
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
      activeName: 'many' // 被激活的页签的名称
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
    async handleChange() {
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
    },
    // tab 页签点击事件的处理函数
    handleTabClick() {
      console.log(this.activeName)
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
    }
  }
}
</script>

<style scoped></style>
