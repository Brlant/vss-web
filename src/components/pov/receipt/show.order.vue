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

.btn-submit-save {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 1;
  text-align: center;
  padding: 15px;
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
        <div class="btn-submit-save">
          <el-button @click="$emit('close')">关闭</el-button>
        </div>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info v-show="index === 0" :currentOrder="currentOrder" :index="index"></basic-info>
        <receipt v-show="index === 1" :index="index" :orderId="currentOrder.id"></receipt>
        <log v-show="index === 2" :currentOrder="currentOrder" :defaultIndex="2" :index="index"></log>
        <order-attachment v-show="index === 3" :currentOrder="currentOrder" :index="index"></order-attachment>
        <relevance-code v-show="index === 8" :currentOrder="currentOrder" :index="index" type="1"></relevance-code>
        <relevance-code-review v-show="index === 9" :currentOrder="currentOrder" :index="index"
                               type="1"></relevance-code-review>
        <batch-numbers v-show="index === 4" :currentOrder="currentOrder" :index="index"></batch-numbers>
        <customer-feedback v-show="index === 12" :currentOrder="currentOrder" :index="index"
                           :orderId="currentOrder.id"/>
      </div>
    </div>
  </div>
</template>
<script>
import basicInfo from './base-info.vue';
import log from '@/components/common/order.log.vue';
import receipt from './receipt-detail.vue';
import {InWork} from '@/resources';
import orderAttachment from '@/components/common/order/out.order.attachment.vue';
import relevanceCode from '@/components/common/order/relevance.code.vue';
import customerFeedback from '@/components/common/order/customer-feedback.vue';
import batchNumbers from '../../purchase/order/detail/batch.number.vue';

export default {
  components: {basicInfo, log, receipt, orderAttachment, relevanceCode, batchNumbers, customerFeedback},
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
  computed: {
    pageSets() {
      let menu = [];
      let perms = this.$store.state.permissions || [];
      menu.push({name: '订单详情', key: 0});
      if (this.currentOrder.state === '8') {
        menu.push({name: '收货详情', key: 1});
      }
      if (perms.includes('erp-order-document-watch')) {
        menu.push({name: '附件管理', key: 3});
      }
      menu.push({name: '批号相关', key: 4});
      // menu.push({name: '关联追溯码', key: 8});
      menu.push({name: '复核追溯码', key: 9});
      menu.push({name: '操作日志', key: 2});

      if (perms.includes('sales-order-upload-data')) {
        menu.push({name: '反馈信息', key: 12});
      }
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
    }
  }
};
</script>

