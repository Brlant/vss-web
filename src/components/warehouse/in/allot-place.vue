<style lang="less" scoped>
  @leftWidth: 280px;
  .content-part {
    .content-left {
      width: @leftWidth;
    }
    .content-right {
      > h3 {
        left: @leftWidth;
      }
      left: @leftWidth;
    }
  }

  .store-list {
    display: flex;
    flex-wrap: wrap;
    padding-left: 8px;
    .store-item {
      width: 260px;
      height: 160px;
      margin: 10px;
      padding: 0;
      background: #fff;
      border: 1px solid #eee;
      h3 {
        margin: 0;
        padding: 5px 10px;
        background: #eee;
      }
      .store-body {
        position: relative;
        padding: 10px;
        color: #666;
        font-size: 12px;
        line-height: 20px;
        .store-other-info {
          font-size: 13px;
          padding-top: 15px;
          line-height: 22px;
          input {
            width: 50px;
            height: 24px;
            margin-left: 5px;
            border-radius: 4px;
            border: 1px solid #ccc;
            box-shadow: none;
            outline: none;
          }
        }
        .store-select {
          position: absolute;
          right: -9px;
          bottom: 2px;
          color: #999;
          cursor: pointer;
          &.checked {
            color: #f00
          }
          span {
            font-size: 20px;
          }
        }
      }
    }
  }

  .btn-submit-save {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    text-align: center;
    padding: 15px;
  }

  .product-list {
    padding: 10px;
    .product-item {
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background: #fff;
      text-align: center;
      padding: 15px 0;
      cursor: pointer;
      position: relative;
      .product-status {
        position: absolute;
        right: 3px;
        bottom: 3px;
        color: #0c0;
      }
      .no-bg {
        color: #999;
      }
    }
  }

  .span-title {
    position: relative;

    color: #fff;
    padding: 5px;
    top: -5px;
    right: -10px;
    bottom: -5px;
    width: 18px;
    height: 20px;
    cursor: pointer;
  }

  .lock-title {
    background: #999;
  }

  .deblocking-title {
    background: red;
  }
</style>


<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">分配货位</h2>
        <div class="product-list">
          <div v-for="product in productList" @click="changeProduct(product)" class="product-item">
            <div>{{product.name}}</div>
            <div class="no-bg">批号 {{product.batchNumber}}</div>
            <span class="product-status" v-show="product.checked"><i class="iconfont icon-affirm"></i></span>
          </div>
        </div>
        <basic-info :info="currentProduct" :show="showBaseInfo" :show-close="productList.length>1"
                    @close="closeBaseInfo"
                    @change-type="changeStoreType"></basic-info>
        <div class="btn-submit-save">
          <el-button type="primary" @click="onSubmit()">提交分配方案</el-button>
        </div>
      </div>
      <div class="content-right">
        <h3></h3>
        <div v-if="loadingData">
          <oms-loading :loading="loadingData"></oms-loading>
        </div>
        <div class="empty-info" v-else-if="storeList.length == 0">
          暂无信息
        </div>
        <div v-else="">
          <div class="store-list" v-show="showBaseInfo">
            <div class="store-item" v-for="store in storeList">
              <h3><span class="sotre-status"></span>{{store.name}}
                <!--<span class="iconfont icon-lock pull-right  span-title  deblocking-title" v-show="store.exclusiveStatus"-->
                <!--@click="isLock(store)"></span>-->
                <!--<span class="iconfont icon-deblocking pull-right span-title lock-title" v-show="!store.exclusiveStatus"-->
                <!--@click="isLock(store)"></span>-->
              </h3>
              <div class=" store-body">
                <div>长：{{ store.length }}m  宽：{{ store.width }}m  高：{{ store.height
                  }}m   可存放：{{(store.volume - store.usedSpace).toFixed(1)}}
                </div>
                <el-row>
                  <el-col :span="10">
                    <echart-Pie :dataList="[store.usedSpace,(store.volume-store.usedSpace)]"></echart-Pie>
                  </el-col>
                  <el-col :span="14" class="store-other-info">
                    <div>已存放：{{store.usedSpace.toFixed(1)}}</div>
                    <div>容积：{{store.volume.toFixed(1)}}</div>
                    <div>存放数量:<input type="text" v-model="store.num" @input="changeCount(store)"></div>
                  </el-col>
                  <div class="store-select" :class="{'checked':store.checked}" @click="saveStore(store)"><span
                    class="iconfont icon-affirm"></span></div>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import basicInfo from './basic-info.vue';
  import echartPie from '@/components/common/echart.pie.vue';
  import {InWork, http} from '@/resources';
  import ElCol from 'element-ui/packages/col/src/col';

  export default {
    components: {
      ElCol,
      basicInfo, echartPie
    },
    props: {
      orderId: {
        'type': String,
        'default': ''
      },
      showPartIndex: String
    },
    data: function () {
      return {
        loadingData: false,
        showBaseInfo: false,
        storeList: [],
        form: {type: 0},
        filters: {
          type: 0
        },
        currentProduct: {},
        productList: [],
        isPrivateStores: []
      };
    },
    watch: {
      currentProduct: function (val) {
        let type = 0;
        if (!val.packageCount) type = 1;
        this.filters.type = type;
        this.getStoreList(type);
      },
      showPartIndex: function (val) {
        this.productList = [];
        this.isPrivateStores = [];
        this.showBaseInfo = false;
        if (val !== '2') return;
        this.getProduct();
      }
    },
    mounted() {

    },
    methods: {
      getProduct: function () {
        if (!this.orderId) return;
        InWork.queryOrderDetail(this.orderId).then(res => {
          return res.data;
        }).then(order => {
          http.get(`/receipt/order/${order.id}`).then(res => {
            let goodsDetails = order.detailDtoList.slice();
            goodsDetails.forEach(i => {
              let batchNumbers = res.data.filter(f => f.orderDetailId === i.id);
              batchNumbers.forEach(i1 => {
                let goodsDto = i.orgGoodsDto.goodsDto;
                let obj = {
                  orderDetailId: i.id,
                  name: i.name,
                  amount: i.amount,
                  batchNumber: i1.no,
                  batchNumberId: i1.batchNumberId,
                  packageCount: i1.packageCount,
                  basicPackingCount: i1.basicPackingCount,
                  shipmentPackingUnit: goodsDto.shipmentPackingUnit,
                  partLength: goodsDto.minBoxLength,
                  partWidth: goodsDto.minBoxWidth,
                  partHeight: goodsDto.minBoxHeight,
                  partVolume: goodsDto.minBoxVolume,
                  packageScheme: i1.packageScheme,
                  aggregateQuantity: i1.aggregateQuantity,
                  aslist: [],
                  bslist: [],
                  checked: false
                };
                switch (i1.packageScheme) {
                  case 0:
                    obj.packageUint = goodsDto.largePackageUnit;
                    obj.wholeCount = goodsDto.largePacking;
                    obj.length = goodsDto.largeBoxLength;
                    obj.width = goodsDto.largeBoxWidth;
                    obj.height = goodsDto.largeBoxHeight;
                    obj.volume = goodsDto.largeBoxVolume;
                    break;
                  case 1:
                    obj.packageUint = goodsDto.mediumPackageUnit;
                    obj.wholeCount = goodsDto.mediumPacking;
                    obj.length = goodsDto.mediumBoxLength;
                    obj.width = goodsDto.mediumBoxWidth;
                    obj.height = goodsDto.mediumBoxHeight;
                    obj.volume = goodsDto.mediumBoxVolume;
                    break;
                  case 2:
                    obj.packageUint = goodsDto.smallPackageUnit;
                    obj.wholeCount = goodsDto.smallPacking;
                    obj.length = goodsDto.smallBoxLength;
                    obj.width = goodsDto.smallBoxWidth;
                    obj.height = goodsDto.smallBoxHeight;
                    obj.volume = goodsDto.smallBoxVolume;
                    break;
                }
                this.productList.push(obj);
              });
            });
            if (this.productList.length === 1) {
              this.changeProduct(this.productList[0]);
            }
          });
        });

      },
      changeProduct: function (product) {
        this.currentProduct = product;
        this.showBaseInfo = true;
      },
      closeBaseInfo: function () {
        this.showBaseInfo = false;
        this.storeList = [];
      },
      changeStoreType: function (type) {
        this.filters.type = type;
        this.getStoreList(type);
      },
      getStoreList: function (type) { // 根据类型，得到货位列表
        let params = {
          batchNumberId: this.currentProduct.batchNumberId,
          packageSize: type === 0 ? this.currentProduct.packageScheme : 3
        };
        this.loadingData = true;
        InWork.queryAvailableStore(params).then(res => {
          let ary1 = [];
          res.data.forEach(i => {
            i.checked = false;
            i.num = 0;
          });
          ary1 = res.data;
          let storeList = this.getCurrentTypeStoreList();
          let sLen = storeList.length;
          ary1.forEach((item) => {
            for (let i = 0; i < sLen; i++) {
              if (storeList[i].id === item.id) {
                Object.assign(item, storeList[i], {checked: true});
                break;
              }
            }
          });
          this.storeList = ary1;
          this.loadingData = false;
        }).catch(() => {
          this.loadingData = false;
        });
      },
      filtersStores(stores, privateStores, batchNumberId, type) { // 过滤已锁定的货位 暂时不用
        if (!privateStores.length) return stores;
        let ary1 = [];
        let ary2 = [];
        ary1 = stores.filter(i => privateStores.every(e => e.id !== i.id));
        ary2 = stores.filter(i => privateStores.some(s => {
          if (s.id === i.id && batchNumberId === s.batchNumberId && type === s.type) {
            i.exclusiveStatus = true;
            return true;
          }
          return false;
        }));
        return [].concat(ary1, ary2);
      },
      saveStore: function (store) {
        store.checked = !store.checked;
        let storeList = this.getCurrentTypeStoreList();
        if (store.checked) {
          storeList.push(Object.assign({}, store));
        } else {
          for (let i = 0, sLen = storeList.length; i < sLen; i++) {
            if (storeList[i].id === store.id) {
              storeList.splice(i, 1);
              break;
            }
          }
        }
      },
      getCurrentTypeStoreList: function () {
        let storeList = [];
        if (this.filters.type === 0) {
          storeList = this.currentProduct.aslist;
        } else {
          storeList = this.currentProduct.bslist;
        }
        return storeList;
      },
      changeCount: function (store) {
        if (store.num > (store.volume - store.usedSpace)) {
          this.$notify.warning({
            duration: 20000,
            message: '输入的数量大于可存放的数量'
          });
          return;
        }
        let storeList = this.getCurrentTypeStoreList();
        if (store.checked === true) {
          for (let i = 0, sLen = storeList.length; i < sLen; i++) {
            if (storeList[i].id === store.id) {
              Object.assign(storeList[i], store);
              break;
            }
          }
        }
      },
      isLock(item) { //
        item.exclusiveStatus = !item.exclusiveStatus;
        let index = this.isPrivateStores.indexOf(item);
        if (item.exclusiveStatus && index === -1) {
          this.isPrivateStores.push({
            batchNumberId: this.currentProduct.batchNumberId,
            id: item.id,
            type: this.filters.type
          });
        } else if (!item.exclusiveStatus) {
          this.isPrivateStores.splice(index, 1);
        }
      },
      isExclusiveStatus(i, i1, type, privateStores) { // 判断是否被锁定，暂时不用
        return privateStores.some(s => s.batchNumberId === i.batchNumberId && s.id === i1.id && s.type === type);
      },
      onSubmit: function () {
        let isSubmit = true;
        this.productList.forEach(i => {
          let a = 0;
          let b = 0;
          i.aslist.forEach(i1 => {
            a += parseInt(i1.num, 10) * i.wholeCount;
          });
          i.bslist.forEach(i2 => {
            b += parseInt(i2.num, 10);
          });
          if (i.aggregateQuantity !== (a + b)) {
            isSubmit = false;
            this.$notify.info({
              duration: 20000,
              message: `货品批号为${i.batchNumber}的${i.name}分配货位的数量与收货数量不一致`
            });
          }
          i.aslist.forEach(i3 => {
            if (i3.num > (i3.volume - i3.usedSpace)) {
              isSubmit = false;
              this.$notify.info({
                duration: 20000,
                message: `货品批号为${i.batchNumber}的${i.name}分配的${i3.name}的数量大于可用数量`
              });
            }
          });
        });
        if (!isSubmit) return;
        let list = [];
        let obj = {};
        this.productList.forEach(i => {
          i.aslist.forEach(i1 => {
            list.push({
              orderDetailId: i.orderDetailId,
              batchNumberId: i.batchNumberId,
              storeId: i1.id,
              packageSize: i.packageScheme,
              packageCount: parseInt(i1.num, 10),
              availableCount: parseInt(i1.num, 10) * i.wholeCount
            });
          });
          i.bslist.forEach(i2 => {
            list.push({
              orderDetailId: i.orderDetailId,
              batchNumberId: i.batchNumberId,
              storeId: i2.id,
              packageSize: 3,
              packageCount: parseInt(i2.num, 10),
              availableCount: parseInt(i2.num, 10)
            });
          });
        });
        obj = {
          orderId: this.orderId,
          list: list
        };
        InWork.allotPlace(obj).then(() => {
          this.$notify.success({
            message: '提交分配方案成功'
          });
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '提交分配方案失败'
          });
        });
      }
    }
  };
</script>
