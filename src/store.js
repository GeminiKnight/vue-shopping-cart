import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartList:[], //被加入购物车的商品列表
  },
  getters: {
    count: state => { // 加入商品项数
      return state.cartList.length
    },
    totalPrice: state => { // 
      let total = 0
      state.cartList.forEach((item) => {
        if(item.checked) {
          total += item.subtotal
        }
      })
      console.log(total)
      return total
    },
  },
  mutations: {
    addToCart (state,goods){ // 添加商品到购物车
      console.log('触发addToCart')
      let alreadyIndex = this.state.cartList.findIndex(function (item, index) {
          return item.id === goods.id;
      });
      console.log(alreadyIndex)

      // 如果不存在则添加
      if (alreadyIndex === -1) {
          let cartIndex = this.state.cartList.length;
          // 添加新的商品，并初始化其数量、价格、被选中状态
          console.log(goods)
          this.state.cartList.push(goods);
          this.state.cartList[cartIndex].quantity = 1 // 单品数量
          this.state.cartList[cartIndex].subtotal = goods.price // 单品总价
          this.state.cartList[cartIndex].checked = false //单品是否被选中
          console.log(this.state.cartList)
          // 新增商品，购物车不能为全选
          //Cart.checkAllFlag = false;
          return;
      }

      // 如果商品已存在并且库存足够，数量加1
      let alreadyGoods = this.state.cartList[alreadyIndex];
      let num = alreadyGoods.quantity,
          stock = alreadyGoods.stock;

      if (num < stock) {
          alreadyGoods.quantity = ++alreadyGoods.quantity
          alreadyGoods.subtotal = (alreadyGoods.price * alreadyGoods.quantity)
      }
      console.log(this.state.cartList)
    },
    removeItemFromCart(state,goods){
      let removeItemIndex = this.state.cartList.findIndex(function (item, index) {
        return item.id === goods.id;
      });
      this.state.cartList[removeItemIndex].quantity--
    },
    selectItem (state,goods) {
      let selectItemIndex = this.state.cartList.findIndex(function (item, index) {
        return item.id === goods.id;
      });
      this.state.cartList[selectItemIndex].checked = !this.state.cartList[selectItemIndex].checked
    }
  },
  actions: {

  },
});
