<template>
  <div class="container">
    <div class="success-panel">
      <span class="success-text">
        <i class="el-icon-circle-check"></i>订单支付成功！
      </span>
      <router-link to="/"><i class="el-icon-s-home"></i>返回首页</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Success",
  data() {
    return {

    }
  },
  created() {
    this.$store.commit('setHeaderText','')
  }
}
</script>

<style scoped>

.success-panel {
  padding: 30px;
  margin: 20px 0;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.success-text {
  font-size: 30px;
  margin: 50px;
  color: #67C23A;
}
</style>
