<template>
  <div class="container">
    <div class="order">
      <div class="order-list">
        <div class="order-list-item" style="width: 370px">商品</div>
        <div class="order-list-item" style="width: 50px">数量</div>
        <div class="order-list-item" style="width: 150px">总价</div>
        <div class="order-list-item" style="width: 300px">订单信息</div>
        <div class="order-list-item" style="width: 150px">操作</div>
      </div>
      <div class="order-list" v-for="order in orders" :key="order.orderId">

        <div class="order-list-item">
          <img :src="order.skuImg" alt="skuImage" width="100px">
        </div>
        <div class="order-list-item" style="width: 250px">
          <div>{{ order.goodName }}</div>
          <div>颜色：{{ order.color }}</div>
          <div>版本：{{ order.version }}</div>
        </div>
        <div class="order-list-item" style="width: 50px">{{ order.quantity }}</div>
        <div class="order-list-item" style="width: 150px">{{ order.price }}元</div>
        <div class="order-list-item" style="width: 300px">
          <div>订单号：{{ order.orderId }}</div>
          <div>订单状态：<span style="font-weight: bold">{{ order.status }}</span></div>
          <div>购买日期：{{ order.orderTime }}</div>
        </div>
        <div class="order-list-item" style="width: 150px">
          <template v-if="order.status==='待支付'">
            <el-button @click="orderPay(order.orderId)" type="success" icon="el-icon-wallet" plain round>立即支付
            </el-button>
            <br>
          </template>
          <el-button @click="orderCancel(order)" v-if="order.status==='待支付'||order.status==='待发货'" type="danger"
                     icon="el-icon-close" plain round>取消订单
          </el-button>
          <el-button @click="orderReceipt(order.orderId)" v-if="order.status==='待收货'" type="success" icon="el-icon-box"
                     plain round>确认收货
          </el-button>
          <el-button @click="orderDelete(order.orderId)" v-if="order.status==='已完成'||order.status==='已取消'" type="danger"
                     icon="el-icon-delete" plain round>删除订单
          </el-button>

        </div>

      </div>
    </div>

    <!--支付弹框-->
    <el-dialog
        title="支付订单"
        :visible.sync="dialogVisible"
        width="30%">
      <span>选择支付方式</span><br><br>
      <el-button type="primary" round @click="pay">支付宝支付</el-button>
      <el-button type="success" round @click="pay">微信支付</el-button>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "Order",
  data() {
    return {
      orders: [],
      userId: '',
      dialogVisible:false,
      orderId:0
    }
  },
  created() {
    this.$store.commit('setHeaderText','我的订单')
    this.userId = window.sessionStorage.getItem("userId");
    this.getData()
  },
  methods: {
    getData() {
      (async () => {
        await this.$axios.post('http://localhost:8181/order/findOrderByUserId/' + this.userId).then((resp) => {
          // console.log(resp.data)
          this.orders = resp.data
          console.log(this.orders)
        })

        await this.orders.forEach((item) => {
          this.$axios.post('http://localhost:8181/sku/findSkuBySkuId/' + item.skuId).then((resp) => {
            console.log(resp.data)
            this.$set(item, 'skuImg', resp.data.skuImg)
          })

        })
      })();

    },
    orderPay(orderId) {
      this.orderId=orderId
      this.dialogVisible=true
    },

    pay(){
      this.$axios.post('http://localhost:8181/order/pay/' + this.orderId ).then((resp) => {
        console.log(resp.data)
        if (resp.data > 0) {
          this.$router.push("/success")
        }
        this.getData()
        this.orderId=0
      })

    },

    orderCancel(order) {
      this.$confirm('确认取消此订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/order/orderCancel', order).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '订单已取消',
              type: 'success'
            });
          }
          this.getData()
        })
      })

    },
    orderReceipt(orderId) {
      this.$confirm('是否确认收货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let status = '已完成'
        this.$axios.post('http://localhost:8181/order/setOrderStatus/' + orderId + '/' + status).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '订单已取消',
              type: 'success'
            });
          }
          this.getData()
        })
      })

    },
    orderDelete(orderId) {
      this.$confirm('确认删除此订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/order/deleteOrderByOrderId/' + orderId).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '订单已删除',
              type: 'success'
            });
          }
          this.getData()
        })
      })

    },
  }
}
</script>

<style lang="less" >
@import "../assets/style/common";

.order {
  padding: 20px;
}

.order-list {
  background-color: white;
  padding: 20px;
  margin: 10px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.order-list-item {
  //width: 20%;
  display: flex;
  flex-direction: column;
  //justify-content: space-between;
  //align-items: center;
}
</style>
