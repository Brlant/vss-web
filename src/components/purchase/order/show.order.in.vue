<style lang="less" scoped>
  @leftWidth: 180px;
  .content-part {
    .content-left {
      width: @leftWidth;
    }
    .content-right {
      > h3 {
        left: @leftWidth;
      }
      left: @leftWidth;
    }
  }

</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">订单详情</h2>
        <ul>
          <li class="list-style" v-for="item in pageSets" @click="showPart(item)"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info :currentOrder="currentOrder" v-show="index === 0" :index="index"></basic-info>
        <receipt-detail :currentOrder="currentOrder" v-show="index === 1" :index="index"></receipt-detail>
        <log :currentOrder="currentOrder" v-show="index === 2" :index="index"></log>
      </div>
    </div>
  </div>
</template>
<script>
  import basicInfo from './detail/base-info.vue';
  import receiptDetail from './detail/receipt-detail.vue';
  import log from './detail/log.vue';
  import { InWork } from '@/resources';

  export default {
    components: {basicInfo, receiptDetail, log},
    props: {
      orderId: {
        type: String
      }
    },
    data () {
      return {
        currentOrder: {},
        index: 0,
        pageSets: [
          {name: '订单详情', key: 0},
          {name: '收货详情', key: 1},
          {name: '操作日志', key: 2}
        ],
        title: ''
      };
    },
    watch: {
      orderId () {
        this.index = 0;
        this.title = '订单详情';
        this.queryOrderDetail();
      }
    },
    methods: {
      queryOrderDetail () {
        this.currentOrder = {};
        if (!this.orderId) return false;
        InWork.queryOrderDetail(this.orderId).then(res => {
          this.currentOrder = res.data;
        });
      },
      showPart (item) {
        this.index = item.key;
        this.title = item.name;
      }
    }
  };
</script>

