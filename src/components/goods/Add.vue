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
        <!-- before-leave 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。 -->
        <!-- tab-click 这是tab 被选中时触发 -->
        <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="tabClicked">
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
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- options这个是数据源头 就是定义在data中的【cateList: [],】 -->
              <el-cascader expand-trigger="hover" :props="cateProps" :options="cateList" v-model="addForm.goods_cat" @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableDta" :key="item.attr_id">
              <!-- 这是复选框组 -->
              <!-- 注意：数据是从res.data.forEach里面的 if 拿的哦 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb, i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- Form 表单由输入框 -->
            <!-- 注意：数据是从res.data.forEach里面的 else if 拿的哦 -->
            <el-form-item :label="item.attr_name" v-for="item in onlyTableDta" :key="item.attr_id">
              <el-input v-model="item.attr_vals" size="normal"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- Upload 上传 -->
            <!-- action 表示图片要上传到的后台api地址 -->
            <!-- on-preview 这个属性时用来指定预览的事件了 就预览图片功能 -->
            <!-- on-remove 这个就图片右上角的叉号 事件处理函数 -->
            <!-- file-list 这个是指定文件列表了 然后我们不需要文件列表我就删除了 -->
            <!-- list-type	文件列表的类型 -->
            <!-- headers  设置上传的请求头部 -->
            <!-- on-success 文件上传成功时的钩子 上传图片成功就立即调佣这个事件处理函数 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture" :headers="headerObj" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>

            <!--添加商品的按钮  -->
            <el-button type="primary" class="mt-4" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 对话框 -->
    <!-- 那么什么时候去展示 这个预览窗口呢 -->
    <!-- 那肯定是触发 咋们on-preview事件的时候 把咋们窗口给他展示出来 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="w-full" />
    </el-dialog>
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
        goods_cat: [], // 商品所属的分类数组
        pics: [], // 图片的数组
        goods_introduce: '', // 商品的详情描述
      },

      // 表单验证规则
      addFormRules: {
        // 商品名称做一个校验规则
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
      },

      // 获取所有商品分类列表
      cateList: [],

      // 级联选择框的配置对象
      cateProps: {
        value: 'cat_id', // 指定咋们选中的那个值   【咋们通过cat_id来做那个值】
        label: 'cat_name', // 指定你所看到那个名称 【咋们通过cat_name来做那个名称】
        children: 'children', // 父子节点的嵌套属性 【咋们通过children来做那个名称】
      },
      // 动态参数表单数据
      manyTableDta: [],
      // 静态属性列表数据
      onlyTableDta: [],
      // 上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        // 在这包含着验证Authorization
        // 他的值在保存在sessionStorage 就是浏览器的数据库
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 触发预览图片数据的时候 为他赋值
      previewPath: '',
      // 布尔值 默认是隐藏对话框
      previewVisible: false,
    }
  },
  // 这是生命周期函数
  created() {
    // 咋们来调用一个方法
    this.getCateList()
  },

  // 所有的事件处理函数 他是一个对象
  methods: {
    // 定义一个方法
    // 获取所有商品分类数据
    async getCateList() {
      // 通过this.$http 发起get请求
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        // 如果失败就提示以下内容
        return this.$message.error('获取商品分类数据失败！')
      }

      // 成功之后
      // 注意： 获取所有商品 一定要先赋值到data中共页面使用 渲染
      this.cateList = res.data

      // 打印出来所有商品数据
      console.log(this.cateList)
    },
    // 级联选择器 选中项 变化，会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat)

      // 如果不等于3的话 那就证明选中的不是三级分类
      // 不等于3就直接清空
      // 等于3就不做任何操作
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [] // 清空数组
      }
    },
    // 切换标签之前的钩子
    beforeTabLeave(activeName, oldActiveName) {
      //   console.log(`即将离开的标签页名字是：${oldActiveName}`)
      //   console.log(`即将进入的标签页名字是：${activeName}`)
      //   return false

      // 判断 即将离开的标签页名字是 是否等于零 同时你选中了商品分类了length长度是否等于3
      // 如果不等于3的话 那就直接return出去 如果等于3就发生切换就好的
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        // 如果失败就提示以下内容
        this.$message.error('请选择商品分类！')
        return false
      }
    },
    // tab 被选中时触发
    async tabClicked() {
      // 是把当前激活的那个index给他打印出来
      //   console.log(this.activeIndex)

      /*
            这是判断逻辑
            如果咋们当前了name名称【activeIndex】等于1的话证明你点进了商品参数面板，那就立即发起动态参数的数据请求
      */

      // 证明访问的是动态参数面板
      // 如果this.activeIndex 等于字符串 1 的话 证明你访问的是动态参数面板
      if (this.activeIndex === '1') {
        // console.log(动态参数面板)

        // 成功可以访问到动态参数面板
        // 就可以发起请求了
        // /:id/这个是咋们的表单数据对象
        // /:id/已经被咋们设计成计算属性了
        // 要写这么长在这里就不太合理 然后把【this.addForm.goods_cat[2]】变成【this.cateId】
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          // 哪分类Id指定成功之后 咋们需要 通过get了方式服务器发送一个参数
          // 那这个参数叫什么呢 sel 他的值是 many 代表咋们要获取动态参数的列表数据
          params: { sel: 'many' },
        })

        //   那么接收完上面的请求 之后 接下来 可以做一个判断啦

        // 如果这res.meta.status 不等于200的话 那就获取数据失败了
        if (res.meta.status !== 200) {
          // 直接return一个$message 提示他
          return this.$message.error('动态参数列表失败！')
        }

        // 哪如果没有return出去 哪证明获取的数据成功啦
        console.log(res.data)

        /*
            哪此时在终端中打印 当前分类下对应 动态参数 数据列表
            那接下来 拿到 数据之后 咋们应该把这些数据啊
            保存到data中身上 从而共咋们页面使用 和 渲染
        */

        // 字符串变数组环节来啦✨🚀✨
        // 在赋值之前将他们的每一项都做一次循环
        res.data.forEach(item => {
          // 每循环一次都会拿到一个item项
          // 咋们每拿到一个item项 就将他们了【item.attr_vals 】用【split】做分割 里面写一个空格
          // 哪接下来他的返回值 是一个数组 我们需要重新给当前【item.attr_vals 】给他赋值一下
          // 已经过这个环节他就变成数组了
          // 我们先【item.attr_vals】这个字符串做一个判断
          // 哪如果他不为空就直接【item.attr_vals.split(' ')】分割

          // 哪在 split 之前啊 先判断一下他 是否为空字符串
          // 如果他为空字符串 那么咋们没必要调用 split 直接返回空数组就行了
          // 所以在这写一个三元表达式
          // item.attr_vals.length 是否等于0
          // 如果等于0 的话 咋们直接返回一个空数组
          // 否则先做一个分割 在把分割后的数组 在返回
          // 将返回的数组 再重新 赋值 给item.attr_vals
          // 那已过 forEach 之后 每一项身上 attr_vals 就从字符串 变成了 数组啦
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')

          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框中输入的值
          item.inputValue = ''
        })

        // 哪直接赋值就行了【manyTableDta】一定要定义在data节点中哦！！！
        this.manyTableDta = res.data
      }
      // 如果 this.activeIndex 等于字符串 2 的话 证明你访问的是静态属性面板
      else if (this.activeIndex === '2') {
        // /:id/已经被咋们设计成计算属性了 然后把【this.addForm.goods_cat[2]】变成【this.cateId】
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          // 哪分类Id指定成功之后 咋们需要 通过get了方式服务器发送一个参数
          // 那这个参数叫什么呢 sel 他的值是 only 代表咋们要获取动态参数的列表数据
          params: { sel: 'only' },
        })

        // 那么接收完上面的请求 之后 接下来 可以做一个判断啦
        // 如果这res.meta.status 不等于200的话 那就获取数据失败了
        if (res.meta.status !== 200) {
          // 直接return一个$message 提示他
          this.$message.error('获取静态属性失败！')
        }

        // 哪如果没有return出去 哪证明获取的数据成功啦
        console.log(res.data)

        // 哪直接赋值就行了【onlyTableDta】一定要定义在data节点中哦！！！
        this.onlyTableDta = res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      console.log(file)
      // 给他赋值环节
      // 赋值完毕之后 我们就可以 在页面上 去放一个对话框 从而展示出 对应的图片的
      this.previewPath = file.response.data.url

      // 上面的赋值完毕之后 就显示对话框 图片窗口里的数据出来
      this.previewVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file) {
      //   console.log(file)
      // 1、获取将要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      // 2、从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3、调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
      // 删除完毕之后 打印一下
      console.log(this.addForm)
    },

    // 监听图片上传成功的事件
    // 在这个事件中可以拿到response 就是服务器返回的数据对象
    handleSuccess(response) {
      console.log(response)
      // 1、拼接得到一个图片信息对象
      const picInfo = {
        pic: response.data.tmp_path,
      }
      // 2、将图片信息对象，push 到 pics数组中
      this.addForm.pics.push(picInfo)
      // 那每追加一次 打印一下
      console.log(this.addForm)
    },
    // 添加商品
    add() {
      console.log(this.addForm)
    },
  },
  // 计算属性
  //  computed指向一个对象
  computed: {
    // 其中定义一个计算属性叫做【cateId】
    cateId() {
      // 咋们在这做一个判断啊
      // 如果this.addForm.goods_cat.length等于3了，那就证明咋们包含的3级商品分类
      if (this.addForm.goods_cat.length === 3) {
        //  咋们直接return 【this.addForm.goods_cat】这是一个数组，把索引为[2] 直接return出去就行了
        return this.addForm.goods_cat[2]
      }

      // 哪如果不等于3的话 那肯定不会走if 咋们就直接return一个null证明你没有三级分类的Id
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
