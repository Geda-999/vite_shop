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
                    <el-button type="primary">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格区域 -->
            <!-- 导入第三方插件库 -->
            <!-- data: 是数据源   selection-type：是复选框  expand-type：展开栏 show-index：是否显示数据索引[序号]  index-text：数据索引名称[#]  border：是否显示纵向边框  show-row-hover：鼠标悬停时，是否高亮当前行 -->
            <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border :show-row-hover="false"></tree-table>

            <!-- 分页区域 -->
        </el-card>
    </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      querInfo: {
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
        { label: '分类名称', prop: 'cat_name' }
      ]
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
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })

      //   接着咋们要【判断这的请求是否成功
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }

      console.log(res.data)
      // 把数据列表，赋值给 cateList
      this.cateList = res.data.result
      // 为总数据条数赋值  赋值一下值
      this.total = res.data.total
    }

  }
}
</script>

<style scoped>

</style>
