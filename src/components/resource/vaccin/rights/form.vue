<style lang="less" scoped>
  @import "../../../../assets/mixins.less";

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

  .good-selects {
    .el-select-dropdown__item {
      width: 520px;
      height: 70px;
    }
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title" style="font-size: 16px">{{ title }}</h2>
        <ul>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit" :disabled="doing">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content show-content">
          <el-form ref="d-form" :rules="rules" :model="form"
                   label-width="160px" style="padding-right: 20px">
            <el-form-item label="POV" prop="povList" v-if="!form.id">
              <el-select filterable remote placeholder="请输入关键字搜索POV" multiple :remote-method="filterPOV"
                         :clearable="true"
                         v-model="form.povList" popper-class="good-selects">
                <el-option :value="org.subordinateId" :key="org.subordinateId" :label="org.subordinateName"
                           v-for="org in orgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.subordinateName}}</span>
                  </div>
                  <div style="overflow: hidden">
                  <span class="select-other-info pull-left" v-if="org.subordinateCode">
                    <span>系统代码</span> {{org.subordinateCode}}
                  </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="POV" prop="povId" v-if="form.id">
              <span>{{ formItem.povName }}</span>
            </el-form-item>
            <el-form-item label="选择价格组" prop="salePriceGroupId">
              <el-select filterable remote placeholder="请输入关键字搜索价格组" :remote-method="filterPriceGroup" :clearable="true"
                         v-model="form.salePriceGroupId"
                         @change="changeSelect" @click.native="filterPriceGroup('')">
                <el-option :value="item.id" :key="item.id" :label="item.name"
                           v-for="item in prices">
                  <div style="overflow: hidden">
                    <span class="pull-left">{{item.name}}</span>
                    <span class="pull-right">销售单价 ￥{{item.unitPrice}}</span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单价" v-if="unitPrice">
              <span>￥{{ unitPrice }}</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { Vaccine, BriceGroup, cerpAction, VaccineRights, http } from '@/resources';
  import utils from '@/tools/utils';

  export default {
    props: {
      formItem: Object,
      currentItem: Object
    },
    data () {
      return {
        form: {
          orgGoodsId: '',
          salePriceGroupId: '',
          povList: [],
          povId: ''
        },
        rules: {
          salePriceGroupId: {required: true, message: '请选择价格组', trigger: 'change'},
          povList: {required: true, type: 'array', message: '请选择POV', trigger: 'change'},
          povId: {required: true, message: '请选择价格组', trigger: 'change'}
        },
        prices: [], // 货品列表
        title: '新增疫苗授权详情',
        orgList: [],
        unitPrice: '',
        doing: false
      };
    },
    watch: {
      formItem (val) {
        this.$refs['d-form'].resetFields();
        if (val.id) {
          this.title = '编辑疫苗授权详情';
          this.orgList.push({
            subordinateId: val.povId,
            subordinateName: val.povName
          });
          this.prices.push({
            id: val.salePriceGroupId,
            name: val.salePriceGroupName
          });
          this.form = val;
          this.form.povList = [];
        } else {
          this.form = {
            orgGoodsId: '',
            salePriceGroupId: '',
            povList: [],
            povId: ''
          };
          this.title = '新增疫苗授权详情';
        }
      }
    },
    methods: {
      formatPrice: function () {// 格式化单价，保留两位小数
        this.form.unitPrice = utils.autoformatDecimalPoint(this.form.unitPrice);
      },
      changeSelect (val) {
        if (!val) {
          this.unitPrice = '';
        }
        let ary = this.prices.filter(f => f.id === val);
        this.unitPrice = ary.length ? ary[0].unitPrice : '';
      },
      filterPriceGroup: function (query) {// 过滤POV
        if (!query && this.prices.length && this.form.salePriceGroupId) {
          return false;
        }
        let params = Object.assign({}, {
          keyWord: query,
          orgGoodsId: this.currentItem.orgGoodsId,
          availabilityStatus: true
        });
        BriceGroup.query(params).then(res => {
          this.prices = res.data.list;
        });
      },
      filterPOV: function (query) {// 过滤POV
//        if (!query && this.orgList.length && this.form.povId) {
//          return false;
//        }
        let params = Object.assign({}, {
          keyWord: query
        });
        cerpAction.queryAllPov(params).then(res => {
          this.orgList = res.data.list;
        });
      },
      onSubmit () {
        this.$refs['d-form'].validate((valid) => {
          if (!valid) {
            return false;
          }
          if (this.form.id) {
            let obj = {
              'id': this.form.id,
              'orgGoodsId': this.currentItem.orgGoodsId,
              'povId': this.form.povId,
              'salePriceGroupId': this.form.salePriceGroupId
            };
            this.doing = true;
            http.put('/vaccine-authorization', obj).then(() => {
              this.$notify.success({
                message: '修改疫苗授权成功'
              });
//              this.$refs['d-form'].resetFields();
              this.form = {
                orgGoodsId: '',
                salePriceGroupId: '',
                povList: [],
                povId: ''
              };
              this.doing = false;
              this.$emit('refresh');
            }).catch(error => {
              this.doing = false;
              this.$notify.error({
                message: error.response.data && error.response.data.msg || '修改疫苗授权失败'
              });
            });
          } else {
            let obj = {
              'orgGoodsId': this.currentItem.orgGoodsId,
              'povList': this.form.povList,
              'groupId': this.form.salePriceGroupId
            };
            this.doing = true;
            VaccineRights.batchSave(obj).then(() => {
              this.$notify.success({
                message: '添加疫苗授权成功'
              });
              this.$refs['d-form'].resetFields();
              this.$emit('refresh');
              this.doing = false;
            }).catch(error => {
              this.doing = false;
              this.$notify.error({
                message: error.response.data && error.response.data.msg || '添加疫苗授权失败'
              });
            });
          }
        });
      }
    }
  };
</script>
