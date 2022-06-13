<style lang="scss" scoped>
@import "../../../../assets/mixins.scss";

$leftWidth: 200px;

.el-form .el-checkbox__label {
  font-size: 12px;
  padding-left: 5px;
}

.el-form .el-checkbox__inner {
  width: 14px;
  height: 14px;
}

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

.el-form .el-select {
  display: block;
}

.order-product-box {
  position: relative;
  border-radius: 10px;
  font-size: 12px;
  line-height: 26px;

  .product-info-fix {
    background: #f6f6f6;
    margin-top: 10px;
    padding: 5px;
    margin-bottom: 20px;
  }

  &:hover {
    border-color: #aaa
  }

  .product-remove {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
    color: #666;

    &:hover {
      color: #333
    }
  }

  .order-goods-info {
    .col-label {
      padding-top: 4px;
    }
  }

}

.ml15 {
  margin-left: 40px;
}

.combinatioon-product {
  color: #777
}

.productItem-info {
  float: left;
}

.ar {
  text-align: right;
}

.goods-btn {
  a:hover {
    color: $activeColor;
  }
}
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">编辑采购合同</h2>
        <ul>
          <li v-for="item in productListSet" class="list-style" v-bind:class="{ 'active' : index==item.key}"
              @click="setIndexValue(item.key)"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>{{currentPartName}}</h3>

        <div class="hide-content" v-bind:class="{'show-content' : index==0}">
          <el-form ref="orderAddForm" :model="form" label-width="160px" onsubmit="return false"
                   style="padding-right: 20px" @submit.prevent="onSubmit">
            <el-form-item label="合同名称">
              <oms-input v-model="form.purchaseContractName" placeholder="请输入采购合同名称" type="text"></oms-input>
            </el-form-item>
            <el-form-item label="合同编号">
              <oms-input v-model="form.purchaseContractNo" placeholder="请输入采购合同编号" type="text"></oms-input>
            </el-form-item>
            <el-form-item label="物流方式">
              <dict :dict-group="'transportationMeans'" :dict-key="currentItem.transportationMeansId"></dict>
            </el-form-item>
            <el-form-item label="供货单位">
              {{currentItem.supplierName}}
            </el-form-item>
            <el-form-item v-show="showContent.isShowOtherContent&&(currentItem.transportationMeansId==='1' || currentItem.transportationMeansId==='3')"
                          label="物流商">
              {{currentItem.logisticsProviderName}}
            </el-form-item>
            <el-form-item v-show="showContent.isShowOtherContent&&currentItem.transportationMeansId==='2' " :clearable="true"
                          label="提货地址">
              {{currentItem.pickUpWarehouseName}}
            </el-form-item>
            <el-form-item v-show="showContent.isShowOtherContent" label="运输条件">
              <dict :dict-group="'transportationCondition'" :dict-key="currentItem.transportationCondition"></dict>
            </el-form-item>
            <el-form-item label="物流中心">
              {{currentItem.centreName}}
            </el-form-item>
            <el-form-item label="仓库地址">
              {{ getWarehouseAddress(currentItem)}}
            </el-form-item>
            <!--<el-form-item label="是否进口">-->
            <!--{{form.importedFlag | formatStatus}}-->
            <!--</el-form-item>-->
            <el-form-item label="是否生效">
              {{currentItem.availabilityStatus | formatStatus}}
            </el-form-item>
            <el-form-item label="是否生成过采购订单">
              {{currentItem.purchaseContractIsUsed | formatStatus}}
            </el-form-item>
            <el-form-item label="其他约定事项">
              {{currentItem.remark}}
            </el-form-item>
            <el-form-item label-width="120px">
              <el-button type="primary" @click="index++">查看疫苗</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="hide-content" v-bind:class="{'show-content' : index==1}">
          <div class="product-list-detail">
            <h3 style="background: #13ce66;color: #fff">已选疫苗1</h3>
            <table class="table">
              <thead>
              <tr>
                <th style="width: 240px">疫苗名称</th>
                <th>规格</th>
                <th>疫苗单价</th>
                <th>疫苗数量</th>
                <th>金额</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="product in currentItem.detailDtoList" :class="{'combinatioon-product':product.isCombination}">
                <td>
                  <el-tag v-show="product.isCombination" :class="{ml15:product.isCombination}" style="font-size: 10px"
                          type="success">组合
                  </el-tag>
                  <span>{{product.orgGoodsName}}</span>
                </td>
                <td>
                  <span v-if="product.orgGoodsDto">{{ product.orgGoodsDto.goodsDto.specifications }}</span>
                  <span v-else-if="product.fixInfo">{{ product.fixInfo.goodsDto.specifications }}</span>
                  <span v-else>{{ product.specifications }}</span>
                </td>
                <td>
                  <span v-show="Number(product.unitPrice)">¥{{product.unitPrice | formatMoney}}</span>
                  <span v-if="!Number(product.unitPrice)">-</span>
                </td>
                <td>{{product.amount}} <span v-show="product.measurementUnit">（<dict
                  :dict-group="'measurementUnit'"
                  :dict-key="product.measurementUnit"></dict>）</span>
                </td>
                <td>
                  <span v-show="Number(product.unitPrice)">¥{{ product.amount * product.unitPrice | formatMoney
                    }}</span>
                  <span v-if="!Number(product.unitPrice)">-</span>
                </td>
              </tr>
              <tr>
                <td colspan="3"></td>
                <td colspan="2"><span v-show="currentItem.detailDtoList.length && totalMoney"
                                      style="color: #333;font-weight: 700">合计:</span><span
                  v-show="currentItem.detailDtoList.length && totalMoney">   ¥{{ totalMoney | formatMoney }}</span></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {PurchaseContract} from './../../../../resources';

export default {
  name: 'editForm',
  loading: false,
  props: ['action', 'type', 'orderId'],
  data: function () {
    return {
      loading: false,
      product: {
        'amount': null,
        'entrustment': false,
        'measurementUnit': '',
        'orgGoodsId': '',
        'packingCount': null,
        'specificationsId': '',
        'orgGoodsName': '',
        'unitPrice': null,
        'fixInfo': {
          'goodsDto': {}
        }
      },
      form: {},
      currentPartName: '',
      index: 0,
      productListSet: [
        {name: '基本信息', key: 0},
        {name: '疫苗信息', key: 1}
      ],
      doing: false,
      showContent: {
        isShowOtherContent: true, // 是否显示物流类型
        isShowSupplierId: true, // 是否显示来源单位
        expectedTimeLabel: '预计入库时间'
      },
      currentItem: {
        detailDtoList: []
      }
    };
  },
  computed: {
    totalMoney: function () {
      let totalMoney = 0.00;
      if (!this.currentItem.detailDtoList.length) return totalMoney;
      this.currentItem.detailDtoList.forEach(item => {
        totalMoney += item.amount * item.unitPrice;
      });
      return totalMoney;
    }
  },
  watch: {
    orderId: function (val) {
      if (val && this.action === 'edit') {
        this.queryInfo(val);
      }
    }
  },
  mounted: function () {
    this.currentPartName = this.productListSet[0].name;
  },
  methods: {
    getWarehouseAddress: function (item) { // 得到仓库地址
      if (!item.warehouseAddress) {
        return '';
      }
      return item.warehouseAddress;
    },
    queryInfo(val) {
      if (!val) return;
      PurchaseContract.queryContractDetail(val).then(res => {
        this.currentItem = {
          'purchaseContractNo': res.data.purchaseContractNo,
          'purchaseContractName': res.data.purchaseContractName,
          'centreName': res.data.centreName,
          'pickUpWarehouseName': res.data.pickUpWarehouseName,
          'logisticsProviderName': res.data.logisticsProviderName,
          'supplierName': res.data.supplierName,
          'transportationCondition': res.data.transportationCondition,
          'transportationMeansId': res.data.transportationMeansId,
          'warehouseAddress': res.data.warehouseAddress,
          'availabilityStatus': res.data.availabilityStatus,
          'purchaseContractIsUsed': res.data.purchaseContractIsUsed,
          'remark': res.data.remark,
          'detailDtoList': res.data.detailDtoList
        };
        this.form.purchaseContractName = res.data.purchaseContractName;
        this.form.purchaseContractNo = res.data.purchaseContractNo;
        this.currentItem.detailDtoList.forEach(f => {
          f.orgGoodsName = f.name;
        });
      });
    },
    setIndexValue: function (value) {// 左侧显示页切换
      this.index = value;
    },
    doClose: function () {
      this.$emit('right-close');
    },
    onSubmit: function () {// 提交表单
      let self = this;
      this.$refs['orderAddForm'].validate((valid) => {
        if (!valid || this.doing) {
          this.index = 0;
          return false;
        }
        this.doing = true;
        if (this.orderId) {
          PurchaseContract.updatePurchaseContractName(this.orderId, this.form).then(res => {
            this.$notify({
              duration: 2000,
              message: '编辑采购合同成功',
              type: 'success'
            });
            self.$emit('change');
            this.$nextTick(() => {
              this.doing = false;
              this.$emit('right-close');
            });
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '编辑采购合同失败',
              message: error.response && error.response.data && error.response.data.msg || '网络异常',
              type: 'error'
            });
          });
        }
      });
    }
  }
};
</script>
