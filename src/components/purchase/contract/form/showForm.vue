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

.btn-submit-save {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  text-align: center;
  padding: 15px;
}

.el-form-item {
  margin-bottom: 10px;
}
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title"> 查看采购合同</h2>
        <ul>
          <li v-for="item in productListSet" class="list-style" v-bind:class="{ 'active' : index==item.key}"
              @click="setIndexValue(item.key)"><span>{{ item.name }}</span>
          </li>
          <div class="btn-submit-save">
            <perm label="purchasing-contract-export">
              <div v-if="form.purchaseContractIsUsed" style="margin-bottom: 10px">
                <el-button style="width: 150px" type="success" @click="synchroOrder">同步采购合同</el-button>
              </div>
            </perm>
            <perm label="purchasing-contract-edit">
              <div style="margin-bottom: 10px">
                <el-button :disabled="isPrinting" :loading="isPrinting" :plain="true" style="width: 150px" type="success"
                           @click="exportExcel">{{ isPrinting ? '打印中' : '打印合同' }}
                </el-button>
              </div>
            </perm>
            <div style="margin-bottom: 10px">
              <el-button style="width: 150px" @click="$emit('right-close')">关闭</el-button>
            </div>
          </div>
        </ul>
      </div>
      <div v-loading="isLoading" class="content-right min-gutter">
        <h3>{{currentPartName}}</h3>

        <div class="hide-content" v-bind:class="{'show-content' : index==0}">
          <el-form ref="orderAddForm" :model="form" :rules="rules" label-width="160px" onsubmit="return false"
                   style="padding-right: 20px" @submit.prevent="onSubmit">
            <el-form-item label="合同名称">
              {{form.purchaseContractName}}
            </el-form-item>
            <el-form-item label="合同编号">
              {{form.purchaseContractNo}}
            </el-form-item>
            <el-form-item label="物流方式">
              <dict :dict-group="'transportationMeans'" :dict-key="form.transportationMeansId"></dict>
            </el-form-item>
            <el-form-item label="供货单位">
              {{form.supplierName}}
            </el-form-item>
            <el-form-item v-show="showContent.isShowOtherContent&&(form.transportationMeansId==='1' || form.transportationMeansId==='3')"
                          label="物流商">
              {{form.logisticsProviderName}}
            </el-form-item>
            <el-form-item v-show="showContent.isShowOtherContent&&form.transportationMeansId==='2' " :clearable="true"
                          label="提货地址">
              {{form.pickUpWarehouseName}}
            </el-form-item>
            <el-form-item v-show="showContent.isShowOtherContent" label="运输条件">
              <dict :dict-group="'transportationCondition'" :dict-key="form.transportationCondition"></dict>
            </el-form-item>
            <el-form-item label="物流中心">
              {{form.centreName}}
            </el-form-item>
            <el-form-item label="仓库地址">
              {{ form.warehouseAddress}}
            </el-form-item>
            <!--<el-form-item label="是否进口">-->
            <!--{{form.importedFlag | formatStatus}}-->
            <!--</el-form-item>-->
            <el-form-item label="是否生效">
              {{form.availabilityStatus | formatStatus}}
            </el-form-item>
            <el-form-item label="是否生成过采购订单">
              {{form.purchaseContractIsUsed | formatStatus}}
            </el-form-item>
            <el-form-item label="其他约定事项">
              {{form.remark}}
            </el-form-item>
            <el-form-item label-width="120px">
              <el-button type="primary" @click="index++">查看疫苗</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="hide-content" v-bind:class="{'show-content' : index==1}">

          <div class="product-list-detail">
            <h3 style="background: #13ce66;color: #fff">已选疫苗</h3>
            <table class="table">
              <thead>
              <tr>
                <th style="width: 300px">疫苗名称</th>
                <th>疫苗单价</th>
                <th>疫苗数量</th>
                <th>金额</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="product in form.detailDtoList" :class="{'combinatioon-product':product.isCombination}">
                <td>
                  <el-tag v-show="product.isCombination" :class="{ml15:product.isCombination}" style="font-size: 10px"
                          type="success">组合
                  </el-tag>
                  <span>{{product.orgGoodsName}}</span>
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
                <td colspan="2"><span v-show="form.detailDtoList.length && totalMoney"
                                      style="color: #333;font-weight: 700">合计:</span><span
                  v-show="form.detailDtoList.length && totalMoney">   ¥{{ totalMoney | formatMoney }}</span></td>
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
import utils from '@/tools/utils';

export default {
  name: 'showForm',
  loading: false,
  props: ['action', 'type', 'orderId'],
  data: function () {
    return {
      loading: false,
      idNotify: true,
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
      accessoryList: [], // 组合疫苗列表
      searchProductList: [],
      filterProductList: [],
      form: {
        'purchaseContractNo': '',
        'purchaseContractName': '',
        'availabilityStatus': true,
        'orgId': '',
        'customerId': '',
        'bizType': '1-0',
        'type': this.type,
        'logisticsProviderName': '',
        'transportationCondition': '0',
        'transportationMeansId': '1',
        'transportationAddress': '',
        'importedFlag': '',
        'orgRelation': '',
        'logisticsCentreId': this.$store.state.logisticsCentreId,
        'expectedTime': '',
        'detailDtoList': [],
        'supplierId': '',
        'remark': '',
        'pickUpAddress': ''
      },
      rules: {},
      orderGoodsRules: {},
      currentPartName: '',
      index: 0,
      productListSet: [
        {name: '基本信息', key: 0},
        {name: '查看疫苗', key: 1}
      ],
      saveKey: 'inOrderForm',
      showContent: {
        isShowOtherContent: true, // 是否显示物流类型
        isShowSupplierId: true, // 是否显示来源单位
        expectedTimeLabel: '预计入库时间'
      },
      currentTransportationMeans: [],
      cdcWarehouses: [],
      supplierWarehouses: [],
      changeTotalNumber: utils.changeTotalNumber,
      isCheckPackage: utils.isCheckPackage,
      isPrinting: false,
      purchaseContractId: '',
      isLoading: false
    };
  },
  computed: {
    totalMoney: function () {
      let totalMoney = 0.00;
      if (!this.form.detailDtoList.length) return totalMoney;
      this.form.detailDtoList.forEach(item => {
        totalMoney += item.amount * item.unitPrice;
      });
      return totalMoney;
    }
  },
  watch: {
    action: function (val) {
      if (val === 'watch') {
        this.queryInfo(this.orderId);
      }
    }
  },
  mounted: function () {
    this.currentPartName = this.productListSet[0].name;
  },
  methods: {
    queryInfo(val) {
      // 重置表单
      this.resetForm();
      this.isLoading = true;
      if (!val) {
        this.isLoading = false;
        return;
      }
      PurchaseContract.queryContractDetail(val).then(res => {
        this.isLoading = false;
        this.form = {
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
        this.form.detailDtoList.forEach(f => {
          f.orgGoodsName = f.name;
        });
      });
    },
    resetForm() {
      this.form = {
        'purchaseContractNo': '',
        'purchaseContractName': '',
        'availabilityStatus': true,
        'orgId': '',
        'customerId': '',
        'bizType': '1-0',
        'type': this.type,
        'logisticsProviderName': '',
        'transportationCondition': '0',
        'transportationMeansId': '1',
        'transportationAddress': '',
        'importedFlag': '',
        'orgRelation': '',
        'logisticsCentreId': this.$store.state.logisticsCentreId,
        'expectedTime': '',
        'detailDtoList': [],
        'supplierId': '',
        'remark': '',
        'pickUpAddress': ''
      };
    },
    setIndexValue: function (value) {// 左侧显示页切换
      this.index = value;
    },
    doClose: function () {
      this.$emit('right-close');
    },
    synchroOrder: function () {
      this.$confirm('确认对采购合同《' + this.form.purchaseContractName + '》进行同步信息操作?', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        PurchaseContract.synchroContract(this.orderId).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '同步采购合同《' + this.form.purchaseContractName + '》的信息成功'
          });
          this.$emit('change', this.form);
          this.$emit('right-close');
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '同步采购合同《' + this.form.purchaseContractName + '》的信息失败'
          });
        });
      });
    },
    exportExcel() {
      this.isPrinting = true;
      this.$http.get(`/contract-print/${this.orderId}`).then(res => {
        utils.download(res.data.url, '采购合同');
        this.isPrinting = false;
      }).catch(error => {
        this.isPrinting = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    }
  }
};
</script>
