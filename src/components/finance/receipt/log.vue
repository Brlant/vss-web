<template>
  <div>
    <div v-if="loadingLog">
      <oms-loading :loading="loadingLog"></oms-loading>
    </div>
    <div v-else-if="orderLogList.length === 0" class="empty-info">
      暂无操作日志信息
    </div>
    <bg-box v-else="" :title=" '金额 ￥'+log.paymentAmount" v-for="log in orderLogList" :key="log.id">
      <p>操作人:{{log.createdBy}}  <span class="ml-15">操作时间:{{log.createTime | time}} </span></p>
    </bg-box>
  </div>
</template>
<script>
  import { http } from '@/resources';
  import bgBox from '@/components/common/bgbox.vue';

  export default {
    components: {bgBox},
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
          this.getOrderLoglist();
        }
      }
    },
    methods: {
      getOrderLoglist () {// 获取操作日志
        this.orderLogList = [];
        if (!this.currentDetail.id) return;
        this.loadingLog = true;
        http.get(`/accounts-receivable/detail/${this.currentDetail.id}/log`).then(res => {
          this.orderLogList = res.data;
          this.loadingLog = false;
        });
      }
    }
  };
</script>
