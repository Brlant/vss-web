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
    text-align: right;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title" style="font-size: 16px">{{setTitle}}免疫规划疫苗物流费用</h2>
        <ul>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit" :disabled="doing">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content show-content">
          <el-form ref="d-form" :rules="rules" :model="form" label-width="200px" style="padding-right: 20px">
            <el-form-item label="免疫规划疫苗物流费用模式" prop="model">
              <el-select v-model="form.model" placeholder="请选择免疫规划疫苗物流费用模式">
                <el-option label="单支" value="0"></el-option>
                <el-option label="比例" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="免疫规划疫苗物流费用" prop="price" v-if="form.model==='0'">
              <oms-input type="text" placeholder="请输入免疫规划疫苗物流费用" v-model="form.price" :min="0"
                         @blur="formatPrice">
                <template slot="prepend">¥</template>
              </oms-input>
            </el-form-item>
            <el-form-item label="免疫规划疫苗物流费用比例" prop="proportion" v-if="form.model==='1'">
              <oms-input type="text" placeholder="请输入免疫规划疫苗物流费用比例" v-model="form.proportion" :min="0">
                <template slot="append">%</template>
              </oms-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {logisticsCost} from '../../../resources';
  import utils from '../../../tools/utils';

  export default {
    data() {
      return {
        form: {
          orgId: '',
          price: '',
          proportion: '',
          model: '',
          vaccineType: '1'
        },
        rules: {
          model: {required: true, message: '请选择物流费用模式', trigger: 'blur'},
          price: {required: true, message: '请输入免疫规划疫苗物流费用', trigger: 'blur'},
          proportion: {required: true, message: '请输入免疫规划疫苗物流费用比例', trigger: 'blur'}
        },
        doing: false
      };
    },
    props: ['formItem', 'formType'],
    watch: {
      formItem: function (val) {
        if (val.id) {
          this.form = Object.assign({}, this.formItem);
          if (this.form.model === '1' && this.formType === 'add') {
            this.form.proportion = this.form.price;
          } else {
            this.form.proportion = this.form.price * 100;
            this.form.proportion = utils.autoformatDecimalPoint(this.form.proportion.toString());
          }
        } else {
          this.form = {
            orgId: '',
            price: '',
            model: '',
            proportion: '',
            vaccineType: '1'
          };
        }
      },
      'form.model': function (val) {
        if (val === '0') {
          this.form.proportion = '';
        }
        if (val === '1') {
          this.form.price = '';
        }
      }
    },
    computed: {
      setTitle: function () {
        let title = '新增';
        if (this.form.id) {
          title = '修改';
        }
        return title;
      }
    },
    methods: {
      formatPrice: function () {// 格式化单价，保留两位小数
        this.form.price = utils.autoformatDecimalPoint(this.form.price);
      },
      onSubmit() {
        this.$refs['d-form'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.form.orgId = this.$store.state.user.userCompanyAddress;
          // 处理比例
          if (this.form.model === '1' && this.form.proportion !== '') {
            let price = this.form.proportion / 100;
            this.form.price = price;
          }
          this.doing = true;
          if (this.formType === 'add') {
            logisticsCost.save(this.form).then(() => {
              this.$notify.success({
                message: '添加免疫规划疫苗物流费用成功'
              });
              this.doing = false;
              this.$refs['d-form'].resetFields();
              this.$emit('close');
            }).catch(error => {
              this.$notify.error({
                message: error.response && error.response.data && error.response.data.msg || '添加免疫规划疫苗物流费用失败'
              });
              this.doing = false;
            });
          } else {
            logisticsCost.update(this.form.id, this.form).then(() => {
              this.$notify.success({
                message: '修改免疫规划疫苗物流费用成功'
              });
              this.doing = false;
              this.$refs['d-form'].resetFields();
              this.$emit('close');
            }).catch(error => {
              this.$notify.error({
                message: error.response && error.response.data && error.response.data.msg || '修改免疫规划疫苗物流费用失败'
              });
              this.doing = false;
            });
          }
        });
      }
    }
  };
</script>
