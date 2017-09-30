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
      text-align: left;
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
        margin-bottom: 20px;
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
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">增加订单</h2>
        <ul>
          <li class="list-style" v-for="item in productListSet" @click="setIndexValue(item.key)"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit">保存订单</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>{{currentPartName}}</h3>

        <div class="hide-content" v-bind:class="{'show-content' : index==0}">
          <el-form ref="orderAddForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                   label-width="160px" style="padding-right: 20px">
            <el-form-item label="选择物流方式" :prop=" showContent.isShowOtherContent?'transportationMeansId':'' "
                          v-show="showContent.isShowOtherContent">
              <el-select type="text" v-model="form.transportationMeansId" @change="changeTransportationMeans"
                         placeholder="请选择物流方式">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in transportationMeansList" v-show="item.key !== '3' "></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="POV">
              <el-select filterable remote placeholder="请输入关键字搜索POV" :remote-method="filterOrg" :clearable="true"
                         v-model="form.supplierId" @change="changeSupplier">
                <el-option :value="org.subordinateId" :key="org.subordinateId" :label="org.subordinateName"
                           v-for="org in orgList">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流商选择"
                          v-show="showContent.isShowOtherContent&&(form.transportationMeansId==='1' || form.transportationMeansId==='3')">
              <el-select filterable remote placeholder="请输入关键字搜索物流商" :remote-method="filterLogistics"
                         :clearable="true"
                         v-model="form.logisticsProviderId">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in logisticsList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提货地址"
                          :prop=" showContent.isShowOtherContent&&form.transportationMeansId==='2'?'transportationAddress':'' "
                          v-show="showContent.isShowOtherContent&&form.transportationMeansId==='2' ">
              <oms-input type="text" v-model="form.transportationAddress" placeholder="请输入提货地址"></oms-input>
            </el-form-item>
            <el-form-item label="运输条件" :prop=" showContent.isShowOtherContent?'transportationCondition':'' "
                          v-show="showContent.isShowOtherContent">
              <el-select type="text" v-model="form.transportationCondition" placeholder="请选择运输条件">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in transportationConditionList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流中心">
              <el-select placeholder="请选择物流中心" v-model="form.logisticsCentreId" filterable>
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in LogisticsCenter"/>
              </el-select>
            </el-form-item>
            <el-form-item label="是否进口">
              <el-switch on-text="是" off-text="否" on-color="#13ce66" off-color="#ff4949"
                         v-model="form.importedFlag"></el-switch>
            </el-form-item>
            <el-form-item :label="showContent.expectedTimeLabel"
                          :prop=" showContent.isShowOtherContent?'expectedTime':'' "
                          v-show="showContent.isShowOtherContent">
              <el-date-picker
                v-model="form.expectedTime"
                type="date"
                placeholder="请选择预计入库时间" format="yyyy-MM-dd"
                @change="changeExpectedTime">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
              <oms-input type="textarea" v-model="form.remark" placeholder="请输入备注信息"
                         :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
            </el-form-item>
            <el-form-item label-width="120px">
              <el-button type="primary" @click="index++">添加货品</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="hide-content" v-bind:class="{'show-content' : index==1}">

          <div class="oms-form order-product-box">
            <el-form ref="orderGoodsAddForm" :rules="orderGoodsRules" :model="product" label-width="120px">
              <el-form-item label="选择产品" prop="orgGoodsId">
                <el-select v-model="product.orgGoodsId" filterable remote placeholder="请输入关键字搜索产品"
                           :remote-method="searchProduct" :clearable="true" :loading="loading"
                           popper-class="order-good-selects"
                           @change="getGoodDetail">
                  <el-option v-for="item in filterProductList" :key="item.orgGoodsDto.id"
                             :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id">
                    <div>
                      <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                      <span class="select-other-info pull-left">{{item.orgGoodsDto.goodsNo}}</span>
                      <span class="select-other-info pull-right">{{ item.orgGoodsDto.goodsDto.factoryName }}</span>
                      <!--<span class="select-other-info" style="color:#00bff3" >组合</span>-->
                      <el-tag type="success" v-show="item.list.length"
                              style="line-height: 22px;margin-left: 20px;height: 20px">
                        组合
                      </el-tag>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产品数量" class="productItem-info" prop="amount">
                <oms-input type="number" v-model.number="product.amount" :min="0">
                  <template slot="append">
                    <dict :dict-group="'measurementUnit'" :dict-key="product.fixInfo.goodsDto.measurementUnit"></dict>
                  </template>
                </oms-input>
              </el-form-item>
              <el-form-item label="单价" class="productItem-info" prop="unitPrice">
                <oms-input type="text" placeholder="请输入单价" v-model="product.unitPrice" :min="0"
                           @blur="formatPrice">
                  <template slot="prepend">¥</template>
                </oms-input>
              </el-form-item>
            </el-form>
            <div class="product-info-fix clearfix">
              <el-row>
                <el-col :span="12">
                  <oms-row label="货品编号" :span="8">
                    {{product.fixInfo.goodsNo}}
                  </oms-row>
                  <oms-row label="生产厂商" :span="8">
                    {{product.fixInfo.goodsDto.factoryName}}
                  </oms-row>
                  <oms-row label="批准文号" :span="8">
                    {{product.fixInfo.goodsDto.approvalNumber}}
                  </oms-row>
                  <oms-row label="是否OTC" :span="8">
                    <span v-show="product.orgGoodsId">{{product.fixInfo.goodsDto.goodsOtc | formatStatus}}</span>
                  </oms-row>
                </el-col>
                <el-col :span="12">
                  <span v-show="accessoryList.length">【组合货品】</span>
                  <span style="display: block;font-size: 12px" v-for="acce in accessoryList">
                       <span style="margin-right: 10px">{{acce.name}}</span>
                       <span style="margin-right: 10px" v-show="acce.unitPrice">¥ {{ acce.unitPrice }}</span>
                       <span style="margin-right: 10px" v-show="acce.proportion">比例 {{ acce.proportion }}</span>
                       <span style="margin-right: 10px">{{ acce.accessoryGoods.factoryName }}</span>
                  </span>
                </el-col>
              </el-row>
            </div>
          </div>

          <oms-form-row label="" :span="4">
            <el-button type="primary" @click="addProduct">加入订单</el-button>
          </oms-form-row>
          <div class="product-list-detail">
            <h3 style="background: #13ce66;color: #fff">已选货品</h3>
            <table class="table">
              <thead>
              <tr>
                <th style="width: 300px">货品名称</th>
                <th>货品单价</th>
                <th>货品数量</th>
                <th>金额</th>
                <th>操作</th>
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
                <td class="ar">
                  <span v-show="product.unitPrice">¥</span>{{product.unitPrice}}
                </td>
                <td class="ar">{{product.amount}} <span v-show="product.measurementUnit">（<dict
                  :dict-group="'measurementUnit'"
                  :dict-key="product.measurementUnit"></dict>）</span>
                </td>
                <td class="ar"><span
                  v-show="product.unitPrice">¥</span>{{ product.amount * product.unitPrice | formatMoney }}
                </td>
                <td><a href="#" @click.prevent="remove(product)" v-show="!product.isCombination"><i
                  class="oms-font oms-font-delete"></i> 删除</a></td>
              </tr>
              <tr>
                <td colspan="3"></td>
                <td colspan="2"><span style="color: #333;font-weight: 700" v-show="form.detailDtoList.length">合计:</span><span
                  v-show="form.detailDtoList.length">   ¥{{ totalMoney | formatMoney }}</span></td>
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
  import { erpOrder, LogisticsCenter, http, Address, BaseInfo, cerpAction } from '@/resources';
  import utils from '@/tools/utils';

  export default {
    name: 'addForm',
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
      }
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
        accessoryList: [], // 组合货品列表
        searchProductList: [],
        filterProductList: [],
        form: {
          'orgId': '',
          'customerId': '',
          'bizType': '1',
          'type': this.type,
          'logisticsProviderId': '',
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
          'remark': ''
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
            {required: true, message: '请选择POV', trigger: 'change'}
          ],
          transportationMeansId: [
            {required: true, message: '请选择物流方式', trigger: 'change'}
          ],
          transportationAddress: [
            {required: true, message: '请输入提货地址', trigger: 'blur'}
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
          {name: '添加货品', key: 1}
        ],
        orgList: [],
        customerList: [],
        logisticsList: [],
        goodsList: {},
        relationList: [],
        LogisticsCenter: [],
        doing: false,
        isSupplierOrOrg: false, // 是不是货主或业务单位
        saveKey: 'inSaleOrderForm',
        isStorageData: true, // 判断是不是缓存数据
        showContent: {
          isShowOtherContent: true, // 是否显示物流类型
          isShowSupplierId: true, // 是否显示来源单位
          expectedTimeLabel: '预计入库时间'
        },
        currentTransportationMeans: []
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
      defaultIndex () {
        this.isStorageData = false;
        this.index = 0;
        this.idNotify = true;
        let user = this.$store.state.user;
        this.form.orgId = user.userCompanyAddress;
        this.filterOrg();
        this.filterLogistics();
        this.searchProduct();
        this.checkLicence(this.form.orgId, '货主');
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
        this.$refs['orderAddForm'].resetFields();
        this.$refs['orderGoodsAddForm'].resetFields();
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
        let params = Object.assign({}, {
          keyWord: query
        });
        cerpAction.queryAllPov(params).then(res => {
          this.orgList = res.data.list;
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
          this.form.transportationAddress = '';
        }
        if (this.form.transportationMeansId === '2') {
          this.orgList.forEach(item => {
            if (val === item.id) {
              Address.queryAddress(val, {deleteFlag: false, orgId: val, auditedStatus: '1'}).then(res => {
                let defaultStore = res.data.filter(item => item.default);
                if (defaultStore.length) {
                  let address = utils.formatAddress(defaultStore[0].province, defaultStore[0].city, defaultStore[0].region).split('/').join('');
                  this.form.transportationAddress = address + defaultStore[0].detail;
                }
              });
            }
          });
        }
        this.checkLicence(val, '来源单位');
      },
      changeTransportationMeans: function () {// 物流方式改变
        if (!this.isStorageData) {// 当有缓存时，不做清空操作
          this.form.transportationAddress = '';
          this.form.logisticsProviderId = '';
          this.form.supplierId = '';
        }
      },
      checkLicence: function (val, name) {// 校验单位和货主证照是否过期
        if (!val || !this.action) return;
        http.get('order-licence/org/' + val + '/overdue').then(res => {
          if (!res.data.length) return;
          let msg = '';
          res.data.forEach(item => {
            msg += '"' + item.name + '",';
          });
          msg = msg.substring(0, msg.length - 1);
          this.$notify({
            duration: 2000,
            title: '证照信息过期',
            message: name + msg + '证照信息已过期,无法创建订单',
            type: 'error'
          });
        });
      },
      searchProduct: function (query) {
        let params = {
          orgId: this.form.orgId,
          keyWord: query
        };
        http.get('org/goods/valid', {params: params}).then(res => {
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
            this.product.unitPrice = utils.autoformatDecimalPoint(item.orgGoodsDto.unitPrice.toString());
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
      },
      addProduct: function () {// 货品加入到订单
        if (!this.product.orgGoodsId) {
          this.$notify.info({
            duration: 2000,
            message: '请先选择产品'
          });
          return false;
        }
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
                  unitPrice: m.unitPrice,
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
      onSubmit: function () {// 提交表单
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
            delete item.fixInfo;
            delete item.mainOrgId;
            delete item.isCombination;
          });
          this.doing = true;
          if (saveData.bizType > 1) saveData.supplierId = saveData.orgId;
          erpOrder.save(saveData).then(res => {
            this.resetForm();
            this.$notify({
              duration: 2000,
              message: '新增订单成功',
              type: 'success'
            });
            self.$emit('change', res.data);
            window.localStorage.removeItem(this.saveKey);
            this.$nextTick(() => {
              this.doing = false;
              this.$emit('close');
            });
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '新增订单失败',
              message: error.response.data.msg,
              type: 'error'
            });
          });
        });
      }
    }
  };
</script>
