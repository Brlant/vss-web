<style lang="scss" scoped>
$leftWidth: 180px;
.content-part {
  .content-left {
    width: $leftWidth;
  }

  .content-right {
    > h3 {
      left: $leftWidth;
    }

    left: $leftWidth;
  }
}

</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">订单详情</h2>
        <ul>
          <li v-for="item in pageSets" class="list-style" v-bind:class="{ 'active' : index==item.key}"
              @click="showPart(item)"><span>{{ item.name }}</span>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info v-show="index === 0" :currentOrder="currentOrder" :index="index"></basic-info>
        <log v-show="index === 1" :currentDetail="currentDetail" :index="index"></log>
      </div>
    </div>
  </div>
</template>
<script>
import basicInfo from '@/components/sale/order/detail/base-info.vue';
import log from './log.vue';
import {InWork} from '@/resources';

export default {
  components: {basicInfo, log},
  props: {
    orderId: {
      type: String
    },
    currentDetail: Object,
    state: String
  },
  data() {
    return {
      currentOrder: {},
      index: 0,
      pageSets: [
        {name: '订单详情', key: 0},
        {name: '实收记录', key: 1}
      ],
      title: ''
    };
  },
  watch: {
    orderId() {
      this.index = 0;
      this.title = '订单详情';
      this.queryOrderDetail();
    }
  },
  methods: {
    queryOrderDetail() {
      if (!this.orderId) return false;
      this.currentOrder = {};
      InWork.queryOrderDetail(this.orderId).then(res => {
        res.data.state = res.data.erpStatus;
        this.currentOrder = res.data;
      });
    },
    showPart(item) {
      this.index = item.key;
      this.title = item.name;
    }
  }
};
</script>

