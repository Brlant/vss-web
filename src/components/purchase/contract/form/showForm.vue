<style lang="less" scoped>
  @import "../../../../assets/mixins.less";

  @leftWidth: 200px;

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
      width: @leftWidth;
    }
    .content-right {
      > h3 {
        left: @leftWidth;
      }
      left: @leftWidth;
    }
  }
  .el-form .el-select {
    display: block;
  }

  .table-product-list {
    font-size: 12px;
    > tbody > tr > td, > thead > tr > th {
      padding: 5px;
    }
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
      color: @activeColor;
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
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title"> 查看采购合同</h2>
        <ul>
          <li class="list-style" v-for="item in productListSet" @click="setIndexValue(item.key)"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <div class="btn-submit-save">
            <perm label="purchasing-contract-export">
              <div style="margin-bottom: 10px" v-if="form.purchaseContractIsUsed">
                <el-button type="success" @click="synchroOrder" style="width: 150px">同步采购合同</el-button>
              </div>
            </perm>
            <perm label="purchasing-contract-edit">
              <div style="margin-bottom: 10px">
                <el-button :plain="true" type="success" @click="exportExcel" style="width: 150px" :loading="isPrinting"
                           :disabled="isPrinting">{{ isPrinting ? '打印中' : '打印合同' }}
                </el-button>
              </div>
            </perm>
            <div style="margin-bottom: 10px">
              <el-button @click="$emit('right-close')" style="width: 150px">关闭</el-button>
            </div>
          </div>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>{{currentPartName}}</h3>

        <div class="hide-content" v-bind:class="{'show-content' : index==0}">
          <el-form ref="orderAddForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false" label-width="160px" style="padding-right: 20px">
            <el-form-item label="合同名称">
              {{form.purchaseContractName}}
            </el-form-item>
            <el-form-item label="合同编号">
              {{form.purchaseContractNo}}
            </el-form-item>
            <el-form-item label="物流方式">
              <dict :dict-group="'transportationMeans'" :dict-key="form.transportationMeansId"></dict>
            </el-form-item>
            <el-form-item label="供货厂商">
              {{form.supplierName}}
            </el-form-item>
            <el-form-item label="物流商"
                          v-show="showContent.isShowOtherContent&&(form.transportationMeansId==='1' || form.transportationMeansId==='3')">
              {{form.logisticsProviderId}}
            </el-form-item>
            <el-form-item label="提货地址" v-show="showContent.isShowOtherContent&&form.transportationMeansId==='2' "
                          :clearable="true">
              {{form.pickUpWarehouseName}}
            </el-form-item>
            <el-form-item label="运输条件" v-show="showContent.isShowOtherContent">
              <dict :dict-group="'transportationCondition'" :dict-key="form.transportationCondition"></dict>
            </el-form-item>
            <el-form-item label="物流中心">
              {{form.centreName}}
            </el-form-item>
            <el-form-item label="疾控仓库地址">
              {{ getWarehouseAddress(form)}}
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
              <el-button type="primary" @click="index++">查看货品</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="hide-content" v-bind:class="{'show-content' : index==1}">

          <div class="product-list-detail">
            <h3 style="background: #13ce66;color: #fff">已选货品</h3>
            <table class="table">
              <thead>
              <tr>
                <th style="width: 300px">货品名称</th>
                <th>货品单价</th>
                <th>货品数量</th>
                <th>金额</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="product in form.detailDtoList" :class="{'combinatioon-product':product.isCombination}">
                <td>
                  <el-tag type="success" v-show="product.isCombination" style="font-size: 10px"
                          :class="{ml15:product.isCombination}">组合
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
                <td colspan="2"><span style="color: #333;font-weight: 700"
                                      v-show="form.detailDtoList.length && totalMoney">合计:</span><span
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
  import { Address, BaseInfo, http, PurchaseContract } from './../../../../resources';
  import utils from '@/tools/utils';

  export default {
    name: 'showForm',
    loading: false,
    props: {
      type: {
        'type': String,
        'default': '1'
      },
      defaultIndex: {
        type: Number,
        default: 0
      },
      action: {
        type: String,
        default: ''
      },
      purchase: Object,
      orderId: String
    },
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
        accessoryList: [], // 组合货品列表
        searchProductList: [],
        filterProductList: [],
        form: {
          'purchaseContractNo': '',
          'purchaseContractName': '',
          'availabilityStatus': true,
          'orgId': '',
          'customerId': '',
          'bizType': '0',
          'type': this.type,
          'logisticsProviderId': '',
          'transportationCondition': '',
          'transportationMeansId': '1',
          'transportationAddress': '',
          'importedFlag': '',
          'orgRelation': '',
          'logisticsCentreId': '',
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
          {name: '查看货品', key: 1}
        ],
        orgList: [],
        customerList: [],
        logisticsList: [],
        goodsList: {},
        relationList: [],
        LogisticsCenter: [],
        doing: false,
        isSupplierOrOrg: false, // 是不是货主或业务单位
        saveKey: 'inOrderForm',
        isStorageData: true, // 判断是不是缓存数据
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
        isPrinting: false
      };
    },
    computed: {
      bizTypeList: function () {
        return this.$store.state.dict['bizInType'];
      },
      transportationMeansList: function () {
        return this.$store.state.dict['transportationMeans'];
      },
      shipmentPackingUnit: function () {
        return this.$store.state.dict['shipmentPackingUnit'];
      },
      measurementUnitList: function () {
        return this.$store.state.dict['measurementUnit'];
      },
      transportationConditionList: function () {
        return this.$store.state.dict['transportationCondition'];
      },
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
      index: function (val) {
        this.productListSet.forEach((item) => {
          if (item.key === val) {
            this.currentPartName = item.name;
          }
        });
      },
      defaultIndex (val) {
        this.isStorageData = false;
        this.index = 0;
        this.idNotify = true;
        let user = this.$store.state.user;
        this.form.orgId = user.userCompanyAddress;
        this.filterOrg();
        this.filterLogistics();
        this.filterAddress();
        this.checkLicence(this.form.orgId);
        if (this.purchase.id) {
          this.createOrderInfo();
        }
        if (val === 2) {
          this.editOrderInfo();
        } else {
          this.resetForm();
          this.form.state = '';
          this.form.id = null;
        }
      },
      transportationMeansList: function (val) {
        this.currentTransportationMeans = val.slice();
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
      createOrderInfo () {
        this.form.detailDtoList = [];
        let orgGoodsId = this.purchase.id;
        if (!orgGoodsId) return;
        http.get(`/purchase-agreement/org-goods/${orgGoodsId}`).then(res => {
          this.form.transportationMeansId = '1';
          this.form.transportationCondition = '0';
          this.form.remark = '';
          if (!res.data.orgGoodsDto.salesFirm) return;
          this.orgList.push({
            id: res.data.orgGoodsDto.salesFirm,
            name: res.data.orgGoodsDto.salesFirmName,
            relationList: []
          });

          this.form.supplierId = res.data.orgGoodsDto.salesFirm;
          this.$nextTick(() => {
            this.filterProductList.push({
              orgGoodsDto: res.data.orgGoodsDto || {},
              list: []
            });
            this.product.orgGoodsId = res.data.orgGoodsDto.id;
            this.product.fixInfo = res.data.orgGoodsDto;
            let price = res.data.orgGoodsDto.procurementPrice;
            this.product.unitPrice = utils.autoformatDecimalPoint(price ? price.toString() : '');
            this.product.measurementUnit = res.data.orgGoodsDto.goodsDto.measurementUnit;
            this.accessoryList = res.data.list;
            this.product.amount = Math.abs(this.purchase.count);
          });
        });
      },
      editOrderInfo () {
        if (!this.orderId) return;
        PurchaseContract.queryContractDetail(this.orderId).then(res => {
//          this.currentOrder = res.data;
          this.resetForm();
          this.isStorageData = true;
          res.data.detailDtoList.forEach(f => {
            f.orgGoodsName = f.name;
          });
          this.form = JSON.parse(JSON.stringify(res.data));
          this.$nextTick(() => {
            this.isStorageData = true;
          });
        });
      },
      resetForm: function () {// 重置表单
        this.form.supplierId = '';
        this.form.actualConsignee = '';
        this.form.logisticsProviderId = '';
        this.form.logisticsCentreId = '';
        this.form.remark = '';
        this.form.detailDtoList = [];
      },
      setIndexValue: function (value) {// 左侧显示页切换
        this.index = value;
      },
      doClose: function () {
        this.$emit('right-close');
      },
      filterOrg: function (query) {// 过滤来源单位
        let orgId = this.form.orgId;
        let bizType = this.form.bizType;
        if (!orgId || !bizType) {
          this.orgList = [];
          this.form.supplierId = '';
          return;
        }
        let params = {
          keyWord: query,
          relation: '1'
        };
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.orgList = res.data;
        });
      },
      filterLogistics: function (query) {// 过滤物流商
        let orgId = this.form.orgId;
        if (!orgId) {
          this.logisticsList = [];
          this.form.logisticsProviderId = '';
          return;
        }
        BaseInfo.queryOrgByValidReation(orgId, {keyWord: query, relation: '3'}).then(res => {
          this.logisticsList = res.data;
        });
      },
      filterAddress () {
        Address.queryAddress(this.form.orgId, {
          deleteFlag: false,
          orgId: this.form.orgId,
          auditedStatus: '1'
        }).then(res => {
          this.cdcWarehouses = res.data;
          let defaultStore = res.data.filter(item => item.default);
          this.form.transportationAddress = defaultStore.length ? defaultStore[0].id : '';
        });
      },
      checkLicence: function (val) {// 校验单位和货主证照是否过期
        if (!val || !this.action) return;
        http.get('/order-licence/org/' + val + '/overdue').then(res => {
          if (!res.data.length) return;
          let msg = '';
          res.data.forEach(item => {
            msg += '"' + item.name + '",';
          });
          msg = msg.substring(0, msg.length - 1);
          this.$notify({
            duration: 2000,
            title: '证照信息过期',
            message: msg + '证照信息已过期,无法创建合同',
            type: 'error'
          });
        });
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
              message: error.response.data && error.response.data.msg || '同步采购合同《' + this.form.purchaseContractName + '》的信息失败'
            });
          });
        });
      },
      exportExcel () {
        this.isPrinting = true;
        this.$http.get(`/contract-print/${this.orderId}`).then(res => {
          utils.download(res.data.url, '采购合同');
          this.isPrinting = false;
        }).catch(error => {
          this.isPrinting = false;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      }
    }
  };
</script>
