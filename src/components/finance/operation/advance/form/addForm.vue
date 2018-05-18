<style lang="scss" scoped>
  @import "../../../../../assets/mixins.scss";

  $leftWidth: 0;

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

</style>
<style lang="scss">
  .el-radio--group--custom {
    .el-radio--custom {
      display: inline-block;
      padding: 5px 10px;
    }
    .el-radio + .el-radio {
      margin-left: 0;
    }
  }

</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-right min-gutter">
        <h3>{{`添加${title}作业`}}</h3>
        <div class="hide-content show-content">
          <el-form ref="addForm" :rules="rules" :model="form" @submit.prevent="onSubmit" onsubmit="return false"
                   label-width="100px" style="padding-right: 20px">
            <el-form-item :label="`${title}单位`" prop="orgId">
              <el-select v-if="type === 2" filterable remote :placeholder="`请输入名称搜索${title}单位`"
                         :remote-method="filterOrg" :clearable="true"
                         v-model="form.orgId" popper-class="good-selects"
                         @click.native.once="filterOrg('')">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
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
              <el-radio-group v-else v-model="form.orgId" class="el-radio--group--custom">
                <el-radio class="el-radio--custom" :label="item.orgId" :key="item.orgId" v-for="item in orgList">
                  {{item.orgName}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="金额" prop="amount">
              <oms-input type="text" v-model.number="form.amount" placeholder="请输入金额">
                <template slot="prepend">¥</template>
              </oms-input>
            </el-form-item>
            <!--<el-form-item label="备注">-->
              <!--<oms-input type="textarea" v-model="form.explain" placeholder="请输入备注"-->
                         <!--:autosize="{ minRows: 2, maxRows: 5}"></oms-input>-->
            <!--</el-form-item>-->
            <el-form-item>
              <el-button type="success" @click="onSubmit" :disabled="doing">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { BaseInfo, cerpAction, PaymentPending } from '../../../../../resources';
  import utils from '@/tools/utils';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    name: 'addForm',
    loading: false,
    props: {
      defaultIndex: Number,
      title: String,
      type: Number
    },
    mixins: [methodsMixin],
    data: function () {
      return {
        form: {
          orgId: '',
          amount: ''
        },
        rules: {
          orgId: [
            {required: true, message: `请选择${this.title}单位`, trigger: 'change'}
          ],
          amount: [
            {required: true, message: '请输入金额', trigger: 'blur'},
            {required: true, type: 'number', message: '请输入数字', trigger: 'blur'}
          ]
        },
        orgList: [],
        doing: false
      };
    },
    watch: {
      defaultIndex (val) {
        this.resetForm();
        this.filterOrg();
      }
    },
    mounted: function () {
      this.filterOrg();
    },
    methods: {
      resetForm: function () {// 重置表单
        this.$refs['addForm'].resetFields();
      },
      formatPrice () {// 格式化单价，保留两位小数
        this.form.amount = utils.autoformatDecimalPoint(this.form.amount);
      },
      doClose: function () {
        this.$emit('close');
      },
      onSubmit: function () {// 提交表单
        this.$refs['addForm'].validate((valid) => {
          if (!valid || this.doing) {
            this.index = 0;
            return;
          }
          const form = {};
          form[this.type === 1 ? 'cdcId' : 'povId'] = this.form.orgId;
          form.money = this.form.amount;
          this.doing = true;
          PaymentPending.save(this.type, form).then(res => {
            this.resetForm();
            this.$notify({
              duration: 2000,
              message: `新增${this.title}成功`,
              type: 'success'
            });
            this.$emit('change', res.data);
            this.$nextTick(() => {
              this.doing = false;
              this.$emit('right-close');
            });
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: `新增${this.title}失败`,
              message: error.response.data.msg,
              type: 'error'
            });
          });
        });
      }
    }
  };
</script>
