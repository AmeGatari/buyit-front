<template>
  <div class="container">
    <div class="user-panel">
      <div>
        <el-tooltip effect="dark" content="点击上传头像" placement="bottom">
          <!--          <el-avatar icon="el-icon-user-solid" :size="300" shape="square" :src="user.avatar"></el-avatar>-->
          <el-upload
              class="avatar-uploader"
              action="http://localhost:8181/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              accept="image/*"
              name="picture"
              :data="{uploadType:'avatar',id:user.userId}">
            <img v-if="user.avatar" :src="user.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tooltip>
      </div>

      <el-form :model="user" :rules="rules" ref="user" class="user-info">
        <el-form-item label="用户ID" class="user-info-item">
          {{ user.userId }}
        </el-form-item>
        <el-form-item label="手机号" class="user-info-item">
          {{ user.phone }}
        </el-form-item>
        <el-form-item prop="userName" label="昵称" class="user-info-item">
          <el-input v-model="user.userName" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" class="user-info-item">
          <el-radio-group v-model="user.sex">
            <el-radio label="男" border>男</el-radio>
            <el-radio label="女" border>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期" class="user-info-item">
          <el-date-picker
              v-model="user.birthday"
              type="date"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-button type="primary" round @click="onSubmit('user')">保存</el-button>
      </el-form>
      <div style="margin-left: 50px">
        <el-link :underline="false" type="primary" style="margin: 10px;" @click="setPassword">修改密码</el-link>
        <el-link :underline="false" type="primary" style="margin: 10px;" @click="changePhone">修改绑定手机号</el-link>
      </div>

    </div>

    <!--修改密码对话框-->
    <el-dialog title="修改密码" :visible.sync="setPasswordDialogFormVisible" width="300px">

      <el-form :model="userPassword" :rules="setPasswordRules" ref="userPassword">

        <el-form-item label="输入原密码" prop="password">
          <el-input v-model="userPassword.password" clearable show-password></el-input>
        </el-form-item>

        <el-form-item label="输入新密码" prop="newPassword">
          <el-input v-model="userPassword.newPassword" clearable show-password></el-input>
        </el-form-item>

        <el-form-item label="确认新密码" prop="newPassword2">
          <el-input v-model="userPassword.newPassword2" clearable show-password></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="setPasswordDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetPassword('userPassword')">确 定</el-button>
      </div>
    </el-dialog>

    <!--修改绑定手机号对话框-->
    <el-dialog title="修改绑定手机号" :visible.sync="changePhoneDialogFormVisible" width="300px">

      <el-form :model="userPhone" :rules="rules" ref="userPhone">

        <el-form-item label="输入新手机号" prop="phone">
          <el-input v-model.number="userPhone.phone" clearable></el-input>
        </el-form-item>

        <el-form-item label="输入验证码" prop="verificationCode">
          <el-input v-model.number="userPhone.verificationCode" clearable>
            <el-button slot="append" @click="sendCode">发送验证码</el-button>
          </el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="changePhoneDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveChangePhone('userPhone')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "UserInfo",
  data() {
    let validateChangePassword = (rule, value, callback) => {
      if (value !== this.userPassword.newPassword) {
        callback(new Error('两次输入新密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      vCode: '',
      vPhone: '',
      setPasswordDialogFormVisible: false,
      changePhoneDialogFormVisible: false,
      userPassword: {},
      userPhone: {},
      user: {
        userId: window.sessionStorage.getItem("userId"),
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
      },
      setPasswordRules: {
        password: [
          {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'}
        ],
        newPassword2: [
          {required: true, message: '请再次输入密码', trigger: 'blur'},
          {validator: validateChangePassword, trigger: 'blur'}
        ]
      },
    }
  },
  created() {
    this.$store.commit('setHeaderText','个人中心')
    this.getData()
  },
  methods: {
    getData() {
      this.$axios.post('http://localhost:8181/user/findUserByUserId/' + this.user.userId).then((resp) => {
        this.user = resp.data
      })

    },
    onSubmit(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8181/user/setUserInfo', this.user).then((resp) => {
            if (resp.data > 0) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              // self.setInterval(function () {
              //   location.reload()
              // }, 1000)
              this.getData()
            } else {
              this.$message.error('保存失败！');
            }
          })
        }
      })

    },
    beforeAvatarUpload(file) {
      const isIMG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isIMG) {
        this.$message.error('只能上传图片文件!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isIMG && isLt2M;
    },
    handleAvatarSuccess() {
      console.log('test')
      this.$message({
        message: '上传成功',
        type: 'success'
      });
    },

    setPassword() {
      this.setPasswordDialogFormVisible = true
      this.userPassword = {}
    },

    changePhone() {
      this.changePhoneDialogFormVisible = true
    },

    sendCode() {
      this.vPhone = this.userPhone.phone
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

    saveSetPassword(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.userPassword.userId = this.user.userId
          this.userPassword.phone = this.user.phone
          this.$axios.post('http://localhost:8181/user/checkPassword', this.userPassword).then((resp) => {
            if (resp.data === true) {
              this.userPassword.password = this.userPassword.newPassword
              this.$axios.post('http://localhost:8181/user/setUserPassword', this.userPassword).then((resp) => {
                if (resp.data > 0) {
                  this.$message({
                    message: '密码已修改',
                    type: 'success'
                  });
                }
                this.getData()
              })
            } else {
              this.$message.error("原密码错误！")
            }
          })
          this.setPasswordDialogFormVisible = false
        }
      })
    },

    saveChangePhone(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.userPhone.userId=this.user.userId
          if ((this.vPhone === this.userPhone.phone) && (this.vCode === this.userPhone.verificationCode)) {
            this.$axios.post('http://localhost:8181/user/changePhone', this.userPhone).then((resp) => {
              if(resp.data>0){
                this.$message.success("手机号修改成功")
                this.getData()
                this.changePhoneDialogFormVisible=false
              }
            })
          }else {
            this.$message.error("验证码错误！")
          }
        }
      })
    },

  }
}
</script>

<style lang="less">
@import "../assets/style/common";

.user-panel {
  .container;
  display: flex;
  padding: 30px;
  margin: 20px;
  background-color: #fff;
}

.user-info {
  margin-left: 30px;
  display: flex;
  flex-direction: column;
}

.user-info-item {
  margin: 10px;
  display: flex;
  white-space: nowrap;
  align-items: center;
}

.avatar-uploader {
  width: 300px;
  height: 300px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 300px;
  height: 300px;
  display: block;
}

</style>
