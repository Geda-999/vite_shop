<template>
  <div>
    <!-- 面包屑导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-4 text-xs">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 这是一行 -->
      <el-row :gutter="20">
        <!-- 这是第一列 -->
        <!-- span这是站了8个位置 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- 这是第二列 -->
        <!-- span这是站了4个位置 -->
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table 表格区域 -->
      <!-- 表格 :data="goodsList"这是数据源 -->
      <!--  border这是边框  stripe这是隔行变色 -->
      <el-table class="my-4" :data="goodsList" border stripe>
        <!-- 这是索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="95px"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170px">
          <!-- 作用域插槽  scope来接收插槽里面的数据 -->
          <template slot-scope="scope">
            <!-- 接到数据之后 咋们希望将时间过滤 -->
            <!-- scope.row是这一行的数据 add_time是咋们添加的时间 用|调用全局注入时间过滤器  -->
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <!-- 作用域插槽 -->
          <!-- scope来接收这一行的数据 -->
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '', // 就你输入些搜索的关键字
        pagenum: 1, // 当前页码数
        pagesize: 10, // 每页显示多少条数据
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      // 通过this.$http 发起get请求
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })

      // 判断环节
      if (res.meta.status !== 200) {
        //   如果失败就提示以下内容
        return this.$message.error('获取商品列表失败！')
      }

      // 如果没有return出去就成功了提示
      this.$message.success('获取商品列表成功！')

      // 打印当前所获取到的数据
      console.log(res.data)

      // 赋值环节哦！！！💡
      // 成功之后
      // 注意： 获取所有商品 一定要先赋值到data中共页面使用
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    // 点击分页切换功能
    handleSizeChange(newSize) {
      // newSize赋值 并保存到data里面
      this.queryInfo.pagesize = newSize

      // 调用 重新获取一下数据
      this.getGoodsList()
    },
    // 当前的页码值点击发生的变化
    handleCurrentChange(newPage) {
      // newPage赋值 并保存到data里面
      this.queryInfo.pagenum = newPage

      // 调用 重新获取一下数据
      this.getGoodsList()
    },
  },
}
</script>

<style lang="less" scoped></style>
