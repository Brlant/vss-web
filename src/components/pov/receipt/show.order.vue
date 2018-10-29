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
          <li class="list-style" v-for="item in pageSets" @click="showPart(item)"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
        </ul>
        <div class="btn-submit-save">
          <el-button @click="$emit('close')">关闭</el-button>
        </div>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info :currentOrder="currentOrder" v-show="index === 0" :index="index"></basic-info>
        <receipt :orderId="currentOrder.id" v-show="index === 1" :index="index"></receipt>
        <log :currentOrder="currentOrder" v-show="index === 2" :defaultIndex="2" :index="index"></log>
        <order-attachment :currentOrder="currentOrder" :index="index" v-show="index === 3"></order-attachment>
        <relevance-code :currentOrder="currentOrder" :index="index" type="1" v-show="index === 8"></relevance-code>
        <relevance-code-review :currentOrder="currentOrder" :index="index" type="1" v-show="index === 9"></relevance-code-review>
        <batch-numbers :currentOrder="currentOrder" v-show="index === 4" :index="index"></batch-numbers>
      </div>
    </div>
  </div>
</template>
<script>
  import basicInfo from './base-info.vue';
  import log from '@/components/common/order.log.vue';
  import receipt from './receipt-detail.vue';
  import { InWork, http } from '@/resources';
  import orderAttachment from '@/components/common/order/out.order.attachment.vue';
  import relevanceCode from '@/components/common/order/relevance.code.vue';
  import batchNumbers from '../../purchase/order/detail/batch.number.vue';

  export default {
    components: {basicInfo, log, receipt, orderAttachment, relevanceCode, batchNumbers},
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
    computed: {
      pageSets () {
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
        return menu;
      }
    },
    methods: {
      queryOrderDetail () {
        if (!this.orderId) return false;
        this.currentOrder = {};
        InWork.queryOrderDetail(this.orderId).then(res => {
          res.data.state = res.data.erpStatus;
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

