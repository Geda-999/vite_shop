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
      <!-- 一个大表单 包裹的 tab栏 -->
      <!-- :model="addForm"这是添加商品的表单 -->
      <!-- :rules="rules"这是验证规则 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activeIndex" :tab-position="'left'">
          <el-tab-pane label="基本信息" name="0">
            <!-- 这是表单的i项 -->
            <!-- label这是你所看到的标题名称  prop这是表单的校验规则 -->
            <el-form-item label="商品名称" prop="goods_name">
              <!-- v-model这是输入框 输入的值双向判定到【:model="addForm"】某个属性上 属性名不要乱写 -->
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <!-- v-model这是输入框 输入的值双向判定到【:model="addForm"】某个属性上 属性名不要乱写 -->
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <!-- v-model这是输入框 输入的值双向判定到【:model="addForm"】某个属性上 属性名不要乱写 -->
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <!-- v-model这是输入框 输入的值双向判定到【:model="addForm"】某个属性上 属性名不要乱写 -->
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
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

      //添加商品的表单数据对象
      addForm: {
        goods_name: '', // 商品名称
        goods_price: '', // 商品价格
        goods_weight: '', // 商品重量
        goods_number: '', //商品数量
      },

      // 表单验证规则
      addFormRules: {
        // 商品名称做一个校验规则
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
      },
    }
  },
  // 这是生命周期函数
  created() {},

  // 所有的事件处理函数 他是一个对象
  methods: {},
}
</script>

<style lang="less" scoped></style>
