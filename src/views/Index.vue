<template>
  <div>
    <el-backtop :bottom="100">
      <div class="back-top">顶部</div>
    </el-backtop>
    <el-backtop></el-backtop>

    <c-header></c-header>
    <router-view></router-view>
    <c-footer></c-footer>
  </div>
</template>

<script>
import CHeader from '../components/Header'
import CFooter from '../components/Footer'

export default {
  name: "Index",
  components: {
    CHeader,
    CFooter
  },
  data() {
    return {}
  },
  created() {

  }
}


</script>

<style lang="less">
@import "../assets/style/common";

.back-top {
  height: 100%;
  width: 100%;
  background-color: white;
  box-shadow: 0 0 6px rgba(0, 0, 0, .12);
  text-align: center;
  line-height: 40px;
  color: #1989fa;
  font-size: 15px;
  border-radius: 5px;
}
</style>
