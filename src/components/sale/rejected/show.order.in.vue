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
        <h2 class="clearfix right-title">销售退货详情</h2>
        <ul>
          <li v-for="item in pageSets" class="list-style" v-bind:class="{ 'active' : index==item.key}"
              @click="showPart(item)"><span>{{ item.name }}</span>
          </li>
          <li class="text-center order-btn" style="margin-top: 40px">
            <perm v-show="currentOrder.state === '6' " label="sales-return-audit">
              <el-button type="primary" @click="review">审单通过</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm v-show="currentOrder.state === '6' || currentOrder.state === '7'  || currentOrder.state === '10'"
                  label="sales-return-cancel">
              <el-button plain type="warning" @click="cancel">取消订单</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm v-show="currentOrder.state === '6'"
                  label="sales-return-cancel">
              <el-button plain type="danger" @click="deleteOrder">删除订单</el-button>
            </perm>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info v-show="index === 0" :currentOrder="currentOrder" :index="index"></basic-info>
        <receipt-detail v-show="index === 1" :currentOrder="currentOrder" :index="index"></receipt-detail>
        <log v-show="index === 2" :currentOrder="currentOrder" :defaultIndex="2" :index="index"></log>
        <exception-info v-show="index === 3" :currentOrder="currentOrder" :index="index"
                        :orderId="orderId"></exception-info>
        <batch-numbers v-show="index === 4" :currentOrder="currentOrder" :index="index"></batch-numbers>
        <order-attachment v-show="index === 5" :currentOrder="currentOrder" :index="index"></order-attachment>
        <relevance-code v-show="index === 8" :currentOrder="currentOrder" :index="index" type="0"></relevance-code>
        <relevance-code-review v-show="index === 9" :currentOrder="currentOrder" :index="index"
                               type="0"></relevance-code-review>
        <cancel-order v-show="index === 0" ref="cancelPart" :orderId="orderId" @close="$emit('close')"
                      @refreshOrder="$emit('refreshOrder')"></cancel-order>
        <order-push-log v-show="index === 15" :currentOrder="currentOrder" :index="index"></order-push-log>
        <customer-feedback v-show="index === 12" :currentOrder="currentOrder" :index="index"
                           :orderId="currentOrder.id"></customer-feedback>
      </div>
    </div>
  </div>
</template>
<script>
import basicInfo from './detail/base-info.vue';
import receiptDetail from '@/components/purchase/order/detail/receipt-detail';
import log from '@/components/common/order.log.vue';
import batchNumbers from '../../purchase/order/detail/batch.number.vue';
import exceptionInfo from '../../purchase/order/detail/exception.info.vue';
import {erpOrder, http, InWork} from '@/resources';
import orderAttachment from '@/components/common/order/in.order.attachment.vue';
import relevanceCode from '@/components/common/order/relevance.code.vue';
import OrderPushLog from '@/components/common/order/order-push-log';

export default {
  components: {
    basicInfo, receiptDetail, log, batchNumbers, exceptionInfo, orderAttachment, relevanceCode, OrderPushLog
  },
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
      if (this.state === '8') {
        menu.push({name: '收货详情', key: 1});
      }
      if (perms.includes('quality-exception-manager')) {
        menu.push({name: '异常信息', key: 3});
      }
      if (perms.includes('batch-number-manager')) {
        menu.push({name: '批号相关', key: 4});
      }
      if (perms.includes('erp-order-document-watch')) {
        menu.push({name: '附件管理', key: 5});
      }
      let state = this.state;
      if (state !== '6' && state !== '7') {
        // menu.push({name: '关联追溯码', key: 8});
        menu.push({name: '复核追溯码', key: 9});
      }
      menu.push({name: '操作日志', key: 2});
      menu.push({name: '推送日志', key: 15});
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
    review() {
      let isValid = this.currentOrder.detailDtoList.every(s => !s.orgGoodsDto.goodsDto
        || s.amount % s.orgGoodsDto.goodsDto.smallPacking === 0);
      if (!isValid) {
        this.$confirm('订单明细存在非最小包装倍数数量，请确定是否审单通过？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.put(`/erp-order/${this.orderId}/check`).then(() => {
            this.$notify.success({
              message: '审单通过成功'
            });
            this.transformState('7');
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '审单通过失败'
            });
          });
        });
      } else {
        this.$confirm('是否审单通过', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.put(`/erp-order/${this.orderId}/check`).then(() => {
            this.$notify.success({
              message: '审单通过成功'
            });
            this.transformState('7');
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '审单通过失败'
            });
          });
        });
      }
    },
    showPart(item) {
      this.index = item.key;
      this.title = item.name;
    },
    transformState(state) {
      this.currentOrder.state = state;
      this.$emit('refreshOrder');
    },
    deleteOrder() {
      this.$confirm('是否删除订单', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        erpOrder.delete(this.orderId).then(() => {
          this.$notify.success({
            message: '删除订单成功'
          });
          this.$emit('refreshOrder');
          this.$emit('close');
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '删除订单失败'
          });
        });
      });
    },
    cancel() {
      this.index = 0;
      this.$refs['cancelPart'].isShow = true;
      this.$notify({
        duration: 2000,
        message: '请选择取消订单原因',
        type: 'warning'
      });
    }
  }
};
</script>

