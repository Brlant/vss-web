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
        <h2 class="clearfix right-title" style="font-size: 16px">{{ title }}</h2>
        <ul>
          <li class="list-style" v-for="item in productListSet" @click="index = item.key"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit" :disabled="doing">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content" v-bind:class="{'show-content' : index==0}">
          <el-form ref="d-form" :rules="rules" :model="form"
                   label-width="160px" style="padding-right: 20px">
            <el-form-item label="疫苗厂商" prop="factoryId">
              <el-select filterable remote placeholder="请输入名称搜索疫苗厂商" :remote-method="filterOrg" :clearable="true"
                         v-model="form.factoryId" popperClass="good-selects" @change="selectPayments = []"
                         @click.native.once="filterOrg('')">
                <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
                  <div style="overflow: hidden">
                    <span class="pull-left" style="clear: right">{{org.name}}</span>
                    <span class="pull-right" style="color: #999">
                     <dict :dict-group="'orgRelation'" :dict-key="org.relationList[0]"></dict>
                    </span>
                  </div>
                  <div style="overflow: hidden">
                  <span class="select-other-info pull-left">
                    <span>系统代码:</span>{{org.manufacturerCode}}
                  </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发票号码">
              <oms-input type="textarea" v-model="form.invoiceNumber" placeholder="请输入发票号码"></oms-input>
            </el-form-item>
            <el-form-item label="发票类型" prop="type">
              <el-select type="text" v-model="form.type" placeholder="请输入发票类型">
                <el-option :value="item.key" :key="item.key" :label="item.label"
                           v-for="item in invoiceTypes"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发票金额" prop="amount">
              <oms-input type="text" placeholder="选择发票明细后，自动计算总和" v-model="form.amount" :min="0"
                         @blur="formatAmount" disabled>
                <template slot="prepend">¥</template>
              </oms-input>
            </el-form-item>
            <!--<el-form-item label="是否已到" prop="haveTo">-->
            <!--<el-switch active-text="是" inactive-text="否" active-color="#13ce66" inactive-color="#ff4949"-->
            <!--v-model="form.haveTo"></el-switch>-->
            <!--</el-form-item>-->
          </el-form>
        </div>
        <div class="hide-content" v-bind:class="{'show-content' : index==1}">
          <pay-detail :selectPayments="selectPayments" :factoryId="form.factoryId" :amount="form.amount"></pay-detail>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {BaseInfo, invoiceManage} from '@/resources';
  import utils from '@/tools/utils';
  import payDetail from './payDetail.vue';

  export default {
    components: {
      payDetail
    },
    props: {
      formItem: Object
    },
    data() {
      return {
        form: {
          factoryId: '',
          invoiceNumber: '',
          type: '',
          amount: '',
          status: 0,
          detailList: [],
          haveTo: false
        },
        rules: {
          factoryId: {required: true, message: '请选择疫苗厂商', trigger: 'change'},
          invoiceNumber: {required: true, message: '请输入发票号码', trigger: 'blur'},
          type: {required: true, message: '请选择发票类型', trigger: 'change'},
          amount: {required: true, message: '请选择发票明细，自动计算发票金额', trigger: 'blur'},
          haveTo: {required: true, message: '请选择发票是否已到'}
        },
        doing: false,
        title: '添加发票',
        orgList: [],
        productListSet: [
          {name: '基本信息', key: 0},
          {name: '发票明细', key: 1}
        ],
        index: 0,
        selectPayments: []
      };
    },
    watch: {
      formItem(val) {
        if (val.id) {
          Object.assign(this.form, val);
          this.title = '编辑发票';
        } else {
          this.form = {
            factoryId: '',
            invoiceNumber: '',
            type: '',
            amount: '',
            status: 0
          };
          this.title = '添加发票';
          this.selectPayments = [];
          this.$refs['d-form'].resetFields();
        }
      },
      selectPayments: {
        handler(val) {
          let amount = 0;
          val.forEach(i => {
            amount += Number(i.billAmount);
          });
          this.form.amount = amount ? utils.autoformatDecimalPoint(amount.toString()) : '';
          this.form.detailList = val.map(m => m.id);
        },
        deep: true
      }
    },
    computed: {
      invoiceTypes: function () {
        return this.$getDict('invoiceType');
      }
    },
    methods: {
      filterOrg: function (query) {// 过滤来源单位
        let user = this.$store.state.user;
        let orgId = user ? user.userCompanyAddress : '';
        if (!orgId) {
          this.orgList = [];
          this.form.factoryId = '';
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
      formatAmount: function () {// 格式化单价，保留两位小数
        this.form.amount = utils.autoformatDecimalPoint(this.form.amount);
      },
      onSubmit() {
        this.$refs['d-form'].validate((valid) => {
          if (!valid || this.doing) {
            this.index = 0;
            return false;
          }
          this.doing = true;
          if (this.form.id) {
            invoiceManage.update(this.form.id, this.form).then(() => {
              this.$notify.success({
                message: '编辑发票成功'
              });
              this.$refs['d-form'].resetFields();
              this.$emit('refresh');
              this.doing = false;
            }).catch(error => {
              this.doing = false;
              this.$notify.error({
                message: error.response && error.response.data && error.response.data.msg || '编辑发票失败'
              });
            });
          } else {
            invoiceManage.save(this.form).then(() => {
              this.$notify.success({
                message: '添加发票成功'
              });
              this.doing = false;
              this.$refs['d-form'].resetFields();
              this.$emit('refresh');
            }).catch(error => {
              this.doing = false;
              this.$notify.error({
                message: error.response && error.response.data && error.response.data.msg || '添加发票失败'
              });
            });
          }
        });
      }
    }
  };
</script>
