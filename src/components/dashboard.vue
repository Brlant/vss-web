<style lang="scss" scoped="">
  @import "../assets/mixins.scss";

  $card-box-border-color: #eee;
  .card-box {
    border: 1px solid $card-box-border-color;
    margin-bottom: 20px;
    .card-box-header {
      padding: 15px 20px;
      border-bottom: 1px solid $card-box-border-color;
      background: $card-box-border-color*1.05;
    }
    .card-box-body {
      overflow-x: hidden;
      padding: 0;
      background: #fff;
      .el-row {
        border-bottom: 1px solid $card-box-border-color;
        padding-top: 5px;
        padding-bottom: 4px;
        &:last-child {
          border-bottom: 0;
        }
      }
      .list-item {
        cursor: pointer;
        &:hover {
          background: #f5f5f5
        }
      }
    }
  }

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

  .no-info {
    font-size: 12px;
    padding: 10px 20px;
  }

  .exception-list {
    cursor: pointer;
  }
</style>

<template>
  <div class="container">
    <div class="card-box" v-if="level !== 3">
      <div class="card-box-header">采购订单异常</div>
      <div class="card-box-body">
        <div v-if="!orderList.length" class="no-info">
          暂无异常订单
        </div>
        <el-row v-else="" v-for="(item, index) in orderList" :key="item.id" type="flex" :gutter="15"
                class="list-item exception-list" @click.native="goToOrderUrl(item)">
          <el-col :span="4">
            {{ item.createTime | date}}
          </el-col>
          <el-col :span="4">
            {{ item.orderNo}}
          </el-col>
          <el-col :span="8">
            {{ item.orgName}}
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="card-box">
      <div class="card-box-header">接种点要货需求</div>
      <div class="card-box-body">
        <div v-if="!requirementList.length" class="no-info">
          暂无接种点要货需求单
        </div>
        <el-row v-else="" class="list-item" v-for="(item, index) in requirementList" :key="item.id" type="flex"
                :gutter="15"
                @click.native="goUrl(item)">
          <el-col :span="4">
            {{ item.applyTime | date}}
          </el-col>
          <el-col :span="4">
            {{ item.id}}
          </el-col>
          <el-col :span="8">
            {{ item.povName}}
          </el-col>
        </el-row>
      </div>
    </div>
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
        <el-row v-else=""  v-for="(item, index) in stockList" :key="item.id" type="flex" :gutter="15"
                class="list-item exception-list"
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
                class="list-item exception-list"
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
  import {erpOrder, pullSignal} from '@/resources';
  import ElRow from 'element-ui/packages/row/src/row';

  export default {
    components: {ElRow},
    data: function () {
      return {
        orderList: [],
        requirementList: [],
        stockList: [],
        licenceList: []
      };
    },
    mounted() {
      if (this.level !== 3) {
        this.getOrderList();
      }
      this.getRequirementList();
      this.getErpStockList();
      this.getLicenceList();
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      level() {
        return this.$store.state.orgLevel;
      }
    },
    watch: {
      user() {
        if (this.level !== 3) {
          this.getOrderList();
        }
      },
      level() {
        this.getRequirementList();
      }
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
      getLicenceList() {
        this.$http.get('order-licence/overdue/licence').then(res => {
          this.licenceList = res.data;
        });
      },
      getRequirementList: function () {
        if (typeof this.level !== 'number') return;
        let params = {
          pageNo: 1,
          pageSize: 5
        };
        let orgId = this.user.userCompanyAddress;
        if (!orgId) return;
        if (this.level === 3) {
          Object.assign(params, {povId: orgId, status: 0});
        } else {
          Object.assign(params, {cdcId: orgId, status: 1});
        }
        pullSignal.query(params).then(res => {
          this.requirementList = res.data.list;
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
      goUrl: function (item) {
        if (!item.id) return;
        if (this.level === 3) {
          this.$router.push({path: '/pov/request', query: {id: item.id}});
        } else {
          this.$router.push({path: `/sale/pov/${item.id}`});
        }
      },
      goToOrderUrl(item) {
        if (!item.id) return;
        if (this.level === 1) {
          this.$router.push(`purchase/order/one/class/${item.id}`);
        } else {
          this.$router.push(`purchase/order/two/class/${item.id}`);
        }
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

