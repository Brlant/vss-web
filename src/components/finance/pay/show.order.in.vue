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
        <log :currentOrder="currentOrder" v-show="index === 2" :index="index"></log>
      </div>
    </div>
  </div>
</template>
<script>
  import basicInfo from '@/components/purchase/order/detail/base-info.vue';
  import log from './log.vue';
  import { InWork } from '@/resources';

  export default {
    components: {basicInfo, log},
    props: {
      orderId: {
        type: String
      },
      state: String
    },
    data () {
      return {
        currentOrder: {},
        index: 0,
        pageSets: [
          {name: '订单详情', key: 0},
          {name: '修改实付记录', key: 1}
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
          res.data.state = this.state;
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

