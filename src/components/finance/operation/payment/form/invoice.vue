<style lang="less">
  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
  }
</style>
<template>
  <div>
    <el-select filterable remote placeholder="请输入发票号搜索发票" multiple :remote-method="queryInvoices" :clearable="true"
               v-model="invoiceIds" @change="change" popperClass="good-selects" style="width: 100%">
      <el-option :value="item.id" :key="item.id" :label="item.invoiceNumber"
                 v-for="item in invoices">
        <div style="overflow: hidden">
          <span class="pull-left" style="clear: right">{{item.invoiceNumber}}</span>
        </div>
        <div style="overflow: hidden">
          <span class="select-other-info pull-left">疫苗厂商 {{item.factoryName}}</span>
          <span class="select-other-info pull-left">金额 ￥{{item.amount | formatMoney}}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script>
  import { invoiceManage } from '@/resources';

  export default {
    props: {
      factoryId: ''
    },
    data () {
      return {
        invoices: [],
        invoiceIds: []
      };
    },
    watch: {
      factoryId (val) {
        this.invoices = [];
        if (!val) return;
        this.queryInvoices();
      }
    },
    methods: {
      queryInvoices (query) {
        let params = {
          factoryId: this.factoryId,
          invoiceNumber: query
        };
        invoiceManage.query(params).then(res => {
          this.invoices = res.data.list;
        });
      },
      change (val) {
        let ary = this.invoices.filter(f => val.some(s => s === f.id));
        let amount = 0;
        ary.forEach(i => {
          amount += Number(i.amount);
        });
        this.$emit('changeAmount', val, amount);
      }
    }
  };
</script>
