<style lang="scss" scoped>
@import "../../../../assets/mixins";

$leftWidth: 240px;
.el-col {
  line-height: 24px;
}

.el-form .el-checkbox__label {
  font-size: 12px;
  padding-left: 5px;
}

.el-form .el-checkbox__inner {
  width: 14px;
  height: 14px;
}

.content-part {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;

  .content-left {
    width: $leftWidth;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    text-align: left;
    background-color: #eef2f3;

    > ul {
      margin: 10px 0 0 0;
    }

    > h2 {
      padding: 0;
      text-align: center;
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      line-height: 55px;
      border-bottom: 1px solid #ddd;
      background-color: #eef2f3;
    }
  }

  .content-right {
    > h3 {
      padding: 0;
      margin: 0;
      font-size: 18px;
      font-weight: normal;
      height: 55px;
      line-height: 55px;
      border-bottom: 1px solid #ddd;
      text-align: center;
      margin-bottom: 20px;
      position: fixed;
      top: 0;
      right: 0;
      left: $leftWidth;
      background: #fff;
      z-index: 2;
    }

    position: absolute;
    top: 0;
    left: $leftWidth;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding-top: 75px;

    .hide-content {
      display: none;
    }

    .show-content {
      /*padding: 0 20px;*/
      display: block;
    }
  }
}

.show-list {
  padding: 0 15px;
  max-height: 500px;
  overflow-y: auto;

  .list-item {
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    background: #ffffff;

    &:hover, &.active {
      background: $activeColor;
      color: $activeColorFont;

      .count {
        color: $activeColorFont;
      }
    }

    .title {
      font-size: 14px;
    }

    .textCenter {
      text-align: center;
    }

    .count {
      color: #777;
    }
  }
}

</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">收货信息</h2>
        <ul class="show-list">
          <li v-for="(item, key) in products" :class="{ 'active' : index===key}" class="list-item"
              @click="changeProduct(item, key)">
            <div class="title">
              <span v-if="item.orgGoodsDto">{{ item.orgGoodsDto.goodsDto.name }}</span>
              <span v-else="">{{ item.name }}</span>
            </div>
            <div v-if="item.orgGoodsDto" class="count">
              应收数量: {{item.amount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </div>
            <div v-show="item.batchNumber">
              批号：{{item.batchNumber}}
            </div>
          </li>
          <li align="center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;text-align: center">
            <div v-show="isShowBtn">
              <div>
                <el-button :disabled="doing" type="success" @click="submitReceiptInfo()">
                  提交收货信息
                </el-button>
              </div>
            </div>
            <el-button :disabled="doing" class="mt-10"
                       style="padding: 10px 28px" type="primary" @click="receiptOrder()">收货完成
            </el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3></h3>
        <batch-part :currentItem="currentItem" :currentOrder="currentOrder"
                    :index="index" :orderId="orderId" @showSubmitButton="showSubmitButton"></batch-part>
      </div>
    </div>
  </div>
</template>
<script>
import batchPart from './batch-info';
import {erpOrder, receiptApi} from '@/resources';

export default {
  components: {
    batchPart,
  },
  props: {
    orderId: String,
    defaultIndex: Number
  },
  data() {
    return {
      index: -1,
      products: [],
      currentOrder: {},
      currentItem: {},
      doing: false,
      isShowBtn: false,
      errorList: []
    };
  },
  watch: {
    defaultIndex() {
      this.isShowBtn = false;
      if (this.defaultIndex !== 3) return;
      this.currentItem = {};
      this.currentOrder = {};
      this.products = [];
      this.index = -1;
      this.$nextTick(() => {
        this.index = 0;
      });
      this.getOrderInfo();
    }
  },
  methods: {
    showSubmitButton() {
      this.isShowBtn = true;
    },
    closeSubmitButton() {
      this.isShowBtn = false;
    },
    getOrderInfo: function () {
      if (this.orderId) {
        erpOrder.get(this.orderId, {lockFlag: false}).then(res => {
          this.currentOrder = JSON.parse(JSON.stringify(res.data));
          this.$http.get('/receipt/order/' + this.orderId).then(res => {
            this.currentOrder.detailDtoList.forEach(i => {
              i.receiptInfoList = res.data.filter(f => f.orderDetailId === i.id);
            });
            this.products = this.currentOrder.detailDtoList;
            if (this.products[0]) {
              this.changeProduct(this.products[0], 0);
            }
            this.loadingData = false;
          });
        });
      }
    },
    changeProduct(item, key) {
      this.currentItem = item;
      this.index = key;
    },
    submitReceiptInfo() {
      this.standardReceive();
    },
    standardReceive() {
      for (let i = 0; i < this.products.length; i++) {
        if (!this.products[i].receiptInfoList.length) {
          return this.$notify.info({
            duration: 2000,
            message: `货品"${this.products[i].goodsName}"请添加收货详情`
          });
        }
      }
      this.$confirm('是否提交收货信息', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let list = [];
        this.products.forEach(i => {
          list = list.concat(i.receiptInfoList);
        });
        list = JSON.parse(JSON.stringify(list));
        list.forEach(i => {
          i.isNew && delete i.batchNumberId;
        });
        let obj = {
          list,
          orderId: this.currentOrder.id
        };
        this.doing = true;
        erpOrder.batchReceipt(obj).then(res => {
          this.$notify.success('提交成功');
          if (this.currentOrder.state > 2) {
            this.$emit('returnOrderDetail');
          }
          this.doing = false;
          this.closeSubmitButton();
        }).catch(e => {
          this.doing = false;
          this.$notify.error({
            message: e.response && e.response.data.msg || '提交失败'
          });
        });
      });
    },
    receiptOrder: function (params) {// 确认收货
      this.doing = true;
      this.$http.get('/receipt/order/' + this.orderId).then(receiptInfoList => {
        let isReceipted = this.products.every(e => receiptInfoList.data.some(s => s.orgGoodsId === e.orgGoodsId));
        if (!isReceipted) {
          this.$notify.info({
            duration: 2000,
            message: '存在未进行收货的货品, 请提交收货信息'
          });
          this.doing = false;
          return false;
        }
        erpOrder.receiptOrder(this.currentOrder.id).then(() => {
          this.$notify({
            duration: 2000,
            message: '收货完成',
            type: 'success'
          });
          this.$emit('close');
          this.$emit('refresh');
          this.doing = false;
        }).catch(error => {
          this.doing = false;
          if (error.response && error.response.data && error.response.data.code === 601) {
            this.errorList = error.response.data.data;
            this.$refs.dialogNotify.visible = true;
          } else {
            this.$notify({
              duration: 2000,
              title: '无法操作',
              message: error.response && error.response.data && error.response.data.msg || '网络异常',
              type: 'error'
            });
          }
        });
      });
    }
  }
};
</script>
