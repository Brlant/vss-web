<style>

</style>
<template>
  <div>
    <div v-if="loadingData">
      <oms-loading :loading="loadingData"></oms-loading>
    </div>
    <div v-else-if="!waybillInfos.length" class="empty-info">暂无信息</div>
    <div  v-else>
        <h2>
          <span>配送轨迹</span>
        </h2>
        <div>
        <el-tabs type="card" v-model="waybillNumber" @tab-click="handleClick">
            <el-tab-pane v-for="(item,index) in waybillInfos" :key="index"  :label="item.vssTmsOrder.tmsWaybillNumber" :name="item.vssTmsOrder.tmsWaybillNumber"></el-tab-pane>
        </el-tabs>
        <div >
          <map-path :mapStyle="{height: '350px', width: '750px',margin: '0 auto'}"  :points="points"  :vid="waybillNumber"></map-path>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import MapPath from './track/map-path';

export default {
  props: {
    currentOrder: Object,
    index: Number,
  },
  components: {
    MapPath,
  },
  data() {
    return {
      loadingData: false,
      waybillInfos: [],
      waybillNumber:'',
      points:[],   // 当前展示的轨迹
      showIndex: -1,
    }
  },
  watch: {
    index(val) {
      this.waybillInfos = [];
      this.showIndex = -1;
      if (val !== 18) return;
      this.queryWayBillPath();
    }
  },
  methods: {
    queryWayBillPath() {
      this.loadingData = true;
      this.$http.get(`/erp-order/trackByOrderNo/${this.currentOrder.orderNo}`).then(res => {
        this.loadingData = false;
        this.waybillInfos = res.data
        this.points = res.data.length && res.data[0].trackDtoList.map((m, index) => {
          return {
                lnglat: [m.longitude, m.latitude],
                time: this.$moment(m.collectionTime).format('YYYY-MM-DD HH:mm:ss'),
                name: this.currentOrder.warehouseAddress
              };
          })|| [];
          if(res.data.length && res.data[0].vssTmsOrder){
            this.waybillNumber = res.data[0].vssTmsOrder.tmsWaybillNumber
          }else{
            this.waybillNumber = ''
          }
      }).catch(() => {
        this.loadingData = false;
      });
    },
    //  运单号切换
    handleClick(tab) {
      this.waybillNumber = this.waybillInfos[tab.index].vssTmsOrder.tmsWaybillNumber
      this.points = this.waybillInfos.length && this.waybillInfos[tab.index].trackDtoList.map((m, index) => {
          return {
                lnglat: [m.longitude, m.latitude],
                time: this.$moment(m.collectionTime).format('YYYY-MM-DD HH:mm:ss'),
                name: this.currentOrder.warehouseAddress
              };
          })|| [];
    }
  }
}
</script>
