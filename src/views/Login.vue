<template>
  <div>
    <div class="login-header-bg">
      <header class="container flex">
        <div class="login-header">
          <router-link to="/"><img src="../assets/images/logo.png" alt="logo" height="50px"/></router-link>
        </div>
        <div class="login-header"><h1>登录</h1></div>
      </header>
    </div>
    <div class="login-background">
      <div class="login-main">
        <img src="../assets/images/bg.png" alt="bg" class="login-bgimg">
        <div class="login-form">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="login-form-contain">
            <el-form-item prop="phone">
              <el-input
                  class="login-input"
                  placeholder="手机号"
                  prefix-icon="el-icon-phone"
                  v-model.number="ruleForm.phone"
                  clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                  class="login-input"
                  placeholder="密码"
                  prefix-icon="el-icon-lock"
                  v-model="ruleForm.password"
                  show-password
                  clearable>
              </el-input>
            </el-form-item>
            <JcRange status="status"></JcRange>
            <br>
            <el-button type="primary" round @click="submitForm('ruleForm')">登录</el-button>
            <br>

            <span>
            <router-link to="/reset">忘记密码？</router-link>| <router-link to="/register">没有账号？去注册</router-link>
            </span>
          </el-form>

        </div>
      </div>
    </div>
    <c-footer></c-footer>

  </div>
</template>

<script>
import JcRange from "@/components/JcRange";
import CFooter from "@/components/Footer";

export default {
  name: "Login",
  components: {
    JcRange,
    CFooter
  },
  data() {
    return {
      status: false,
      ruleForm: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: /^1[345789]{1}\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}

        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.status === true) {
            this.$axios.post('http://localhost:8181/user/isRegistered/' + this.ruleForm.phone).then((resp) => {
              if (resp.data === true) {
                this.$axios.post('http://localhost:8181/user/checkPassword' , this.ruleForm).then((resp) => {
                  if (resp.data === true) {
                    this.$axios.post('http://localhost:8181/user/login', this.ruleForm).then((resp) => {
                      if ('已停用' !== resp.data.status) {
                        this.$message({
                          message: '登录成功',
                          type: 'success'
                        });
                        const user = resp.data;
                        window.sessionStorage.setItem("userId", user.userId)
                        window.sessionStorage.setItem("token", user.token)
                        this.$axios.post("http://localhost:8181/cart/countCartByUserId/"+user.userId).then((resp)=>{
                          this.$store.commit('setCartCount',resp.data)
                        })
                        this.$router.push('/')
                      }else {
                        this.$message.error('账号已停用！');
                      }
                    })
                  } else {
                    this.$message.error('密码错误！');
                  }
                })
              } else {
                this.$message.error('账号不存在！');
              }
            })
          } else {
            this.$message.error('请拖动验证滑块');
            return false;
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}

</script>

<style lang="less">
@import "../assets/style/common";

.login-header-bg {
  background-color: #fff;
}

.login-header {
  margin: 20px;
}

.login-background {
  background-color: @color2;
  //background-color: #414dd9;
  //background-color: @main-color;
  width: 100%;
  height: 550px;
}

.login-main {
  width: 1200px;
  margin: 0 auto;
  .between-center;
  padding: 30px;
}

.login-bgimg {
  height: 500px;
}

.login-form {
  width: 400px;
  background-color: white;
  padding: 30px;
  border-radius: 4px

}

.login-form-contain {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-input {
  width: 300px;
  display: block;
}
</style>
