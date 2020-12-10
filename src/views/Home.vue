<template>
  <div>
    <div class="menu-banner">
      <div class="container between-center">
        <div class="menu">
          <div class="menu-item">
              <router-link  v-for="category in categories" :key="category.categoryId" :to="{path:'/list',query:{categoryKey:category.categoryKey}}" class="menu-item-a">{{category.categoryName}}</router-link>
          </div>

        </div>
        <div class="banner">
          <el-carousel height="300px">
            <el-carousel-item v-for="item in banners" :key="item">
              <router-link :to="item.link">
                <el-image :src="item.bannerPath"></el-image>
              </router-link>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
    <div class="container flex" style="flex-wrap: wrap">
      <el-divider content-position="center">全部商品</el-divider>
      <div v-for="good in goods" :key='good'>
        <GoodCard v-bind="good"></GoodCard>
      </div>
    </div>
  </div>
</template>

<script>

import GoodCard from "@/components/GoodCard";

export default {
  name: 'Home',
  components:{
    GoodCard,
  },
  data(){
    return{
      goods:[],
      banners:[],
      categories:[],
    }
  },
  created() {
    this.$store.commit('setHeaderText','')
    this.$axios.post('http://localhost:8181/good/findAllGood/').then((resp)=> {
      console.log(resp.data)
      this.goods=resp.data
    })
    this.$axios.post('http://localhost:8181/banner/findAllBanner/').then((resp)=> {
      console.log(resp.data)
      this.banners=resp.data
    })
    this.$axios.post('http://localhost:8181/category/findAllCategory').then((resp) => {
      console.log(resp.data)
      this.categories = resp.data
    })
  }
}
</script>

<style lang="less">
@import "../assets/style/common";

.menu-banner {
  background-color: #fff;
  padding: 30px;
}

.menu {
  //background-color: #888;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  width:300px
}

.menu-item {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    //background-color: @color1;
    box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.1);
    border-radius: 20px

  }
}

.menu-item-a {
  color: black;
  margin: 5px;
  line-height: 50px;
  //white-space: nowrap;

  &:hover {
    color: @main-color;
    font-weight: bold;
  }
}

.banner {
  width: 850px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}

@keyframes suspension {
  //from{transform: translate(0,0)}
  //to{transform: translate(0,-6px)}
  from{margin-top: 10px}
  to{margin-top: 5px}
}

.box-card{
  width: 220px;
  height: 320px;
  margin: 10px;
  padding: 20px;
  background-color: #fff;
  &:hover{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    animation: suspension 0.5s;
    animation-fill-mode: forwards;
    //transform: translate(0,-5px);
  }
}
</style>
