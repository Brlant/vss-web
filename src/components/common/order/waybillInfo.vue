<style lang="scss" scoped>
  .qp-box {
    &.border {
      margin-bottom: 20px;
      border: 1px solid #eee;
      border-radius: 5px;
      padding: 0 20px 10px;
    }

    .title {
      padding: 4px;
      background: #eef2f3;
      text-align: center;
    }

    .oms-col, .oms-row {
      font-size: 14px;
    }

    .order-list-header {
      background: #eef1f6;
      min-height: 30px;
    }
  }

</style>
<template>
  <div>
    <div v-if="loadingData">
      <oms-loading :loading="loadingData"></oms-loading>
    </div>
    <div v-else-if="!waybillInfos.length" class="empty-info">暂无信息</div>
    <div v-else>
      <div class="qp-box" :class="{'border': waybillInfos.length > 1}" v-for="item in waybillInfos">
        <h2 class="title" v-show="waybillInfos.length > 1">运单号:{{ item.orderCode }}</h2>
        <h2>基本信息</h2>
        <el-row>
          <oms-col label="运单号" :rowSpan="6" :isShow="true" v-show="waybillInfos.length===1">{{item.orderCode}}</oms-col>
          <oms-col label="车牌号" :rowSpan="6" :isShow="true">{{item.plateNumber}}</oms-col>
          <oms-col label="启运时间" :rowSpan="6" :isShow="true">{{item.departTime | time}}</oms-col>
          <oms-col label="结束时间" :rowSpan="6" :isShow="true">{{item.arriveTime | time}}</oms-col>
        </el-row>
        <hr class="hr"/>
        <template v-if="item.arriveTime">
          <h2>交接数据</h2>
          <div v-show="item.handOverList.length">
            <chart-line-hand ref="vhDevTempLineHand" class="mt-10" :dataList="item.handOverList"
                             :devInfo="item"></chart-line-hand>
          </div>
          <div v-show="!item.handOverList.length" class="ml-15">暂无数据</div>
          <hr class="hr"/>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import ChartLineHand from './ccs/chart-line-hand';

  export default {
    props: {
      currentOrder: Object,
      index: Number,
      showBigMap: Function
    },
    components: {ChartLineHand},
    data: function () {
      return {
        loadingData: false,
        waybillInfos: [],
        showIndex: -1
      };
    },
    watch: {
      index(val) {
        this.waybillInfos = [];
        this.showIndex = -1;
        if (val !== 11) return;
        this.loadingData = true;
        this.queryWaybillInfo();
      }
    },
    methods: {
      queryWaybillInfo() {
        this.showIndex = 1;
        this.$http.get(`/order-monitor/${this.currentOrder.id}/waybill`).then(res => {
          res.data.devDtoList.forEach(dto => {
            dto.devList = [];
            dto.tempDataList = [];
            dto.vehicleDevList = [];
            dto.vehicleDevtempDataList = [];
            dto.points = [];
            dto.handOverList = [];
            // 交接数据
            this.queryHandOverList(dto);
          });
          this.loadingData = false;
          this.waybillInfos = res.data.devDtoList;
        }).catch(() => {
          this.loadingData = false;
        });
      },
      queryHandOverList(dto) {
        if (!dto.arriveTime) return;
        this.$http.get(`/order-monitor/handover-data/${dto.orderCode}`).then(res => {
          // 取最后一条数据
          let item = res.data.pop();
          dto.handOverList = item && [item] || [];
        }).catch(() => {
        });
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      }
    }
  };
</script>
