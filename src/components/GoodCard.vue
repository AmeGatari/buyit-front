<template>
  <div class="box-card">
    <router-link :to="'/detail/'+goodId">
      <img :src="sku.skuImg" alt="skuImg" class="good-img">
      <p class="good-name">{{ goodName }}</p>
      <p class="good-slogan">{{ slogan }}</p>
      <p class="good-price">{{ sku.price }}元</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "GoodCard",
  props: ["goodId", "goodName", "slogan","defaultSkuId"],
  data(){
    return{
      sku:[],
    }
  },
  created() {
    this.$axios.post('http://localhost:8181/sku/findSkuBySkuId/'+this.defaultSkuId).then((resp) =>{
      console.log(resp.data)
      this.sku=resp.data
    })
  },
}
</script>

<style lang="less">

@keyframes suspension {
  from {
    margin-top: 10px
  }
  to {
    margin-top: 5px
  }
}

.box-card {
  width: 220px;
  height: 320px;
  margin: 10px;
  padding: 20px;
  background-color: #fff;

  &:hover {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    animation: suspension 0.5s;
    animation-fill-mode: forwards;
  }
}

.good-img {
  width: 180px;
}

.content-text-overflow {
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.good-name {
  color: black;
  line-height: 200%;
  text-align: center;
  .content-text-overflow;
}

.good-slogan {
  line-height: 200%;
  font-size: small;
  color: #888;
  text-align: center;
  .content-text-overflow;
}

.good-price {
  line-height: 200%;
  color: red;
  text-align: center;
  .content-text-overflow;
}

</style>
