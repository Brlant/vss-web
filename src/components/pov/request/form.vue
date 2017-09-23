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
        <h2 class="clearfix right-title" style="font-size: 16px">新增要货申请单</h2>
        <ul>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit">保存申请单</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content show-content">
          <el-form ref="orderAddForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                   label-width="160px" style="padding-right: 20px">
            <el-form-item label="订单类型" prop="type">
              <el-radio-group v-model.number="form.type" @change="changeType">
                <el-radio :label="1">一类疫苗</el-radio>
                <el-radio :label="2">二类疫苗</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="选择CDC" prop="cdcId">
              <el-select placeholder="请选择CDC" v-model="form.cdcId" filterable clearable>
                <el-option :label="item.orgName" :value="item.orgId" :key="item.orgId" v-for="item in cdcs"
                           v-show="item.level === form.type">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="POV仓库" prop="warehouseId">
              <el-select placeholder="请选择POV仓库" v-model="form.warehouseId" filterable clearable>
                <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in warehouses">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="需求时间" prop="demandTime">
              <el-date-picker
                type="date"
                v-model="form.demandTime"
                placeholder="请选择需求时间" format="yyyy-MM-dd"
                @change="changeTime">
              </el-date-picker>
            </el-form-item>

          </el-form>

          <el-form ref="orderGoodsForm" :rules="goodsRules" :model="product" @submit.prevent="onSubmit"
                   onsubmit="return false"
                   label-width="160px" style="padding-right: 20px">
            <el-form-item label="选择疫苗" prop="orgGoodsId">
              <el-select v-model="product.orgGoodsId" filterable placeholder="请输入关键字搜索产品" :clearable="true"
                         :loading="loading"
                         popper-class="order-good-selects"
                         @change="getGoodDetail">

                <el-option v-for="item in filterProductList" :key="item.id"
                           :label="item.goodsName"
                           :value="item.orgGoodsId">
                  <div>
                    <span class="pull-left">{{item.goodsName}}</span>
                    <span class="select-other-info pull-left">{{item.goodsNo}}</span>
                    <span class="select-other-info pull-right">{{ item.factoryName }}</span>
                    <!--<el-tag type="success" v-show="item.list.length"-->
                    <!--style="line-height: 22px;margin-left: 20px;height: 20px">-->
                    <!--组合-->
                    <!--</el-tag>-->
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="疫苗数量" prop="amount">
              <oms-input type="number" placeholder="请输入申请数量" v-model.number="product.amount" :min="0">
                <template slot="append">
                  <dict :dict-group="'measurementUnit'" :dict-key="product.fixInfo.goodsDto.measurementUnit"></dict>
                </template>
              </oms-input>
            </el-form-item>
          </el-form>

          <div class="oms-form order-product-box">
            <div class="product-info-fix clearfix">
              <el-row>
                <el-col :span="12">
                  <oms-row label="疫苗编号" :span="8">
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
                  <span v-show="accessoryList.length">【组合疫苗】</span>
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
  import { pullSignal, cerpAction, Address, VaccineRights, http } from '@/resources';
  import utils from '@/tools/utils';

  export default {
    name: 'addForm',
    loading: false,
    props: {
      index: Number
    },
    data: function () {
      return {
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
            {required: true, message: '请选择POV仓库', trigger: 'change'}
          ],
          type: [
            {required: true, type: 'number', message: '请选择疫苗标志', trigger: 'change'}
          ],
          cdcId: [
            {required: true, message: '请选择CDC', trigger: 'change'}
          ],
          demandTime: [
            {required: true, message: '请选择需求时间', trigger: 'change'}
          ]
        },
        goodsRules: {
          orgGoodsId: [
            {required: true, message: '请选择疫苗', trigger: 'change'}
          ],
          amount: [
            {required: true, type: 'number', message: '请输入数量', trigger: 'blur'}
          ]

        }
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
      }
    },
    watch: {
      index (val) {
        if (!val) return;
        this.searchWarehouses();
        this.queryOnCDCs();
      }
    },
    methods: {
      changeTime: function (date) {// 格式化时间
        this.form.demandTime = date ? this.$moment(date).format('YYYY-MM-DD') : '';
      },
      changeType () {
        this.$refs['orderGoodsForm'].resetFields();
        this.accessoryList = [];
        this.filterProducts();
        // this.form.cdcId = this.cdcs.filter(f => f.level === this.form.type)[0] && this.cdcs.filter(f => f.level === this.form.type)[0].orgId || '';
        this.searchProduct();
      },
      searchProduct: function () {
        this.searchProductList = [];
        if (!this.form.cdcId) return;
        VaccineRights.queryVaccineByPov(this.$store.state.user.userCompanyAddress, {cdcId: this.form.cdcId}).then(res => {
          this.searchProductList = res.data;
          this.$nextTick(function () {
            this.filterProducts();
          });
        });
      },
      queryOnCDCs () {
        cerpAction.queryOnCDCs().then(res => {
          this.cdcs = res.data;
          this.form.cdcId = res.data.filter(f => f.level === this.form.type)[0] && res.data.filter(f => f.level === this.form.type)[0].orgId;
          this.searchProduct();
        });
      },
      searchWarehouses () {
        let user = this.$store.state.user;
        Address.queryAddress(user.userCompanyAddress, {deleteFlag: false, orgId: user.userCompanyAddress}).then(res => {
          this.warehouses = res.data || [];
          this.form.warehouseId = this.warehouses.filter(i => i.default)[0].id;
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
        this.filterProductList = arr.filter(f => f.goodsTypeId === this.form.type.toString());
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
          return;
        }
        http.get('/org/goods/' + OrgGoodsId).then(res => {
          this.currentList.push(res.data);
          this.$nextTick(function () {
            this.filterProducts();
          });
          this.currentList.forEach(item => {
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
        });
      },
      addProduct: function () {// 疫苗加入到订单
        this.$refs['orderGoodsForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.currentList.forEach((item) => {
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
          pullSignal.save(saveData).then(res => {
            this.resetForm();
            this.$notify({
              duration: 2000,
              message: '新增要货申请单成功',
              type: 'success'
            });
            self.$emit('change', res.data);
            this.resetForm();
            this.$nextTick(() => {
              this.doing = false;
              this.$emit('close');
            });
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '新增要货申请单失败',
              message: error.response.data.msg,
              type: 'error'
            });
          });
        });
      },
      resetForm () {
        this.$refs['orderGoodsForm'].resetFields();
        this.$refs['orderAddForm'].resetFields();
        this.form.detailDtoList = [];
      }
    }
  };
</script>
