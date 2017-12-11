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
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    .content-left {
      width: @leftWidth;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      text-align: center;
      background-color: #eef2f3;
      > ul {
        margin: 0;
      }
      > h2 {
        padding: 0 45px;
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        line-height: 55px;
        border-bottom: 1px solid #ddd;
        background-color: #eef2f3;
      }
      .list-style {
        cursor: pointer;
        padding: 10px;
        text-align: center;
        span {
          display: inline-block;
          padding: 8px 35px;
        }
        &.active {
          span {
            background-color: @activeColor;
            border-radius: 20px;
            color: @activeColorFont
          }
        }
        &:hover {
          background: #dee9eb
        }

      }

    }
    .content-right {
      > h3 {
        padding: 0;
        margin: 0 0 20px;
        font-size: 18px;
        font-weight: normal;
        line-height: 55px;
        border-bottom: 1px solid #ddd;
        text-align: center;
        position: fixed;
        top: 0;
        right: 0;
        left: @leftWidth;
        background: #fff;
        z-index: 2;
      }
      position: absolute;
      top: 0;
      left: @leftWidth;
      right: 0;
      bottom: 0;
      overflow: auto;
      padding-top: 75px;
      .hide-content {
        display: none;
      }
      .show-content {
        padding: 0 20px;
        display: block;
      }
    }

    .min-gutter {
      .el-form-item {
        margin-bottom: 5px;
      }
      .el-form-item__label {
        font-size: 12px
      }
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

  .product-list-detail {
    margin-top: 20px;
    font-size: 12px;
    h3 {
      background: #eee;
      padding: 10px 15px;
      font-size: 14px;
      font-weight: normal;
    }
  }

  .select-other-info {
    color: #999;
    margin-left: 10px
  }

  .selected {
    .select-other-info {
      color: #ddd
    }
  }

  .ml15 {
    margin-left: 40px;
  }

  .combinatioon-product {
    color: #777
  }

  .el-select-dropdown__item {
    font-size: 14px;
    padding: 8px 10px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #48576a;
    height: auto;
    line-height: normal;
    box-sizing: border-box;
    cursor: pointer;
  }

  .productItem-info {
    float: left;
  }

  .order-good-selects {
    .el-select-dropdown__item {
      font-size: 14px;
      padding: 8px 10px;
      position: relative;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgb(72, 94, 106);
      height: auto;
      width: 680px;
      line-height: 1.5;
      box-sizing: border-box;
      cursor: pointer;
    }
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
            <!--<perm label="purchasing-contract-add">-->
              <!--<div style="margin-bottom: 10px" v-if="!form.purchaseContractIsUsed">-->
                <!--<el-button type="success" @click="createOrder" style="width: 150px">批量生成采购订单</el-button>-->
              <!--</div>-->
            <!--</perm>-->
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
            <el-form-item label="备注">
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
  import { PurchaseContract, LogisticsCenter, http, Address, BaseInfo, InWork } from './../../../../resources';
  import utils from '@/tools/utils';
  import Dict from '../../../common/dict.vue';

  export default {
    components: {Dict},
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
        rules: {
          purchaseContractName: [
            {required: true, message: '请输入采购合同名称', trigger: 'blur'}
          ],
          purchaseContractNo: [
            {required: true, message: '请输入采购合同编号', trigger: 'blur'}
          ],
          supplierId: [
            {required: true, message: '请选择供货厂商', trigger: 'change'}
          ],
          transportationMeansId: [
            {required: true, message: '请选择物流方式', trigger: 'change'}
          ],
          transportationAddress: [
            {required: true, message: '请选择疾控仓库地址', trigger: 'change'}
          ],
          pickUpAddress: [
            {required: true, message: '请选择提货地址', trigger: 'change'}
          ],
          logisticsProviderId: [
            {required: true, message: '请选择物流商', trigger: 'change'}
          ],
          transportationCondition: [
            {required: true, message: '请选择运输条件', trigger: 'change'}
          ],
          expectedTime: [
            {required: true, message: '请选择预计入库时间', trigger: 'change'}
          ]
        },
        orderGoodsRules: {
          orgGoodsId: [
            {required: true, message: '请选择产品', trigger: 'change'}
          ],
          amount: [
            {required: true, min: 1, type: 'number', message: '请输入产品数量', trigger: 'blur'}
          ],
          unitPrice: [
            {required: true, message: '请输入单价', trigger: 'change'}
          ],
          packingCount: [
            {required: true, min: 1, type: 'number', message: '请输入包装数量', trigger: 'blur'}
          ],
          specificationsId: [
            {required: true, message: '请选择包装单位', trigger: 'change'}
          ]
        },
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
      form: {
        handler: 'autoSave',
        deep: true
      },
      transportationMeansList: function (val) {
        this.currentTransportationMeans = val.slice();
      }
    },
    mounted: function () {
      this.currentPartName = this.productListSet[0].name;
      this.filterLogisticsCenter();
      this.initForm();
    },
    methods: {
      getWarehouseAddress: function (item) { // 得到仓库地址
        if (!item.warehouseAddress) {
          return '';
        }
        return utils.formatAddress(item.warehouseProvince, item.warehouseCity, item.warehouseRegion) + '/' + item.warehouseAddress;
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
//          this.$nextTick(() => {
//            this.form.detailDtoList.push({
//              amount: Math.abs(this.purchase.count),
//              orgGoodsId: orgGoodsId,
//              orgGoodsName: res.data.orgGoodsDto.name,
//              unitPrice: res.data.orgGoodsDto.procurementPrice,
//              measurementUnit: res.data.orgGoodsDto.goodsDto.measurementUnit
//            });
//          });
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
      changeNumber () {
        this.product.amount = this.changeTotalNumber(this.product.amount, this.product.fixInfo.goodsDto.smallPacking);
      },
      autoSave: function () {
        if (!this.form.id) {
          window.localStorage.setItem(this.saveKey, JSON.stringify(this.form));
        }
      },
      initForm: function () {// 根据缓存，回设form
        let oldForm = window.localStorage.getItem(this.saveKey);
        if (oldForm) {
          this.form = Object.assign({}, this.form, JSON.parse(oldForm));
          this.form.logisticsCentreId = this.form.logisticsCentreId
            ? this.form.logisticsCentreId : window.localStorage.getItem('logisticsCentreId');
        }
      },
      resetForm: function () {// 重置表单
        this.form.supplierId = '';
        this.form.actualConsignee = '';
        this.form.logisticsProviderId = '';
        this.form.logisticsCentreId = '';
        this.form.remark = '';
        this.form.detailDtoList = [];
      },
      formatPrice: function () {// 格式化单价，保留两位小数
        this.product.unitPrice = utils.autoformatDecimalPoint(this.product.unitPrice);
      },
      changeExpectedTime: function (date) {// 格式化时间
        if (!date) {
          this.form.expectedTime = '';
          return;
        }
        this.form.expectedTime = this.$moment(date).format('YYYY-MM-DD');
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
//        let relation = '';
//        if (bizType === '0') relation = '0';
//        if (bizType === '1') relation = '1';
//        if (!relation) return;
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
      filterLogisticsCenter: function () {// 过滤物流中心
        let param = {
          deleteFlag: false
        };
        LogisticsCenter.query(param).then(res => {
          this.LogisticsCenter = res.data;
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
      getWarehouseAdress: function (item) { // 得到仓库地址
        return utils.formatAddress(item.province, item.city, item.region).split('/').join('') + item.detail;
      },
      bizTypeChange: function (val) {// 业务类型改变
        if (!this.isStorageData) {// 有缓存时，不重置表单
          let orgId = this.form.orgId;
          let bizType = this.form.bizType;
          this.$refs['orderAddForm'].resetFields();
          this.form.remark = '';
          this.form.orgId = orgId;
          this.form.bizType = bizType;
        }
        if (this.transportationMeansList && this.transportationMeansList.length) {
          if (val === '1') {
            this.currentTransportationMeans = this.transportationMeansList.filter(item => item.key !== '1');
          } else {
            this.currentTransportationMeans = this.transportationMeansList.filter(item => item.key !== '3');
          }
        }
        switch (val) {
          case '0' : {
            this.showContent = {
              isShowOtherContent: true, // 是否显示物流类型
              isShowSupplierId: true, // 是否显示来源单位
              expectedTimeLabel: '预计入库时间'
            };
            this.filterOrg();
            break;
          }
          case '1' : {
            this.showContent = {
              isShowOtherContent: true, // 是否显示物流类型
              isShowSupplierId: true, // 是否显示来源单位
              expectedTimeLabel: '拟退货时间'
            };
            this.filterOrg();
            break;
          }
          case '2' : {
            this.showContent = {
              isShowOtherContent: false, // 是否显示物流类型
              isShowSupplierId: false, // 是否显示来源单位
              expectedTimeLabel: ''
            };
            break;
          }
          case '3' : {
            this.showContent = {
              isShowOtherContent: true, // 是否显示物流类型
              isShowSupplierId: false, // 是否显示来源单位
              expectedTimeLabel: '预计入库时间'
            };
            break;
          }
        }

      },
      changeSupplier: function (val) {// 业务单位改变
        if (!this.isStorageData) {// 当有缓存时，不做清空操作
          this.supplierWarehouses = [];
          this.form.pickUpAddress = '';
          this.product.orgGoodsId = '';
          this.form.detailDtoList = [];
          this.$refs['orderGoodsAddForm'].resetFields();
          this.accessoryList = [];
        }
        if (!val) return;
        if (this.form.transportationMeansId === '2') {
          Address.queryAddress(val, {
            deleteFlag: false,
            orgId: val,
            auditedStatus: '1'
          }).then(res => {
            this.supplierWarehouses = res.data;
            let defaultStore = res.data.filter(item => item.default);
            this.form.pickUpAddress = defaultStore.length ? defaultStore[0].id : '';
          });
        }
        this.searchProduct();
        this.checkLicence(val);
      },
      changeTransportationMeans: function () {// 物流方式改变
        if (!this.isStorageData) {// 当有缓存时，不做清空操作
          this.form.pickUpAddress = '';
          this.form.logisticsProviderId = '';
          this.form.supplierId = '';
        }
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
      searchProduct: function (query) {
        if (!this.form.supplierId) {
          this.searchProductList = [];
          return;
        }
        let params = {
          keyWord: query,
          factoryId: this.form.supplierId
        };
        http.get('purchase-agreement/valid/org-goods', {params: params}).then(res => {
          this.searchProductList = res.data.list;
          this.$nextTick(function () {
            this.filterProducts();
          });
        });
      },
      filterProducts: function () {
        let arr = [];
        let isIn;
        this.searchProductList.forEach(item => {
          isIn = false;
          this.form.detailDtoList.forEach(product => {
            if (product.orgGoodsId === item.orgGoodsDto.id) {
              if (!product.isCombination) {
                isIn = true;
                return false;
              }
            }
          });
          if (!isIn) {
            arr.push(item);
          }
        });
        this.filterProductList = arr;
      },
      getGoodDetail: function (OrgGoodsId) {// 选货品
        if (!OrgGoodsId) {
          this.product = {
            'amount': null,
            'entrustment': false,
            'measurementUnit': '',
            'orgGoodsId': '',
            'packingCount': null,
            'specificationsId': '',
            'fixInfo': {
              'goodsDto': {}
            },
            'unitPrice': null
          };
          this.$refs['orderGoodsAddForm'].resetFields();
          this.accessoryList = [];
          return;
        }
        this.searchProductList.forEach(item => {
          if (item.orgGoodsDto.id === OrgGoodsId) {
            this.product.fixInfo = item.orgGoodsDto;
            let price = item.orgGoodsDto.procurementPrice;
            this.product.unitPrice = utils.autoformatDecimalPoint(price ? price.toString() : '');
            this.product.measurementUnit = item.orgGoodsDto.goodsDto.measurementUnit;
            this.accessoryList = item.list;
            this.form.detailDtoList.forEach((detailItem) => {
              if (detailItem.orgGoodsId === OrgGoodsId) {
                detailItem.fixInfo = item.orgGoodsDto;
                return false;
              }
            });
          }
        });
        this.isCheckPackage(this.product.fixInfo.goodsDto.smallPacking);
      },
      addProduct: function () {// 货品加入到合同
        if (!this.product.orgGoodsId) {
          this.$notify.info({
            duration: 2000,
            message: '请先选择产品'
          });
          return false;
        }
        let isCheck = this.isCheckPackage(this.product.fixInfo.goodsDto.smallPacking);
        if (!isCheck) return;
        this.$refs['orderGoodsAddForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.searchProductList.forEach((item) => {
            if (this.product.orgGoodsId === item.orgGoodsDto.id) {
              this.product.orgGoodsName = item.orgGoodsDto.name;
              this.form.detailDtoList.push(JSON.parse(JSON.stringify(this.product)));
              item.list.forEach(m => {
                let amount = Math.ceil(m.proportion * this.product.amount);
                this.form.detailDtoList.push({
                  mainOrgId: item.orgGoodsDto.id,
                  isCombination: true,
                  orgGoodsId: m.accessory,
                  orgGoodsName: m.name,
                  unitPrice: m.procurementPrice ? m.procurementPrice : 0,
                  amount: amount,
                  measurementUnit: m.accessoryGoods.measurementUnit,
                  packingCount: null,
                  specificationsId: ''
                });
              });
            }
          });
          this.$nextTick(function () {
            this.product = {
              'amount': null,
              'entrustment': false,
              'measurementUnit': '',
              'orgGoodsId': '',
              'packingCount': null,
              'specificationsId': '',
              'fixInfo': {
                'goodsDto': {}
              },
              'unitPrice': null
            };
            this.$refs['orderGoodsAddForm'].resetFields();
            this.accessoryList = [];
          });
        });

      },
      remove: function (item) {
        this.form.detailDtoList.splice(this.form.detailDtoList.indexOf(item), 1);
        this.form.detailDtoList = this.form.detailDtoList.filter(dto => item.orgGoodsId !== dto.mainOrgId);
        this.searchProduct();
      },
      editItem (item) {
        this.filterProductList.push({
          orgGoodsDto: item.orgGoodsDto || item.fixInfo || {},
          list: []
        });
        this.product.orgGoodsId = item.orgGoodsId;
        this.product.unitPrice = utils.autoformatDecimalPoint(item.unitPrice ? item.unitPrice.toString() : '');
        this.product.amount = item.amount;
        this.product.fixInfo = item.orgGoodsDto || item.fixInfo;
        this.remove(item);
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
      createOrder: function () {
        this.$confirm('确认按照采购合同《' + this.form.purchaseContractName + '》的信息批量生成采购订单?', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          PurchaseContract.batchCreateOrder(this.orderId).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '批量生成采购订单成功'
            });
            this.$emit('change', this.form);
            this.$emit('right-close');
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response.data && error.response.data.msg || '批量生成采购订单失败'
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
