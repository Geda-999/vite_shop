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
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "", // 就你输入些搜索的关键字
        pagenum: 1, // 当前页码数
        pagesize: 10, // 每页显示多少条数据
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      // 通过this.$http 发起get请求
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });

      // 判断环节
      if (res.meta.status !== 200) {
        //   如果失败就提示以下内容
        return this.$message.error("获取商品列表失败！");
      }

      // 如果没有return出去就成功了提示
      this.$message.success("获取商品列表成功！");

      // 打印当前所获取到的数据
      console.log(res.data);

      // 赋值环节哦！！！💡
      // 成功之后
      // 注意： 获取所有商品 一定要先赋值到data中共页面使用
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
  },
};
</script>

<style lang="less" scoped></style>
