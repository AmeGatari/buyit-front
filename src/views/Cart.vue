<template>
  <div class="container">
    <div class="cart" v-if="!isBlank">
      <div class="cart-list">
        <div class="cart-list-item" style="width: 430px">商品</div>
        <div class="cart-list-item" style="width: 150px">单价</div>
        <div class="cart-list-item" style="width: 180px">数量</div>
        <div class="cart-list-item" style="width: 150px">小计</div>
        <div class="cart-list-item" style="width: 50px">操作</div>
      </div>
      <div class="cart-list" v-for="cart in carts" :key="cart.cartId">
        <div class="cart-list-item">
          <img :src="cart.skuImg" alt="" width="100px">
        </div>
        <div class="cart-list-item" style="width: 300px">
          <div>{{ cart.goodName }}</div>
          <div>颜色：{{ cart.color }}</div>
          <div>版本：{{ cart.version }}</div>
        </div>

        <div class="cart-list-item" style="width: 150px">{{ cart.price }}元</div>

        <div class="cart-list-item" style="width: 180px">
          <el-input-number v-model="cart.quantity" :min="1" :max="20"  label="数量" @change="quantityChange(cart.cartId,cart.quantity)"></el-input-number>
        </div>

        <div class="cart-list-item" style="width: 150px"><span style="color: red">{{ cart.price*cart.quantity }}元</span></div>

        <div class="cart-list-item" style="width: 50px">
          <el-tooltip content="移除商品" placement="top">
          <el-button type="danger" icon="el-icon-close" circle plain @click="cartDelete(cart)"></el-button>
          </el-tooltip>
        </div>

      </div>
      <div class="cart-list-footer">
        <div class="cart-list-item-footer">合计：<span style="color: red;font-size: 25px">{{totalPrice}}元</span></div>
        <div class="cart-list-item-footer"><el-button type="primary" round @click="$router.push('/buy')">去结算</el-button></div>
      </div>
    </div>

    <div v-else class="cart">
        <div class="cart-blank">
          <span style="font-size: 20px">
            <i class="el-icon-shopping-cart-2"></i> 购物车空空如也
          </span>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "cart",
  data() {
    return {
      carts: [],
      isBlank:true,
      userId:''
    }
  },
  created() {
    this.$store.commit('setHeaderText','购物车')
    this.userId = window.sessionStorage.getItem("userId");
    this.getData()
  },
  computed:{
    totalPrice:function (){
      let result=0
      this.carts.forEach((item)=>{
        result+=item.price*item.quantity
      })
      return result
    }
  },
  methods:{
    quantityChange(cartId,quantity){
      this.$axios.post('http://localhost:8181/cart/quantityChange/' + cartId+'/'+quantity).then((resp) => {
        console.log(resp.data)
      })

    },

    cartDelete(cart){
      this.$axios.post('http://localhost:8181/cart/deleteCartByCartId/' + cart.cartId).then((resp) => {
        console.log(resp.data)
        if (resp.data > 0) {
          this.$axios.post("http://localhost:8181/cart/countCartByUserId/"+cart.userId).then((resp)=>{
            this.$store.commit('setCartCount',resp.data)
          })
          this.$message({
            message: '商品已移除',
            type: 'success'
          });
        }
        this.getData()
      })

    },
    getData(){
      (async () => {
        await this.$axios.post('http://localhost:8181/cart/findCartByUserId/' + this.userId).then((resp) => {
          this.carts = resp.data
          if(resp.data[0].cartId!==null){
            this.isBlank=false
          }
        })

        await this.carts.forEach((item) => {
          this.$axios.post('http://localhost:8181/sku/findSkuBySkuId/' + item.skuId).then((resp) => {
            let sku = resp.data
            this.$set(item, 'color', sku.color)
            this.$set(item, 'skuImg', sku.skuImg)
            this.$set(item, 'version', sku.version)
            this.$set(item, 'price', sku.price)
          })

          this.$axios.post('http://localhost:8181/good/findGoodByGoodId/' + item.goodId).then((resp) => {
            let good = resp.data
            this.$set(item, 'goodName', good.goodName)
          })

        })


      })();

    }

  }
}
</script>

<style lang="less">
@import "../assets/style/common";

.cart {
  padding: 20px;
}

.cart-list {
  background-color: white;
  padding: 10px;
  margin: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.cart-list-footer {
  background-color: white;
  padding: 10px;
  margin: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.cart-list-item {
  //width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.cart-list-item-footer {
  //width: 20%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 10px;
}

.cart-blank{
  background-color: white;
  padding: 30px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
