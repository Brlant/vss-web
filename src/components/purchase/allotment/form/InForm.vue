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
  text-align: left;
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
        <h2 class="clearfix right-title">{{ defaultIndex === 2 ? '编辑调拨入库' : '新增调拨入库'}}</h2>
        <ul>
          <li v-for="item in productListSet" class="list-style" v-bind:class="{ 'active' : index==item.key}"
              @click="setIndexValue(item.key)"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button :disabled="doing" type="success" @click="onSubmit">保存订单</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>{{currentPartName}}</h3>

        <div class="hide-content" v-bind:class="{'show-content' : index==0}">
          <el-form ref="orderAddForm" :model="form" :rules="rules" label-width="160px" onsubmit="return false"
                   style="padding-right: 20px" @submit.prevent="onSubmit">
            <el-form-item label="订单类型" prop="goodsType">
              <el-radio-group v-model.number="form.goodsType" @change="changeVaccineType">
                <el-radio v-for="item in vaccineTypeList" :key="item.key" :label="item.key">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-show="showContent.isShowOtherContent" :prop=" showContent.isShowOtherContent?'transportationMeansId':'' "
                          label="物流方式">
              <el-select v-model="form.transportationMeansId" placeholder="请选择物流方式" type="text"
                         @change="changeTransportationMeans">
                <el-option v-for="item in transportationMeansList" v-show="item.key !== '3' " :key="item.key"
                           :label="item.label" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="showContent.isShowOtherContent&&(form.transportationMeansId==='1' || form.transportationMeansId==='3')"
                          label="物流商">
              <oms-input v-model="form.logisticsProviderName" placeholder="请输入物流商"></oms-input>
            </el-form-item>
            <el-form-item v-if="showContent.isShowOtherContent&&form.transportationMeansId==='2' "
                          :prop=" showContent.isShowOtherContent&&form.transportationMeansId==='2'?'pickUpAddress':'' "
                          label="提货地址">
              <el-select v-model="form.pickUpAddress" :clearable="true" filterable placeholder="请选择提货地址">
                <el-option v-for="item in supplierWarehouses" :key="item.id" :label="filterAddressLabel(item)"
                           :value="item.id">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-show="showContent.isShowOtherContent" :prop=" showContent.isShowOtherContent?'transportationCondition':'' "
                          label="运输条件">
              <el-select v-model="form.transportationCondition" placeholder="请选择运输条件" type="text">
                <el-option v-for="item in transportationConditionList" :key="item.key" :label="item.label"
                           :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="物流中心" prop="logisticsCentreId">-->
            <!--<el-select placeholder="请选择物流中心" v-model="form.logisticsCentreId" filterable :clearable="true">-->
            <!--<el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in LogisticsCenter"/>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="仓库地址" prop="transportationAddress">
              <el-select v-model="form.transportationAddress" :clearable="true"
                         filterable placeholder="请选择仓库地址" @change="transportationAddressChange">
                <el-option v-for="item in cdcWarehouses" :key="item.id" :label="filterAddressLabel(item)"
                           :value="item.id">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="是否进口">-->
            <!--<el-switch active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949"-->
            <!--v-model="form.importedFlag"></el-switch>-->
            <!--</el-form-item>-->
            <el-form-item v-show="showContent.isShowOtherContent"
                          :label="showContent.expectedTimeLabel"
                          :prop=" showContent.isShowOtherContent?'expectedTime':'' ">
              <el-date-picker v-model="form.expectedTime" :picker-options="pickerOptions" format="yyyy-MM-dd"
                              placeholder="请选择预计入库时间" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
              <oms-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入备注信息"
                         type="textarea"></oms-input>
            </el-form-item>
            <el-form-item label-width="120px">
              <el-button type="primary" @click="index++">添加疫苗</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="hide-content" v-bind:class="{'show-content' : index==1}">

          <div class="oms-form order-product-box">
            <el-form ref="orderGoodsAddForm" :model="product" :rules="orderGoodsRules" label-width="120px">
              <el-form-item label="产品" prop="orgGoodsId">
                <el-select v-model="product.orgGoodsId" :clearable="true" :loading="loading" :remote-method="searchProduct"
                           filterable placeholder="请输入名称搜索产品" popper-class="order-good-selects"
                           remote
                           @change="getGoodDetail">
                  <el-option v-for="item in filterProductList" :key="item.orgGoodsDto.id"
                             :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                      <el-tag v-show="item.list.length" class="pull-left" style="line-height: 22px;margin-left: 20px;height: 20px"
                              type="success">
                        组合
                      </el-tag>
                      <span v-if="item.orgGoodsDto.goodsDto" class="select-other-info pull-right"><span
                        v-show="item.orgGoodsDto.goodsDto.specifications">规格:</span>{{item.orgGoodsDto.goodsDto.specifications}}
                      </span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.goodsNo">货主货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left">
                          <span>标准价格:￥</span>{{ item.orgGoodsDto.unitPrice | formatMoney}}</span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                      </span>
                      <span v-if="item.orgGoodsDto.goodsDto" class="select-other-info pull-left">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <div v-show="product.orgGoodsId">
                <el-form-item class="productItem-info" label="产品数量" prop="amount">
                  <oms-input v-model.number="product.amount" :min="0" type="number" @blur="changeNumber">
                    <template slot="append">
                      <dict :dict-group="'measurementUnit'" :dict-key="product.fixInfo.goodsDto.measurementUnit"></dict>
                    </template>
                  </oms-input>
                </el-form-item>
                <el-form-item class="productItem-info" label="单价" prop="unitPrice">
                  <oms-input v-model="product.unitPrice" :min="0" placeholder="请输入单价" type="text"
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
                      <span v-for="acce in accessoryList" :key="acce.id" style="display: block;font-size: 12px">
                       <span style="margin-right: 10px">{{acce.name}}</span>
                      <span style="margin-right: 10px">¥ {{ acce.unitPrice | formatMoney }}</span>
                       <span v-show="acce.proportion" style="margin-right: 10px">比例 {{ acce.proportion }}</span>
                       <span style="margin-right: 10px">{{ acce.salesFirmName }}</span>
                  </span>
                    </el-col>
                  </el-row>
                </div>
                <oms-form-row :span="4" label="">
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
                <th style="width: 300px">疫苗名称</th>
                <th class="ar">疫苗单价</th>
                <th class="ar">疫苗数量</th>
                <th class="ar">金额</th>
                <th>操作</th>
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
                <td class="ar">
                  <span v-show="Number(product.unitPrice)">¥{{product.unitPrice | formatMoney}}</span>
                  <span v-if="!Number(product.unitPrice)">-</span>
                </td>
                <td class="ar">{{product.amount}} <span v-show="product.measurementUnit">（<dict
                  :dict-group="'measurementUnit'"
                  :dict-key="product.measurementUnit"></dict>）</span>
                </td>
                <td v-show="Number(product.unitPrice)" class="ar">
                  <span v-show="Number(product.unitPrice)">¥{{ product.amount * product.unitPrice | formatMoney
                    }}</span>
                  <span v-if="!Number(product.unitPrice)" style="align-content: center">-</span>
                </td>
                <td v-show="!Number(product.unitPrice)" class="ar">
                  <span v-if="!Number(product.unitPrice)" style="align-content: center">-</span>
                </td>
                <td class="goods-btn">
                  <div v-show="defaultIndex === 2">
                    <a v-show="!product.isCombination" href="#" @click.prevent="editItem(product)"><i
                      class="el-icon-t-edit"></i> 编辑</a>
                  </div>
                  <div>
                    <a v-show="!product.isCombination" href="#" @click.prevent="remove(product)"><i
                      class="el-icon-t-delete"></i> 删除</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td align="right" colspan="3">
                  <total-count :list="form.detailDtoList" property="amount"></total-count>
                </td>
                <td colspan="2" style="font-weight: 600"><span
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
import {Address, BaseInfo, erpOrder, http, InWork} from '@/resources';
import utils from '@/tools/utils';
import OrderMixin from '@/mixins/orderMixin';
import addGoodsMixin from '@/mixins/addGoodsMixin';

export default {
  name: 'addForm',
  loading: false,
  mixins: [OrderMixin, addGoodsMixin],
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
        goodsType: '',
        'orgId': '',
        'customerId': '',
        'bizType': '1-3',
        'type': this.type,
        'logisticsProviderName': '',
        'transportationCondition': '',
        'transportationMeansId': '1',
        'transportationAddress': '',
        'importedFlag': '',
        'orgRelation': '',
        'logisticsCentreId': '',
        'thirdPartyNumber': '',
        'expectedTime': '',
        'detailDtoList': [],
        'supplierId': '',
        'remark': '',
        'pickUpAddress': ''
      },
      rules: {
        orderNo: [
          {required: true, message: '请输入货主订单编号', trigger: 'blur'},
          {validator: checkOrderNumber}
        ],
        thirdPartyNumber: [
          {required: true, message: '请输入来源订单编号', trigger: 'blur'},
          {validator: checkOrderNumber}
        ],
        supplierId: [
          {required: true, message: '请选择供货单位', trigger: 'change'}
        ],
        transportationMeansId: [
          {required: true, message: '请选择物流方式', trigger: 'change'}
        ],
        transportationAddress: [
          {required: true, message: '请选择仓库地址', trigger: 'change'}
        ],
        pickUpAddress: [
          {required: true, message: '请选择提货地址', trigger: 'change'}
        ],
        logisticsProviderName: [
          {required: true, message: '请选择物流商', trigger: 'change'}
        ],
        transportationCondition: [
          {required: true, message: '请选择运输条件', trigger: 'change'}
        ],
        logisticsCentreId: [
          {required: true, message: '请选择物流中心', trigger: 'change'}
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
        {name: '疫苗信息', key: 1}
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
      isStorageData: false, // 判断是不是缓存数据
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
      requestTime: '',
      editItemProduct: {},
      warehouseTypeList: this.$store.state.warehouseType
    };
  },
  computed: {
    bizTypeList: function () {
      return this.$getDict('bizInType');
    },
    transportationMeansList: function () {
      return this.$getDict('transportationMeans');
    },
    shipmentPackingUnit: function () {
      return this.$getDict('shipmentPackingUnit');
    },
    measurementUnitList: function () {
      return this.$getDict('measurementUnit');
    },
    transportationConditionList: function () {
      return this.$getDict('transportationCondition');
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
    defaultIndex(val) {
      this.isStorageData = false;
      this.index = 0;
      this.idNotify = true;
      let user = this.$store.state.user;
      this.form.orgId = user.userCompanyAddress;
      this.searchProduct();

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
        this.filterAddress();
        this.filterSupplierWarehouses();
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
    changeVaccineType() {
      this.clearForm();
    },
    clearForm() {
      this.accessoryList = [];
      this.batchNumbers = [];
      this.editItemProduct = {};
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
      this.form.detailDtoList = [];
      this.searchProductList = [];
      this.filterProductList = [];
    },
    filterAddressLabel(item) {
      let name = item.name ? '【' + item.name + '】' : '';
      return name + item.detail;
    },
    createOrderInfo() {
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
          let price = res.data.orgGoodsDto.unitPrice;
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
    editOrderInfo() {
      if (!this.orderId) return;
      InWork.queryOrderDetail(this.orderId).then(res => {
//          this.currentOrder = res.data;
        this.resetForm();
        this.isStorageData = true;
        res.data.detailDtoList.forEach(f => {
          f.orgGoodsName = f.name;
        });
        this.form = JSON.parse(JSON.stringify(res.data));
        this.filterAddress(this.isStorageData);
        this.filterSupplierWarehouses(this.isStorageData);
        // ******2.0变化
        this.changeSupplier(this.form.supplierId, true);
        this.changeTransportationMeans(this.form.transportationMeansId, true);
        // ******
        this.$nextTick(() => {
          this.isStorageData = false;
        });
      });
    },
    changeNumber() {
      if (!this.product.amount) return;
      let newAmount = this.changeTotalNumber(this.product.amount, this.product.fixInfo.goodsDto.smallPacking);
      if (this.product.amount !== newAmount) {
        this.$confirm(`疫苗"${this.product.fixInfo.name}"数量${this.product.amount}不是最小包装的倍数，确认后会对后续操作产生严重影响!
           选择“是”修改数量为${newAmount}，选择“否”确认数量${this.product.amount}`, '', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(res => {
          this.product.amount = newAmount;
          this.setAddProduct();
        }).catch(() => {
          this.setAddProduct();
        });
      } else {
        this.setAddProduct();
      }
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
        // this.form.logisticsCentreId = this.form.logisticsCentreId
        //   ? this.form.logisticsCentreId : window.localStorage.getItem('logisticsCentreId');
      }
    },
    resetForm: function () {// 重置表单
      this.$refs['orderAddForm'].resetFields();
      this.$refs['orderGoodsAddForm'].resetFields();
      this.form.supplierId = '';
      this.form.actualConsignee = '';
      this.form.logisticsProviderName = '';
      this.form.logisticsCentreId = '';
      this.form.remark = '';
      this.form.detailDtoList = [];
      this.form.pickUpAddress = '';
      this.searchProductList = [];
      this.filterProductList = [];
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
      this.$emit('close');
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
      BaseInfo.queryOrgByAllRelation(orgId, params).then(res => {
        this.orgList = res.data;
      });
    },
    filterAddress(isStorageData) {
      Address.queryAddress(this.form.orgId, {
        deleteFlag: false,
        orgId: this.form.orgId,
        auditedStatus: '1', status: 0
      }).then(res => {
        this.cdcWarehouses = res.data;
        if (isStorageData) return;
        let defaultStore = res.data.filter(item => item.default);
        this.form.transportationAddress = defaultStore.length ? defaultStore[0].id : '';
        this.transportationAddressChange(this.form.transportationAddress);
      });
    },
    filterSupplierWarehouses(isEdit) {
      Address.queryAddress(this.form.orgId, {
        deleteFlag: false,
//                warehouseType: 0,
        orgId: this.form.orgId,
        auditedStatus: '1', status: 0
      }).then(res => {
        this.supplierWarehouses = res.data;
        if (isEdit) return;
        let defaultStore = res.data.filter(item => item.default);
        this.form.pickUpAddress = defaultStore.length ? defaultStore[0].id : '';
      });
    },
    getWarehouseAdress: function (item) { // 得到仓库地址
      return item.detail + `（${this.warehouseTypeList[item.warehouseType].label}）`;
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
        if (val === '1-1') {
          this.currentTransportationMeans = this.transportationMeansList.filter(item => item.key !== '1');
        } else {
          this.currentTransportationMeans = this.transportationMeansList.filter(item => item.key !== '3');
        }
      }
      switch (val) {
        case '1-0' : {
          this.showContent = {
            isShowOtherContent: true, // 是否显示物流类型
            isShowSupplierId: true, // 是否显示来源单位
            expectedTimeLabel: '预计入库时间'
          };
          this.filterOrg();
          break;
        }
        case '1-1' : {
          this.showContent = {
            isShowOtherContent: true, // 是否显示物流类型
            isShowSupplierId: true, // 是否显示来源单位
            expectedTimeLabel: '拟退货时间'
          };
          this.filterOrg();
          break;
        }
        case '1-2' : {
          this.showContent = {
            isShowOtherContent: false, // 是否显示物流类型
            isShowSupplierId: false, // 是否显示来源单位
            expectedTimeLabel: ''
          };
          break;
        }
        case '1-3' : {
          this.showContent = {
            isShowOtherContent: true, // 是否显示物流类型
            isShowSupplierId: false, // 是否显示来源单位
            expectedTimeLabel: '预计入库时间'
          };
          break;
        }
      }

    },
    changeSupplier: function (val, isEdit) {// 业务单位改变
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
//                warehouseType: 0,
          orgId: val,
          auditedStatus: '1', status: 0
        }).then(res => {
          this.supplierWarehouses = res.data;
          if (isEdit) return;
          let defaultStore = res.data.filter(item => item.default);
          this.form.pickUpAddress = defaultStore.length ? defaultStore[0].id : '';
        });
      }
      this.searchProduct();
      this.checkLicence(val);
    },
    changeTransportationMeans: function (isEdit) {// 物流方式改变
      if (isEdit) return;
      if (!this.isStorageData) {// 当有缓存时，不做清空操作
        this.form.pickUpAddress = '';
        this.form.supplierId = '';
      }
      this.form.pickUpAddress = '';
      if (this.form.transportationMeansId === '2') {
        this.form.pickUpAddress = this.form.transportationAddress;
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
          message: msg + '证照信息已过期,无法创建订单',
          type: 'error'
        });
      });
    },
    searchProduct: function (query) {
      if (typeof this.form.goodsType !== 'number') return;
      let params = {
        keyWord: query
      };
      let rTime = Date.now();
      this.requestTime = rTime;
      // 无论市、区疾控, 调拨入库, 查询疫苗产品资料
      let url = 'vaccine-info';
      params.deleteFlag = false;
      params.status = true;
      params.goodsVaccineSign = this.form.goodsType + 1;
      http.get(url, {params: params}).then(res => {
        if (this.requestTime > rTime) {
          return;
        }
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
    getGoodDetail: function (OrgGoodsId) {// 选疫苗
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
        this.editItemProduct = {};
        return;
      }
      this.searchProductList.forEach(item => {
        if (item.orgGoodsDto.id === OrgGoodsId) {
          this.product.fixInfo = item.orgGoodsDto;
          let price = item.orgGoodsDto.unitPrice;
          this.product.unitPrice = utils.autoformatDecimalPoint(price ? price.toString() : '');
          this.product.measurementUnit = item.orgGoodsDto.goodsDto.measurementUnit;
          this.accessoryList = item.list;
          this.form.detailDtoList.forEach((detailItem) => {
            if (detailItem.orgGoodsId === OrgGoodsId) {
              detailItem.fixInfo = item.orgGoodsDto;
              return false;
            }
          });
          // 近效期提醒
          // this.checkGoodsRegistrationValid(item.orgGoodsDto.goodsDto.goodsApprovalNOValidity);
        }
      });
      this.isCheckPackage(this.product.fixInfo.goodsDto.smallPacking);
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
      this.$refs['orderGoodsAddForm'].validate((valid) => {
        if (!valid) {
          return false;
        }
        let isHasInSearchProductList = false;
        this.searchProductList.forEach((item) => {
          if (this.product.orgGoodsId === item.orgGoodsDto.id) {
            isHasInSearchProductList = true;
            this.product.orgGoodsName = item.orgGoodsDto.name;
            this.product.measurementUnit = item.orgGoodsDto.goodsDto.measurementUnit;
            this.form.detailDtoList.push(JSON.parse(JSON.stringify(this.product)));
            item.list.forEach(m => {
              let amount = Math.ceil(m.proportion * this.product.amount);
              this.form.detailDtoList.push({
                mainOrgId: item.orgGoodsDto.id,
                isCombination: true,
                orgGoodsId: m.accessory,
                orgGoodsName: m.name,
                unitPrice: m.unitPrice ? m.unitPrice : 0,
                amount: amount,
                measurementUnit: m.accessoryGoods.measurementUnit,
                packingCount: null,
                specificationsId: ''
              });
            });
          }
        });
        !isHasInSearchProductList && this.handleRepetitiveOrgGoods(true);
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
          this.editItemProduct = {};
          this.searchProduct();
        });
      });

    },
    remove: function (item) {
      this.deleteItem(item);
      this.searchProduct();
    },
    deleteItem(item) {
      this.form.detailDtoList.splice(this.form.detailDtoList.indexOf(item), 1);
      this.form.detailDtoList = this.form.detailDtoList.filter(dto => item.orgGoodsId !== dto.mainOrgId);
    },
    editItem(item) {
//        this.filterProductList = [];
//        this.searchProductList = [];
//        this.searchProductList.push({
//          orgGoodsDto: item.orgGoodsDto || item.fixInfo,
//          list: []
//        });
      this.filterProductList.push({
        orgGoodsDto: item.orgGoodsDto || item.fixInfo || {},
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
    },
    onSubmit: function () {// 提交表单
      if (!this.checkHasOrderNotAdded(this.product)) return;
      let self = this;
      // this.changeExpectedTime(this.form.expectedTime);
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
          delete item.orgGoodsDto;
        });
        saveData.detailDtoList = this.mergeSameOrgGoodsWhenIn(saveData.detailDtoList);
        // 来源单位 设置成自己
        saveData.supplierId = saveData.orgId;
        this.doing = true;
        if (saveData.id) {
          erpOrder.updateOrder(saveData.id, saveData).then(res => {
            this.$notify({
              duration: 2000,
              message: '编辑调拨入库成功',
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
              title: '编辑调拨入库失败',
              message: error.response && error.response.data && error.response.data.msg || '网络异常',
              type: 'error'
            });
          });
        } else {
          erpOrder.save(saveData).then(res => {
            this.$notify({
              duration: 2000,
              message: '新增调拨入库成功',
              type: 'success'
            });
            self.$emit('change', res.data);
            window.localStorage.removeItem(this.saveKey);
            this.doing = false;
            this.$emit('close');
            this.resetForm();
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '新增调拨入库失败',
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
