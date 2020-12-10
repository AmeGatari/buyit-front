<template>
  <div class="good-list">
    <div class="container flex" style="flex-wrap: wrap">
      <el-divider content-position="center">全部商品</el-divider>
      <template v-if="goods.length!==0">
        <div v-for="good in goods" :key='good'>
          <GoodCard v-bind="good"></GoodCard>
        </div>
      </template>
      <template v-else>
        <div class="blank_box">
          <span class="blank_box_text"><i class="el-icon-search"></i>很抱歉，没有你要找的商品</span>
        </div>
      </template>
    </div>

  </div>
</template>

<script>

import GoodCard from "@/components/GoodCard";

export default {
  name: "List",
  components: {
    GoodCard,
  },
  data(){
    return{
      goods:[],
      categoryKey:'',
      keyword:''
    }
  },
  watch:{
    $route(){
      this.goods=null
      this.categoryKey=this.$route.query.categoryKey
      this.keyword=this.$route.query.keyword
    },
    categoryKey(){
      this.findGoodByCategoryKey()
    },
    keyword(){
      this.findGoodByKeyword()
    }
  },
  methods:{
    findGoodByCategoryKey(){
      if(this.categoryKey!=null){
        this.$axios.post('http://localhost:8181/good/findGoodByCategoryKey/' + this.categoryKey).then((resp)=> {
          this.goods = resp.data
          console.log(this.goods)
        })
      }
    },

    findGoodByKeyword(){
      if(this.keyword!=null){
        this.$axios.post('http://localhost:8181/good/findGoodByKeyword/' + this.keyword).then((resp)=> {
          this.goods = resp.data
          console.log(this.goods)
        })

      }
    },
  },
  created() {
    this.$store.commit('setHeaderText','商品列表')
    this.categoryKey=this.$route.query.categoryKey
    this.keyword=this.$route.query.keyword
  },
}
</script>

<style lang="less">
@import "../assets/style/common";

.good-list {

}

.blank_box{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: #fff;
  padding: 30px;
  margin-bottom: 20px;
}

.blank_box_text{
  font-size: 20px;
}
</style>
