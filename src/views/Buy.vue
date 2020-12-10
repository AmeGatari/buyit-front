<template>
  <div class="container">
    <div class="buy" v-if="!isBlank">
      <div class="address">
        <span style="font-size: 20px">收货地址</span>

        <div class="address-panel">

          <div v-for="address in addresses" :key="address.addressId" class="address-panel-block"
               :class="{checked:selectedAddress.addressId===address.addressId}" @click="changeAddress(address)"
               style="justify-content: space-between">
            <div class="dis-col">
              <span class="address-panel-block-item" style="font-size: 20px">{{ address.receiver }}</span>
              <span class="address-panel-block-item">{{ address.phone }}</span>
              <span class="address-panel-block-item">{{ address.areaName }} {{ address.detailAddress }}</span>
            </div>
            <div style="height: 20px;align-self: flex-end">
              <el-button type="text" class="address-panel-block-item" @click="editAddress(address)">修改</el-button>
              <el-button type="text" class="address-panel-block-item" @click="deleteAddress(address)">删除</el-button>
            </div>
          </div>

          <div class="address-panel-block center-center" @click="addAddressDialogFormVisible=true">
            <span style="font-size: 30px"><i class="el-icon-plus"></i></span>
            添加新地址
          </div>

        </div>

      </div>
      <el-table
          :data="orders"
          style="width: 100%">
        <el-table-column width="100">
          <template slot-scope="scope">
            <img :src="scope.row.skuImg" style="height: 70px">
          </template>
        </el-table-column>
        <el-table-column
            prop="goodName"
            label="商品">
        </el-table-column>
        <el-table-column
            prop="color"
            label="颜色">
        </el-table-column>
        <el-table-column
            prop="version"
            label="版本">
        </el-table-column>
        <el-table-column
            prop="unitPrice"
            label="单价">
        </el-table-column>
        <el-table-column
            prop="quantity"
            label="数量">
        </el-table-column>
        <el-table-column
            prop="stock"
            label="库存量">
        </el-table-column>
        <el-table-column
            prop="price"
            label="小计">
        </el-table-column>
      </el-table>

      <div class="buy-list-footer">
        <div class="buy-list-item-footer">应付总额：<span style="color: red;font-size: 25px">{{ totalPrice }}元</span></div>
        <div class="buy-list-item-footer">
          <el-button type="primary" round @click="orderBuy">提交订单</el-button>
        </div>
      </div>


    </div>

    <div v-else class="buy">
      <div class="buy-blank">
          <span style="font-size: 20px;color: red">
            <i class="el-icon-warning-outline"></i> 无订单信息
          </span>
      </div>
    </div>
    <!--地址编辑对话框-->
    <el-dialog title="编辑收货地址信息" :visible.sync="editAddressDialogFormVisible">

      <el-form :model="editAddressData" :rules="addressRules" ref="editAddressData">


        <el-form-item label="选择省/市/区" prop="areaCode">
          <el-cascader
              size="large"
              :options="options_"
              v-model="editAddressData.areaCode"
              @change="editAddressChange(editAddressData.areaCode)"
              placeholder="省 / 市 / 区"
          ></el-cascader>
        </el-form-item>


        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="editAddressData.detailAddress"></el-input>
        </el-form-item>

        <el-form-item label="收货人姓名" prop="receiver">
          <el-input v-model="editAddressData.receiver" clearable></el-input>
        </el-form-item>

        <el-form-item label="收货人手机号" prop="phone">
          <el-input v-model="editAddressData.phone" clearable></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="editAddressDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAddress('editAddressData')">确 定</el-button>
      </div>
    </el-dialog>
    <!--地址添加对话框-->
    <el-dialog title="添加收货地址信息" :visible.sync="addAddressDialogFormVisible">

      <el-form :model="addAddressData" :rules="addressRules" ref="addAddressData">

        <el-form-item label="选择省/市/区" prop="areaCode">
          <el-cascader
              size="large"
              :options="options_"
              v-model="addAddressData.areaCode"
              @change="addAddressChange(addAddressData.areaCode)"
              placeholder="省 / 市 / 区"
          ></el-cascader>

        </el-form-item>

        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="addAddressData.detailAddress"></el-input>
        </el-form-item>

        <el-form-item label="收货人姓名" prop="receiver">
          <el-input v-model="addAddressData.receiver" clearable></el-input>
        </el-form-item>

        <el-form-item label="收货人手机号" prop="phone">
          <el-input v-model="addAddressData.phone" clearable></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addAddressDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAddress('addAddressData')">确 定</el-button>
      </div>
    </el-dialog>

    <!--支付弹框-->
    <el-dialog
        title="支付订单"
        :visible.sync="dialogVisible"
        width="30%">
      <span>选择支付方式</span><br><br>
      <el-button type="primary" round @click="orderPay"><i class="iconfont icon-alipay"></i>支付宝支付</el-button>
      <el-button type="success" round @click="orderPay"><i class="iconfont icon-wechat-fill"></i>微信支付</el-button>
      <span slot="footer" class="dialog-footer">
    <el-button @click="cancelPay">取 消</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>

import {CodeToText, regionData, TextToCode} from "element-china-area-data";

export default {
  name: "Buy",
  data() {
    return {
      orders: [],
      isBlank: true,
      userId: '',
      orderIds: [],
      dialogVisible: false,
      editAddressDialogFormVisible: false,
      addAddressDialogFormVisible: false,
      inStock: true,
      isSingle: false,
      addresses: [],
      selectedAddress: {},
      editAddressData: {},
      addAddressData: {},
      addressRules: {
        areaCode: [
          {required: true, message: '请选择 省 / 市 / 区', trigger: 'blur'},
        ],
        detailAddress: [
          {required: true, message: '请输入详细地址', trigger: 'blur'},
        ],
        receiver: [
          {required: true, message: '请输入收货人姓名', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入收货人手机号', trigger: 'blur'},
          {pattern: /^1[345789]{1}\d{9}$/, message: '请输入正确的手机号', trigger: 'blur'}

        ],

      },
      options_: regionData,
      selectedOptions: [],

    }
  },
  created() {
    this.$store.commit('setHeaderText', '确认订单')
    this.userId = window.sessionStorage.getItem("userId");
    this.findAddress()
    let singleOrder = this.$route.params
    if (singleOrder.skuId) {
      this.isSingle = true
      this.isBlank = false
      this.orders.push(singleOrder)
      this.getInfoBySkuId()
    } else {
      this.isSingle = false
      this.getInfoBySkuIds()
    }
  },
  computed: {
    totalPrice() {
      let result = 0
      this.orders.forEach((item) => {
        result += item.unitPrice * item.quantity
      })
      return result
    },
  },
  methods: {
    addAddressChange(areaCode) {
      console.log(areaCode)
      let areaNameList = []
      areaCode.forEach((item, index) => {
        areaNameList[index] = CodeToText[item]
      })
      this.addAddressData.areaName = areaNameList.join(' ')
    },

    editAddressChange(areaCode) {
      console.log(areaCode)
      let areaNameList = []
      areaCode.forEach((item, index) => {
        areaNameList[index] = CodeToText[item]
      })
      this.editAddressData.areaName = areaNameList.join(' ')
    },

    findAddress() {
      this.$axios.post('http://localhost:8181/address/findAddressByUserId/' + this.userId).then((resp) => {
        this.addresses = resp.data
        this.selectedAddress = this.addresses[0]
      })
    },

    getInfoBySkuId() {
      this.$axios.post('http://localhost:8181/sku/findSkuBySkuId/' + this.orders[0].skuId).then((resp) => {
        let sku = resp.data
        console.log(sku)
        this.$set(this.orders[0], 'color', sku.color)
        this.$set(this.orders[0], 'skuImg', sku.skuImg)
        this.$set(this.orders[0], 'version', sku.version)
        this.$set(this.orders[0], 'unitPrice', sku.price)
        this.$set(this.orders[0], 'price', sku.price * this.orders[0].quantity)
        this.$set(this.orders[0], 'stock', sku.stock)
        if (this.orders[0].quantity > sku.stock) {
          this.inStock = false
        }
      })
      this.$axios.post('http://localhost:8181/good/findGoodByGoodId/' + this.orders[0].goodId).then((resp) => {
        let good = resp.data
        this.$set(this.orders[0], 'goodName', good.goodName)
      })


    },

    getInfoBySkuIds() {
      (async () => {
        await this.$axios.post('http://localhost:8181/cart/findCartByUserId/' + this.userId).then((resp) => {
          this.orders = resp.data
          if (resp.data[0].cartId) {
            this.isBlank = false
          }
        })

        await this.orders.forEach((item) => {
          this.$axios.post('http://localhost:8181/sku/findSkuBySkuId/' + item.skuId).then((resp) => {
            let sku = resp.data
            console.log(sku)
            this.$set(item, 'color', sku.color)
            this.$set(item, 'skuImg', sku.skuImg)
            this.$set(item, 'version', sku.version)
            this.$set(item, 'unitPrice', sku.price)
            this.$set(item, 'price', sku.price * item.quantity)
            this.$set(item, 'stock', sku.stock)
            if (item.quantity > sku.stock) {
              this.inStock = false
            }
          })

          this.$axios.post('http://localhost:8181/good/findGoodByGoodId/' + item.goodId).then((resp) => {
            let good = resp.data
            this.$set(item, 'goodName', good.goodName)
          })
        })

      })();
      console.log(this.orders)

    },

    orderBuy() {
      if (this.inStock) {
        if (this.selectedAddress) {
          this.orders.forEach((item) => {
            this.$set(item, 'addressName', this.selectedAddress.areaName + ' ' + this.selectedAddress.detailAddress)
            this.$set(item, 'receiver', this.selectedAddress.receiver)
            this.$set(item, 'phone', this.selectedAddress.phone)
          })
          this.$axios.post('http://localhost:8181/order/orderBuy', this.orders).then((resp) => {
            if (resp.data !== null) {
              this.orderIds = resp.data
              if (!this.isSingle) {
                this.$axios.post('http://localhost:8181/cart/deleteCartByUserId/' + this.userId)
                this.$store.commit('setCartCount', 0)
              }
              this.$message.success('订单提交成功');
              this.dialogVisible = true
            } else {
              this.$message.error('订单提交失败！');
            }
          })
        } else {
          this.$message.error('请先选择一个收货地址')
        }
      } else {
        this.$message.error('订单内有商品库存不足，请重新选购！');
      }
    },

    orderPay() {
      this.$axios.post('http://localhost:8181/order/orderPay', this.orderIds).then((resp) => {
        if (resp.data === this.orderIds.length) {
          this.$router.push("/success")
        } else {
          this.$message.error('订单支付失败！');
        }
        this.dialogVisible = false
      })

    },
    cancelPay() {
      this.dialogVisible = false
      this.$router.push('/order')
    },
    changeAddress(address) {
      this.selectedAddress = address
    },

    editAddress(address) {
      this.editAddressData = address
      let areaNameList = address.areaName.split(' ')
      let areaCodeList = []
      areaCodeList.push(TextToCode[areaNameList[0]].code)
      areaCodeList.push(TextToCode[areaNameList[0]][areaNameList[1]].code)
      areaCodeList.push(TextToCode[areaNameList[0]][areaNameList[1]][areaNameList[2]].code)
      this.editAddressData.areaCode = areaCodeList
      this.editAddressDialogFormVisible = true
    },

    deleteAddress(address) {
      this.$confirm('确认删除此收货地址?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post('http://localhost:8181/address/deleteAddressByAddressId/' + address.addressId).then((resp) => {
          console.log(resp.data)
          if (resp.data > 0) {
            this.$message({
              message: '地址已删除',
              type: 'success'
            });
          }
          this.findAddress()
        })
      })

    },

    updateAddress(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$axios.post('http://localhost:8181/address/updateAddress', this.editAddressData).then((resp) => {
            if (resp.data > 0) {
              this.$message.success("收货地址修改成功")
              this.editAddressDialogFormVisible = false
              this.findAddress()
            }
          })

        }
      })
    },

    addAddress(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          console.log(this.addAddressData)
          this.addAddressData.userId = this.userId
          this.$axios.post('http://localhost:8181/address/addAddress', this.addAddressData).then((resp) => {
            if (resp.data > 0) {
              this.$message.success("收货地址添加成功")
              this.addAddressDialogFormVisible = false
              this.findAddress()
            }
          })

        }
      })
    },


  }
}
</script>

<style lang="less">
@import "../assets/style/common";

.buy {
  padding: 20px;
}

.buy-list-footer {
  background-color: white;
  padding: 10px;
  //margin: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}


.buy-list-item-footer {
  //width: 20%;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 10px;
}

.buy-blank {
  background-color: white;
  padding: 30px;
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.address {
  background-color: #fff;
  padding: 20px;
}

.address-panel {
  display: flex;
  margin-top: 10px;
}

.address-panel-block {
  border: 1px #DCDFE6 solid;
  margin-right: 10px;
  width: 300px;
  height: 200px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.dis-col {
  display: flex;
  flex-direction: column;
}

.checked {
  border: 1px #409EFF solid;
}

.address-panel-block-item {
  margin: 5px;
}
</style>
