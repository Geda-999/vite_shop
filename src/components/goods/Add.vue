<template>
  <div>
    <!-- 面包屑导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-4 text-xs">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!-- 步骤条区域 -->
      <!-- active这个不要写死他 要判定到data中才灵活 -->
      <!-- 字符串转换数字 -->
      <!-- active 如果你要将一个长得 像数字的字符串 转换成数字的话 以最简单的方法就是给他【-0】就行了 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <!-- v-model判定到 步骤条 :active身上 从而来获取联动信息  -->
      <!-- name="0"就是代码 步骤条 里的第一个 -->
      <el-tabs v-model="activeIndex" :tab-position="'left'" style="height: 200px">
        <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
// 这是行为区域
export default {
  // 这是私有数据
  data() {
    return {
      // 商品添加-实现步骤条和ab栏的数据联动效果
      activeIndex: '0',
    }
  },
  // 这是生命周期函数
  created() {},
  // 所有的事件处理函数 他是一个对象
}
</script>

<style lang="less" scoped></style>
