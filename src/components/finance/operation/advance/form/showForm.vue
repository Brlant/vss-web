<style lang="scss" scoped>
@import "../../../../../assets/mixins.scss";

$leftWidth: 200px;

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

.btn-submit-save {
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  z-index: 1;
  text-align: center;
  padding: 15px;
}

.invoice-list {
  margin-left: 30px;

  .show-item {
    border-bottom: 1px solid #f1f1f1;
    line-height: 20px;

    .el-row {
      align-items: center;

      .el-col {
        padding-left: 5px;
        padding-right: 5px;
      }
    }

    &:hover {
      background: $dialog-left-bg;
    }
  }
}

.mb0 {
  margin-bottom: 0;
}

.delete-icon {
  &:hover {
    color: $activeColor
  }

  cursor: pointer;

  .el-icon-t-remove {
    vertical-align: middle;
    font-size: 20px;
  }
}
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">{{`${title}作业详情`}}</h2>
      </div>
      <div class="content-right min-gutter">
        <h3>{{`${title}作业详情`}}</h3>
        <div>
          <el-form ref="auditForm" label-width="100px" onsubmit="return false" style="padding-right: 20px">
            <el-form-item class="mb0" label="单据编号:">
              {{billInfo.id}}
            </el-form-item>
            <el-form-item :label="`${title}单位`" class="mb0">
              {{billInfo[type === 1 ? 'cdcName' : 'povName'] }}
            </el-form-item>
            <el-form-item :label="`${title}金额:`" class="mb0">
              ¥ {{billInfo.rechargeAmount | formatMoney}}
            </el-form-item>
            <el-form-item class="mb0" label="创建人:">
              {{billInfo.creatorName}}
            </el-form-item>
            <el-form-item class="mb0" label="创建时间:">
              {{billInfo.createTime | minute}}
            </el-form-item>
            <el-form-item class="mb0" label="状态:">
              {{getOrderStatus(billInfo)}}
            </el-form-item>
            <perm label="advance-payable-attachment-upload">
              <el-form-item class="mb0" label="附件:">
                <oms-upload :fileList="attachmentList" :formData="{ objectId:  billInfo.id, objectType:'advancePayable'}"
                            @change="changeFiles"></oms-upload>
              </el-form-item>
            </perm>
            <perm label="advance-payable-attachment-watch">
              <el-form-item class="mb0" label="附件:">
                <attachment-lists :objectId="billInfo.id" :objectType="'advancePayable'"
                                  attachmentIdList=""
                                  style="padding-top: 8px"
                                  update-permission="'no'"></attachment-lists>
              </el-form-item>
            </perm>
            <div v-show="list.length">
              <el-form-item :label="`${title}明细`" class="mb0">
                (共{{list.length}}条)，总金额: ¥{{totalMoney.money | formatMoney}}
              </el-form-item>
              <el-table :data="list" class="header-list" style="width: 100%">
                <el-table-column label="疫苗名称" min-width="220" prop="orgGoodsName"></el-table-column>
                <el-table-column label="订单号" min-width="140" prop="orderNo"></el-table-column>
                <el-table-column label="金额" min-width="80" prop="money">
                  <template slot-scope="scope"> ¥{{ scope.row.money | formatMoney}}</template>
                </el-table-column>
                <el-table-column label="发生时间" min-width="150" prop="createTime">
                  <template slot-scope="scope"> {{ scope.row.createTime | time }}</template>
                </el-table-column>
              </el-table>
            </div>
            <el-form-item style="margin-top: 10px">
              <div v-if="type===1">
                <perm v-show="billInfo.status === '0'" :label="perms[1]">
                  <el-button :disabled="doing" plain type="success" @click="audited('通过审核')">审核通过</el-button>
                </perm>
                <perm :label="perms[2]">
                  <el-button v-show="isShowButton" :disabled="doing" plain @click="cancelItem">取消</el-button>
                </perm>
              </div>
              <div v-else>
                <perm v-show="billInfo.status === '3'" :label="perms[1]">
                  <el-button :disabled="doing" plain type="success" @click="audited('通过审核')">审核通过</el-button>
                </perm>
                <perm v-show="billInfo.status === '1'" :label="perms[2]">
                  <el-button :disabled="doing" plain type="success" @click="audited('确认收款')">收款确认</el-button>
                </perm>
                <perm :label="perms[3]">
                  <el-button v-show="isShowButton" :disabled="doing" plain @click="cancelItem">取消</el-button>
                </perm>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {http, OmsAttachment} from '@/resources';
import attachmentLists from './../../../../common/attachmentList.vue';
import Perm from '@/components/common/perm';

export default {
  components: {
    Perm,
    attachmentLists
  },
  name: 'auditForm',
  loading: false,
  props: {
    billInfo: Object,
    action: {
      type: String,
      default: ''
    },
    title: String,
    type: Number,
    getOrderStatus: Function,
    perms: Array
  },
  data: function () {
    return {
      doing: false,
      list: [],
      attachmentList: [],
      attachmentIdList: []
    };
  },
  computed: {
    isShowButton() {
      const {type, billInfo} = this;
      const status = billInfo.status;
      return type === 1 && status === '0' || type === 2 && (status === '1' || status === '3');
    },
    totalMoney() {
      return this.list.reduce(
        (pre, next) => ({
          money: pre.money + next.money
        }),
        {money: 0});
    }
  },
  watch: {
    billInfo(val) {
      this.list = [];
      if (!val.id) return;
      this.queryDetail(val.id);
      this.getFileList(val.id);
    }
  },
  methods: {
    changeFiles: function (fileList) {
      let ids = [];
      fileList.forEach(file => {
        ids.push(file.attachmentId);
      });
      this.billInfo.attachmentIdList = ids;
    },
    queryDetail(key) {
      http.get(`/advance-payment/${key}`).then(res => {
        this.list = res.data.detailList;
      });
    },
    getFileList: function (val) {
      if (!val) return;
      OmsAttachment.queryOneAttachmentList(val, 'advancePayable').then(res => {
        this.attachmentList = res.data;
        let ids = [];
        this.attachmentList.forEach(val => {
          ids.push(val.attachmentId);
        });
        this.attachmentIdList = ids;
      });
    },
    doClose: function () {
      this.$emit('close');
    },
    audited: function (title = '审核') {
      if (this.doing) return;
      this.$confirmOpera(`是否${title}?`, () => {
        this.doing = true;
        let {type, $http, billInfo} = this;
        let url = {
          0: `/advance-payment/pov/audit/${billInfo.id}`,
          3: `/advance-payment/cdc/audit/${billInfo.id}`,
          1: `/advance-payment/confirm/${billInfo.id}`
        };
        let httpRequest = $http.put(url[billInfo.status]);
        this.$httpRequestOpera(httpRequest, {
          successTitle: `${title}成功`,
          errorTitle: `${title}失败`,
          success: res => {
            this.doing = false;
            this.$emit('change');
            this.$emit('right-close');
          },
          error: res => {
            this.doing = false;
            this.$emit('change');
          }
        });
      });
    },
    cancelItem() {
      this.$confirmOpera('确认取消' + this.title + '作业？', () => {
        this.doing = true;
        let httpRequest = this.$http.put(`/advance-payment/cancel/${this.billInfo.id}`);
        this.$httpRequestOpera(httpRequest, {
          successTitle: '取消成功',
          errorTitle: '取消失败',
          success: res => {
            this.doing = false;
            this.$emit('change');
            this.$emit('right-close');
          },
          error: res => {
            this.doing = false;
            this.$emit('change');
          }
        });
      });
    }
  }
};
</script>
