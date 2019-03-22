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
        <h3>{{currentPartName}}</h3>
        <el-form ref="orderAddForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                 label-width="160px" style="padding-right: 20px">
          <div class="hide-content" v-bind:class="{'show-content' : index==0}">
            <el-form-item label="物流方式" :prop=" showContent.isShowOtherContent?'transportationMeansId':'' "
                          v-show="showContent.isShowOtherContent">
              <el-select type="text" v-model="form.transportationMeansId" placeholder="请选择物流方式"
                         @change="changeTransportationMeans">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in transportationMeansList"
                           v-show="(item.key !== '2' || item.key==='2' && form.bizType!=='2-2') && item.key !== '4'"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接种点" prop="customerId">
              <el-select filterable remote placeholder="请输入名称搜索接种点" :remote-method="filterPOV" :clearable="true"
                         v-model="form.customerId" @change="changeCustomerId" popper-class="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                  </div>
                  <div style="overflow: hidden" v-show="org.manufacturerCode">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接种点收货地址" :prop=" showContent.isShowOtherContent?'transportationAddress':'' "
                          v-show="showContent.isShowOtherContent" :clearable="true">
              <el-select placeholder="请选择接种点收货地址" v-model="form.transportationAddress" filterable clearable
                         @change="changeWarehouseAdress" :clearable="true">
                <el-option :label="filterAddressLabel(item)" :value="item.id" :key="item.id" v-for="item in warehouses">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实际收货人" v-show="showContent.isShowOtherContent">
              <oms-input type="text" placeholder="请输入实际收货人" :maxlength="50" v-model="form.actualConsignee"></oms-input>
            </el-form-item>
            <el-form-item label="收货人联系电话" v-show="showContent.isShowOtherContent">
              <oms-input type="text" placeholder="请输入收货人联系电话" :maxlength="50" v-model="form.consigneePhone"></oms-input>
            </el-form-item>
            <!--<el-form-item label="是否同批号">-->
            <!--<el-switch active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949"-->
            <!--v-model="form.sameBatchNumber"></el-switch>-->
            <!--</el-form-item>-->
            <el-form-item label="疾控发货地址" prop="orgAddress">
              <el-select placeholder="请选择疾控发货地址" v-model="form.orgAddress" filterable :clearable="true"
                         @change="transportationAddressChange">
                <el-option :label="filterAddressLabel(item)" :value="item.id" :key="item.id"
                           v-for="item in LogisticsCenterAddressList">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流中心" prop="logisticsCentreId">
              <el-select placeholder="请选择物流中心" v-model="form.logisticsCentreId" filterable :clearable="true"
                         @change="changeLogisticsCenterId">
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in LogisticsCenter"/>
              </el-select>
            </el-form-item>
            <el-form-item label="运输条件" prop="transportationCondition">
              <el-select type="text" placeholder="请选择运输条件" v-model="form.transportationCondition">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in transportationConditionList"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="是否进口">-->
            <!--<el-switch active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949"-->
            <!--v-model="form.importedFlag"></el-switch>-->
            <!--</el-form-item>-->
            <el-form-item :label="'预计送货时间'"
                          :prop=" showContent.isShowOtherContent?'expectedTime':'' "
                          v-show="showContent.isShowOtherContent">
              <el-date-picker
                v-model="form.expectedTime"
                placeholder="请选择日期" format="yyyy-MM-dd"
                :picker-options="pickerOptions"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <material-part @changeRemark="changeRemark" v-if="vaccineType === '1'"></material-part>
            <el-form-item label="备注" class="clearfix">
              <oms-input type="textarea" v-model="form.remark" placeholder="请输入备注信息"
                         :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
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
                        <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                        <el-tag class="pull-left" type="success" v-show="item.list.length"
                                style="line-height: 22px;margin-left: 20px;height: 20px">
                          组合
                        </el-tag>
                        <span class="select-other-info pull-right" v-if="item.orgGoodsDto.goodsDto"><span
                          v-show="item.orgGoodsDto.goodsDto.specifications">规格:</span>{{item.orgGoodsDto.goodsDto.specifications}}
                        </span>
                      </div>
                      <div style="overflow: hidden">
                        <span class="select-other-info pull-left" v-show="vaccineType==='2'"><span
                          v-show="item.orgGoodsDto.goodsNo">疫苗编号:</span>{{item.orgGoodsDto.goodsNo}}
                        </span>
                        <span class="select-other-info pull-left" v-show="vaccineType==='2'"><span
                          v-show="item.orgGoodsDto.sellPrice">销售价格:￥{{ item.orgGoodsDto.sellPrice
                          }}</span>
                        </span>
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.salesFirmName">供货厂商:</span>{{ item.orgGoodsDto.salesFirmName }}
                        </span>
                        <span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产厂商:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                        </span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
                <div v-show="product.orgGoodsId">
                  <!--<el-form-item label="产品数量" class="productItem-info" :prop=" isHasBatchNumberInfo ? '' : 'amount' "-->
                  <!--v-if="isHasBatchNumberInfo">-->
                  <!--<oms-input type="number" v-model.number="product.amount" :min="0" @blur="changeNumber">-->
                  <!--<template slot="append">-->
                  <!--<dict :dict-group="'measurementUnit'"-->
                  <!--:dict-key="product.fixInfo.goodsDto.measurementUnit"></dict>-->
                  <!--</template>-->
                  <!--</oms-input>-->
                  <!--</el-form-item>-->
                  <el-form-item label="单价" class="productItem-info" prop="unitPrice" v-show="vaccineType==='2'">
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
                       <span style="margin-right: 10px">{{acce.name}}</span>
                       <span style="margin-right: 10px"
                             v-show="acce.sellPrice">销售价格:¥{{ acce.sellPrice | formatMoney }}</span>
                       <span style="margin-right: 10px" v-show="acce.proportion">比例:{{ acce.proportion }}</span>
                       <span style="margin-right: 10px">{{ acce.salesFirmName }}</span>
                    </span>
                      </el-col>
                    </el-row>
                  </div>
                  <batch-number-part ref="batchNumberPart" :form="form" :product="product"
                                     :productList="filterProductList"
                                     :editItemProduct="editItemProduct"
                                     :formCopy="formCopy"
                                     @setIsHasBatchNumberInfo="setIsHasBatchNumberInfo"></batch-number-part>

                  <oms-form-row label-width="160px" :span="4" :label="''">
                    <el-button type="primary" @click="addProduct">加入订单</el-button>
                  </oms-form-row>
                </div>
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
                  <th style="width: 70px" v-show="vaccineType==='2'">疫苗单价</th>
                  <th style="width: 70px">疫苗数量</th>
                  <th v-show="vaccineType==='2'">金额</th>
                  <th style="width: 60px">操作</th>
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
                    <span v-if="product.orgGoodsDto">{{ product.orgGoodsDto.goodsDto.specifications }}</span>
                    <span v-else-if="product.fixInfo">{{ product.fixInfo.goodsDto.specifications }}</span>
                    <span v-else="">{{ product.specifications }}</span>
                  </td>
                  <td>
                    {{ product.no ? product.no : '无' }}
                    <!--<el-tag v-show="product.inEffectiveFlag" type="warning">近效期</el-tag>-->
                    <goods-status-tag :item="product" :form="form"/>

                  </td>
                  <td class="ar" v-show="vaccineType==='2'">
                   <span v-show="Number(product.unitPrice)">
                     <span>¥</span>{{product.unitPrice | formatMoney}}
                     <span v-if="!Number(product.unitPrice)">-</span>
                   </span>
                    <span v-if="!Number(product.unitPrice)">-</span>
                  </td>
                  <td class="ar">{{product.amount}} <span v-show="product.measurementUnit">（<dict
                    :dict-group="'measurementUnit'"
                    :dict-key="product.measurementUnit"></dict>）</span>
                  </td>
                  <td class="ar" v-show="vaccineType==='2'">
                    <span v-show="Number(product.unitPrice)">¥{{ product.amount * product.unitPrice | formatMoney
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
                  <td colspan="2" style="font-weight: 600" v-show="vaccineType==='2'">
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
  import {Address, BaseInfo, erpOrder, http, InWork, LogisticsCenter} from '@/resources';
  import utils from '@/tools/utils';
  import materialPart from '../material.vue';
  import batchNumberPart from './batchNumber';
  import OrderMixin from '@/mixins/orderMixin';

  export default {
    name: 'addForm',
    loading: false,
    components: {materialPart, batchNumberPart},
    mixins: [OrderMixin],
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
        idNotify: true,
        product: {
          'amount': null,
          'entrustment': false,
          'measurementUnit': '',
          'orgGoodsId': '',
          'packingCount': null,
          'specificationsId': '',
          inEffectiveFlag: false,
          unitPrice: null,
          'fixInfo': {
            'goodsDto': {}
          }
        },
        accessoryList: [], // 组合疫苗列表
        searchProductList: [],
        filterProductList: [],
        form: {
          'orgId': '',
          'customerId': '',
          'bizType': '2-0',
          'type': this.type,
          'logisticsProviderName': '',
          'transportationCondition': '',
          transportationMeansId: '',
          transportationAddress: '',
          logisticsCentreId: '',
          importedFlag: false,
          orgRelation: '',
          orgAddress: '',
          sameBatchNumber: false,
          actualConsignee: '',
          'consigneePhone': '',
          'thirdPartyNumber': '',
          'expectedTime': '',
          'detailDtoList': [],
          'remark': ''
        },
        rules: {
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
            {required: true, message: '请选择接种点', trigger: 'change'}
          ],
          bizType: [
            {required: true, message: '请选择业务类型', trigger: 'change'}
          ],
          transportationMeansId: [
            {required: true, message: '请选择物流方式', trigger: 'change'}
          ],
          transportationAddress: [
            {required: true, message: '请选择接种点收货地址', trigger: 'change'}
          ],
          logisticsProviderName: [
            {required: true, message: '请选择物流商', trigger: 'change'}
          ],
          orgAddress: [
            {required: true, message: '请选择疾控发货地址', trigger: 'change'}
          ],
          logisticsCentreId: [
            {required: true, message: '请选择物流中心', trigger: 'change'}
          ],
          transportationCondition: [
            {required: true, message: '请选择运输条件', trigger: 'blur'}
          ],
          expectedTime: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          remark: [
            {required: true, message: '请输入备注信息', trigger: 'blur'}
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
        isStorageData: true, // 判断是不是缓存数据
        showContent: {
          isShowOtherContent: true, // 是否显示物流类型
          isShowCustomerId: true, // 是否显示POV
          expectedTimeLabel: '预计出库时间'
        },
        warehouses: [], // 接种点收货地址列表
        batchNumbers: [], // 疫苗批号列表
        selectBatchNumbers: [], // 已经选择的疫苗批号
        changeTotalNumber: utils.changeTotalNumber,
        isCheckPackage: utils.isCheckPackage,
        requestTime: '',
        editItemProduct: {},
        isHasBatchNumberInfo: false,
        formCopy: {}
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
        this.formCopy = {};
        this.isStorageData = false;
        this.index = 0;
        this.idNotify = true;
        let user = this.$store.state.user;
        this.form.orgId = user.userCompanyAddress;
        this.checkLicence(this.form.orgId);
        if (val === 2) {
          this.editOrderInfo();
        } else {
          this.resetForm();
          this.form.state = '';
          this.form.id = null;
          // 设置一些默认值
          this.setDefaultValue();
          this.filterPOV();
          this.filterAddress();
        }
      }
//      form: {
//        handler: 'autoSave',
//        deep: true
//      }
    },

    mounted: function () {
      this.currentPartName = this.productListSet[0].name;
      this.filterLogisticsCenter();
//      this.filterAddress();
//      let oldForm = window.localStorage.getItem(this.saveKey);
//      if (oldForm) {
//        this.form = Object.assign({}, this.form, JSON.parse(oldForm));
//        this.form.orgAddress = this.form.orgAddress
//          ? this.form.orgAddress : window.localStorage.getItem('orgAddress');
//      }
    },
    methods: {
      filterAddressLabel(item) {
        let name = item.name ? '【' + item.name + '】' : '';
        return name + this.getWarehouseAdress(item);
      },
      setDefaultValue() {
        this.form.transportationMeansId = '0';
        this.form.transportationCondition = '0';
        // 默认物流中心
        this.form.logisticsCentreId = this.$store.state.logisticsCentreId;
      },
      getTitle() {
        return `${this.defaultIndex === 2 ? '编辑' : '增加'}${this.vaccineType === '1' ? '一类苗' : '二类苗'}销售订单`;
      },
      autoSave: function () {
        if (!this.form.id) {
          window.localStorage.setItem(this.saveKey, JSON.stringify(this.form));
        }
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
        this.form.transportationAddress = '';
        this.form.orgAddress = '';
        this.searchProductList = [];
        this.filterProductList = [];
      },
      editOrderInfo() {
        if (!this.orderId) return;
        InWork.queryOrderDetail(this.orderId).then(res => {
//          this.currentOrder = res.data;
          this.resetForm();
          // 2.0变化
          this.resetProductForm();
          this.isStorageData = true;
          res.data.detailDtoList.forEach(f => {
            f.orgGoodsName = f.name;
            f.no = f.batchNumber;
          });
          this.orgList = [
            {
              id: res.data.customerId,
              name: res.data.customerName
            }
          ];
          this.warehouses = [
            {
              id: res.data.transportationAddress,
              name: res.data.warehouseName,
              detail: res.data.warehouseAddress
            }
          ];
          this.filterAddress(this.isStorageData);
          this.filterPOV(res.data.customerName);
          this.form = JSON.parse(JSON.stringify(res.data));
          this.formCopy = JSON.parse(JSON.stringify(res.data));
          // ****** 2.0变化
          this.changeCustomerId(this.form.customerId, true);
          this.changeTransportationMeans(this.form.transportationMeansId);
          // ******
          this.$nextTick(() => {
            this.isStorageData = true;
          });
        });
      },
      changeRemark(form) {
        if (!this.form.remark) {
          this.form.remark = form.count + form.name;
        } else {
          this.form.remark += '，' + form.count + form.name;
        }
      },
      changeNumber() {
        this.product.amount = this.changeTotalNumber(this.product.amount, this.product.fixInfo.goodsDto.smallPacking);
      },
      formatPrice() {// 格式化单价，保留两位小数
        this.product.unitPrice = utils.autoformatDecimalPoint(this.product.unitPrice);
      },
      changeExpectedTime: function (date) {// 格式化日期
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
      filterPOV: function (query) {// 过滤POV
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query,
          relation: '0'
        };
        BaseInfo.queryOrgByAllRelation(orgId, params).then(res => {
          this.orgList = res.data;
        });
      },
      changeLogisticsCenterId() {// 物流中心改变时, 重置货品列表
        this.$refs['orderGoodsAddForm'].resetFields();
        this.accessoryList = [];
        this.batchNumbers = [];
        this.form.detailDtoList = [];
        this.product.orgGoodsId = '';
        this.searchProduct();
      },
      filterLogisticsCenter: function () {// 过滤物流中心
        let param = {
          deleteFlag: false
        };
        LogisticsCenter.query(param).then(res => {
          this.LogisticsCenter = res.data;
        });
      },
      bizTypeChange: function (val) {// 业务类型改变时
        if (!this.isStorageData) {// 有缓存时，不重置表单
          let orgId = this.form.orgId;
          let bizType = this.form.bizType;
          this.$refs['orderAddForm'].resetFields();
          this.form.remark = '';
          this.form.orgId = orgId;
          this.form.bizType = bizType;
        }
        switch (val) {
          case '2-0' : {
            this.showContent = {
              isShowOtherContent: true, // 是否显示物流类型
              isShowCustomerId: true, // 是否显示POV
              expectedTimeLabel: '预计出库时间'
            };
            this.filterPOV();
            break;
          }
          case '2-1' : {
            this.showContent = {
              isShowOtherContent: true, // 是否显示物流类型
              isShowCustomerId: true, // 是否显示POV
              expectedTimeLabel: '预计出库时间'
            };
            this.filterPOV();
            break;
          }
          case '2-2' : {
            this.showContent = {
              isShowOtherContent: false, // 是否显示物流类型
              isShowCustomerId: false, // 是否显示POV
              expectedTimeLabel: ''
            };
            break;
          }
          case '2-3' : {
            this.showContent = {
              isShowOtherContent: true, // 是否显示物流类型
              isShowCustomerId: false, // 是否显示POV
              expectedTimeLabel: '预计出库时间'
            };
            Address.queryAddress(this.form.orgId, {
              deleteFlag: false,
              orgId: this.form.orgId,
              auditedStatus: '1',
              status: 0
            }).then(res => {
              this.warehouses = res.data;
            });
            break;
          }
        }
      },
      changeTransportationMeans(val) {// 物流方式改变时
        switch (val) {
          case '0': {
            this.showContent.expectedTimeLabel = '预计送货时间';
            if (this.form.bizType === '2-1') {
              this.showContent.expectedTimeLabel = '预计出库时间';
            }
            break;
          }
          case '1': {
            this.showContent.expectedTimeLabel = '预计提货时间';
            break;
          }
          case '2': {
            this.showContent.expectedTimeLabel = '预计发货时间';
            break;
          }
        }
        if (this.form.bizType === '2-2') {
          this.showContent.expectedTimeLabel = '';
        }
      },
      changeCustomerId(val, isEdit) {// POV改变时
        if (!this.isStorageData) {// 有缓存时，不重置表单
          this.$refs['orderGoodsAddForm'].resetFields();
          this.accessoryList = [];
          this.batchNumbers = [];
          this.form.detailDtoList = [];
          this.product.orgGoodsId = '';
        }
        this.checkLicence(val);
        this.searchWarehouses(val, isEdit);
        this.searchProduct();
      },
      searchWarehouses(orgId, isEdit) {
        if (!orgId) {
          this.warehouses = [];
          this.form.transportationAddress = '';
          return;
        }
        Address.queryAddress(orgId, {
          deleteFlag: false, orgId: orgId, auditedStatus: '1', status: 0
        }).then(res => {
          this.warehouses = res.data || [];
          // let fs = this.warehouses.filter(i => i.default)[0];
          // this.form.transportationAddress = fs && fs.id || '';
          // 以前去默认仓库地址
          // 现在业务关系中维护地址
          if (isEdit) return;
          this.orgList.forEach(i => {
            if (i.id === orgId) {
              this.form.transportationAddress = i.orgRelationList.length ? i.orgRelationList[0].addressId : '';
              if (i.orgRelationList.length) {
                this.form.actualConsignee = i.orgRelationList[0].contactPerson;
                this.form.consigneePhone = i.orgRelationList[0].contactPersonPhone;
              }
            }
          });
          // *************************//
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
      changeWarehouseAdress: function (val) {
        if (!this.isStorageData) {// 当有缓存时，不做清空操作
          this.form.actualConsignee = ''; // 仓库改变时, 设置实际收货人
          this.form.consigneePhone = ''; // 仓库改变时, 设置实际收货人
        }
        this.warehouses.forEach(item => {
          if (val === item.id) {
            this.form.actualConsignee = item.contact;
            this.form.consigneePhone = item.telephone;
          }
        });
      },
      getWarehouseAdress: function (item) { // 得到仓库地址
        return item.detail;
      },
      checkLicence: function (val) {// 检查货主/单位证照是否过期
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
        if (!this.form.customerId || !this.form.orgId || !this.form.logisticsCentreId) {
          this.searchProductList = [];
          this.filterProductList = [];
          return;
        }
        let params = {
          cdcId: this.form.orgId,
          povId: this.form.customerId,
          vaccineType: this.vaccineType,
          keyWord: query,
          logisticsCentreId: this.form.logisticsCentreId // 查询货品传入物流中心
        };
        let rTime = Date.now();
        this.requestTime = rTime;
        if (this.vaccineType === '1') {
          params.vaccineType = undefined;
        }
        http.get('pov-sale-group/valid/org-goods', {params: params}).then(res => {
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
          this.product = {
            'amount': null,
            'entrustment': false,
            'measurementUnit': '',
            'orgGoodsId': '',
            'packingCount': null,
            'specificationsId': '',
            inEffectiveFlag: false,
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
            let price = item.orgGoodsDto.sellPrice;
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
                        product.no = bl.no;
                        product.amount = bl.productCount;
                        product.measurementUnit = item.orgGoodsDto.goodsDto.measurementUnit;
                        // 有效期
                        product.expirationDate = bl.expirationDate;
                        this.form.detailDtoList.push(product);
                        totalAmount += bl.productCount;
                      }
                    });
                  }
                });
                item.list.forEach(m => {
                  this.batchNumbers.forEach(b => {
                    if (b.orgGoodsId === m.accessory) {
                      if (b.lots.length) {
                        b.lots.forEach(bl => {
                          if (bl.isChecked) {
                            this.form.detailDtoList.push({
                              no: bl.no,
                              batchNumberId: bl.id,
                              mainOrgId: item.orgGoodsDto.id,
                              isCombination: true,
                              orgGoodsId: m.accessory,
                              orgGoodsName: m.name,
                              unitPrice: m.sellPrice ? m.sellPrice : 0,
                              amount: bl.productCount,
                              measurementUnit: m.accessoryGoods.measurementUnit,
                              packingCount: null,
                              specificationsId: '',
                              expirationDate: m.expirationDate, // 有效期
                              specifications: m.accessoryGoods.specifications,
                              proportion: m.proportion
                            });
                          }
                        });
                      } else {
                        let amount = Math.ceil(m.proportion * totalAmount);
                        this.form.detailDtoList.push({
                          no: '',
                          batchNumberId: '',
                          mainOrgId: item.orgGoodsDto.id,
                          isCombination: true,
                          orgGoodsId: m.accessory,
                          orgGoodsName: m.name,
                          unitPrice: m.sellPrice ? m.sellPrice : 0,
                          amount: amount,
                          measurementUnit: m.accessoryGoods.measurementUnit,
                          packingCount: null,
                          specificationsId: '',
                          specifications: m.accessoryGoods.specifications,
                          proportion: m.proportion,
                          expirationDate: m.expirationDate // 有效期
                        });
                      }
                    }
                  });
                });
              } else {
                this.form.detailDtoList.push(JSON.parse(JSON.stringify(this.product)));
                item.list.forEach(m => {
                  this.form.detailDtoList.push({
                    no: '',
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
                    expirationDate: m.expirationDate // 有效期
                  });
                });
              }
            }
          });
          !isHasInSearchProductList && this.handleRepetitiveOrgGoods(this.isHasBatchNumberInfo);
          this.resetProductForm();
        });
      },
      resetProductForm() {
        this.$nextTick(function () {
          this.product = {
            'amount': null,
            'entrustment': false,
            'measurementUnit': '',
            'orgGoodsId': '',
            'packingCount': null,
            'specificationsId': '',
            inEffectiveFlag: false,
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
      },
      remove: function (item) { // 删除疫苗
        this.deleteItem(item);
        this.searchProduct();
      },
      editItem(item) {
//        this.filterProductList = [];
//        this.searchProductList = [];
//        this.searchProductList.push({
//          orgGoodsDto: item.orgGoodsDto || item.fixInfo,
//          list: []
//        });
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
          // this.queryBatchNumers();
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
            delete item.proportion;
            delete item.orgGoodsDto;
            delete item.expirationDate; // 删除有效期
          });
          saveData.detailDtoList = this.mergeSameOrgGoodsIdAndBatchNumberWhenOut(saveData.detailDtoList);
          this.doing = true;
          if (saveData.id) {
            erpOrder.updateOrder(saveData.id, saveData).then(res => {
              this.$notify({
                duration: 2000,
                message: '编辑销售订单成功',
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
                title: '编辑销售订单失败',
                message: error.response.data.msg,
                type: 'error'
              });
            });
          } else {
            erpOrder.save(saveData).then(res => {
              this.$notify({
                duration: 2000,
                message: '新增销售订单成功',
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
                title: '新增销售订单失败',
                message: error.response.data.msg,
                type: 'error'
              });
            });
          }
        });
      }
    }
  };
</script>
