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
        padding: 0 0;
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


  .ar {
    text-align: right;
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
                   label-width="180px" style="padding-right: 20px">
            <el-form-item label="二类疫苗销售价格组名称" prop="name">
              <oms-input type="text" placeholder="请输入二类疫苗销售价格组名称" v-model="form.name"></oms-input>
            </el-form-item>
            <el-form-item label="选择疾控货品" prop="orgGoodsId">
              <el-select filterable remote placeholder="请输入名称搜索疾控货品" :remote-method="getGoodsList" :clearable="true"
                         v-model="form.orgGoodsId" @click.native.once="getGoodsList('')" @change="orgGoodsChange">
                <el-option :value="item.orgGoodsDto.id" :key="item.orgGoodsDto.id" :label="item.orgGoodsDto.name"
                           v-for="item in goodses">
                  <div style="overflow: hidden">
                    <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                  </div>
                  <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.goodsNo">货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                      </span>
                    <span class="select-other-info pull-left">
                      <span>销售价格:</span>{{item.orgGoodsDto.sellPrice | formatMoney}}
                      </span>
                    <span class="select-other-info pull-left"><span
                      v-show="item.orgGoodsDto.salesFirmName">供货厂商:</span>{{ item.orgGoodsDto.salesFirmName }}
                      </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="单价" prop="unitPrice">
              <oms-input type="text" placeholder="请输入单价" v-model="form.unitPrice" :min="0"
                         @blur="formatPrice">
                <template slot="prepend">¥</template>
              </oms-input>
            </el-form-item>
            <el-form-item label="是否可用">
              <el-switch active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949"
                         v-model="form.availabilityStatus"></el-switch>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { BriceGroup } from '@/resources';
  import utils from '@/tools/utils';

  export default {
    props: {
      formItem: Object
    },
    data () {
      return {
        form: {
          name: '',
          orgGoodsId: '',
          unitPrice: '',
          availabilityStatus: true
        },
        rules: {
          name: {required: true, message: '请输入二类疫苗销售价格组名称', trigger: 'blur'},
          unitPrice: {required: true, message: '请输入单价', trigger: 'blur'},
          orgGoodsId: {required: true, message: '请选择疾控货品', trigger: 'change'}
        },
        goodses: [], // 货品列表
        title: '新增二类疫苗销售价格组',
        doing: false
      };
    },
    watch: {
      formItem (val) {
        if (val.id) {
          this.getGoodsList(val.goodsName);
          this.form = val;
          this.form.unitPrice = this.form.unitPrice ? this.form.unitPrice.toString() : '';
          this.title = '编辑二类疫苗销售价格组';
        } else {
          this.form = {
            name: '',
            orgGoodsId: '',
            unitPrice: '',
            availabilityStatus: true
          };
          this.title = '新增二类疫苗销售价格组';
        }
      }
    },
    methods: {
      getGoodsList: function (query) {
        let params = Object.assign({}, {
          keyWord: query,
          deleteFlag: false
        });
        this.$http.get('/vaccine-info/second-vaccine/valid/org-goods', {params}).then(res => {
          this.goodses = res.data.list;
        });
      },
      formatPrice: function () {// 格式化单价，保留两位小数
        this.form.unitPrice = utils.autoformatDecimalPoint(this.form.unitPrice);
      },
      orgGoodsChange (val) {
        this.goodses.forEach(item => {
          if (item.orgGoodsDto.id === val) {
            this.form.unitPrice = utils.autoformatDecimalPoint(item.orgGoodsDto.sellPrice.toString());
          }
        });
      },
      onSubmit () {
        this.$refs['d-form'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.doing = true;
          if (this.form.id) {
            BriceGroup.update(this.form.id, this.form).then(() => {
              this.$notify.success({
                message: '编辑二类疫苗销售价格组成功'
              });
              this.$refs['d-form'].resetFields();
              this.$emit('refresh');
              this.doing = false;
            }).catch(error => {
              this.doing = false;
              this.$notify.error({
                message: error.response.data && error.response.data.msg || '编辑二类疫苗销售价格组失败'
              });
            });
          } else {
            BriceGroup.save(this.form).then(() => {
              this.$notify.success({
                message: '添加二类疫苗销售价格组成功'
              });
              this.$refs['d-form'].resetFields();
              this.$emit('refresh');
              this.doing = false;
            }).catch(error => {
              this.doing = false;
              this.$notify.error({
                message: error.response.data && error.response.data.msg || '添加二类疫苗销售价格组失败'
              });
            });
          }
        });
      }
    }
  };
</script>
