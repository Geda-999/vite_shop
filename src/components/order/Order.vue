<template>
  <div>
    <!-- 面包屑导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-4 text-xs">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 这是一行 -->
      <el-row>
        <!-- 这是一列 -->
        <el-col :span="8">
          <!-- 搜索输入框区域 -->
          <el-input placeholder="请输入内容">
            <!-- 搜索按钮 -->
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <!-- data 代表数据源 -->
      <el-table :data="orderList" border stripe>
        <!-- 这是索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="120px"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="130px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="90px"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="180px">
          <!-- 作用域插槽  scope来接收插槽里面的数据 -->
          <template slot-scope="scope">
            <!-- 接到数据之后 咋们希望将时间过滤 -->
            <!-- scope.row是这一行的数据 create_time是咋们添加的时间 用|调用全局注入时间过滤器  -->
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <!-- 物理查询按钮 -->
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        class="my-4"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <!-- 这是级联选择器 -->
        <el-form-item label="省市区/县" prop="address1">
          <!-- options 属性来指定数据源  -->
          <el-cascader :options="cityData" v-model="addressForm.address1" class="w-full"></el-cascader>
        </el-form-item>
        <!-- 输入框 -->
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物理进度的对话框 -->
    <el-dialog title="物理进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <!-- 这个是测试而已 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time"
          :icon="activity.icon"
          :type="activity.type"
          :color="activity.color"
          :size="activity.size">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>

      <!-- 这个是真实的 因为出了点问题就没继续搞了，要用记得看methods里了方法哦！！！ -->
      <!-- <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in progressVisible" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline> -->
      <span>哎呀，出错了！！！</span>
    </el-dialog>
  </div>
</template>

<script>
// 导入省市区县地址
import cityData from './citydata.js'
export default {
  // 私有数据
  data() {
    return {
      queryInfo: {
        query: '', //查询参数
        pagenum: 1, // 当前页码
        pagesize: 10, //每页显示条数
      },
      total: 0, // 总数据条数默认为0
      orderList: [], // 代表订单列表默认为空数组 数据源
      // 编辑隐藏对话框
      addressVisible: false,
      // 物理进度隐藏对话框
      progressVisible: false,
      // form表单的双向判断数据
      addressForm: {
        address1: [], //级联选择器
        address2: '', // 文本输入框
      },
      // 校验规则
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }],
      },
      // 把省市区县地址js文件 挂载到data中共页面使用
      cityData,
      // 获取物理进度的数据
      progressInfo: [],

      // 这个是时间线的假数据而已
      reverse: true,
      activities: [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: '',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more',
          color: '#0bbd87',
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: '',
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: '',
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: '',
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: '',
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: '',
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: '',
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: '',
          size: 'large',
          type: 'primary',
          icon: 'el-icon-more',
          color: '#0bbd87',
        },
      ],
    }
  },
  // 生命周期函数
  created() {
    // 调用一个函数
    // 获取当前订单列表
    this.getOrderList()
  },
  // 事件处理函数
  methods: {
    // 定义获取当前订单列表
    async getOrderList() {
      // 通过this.$http 发起get请求 get请求必须要带参数
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }

      console.log(res)

      // 赋值环节
      // 注意： 获取所有商品 一定要先赋值挂载到data中共页面使用
      this.total = res.data.total // 总数据条数
      this.orderList = res.data.goods // 代表订单列表
    },
    // 点击分页切换功能
    handleSizeChange(newSize) {
      // newSize赋值 并保存到data里面
      this.queryInfo.pagesize = newSize

      // 调用 重新获取一下数据
      this.getOrderList()
    },
    // 当前的页码值点击发生的变化
    handleCurrentChange(newPage) {
      // newPage赋值 并保存到data里面
      this.queryInfo.pagenum = newPage

      // 调用 重新获取一下数据
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox() {
      // 点击按钮显示对话框出来
      this.addressVisible = true
    },
    // 只要关闭对话框 就要把里面的内容给清空
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 物理进度按钮定义方法
    async showProgressBox() {
      // 给服务器发起请求 请求路径/kuaidi/:id 请求方法：get  供测试的物流单号：1106975712662
      //   const { data: res } = await this.$http.get('/kuaidi/1106975712662')

      //   // 判断环节来啦！！！
      //   if (res.meta.status !== 200) {
      //     // 如果 不等于200就提示以下内容
      //     return this.$message.error('获取物理进度失败！')
      //   }

      //   // 赋值环节哦！！！💡
      //   // 成功之后
      //   // 注意： 获取所有商品 一定要先赋值到data中共页面使用
      //   this.progressInfo = res.data

      // 点击按钮显示对话框出来
      this.progressVisible = true
      //   console.log(this.progressInfo)
    },
  },
}
</script>

<style lang="less" scoped></style>
