<style lang="less" scoped>
  @import "../../../assets/mixins.less";

  @leftWidth: 220px;

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



  .ml15 {
    margin-left: 40px;
  }

  .combinatioon-product {
    color: #777
  }

  .productItem-info {
    float: left;
  }

  .good-selects .el-select-dropdown__item {
    width: auto;
  }

  .ar {
    text-align: center;
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
        <h2 class="clearfix right-title" style="font-size: 16px">{{ index === 2 ? '编辑' : '新增' }}分货申请单</h2>
        <ul>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit" :disabled="doing">保存申请单</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content show-content">
          <el-form ref="orderAddForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                   label-width="160px" style="padding-right: 20px">
            <el-form-item label="接种点" prop="povId">
              <el-select filterable remote placeholder="请输入名称搜索接种点" :remote-method="filterPOV" :clearable="true"
                         v-model="form.povId" @change="povChange"
                         popper-class="good-selects">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                  </div>
                  <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码</span> {{org.manufacturerCode}}
                      </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="接种点仓库" prop="warehouseId">
              <el-select placeholder="请选择接种点仓库" v-model="form.warehouseId" filterable clearable>
                <!--<el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in warehouses">-->
                <!--</el-option>-->
                <el-option :label="filterAddressLabel(item)" :value="item.id" :key="item.id"
                           v-for="item in warehouses">
                  <span class="pull-left">{{ item.name }}</span>
                  <span class="pull-right" style="color: #999">{{ getWarehouseAdress(item) }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="到货需求日期" prop="demandTime">
              <el-date-picker
                v-model="form.demandTime"
                placeholder="请选择到货需求日期" format="yyyy-MM-dd"
                :picker-options="pickerOptions0"
                @change="changeTime">
              </el-date-picker>
            </el-form-item>

          </el-form>

          <el-form ref="orderGoodsForm" :rules="goodsRules" :model="product" @submit.prevent="onSubmit"
                   onsubmit="return false"
                   label-width="160px" style="padding-right: 20px">
            <el-form-item label="疫苗">
              <el-select v-model="product.orgGoodsId" filterable :filter-method="filterGoods" placeholder="请输入名称搜索产品"
                         :clearable="true"
                         :loading="loading" popper-class="good-selects"
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
                        v-show="item.goodsNo">货品编号</span>  {{item.goodsNo}}</span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.sellPrice">销售价格 ￥{{ item.sellPrice
                        }}</span>
                        </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.factoryName">供货厂商</span>  {{ item.factoryName }}</span>
                    </div>
                    <!--<el-tag type="success" v-show="item.list.length"-->
                    <!--style="line-height: 22px;margin-left: 20px;height: 20px">-->
                    <!--组合-->
                    <!--</el-tag>-->
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="疫苗数量">
              <oms-input type="number" placeholder="请输入申请数量" v-model.number="product.amount" :min="0"
                         @blur="changeNumber">
                <template slot="append">
                  <dict :dict-group="'measurementUnit'" :dict-key="product.fixInfo.goodsDto.measurementUnit"></dict>
                </template>
              </oms-input>
            </el-form-item>
          </el-form>

          <div class="oms-form order-product-box">
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
                             v-show="acce.sellPrice">¥ {{ acce.sellPrice | formatMoney}}</span>
                       <span style="margin-right: 10px" v-show="acce.proportion">比例 {{ acce.proportion }}</span>
                       <span style="margin-right: 10px">{{ acce.salesFirmName }}</span>
                  </span>
                </el-col>
              </el-row>
            </div>
          </div>
          <oms-form-row label="" :span="4">
            <el-button type="primary" @click="addProduct">添加疫苗</el-button>
          </oms-form-row>
          <div class="product-list-detail">
            <h3 style="background: #13ce66;color: #fff">已选疫苗</h3>
            <table class="table">
              <thead>
              <tr>
                <th style="width: 300px">疫苗名称</th>
                <th>单价</th>
                <th>申请数量</th>
                <th>申请金额</th>
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
                    <a href="#" @click.prevent="editItem(product)" v-show="!product.isCombination"><i
                      class="el-icon-t-edit"></i> 编辑</a>
                  </div>
                  <a href="#" @click.prevent="remove(product)" v-show="!product.isCombination">
                    <i class="el-icon-t-delete"></i> 删除</a>
                </td>
              </tr>
              <tr>
                <td colspan="3" align="right">
                  <total-count property="amount" :list="form.detailDtoList"></total-count>
                </td>
                <td colspan="2">
                  <span style="color: #333;font-weight: 700" v-show="form.detailDtoList.length &&  Number(totalMoney)">合计:  ¥{{ totalMoney | formatMoney
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
  import { Address, BaseInfo, cerpAction, http, pullSignal, VaccineRights } from '@/resources';
  import utils from '@/tools/utils';

  export default {
    name: 'addForm',
    loading: false,
    props: {
      index: Number,
      currentOrder: Object
    },
    data: function () {
      return {
        pickerOptions0: {
          disabledDate (time) {
            return new Date(time).getTime() < Date.now();
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
          type: 1
        },
        rules: {
          warehouseId: [
            {required: true, message: '请选择接种点仓库', trigger: 'change'}
          ],
          type: [
            {required: true, type: 'number', message: '请选择疫苗标志', trigger: 'change'}
          ],
          povId: [
            {required: true, message: '请选择接种点', trigger: 'change'}
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
        changeTotalNumber: utils.changeTotalNumber,
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
      type () {
        let level = this.$store.state.orgLevel;
        return level === 1 ? 1 : 2;
      }
    },
    watch: {
      index (val) {
        if (!val) return;
        this.form = {
          detailDtoList: [],
          remark: '',
          warehouseId: '',
          povId: '',
          demandTime: '',
          cdcId: '',
          type: 1
        };
        // this.searchWarehouses();
        // this.queryOnCDCs();
        this.filterPOV();
        this.currentList = [];
        if (val === 2) {
          this.editOrderInfo();
        } else if (val === 3) {
          this.addOrderInfo();
        } else {
          this.resetForm();
          this.form.id = null;
        }
      }
    },
    methods: {
      filterGoods (query) {
        this.filterProductList = this.totalFilterProductList.filter(f => f.orgGoodsNameAcronymy.indexOf(query) !== -1 ||
          f.goodsName.indexOf(query) !== -1 || f.goodsNo.indexOf(query) !== -1);
      },
      filterAddressLabel (item) {
        let name = item.name ? '【' + item.name + '】' : '';
        return name + this.getWarehouseAdress(item);
      },
      getWarehouseAdress: function (item) { // 得到仓库地址
        return item.detail;
      },
      editOrderInfo () {
        let orgDetailGoods = this.currentOrder.detailDtoList.map(m => {
          return {
            amount: m.applyCount,
            measurementUnit: m.unit,
            orgGoodsId: m.orgGoodsId,
            orgGoodsName: m.goodsName,
            unitPrice: m.price
          };
        });
        this.orgList.push({
          subordinateId: this.currentOrder.povId,
          subordinateName: this.currentOrder.povName
        });
        this.form = {
          id: this.currentOrder.id,
          povId: this.currentOrder.povId,
          demandTime: this.currentOrder.demandTime,
          type: Number(this.currentOrder.vaccineSign),
          warehouseId: this.currentOrder.warehouseId,
          detailDtoList: []
        };
        // ******2.0变化
        this.changeType();
        // ******
        this.$nextTick(() => {
          this.form.detailDtoList = orgDetailGoods;
        });
//        this.form = JSON.parse(JSON.stringify(this.currentOrder));
      },
      addOrderInfo () {
        let orgDetailGoods = this.currentOrder.detailDtoList.map(m => {
          return {
            amount: m.applyCount,
            measurementUnit: m.unit,
            orgGoodsId: m.orgGoodsId,
            orgGoodsName: m.goodsName,
            unitPrice: m.price
          };
        });
        this.orgList.push({
          subordinateId: this.currentOrder.povId,
          subordinateName: this.currentOrder.povName
        });
        this.form = {
          povId: this.currentOrder.povId,
          demandTime: this.currentOrder.demandTime,
          type: Number(this.currentOrder.vaccineSign),
          warehouseId: this.currentOrder.warehouseId,
          detailDtoList: []
        };
        this.changeType();
        this.$nextTick(() => {
          this.form.detailDtoList = orgDetailGoods;
        });
//        this.form = JSON.parse(JSON.stringify(this.currentOrder));
      },
      changeNumber () {
        this.product.amount = this.changeTotalNumber(this.product.amount, this.product.fixInfo.goodsDto.smallPacking);
      },
      changeTime: function (date) {// 格式化时间
        this.form.demandTime = date ? this.$moment(date).format('YYYY-MM-DD') : '';
      },
      changeType () {
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
      povChange (val) {
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
        this.$refs['orderGoodsForm'].resetFields();
        if (!val) {
          this.form.warehouseId = '';
          return;
        }
        this.searchProduct();
        this.searchWarehouses(val);
      },
      searchProduct: function () {
        this.searchProductList = [];
        if (!this.form.povId) return;
        let rTime = Date.now();
        this.requestTime = rTime;
        VaccineRights.queryVaccineByPov(this.form.povId, {cdcId: this.$store.state.user.userCompanyAddress}).then(res => {
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
          relation: '0'
        };
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.orgList = res.data;
        });
      },
      queryOnCDCs () {
        cerpAction.queryOnCDCs().then(res => {
          this.cdcs = res.data;
          this.filterProduct();
          this.searchProduct();
        });
      },
      filterProduct () {
        this.showCdcs = this.cdcs.filter(f => f.level === this.type);
        this.form.cdcId = this.showCdcs.length ? this.showCdcs[0].orgId : '';
      },
      searchWarehouses () {
        Address.queryAddress(this.form.povId, {deleteFlag: false, orgId: this.form.povId}).then(res => {
          this.warehouses = res.data || [];
          let fs = this.warehouses.filter(i => i.default)[0];
          if (fs) {
            this.form.warehouseId = fs.id;
          }
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
        this.totalFilterProductList = arr.filter(f => f.goodsTypeId === this.type.toString());
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
      deleteItem (item) {
        this.form.detailDtoList.splice(this.form.detailDtoList.indexOf(item), 1);
        this.form.detailDtoList = this.form.detailDtoList.filter(dto => item.orgGoodsId !== dto.mainOrgId);
      },
      editItem (item) {
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
        this.changeTime(this.form.demandTime);
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
          delete saveData.type;
          saveData.detailDtoList.forEach(item => {
            item.price = item.unitPrice;
            item.applyCount = item.amount;
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
                message: error.response.data.msg,
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
                message: error.response.data.msg,
                type: 'error'
              });
            });
          }
        });
      },
      resetForm () {
        this.$refs['orderGoodsForm'].resetFields();
        this.$refs['orderAddForm'].resetFields();
        this.form.detailDtoList = [];
        this.currentList = [];
      }
    }
  };
</script>
