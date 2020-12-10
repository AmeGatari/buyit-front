import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userid:'',
    username:'',
    orderIds:[],
    cartCount:0,
    headerText:''
  },
  mutations: {
    login(state){
      state.userid=window.sessionStorage.getItem("userid")
      state.username=window.sessionStorage.getItem("username")
    },
    setOrderIds(state,orderIds){
      state.orderIds=orderIds
    },
    setCartCount(state,count){
      state.cartCount=count
    },
    setHeaderText(state,headerText){
      state.headerText=headerText
    }
  },
  actions: {
  },
  modules: {
  }
})
