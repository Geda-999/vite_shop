<template>
  <div>
    <!-- 面包屑导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-4 text-xs">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2、为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
// 1、导入echarts可视化图表库
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  created() {},

  // 此时，页面上的元素，已经被渲染完毕了！
  async mounted() {
    // 3、基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 发起get请求 获取折线图的数据
    // 如果获取到的数据直接交给图表展示会缺少鼠标跟随的效果
    // 如果咋们自己的数据粘贴到data里面去
    // 然后 将咋们服务器返回来的数据 和 咋们私有数据选项 做合并
    // 会得到一个新的对象
    // 然后咋们将最终这 result 赋值给咋们图表 来进行展示
    const { data: res } = await this.$http.get('reports/type/1')

    // console.log(res)

    // 做一下判断了
    if (res.meta.status !== 200) {
      return this.$message.error('获取折线图数据失败！')
    }

    // 那如果数据没有失败的话，那么可以直接res.data当做这哥图表的数据 传到第五步中

    // 第四步咋们有数据的就可以把他删除了
    // 4、准备数据和配置项
    // 指定图表的配置项和数据
    // var option = {
    //   title: {
    //     text: 'ECharts 入门示例',
    //   },
    //   tooltip: {},
    //   legend: {
    //     data: ['销量'],
    //   },
    //   xAxis: {
    //     data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
    //   },
    //   yAxis: {},
    //   series: [
    //     {
    //       name: '销量',
    //       type: 'bar',
    //       data: [5, 20, 36, 10, 10, 20],
    //     },
    //   ],
    // }

    // 4、准备数据和配置项
    // 这里是合并两个对象的操作
    // 将咋们服务器返回来的数据 和 咋们私有数据选项 做合并
    // 会返回新的对象
    // 然后咋们将最终这 result 赋值给咋们图表 来进行展示
    const result = _.merge(res.data, this.options)

    console.log(result)

    // 5、展示数据
    // 使用刚指定的配置项和数据显示图表。
    // 需要调用echarts函数
    myChart.setOption(result)
  },
  methods: {},
}
</script>

<style lang="less" scoped></style>
