<style lang="scss" scoped>
  @import '../../../../assets/mixins.scss';

  $leftWidth: 280px;
  .content-part {
    .content-left {
      text-align: center;
      width: $leftWidth;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
      }

      left: $leftWidth;
    }
  }

  .btn-submit-save {
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
    z-index: 1;
    text-align: center;
    padding: 15px;
  }

  .product-list {
    padding: 10px;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    bottom: 140px;
    overflow: auto;

  }

  .product-item {
    margin-bottom: 15px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background: #eef2f3;
    padding: 15px 0;
    cursor: pointer;
    position: relative;

    &.active {
      background: white;
    }

    &.is-total {
      border: 0;

      h2 {
        background: #eef2f3;
        padding: 4px 0;
        text-align: left;
      }
    }
  }

  .oms-row {
    color: #777;
    text-align: left;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">添加收货信息</h2>

        <div class="product-list">
          <div class="product-item is-total" style="cursor: default" v-show="!isValid">
            <h2>基本信息:</h2>
            <oms-row label="包装是否完好" :span="10" class="mb-10">
              <el-radio-group v-model="form.packComplete">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </oms-row>
            <oms-row label="温度是否合格" :span="10">
              <el-radio-group v-model="form.tempQualified">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </oms-row>
          </div>
          <div v-show="isValid">
            <div v-for="(product,key) in productList" :class="{'active': activeKey === key }"
                 @click="changeProduct(product, key)" class="product-item">
              <oms-row label="疫苗名称" :span="span">{{product.name}}</oms-row>
              <oms-row label="批号" :span="span">{{product.batchNumber}}</oms-row>
              <oms-row label="规格" :span="span">{{product.orgGoodsDto.goodsDto.specifications}}</oms-row>
              <oms-row label="生产厂商" :span="span">{{product.orgGoodsDto.goodsDto.factoryName}}</oms-row>
              <oms-row label="数量" :span="span">{{product.amount}}</oms-row>
            </div>
            <div class="product-item is-total" style="cursor: default">
              <h2>合计:</h2>
              <oms-row label="应收数量" :span="span">{{ totalCount }}</oms-row>
              <oms-row label="实收数量" :span="span">{{ receiptCount }}</oms-row>
            </div>
          </div>
        </div>
        <div class="btn-submit-save" v-show="isValid">
          <perm label="pov-receipt">
            <el-button type="primary" :plain="true" @click="autoComplete" :disabled="doing">一键收货</el-button>
          </perm>
          <el-button type="primary" @click="onSubmit" :disabled="doing">保存</el-button>
        </div>
      </div>
      <div class="content-right content-padding" v-show="isValid">
        <h3></h3>
        <div v-for="(item, key) in productList" v-show="key === activeKey">
          <el-form :ref=" 'form' + key" :model="item" :rules="rules" label-width="160px"
                   style="padding-right: 20px">
            <el-form-item label="疫苗名称" style="margin-bottom: 5px">
              <span>{{ item.name }}</span>
            </el-form-item>
            <el-form-item label="批号" style="margin-bottom: 5px">
              <span>{{ item.batchNumber }}</span>
            </el-form-item>
            <el-form-item label="数量">
              <input class="el-input__inner" type="number" placeholder="请输入数量" v-model.number="item.currentAmount"
                     @input="changeAmount(item)"></input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {InWork, povReceipt} from '@/resources';

  export default {
    props: {
      orderId: String,
      showRight: Boolean
    },
    data() {
      return {
        span: 8,
        currentOrder: {},
        index: 0,
        pageSets: [
          {name: '收货信息', key: 0}
        ],
        productList: [],
        currentItem: {},
        activeKey: 0,
        types: [],
        doing: false,
        rules: {
          bulkCount: [
            {required: true, type: 'number', message: '请输入散件数量', trigger: 'blur'}
          ]
        },
        form: {
          packComplete: '',
          tempQualified: ''
        }
      };
    },
    watch: {
      showRight(val) {
        this.form = {
          packComplete: '',
          tempQualified: ''
        };
        if (!val) return;
        this.queryOrderDetail();
      }
    },
    computed: {
      totalCount() {
        let count = 0;
        this.productList.forEach(i => {
          count += Number(i.amount);
        });
        return count;
      },
      receiptCount() {
        let count = 0;
        this.productList.forEach(i => {
          count += Number(i.currentAmount);
        });
        return count;
      },
      isValid() {
        return this.form.packComplete && this.form.tempQualified;
      }
    },
    methods: {
      onSubmit() {
        let isFullReceive = this.productList.every(item => item.currentAmount !== '');
        if (!isFullReceive) {
          this.$confirm('没有完全收货，是否确认保存', '', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.save();
          });
        } else {
          this.save();
        }
      },
      autoComplete() {
        this.$confirm('是否一键收货', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.doing) return;
          this.doing = true;
          this.$http.post(`erp-receipt/${this.orderId}/auto`).then(() => {
            this.$notify.success({
              message: '收货成功'
            });
            this.doing = false;
            this.$emit('close');
            this.$emit('refreshOrder');
          }).catch(error => {
            this.doing = false;
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '收货失败'
            });
          });
        });
      },
      changeAmount(item) {
        if (item.currentAmount > item.amount) {
          item.currentAmount = item.amount;
        }
      },
      save() {
        let obj = {
          list: []
        };
        this.productList.forEach(f => {
          obj.list.push({
            orderDetailId: f.id,
            batchNumberId: f.batchNumberId,
            batchNumber: f.batchNumber,
            orgGoodsId: f.orgGoodsId,
            totalCount: f.currentAmount
          });
        });
        if (this.doing) return;
        this.doing = true;
        povReceipt.save(this.orderId, obj).then(() => {
          this.$notify.success({
            message: '添加收货信息成功'
          });
          this.doing = false;
          this.$emit('close');
          this.$emit('refreshOrder');
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '添加收货信息失败'
          });
        });
      },
      queryOrderDetail() {
        if (!this.orderId) return false;
        InWork.queryOrderDetail(this.orderId).then(res => {
          res.data.detailDtoList.forEach(f => {
            f.largePackageCount = '';
            f.bulkCount = '';
            f.mediumPackageCount = '';
            f.smallPackageCount = '';
            f.currentAmount = f.amount;
          });
          this.productList = [].concat(res.data.detailDtoList);
          if (this.productList.length) {
            this.currentItem = this.productList[0];
          }
        });
      },
      changeProduct(item, key) {
        this.currentItem = item;
        this.activeKey = key;
      }
    }
  };
</script>

