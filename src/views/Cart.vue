<template>
  <div class="device" id="page-cart">
    <header>
      <span class="goBack" @click="goBack">返回</span>
      <span class="header-title">购物清单</span>
      <span class="header-edit" @click="toggleDelBtn">
        <span v-show="!delFlag">编辑</span>
        <span v-show="delFlag">完成</span>
      </span>
    </header>
    <div class="page">
      <div class="empty-states" v-if="cart.length === 0">
        <span>这里是空的，快去逛逛吧</span>
      </div>
      <ul class="goods-list cart-list" v-else>
        <li class="goods-item" v-for="(item, index) in cart" :key="index">
          <div class="item-selector">
            <div class="icon-selector" v-bind:class="{'selector-active': item.checked}"
            @click="selectGoods(item)">
              <svg t="1504061791962" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="2922" xmlns:xlink="http://www.w3.org/1999/xlink" width="12" height="12">
                <path d="M908.288 127.488l-537.6 537.6-254.976-254.976L0 525.824l254.976 254.976
                  115.712 115.712L486.4 780.8l537.6-537.6z"
                  fill="#ffffff" p-id="2923"></path>
              </svg>
            </div>
          </div>
          <div class="goods-img">
            <img v-bind:src="item.img" v-bind:alt="item.name">
          </div>
          <div class="goods-info">
            <p class="goods-title">{{ item.name }}</p>
            <div class="goods-price">
              <span>¥<b>{{ item.price }}</b></span>
            </div>
            <span class="des">库存{{ item.stock }}件</span>
            <div class="goods-num">
              <div class="num-btn" @click="changeQty(true, item)">+</div>
              <div class="show-num">{{ item.quantity }}</div>
              <div class="num-btn" @click="changeQty(false, item)">-</div>
            </div>
          </div>
        </li>
      </ul>

    </div>
    <div class="action-bar" v-bind:class="{ 'del-box': delFlag }">
      <!-- del-box -->
      <div class="g-selector" @click="checkAll">
        <div class="item-selector">
          <div class="icon-selector" v-bind:class="{'selector-active': checkAllFlag}">
            <svg t="1504061791962" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              p-id="2922" xmlns:xlink="http://www.w3.org/1999/xlink" width="12" height="12">
              <path d="M908.288 127.488l-537.6 537.6-254.976-254.976L0 525.824l254.976
               254.976 115.712 115.712L486.4 780.8l537.6-537.6z"
                fill="#ffffff" p-id="2923"></path>
            </svg>
          </div>
        </div>
        <span>全选</span>
      </div>
      <div class="action-btn buy-btn">去结算({{ selectedNum }})</div>
      <div class="action-btn del-btn" @click="delGoods">删除({{ selectedNum }})</div>
      <div class="total">合计：<span>¥<b>{{ totalPrice }}</b></span></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checkAllFlag: false,
      selectedNum: 0,
      delFlag: false,
    };
  },
  methods: {
    /**
         * @method 增减单品数量
         * @param {Boolean} isAdd 是否增加
         * @param {Number} index 商品下标
         */
    changeQty(isAdd, item) {
      // console.log(item);
      // const { quantity, stock } = { item };
      // console.log(quantity, stock);
      if (isAdd && item.quantity < item.stock) {
        this.$set(item, 'quantity', ++item.quantity);
        // console.log('加入购物车');
        // this.$store.commit('addToCart', item);
      } else if (!isAdd && item.quantity > 1) {
        // this.$store.commit('removeItemFromCart', item);
        // console.log('删除一项购物车');
        this.$set(item, 'quantity', --item.quantity);
      }

      this.$set(item, 'subtotal', (item.price * item.quantity).toFixed(1));
    },

    /**
         * @method 选择商品
         * @param {Object} item 商品对象
         */
    selectGoods(item) { // 要提交状态更新
      // 状态值取反，并根据状态值对selectedNum进行加减
      //item.checked = !item.checked;
      this.$store.commit('selectItem',item)
      item.checked ? this.selectedNum += 1 : this.selectedNum -= 1;
      // 设置全选
      this.selectedNum === this.cart.length ? this.checkAllFlag = true : this.checkAllFlag = false;
    },

    /**
         * @method 全选
         */
    checkAll() {
      const self = this;
      this.checkAllFlag = !this.checkAllFlag;

      this.cart.forEach((item) => {
        if (self.checkAllFlag) {
          // 全选
          item.checked = true;
          self.selectedNum = self.cart.length;
        } else {
          // 取消全选
          item.checked = false;
          self.selectedNum = 0;
        }
      });
    },

    /**
         * @method 切换删除按钮
         */
    toggleDelBtn() {
      this.delFlag = !this.delFlag;
    },

    /**
         * @method 删除商品
         */
    delGoods() {
      /**
             * !提示：
             * 每次遍历删除数组元素时，会减少数组长度，所以不能缓存length
             * 也不能用forEach方法，因为它会自动缓存数组的长度
             * 这里还可以用filter
             */
      // const cart = this.cart;
      this.cart = this.cart.filter(item => !item.checked);
      // for (var i = 0; i < cart.length; i++) {
      //     cart[i].checked && cart.splice(i--, 1);
      // };

      // 重置 被选商品数量、全选状态、删除状态
      this.selectedNum = 0;
      this.checkAllFlag = false;
      this.delFlag = !this.delFlag;
    },
    goBack() {
      this.$router.push('/');
    },
  },
  computed: {
    /**
     * @method 已选商品的总额
     */
    cart() {
      return this.$store.state.cartList;
    },
    totalPrice() {
      return this.$store.getters.totalPrice
    },
  },
  // watch: {
  //   selectedNum() {
  //     let num = 0;
  //     this.cart.forEach((item) => {
  //       if (item.checked) {
  //         num += parseFloat(item.subtotal);
  //       }
  //       //  item.checked && (num += parseFloat(item.subtotal));
  //     });
  //     this.totalPrice = num;
  //   },
  // },
  mounted() {
    console.log(this.$store.state.cartList);
  },
};

</script>

<style>
  .empty-states {
    padding-top: 60px;
    font-size: 18px;
    color: #AEB0B7;
    text-align: center;
  }

  .cart-list .goods-info {
    width: 68%;
  }

  .item-selector {
    width: 12%;
  }

  .icon-selector {
    position: relative;
    margin: 16px auto 0 auto;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid #ccc;
    cursor: pointer;
  }

  .selector-active {
    background-color: #7a45e5;
    border-color: #7a45e5;
  }

  .selector-active .icon {
    position: absolute;
    top: 2px;
    left: 2px;
  }

  .goods-num {
    position: absolute;
    right: 10px;
    top: 4px;
    width: 32px;
    color: #999;
    text-align: center;
  }

  .show-num {
    line-height: 28px;
  }

  .num-btn {
    width: 100%;
    height: 24px;
    font-size: 20px;
    line-height: 20px;
    cursor: pointer;
  }

  .action-bar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 52px;
    font-size: 15px;
    background-color: #fff;
    border-top: 1px solid #ddd;
  }

  .g-selector {
    float: left;
    width: 70px;
    margin-left: 4%;
    height: 52px;
    cursor: pointer;
  }

  .g-selector .item-selector {
    position: relative;
    display: inline-block;
  }

  .g-selector span {
    position: absolute;
    margin-left: 20px;
    color: #5F646E;
    top: 15px;
  }

  .total {
    float: right;
    color: #363636;
    font-size: 14px;
    line-height: 50px;
    margin-right: 20px;
  }

  .total span {
    color: #7A45E5;
  }

  .total b {
    font-size: 17px;
    margin-left: 4px;
  }

  .action-btn {
    float: right;
    width: 120px;
    height: 100%;
    color: #fff;
    text-align: center;
    font-weight: 300;
    line-height: 52px;
    cursor: pointer;
  }

  .buy-btn {
    background-color: #7A45E5;
  }

  .del-btn {
    display: none;
    background-color: #FF4069;
  }

  .del-box .total {
    display: none;
  }

  .del-box .buy-btn {
    display: none;
  }

  .del-box .del-btn {
    display: block;
  }

</style>
