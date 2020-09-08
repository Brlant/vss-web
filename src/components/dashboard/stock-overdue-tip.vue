<template>
  <card-box title="疫苗效期提醒">
    <el-row :gutter="15" class="list-item"
            type="flex"
    >
      <el-col :span="10">
        货主疫苗名称
      </el-col>
      <el-col :span="8">
        生产单位
      </el-col>
      <el-col :span="4">
        批号
      </el-col>
      <el-col :span="4">
        有效期
      </el-col>
      <el-col :span="2">
        数量
      </el-col>
      <el-col :span="2">
        状态
      </el-col>
    </el-row>
    <div v-if="!stockList.length" class="no-info">
      暂无效期疫苗
    </div>
    <el-row v-for="(item, index) in stockList" v-else="" :key="item.id" :class="formatStockRowClass(item)" :gutter="15"
            class="list-item"
            type="flex">
      <el-col :span="8" class="R">
        {{ item.goodsName}}
      </el-col>
      <el-col :span="8" class="R">
        {{ item.factoryName}}
      </el-col>
      <el-col :span="4">
        {{ item.batchNumber}}
      </el-col>
      <el-col :span="4">
        {{ item.expiryDate | date}}
      </el-col>
      <el-col :span="2">
        {{ item.availableCount}}
      </el-col>
      <el-col :span="2">
        {{ item.status}}
      </el-col>
    </el-row>
  </card-box>
</template>
<script>
export default {
  data: function () {
    return {
      stockList: []
    };
  },
  mounted() {
    this.getErpStockList();
  },
  methods: {
    getErpStockList: function () {
      this.queryErpStockOverdue().then(res => {
        if (res.data[0]) {
          this.stockList = res.data[0].map((item) => {
            item.status = '已过期';
            return item;
          });
        }
        if (res.data[1]) {
          this.stockList = this.stockList.concat(res.data[1].map((item) => {
            item.status = '近效期';
            return item;
          }));
        }
      });
    },
    queryErpStockOverdue: function () {
      return this.$http.get('/erp-stock/overdue');
    },
    formatStockRowClass(item) {
      if (item.status === '近效期') {
        return 'effective-row';
      }
      if (item.status === '已过期') {
        return 'danger-row';
      }
    }
  }
};
</script>
