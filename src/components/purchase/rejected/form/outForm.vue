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
</style>


<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title" style="padding: 0">{{ defaultIndex === 2 ? '编辑采购退货订单' : '新增采购退货订单'}}</h2>
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
        <el-form ref="orderAddForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                 label-width="160px" style="padding-right: 20px">
          <div class="hide-content" v-bind:class="{'show-content' : index==0}">
            <el-form-item label="物流方式" :prop=" showContent.isShowOtherContent?'transportationMeansId':'' "
                          v-show="showContent.isShowOtherContent">
              <el-select type="text" v-model="form.transportationMeansId" placeholder="请选择物流方式"
                         @change="changeTransportationMeans">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in transportationMeansList"
                           v-show="item.key !== '2' || item.key==='2' && form.bizType!=='2' "></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供货厂商" prop="customerId">
              <el-select filterable remote placeholder="请输入关键字搜索供货厂商" :remote-method="filterOrg" :clearable="true"
                         v-model="form.customerId" @change="changeCustomerId">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                    <span class="pull-right" style="color: #999">
                     <dict :dict-group="'orgRelation'" :dict-key="org.relationList[0]"></dict>
                    </span>
                  </div>
                  <div style="overflow: hidden">
                  <span class="select-other-info pull-left">
                    <span>系统代码</span> {{org.manufacturerCode}}
                  </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供货厂商仓库" :prop=" showContent.isShowOtherContent?'transportationAddress':'' "
                          v-show="showContent.isShowOtherContent">
              <el-select placeholder="请选择供货厂商仓库" v-model="form.transportationAddress" filterable clearable
                         @change="changeWarehouseAdress">
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in warehouses">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="实际收货人" v-show="showContent.isShowOtherContent">
              <oms-input type="text" placeholder="请输入实际收货人" v-model="form.actualConsignee"></oms-input>
            </el-form-item>
            <!--<el-form-item label="是否同批号">-->
            <!--<el-switch on-text="是" off-text="否" on-color="#13ce66" off-color="#ff4949"-->
            <!--v-model="form.sameBatchNumber"></el-switch>-->
            <!--</el-form-item>-->
            <el-form-item label="疾控仓库地址" prop="logisticsCentreId">
              <!--<el-select placeholder="请选择物流中心" v-model="form.logisticsCentreId" filterable :clearable="true">-->
              <!--<el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in LogisticsCenter"/>-->
              <!--</el-select>-->
              <el-select placeholder="请选择疾控仓库地址" v-model="form.logisticsCentreId" filterable :clearable="true">
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in LogisticsCenter">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="运输条件" prop="transportationCondition">
              <el-select type="text" placeholder="请选择运输条件" v-model="form.transportationCondition">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in transportationConditionList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否进口">
              <el-switch on-text="是" off-text="否" on-color="#13ce66" off-color="#ff4949"
                         v-model="form.importedFlag"></el-switch>
            </el-form-item>
            <el-form-item :label="'预计出库时间'"
                          :prop=" showContent.isShowOtherContent?'expectedTime':'' "
                          v-show="showContent.isShowOtherContent">
              <el-date-picker
                v-model="form.expectedTime"
                placeholder="请选择日期" format="yyyy-MM-dd"
                @change="changeExpectedTime">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
              <oms-input type="textarea" v-model="form.remark" placeholder="请输入备注信息"
                         :autosize="{ minRows: 2, maxRows: 5}"></oms-input>
            </el-form-item>
            <el-form-item label-width="160px">
              <el-button type="primary" @click="index++">添加货品</el-button>
            </el-form-item>
          </div>
          <div class="hide-content" v-bind:class="{'show-content' : index==1}">

            <div class="oms-form order-product-box">
              <el-form ref="orderGoodsAddForm" :rules="orderGoodsRules" :model="product" label-width="120px">
                <el-form-item label="产品" prop="orgGoodsId">
                  <el-select v-model="product.orgGoodsId" filterable remote placeholder="请输入关键字搜索产品"
                             :remote-method="searchProduct" :clearable="true" :loading="loading"
                             popper-class="order-good-selects"
                             @change="getGoodDetail">
                    <el-option v-for="item in filterProductList" :key="item.orgGoodsDto.id"
                               :label="item.orgGoodsDto.name"
                               :value="item.orgGoodsDto.id">
                      <div style="overflow: hidden">
                        <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                        <el-tag type="success" v-show="item.list.length"
                                style="line-height: 22px;margin-left: 20px;height: 20px">
                          组合
                        </el-tag>
                      </div>
                      <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">货品编号</span>  {{item.orgGoodsDto.goodsNo}}
                        </span>
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.procurementPrice">采购价格 ￥</span>{{ item.orgGoodsDto.procurementPrice
                          }}
                        </span>
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.salesFirmName">供货厂商</span>  {{ item.orgGoodsDto.salesFirmName }}
                        </span>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="产品数量" class="productItem-info" :prop=" batchNumbers.length ? '' : 'amount' "
                              v-show="batchNumbers.length === 0 ">
                  <oms-input type="number" v-model.number="product.amount" :min="0">
                    <template slot="append" style="width: 30px">
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
                    <oms-row label="供货厂商" :span="8">
                      {{product.fixInfo.salesFirmName}}
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
                       <span style="margin-right: 10px"
                             v-show="acce.procurementPrice">¥ {{ acce.procurementPrice | formatMoney }}</span>
                             <span style="margin-right: 10px" v-show="acce.proportion">比例 {{ acce.proportion }}</span>
                             <span style="margin-right: 10px">{{ acce.salesFirmName }}</span>
                    </span>
                  </el-col>
                </el-row>
              </div>
            </div>

            <!--<span v-show="batchNumbers.length" style="font-weight: 600">批号信息</span>-->
            <div class="product-list-detail" v-for="item in batchNumbers">
              <h3>批号信息</h3>
              <table class="table">
                <thead>
                <tr>
                  <th>
                    <el-checkbox @change="checkItemAll(item)" v-model="item.isCheckedAll"></el-checkbox>
                  </th>
                  <th>产品数量</th>
                  <th>批号</th>
                  <th>仓库数量</th>
                  <th>生产日期</th>
                  <th>有效期</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for=" batchNumber in item.lots">
                  <td>
                    <el-checkbox v-model="batchNumber.isChecked"></el-checkbox>
                  </td>
                  <td>
                    <el-input style="width:160px" type="number" v-model.number="batchNumber.productCount" :min="0"
                              @change="isChangeValue(batchNumber)">
                      <template slot="append">
                        <dict :dict-group="'measurementUnit'"
                              :dict-key="product.fixInfo.goodsDto.measurementUnit"></dict>
                      </template>
                    </el-input>
                  </td>
                  <td>{{ batchNumber.no }}</td>
                  <td>{{ batchNumber.count }}</td>
                  <td>{{ batchNumber.productionDate | date }}</td>
                  <td>{{ batchNumber.expirationDate | date }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <oms-form-row label-width="160px" :span="4" :label="''">
              <el-button type="primary" @click="addProduct">加入订单</el-button>
            </oms-form-row>
            <div class="product-list-detail">
              <h3 style="background: #13ce66;color: #fff">已选货品</h3>
              <table class="table">
                <thead>
                <tr>
                  <th style="width: 300px">货品名称</th>
                  <th>批号</th>
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
                    <span v-show="!product.isCombination">{{product.orgGoodsName}}</span>
                  </td>
                  <td>{{ product.no ? product.no : '无' }}</td>
                  <td class="ar">
                    <span v-show="product.unitPrice">¥ {{product.unitPrice | formatMoney}}</span>
                  </td>
                  <td class="ar">{{product.amount}} <span v-show="product.measurementUnit">（<dict
                    :dict-group="'measurementUnit'"
                    :dict-key="product.measurementUnit"></dict>）</span>
                  </td>
                  <td class="ar"><span
                    v-show="product.unitPrice">¥{{ product.amount * product.unitPrice | formatMoney }}</span>
                    <span v-if="!product.unitPrice">-</span>
                  </td>
                  <td>
                    <div v-show="defaultIndex === 2">
                      <a href="#" @click.prevent="editItem(product)" v-show="!product.isCombination"><i
                        class="iconfont icon-edit"></i> 编辑</a>
                    </div>
                    <div>
                      <a href="#" @click.prevent="remove(product)" v-show="!product.isCombination"><i
                        class="iconfont icon-delete"></i> 删除</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colspan="4"></td>
                  <td colspan="2"><span style="color: #333;font-weight: 700"
                                        v-show="form.detailDtoList.length">合计:</span><span
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
  import { erpOrder, LogisticsCenter, http, Address, BaseInfo, InWork } from '@/resources';
  import utils from '@/tools/utils';

  export default {
    name: 'addForm',
    loading: false,
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
          transportationMeansId: '',
          transportationAddress: '',
          importedFlag: false,
          orgRelation: '',
          logisticsCentreId: '',
          sameBatchNumber: false,
          actualConsignee: '',
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
            {required: true, message: '请选择供货厂商', trigger: 'change'}
          ],
          bizType: [
            {required: true, message: '请选择业务类型', trigger: 'change'}
          ],
          transportationMeansId: [
            {required: true, message: '请选择物流方式', trigger: 'change'}
          ],
          transportationAddress: [
            {required: true, message: '请选择去向地址', trigger: 'blur'}
          ],
          logisticsProviderId: [
            {required: true, message: '请选择物流商', trigger: 'change'}
          ],
          logisticsCentreId: [
            {required: true, message: '请选择疾控仓库地址', trigger: 'change'}
          ],
          transportationCondition: [
            {required: true, message: '请选择运输条件', trigger: 'blur'}
          ],
          expectedTime: [
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
          {name: '添加货品', key: 1}
        ],
        orgList: [],
        customerList: [],
        logisticsList: [],
        goodsList: {},
        relationList: [],
        LogisticsCenter: [],
        doing: false,
        isSupplierOrOrg: false,
        saveKey: 'outSalesOrderForm',
        isStorageData: true, // 判断是不是缓存数据
        showContent: {
          isShowOtherContent: true, // 是否显示物流类型
          isShowCustomerId: true, // 是否显示供货厂商
          expectedTimeLabel: '预计出库时间'
        },
        warehouses: [], // 供货厂商仓库列表
        batchNumbers: [], // 货品批号列表
        selectBatchNumbers: [] // 已经选择的货品批号
      };
    },
    computed: {
      bizTypeList () {
        return this.$store.state.dict['bizOutType'];
      },
      transportationMeansList () {
        return this.$store.state.dict['outTransportMeans'];
      },
      transportationConditionList () {
        return this.$store.state.dict['transportationCondition'];
      },
      shipmentPackingUnit () {
        return this.$store.state.dict['shipmentPackingUnit'];
      },
      measurementUnitList () {
        return this.$store.state.dict['measurementUnit'];
      },
      orgRelationList () {
        return this.$store.state.dict['orgRelation'];
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
      defaultIndex (val) {
        this.isStorageData = false;
        this.index = 0;
        this.idNotify = true;
        let user = this.$store.state.user;
        this.form.orgId = user.userCompanyAddress;
        this.searchProduct();
        this.filterOrg();
        this.checkLicence(this.form.orgId);
        if (val === 2) {
          this.editOrderInfo();
        } else {
          this.resetForm();
        }
        this.filterAddress();
      },
      form: {
        handler: 'autoSave',
        deep: true
      }
    },

    mounted: function () {
      this.currentPartName = this.productListSet[0].name;
//      this.filterLogisticsCenter();
      let oldForm = window.localStorage.getItem(this.saveKey);
      if (oldForm) {
        this.form = Object.assign({}, this.form, JSON.parse(oldForm));
//        this.form.logisticsCentreId = this.form.logisticsCentreId
//          ? this.form.logisticsCentreId : window.localStorage.getItem('logisticsCentreId');
      }
    },
    methods: {
      autoSave: function () {
        if (!this.form.id) {
          window.localStorage.setItem(this.saveKey, JSON.stringify(this.form));
        }
      },
      resetForm: function () {// 重置表单
        this.$refs['orderAddForm'].resetFields();
        this.$refs['orderGoodsAddForm'].resetFields();
        this.form.actualConsignee = '';
        this.form.logisticsProviderId = '';
        this.form.remark = '';
        this.form.detailDtoList = [];
        this.form.customerId = '';
        this.form.transportationAddress = '';
        this.form.actualConsignee = '';
        this.form.logisticsCentreId = '';
      },
      editOrderInfo () {
        if (!this.orderId) return;
        InWork.queryOrderDetail(this.orderId).then(res => {
          this.resetForm();
          this.isStorageData = true;
          res.data.detailDtoList.forEach(f => {
            f.orgGoodsName = f.name;
            f.no = f.batchNumber;
          });
          this.form = JSON.parse(JSON.stringify(res.data));
          this.$nextTick(() => {
            this.isStorageData = true;
          });
        });
      },
      formatPrice () {// 格式化单价，保留两位小数
        this.product.unitPrice = utils.autoformatDecimalPoint(this.product.unitPrice);
      },
      changeExpectedTime: function (date) {// 格式化日期
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
      filterOrg: function (query) {// 过滤POV
        let orgId = this.form.orgId;
        let bizType = this.form.bizType;
        if (!orgId || !bizType) {
          this.orgList = [];
          this.form.customerId = '';
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
          case '0' : {
            this.showContent = {
              isShowOtherContent: true, // 是否显示物流类型
              isShowCustomerId: true, // 是否显示POV
              expectedTimeLabel: '预计出库时间'
            };
            this.filterOrg();
            break;
          }
          case '1' : {
            this.showContent = {
              isShowOtherContent: true, // 是否显示物流类型
              isShowCustomerId: true, // 是否显示POV
              expectedTimeLabel: '预计出库时间'
            };
            this.filterOrg();
            break;
          }
          case '2' : {
            this.showContent = {
              isShowOtherContent: false, // 是否显示物流类型
              isShowCustomerId: false, // 是否显示POV
              expectedTimeLabel: ''
            };
            break;
          }
          case '3' : {
            this.showContent = {
              isShowOtherContent: true, // 是否显示物流类型
              isShowCustomerId: false, // 是否显示POV
              expectedTimeLabel: '预计出库时间'
            };
            Address.queryAddress(this.form.orgId, {deleteFlag: false, orgId: this.form.orgId}).then(res => {
              this.warehouses = res.data;
            });
            break;
          }
        }
      },
      changeTransportationMeans (val) {// 物流方式改变时
        switch (val) {
          case '0': {
            this.showContent.expectedTimeLabel = '预计送货时间';
            if (this.form.bizType === '1') {
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
        if (this.form.bizType === '2') {
          this.showContent.expectedTimeLabel = '';
        }
      },
      changeCustomerId (val) {// POV改变时
        if (!this.isStorageData) {// 当有缓存时，不做清空操作
          this.product.orgGoodsId = '';
          this.form.detailDtoList = [];
        }
        this.checkLicence(val);
        this.searchWarehouses(val);
        this.searchProduct();
      },
      searchWarehouses (orgId) {
        if (!orgId) {
          this.warehouses = [];
          this.form.transportationAddress = '';
          return;
        }
        Address.queryAddress(orgId, {deleteFlag: false, orgId: orgId}).then(res => {
          this.warehouses = res.data || [];
          let fs = this.warehouses.filter(i => i.default)[0];
          this.form.transportationAddress = fs && fs.id || '';
        });
      },
      changeWarehouseAdress: function (val) {
        if (!this.isStorageData) {// 当有缓存时，不做清空操作
          this.form.actualConsignee = ''; // 仓库改变时, 设置实际收货人
        }
        this.warehouses.forEach(item => {
          if (val === item.id) {
            this.form.actualConsignee = item.contact;
          }
        });
      },
      getWarehouseAdress: function (item) { // 得到仓库地址
        return utils.formatAddress(item.province, item.city, item.region).split('/').join('') + item.detail;
      },
      filterAddress () {
        Address.queryAddress(this.form.orgId, {
          deleteFlag: false,
          orgId: this.form.orgId,
          auditedStatus: '1'
        }).then(res => {
          this.LogisticsCenter = res.data;
          let defaultStore = res.data.filter(item => item.default);
          this.form.logisticsCentreId = defaultStore.length ? defaultStore[0].id : '';
        });
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
        if (!this.form.customerId) {
          this.searchProductList = [];
          return;
        }
        let params = {
          keyWord: query
        };
        http.get(`purchase-agreement/${this.form.customerId}/valid/org-goods`, {params: params}).then(res => {
          this.searchProductList = res.data.list;
          this.$nextTick(function () {
            this.filterProducts();
          });
        });
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
          this.batchNumbers = [];
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

        this.queryBatchNumers();
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
      queryBatchNumers () { // 查询货品批次信息
        let params = {
          goodsId: this.product.fixInfo.goodsId,
          orgId: this.form.orgId,
          orgGoodsId: this.product.orgGoodsId
        };
        http.get('/stock-batch/valid/batch', {params}).then(res => {
          if (res.data.length) {
            res.data.forEach(f => {
              f.isChecked = false;
              f.productCount = '';
            });
            this.batchNumbers.push({
              id: this.product.fixInfo.id,
              mainId: this.product.fixInfo.id,
              name: this.product.fixInfo.name,
              isCheckedAll: false,
              lots: []
            });
            this.batchNumbers[0].lots = res.data || [];
          }
        });
      },
      isChangeValue (item) {
        if (item.productCount > item.count) {
          this.$notify.warning({
            duration: 2000,
            message: '输入的产品数量大于仓库数量'
          });
        }
        item.isChecked = item.productCount > 0;
      },
      isShowName (item) {
        let index = this.form.detailDtoList.indexOf(item);
        if (index === 0) {
          return true;
        }
        if (item.mainOrgId) {
          return true;
        }
        let isShow = true;
        let t = this.form.detailDtoList[index - 1];

        if (t.mainOrgId) {
          isShow = true;
        } else {
          isShow = false;
        }
        return isShow;
      },
      checkItemAll (item) {
        item.lots.forEach(l => {
          l.isChecked = item.isCheckedAll;
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
        if (this.batchNumbers.length) {
          let isChecked = this.batchNumbers.every(item => item.lots.some(l => l.isChecked));
          if (!isChecked) {
            this.$notify.info({
              duration: 2000,
              message: '请选择货品批号'
            });
            return false;
          }
          if (this.form.sameBatchNumber) {
            let seleteNumber = 0;
            this.batchNumbers.forEach(i => {
              i.lots.forEach(l => {
                if (l.isChecked) {
                  seleteNumber++;
                }
              });
            });
            if (seleteNumber > 1) {
              this.$notify.info({
                duration: 2000,
                message: '请选择单个批号'
              });
              return false;
            }
          }
          let isHaveCount = this.batchNumbers.some(item => item.lots.some(l => l.isChecked && !l.productCount));
          if (isHaveCount) {
            this.$notify.info({
              duration: 2000,
              message: '请填写产品数量'
            });
            return false;
          }
          let isOver = this.batchNumbers.some(item => item.lots.some(l => l.isChecked && (l.productCount > l.count)));
          if (isOver) {
            this.$notify.warning({
              duration: 2000,
              message: '输入的产品数量大于仓库数量'
            });
            return false;
          }
        }
        this.batchNumbers.forEach(item => {
          let lots = item.lots.filter(l => l.isChecked);
          this.selectBatchNumbers.push({
            id: item.id,
            mainId: item.mainId,
            name: item.name,
            lots: lots
          });
        });
        this.$refs['orderGoodsAddForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.searchProductList.forEach((item) => {
            if (this.product.orgGoodsId === item.orgGoodsDto.id) {
              this.product.orgGoodsName = item.orgGoodsDto.name;
              let totalAmount = 0;
              if (this.batchNumbers.length) {
                this.batchNumbers[0].lots.forEach(item => {
                  if (item.isChecked) {
                    let product = JSON.parse(JSON.stringify(this.product));
                    product.batchNumberId = item.id;
                    product.no = item.no;
                    product.amount = item.productCount;
                    this.form.detailDtoList.push(product);
                    totalAmount += item.productCount;
                  }
                });
              } else {
                this.form.detailDtoList.push(JSON.parse(JSON.stringify(this.product)));
              }
              item.list.forEach(m => {
                let amount = Math.ceil(m.proportion * (totalAmount ? totalAmount : this.product.amount));
                this.form.detailDtoList.push({
                  no: '',
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
                  proportion: m.proportion
                });
              });
            }
          });

          // 批号信息
          this.form.detailDtoList.forEach(item => {
            item.shipmentDtoList = [];
            this.selectBatchNumbers.forEach(bn => {
              if (item.orgGoodsId === bn.id) {
                bn.lots.forEach(ph => {
                  item.shipmentDtoList.push({
                    batchNumberId: ph.batchNumberId,
                    count: ph.count
                  });
                });
              }
            });
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
            this.batchNumbers = [];
          });
        });
      },
      remove: function (item) { // 删除货品
        let orgGoodsId = item.orgGoodsId;
        this.form.detailDtoList.splice(this.form.detailDtoList.indexOf(item), 1); // mainOrgId
        let isDeleteAll = this.form.detailDtoList.some(s => s.orgGoodsId === orgGoodsId);
        if (isDeleteAll) {
          // 找出剩下的货品，重新计算组合货品数量，金额。
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
      onSubmit: function () {// 提交表单

        let self = this;
        this.changeExpectedTime(this.expectedTime);
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
            delete item.proportion;
          });
          this.doing = true;
          if (saveData.bizType > 1) saveData.customerId = saveData.orgId;

          if (saveData.id) {
            erpOrder.updateOrder(saveData.id, saveData).then(res => {
              this.resetForm();
              this.$notify({
                duration: 2000,
                message: '编辑销售订单成功',
                type: 'success'
              });
              self.$emit('change');
              this.$nextTick(() => {
                this.doing = false;
                this.$emit('close');
              });
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
              this.resetForm();
              this.$notify({
                duration: 2000,
                message: '新增销售订单成功',
                type: 'success'
              });
              window.localStorage.removeItem(this.saveKey);
              self.$emit('change', res.data);
              this.$nextTick(() => {
                this.doing = false;
                this.$emit('close');
              });
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
