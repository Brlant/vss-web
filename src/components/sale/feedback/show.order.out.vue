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
        <basic-info v-show="index === 0" :currentOrder="currentOrder" :index="index" :isCheck="isCheck"></basic-info>
        <receipt v-show="index === 1" :currentOrder="currentOrder" :index="index"></receipt>
        <log v-show="index === 2" :currentOrder="currentOrder" :defaultIndex="2" :index="index"></log>
        <order-attachment v-show="index === 3" :currentOrder="currentOrder" :index="index"></order-attachment>
        <relevance-code v-show="index === 8" :currentOrder="currentOrder" :index="index" type="1"></relevance-code>
        <relevance-code-review v-show="index === 9" :currentOrder="currentOrder" :index="index"
                               type="1"></relevance-code-review>
        <cancel-order v-show="index === 0" ref="cancelPart" :orderId="orderId" @close="$emit('close')"
                      @refreshOrder="$emit('refreshOrder')"></cancel-order>
        <customer-feedback v-show="index === 12" :currentOrder="currentOrder" :index="index" :orderId="currentOrder.id"
                           perm="show"/>

      </div>
    </div>
  </div>
</template>
<script>
import basicInfo from './base-info.vue';
import log from '@/components/common/order.log.vue';
import receipt from '../order/detail/receipt.vue';
import {InWork} from '@/resources';
import orderAttachment from '@/components/common/order/out.order.attachment.vue';
import relevanceCode from '@/components/common/order/relevance.code.vue';
import customerFeedback from '@/components/common/order/customer-feedback.vue';

export default {
  components: {basicInfo, log, receipt, orderAttachment, relevanceCode, customerFeedback},
  props: {
    orderId: {
      type: String
    },
    state: String
  },
  data() {
    return {
      currentOrder: {},
      index: 0,
      title: '',
      isCheck: false
    };
  },
  watch: {
    orderId() {
      this.index = 0;
      this.title = '订单详情';
      this.queryOrderDetail();
    }
  },
  computed: {
    pageSets() {
      let menu = [];
      let perms = this.$store.state.permissions || [];
      menu.push({name: '订单详情', key: 0});
      menu.push({name: '收货详情', key: 1});
      menu.push({name: '附件管理', key: 3});
      let state = this.state;
      menu.push({name: '复核追溯码', key: 9});
      menu.push({name: '操作日志', key: 2});
      menu.push({name: '反馈信息', key: 12});
      return menu;
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
    },
    check() {
      this.isCheck = false;
      this.$nextTick(() => {
        this.isCheck = true;
      });
    }
  }
};
</script>

