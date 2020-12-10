<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import './assets/iconfont/iconfont.css'
export default {
  name: 'app'
}
</script>

<style lang="less" scoped>
@import "assets/style/common";

#app{
  padding: 0;
  margin: 0;
  width: 100%;
  position: absolute;
  //border: 1px solid red;
  //right: 0;
  //left: 0;
  //bottom: 0;
  //top: 0;
}
</style>
