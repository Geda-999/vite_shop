<template>

  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <!-- 头像区域-->
        <img alt="#" src="../assets/logo.png">
      </div>

      <!-- 登录表单区域-->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form" label-width="0px">
        <!-- 用户名-->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码-->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>

        <!-- 登录按钮区域-->
        <el-form-item class="btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        // ESLint：字符串必须使用单引号。(quotes)
        username: 'Zs',
        password: '123'
      },
      // 这是表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          {
            required: true,
            message: '请输入登录名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 8,
            max: 16,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    /**
     * 点击重置按钮, 重置登录表单
     */
    resetLoginForm: function () {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    }
  }

}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
