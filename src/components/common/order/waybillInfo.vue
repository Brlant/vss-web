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
        <h2 class="title" v-show="waybillInfos.length > 1">运单号:{{ item.waybillNumber }}</h2>
        <h2>基本信息</h2>
        <el-row>
          <oms-col label="运单号" :rowSpan="6" :isShow="true" v-show="waybillInfos.length===1">{{item.waybillNumber}}
          </oms-col>
          <oms-col label="车牌号" :rowSpan="6" :isShow="true">{{item.licensePlate}}</oms-col>
          <oms-col label="启运时间" :rowSpan="6" :isShow="true">{{item.shipmentTime | time}}</oms-col>
          <oms-col label="结束时间" :rowSpan="6" :isShow="true">{{item.completeTime | time}}</oms-col>
        </el-row>
        <hr class="hr"/>
        <template v-if="item.completeTime">
          <h2>交接数据</h2>
          <div v-show="item.handOverList.length">
            <chart-line-hand ref="vhDevTempLineHand" class="mt-10" :dataList="item.handOverList"
                             :devInfo="item"></chart-line-hand>
          </div>
          <div v-show="!item.handOverList.length">暂无数据</div>
          <hr class="hr"/>
        </template>
        <h2>设备信息</h2>
        <el-row>
          <div class="order-list clearfix" style="padding-top: 10px">
            <el-row class="order-list-header">
              <el-col :span="8">编码</el-col>
              <el-col :span="8" v-show="!item.completeTime">最新数据</el-col>
            </el-row>
            <div v-if="!item.devList || (item.devList && !item.devList.length)" class="empty-type-info mini">暂无数据</div>
            <div v-else class="order-list-body flex-list-dom">
              <div class="order-list-item no-pointer order-list-item-bg" :key="index"
                   v-for="(item, index) in item.devList">
                <el-row>
                  <el-col :span="8">{{item.devCode}}</el-col>
                  <el-col :span="8" v-show="!item.completeTime">
                    <el-tooltip effect="dark" :content="formatTime(item.recordDate)" placement="top">
                      <span>{{$formatDevData(item, $formatDevType(item))}}</span>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </div>
              <chart-line ref="devTempLine" class="mt-10"
                          :dataList="item.tempDataList" :devInfo="item"></chart-line>
            </div>
          </div>
        </el-row>
        <hr class="hr"/>
        <!--        <h2>车辆信息</h2>-->
        <!--        <el-row>-->
        <!--          <div v-if="!item.vehicleDevList || (item.vehicleDevList && !item.vehicleDevList.length)"-->
        <!--               class="empty-type-info mini">-->
        <!--            暂无信息-->
        <!--          </div>-->
        <!--          <div v-else>-->
        <!--            <h3>车牌号:{{item.plateNumber}}</h3>-->
        <!--            <div class="order-list clearfix" style="padding-top: 10px">-->
        <!--              <el-row class="order-list-header">-->
        <!--                <el-col :span="6">名称</el-col>-->
        <!--                <el-col :span="6">编码</el-col>-->
        <!--                <el-col :span="6">类型</el-col>-->
        <!--                <el-col :span="6" v-show="!item.completeTime">最新数据</el-col>-->
        <!--              </el-row>-->
        <!--              <div v-if="!item.vehicleDevList.length" class="empty-type-info mini">暂无数据</div>-->
        <!--              <div v-else class="order-list-body flex-list-dom">-->
        <!--                <div class="order-list-item no-pointer order-list-item-bg" :key="index"-->
        <!--                     v-for="(item, index) in item.vehicleDevList">-->
        <!--                  <el-row>-->
        <!--                    <el-col :span="6">{{item.relationName}}</el-col>-->
        <!--                    <el-col :span="6">{{item.devCode}}</el-col>-->
        <!--                    <el-col :span="6">{{tempTypeList[item.devType]}}</el-col>-->
        <!--                    <el-col :span="6" v-show="!item.completeTime">-->
        <!--                      <el-tooltip effect="dark" :content="formatTime(item.recordDate)" placement="top">-->
        <!--                        <span>{{$formatDevData(item, $formatDevType(item))}}</span>-->
        <!--                      </el-tooltip>-->
        <!--                    </el-col>-->
        <!--                  </el-row>-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--            <chart-line ref="vhDevTempLine" class="mt-10" :dataList="item.vehicleDevtempDataList"-->
        <!--                        :devInfo="item"></chart-line>-->
        <!--          </div>-->
        <!--        </el-row>-->
        <!--        <hr class="hr"/>-->
        <h2>
          <span>配送轨迹</span>
          <span @click="showBigMap(item)" class="des-btn">
            <a href="#" class="btn-circle" @click.prevent="">
                 <i class="el-icon-zoom-in"></i></a>查看大图
          </span>
        </h2>
        <div>
          <map-path :points="item.points" :vid="item.waybillNumber" :mapStyle="{
          height: '300px', width: '600px',margin: '0 auto'}"></map-path>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ChartLine from './ccs/chart-line';
  import ChartLineHand from './ccs/chart-line-hand';
  import MapPath from './tms/map-path';

  export default {
    props: {
      currentOrder: Object,
      index: Number,
      showBigMap: Function
    },
    components: {ChartLine, MapPath, ChartLineHand},
    data: function () {
      return {
        loadingData: false,
        waybillInfos: [],
        showIndex: -1,
        tempTypeList: ['有线温度计', '无线温度计', '冷柜温度计', '车头温度计', '湿度计']
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
        // this.currentOrder.id = 'FUNoAEWFMjnSXXULMF4'; // FUNoAEWFMjnSXXULMF4 // UwcT0WA04cbefCQGO9Z
          this.$http.get(`/logistics-monitor/${this.currentOrder.id}/waybill`).then(res => {
            res.data.forEach(dto => {
              dto.devList = dto.devCodeList;
            dto.tempDataList = [];
            dto.vehicleDevList = [];
            dto.vehicleDevtempDataList = [];
            dto.points = [];
            dto.handOverList = [];
            //交接数据
            this.queryHandOverList(dto);
            // 设备
              dto.devList.forEach(i => this.queryDevTempData(i, dto));
          });
          this.loadingData = false;
            this.waybillInfos = res.data;
          this.queryWayBillPath(this.waybillInfos);
        }).catch(() => {
          this.loadingData = false;
        });
      },
      // 查询设备列表的温度数据
      queryDevTempData(item, dto) {
        let params = Object.assign({
          devCode: item.devCode,
          devId: item.ccsDevId,
          valType: '1'
        }, this.getTimeParams(dto.shipmentTime, dto.completeTime));
          this.$http.get('/logistics-monitor/gainDeviceReportDatas', {params}).then(res => {
          dto.tempDataList.push({
            name: item.devCode,
            tempData: res.data.ccsDevDataRecordDTOList || []
          });
        });
      },
      queryWayBillPath(waybillInfos) {
          this.$http.get(`/logistics-monitor/${this.currentOrder.id}/track/list`).then(res => {
          waybillInfos.forEach(i => {
            let ary = res.data && res.data.filter(f => f.waybillNo === i.waybillNumber) || [];
            i.points = ary.length && ary[0].logDtos.map(m => ({
              lnglat: [m.trackLongitude, m.trackLatitude],
              time: this.$moment(m.positioningTime).format('YYYY-MM-DD HH:mm:ss'),
              name: this.currentOrder.warehouseAddress
            })) || [];
          });
        }).catch(() => {
        });
      },
      queryHandOverList(dto) {
        if (!dto.completeTime) return;
        this.$http.get(`/logistics-monitor/handover-data/${dto.waybillNumber}`).then(res => {
          dto.handOverList = res.data;
        }).catch(() => {
        });
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      },
      getTimeParams(startTime, completeTime) {
        let {formatTime} = this;
        const start = 30 * 60 * 1000;
        const tm = 10 * 60 * 1000;
        return {
          startTime: formatTime(startTime - start),
          endTime: formatTime(completeTime ? completeTime + tm : Date.now())
        };
      },
      $formatDevData(item, type) {
        let unit = ['', '℃', '%', 'V'];
        let prop = ['', 'temperature', 'humidity', 'voltage'];
        if (!item[prop[type]]) return '';
        return item[prop[type]].toFixed(2) + unit[type];
      },
      $formatDevType(item) {
        return item.devType === '4' ? '2' : '1';
      }
    }
  };
</script>
