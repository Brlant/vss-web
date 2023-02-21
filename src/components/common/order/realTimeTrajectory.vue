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
        <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane  :label="item.tmsWaybillNumber" :name="item.tmsWaybillNumber"></el-tab-pane>
        </el-tabs> -->
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
    //   activeName: 'second',
      loadingData: false,
      waybillInfos: [],
      waybillNumber:'',
      points:[
        // {
        //     lnglat:[116.368904,39.913423],
        //     name:'"浦东新区沪南公路5395号4号楼南墙外面底楼预防接种门诊"',
        //     time:'"2023-02-20 17:20:12"'
        // },
        // {
        //     lnglat:[116.382122,39.901176],
        //     name:'"浦东新区沪南公路5395号4号楼南墙外面底楼预防接种门诊"',
        //     time:'"2023-02-20 17:20:12"'
        // },
        // {
        //     lnglat:[116.387271,39.912501],
        //     name:'"浦东新区沪南公路5395号4号楼南墙外面底楼预防接种门诊"',
        //     time:'"2023-02-20 17:20:12"'
        // },
        // {
        //     lnglat:[116.398258,39.904600],
        //     name:'"浦东新区沪南公路5395号4号楼南墙外面底楼预防接种门诊"',
        //     time:'"2023-02-20 17:20:12"'
        // },
      ],   // 当前展示的轨迹
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
      // this.$http.get(`/logistics-monitor/${this.currentOrder.id}/track/list`).then(res => {
      this.loadingData = true;
      this.$http.get(`/erp-order/trackByOrderNo/${this.currentOrder.orderNo}`).then(res => {
        this.loadingData = false;
       
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
          this.waybillInfos = res.data
          // console.log(this.points,'points17')
          // console.log(this.waybillInfos,'waybillInfos')
          // console.log(this.waybillNumber,'waybillNumber')
      }).catch(() => {
        this.loadingData = false;
      });
    },
    // //  运单号切换
    // handleClick(tab, event) {
    //     console.log(tab, event);

    // }
  }
}
</script>
