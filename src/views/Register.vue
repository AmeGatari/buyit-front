<template>
  <div>
    <div class="register-header-bg">
      <header class="container flex">
        <div class="register-header">
          <router-link to="/"><img src="../assets/images/logo.png" alt="logo" height="50px"/></router-link>
        </div>
        <div class="register-header"><h1>注册</h1></div>
      </header>
    </div>

    <div class="register-background">
      <div class="register-main">
        <img src="../assets/images/bg.png" alt="bg" class="register-bgimg">
        <div class="register-form">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="register-form-contain">
            <el-form-item prop="phone">
              <el-input
                  class="register-input"
                  placeholder="手机号"
                  prefix-icon="el-icon-phone"
                  v-model.number="ruleForm.phone"
                  clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="verificationCode">
              <el-input
                  class="register-input"
                  placeholder="验证码"
                  prefix-icon="el-icon-key"
                  v-model.number="ruleForm.verificationCode"
                  clearable>
                <el-button slot="append" @click="sendCode">发送验证码</el-button>
              </el-input>
            </el-form-item>
            <el-form-item prop="userName">
              <el-input
                  class="register-input"
                  placeholder="昵称"
                  prefix-icon="el-icon-user"
                  v-model="ruleForm.userName"
                  clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                  class="register-input"
                  placeholder="密码"
                  prefix-icon="el-icon-lock"
                  v-model="ruleForm.password"
                  show-password
                  clearable>
              </el-input>
            </el-form-item>
            <el-form-item prop="password2">
              <el-input
                  class="register-input"
                  placeholder="确认密码"
                  prefix-icon="el-icon-lock"
                  v-model="ruleForm.password2"
                  show-password
                  clearable>
              </el-input>
            </el-form-item>
            <JcRange status="status"></JcRange>
            <br>
            <el-button type="primary" round @click="submitForm('ruleForm')">注册</el-button>
            <br>
            <router-link to="/login">已有账号？去登录</router-link>
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

  name: "Register",
  components: {
    JcRange,
    CFooter
  },
  data() {
    let validatePassword = (rule, value, callback) => {
      if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      status: false,
      vCode:'',
      vPhone:'',
      ruleForm: {
        phone: '',
        verificationCode:'',
        userName: '',
        password: '',
        password2: '',
      },
      rules: {
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: /^1[345789]{1}\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        userName: [
          {required: true, message: '请输入昵称', trigger: 'blur'}
        ],
        verificationCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        password2: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          {validator: validatePassword, trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    sendCode() {
      this.vPhone = this.ruleForm.phone
      this.$axios.post('http://localhost:8181/user/isRegistered/' + this.vPhone).then((resp) => {
        if (resp.data) {
          this.$message.error('手机号已被注册！');
        } else {
          this.$axios.post('http://localhost:8181/user/sendCode/' + this.vPhone).then((resp) => {
            this.vCode = resp.data
            this.$message.success("验证码发送成功")
          })
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          if (this.status === true) {
            // this.$axios.post('http://localhost:8181/user/isRegistered/' + this.ruleForm.phone).then((resp) => {
            //   if (resp.data) {
            //     this.$message.error('手机号已被注册！');
            //   } else {
                if ((this.vPhone === this.ruleForm.phone) && (this.vCode === this.ruleForm.verificationCode)) {
                  this.$axios.post('http://localhost:8181/user/register', this.ruleForm).then((resp) => {
                    if (resp.data > 0) {
                      this.$message({
                        message: '注册成功',
                        type: 'success'
                      })
                      this.$router.push('/login');
                    } else {
                      this.$message.error('注册失败！');
                    }
                  })
                } else {
                  this.$message.error("验证码错误！")
                }
            //   }
            // })
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

.register-header-bg {
  background-color: #fff;
}

.register-header {
  margin: 20px;
}

.register-background {
  background-color: @color2;
  //background-color: @main-color;
  width: 100%;
  height: 550px;
}

.register-main {
  width: 1200px;
  margin: 0 auto;
  .between-center;
  padding: 30px;
}

.register-bgimg {
  height: 500px;
}

.register-form {
  width: 400px;
  background-color: white;
  padding: 30px;
  border-radius: 4px

}

.register-form-contain {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register-input {
  width: 300px;
}

</style>
