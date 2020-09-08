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

  /*border: 1px solid #ccc;*/

  border-radius: 10px;
  font-size: 12px;
  line-height: 26px;

  .product-info-fix {
    background: #f6f6f6;
    margin-top: 10px;
    padding: 5px;
    margin-bottom: 10px;
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
        <h2 class="clearfix right-title" style="padding: 0">{{ getTitle() }}</h2>
        <ul>
          <li class="list-style" v-for="item in productListSet" @click="setIndexValue(item.key)"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit" :disabled="doing">保存订单</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>{{ currentPartName }}</h3>
        <el-form ref="orderAddForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                 label-width="160px" style="padding-right: 20px">
          <div class="hide-content" v-bind:class="{'show-content' : index==0}">
            <el-form-item label="货品类型" prop="goodsType">
              <el-radio-group v-model.number="form.goodsType" @change="changeVaccineType">
                <el-radio :label="item.key" :key="item.key" v-for="item in vaccineTypeList">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="仓库地址" prop="orgAddress">
              <el-select placeholder="请选择仓库地址" v-model="form.orgAddress" filterable :clearable="true"
                         @change="transportationAddressChange">
                <el-option :label="filterAddressLabel(item)" :value="item.id" :key="item.id"
                           v-for="item in LogisticsCenterAddressList">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流商" prop="logisticsProviderName">
              <oms-input v-model="form.logisticsProviderName" placeholder="请输入物流商"></oms-input>
            </el-form-item>
            <el-form-item label="报损方式" prop="customerChannel">
              <el-select type="text" placeholder="请选择报损方式" v-model="form.customerChannel"
                         @change="customerChannelChange">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in breakageType"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="去向单位" prop="customerId" v-if="!isSelfBreakage">
              <el-select placeholder="请选择去向单位" v-model="form.customerId" clearable @change="customerIdChange">
                <el-option :label="item.orgName" :value="item.orgId" :key="item.orgId" v-for="item in customerList">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运输方式" v-if="isEntrustWarehouse" prop="transportationMeansId">
              <el-select type="text" placeholder="请选择运输方式" v-model="form.transportationMeansId"
                         @change="transportationMeansIdChange">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in transportationMeansList" v-show="item.key <= 1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="收货地址" prop="transportationAddress" v-if="form.transportationMeansId === '0'"
                          v-show="showContent.isShowOtherContent" :clearable="true">
              <el-select placeholder="请选择收货地址" v-model="form.transportationAddress" filterable clearable>
                <el-option :label="filterAddressLabel(item)" :value="item.id" :key="item.id" v-for="item in warehouses">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运输条件" prop="transportationCondition" v-if="form.transportationMeansId === '0'">
              <el-select type="text" placeholder="请选择运输条件" v-model="form.transportationCondition">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in transportationConditionList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否合格" prop="qualifiedFlag">
              <el-switch active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949"
                         v-model="form.qualifiedFlag" @change="qualifiedFlagChange"></el-switch>
            </el-form-item>
            <el-form-item label="预计送货时间" prop="expectedTime" v-if="form.transportationMeansId === '0'">
              <el-date-picker v-model="form.expectedTime" placeholder="请选择预计送货时间"
                              format="yyyy-MM-dd" :picker-options="pickerOptions" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="报损原因" prop="remark" v-if="isSelfBreakage">
              <oms-input type="textarea" v-model="form.remark" placeholder="请输入备注信息"
                         :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
            </el-form-item>
            <el-form-item label="报损原因" prop="remark" v-if="!isSelfBreakage">
              <el-select type="text" placeholder="请选择报损原因" v-model="form.remark">
                <el-option :value="item.label" :key="item.key" :label="item.label"
                           v-for="item in breakageReason"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="160px">
              <el-button type="primary" @click="index++">添加疫苗</el-button>
            </el-form-item>
          </div>
          <div class="hide-content" v-bind:class="{'show-content' : index==1}">

            <div class="oms-form order-product-box">
              <el-form ref="orderGoodsAddForm" :rules="orderGoodsRules" :model="product" label-width="120px">
                <el-form-item label="产品" prop="orgGoodsId">
                  <el-select v-model="product.orgGoodsId" filterable remote placeholder="请输入名称搜索产品"
                             :remote-method="searchProduct" :clearable="true" :loading="loading"
                             popper-class="order-good-selects"
                             @change="getGoodDetail">
                    <el-option v-for="item in filterProductList" :key="item.orgGoodsDto.id"
                               :label="item.orgGoodsDto.name"
                               :value="item.orgGoodsDto.id">
                      <div style="overflow: hidden">
                        <span class="pull-left">{{ item.orgGoodsDto.name }}</span>
                        <el-tag class="pull-left" type="success" v-show="item.list.length"
                                style="line-height: 22px;margin-left: 20px;height: 20px">
                          组合
                        </el-tag>
                        <span class="select-other-info pull-right" v-if="item.orgGoodsDto.goodsDto"><span
                          v-show="item.orgGoodsDto.goodsDto.specifications">规格:</span>{{
                            item.orgGoodsDto.goodsDto.specifications
                          }}
                        </span>
                      </div>
                      <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">货主货品编号:</span>{{ item.orgGoodsDto.goodsNo }}
                        </span>
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.procurementPrice">采购价格 ￥{{
                            item.orgGoodsDto.procurementPrice
                          }}</span>
                        </span>
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                        <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{
                            item.orgGoodsDto.goodsDto.factoryName
                          }}
                        </span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
                <div v-show="product.orgGoodsId">
                  <el-form-item label="单价" class="productItem-info" prop="unitPrice">
                    <oms-input type="text" placeholder="请输入单价" v-model="product.unitPrice" :min="0"
                               @blur="formatPrice">
                      <template slot="prepend">¥</template>
                    </oms-input>
                  </el-form-item>
                  <div class="product-info-fix clearfix">
                    <el-row>
                      <el-col :span="14">
                        <goods-info-part :product-info="product"></goods-info-part>
                      </el-col>
                      <el-col :span="10">
                        <span v-show="accessoryList.length">【组合疫苗】</span>
                        <span style="display: block;font-size: 12px" v-for="acce in accessoryList">
                       <span style="margin-right: 10px">{{ acce.name }}</span>
                       <span style="margin-right: 10px"
                             v-show="acce.procurementPrice">采购价格:¥{{ acce.procurementPrice | formatMoney }}</span>
                       <span style="margin-right: 10px" v-show="acce.proportion">比例:{{ acce.proportion }}</span>
                       <span style="margin-right: 10px">{{ acce.salesFirmName }}</span>
                    </span>
                      </el-col>
                    </el-row>
                  </div>
                  <batch-number-part ref="batchNumberPart" :form="form" :product="product"
                                     :productList="filterProductList"
                                     :editItemProduct="editItemProduct"
                                     :formCopy="formCopy" @addProduct="setAddProduct"
                                     @setIsHasBatchNumberInfo="setIsHasBatchNumberInfo"></batch-number-part>

                  <oms-form-row label-width="160px" :span="4" :label="''">
                    <el-button type="primary" @click="addProduct" @mousedown.native="mousedownAdd">加入订单</el-button>
                  </oms-form-row>
                </div>
              </el-form>

            </div>

            <div class="product-list-detail">
              <h3 style="background: #13ce66;color: #fff">已选疫苗</h3>
              <table class="table">
                <thead>
                <tr>
                  <th style="width: 200px">疫苗名称</th>
                  <th>规格</th>
                  <th>批号</th>
                  <th>有效期</th>
                  <th>单价</th>
                  <th style="width: 70px">疫苗数量</th>
                  <th>金额</th>
                  <th style="width: 60px">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in form.detailDtoList" :class="{'combinatioon-product':product.isCombination}">
                  <td>
                    <el-tag type="success" v-show="product.isCombination" style="font-size: 10px"
                            :class="{ml15:product.isCombination}">组合
                    </el-tag>
                    <span>{{ product.orgGoodsName }}</span>
                  </td>
                  <td>
                    <span v-if="product.orgGoodsDto">{{ product.orgGoodsDto.goodsDto.specifications }}</span>
                    <span v-else-if="product.fixInfo">{{ product.fixInfo.goodsDto.specifications }}</span>
                    <span v-else="">{{ product.specifications }}</span>
                  </td>
                  <td>
                    {{ product.batchNumber ? product.batchNumber : '无' }}
                    <!--<el-tag v-show="product.inEffectiveFlag" type="warning">近效期</el-tag>-->
                    <goods-status-tag :item="product" :form="form"/>

                  </td>
                  <td>
                    {{ product.expirationDate | date }}
                  </td>
                  <td class="ar">
                   <span v-show="Number(product.unitPrice)">
                     <span>¥</span>{{ product.unitPrice | formatMoney }}
                     <span v-if="!Number(product.unitPrice)">-</span>
                   </span>
                    <span v-if="!Number(product.unitPrice)">-</span>
                  </td>
                  <td class="ar">{{ product.amount }} <span v-show="product.measurementUnit">（<dict
                    :dict-group="'measurementUnit'"
                    :dict-key="product.measurementUnit"></dict>）</span>
                  </td>
                  <td class="ar">
                    <span v-show="Number(product.unitPrice)">¥{{
                        product.amount * product.unitPrice | formatMoney
                      }}</span>
                    <span v-if="!Number(product.unitPrice)">-</span>
                  </td>
                  <td class="goods-btn">
                    <div v-show="defaultIndex === 2 && !product.isCombination">
                      <a href="#" @click.prevent="editItem(product)"><i
                        class="el-icon-t-edit"></i> 编辑</a>
                    </div>
                    <div>
                      <a href="#" @click.prevent="remove(product)"><i
                        class="el-icon-t-delete"></i> 删除</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="5" align="right">
                    <total-count property="amount" :list="form.detailDtoList"></total-count>
                  </td>
                  <td colspan="2" style="font-weight: 600">
                    <span v-show="form.detailDtoList.length && totalMoney">合计:</span><span
                    v-show="form.detailDtoList.length && totalMoney">¥{{ totalMoney | formatMoney }}</span></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {Address, cerpAction, erpOrder, http, InWork} from '@/resources';
import utils from '@/tools/utils';
import materialPart from '../material.vue';
import batchNumberPart from './batchNumber';
import OrderMixin from '@/mixins/orderMixin';
import addGoodsMixin from '@/mixins/addGoodsMixin';

export default {
  name: 'addForm',
  loading: false,
  components: {materialPart, batchNumberPart},
  mixins: [OrderMixin, addGoodsMixin],
  props: {
    type: {
      type: String,
      default: '1'
    },
    action: {
      type: String,
      default: ''
    },
    defaultIndex: {
      type: Number,
      default: 0
    },
    orderId: String,
    vaccineType: String
  },

  data: function () {
    let checkOrderNumber = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else {
        let re = /^[^\u4e00-\u9fa5]{0,}$/;
        if (!re.test(value)) {
          callback(new Error('请输入正确的订单号'));
        } else {
          callback();
        }
      }
    };
    return {
      loading: false,
      product: {
        'amount': null,
        'entrustment': false,
        'measurementUnit': '',
        'orgGoodsId': '',
        'packingCount': null,
        'specificationsId': '',
        unitPrice: null,
        'fixInfo': {
          'goodsDto': {}
        }
      },
      accessoryList: [], // 组合疫苗列表
      searchProductList: [],
      filterProductList: [],
      form: {
        goodsType: '',
        'orgId': '',
        'customerId': '',
        'bizType': '2-4',
        'type': this.type,
        'logisticsProviderName': '',
        'customerChannel': '0',
        transportationMeansId: '',
        transportationAddress: '',
        logisticsCentreId: '',
        transportationCondition: '',
        importedFlag: false,
        orgRelation: '',
        orgAddress: '',
        qualifiedFlag: true,
        sameBatchNumber: false,
        actualConsignee: '',
        'consigneePhone': '',
        'thirdPartyNumber': '',
        'expectedTime': '',
        'detailDtoList': [],
        'remark': ''
      },
      rules: {
        goodsType: [
          {required: true, message: '请选择货品类型', trigger: 'change'},
        ],
        orderNo: [
          {required: true, message: '请输入货主订单编号', trigger: 'blur'},
          {validator: checkOrderNumber}
        ],
        thirdPartyNumber: [
          {required: true, message: '请输入去向订单编号', trigger: 'blur'},
          {validator: checkOrderNumber}
        ],
        orgId: [
          {required: true, message: '请选择货主', trigger: 'change'}
        ],
        customerId: [
          {required: true, message: '请选择去向单位', trigger: 'change'}
        ],
        bizType: [
          {required: true, message: '请选择业务类型', trigger: 'change'}
        ],
        transportationMeansId: [
          {required: true, message: '请选择运输方式', trigger: 'change'}
        ],
        transportationAddress: [
          {required: true, message: '请选择收货地址', trigger: 'change'}
        ],
        logisticsProviderName: [
          {required: true, message: '请选择物流商', trigger: 'change'}
        ],
        orgAddress: [
          {required: true, message: '请选择发货地址', trigger: 'change'}
        ],
        logisticsCentreId: [
          {required: true, message: '请选择物流中心', trigger: 'change'}
        ],
        transportationCondition: [
          {required: true, message: '请选择运输条件', trigger: 'change'}
        ],
        customerChannel: [
          {required: true, message: '请选择报损方式', trigger: 'change'}
        ],
        expectedTime: [
          {required: true, message: '请选择预计报送时间', trigger: 'change'}
        ],
        remark: [
          {required: true, message: '请输入报损原因', trigger: ['change', 'blur']}
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
        {name: '疫苗信息', key: 1}
      ],
      orgList: [],
      customerList: [],
      logisticsList: [],
      goodsList: {},
      relationList: [],
      LogisticsCenterAddressList: [],
      LogisticsCenter: [],
      doing: false,
      isSupplierOrOrg: false,
      saveKey: 'outOrderForm',
      showContent: {
        isShowOtherContent: true, // 是否显示物流类型
        isShowCustomerId: true, // 是否显示POV
        expectedTimeLabel: '预计出库时间'
      },
      warehouses: [], // 收货单位收货地址列表
      batchNumbers: [], // 疫苗批号列表
      selectBatchNumbers: [], // 已经选择的疫苗批号
      changeTotalNumber: utils.changeTotalNumber,
      isCheckPackage: utils.isCheckPackage,
      requestTime: '',
      editItemProduct: {},
      isHasBatchNumberInfo: false,
      formCopy: {},
      warehouseTypeList: this.$store.state.warehouseType
    };
  },
  computed: {
    bizTypeList() {
      return this.$getDict('bizOutType');
    },
    transportationMeansList() {
      return this.$getDict('outTransportMeans');
    },
    transportationConditionList() {
      return this.$getDict('transportationCondition');
    },
    shipmentPackingUnit() {
      return this.$getDict('shipmentPackingUnit');
    },
    measurementUnitList() {
      return this.$getDict('measurementUnit');
    },
    orgRelationList() {
      return this.$getDict('orgRelation');
    },
    totalMoney: function () {
      let totalMoney = 0.00;
      if (!this.form.detailDtoList.length) return totalMoney;
      this.form.detailDtoList.forEach(item => {
        totalMoney += item.amount * item.unitPrice;
      });
      return totalMoney;
    },
    breakageOrgType() { // 单位类型 0疾控 1pov
      return this.$store.state.breakageOrgType;
    },
    breakageReason() { // 报损原因
      return this.$getDict('breakageReason');
    },
    breakageType() { // 报损方式
      return this.$getDict('breakageType');
    },
    isSelfBreakage() { // pov自行报损
      return this.form.customerChannel !== '1';
    },
    isEntrustWarehouse() {
      let status = false;
      this.LogisticsCenterAddressList.forEach(i => {
        if (i.id === this.form.orgAddress) {
          status = i.warehouseType;
        }
      });
      return status === '0';
    }
  },
  watch: {
    index: function () {
      this.productListSet.forEach((item) => {
        if (item.key === this.index) {
          this.currentPartName = item.name;
        }
      });
    },
    defaultIndex(val) {
      if (!val) return;
      // 清空表单
      this.resetForm();
      this.form.state = '';
      this.form.id = null;
      this.formCopy = {};
      this.index = 0;
      let user = this.$store.state.user;
      this.form.orgId = user.userCompanyAddress;
      this.checkLicence(this.form.orgId);
      if (val === 2) {
        this.editOrderInfo();
      } else {
        this.filterAddress();
      }
      this.searchProduct();
    },
    "form.goodsType"() {
      // 货品类型变更清空货品下拉列表
      this.searchProductList = [];
      this.filterProductList = [];
    }
  },

  mounted: function () {
    this.currentPartName = this.productListSet[0].name;
  },
  methods: {
    changeVaccineType(val) {
      this.resetProductForm();
      this.form.detailDtoList = [];
    },
    filterAddressLabel(item) {
      let name = item.name ? '【' + item.name + '】' : '';
      return name + item.detail + `（${this.warehouseTypeList[item.warehouseType].label}）`;
    },
    getWarehouseAdress: function (item) { // 得到仓库地址
      return item.detail + `（${this.warehouseTypeList[item.warehouseType].label}）`;
    },
    getTitle() {
      return `${this.defaultIndex === 2 ? '编辑' : '添加'}报损`;
    },
    resetForm: function () {// 重置表单
      this.$refs['orderAddForm'].resetFields();
      this.$refs['orderGoodsAddForm'].resetFields();
      this.form.actualConsignee = '';
      this.form.consigneePhone = '';
      this.form.logisticsProviderName = '';
      this.form.remark = '';
      this.form.detailDtoList = [];
      this.form.customerId = '';
      this.form.transportationMeansId = '';
      this.form.transportationAddress = '';
      this.form.transportationCondition = '';
      this.form.orgAddress = '';
      this.searchProductList = [];
      this.filterProductList = [];
      this.resetProductForm();
    },
    editOrderInfo() {
      if (!this.orderId) return;
      // 查询供货单位
      this.queryOnCDCs();
      InWork.queryOrderDetail(this.orderId).then(res => {
        res.data.detailDtoList.forEach(f => {
          f.orgGoodsName = f.name;
          f.no = f.batchNumber;
        });
        this.form = res.data;
        this.formCopy = JSON.parse(JSON.stringify(res.data));

        this.filterAddress(true);
        this.searchWarehouses();
      });
    },
    formatPrice() {// 格式化单价，保留两位小数
      this.product.unitPrice = utils.autoformatDecimalPoint(this.product.unitPrice);
    },
    setIndexValue: function (value) {// 左侧显示页切换
      this.index = value;
    },
    qualifiedFlagChange() { // 改变是否合格
      this.resetProductForm();
      this.form.detailDtoList = [];
    },
    customerChannelChange() { // 改变报损方式
      this.form.customerId = '';
      this.form.remark = '';
      this.warehouses = [];
      this.form.transportationAddress = '';
      this.queryOnCDCs();
      this.searchWarehouses();
    },
    transportationMeansIdChange(val) { // 改变运输方式
      this.warehouses = [];
      this.form.transportationAddress = '';
      this.form.transportationCondition = '';
      if (val !== '0') return;
      this.searchWarehouses();
    },
    customerIdChange() { // 改变去向单位
      this.warehouses = [];
      this.form.transportationAddress = '';
      this.searchWarehouses();
    },
    searchWarehouses() { // 查询收货地址
      let orgId = this.isSelfBreakage ? this.$store.state.user.userCompanyAddress : this.form.customerId;
      if (!orgId) return;
      Address.queryAddress(orgId, {
        deleteFlag: false, orgId: orgId, auditedStatus: '1', status: 0
      }).then(res => {
        this.warehouses = res.data || [];
      });
    },
    filterAddress(isStorageData) {
      Address.queryAddress(this.form.orgId, {
        deleteFlag: false,
        orgId: this.form.orgId,
        auditedStatus: '1',
        status: 0
      }).then(res => {
        this.LogisticsCenterAddressList = res.data;
        if (isStorageData) return;
        let defaultStore = res.data.filter(item => item.default);
        this.form.orgAddress = defaultStore.length ? defaultStore[0].id : '';
        this.transportationAddressChange(this.form.orgAddress);
      });
    },
    queryOnCDCs() { // 查询去向单位
      cerpAction.queryOnCDCs().then(res => {
        this.customerList = res.data;
      });
    },
    checkLicence: function (val) {// 检查货主/单位证照是否过期
      if (!val) return;
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
          message: msg + '证照信息已过期,无法创建订单',
          type: 'error'
        });
      });
    },
    searchProduct: function (query) {
      if (!this.form.orgId || typeof this.form.goodsType !== 'number') {
        this.searchProductList = [];
        this.filterProductList = [];
        return;
      }
      let params = {
        keyWord: query,
        vaccineType: this.form.goodsType + 1,
      };
      let rTime = Date.now();
      this.requestTime = rTime;
      http.get('/erp-stock/org-goods', {params: params}).then(res => {
        if (this.requestTime > rTime) {
          return;
        }
        this.searchProductList = res.data.list;
        this.$nextTick(function () {
          this.filterProducts();
        });
      });
    },
    setIsHasBatchNumberInfo(val) {
      this.isHasBatchNumberInfo = val;
    },
    getGoodDetail: function (OrgGoodsId) {// 选疫苗
      this.accessoryList = [];
      this.editItemProduct = {};
      if (!OrgGoodsId) {
        this.resetProductForm();
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
    addProduct: function () {// 疫苗加入到订单
      // 重置添加按钮点击状态
      this.resetIsClickForm();
      if (!this.product.orgGoodsId) {
        this.$notify.info({
          duration: 2000,
          message: '请先选择产品'
        });
        return false;
      }
      let isCheck = this.isCheckPackage(this.product.fixInfo.goodsDto.smallPacking);
      if (!isCheck) return;
      // 取得子组件的批号信息
      this.batchNumbers = this.$refs['batchNumberPart'].batchNumbers || [];
      let isPass = this.$refs['batchNumberPart'].checkPass();
      if (!isPass) return;
      this.$refs['orderGoodsAddForm'].validate((valid) => {
        if (!valid) {
          return false;
        }
        let isHasInSearchProductList = false;
        this.searchProductList.forEach((item) => {
          if (this.product.orgGoodsId === item.orgGoodsDto.id) {
            isHasInSearchProductList = true;
            this.product.orgGoodsName = item.orgGoodsDto.name;
            let totalAmount = 0;
            // 判断时候需要批号信息
            if (!this.isHasBatchNumberInfo) {
              this.batchNumbers.forEach(b => {
                if (b.orgGoodsId === this.product.orgGoodsId) {
                  b.lots.forEach(bl => {
                    if (bl.isChecked) {
                      let product = JSON.parse(JSON.stringify(this.product));
                      product.batchNumberId = bl.id;
                      product.batchNumber = bl.no;
                      product.expirationDate = bl.expirationDate;
                      product.amount = bl.productCount;
                      product.measurementUnit = item.orgGoodsDto.goodsDto.measurementUnit;
                      this.form.detailDtoList.push(product);
                      totalAmount += bl.productCount;
                    }
                  });
                }
              });
              item.list.forEach(m => {
                this.batchNumbers.forEach(b => {
                  if (b.orgGoodsId !== m.accessory) return;
                  if (b.lots.length) {
                    b.lots.forEach(bl => {
                      if (!bl.isChecked) return;
                      this.form.detailDtoList.push({
                        batchNumber: bl.no,
                        expirationDate: bl.expirationDate,
                        batchNumberId: bl.id,
                        mainOrgId: item.orgGoodsDto.id,
                        isCombination: true,
                        orgGoodsId: m.accessory,
                        orgGoodsName: m.name,
                        unitPrice: m.procurementPrice ? m.procurementPrice : 0,
                        amount: bl.productCount,
                        measurementUnit: m.accessoryGoods.measurementUnit,
                        packingCount: null,
                        specificationsId: '',
                        specifications: m.accessoryGoods.specifications,
                        proportion: m.proportion
                      });
                    });
                  } else {
                    let amount = Math.ceil(m.proportion * totalAmount);
                    this.form.detailDtoList.push({
                      batchNumber: '',
                      batchNumberId: '',
                      mainOrgId: item.orgGoodsDto.id,
                      isCombination: true,
                      orgGoodsId: m.accessory,
                      orgGoodsName: m.name,
                      unitPrice: m.procurementPrice ? m.procurementPrice : 0,
                      amount: amount,
                      measurementUnit: m.accessoryGoods.measurementUnit,
                      packingCount: null,
                      specificationsId: '',
                      specifications: m.accessoryGoods.specifications,
                      proportion: m.proportion,
                      expirationDate: m.expirationDate
                    });
                  }
                });
              });
            } else {
              this.form.detailDtoList.push(JSON.parse(JSON.stringify(this.product)));
              item.list.forEach(m => {
                this.form.detailDtoList.push({
                  batchNumber: '',
                  batchNumberId: '',
                  mainOrgId: item.orgGoodsDto.id,
                  isCombination: true,
                  orgGoodsId: m.accessory,
                  orgGoodsName: m.name,
                  unitPrice: m.sellPrice ? m.sellPrice : 0,
                  amount: this.product.amount,
                  measurementUnit: m.accessoryGoods.measurementUnit,
                  packingCount: null,
                  specificationsId: '',
                  specifications: m.accessoryGoods.specifications,
                  proportion: m.proportion,
                  expirationDate: m.expirationDate
                });
              });
            }
          }
        });
        !isHasInSearchProductList && this.handleRepetitiveOrgGoods(this.isHasBatchNumberInfo);
        this.resetProductForm();
        this.searchProduct();
      });
    },
    resetProductForm() {
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
      this.batchNumbers = [];
      this.editItemProduct = {};
    },
    remove: function (item) { // 删除疫苗
      this.deleteItem(item);
      this.searchProduct();
    },
    editItem(item) {
      debugger;
      this.product.orgGoodsId = '';
      this.$nextTick(() => {
        this.filterProductList.push({
          orgGoodsDto: item.orgGoodsDto || item.fixInfo,
          list: []
        });
        this.product.orgGoodsId = item.orgGoodsId;
        this.product.unitPrice = utils.autoformatDecimalPoint(item.unitPrice ? item.unitPrice.toString() : '');
        this.product.amount = item.amount;
        this.product.fixInfo = item.orgGoodsDto || item.fixInfo;
        this.editItemProduct = JSON.parse(JSON.stringify(item));
        // 2.0变化
        this.deleteItem(item);
        this.searchProduct(item.orgGoodsName);
      });
    },
    deleteItem(item) {
      let orgGoodsId = item.orgGoodsId;
      this.form.detailDtoList.splice(this.form.detailDtoList.indexOf(item), 1); // mainOrgId
      let isDeleteAll = this.form.detailDtoList.some(s => s.orgGoodsId === orgGoodsId);
      if (isDeleteAll) {
        // 找出剩下的疫苗，重新计算组合疫苗数量，金额。
        let amount = 0;
        this.form.detailDtoList.forEach(f => {
          if (f.orgGoodsId === orgGoodsId) {
            amount += f.amount;
          }
        });
        this.form.detailDtoList.forEach(f1 => {
          if (f1.mainOrgId === orgGoodsId) {
            f1.amount = Math.ceil(f1.proportion * amount);
          }
        });
      } else {
        this.form.detailDtoList = this.form.detailDtoList.filter(dto => item.orgGoodsId !== dto.mainOrgId);
      }
    },
    onSubmit: function () {// 提交表单
      if (!this.checkHasOrderNotAdded(this.product)) return;
      let self = this;
      this.$refs['orderAddForm'].validate((valid) => {
        if (!valid || this.doing) {
          this.index = 0;
          return false;
        }
        let saveData = JSON.parse(JSON.stringify(self.form));
        if (saveData.detailDtoList.length === 0) {
          this.$notify({
            duration: 2000,
            message: '请添加订单产品',
            type: 'warning'
          });
          return false;
        }
        saveData.detailDtoList.forEach(item => {
          !item.combinationFlag && (item.combinationFlag = item.isCombination);
          delete item.fixInfo;
          delete item.mainOrgId;
          delete item.isCombination;
          delete item.proportion;
          delete item.orgGoodsDto;
        });
        saveData.detailDtoList = this.mergeSameOrgGoodsIdAndBatchNumberWhenOut(saveData.detailDtoList);
        let orgId = this.$store.state.user.userCompanyAddress;

        // 没有去向单位id, 默认设置自己
        if (!saveData.customerId) {
          saveData.customerId = this.$store.state.user.userCompanyAddress;
        }
        this.doing = true;
        if (saveData.id) {
          erpOrder.updateOrder(saveData.id, saveData).then(res => {
            this.$notify({
              duration: 2000,
              message: '编辑报损成功',
              type: 'success'
            });
            self.$emit('change');
            this.doing = false;
            this.$emit('close');
            this.resetForm();
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '编辑报损失败',
              message: error.response && error.response.data && error.response.data.msg || '网络异常',
              type: 'error'
            });
          });
        } else {
          erpOrder.save(saveData).then(res => {
            this.$notify({
              duration: 2000,
              message: '新增报损成功',
              type: 'success'
            });
            window.localStorage.removeItem(this.saveKey);
            self.$emit('change', res.data);
            this.doing = false;
            this.$emit('close');
            this.resetForm();
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '新增报损失败',
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
