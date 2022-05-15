<template>
  <el-container class="h-full">
  <!-- 头部区域 -->
  <el-header class="flex justify-between pl-0">
    <div class="flex items-center">
      <img src="../assets/heima.png" alt="">
      <span class="ml-4 text-xl text-pink-100">电商后台管理系统</span>
    </div>
    <el-button class="h-10 mt-3" type="info" @click="logout">退出</el-button>
  </el-header>
  <!-- 页面主体 -->
  <el-container>
  <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
    <div @click="toggleCollapse" class=" bg-gray-500 text-center text-xs text-white p-2 tracking-widest cursor-pointer">|||</div>
    <!-- 侧边栏菜单区域 -->
    <!-- unique-opened是否只保持一个子菜单的展开 -->
        <el-menu
            :default-active="activePath"
            class="el-menu-vertical-demo"
            background-color="#333744"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                <!-- 一级菜单的模板区域 -->
                <template slot="title">
                    <!-- 图标 -->
                    <i :class="iconsObj[item.id]" class="mr-2"></i>
                    <!-- 文本 -->
                    <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item
                    :index="'/' + subItem.path"
                    v-for="subItem in item.children"
                    :key="subItem.id"
                    @click="saveNavState('/' + subItem.path)">
                    <!-- 一级菜单的模板区域 -->
                    <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-menu mr-2" :class="iconsObj.list[subItem.id]"></i>
                        <!-- 文本 -->
                        <span>{{subItem.authName}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
    </el-aside>
    <!-- 右侧内容主体 -->
    <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      //  左侧菜单图标
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao',
        list: {
          110: 'iconfont icon-morentouxiang',
          111: 'iconfont icon-users',
          112: 'iconfont icon-lock_fill',
          104: 'el-icon-s-goods',
          115: 'el-icon-loading',
          121: 'el-icon-magic-stick',
          107: 'el-icon-s-claim',
          146: 'el-icon-s-data'
        }
      },
      //   是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created() {
    this.getMenuList()
    // 赋值
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      // 清空sessionStorage中的token
      window.sessionStorage.clear()
      // 跳转到登录页面
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      //   console.log(res)
      // 赋值环节
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      // 保存到本地存储                  键            值
      window.sessionStorage.setItem('activePath', activePath)
      // eslint-disable-next-line no-undef
      // 重新赋值 高亮
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: #373d41;
//   background-color: #fff;
}
.el-aside{
  background-color: #333744;
  .el-menu{
      border-right: none;
  }
}
.el-main{
  background-color: #EAEDF1;
}
</style>
