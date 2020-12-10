<template>
  <div class="bgc">
    <div class="container">
      <div class="main-panel">
        <!--        <el-image class="main-image" :src="good.skuImg" :preview-src-list="[good.skuImg]"></el-image>-->
        <img class="main-image" :src="good.skuImg">
        <div class="info-panel">
          <p class="panel-good-name">{{ good.goodName }}</p>
          <p class="panel-slogan">{{ good.slogan }}</p>
          <div class="panel-price-block">
            <p class="panel-price">{{ skuPrice }}元</p>
          </div>
          <div class="select-block">
            <span>选择颜色：</span>
            <el-radio-group v-model="formInfo.color" v-for="color in colors" :key="color" @change="colorChange"
                            class="select-item">
              <el-radio :label="color" border>{{ color }}</el-radio>
            </el-radio-group>
          </div>
          <div class="select-block">
            <span>选择版本：</span>
            <el-radio-group v-model="formInfo.version" v-for="info in infoList" :key="info.version"
                            @change="changeVersion(info)"
                            class="select-item">
              <el-radio :label="info.version" border :disabled="info.stock<=0">{{ info.version }}</el-radio>
            </el-radio-group>
          </div>
          <div class="panel-num-block">
            <span>数量：</span>
            <el-input-number v-model="formInfo.quantity" :min="1" :max="20" @change="totalPrice"
                             label="数量"></el-input-number>
            <span style="margin-left: 20px">库存剩余: {{ good.stock }}件</span>
          </div>
          <div class="panel-button-block">
            <el-button type="primary" icon="el-icon-coin" round @click="buy">立即购买</el-button>
            <el-button type="primary" icon="el-icon-shopping-cart-2" round @click="addCart">加入购物车</el-button>
          </div>
        </div>
      </div>
      <div class="good-detail">
        <el-divider content-position="center">商品详情</el-divider>
        <img class="good-detail-image" :src="good.detailImg">
      </div>
    </div>
    <!--支付弹框-->
    <el-dialog
        title="支付订单"
        :visible.sync="dialogVisible"
        width="30%">
      <span>选择支付方式</span><br><br>
      <el-button type="primary" round @click="orderPay">支付宝支付</el-button>
      <el-button type="success" round @click="orderPay">微信支付</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Detail",
  data() {
    return {
      skuPrice: '',
      // 当前提交商品
      formInfo: {
        quantity: 1,
      },
      // 当前展示内容
      good: {
        skuImg: '',
      },
      // 默认版本
      defaulSku: '',
      colors: '',
      // 版本信息
      infoList: '',
      dialogVisible:false,

    }
  },
  created() {
    this.$store.commit('setHeaderText','')
    const goodId = this.$route.params.goodId
    // const this = this
    this.$axios.post('http://localhost:8181/good/findGoodByGoodId/' + goodId).then((resp) => {
      this.good = resp.data
      this.formInfo.userId = window.sessionStorage.getItem("userId")
      this.formInfo.goodId = this.good.goodId
      this.formInfo.goodName = this.good.goodName
      this.formInfo.type = this.good.type

      this.$axios.post('http://localhost:8181/sku/findColorByGoodId/' + goodId).then((resp) => {
        console.log(resp.data)
        this.colors = resp.data
      })

      this.$axios.post('http://localhost:8181/sku/findSkuBySkuId/' + this.good.defaultSkuId).then((resp) => {
        this.defaultSku = resp.data
        this.formInfo.color = this.defaultSku.color
        this.good.skuImg = this.defaultSku.skuImg

        this.$axios.post('http://localhost:8181/sku/findSkuByColorAndGoodId/' + this.formInfo.color + '/' + this.formInfo.goodId).then((resp) => {
          console.log(resp.data)
          this.infoList = resp.data
        })

        this.formInfo.version = this.defaultSku.version
        this.skuPrice = this.defaultSku.price
        this.formInfo.skuId = this.defaultSku.skuId
        this.good.stock = this.defaultSku.stock

      })

    })

  },
  methods: {
    colorChange() {
      // const this = this
      this.$axios.post('http://localhost:8181/sku/findSkuByColorAndGoodId/' + this.formInfo.color + '/' + this.formInfo.goodId).then((resp) => {
        console.log(resp.data)
        this.infoList = resp.data
        this.good.skuImg = this.infoList[0].skuImg
        this.formInfo.version = this.infoList[0].version
        this.skuPrice = this.infoList[0].price
        this.formInfo.skuId = this.infoList[0].skuId
        this.good.stock = this.infoList[0].stock
      })

    },
    changeVersion(info) {
      this.skuPrice = info.price
      this.good.skuImg = info.skuImg
      this.formInfo.skuId = info.skuId
      this.good.stock = info.stock
    },

    totalPrice() {
      console.log(this.skuPrice * this.formInfo.quantity)
    },

    cartCount() {
      this.$axios.post("http://localhost:8181/cart/countCartByUserId/" + this.formInfo.userId).then((resp) => {
        this.$store.commit('setCartCount', resp.data)
      })
    },

    buy() {
      if (this.formInfo.userId !== null) {
        if (this.good.stock > 0) {
          if (this.good.stock >= this.formInfo.quantity) {
            // this.$store.commit("addOrder",this.formInfo)
            // this.$set(this.formInfo,'quantity',this.formInfo.quantity.toString())

            this.$router.push({name:'buy',params:this.formInfo})

          } else {
            this.$message.error('抱歉，购买数量超出库存量！');
          }
        } else {
          this.$message.error('抱歉，选中版本当前无货！');
        }
      } else {
        this.$message.error('请先登录！');
        this.$router.push("/login")
      }
    },

    addCart() {
      if (this.formInfo.userId !== null) {
        if (this.good.stock > 0) {
          if (this.good.stock >= this.formInfo.quantity) {
            console.log(this.formInfo)
            this.$axios.post('http://localhost:8181/cart/isExistSkuInCart', this.formInfo).then((resp) => {
              console.log(resp.data)
              const cartId = resp.data
              if (cartId > 0) {
                this.$axios.post('http://localhost:8181/cart/addQuantity/' + cartId + '/' + this.formInfo.quantity).then((resp) => {
                  console.log(resp.data)
                  if (resp.data > 0) {
                    this.cartCount()
                    this.$message({
                      message: '加入购物车成功',
                      type: 'success'
                    });
                  } else {
                    this.$message.error('加入购物车失败！');
                  }
                })
              } else {
                this.$axios.post('http://localhost:8181/cart/addCart', this.formInfo).then((resp) => {
                  // console.log(resp.data)
                  if (resp.data > 0) {
                    this.cartCount()
                    this.$message({
                      message: '加入购物车成功',
                      type: 'success'
                    });
                  } else {
                    this.$message.error('加入购物车失败！');
                  }
                })
              }
            })
          } else {
            this.$message.error('抱歉，加购数量超出库存量！');
          }
        } else {
          this.$message.error('抱歉，选中版本当前无货！');
        }
      } else {
        this.$message.error('请先登录！');
        this.$router.push("/login")
      }
    }
  }
}
</script>

<style lang="less">
@import "../assets/style/common";

.bgc {
  background-color: #fff;
}

.main-panel {
  display: flex;
  //align-items: center;
  //justify-content: center;
}

.main-image {
  //height: 600px;
  width: 500px;
  height: 500px;
}

.info-panel {
  margin: 50px;
}

.panel-good-name {
  color: black;
  font-size: 30px;
  line-height: 200%;
}

.panel-slogan {
  line-height: 200%;
}

.panel-price-block {
  background-color: @bgc2;
  width: 600px;
}

.panel-price {
  color: red;
  font-size: 20px;
  padding: 10px;
  margin-top: 5px;
}

.select-block {
  margin-top: 15px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.select-item {
  margin: 10px;
}

.panel-num-block {
  margin-top: 15px;
}

.panel-button-block {
  margin-top: 20px;
}

.good-detail {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.good-detail-image {
  width: 100%;
}
</style>
