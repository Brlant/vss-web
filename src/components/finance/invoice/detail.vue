<style lang="less" scoped>
  @import "../../../assets/mixins.less";

  @leftWidth: 0;
  .content-part {
    .content-left {
      width: @leftWidth;
    }
    .content-right {
      > h3 {
        left: @leftWidth;
      }
      left: @leftWidth;
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
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-right min-gutter">
        <h3>发票详情</h3>
        <el-row>
          <el-col :span="12">
            <oms-row label="疫苗厂商" :span="span">
              {{info.factoryName}}
            </oms-row>
            <oms-row label="发票号码" :span="span">
              {{info.invoiceNumber}}
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
              {{ info.status === 0 ? '未付款' : '已付款'}}
            </oms-row>
          </el-col>
        </el-row>
        <el-row>
          <div class="product-list-detail" v-if=form.list>
            <h3 style="background: #f1f1f1;overflow: hidden">
              <span style="float: left">付款明细</span>
            </h3>
            <table class="table">
              <thead>
              <tr>
                <th style="width: 300px">货品名称</th>
                <th>订单号</th>
                <th>应付金额</th>
                <th>创建时间</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="product in list">
                <td>
                  <span>{{product.goodsName}}</span>
                </td>
                <td>
                  <span>{{product.orderNo}}</span>
                </td>
                <td class="ar">
                  <span v-show="Number(product.billAmount)">¥{{product.billAmount | formatMoney}}</span>
                  <span v-if="!Number(product.billAmount)">-</span>
                </td>
                <td>
                  {{product.createTime | minute }}
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
  import { invoiceManage } from '@/resources';
  export default {
    props: {
      currentId: String,
      showDetail: Boolean
    },
    data () {
      return {
        span: 8,
        info: {}
      };
    },
    watch: {
      currentId (val) {
        if (!val) return;
        if (!this.showDetail) return;
        this.queryDetail();
      }
    },
    methods: {
      queryDetail () {
        invoiceManage.get(this.currentId).then(res => {
          this.info = res.data;
        });
      }
    }
  };
</script>
