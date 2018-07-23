<style lang="scss" scoped="">

  .home-btn-banner {

    .home-btn-wrap {
      width: 100%;
      padding: 25px 0;
      font-size: 2.5em;
      i {
        font-size: 1em;
        margin-right: 10px;

      }
    }
  }
</style>

<template>
  <div class="container">
    <!--异常的采购订单信息-->
    <purchase-order-exception/>

    <!--接种点要货需求-->
    <dev-demand/>

    <div class="card-box">
      <div class="card-box-header">货品效期提醒</div>
      <div class="card-box-body">
        <el-row class="list-item" type="flex"
                :gutter="15"
        >
          <el-col :span="8">
            货主货品名称
          </el-col>
          <el-col :span="8">
            生产厂商
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
          暂无效期货品
        </div>
        <el-row v-else="" v-for="(item, index) in stockList" :key="item.id" type="flex" :gutter="15"
                class="list-item"
                :class="formatStockRowClass(item)">
          <el-col :span="8">
            {{ item.goodsName}}
          </el-col>
          <el-col :span="8">
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
      </div>

    </div>
    <div class="card-box">
      <div class="card-box-header">证照过期</div>
      <div class="card-box-body">
        <el-row class="list-item" type="flex"
                :gutter="15">
          <el-col :span="8">
            供货厂商
          </el-col>
          <el-col :span="4">
            证照类型
          </el-col>
          <el-col :span="4">
            有效期
          </el-col>
          <el-col :span="4">
            状态
          </el-col>
        </el-row>
        <div v-if="!licenceList.length" class="no-info">
          暂无证照过期厂商
        </div>
        <el-row v-else="" v-for="(item, index) in licenceList" :key="item.id" type="flex" :gutter="15"
                class="list-item"
                :class="formatRowClass(item)">
          <el-col :span="8">
            {{ item.orgName}}
          </el-col>
          <el-col :span="4">
            {{ item.name}}
          </el-col>
          <el-col :span="4">
          {{ item.validEndTime | date}}
        </el-col>
          <el-col :span="4" v-if="item.expireStatus=='2'">
            已过期
          </el-col>
          <el-col :span="4" v-else>
            近效期
          </el-col>
        </el-row>
      </div>
    </div>
  </div>


</template>
<script>
  import PurchaseOrderException from './purchase-order-exception';
  import DevDemand from './dev-demand';
  export default {
    components: {PurchaseOrderException, DevDemand},
    data: function () {
      return {
        stockList: [],
        licenceList: []
      };
    },
    mounted() {
      this.getErpStockList();
      this.getLicenceList();
    },
    methods: {
      formatRowClass(item) {
        if (item.expireStatus === '1') {
          return 'effective-row';
        }
        if (item.expireStatus === '2') {
          return 'danger-row';
        }
      },
      formatStockRowClass(item) {
        if (item.status === '近效期') {
          return 'effective-row';
        }
        if (item.status === '已过期') {
          return 'danger-row';
        }
      },
      getLicenceList() {
        this.$http.get('order-licence/overdue/licence').then(res => {
          this.licenceList = res.data;
        });
      },
      getErpStockList: function () {
        this.queryErpStockOverdue().then(res => {
          if (res.data[0]) {
            this.stockList = res.data[0].map((item) => {
              item.status = '已过期';
              return item ;
            });
          }
          if (res.data[1]) {
            this.stockList = this.stockList.concat(res.data[1].map((item) => {
              item.status = '近效期';
              return item ;
            }));
          }
        });
      },
      queryErpStockOverdue: function () {
        return this.$http.get('/erp-stock/overdue');
      },
      goToFactory(item) {
        let params = {
          followOrgId: item.orgId
        };
        this.$http('/vendor-info', {params}).then(res => {
          this.relationId = res.data.list[0].id;
          this.$router.push(`resource/firm/${this.relationId}`);
        });
      }
    }
  };

</script>

