<style lang="scss" scoped>
@import "../../../assets/mixins.scss";

$leftWidth: 220px;

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
  text-align: center;
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
        <h2 class="clearfix right-title" style="font-size: 16px">{{ index === 2 ? '编辑' : '新增' }}分货申请单</h2>
        <ul>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button :disabled="doing" type="success" @click="onSubmit">保存申请单</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content show-content">
          <el-form ref="orderAddForm" :model="form" :rules="rules" label-width="160px" onsubmit="return false"
                   style="padding-right: 20px" @submit.prevent="onSubmit">
            <el-form-item label="订单类型" prop="type">
              <el-radio-group v-model.number="form.type" @change="changeType">
                <el-radio v-for="item in vaccineTypeList" :key="item.key" :label="item.key">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="要货单位" prop="povId">
              <el-select v-model="form.povId" :clearable="true" :remote-method="filterPOV" filterable placeholder="请输入名称搜索要货单位"
                         popper-class="good-selects" remote
                         @change="povChange">
                <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                  </div>
                  <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="要货单位仓库" prop="warehouseId">
              <el-select v-model="form.warehouseId" clearable filterable placeholder="请选择要货单位仓库">
                <!--<el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in warehouses">-->
                <!--</el-option>-->
                <el-option v-for="item in warehouses" :key="item.id" :label="filterAddressLabel(item)"
                           :value="item.id">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="到货需求日期" prop="demandTime">
              <el-date-picker
                v-model="form.demandTime"
                :picker-options="pickerOptions0" format="yyyy-MM-dd"
                placeholder="请选择到货需求日期"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
            <material-part v-if="form.type === 0" @changeRemark="changeRemark"></material-part>
            <el-form-item class="clearfix" label="备注">
              <oms-input v-model="form.remark" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入备注信息"
                         type="textarea"></oms-input>
            </el-form-item>
          </el-form>

          <el-form ref="orderGoodsForm" :model="product" :rules="goodsRules" label-width="160px"
                   onsubmit="return false"
                   style="padding-right: 20px" @submit.prevent="onSubmit">
            <el-form-item label="疫苗">
              <el-select v-model="product.orgGoodsId" :clearable="true" :filter-method="filterGoods" :loading="loading"
                         filterable
                         placeholder="请输入名称搜索产品" popper-class="good-selects"
                         @change="getGoodDetail">

                <el-option v-for="item in filterProductList" :key="item.id"
                           :label="item.goodsName"
                           :value="item.orgGoodsId">
                  <div>
                    <div>
                      <span class="pull-left">{{item.goodsName}}</span>
                    </div>
                    <div class="clearfix">
                      <span class="select-other-info pull-left"><span
                        v-show="item.goodsNo">货主货品编号:</span>{{item.goodsNo}}</span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.sellPrice">销售价格:￥{{ item.sellPrice
                        }}</span>
                        </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.factoryName">生产单位:</span>{{ item.factoryName }}</span>
                      <!--<span class="select-other-info pull-left" v-if="item.orgGoodsDto.goodsDto">-->
                      <!--<span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}-->
                      <!--</span>-->
                    </div>
                    <!--<el-tag type="success" v-show="item.list.length"-->
                    <!--style="line-height: 22px;margin-left: 20px;height: 20px">-->
                    <!--组合-->
                    <!--</el-tag>-->
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <div v-show="product.orgGoodsId">
              <el-form-item label="疫苗数量">
                <oms-input v-model.number="product.amount" :min="0" placeholder="请输入申请数量" type="number"
                           @blur="changeNumber">
                  <template slot="append">
                    <dict :dict-group="'measurementUnit'" :dict-key="product.fixInfo.goodsDto.measurementUnit"></dict>
                  </template>
                </oms-input>
              </el-form-item>
              <div class="oms-form order-product-box">
                <div class="product-info-fix clearfix">
                  <el-row>
                    <el-col :span="14">
                      <goods-info-part :product-info="product"></goods-info-part>
                    </el-col>
                    <el-col :span="10">
                      <span v-show="accessoryList.length">【组合疫苗】</span>
                      <span v-for="acce in accessoryList" style="display: block;font-size: 12px">
                       <span style="margin-right: 10px">{{acce.name}}</span>
                       <span v-show="acce.sellPrice"
                             style="margin-right: 10px">销售价格:¥{{ acce.sellPrice | formatMoney}}</span>
                       <span v-show="acce.proportion" style="margin-right: 10px">比例:{{ acce.proportion }}</span>
                       <span style="margin-right: 10px">{{ acce.salesFirmName }}</span>
                  </span>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <oms-form-row :span="4" label="">
                <el-button type="primary" @click="addProduct">添加疫苗</el-button>
              </oms-form-row>
            </div>

          </el-form>
          <div class="product-list-detail">
            <h3 style="background: #13ce66;color: #fff">已选疫苗</h3>
            <table class="table">
              <thead>
              <tr>
                <th style="width: 240px">疫苗名称</th>
                <th>规格</th>
                <th>单价</th>
                <th>申请数量</th>
                <th>申请金额</th>
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
                <td>
                  <span v-if="product.orgGoodsDto">{{ product.orgGoodsDto.goodsDto.specifications }}</span>
                  <span v-else-if="product.fixInfo">{{ product.fixInfo.goodsDto.specifications }}</span>
                  <span v-else>{{ product.specification }}</span>
                </td>
                <td class="ar">
                  <span v-if=" Number(product.unitPrice)">¥{{product.unitPrice | formatMoney}}</span>
                  <span v-if=" !Number(product.unitPrice)">-</span>
                </td>
                <td class="ar">{{product.amount}} <span v-show="product.measurementUnit">（<dict
                  :dict-group="'measurementUnit'"
                  :dict-key="product.measurementUnit"></dict>）</span>
                </td>
                <td class="ar">
                  <span v-if="Number(product.unitPrice)">¥{{ product.amount * product.unitPrice | formatMoney }}</span>
                  <span v-if=" !Number(product.unitPrice)">-</span>
                </td>
                <td class="goods-btn">
                  <div>
                    <a v-show="!product.isCombination" href="#" @click.prevent="editItem(product)"><i
                      class="el-icon-t-edit"></i> 编辑</a>
                  </div>
                  <a v-show="!product.isCombination" href="#" @click.prevent="remove(product)">
                    <i class="el-icon-t-delete"></i> 删除</a>
                </td>
              </tr>
              <tr>
                <td align="right" colspan="3">
                  <total-count :list="form.detailDtoList" property="amount"></total-count>
                </td>
                <td colspan="2">
                  <span v-show="form.detailDtoList.length &&  Number(totalMoney)" style="color: #333;font-weight: 700">合计:  ¥{{ totalMoney | formatMoney
                    }}
                  </span>
                </td>
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
import {Address, BaseInfo, cerpAction, http, pullSignal, VaccineRights} from '@/resources';
import utils from '@/tools/utils';
import materialPart from '@/components/sale/order/material.vue';
import addGoodsMixin from '@/mixins/addGoodsMixin';
import moment from 'dayjs';

export default {
  name: 'addForm',
  loading: false,
  components: {materialPart},
  mixins: [addGoodsMixin],
  props: {
    index: Number,
    currentOrder: Object
  },
  data: function () {
    return {
      warehouseTypeList: this.$store.state.warehouseType,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < moment().subtract(1, 'days');
        }
      },
      loading: false,
      product: {
        'amount': '',
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
      currentList: [],
      warehouses: [],
      cdcs: [],
      showCdcs: [],
      form: {
        detailDtoList: [],
        remark: '',
        warehouseId: '',
        povId: '',
        demandTime: '',
        cdcId: '',
        type: ''
      },
      rules: {
        warehouseId: [
          {required: true, message: '请选择要货单位仓库', trigger: 'change'}
        ],
        type: [
          {required: true, type: 'number', message: '请选择疫苗种类', trigger: 'change'}
        ],
        povId: [
          {required: true, message: '请选择要货单位', trigger: 'change'}
        ],
        demandTime: [
          {required: true, message: '请选择到货需求日期', trigger: 'change'}
        ]
      },
      goodsRules: {
        orgGoodsId: [
          {required: true, message: '请选择疫苗', trigger: 'change'}
        ],
        amount: [
          {required: true, type: 'number', message: '请输入数量', trigger: 'blur'}
        ]

      },
      changeTotalNumber: utils.changeTipTotalNumber,
      isCheckPackage: utils.isCheckPackage,
      requestTime: '',
      doing: false,
      orgList: [],
      totalFilterProductList: []
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
    },
    vaccineTypeList() {
      return this.$store.state.vaccineType;
    }
  },
  watch: {
    index(val) {
      if (!val) return;
      this.form = {
        detailDtoList: [],
        remark: '',
        warehouseId: '',
        povId: '',
        demandTime: '',
        cdcId: '',
        type: ''
      };
      // this.searchWarehouses();
      // this.queryOnCDCs();
      this.currentList = [];
      if (val === 2) {
        this.editOrderInfo();
      } else if (val === 3) {
        this.addOrderInfo();
      } else {
        this.filterPOV();
        this.resetForm();
        this.form.id = null;
      }
    }
  },
  methods: {
    filterGoods(query) {
      this.filterProductList = this.totalFilterProductList.filter(f => f.orgGoodsNameAcronymy.indexOf(query) !== -1 ||
        f.goodsName.indexOf(query) !== -1 || f.goodsNo.indexOf(query) !== -1 || f.orgGoodsNamePhonetic.indexOf(query) !== -1);
    },
    filterAddressLabel(item) {
      let name = item.name ? '【' + item.name + '】' : '';
      return name + item.detail;
    },
    getWarehouseAdress: function (item) { // 得到仓库地址
      return item.detail + `（${this.warehouseTypeList[item.warehouseType].label}）`;
    },
    editOrderInfo() {
      pullSignal.get(this.currentOrder.id).then(res => {
        let currentOrder = res.data;
        let orgDetailGoods = currentOrder.detailDtoList.map(m => {
          return {
            amount: m.applyCount,
            measurementUnit: m.unit,
            orgGoodsId: m.orgGoodsId,
            orgGoodsName: m.goodsName,
            unitPrice: m.price,
            specification: m.specification,
            expirationDate: m.expirationDate
          };
        });
        this.orgList.push({
          subordinateId: currentOrder.povId,
          subordinateName: currentOrder.povName
        });
        this.form.povId = currentOrder.povId;
        // ******2.0变化
        this.filterPOV(currentOrder.povName);
        this.povChange(currentOrder.povId, true);
        this.form = {
          id: currentOrder.id,
          povId: currentOrder.povId,
          demandTime: currentOrder.demandTime,
          type: Number(currentOrder.goodsType),
          warehouseId: currentOrder.warehouseId,
          detailDtoList: []
        };
        // ******
        this.$nextTick(() => {
          this.form.detailDtoList = orgDetailGoods;
        });
//        this.form = JSON.parse(JSON.stringify(currentOrder));
      });
    },
    addOrderInfo() {
      let orgDetailGoods = this.currentOrder.detailDtoList.map(m => {
        return {
          amount: m.applyCount,
          measurementUnit: m.unit,
          orgGoodsId: m.orgGoodsId,
          orgGoodsName: m.goodsName,
          unitPrice: m.price,
          expirationDate: m.expirationDate
        };
      });
      this.orgList.push({
        subordinateId: this.currentOrder.povId,
        subordinateName: this.currentOrder.povName
      });
      this.form = {
        povId: this.currentOrder.povId,
        demandTime: this.currentOrder.demandTime,
        type: Number(this.currentOrder.goodsType),
        warehouseId: this.currentOrder.warehouseId,
        detailDtoList: []
      };
      this.changeType();
      this.$nextTick(() => {
        this.form.detailDtoList = orgDetailGoods;
      });
//        this.form = JSON.parse(JSON.stringify(this.currentOrder));
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
    changeTime: function (date) {// 格式化时间
      this.form.demandTime = date ? this.$moment(date).format('YYYY-MM-DD') : '';
    },
    changeType() {
      this.product = {
        'amount': null,
        'measurementUnit': '',
        'orgGoodsId': '',
        'packingCount': null,
        'specificationsId': '',
        'fixInfo': {
          'goodsDto': {}
        },
        'unitPrice': null
      };
      this.accessoryList = [];
      this.currentList = [];
      this.form.detailDtoList = [];
      this.$refs['orderGoodsForm'].resetFields();
      this.filterProduct();
      this.searchProduct();
    },
    povChange(val, isEdited) {
      this.product = {
        'amount': null,
        'measurementUnit': '',
        'orgGoodsId': '',
        'packingCount': null,
        'specificationsId': '',
        'fixInfo': {
          'goodsDto': {}
        },
        'unitPrice': null
      };
      this.accessoryList = [];
      this.currentList = [];
      this.warehouses = [];
      this.form.warehouseId = '';
      this.form.detailDtoList = [];
      this.$refs['orderGoodsForm'].resetFields();
      if (!val) {
        return;
      }
      this.searchProduct();
      this.searchWarehouses(val, isEdited);
    },
    searchProduct: function () {
      this.searchProductList = [];
      if (!this.form.povId || !Number.isInteger(this.form.type)) return;
      let rTime = Date.now();
      this.requestTime = rTime;
      VaccineRights.queryVaccineByPov(this.form.povId,
        {
          cdcId: this.$store.state.user.userCompanyAddress,
          vaccineType: this.form.type + 1
        }
      ).then(res => {
        if (this.requestTime > rTime) {
          return;
        }
        this.searchProductList = res.data;
        this.$nextTick(() => {
          this.filterProducts();
        });
      });
    },
    filterPOV: function (query) {// 过滤POV
      // let params = Object.assign({}, {
      //   keyWord: query
      // });
      // cerpAction.queryAllPov(params).then(res => {
      //   this.orgList = res.data.list;
      // });
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) return;
      let params = {
        keyWord: query,
        relation: '2'
      };
      BaseInfo.queryOrgByAllRelation(orgId, params).then(res => {
        this.orgList = res.data;
      });
    },
    queryOnCDCs() {
      cerpAction.queryOnCDCs().then(res => {
        this.cdcs = res.data;
        this.filterProduct();
        this.searchProduct();
      });
    },
    filterProduct() {
      this.showCdcs = this.cdcs.filter(f => f.level === this.type);
      this.form.cdcId = this.showCdcs.length ? this.showCdcs[0].orgId : '';
    },
    searchWarehouses(val, isEdited) {
      Address.queryAddress(this.form.povId, {
        deleteFlag: false,
        orgId: this.form.povId,
        auditedStatus: '1',
        status: 0
      }).then(res => {
        this.warehouses = res.data || [];
        if (isEdited) return;
        let defaultStore = res.data.find(item => item.default);
        if (!defaultStore) return;
        this.form.warehouseId = defaultStore.id;
      });
    },
    filterProducts: function () {
      let arr = [];
      let isIn;
      this.searchProductList.forEach(item => {
        isIn = false;
        this.form.detailDtoList.forEach(product => {
          if (product.orgGoodsId === item.orgGoodsId) {
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
      // this.totalFilterProductList = arr.filter(f => f.goodsTypeId === this.type.toString());
      this.totalFilterProductList = arr;
      this.filterProductList = JSON.parse(JSON.stringify(this.totalFilterProductList));
    },
    getGoodDetail: function (OrgGoodsId) {// 选疫苗
      if (!OrgGoodsId) {
        this.product = {
          'amount': null,
          'measurementUnit': '',
          'orgGoodsId': '',
          'packingCount': null,
          'specificationsId': '',
          'fixInfo': {
            'goodsDto': {}
          },
          'unitPrice': null
        };
        this.$refs['orderGoodsForm'].resetFields();
        this.accessoryList = [];
        this.currentList = [];
        return;
      }
      // 清空当前选择疫苗列表
      this.currentList = [];
      http.get('/org/goods/' + OrgGoodsId).then(res => {
        this.currentList.push(res.data);

        this.currentList.forEach(item => {
          if (item.orgGoodsDto.id === OrgGoodsId) {
            this.product.fixInfo = item.orgGoodsDto;

            this.product.measurementUnit = item.orgGoodsDto.goodsDto.measurementUnit;
            this.accessoryList = item.list;
            this.form.detailDtoList.forEach((detailItem) => {
              if (detailItem.orgGoodsId === OrgGoodsId) {
                detailItem.fixInfo = item.orgGoodsDto;
                return false;
              }
            });
            this.isCheckPackage(this.product.fixInfo.goodsDto.smallPacking);
          }
        });
      });
    },
    addProduct: function () {// 疫苗加入到订单
      if (!this.product.orgGoodsId) {
        this.$notify.info({
          message: '请选择疫苗'
        });
        return;
      }
      if (!this.product.amount) {
        this.$notify.info({
          message: '请输入疫苗数量'
        });
        return;
      }
      let isCheck = this.isCheckPackage(this.product.fixInfo.goodsDto.smallPacking);
      if (!isCheck) return;
      let ary = this.filterProductList.filter(f => f.orgGoodsId === this.product.orgGoodsId);
      let currentObj = ary.length > 0 ? ary[0] : '0';
      this.currentList.forEach((item) => {
        if (this.product.orgGoodsId === item.orgGoodsDto.id) {
          this.product.orgGoodsName = item.orgGoodsDto.name;
          let sellPrice = currentObj.sellPrice;
          this.product.unitPrice = utils.autoformatDecimalPoint(sellPrice ? sellPrice.toString() : '');
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
              specification: m.accessoryGoods.specifications,
              specificationsId: ''
            });
          });
        }
      });
      this.searchProduct();
      this.$nextTick(() => {
        this.product = {
          'amount': null,
          'measurementUnit': '',
          'orgGoodsId': '',
          'packingCount': null,
          'specificationsId': '',
          'fixInfo': {
            'goodsDto': {}
          },
          'unitPrice': null
        };
        this.$refs['orderGoodsForm'].resetFields();
        this.accessoryList = [];
        this.currentList = [];
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
      this.filterProductList.push({
        orgGoodsId: item.orgGoodsId,
        goodsName: item.orgGoodsName
      });
      this.product.orgGoodsId = item.orgGoodsId;
      this.product.amount = item.amount;
      this.product.fixInfo = item.orgGoodsDto || item.fixInfo;
      // 2.0变化
      this.deleteItem(item);
      this.searchProduct(item.orgGoodsName);
      this.getGoodDetail(item.orgGoodsId);
    },
    onSubmit: function () {// 提交表单
      let self = this;
      // this.changeTime(this.form.demandTime);
      this.$refs['orderAddForm'].validate((valid) => {
        if (!valid || this.doing) {
          return false;
        }
        let saveData = JSON.parse(JSON.stringify(self.form));
        if (saveData.detailDtoList.length === 0) {
          this.$notify({
            duration: 2000,
            message: '请添加疫苗',
            type: 'warning'
          });
          return false;
        }
        // 传给后台疫苗标志
        saveData.goodsType = saveData.type;
        delete saveData.type;
        saveData.detailDtoList.forEach(item => {
          item.price = item.unitPrice;
          item.applyCount = item.amount;
          item.isCombination && (item.combinationSign = 1);
          delete item.fixInfo;
          delete item.mainOrgId;
          delete item.isCombination;
          delete item.unitPrice;
          delete item.specificationsId;
          delete item.packingCount;
          delete item.orgGoodsName;
          delete item.measurementUnit;
          delete item.amount;
        });
        this.doing = true;

        if (saveData.id) {
          pullSignal.update(saveData.id, saveData).then(res => {
            this.$notify({
              duration: 2000,
              message: '编辑分货申请单成功',
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
              title: '编辑分货申请单失败',
              message: error.response && error.response.data && error.response.data.msg || '网络异常',
              type: 'error'
            });
          });
        } else {
          http.post('/pull-signal/cdc', saveData).then(res => {
            this.$notify({
              duration: 2000,
              message: '新增分货申请单成功',
              type: 'success'
            });
            self.$emit('change', res.data);
            this.doing = false;
            this.$emit('close');
            this.resetForm();
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '新增分货申请单失败',
              message: error.response && error.response.data && error.response.data.msg || '网络异常',
              type: 'error'
            });
          });
        }
      });
    },
    resetForm() {
      this.$refs['orderGoodsForm'].resetFields();
      this.$refs['orderAddForm'].resetFields();
      this.form.detailDtoList = [];
      this.currentList = [];
    }
  }
};
</script>
