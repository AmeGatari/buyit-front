<template>
  <header>
    <nav class="nav">
      <div class="contain">
        <div class="item">
          <router-link to="/home">Buyit</router-link>
        </div>

        <div class="between-center">

          <div v-if="user.userId" class="item">
            <el-dropdown placement="bottom">
              <router-link to="/userInfo"><el-avatar icon="el-icon-user-solid" v-bind:src="user.avatar"></el-avatar></router-link>
              <el-dropdown-menu slot="dropdown" class="dropdown-menu">
                <el-dropdown-item><router-link to="/userInfo"><span style="text-align: center">{{ user.userName }}</span></router-link></el-dropdown-item>
                <el-dropdown-item><router-link to="/order">我的订单</router-link></el-dropdown-item>
                <el-dropdown-item @click.native="signOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <template v-else>
            <div class="item">
              <router-link to="/login">登录</router-link>
            </div>
            <div class="item">
              <router-link to="/register">注册</router-link>
            </div>
          </template>

          <div class="item">
            <el-badge :value="cartCount" class="item" :hidden="!cartCount">
            <router-link to="/cart">购物车</router-link>
            </el-badge>
          </div>

        </div>

      </div>
    </nav>
    <div class="nav2">
      <div class="center-center">
        <router-link to="/"><img src="../assets/images/logo.png" class="logo" alt="logo"></router-link>
        <div class="header-text">{{headerText}}</div>
      </div>
      <div>
        <el-input size="large" placeholder="请输入要搜索的商品名称" v-model="keyword" clearable>
          <el-button slot="append" icon="el-icon-search" class="input-button" @click="search"></el-button>
        </el-input>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      keyword:'',
      hidden:false,
      user:{
        userId: window.sessionStorage.getItem("userId"),
      },

    };
  },
  created() {
    this.$axios.post('http://localhost:8181/user/findUserByUserId/'+this.user.userId).then((resp)=> {
      this.user = resp.data
    })
  },
  methods: {
    signOut(){
      window.sessionStorage.clear();
      location.reload()
    },
    search(){
      this.$router.push({path:'/list',query:{keyword:this.keyword}})
    }
  },
  computed:{
    cartCount(){
      return this.$store.state.cartCount
    },
    headerText(){
      return this.$store.state.headerText
    }
  }
}
</script>

<style lang="less">
@import "../assets/style/common";

@navhight: 60px;

header{
  background-color: #fff;
}

.nav {
  height: @navhight;
  background-color: @bgc1;
  padding: 5px;
  //box-shadow: 1px 1px 3px #BBBBBB;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030;

  a {
    //color:#c8c8c8;
    color: white;
    display: block;
    font-size: 14px;

    &:hover {
      color: @color3;
    }
  }

}

.contain {
  .container;
  .between;
  .flex-v-center;
  .full-height
}

.item {
  width: 60px;
}

.nav2 {
  .container;
  .between-center;
  margin-top: @navhight;
  padding: 70px;
}

.input-button {
  width: 50px;
}

.dropdown-menu {
  text-align: center;
}

.logo{
  height: 50px;
}

.header-text{
  margin-left: 50px;
  font-size: 30px;
}
</style>
