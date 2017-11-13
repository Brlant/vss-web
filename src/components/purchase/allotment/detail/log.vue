<template>
  <div>
    <div v-if="loadingLog">
      <oms-loading :loading="loadingLog"></oms-loading>
    </div>
    <div v-else-if="orderLogList.length === 0" class="empty-info">
      暂无操作日志信息
    </div>
    <Timeline v-else>
      <template v-for="(log,index) in orderLogList">
        <TimelineItem color="green" v-if="log.showDate">
          <i class="iconfont icon-home1" slot="dot"></i>
          <h3><span>{{log.dateWeek}}</span></h3>
        </TimelineItem>
        <TimelineItem color="grey">
          <el-row>
            <el-col :span="4">
              <div>{{log.time}}</div>
            </el-col>
            <el-col :span="18"><strong>{{log.actionTitle}}</strong> <span
              class="font-gray"> [{{log.operatorName}}]</span>
            </el-col>
          </el-row>
        </TimelineItem>
      </template>

    </Timeline>
  </div>
</template>
<script>
  import { http } from '@/resources';
  import { TimelineItem, Timeline } from '../../../../components/common/timeline/index.js';

  export default {
    components: {TimelineItem, Timeline},
    props: {
      currentOrder: {
        type: Object,
        default: function () {
          return {};
        }
      },
      index: {
        type: Number,
        default: -1
      }
    },
    data () {
      return {
        loadingLog: true,
        orderLogList: []
      };
    },
    watch: {
      index (val) {
        if (val === 2) {
          this.getOrderLoglist();
        }
      }
    },
    methods: {
      getOrderLoglist () {// 获取操作日志
        this.orderLogList = [];
        if (!this.currentOrder.id) return;
        this.loadingLog = true;
        http.get('/erp-order/log/' + this.currentOrder.id).then(res => {
          let dateArr = [];
          res.data.forEach(item => {
            let time = this.$moment(item.operateTime);// .format('YYYY年MM月DD日/dddd');
            item.dateWeek = time.format('YYYY年MM月DD日 dddd');
            item.time = time.format('HH:mm:ss');
            if (dateArr.includes(item.dateWeek)) {
              item.showDate = false;
            } else {
              dateArr.push(item.dateWeek);
              item.showDate = true;
            }
          });
          this.orderLogList = res.data;
          this.loadingLog = false;
        });
      }
    }
  };
</script>
