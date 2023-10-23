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

.el-select-dropdown__item {
  height: auto;
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
        <h2 class="clearfix right-title" style="padding: 0">{{ defaultIndex === 2 ? '编辑退货申请' : '新增退货申请' }}</h2>
        <ul>
          <li v-for="item in productListSet" class="list-style" v-bind:class="{ 'active' : index==item.key}"
              @click="setIndexValue(item.key)"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button :disabled="doing" type="success" @click="onSubmit">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>{{ currentPartName }}</h3>
        <el-form ref="orderAddForm" :model="form" :rules="rules" label-width="160px" onsubmit="return false"
                 style="padding-right: 20px" @submit.prevent="onSubmit">
          <div class="hide-content" v-bind:class="{'show-content' : index==0}">
            <el-form-item label="订单类型" prop="goodsType">
              <el-radio-group v-model.number="form.goodsType" @change="changeVaccineType">
                <el-radio v-for="item in vaccineTypeList" :key="item.key" :label="item.key">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="供货单位" prop="cdcId">
              <el-select v-model="form.cdcId" :clearable="true" filterable
                         placeholder="请输入名称搜索供货单位" popper-class="good-selects" @change="changeCustomerId">
                <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{ org.name }}</span>
                  </div>
                  <div style="overflow: hidden">
                  <span v-show="org.manufacturerCode" class="select-other-info pull-left">
                    <span>系统代码:</span>{{ org.manufacturerCode }}
                  </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流方式" prop="transportationMeansId">
              <el-select v-model="form.transportationMeansId" placeholder="请选择物流方式" type="text">
                <el-option v-for="item in transportationMeansList" :key="item.key" :label="item.label"
                           :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运输条件" prop="transportationConditionId">
              <el-select v-model="form.transportationConditionId" placeholder="请选择运输条件" type="text"
                         @change="changeCondition">
                <el-option v-for="item in transportationConditionList" :key="item.key" :label="item.label"
                           :value="item.key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="退货单位仓库地址" prop="warehouseId">
              <el-select v-model="form.warehouseId" :clearable="true" filterable placeholder="请选择退货单位仓库地址"
                         @change="transportationAddressChange">
                <el-option v-for="item in LogisticsCenterAddressList" :key="item.id" :label="filterAddressLabel(item)"
                           :value="item.id">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否合格">
              <el-switch v-model="form.qualityFlag" active-color="#13ce66" active-text="是" inactive-color="#ff4949"
                         inactive-text="否" @change="clearForm"></el-switch>
            </el-form-item>
            <el-form-item label="预计退货日期" prop="demandTime">
              <el-date-picker
                v-model="form.demandTime"
                :picker-options="pickerOptions" format="yyyy-MM-dd"
                placeholder="请选择日期" value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
              <oms-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入备注信息"
                         type="textarea"></oms-input>
            </el-form-item>
            <el-form-item label="附件" v-show="(form.id===null||[0,1,4].indexOf(form.status)!==-1)&&formType==='pov'">
              <oms-upload :fileList="attachmentList"
                          :formData="{ objectId: form.id, objectType: 'returnApplicationFile'}"
                          @change="changeFiles"></oms-upload>
            </el-form-item>
            <el-form-item label-width="160px">
              <el-button type="primary" @click="index++">添加疫苗</el-button>
            </el-form-item>
          </div>
          <div class="hide-content" v-bind:class="{'show-content' : index==1}">

            <div class="oms-form order-product-box">
              <el-form ref="orderGoodsAddForm" :model="product" :rules="orderGoodsRules" label-width="120px">
                <el-form-item label="产品" prop="orgGoodsId">
                  <el-select v-model="product.orgGoodsId" :clearable="true" :loading="loading"
                             :no-data-text="noDataText"
                             :remote-method="searchProduct" filterable placeholder="请输入名称搜索产品"
                             popper-class="order-good-selects" remote
                             @change="getGoodDetail">
                    <el-option v-for="item in filterProductList" :key="item.orgGoodsDto.id"
                               :label="item.orgGoodsDto.name"
                               :value="item.orgGoodsDto.id">
                      <div style="overflow: hidden">
                        <span class="pull-left">{{ item.orgGoodsDto.name }}</span>
                        <el-tag v-show="item.list.length" class="pull-left"
                                style="line-height: 22px;margin-left: 20px;height: 20px"
                                type="success">
                          组合
                        </el-tag>
                        <span v-if="item.orgGoodsDto.goodsDto" class="select-other-info pull-right"><span
                          v-show="item.orgGoodsDto.goodsDto.specifications">规格:</span>{{ item.orgGoodsDto.goodsDto.specifications }}
                        </span>
                      </div>
                      <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">货主货品编号:</span>{{ item.orgGoodsDto.goodsNo }}
                        </span>
                        <!--<span class="select-other-info pull-left"><span-->
                        <!--v-show="item.orgGoodsDto.procurementPrice">采购价格 ￥{{ item.orgGoodsDto.procurementPrice-->
                        <!--}}</span>-->
                        <!--</span>-->
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                        <span v-if="item.orgGoodsDto.goodsDto" class="select-other-info pull-left">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{
                            item.orgGoodsDto.goodsDto.factoryName
                          }}
                        </span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
                <div v-show="product.orgGoodsId">
                  <div class="product-info-fix clearfix">
                    <el-row>
                      <el-col :span="14">
                        <goods-info-part :product-info="product"></goods-info-part>
                      </el-col>
                      <el-col :span="10">
                        <span v-show="accessoryList.length">【组合疫苗】</span>
                        <span v-for="acce in accessoryList" style="display: block;font-size: 12px">
                       <span style="margin-right: 10px">{{ acce.name }}</span>
                       <span v-show="acce.procurementPrice"
                             style="margin-right: 10px">¥ {{ acce.procurementPrice | formatMoney }}</span>
                             <span v-show="acce.proportion" style="margin-right: 10px">比例 {{ acce.proportion }}</span>
                             <span style="margin-right: 10px">{{ acce.salesFirmName }}</span>
                        </span>
                      </el-col>
                    </el-row>
                  </div>
                  <batch-number-part ref="batchNumberPart" :editItemProduct="editItemProduct" :form="form"
                                     :formCopy="formCopy"
                                     :product="product"
                                     :productList="filterProductList" order-type="2-1" @addProduct="setAddProduct"
                                     @setIsHasBatchNumberInfo="setIsHasBatchNumberInfo"
                  ></batch-number-part>
                  <oms-form-row :label="''" :span="4" label-width="160px">
                    <el-button type="primary" @click="addProduct" @mousedown.native="mousedownAdd">加入订单</el-button>
                  </oms-form-row>
                </div>

                <!--<el-form-item label="单价" class="productItem-info" prop="unitPrice">-->
                <!--<oms-input type="text" placeholder="请输入单价" v-model="product.unitPrice" :min="0"-->
                <!--@blur="formatPrice">-->
                <!--<template slot="prepend">¥</template>-->
                <!--</oms-input>-->
                <!--</el-form-item>-->
              </el-form>

            </div>

            <!--<span v-show="batchNumbers.length" style="font-weight: 600">批号信息</span>-->

            <div class="product-list-detail">
              <h3 style="background: #13ce66;color: #fff">已选疫苗</h3>
              <table class="table">
                <thead>
                <tr>
                  <th style="width: 240px">疫苗名称</th>
                  <th>规格</th>
                  <th>批号</th>
                  <th style="width: 60px">单价</th>
                  <th style="width: 60px">数量</th>
                  <th style="width: 60px">金额</th>
                  <th style="width: 60px">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="product in form.detailDtoList" :class="{'combinatioon-product':product.isCombination}">
                  <td>
                    <el-tag v-show="product.isCombination" :class="{ml15:product.isCombination}" style="font-size: 10px"
                            type="success">组合
                    </el-tag>
                    <span>{{ product.orgGoodsName }}</span>
                  </td>
                  <td>
                    <span v-if="product.orgGoodsDto">{{ product.orgGoodsDto.goodsDto.specifications }}</span>
                    <span v-else-if="product.fixInfo">{{ product.fixInfo.goodsDto.specifications }}</span>
                    <span v-else>{{ product.specifications }}</span>
                  </td>
                  <td>
                    {{ product.batchNumber ? product.batchNumber : '无' }}
                    <goods-status-tag :form="form" :item="product"/>
                  </td>
                  <td>
                    <span v-show="Number(product.unitPrice)">¥ {{ product.unitPrice | formatMoney }}</span>
                    <span v-if="!Number(product.unitPrice)">-</span>
                  </td>
                  <td>{{ product.amount }} <span v-show="product.measurementUnit">(<dict
                    :dict-group="'measurementUnit'"
                    :dict-key="product.measurementUnit"></dict>)</span>
                  </td>
                  <td><span
                    v-show="Number(product.unitPrice)">¥{{ product.amount * product.unitPrice | formatMoney }}</span>
                    <span v-if="!Number(product.unitPrice)">-</span>
                  </td>
                  <td class="goods-btn">
                    <div v-show="defaultIndex === 2">
                      <a v-show="!product.isCombination" href="#" @click.prevent="editItem(product)"><i
                        class="el-icon-t-edit"></i> 编辑</a>
                    </div>
                    <div>
                      <a href="#" @click.prevent="remove(product)"><i
                        class="el-icon-t-delete"></i> 删除</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="right" colspan="5">
                    <total-count :list="form.detailDtoList" property="amount"></total-count>
                  </td>
                  <td colspan="2" style="font-weight: 600"><span
                    v-show="form.detailDtoList.length && totalMoney">合计:</span><span
                    v-show="form.detailDtoList.length  && totalMoney">   ¥{{ totalMoney | formatMoney }}</span></td>
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
import {Address, cerpAction, http, OmsAttachment, returnRequest} from '@/resources';
import utils from '@/tools/utils';
import batchNumberPart from './batchNumber';
import OrderMixin from '@/mixins/orderMixin';
import addGoodsMixin from '@/mixins/addGoodsMixin';

export default {
  name: 'addForm',
  loading: false,
  components: {
    batchNumberPart
  },
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
      attachmentList: [],
      loading: false,
      idNotify: true,
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
        'povId': '',
        'cdcId': '',
        'type': this.type,
        transportationMeansId: '',
        transportationConditionId: '',
        transportationAddress: '',
        logisticsCentreId: '',
        importedFlag: false,
        orgRelation: '',
        warehouseId: '',
        qualityFlag: true,
        sameBatchNumber: false,
        actualConsignee: '',
        'thirdPartyNumber': '',
        'demandTime': '',
        'detailDtoList': [],
        'remark': '',
        returnReason: '',
        fileIdList: []
      },
      rules: {
        goodsType: [
          {required: true, message: '请选择订单类型', trigger: 'change'},
        ],
        cdcId: [
          {required: true, message: '请选择供货单位', trigger: 'change'}
        ],
        transportationMeansId: [
          {required: true, message: '请选择物流方式', trigger: 'change'}
        ],
        transportationConditionId: [
          {required: true, message: '请选择运输条件', trigger: 'change'}
        ],
        warehouseId: [
          {required: true, message: '请选择退货单位仓库地址', trigger: 'change'}
        ],
        demandTime: [
          {required: true, message: '请选择日期', trigger: 'change'}
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
      saveKey: 'outSalesOrderForm',
      isStorageData: false, // 判断是不是缓存数据
      warehouses: [], // 供货单位仓库列表
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
    formType() {
      return this.$route.meta.type;
    },
    bizTypeList() {
      return this.$getDict('bizOutType');
    },
    transportationMeansList() {
      return this.$getDict('outTransportMeans');
    },
    measurementUnitList() {
      return this.$getDict('measurementUnit');
    },
    transportationConditionList() {
      return this.$getDict('transportationCondition');
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
    noDataText() {
      if (typeof this.form.goodsType !== 'number') {
        return '请选择订单类型';
      }
      if (!this.form.cdcId) {
        return '请选择供货单位';
      }
      return '无数据';
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
      this.attachmentList = [];
      this.formCopy = {};
      this.isStorageData = false;
      this.index = 0;
      this.idNotify = true;
      let user = this.$store.state.user;
      this.form.povId = user.userCompanyAddress;
      this.form.transportationMeansId = '';
      this.form.transportationConditionId = '';
      this.searchProduct();
      this.filterOrg();
      if (val === 2) {
        this.form.fileIdList = [];
        this.editOrderInfo();
      } else {
        this.resetForm();
        this.form.state = '';
        this.form.id = null;
        this.form.fileIdList = [];
        // 设默认值
        this.setDefaultValue();
        this.filterAddress();
      }
    }
  },

  mounted: function () {
    this.currentPartName = this.productListSet[0].name;
  },
  methods: {
    queryAttachmentList: function () {// 附件管理
      if (!this.form.id) return;
      OmsAttachment.queryOneAttachmentList(this.form.id, 'returnApplicationFile').then(res => {
        this.attachmentList = res.data;
      });
    },
    changeFiles: function (fileList) {
      let ids = [];
      fileList.forEach(file => {
        ids.push(file.attachmentId);
      });
      this.form.fileIdList = ids;
    },
    changeVaccineType() {
      this.clearForm();
    },
    filterAddressLabel(item) {
      let name = item.name ? '【' + item.name + '】' : '';
      return name + item.detail;
    },
    setDefaultValue() {
      this.form.transportationMeansId = '1';
      this.form.transportationConditionId = '0';
    },
    resetForm: function () {// 重置表单
      this.$refs['orderAddForm'].resetFields();
      this.$refs['orderGoodsAddForm'].resetFields();
      this.form.actualConsignee = '';
      this.form.remark = '';
      this.form.returnReason = '';
      this.form.detailDtoList = [];
      this.form.cdcId = '';
      this.form.warehouseId = '';
      this.searchProductList = [];
      this.filterProductList = [];
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
      this.filterProductList = [];

      // 判断是否合格
      if (!this.form.qualityFlag) {
        // 如果不合格，需要把运输条件重置成常温运输
        this.form.transportationConditionId = this.transportationConditionList.filter(item => item.label == '常温运输').key || '1';
      }

      this.changeCondition(this.form.transportationConditionId);
    },
    editOrderInfo() {
      if (!this.orderId) return;
      returnRequest.get(this.orderId).then(res => {
        this.resetForm();
        this.isStorageData = true;
        res.data.detailDtoList = res.data.detailDtoList.map(m => {
          return {
            amount: m.applyCount,
            measurementUnit: m.unit,
            orgGoodsId: m.orgGoodsId,
            orgGoodsName: m.goodsName,
            unitPrice: m.price,
            specifications: m.specification,
            combinationSign: m.combinationSign,
            batchNumberId: m.batchNumberId,
            batchNumber: m.batchNumber,
            orgGoodsDto: m.orgGoodsDataDto.orgGoodsDto,
            expirationDate: m.expirationDate
          };
        });
        this.filterAddress(this.isStorageData);
        this.form = JSON.parse(JSON.stringify(res.data));
        this.formCopy = JSON.parse(JSON.stringify(res.data));
        // ****** 2.0变化
        this.changeCustomerId(this.form.cdcId, true);
        // ******
        this.$nextTick(() => {
          this.isStorageData = false;
        });
        // 查询附件
        this.queryAttachmentList();
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
    formatPrice() {// 格式化单价，保留两位小数
      this.product.unitPrice = utils.autoformatDecimalPoint(this.product.unitPrice);
    },
    setIndexValue: function (value) {// 左侧显示页切换
      this.index = value;
    },
    doClose: function () {
      this.$emit('close');
    },
    filterOrg: function (query) {// 过滤POV
      cerpAction.queryOnCDCs().then(res => {
        this.orgList = res.data.map(m => ({
          id: m.orgId,
          name: m.orgName
        }));
      });
    },
    changeCustomerId(val, isEdit) {// POV改变时
      if (!this.isStorageData) {// 当有缓存时，不做清空操作
        this.product.orgGoodsId = '';
        this.form.detailDtoList = [];
        this.$refs['orderGoodsAddForm'].resetFields();
        this.accessoryList = [];
        this.batchNumbers = [];
      }
      this.searchProduct();
    },
    getWarehouseAdress: function (item) { // 得到仓库地址
      return item.detail + `（${this.warehouseTypeList[item.warehouseType].label}）`;
    },
    filterAddress(isStorageData) {
      Address.queryAddress(this.form.povId, {
        deleteFlag: false,
        orgId: this.form.povId,
        auditedStatus: '1', status: 0
      }).then(res => {
        this.LogisticsCenterAddressList = res.data;
        if (isStorageData) return;
        let defaultStore = res.data.filter(item => item.default);
        this.form.warehouseId = defaultStore.length ? defaultStore[0].id : '';
      });
    },
    // 运输条件改变
    changeCondition: function (transportationConditionId) {
      this.form.transportationConditionId = transportationConditionId
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
        this.batchNumbers = [];
        this.editItemProduct = {};
        this.form.detailDtoList = [];
        this.filterProductList = [];
        this.searchProduct();
      });
    },
    searchProduct: function (query) {
      if (!this.form.cdcId || typeof this.form.goodsType !== 'number') {
        this.searchProductList = [];
        this.filterProductList = [];
        return;
      }
      let params = {
        keyWord: query,
        factoryId: this.form.cdcId,
        vaccineType: this.form.goodsType + 1,
        transportationCondition: this.form.qualityFlag ? this.form.transportationConditionId : ''
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
    getGoodDetail: function (OrgGoodsId) {// 选疫苗
      this.accessoryList = [];
      this.batchNumbers = [];
      this.editItemProduct = {};
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
          // 近效期提醒
          // this.checkGoodsRegistrationValid(item.orgGoodsDto.goodsDto.goodsApprovalNOValidity);
        }
      });
      this.isCheckPackage(this.product.fixInfo.goodsDto.smallPacking);

      // this.queryBatchNumers();
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
    setIsHasBatchNumberInfo(val) {
      this.isHasBatchNumberInfo = val;
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
            if (this.batchNumbers.length) {
              this.batchNumbers[0].lots.forEach(bl => {
                if (bl.isChecked) {
                  let product = JSON.parse(JSON.stringify(this.product));
                  product.batchNumberId = bl.id;
                  product.batchNumber = bl.no;
                  product.amount = bl.productCount;
                  product.measurementUnit = item.orgGoodsDto.goodsDto.measurementUnit;
                  // 有效期
                  product.expirationDate = bl.expirationDate;
                  this.form.detailDtoList.push(product);
                  totalAmount += bl.productCount;
                }
              });
            } else {
              this.form.detailDtoList.push(JSON.parse(JSON.stringify(this.product)));
            }
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
          }
        });
        !isHasInSearchProductList && this.handleRepetitiveOrgGoods(!this.batchNumbers.length);
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
          this.batchNumbers = [];
          this.editItemProduct = {};
          this.searchProduct();

        });
      });
    },
    remove: function (item) { // 删除疫苗
      this.deleteItem(item);
      this.searchProduct();
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
    editItem(item) {
      this.product.orgGoodsId = '';
      this.$nextTick(() => {
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
      });
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
        if (!saveData.id && this.form.fileIdList.length === 0) {
          this.$confirm('未上传附件，是否仍新增退货申请？', '', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.saveForm(saveData);
          }).catch(error => {
            return false;
          });
        } else {
          this.saveForm(saveData);
        }
      })
    },
    saveForm(saveData) {
      saveData.detailDtoList.forEach(item => {
        item.price = item.unitPrice;
        item.applyCount = item.amount;
        !item.combinationFlag && (item.combinationFlag = item.isCombination);
        delete item.fixInfo;
        delete item.mainOrgId;
        delete item.isCombination;
        delete item.proportion;
      });
      saveData.detailDtoList = this.mergeSameOrgGoodsIdAndBatchNumberWhenOut(saveData.detailDtoList);
      this.doing = true;
      if (saveData.id) {
        returnRequest.update(saveData.id, saveData).then(res => {
          this.$notify({
            duration: 2000,
            message: '编辑退货申请成功',
            type: 'success'
          });
          this.$emit('change');
          this.doing = false;
          this.$emit('close');
          this.resetForm();
        }).catch(error => {
          this.doing = false;
          this.$notify({
            duration: 2000,
            title: '编辑退货申请失败',
            message: error.response && error.response.data && error.response.data.msg || '网络异常',
            type: 'error'
          });
        });
      } else {
        returnRequest.save(saveData).then(res => {
          this.$notify({
            duration: 2000,
            message: '新增退货申请成功',
            type: 'success'
          });
          window.localStorage.removeItem(this.saveKey);
          this.$emit('change', res.data);
          this.doing = false;
          this.$emit('close');
          this.resetForm();
        }).catch(error => {
          this.doing = false;
          this.$notify({
            duration: 2000,
            title: '新增退货申请失败',
            message: error.response && error.response.data && error.response.data.msg || '网络异常',
            type: 'error'
          });
        });
      }
    }
  }
};
</script>
