<template>
  <card-box title="采购订单异常" v-if="level !== 3">
    <div v-if="!orderList.length" class="no-info">
      暂无异常订单
    </div>
    <el-row v-else="" v-for="(item, index) in orderList" :key="item.id" type="flex" :gutter="15"
            class="list-item list-item--pointer" @click.native="goToOrderUrl(item)">
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
  import { erpOrder } from '@/resources';

  export default {
    data: function () {
      return {
        orderList: []
      };
    },
    mounted () {
      this.getOrderList();
    },
    computed: {
      level () {
        return this.$store.state.orgLevel;
      }
    },
    watch: {
      level () {
        this.getOrderList();
      }
    },
    methods: {
      getOrderList: function () {
        if (this.level === 3) return;
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
      goToOrderUrl (item) {
        if (!item.id) return;
        if (this.level === 1) {
          this.$router.push(`purchase/order/one/class/${item.id}`);
        } else {
          this.$router.push(`purchase/order/two/class/${item.id}`);
        }
      }
    }
  };
</script>
