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
          <i class="el-icon-t-home1" slot="dot"></i>
          <h3><span>{{log.dateWeek}}</span></h3>
        </TimelineItem>
        <TimelineItem color="grey">
          <el-row>
            <el-col :span="4">
              <div>{{log.createTime | time}}</div>
            </el-col>
            <el-col :span="18"><strong>￥{{log.paymentAmount}}</strong>
              <el-tooltip class="item" effect="dark" :content="log.creatorOrgName ? log.creatorOrgName : '平台用户' "
                          placement="right">
                <span class="font-gray">[{{log.creatorName}}]</span>
              </el-tooltip>
            </el-col>
          </el-row>
        </TimelineItem>
      </template>

    </Timeline>
  </div>
</template>
<script>
  import { http } from '@/resources';
  export default {
    props: {
      currentDetail: {
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
        if (val === 1) {
          this.getPayLogs();
        }
      }
    },
    methods: {
      getPayLogs () {// 获取操作日志
        this.orderLogList = [];
        if (!this.currentDetail.id) return;
        this.loadingLog = true;
        http.get(`/accounts-receivable/detail/${this.currentDetail.id}/log`).then(res => {
          let dateArr = [];
          res.data.forEach(item => {
            let time = this.$moment(item.createTime);// .format('YYYY年MM月DD日/dddd');
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
