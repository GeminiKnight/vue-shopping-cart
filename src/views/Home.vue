<template>
  <div class="device" id="page-list">
    <header><span class="header-title">商品列表</span></header>
    <div class="page">
      <div class="tab-wrap">
        <ul class="cate-tab">
          <li class="cate" v-bind:class="{'tab-active': cate_index === index}"
            v-for="(item, index) in cate"
            :key="index" @click="toggleCate(index)">{{ item.des }}</li>
        </ul>
      </div>
      <ul class="filter-bar">
        <li class="filter-opt"
          :class="{'filter-active': filter_index === index,
          'filter-price': item.method === 'sortPrice',
          'price-down': price_isAsc, 'price-up': !price_isAsc}"
          v-for="(item, index) in sortMethods" :key="index" @click="sortBy(item.method)">{{
          item.name }}</li>
      </ul>
      <ul class="goods-list">
        <li class="goods-item" v-for="(item, index) in list" :key="index">
          <div class="goods-img">
            <img v-bind:src="item.img" v-bind:alt="item.name">
            <div class="flag" v-if="item.ishot">热</div>
          </div>
          <div class="goods-info">
            <p class="goods-title">{{ item.name }}</p>
            <div class="goods-price">
              <span>¥<b>{{ item.price }}</b></span>
            </div>
            <span class="des">{{ item.sales }}人付款</span>
            <span class="save" @click="addToCart(item)">+</span>
          </div>
        </li>
      </ul>
      <div class="gotoCart" @click="gotoCart">
        <i class="iconfont icon-gouwuche"></i>去购物车
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import mockData from '@/assets/data';

export default {
  data() {
    return {
      cate_index: 0, // 当前分类项下标1
      filter_index: 0, // 当前条件筛选项下标
      price_isAsc: false, // 价格是否升序
      cate: mockData.cate,
      sortMethods: mockData.sortMethods,
      goods: mockData.goods,
      list: [],
    };
  },
  computed: {
    cartList() {
      return this.$store.state.cartList;
    },
  },
  methods: {

    /**
       * @method 设置商品列表
       */
    setList() {
      const self = this;
      this.list = this.goods.filter(item => (self.cate_index !== 0
        ? item.type === self.cate_index
        : item));
    },

    /**
       * @method 切换分类
       * @param {Number} index 需要切换类目的数组下标
       */
    toggleCate(index) {
      this.cate_index = index;
      // 分类操作
      this.setList();
      // 价格排序状态保持不变
      const filterIndex = this.filter_index;
      (filterIndex === 2) && (this.price_isAsc = !this.price_isAsc);
      // 商品排序
      this.sortBy(this.sortMethods[filterIndex].method);
    },

    /**
       * 根据属性值进行升序或降序的比较器
       *
       * @method 属性比较器
       * @param {String} prop 属性名
       * @param {String} type 排序方法 (desc: 降序, asc: 升序)
       */
    compare(prop, type = 'desc') {
      return function (obj1, obj2) {
        if (type === 'desc') {
          return obj2[prop] - obj1[prop];
        } if (type === 'asc') {
          return obj1[prop] - obj2[prop];
        }
      };
    },

    /**
       * @method 按销量排序
       */
    sortSales() {
      this.list.sort(this.compare('sales'));
    },

    /**
       * @method 按价格排序
       */
    sortPrice() {
      const type = this.price_isAsc ? 'desc' : 'asc';
      this.list.sort(this.compare('price', type));
      this.price_isAsc = !this.price_isAsc;
    },

    /**
       * @method 排序调度器
       * @param {String} method 方法名
       */
    sortBy(method = 'setList') {
      this.filter_index = this.sortMethods.findIndex(item => item.method === method);
      if (method !== 'sortPrice') {
        this.price_isAsc = false;
      }
      // method !== 'sortPrice' && (this.price_isAsc = false);
      this[method]();
    },

    /**
       * @method 添加到购物车
       * @param {Object} goods 商品
       */
    addToCart(goods) {
      this.$store.commit('addToCart', goods);
    },
    gotoCart() {
      this.$router.push('/cart');
    },
  },
  created() {
    this.setList();
  },
};

</script>

<style>
  .tab-wrap {
    height: 60px;
    background: red;
    overflow: hidden;
  }

  .cate-tab {
    white-space: nowrap;
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    background-color: #5D4285;
  }

  .cate {
    display: inline-block;
    width: 80px;
    height: 70px;
    color: #fff;
    line-height: 60px;
    text-align: center;
  }

  .tab-active {
    background-color: #9A51FF;
  }

  .filter-bar {
    display: flex;
    height: 40px;
    background-color: #fff;
    border-bottom: 1px solid #E5E5E5;
    line-height: 40px;
  }

  .filter-opt {
    position: relative;
    width: 33.3%;
    color: #5F646E;
    text-align: center;
  }

  .filter-active {
    color: #7B57C5;
  }

  .filter-price:after {
    position: absolute;
    top: 13px;
    margin-left: 4px;
    content: '';
    display: inline-block;
    width: 8px;
    height: 14px;
    background: url('http://ov52d8mm7.bkt.clouddn.com/arrow-default.png') no-repeat;
    background-size: 8px 14px;
  }

  .filter-active.price-up:after {
    background: url('http://ov52d8mm7.bkt.clouddn.com/arrow-down.png') no-repeat;
    background-size: 8px 14px;
  }

  .filter-active.price-down:after {
    background: url('http://ov52d8mm7.bkt.clouddn.com/arrow-up.png') no-repeat;
    background-size: 8px 14px;
  }

  .goods-list {
    padding-top: 8px;
    height: 513px;
    overflow-y: scroll;
  }

  .cart-list {
    height: 560px;
  }

  .goods-item {
    display: flex;
    margin-bottom: 8px;
    padding: 10px 6px;
    min-height: 62px;
    background: #fff;
  }

  .goods-img {
    position: relative;
    margin-right: 4%;
    display: block;
    width: 16%;
  }

  .goods-img img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

  .goods-item .flag {
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    font-size: 12px;
    color: #fff;
    text-align: center;
    line-height: 20px;
    background-color: #FC5951;
    border-radius: 50%;
  }

  .goods-info {
    position: relative;
    width: 80%;
  }

  .goods-title {
    width: 80%;
    height: 38px;
    color: #363636;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .goods-price {
    margin-top: 6px;
    line-height: 1;
  }

  .goods-price span {
    font-size: 15px;
    color: #7a45e5;
    /*   background: linear-gradient(90deg, #03D2B3 0, #2181FB 80%, #2181FB 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; */
  }

  .des {
    font-size: 12px;
    color: #888;
  }

  .save {
    position: absolute;
    right: 10px;
    bottom: 2px;
    width: 32px;
    height: 22px;
    background-color: #7a45e5;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #fff;
    border-radius: 12px;
    overflow: hidden;
  }

  .gotoCart{
    position: fixed;
    background-color: #FC5951;
    bottom:0;
    width:100%;
    height:20px
  }
</style>
