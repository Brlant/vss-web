<style lang="scss" scoped>
@import "../../../../../assets/mixins.scss";

$leftWidth: 180px;

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
      <div class="content-left">
        <h2 class="clearfix right-title">{{`添加${title}作业`}}</h2>
        <ul>
          <li v-for="item in tabList" class="list-style" v-bind:class="{ 'active' : index===item.key}"
              @click="index = item.key">
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>{{tabList[index].name}}</h3>
        <el-form ref="addForm" :model="form" :rules="rules" label-width="130px" onsubmit="return false"
                 @submit.prevent="onSubmit">
          <div v-show="index === 0">
            <el-form-item :label="`${title}单位`" prop="orgId">
              <el-select v-if="type === 2" v-model="form.orgId" :clearable="true" :placeholder="`请输入名称搜索${title}单位`"
                         :remote-method="filterOrg" filterable popper-class="good-selects"
                         remote @change="orgIdChange"
                         @click.native.once="filterOrg('')">
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
              <el-radio-group v-else v-model="form.orgId" class="el-radio--group--custom" @change="orgIdChange">
                <el-radio v-for="item in orgList" :key="item.orgId" :label="item.orgId" class="el-radio--custom">
                  {{item.orgName}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="发生时间">
              <el-date-picker
                v-model="createTimes"
                placeholder="请选择" type="daterange"
                @change="createTimeChange">
              </el-date-picker>
              <el-button class="ml-15" type="primary" @click.stop="searchInOrder">查询</el-button>
            </el-form-item>
            <h3 style="background: #f1f1f1;overflow: hidden;margin: 0;padding: 4px">
              <span style="float: right">总金额：￥{{ totalMoney.unitPrice | formatMoney }}</span>
            </h3>
            <table v-loading="detailLoading" class="table">
              <thead>
              <tr>
                <th style="width: 280px">疫苗名称</th>
                <th>订单号</th>
                <th>{{type === 1 ? '待付款' : '待收款'}}金额</th>
                <th>发生时间</th>
              </tr>
              </thead>
              <tbody>
              <tr v-if="!orderDetailList.length">
                <td colspan="6">
                  <div class="empty-info mini">暂无{{type === 1 ? '付款' : '收款'}}明细</div>
                </td>
              </tr>
              <tr v-for="product in orderDetailList">
                <td><span>{{product.name}}</span></td>
                <td><span>{{product.orderNo}}</span></td>
                <td><span> ¥{{ product.unitPrice * product.amount }}</span></td>
                <td><span> {{ product.createTime | date }}</span></td>
              </tr>
              </tbody>
            </table>
          </div>
          <div v-show="index === 1">
            <el-form-item :label="`${type === 1 ? '付款' : '收款'}明细总金额:`" prop="amount">
              ￥{{ totalMoney.unitPrice | formatMoney }}
            </el-form-item>
            <el-form-item :label="title+'金额'" prop="amount">
              <oms-input v-model.number="form.amount" placeholder="请输入金额" type="text">
                <template slot="prepend">¥</template>
              </oms-input>
            </el-form-item>
            <perm label="advance-payable-attachment-upload">
              <el-form-item label="附件">
                <oms-upload :fileList="attachmentList" :formData="{ objectId: form.id, objectType: 'advancePayable'}"
                            @change="changeFiles"></oms-upload>
              </el-form-item>
            </perm>
            <el-form-item>
              <el-button :disabled="doing" type="success" @click="onSubmit">保存</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {erpOrder, PaymentPending} from '../../../../../resources';
import utils from '@/tools/utils';
import methodsMixin from '@/mixins/methodsMixin';
import Perm from '@/components/common/perm';

export default {
  name: 'addForm',
  components: {Perm},
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
      doing: false,
      index: 0,
      orderDetailList: [],
      detailLoading: false,
      createTimes: [],
      attachmentList: []
    };
  },
  computed: {
    PaymentMethod: function () {
      return this.$getDict('PaymentMethod');
    },
    tabList() {
      let {type, title} = this;
      let billWay = type === 1 ? '付款' : '收款';
      return [
        {name: `${billWay}明细`, key: 0},
        {name: `${title}金额`, key: 1}
      ];
    },
    totalMoney() {
      return this.orderDetailList.reduce(
        (pre, next) => {
          return {
            unitPrice: pre.unitPrice * pre.amount + next.unitPrice * next.amount,
            amount: 1
          };
        },
        {amount: 0, unitPrice: 0});
    }
  },
  watch: {
    defaultIndex(val) {
      this.resetForm();
      this.filterOrg();
      this.index = 0;
      this.orderDetailList = [];
    },
    totalMoney(val) {
      this.form.amount = val.unitPrice || 0.00;
    }
  },
  mounted: function () {
    this.filterOrg();
  },
  methods: {
    changeFiles: function (fileList) {
      let ids = [];
      fileList.forEach(file => {
        ids.push(file.attachmentId);
      });
      this.form.attachmentIdList = ids;
    },
    resetForm: function () {// 重置表单
      this.$refs['addForm'].resetFields();
      this.form.attachmentIdList = [];
      this.attachmentList = [];
    },
    formatPrice() {// 格式化单价，保留两位小数
      this.form.amount = utils.autoformatDecimalPoint(this.form.amount);
    },
    doClose: function () {
      this.$emit('close');
    },
    orgIdChange(val) {
      this.orderDetailList = [];
      if (!val) return;
      let params = {
        pageNo: 1,
        pageSize: 100,
        goodsType: '1',
        state: '1',
        isShowDetail: true
      };
      let orgId = this.$store.state.user.userCompanyAddress;
      params.orgId = this.type === 1 ? val : orgId;
      params.transactOrgId = this.type === 1 ? orgId : val;
      params.createStartTime = this.$formatAryTime(this.createTimes, 0);
      params.createEndTime = this.$formatAryTime(this.createTimes, 1);
      this.detailLoading = true;
      erpOrder.query(params).then(res => {
        let ary = [];
        res.data.list.forEach(i => {
          i.detailDtoList.forEach(c => {
            c.orderNo = i.orderNo;
            c.createTime = i.createTime;
          });
          ary = ary.concat(i.detailDtoList);
        });
        this.orderDetailList = ary;
        this.detailLoading = false;
      });
    },
    formatTime: function (date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    },
    createTimeChange() {
      if (!this.form.orgId) {
        return this.$notify.info({message: `请选择${this.title}单位`});
      }
      this.orgIdChange(this.form.orgId);
    },
    searchInOrder() {
      if (!this.form.orgId) {
        return this.$notify.info({message: `请选择${this.title}单位`});
      }
      this.orgIdChange(this.form.orgId);
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
        form.list = this.orderDetailList.map(m => {
          return {
            orderNo: m.orderNo,
            orderId: m.orderId,
            orderDetailId: m.id,
            money: m.unitPrice * m.amount
          };
        });
        form.attachmentIdList = this.form.attachmentIdList;
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
            message: error.response && error.response.data && error.response.data.msg || '网络异常',
            type: 'error'
          });
        });
      });
    }
  }
};
</script>
