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
      selectedCateKeys: []
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
      console.log(this.selectedCateKeys)
    }
  }
}
</script>

<style scoped></style>
