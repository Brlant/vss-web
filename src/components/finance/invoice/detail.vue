<style lang="scss" scoped>
@import "../../../assets/mixins.scss";

$leftWidth: 0;
.content-part {
  .content-left {
    width: $leftWidth;
  }

  .content-right {
    > h3 {
      left: $leftWidth;
    }

    left: $leftWidth;
  }
}

</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-right min-gutter">
        <h3>发票详情</h3>
        <el-row>
          <el-col :span="12">
            <oms-row :span="span" label="疫苗厂商">
              {{info.factoryName}}
            </oms-row>
            <oms-row :span="span" label="发票号码">
              {{info.invoiceNumber}}
            </oms-row>
            <oms-row :span="span" label="待付金额">
              ￥{{(info.amount - info.paidAmount) | formatMoney}}
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="发票类型">
              <dict :dict-group="'invoiceType'" :dict-key="info.type"></dict>
            </oms-row>
            <oms-row label="发票金额">
              ￥{{ info.amount | formatMoney}}
            </oms-row>
            <oms-row label="状态">
              {{ info.status === 0 ? '未付清' : '已付清'}}
            </oms-row>
          </el-col>
        </el-row>
        <el-row>
          <div v-if="info.list" class="product-list-detail">
            <h3 style="background: #f1f1f1;overflow: hidden">
              <span style="float: left">付款明细</span>
              <span>(共{{info.list.length}}条)</span>
            </h3>
            <table class="table">
              <thead>
              <tr>
                <th style="width: 250px">疫苗名称</th>
                <th>数量</th>
                <th>订单号</th>
                <th>应付金额</th>
                <th>待付金额</th>
                <th>发生时间</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="product in info.list">
                <td>
                  <span>{{product.goodsName}}</span>
                </td>
                <td>
                  <span>{{product.goodsCount}}</span>
                </td>
                <td>
                  <span>{{product.orderNo}}</span>
                </td>
                <td>
                  <span v-show="Number(product.billAmount)">¥{{product.billAmount | formatMoney}}</span>
                  <span v-if="!Number(product.billAmount)">-</span>
                </td>
                <td>
                  <span>¥{{ product.billAmount | formatMoney}}</span>
                </td>
                <td>
                  {{product.createTime | date }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import {invoiceManage} from '@/resources';

export default {
  props: {
    currentId: String,
    showDetail: Boolean
  },
  data() {
    return {
      span: 8,
      info: {}
    };
  },
  watch: {
    currentId(val) {
      this.info = {};
      if (!val) return;
      if (!this.showDetail) return;
      this.queryDetail();
    }
  },
  methods: {
    queryDetail() {
      invoiceManage.get(this.currentId).then(res => {
        this.info = res.data;
      });
    }
  }
};
</script>
