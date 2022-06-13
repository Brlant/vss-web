<template>
  <card-box v-show="orderList.length" title="采购订单异常">
    <div v-if="!orderList.length" class="no-info">
      暂无异常订单
    </div>
    <el-row v-for="(item, index) in orderList" v-else :key="item.id" :gutter="15" class="list-item list-item--pointer"
            type="flex" @click.native="goToOrderUrl(item)">
      <el-col :span="4">
        {{ item.createTime | date}}
      </el-col>
      <el-col :span="4" class="R">
        {{ item.orderNo}}
      </el-col>
      <el-col :span="8">
        {{ item.orgName}}
      </el-col>
    </el-row>
  </card-box>
</template>
<script>
import {erpOrder} from '@/resources';

export default {
  data: function () {
    return {
      orderList: []
    };
  },
  mounted() {
    this.getOrderList();
  },
  watch: {
    level() {
      this.getOrderList();
    }
  },
  methods: {
    getOrderList: function () {
      let param = Object.assign({}, this.filters, {
        pageNo: 1,
        pageSize: 5,
        type: 0,
        searchType: 1
      });
      erpOrder.queryOrderExcepiton(param).then(res => {
        this.orderList = res.data.list;
      });
    },
    goToOrderUrl(item) {
      if (!item.id) return;
      if (item.goodsType === 0) {
        this.$router.push(`purchase/order/one/class/${item.id}`);
      } else {
        this.$router.push(`purchase/order/two/class/${item.id}`);
      }
    }
  }
};
</script>
