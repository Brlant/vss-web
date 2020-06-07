<style lang="scss" scoped>
  $leftWidth: 180px;
  .content-part {
    .content-left {
      width: $leftWidth;
      text-align: center;
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
        <h2 class="clearfix right-title">采购订单详情</h2>
        <ul>
          <li class="list-style" v-for="item in pageSets" @click="showPart(item)"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <li class="text-center order-btn" style="margin-top: 40px">
            <perm :label="vaccineType === '1'?'purchasing-order-audit': 'second-vaccine-purchasing-order-audit' "
                  v-show="currentOrder.state === '6' ">
              <el-button type="primary" @click="review">审单通过</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm :label="vaccineType === '1'?'purchasing-order-cancel': 'second-vaccine-purchasing-order-cancel' "
                  v-show="currentOrder.state === '6' || currentOrder.state === '7' || currentOrder.state === '10' ">
              <el-button type="warning" plain @click="cancel">取消订单</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm :label="vaccineType === '1'?'purchasing-order-cancel': 'second-vaccine-purchasing-order-cancel' "
                  v-show="currentOrder.state === '6'">
              <el-button type="danger" plain @click="deleteOrder">删除订单</el-button>
            </perm>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info :currentOrder="currentOrder" :vaccineType="vaccineType" v-show="index === 0"
                    :index="index"></basic-info>
        <receipt-detail :currentOrder="currentOrder" v-show="index === 1" :index="index"></receipt-detail>
        <log :currentOrder="currentOrder" v-show="index === 2" :defaultIndex="2" :index="index"></log>
        <exception-info :currentOrder="currentOrder" v-show="index === 3" :orderId="orderId"
                        :index="index"></exception-info>
        <batch-numbers :currentOrder="currentOrder" v-show="index === 4" :index="index"></batch-numbers>
        <order-attachment :currentOrder="currentOrder" :index="index" v-show="index === 5"></order-attachment>
        <relevance-code :currentOrder="currentOrder" :index="index" type="0" v-show="index === 8"></relevance-code>
        <relevance-code-review :currentOrder="currentOrder" :index="index" type="0"
                               v-show="index === 9"></relevance-code-review>
        <cancel-order ref="cancelPart" :orderId="orderId" @close="$emit('close')" @refreshOrder="$emit('refreshOrder')"
                      v-show="index === 0"></cancel-order>
        <order-push-log :currentOrder="currentOrder" :index="index" v-show="index === 15"></order-push-log>
        <customer-feedback :currentOrder="currentOrder" :orderId="currentOrder.id" :index="index"
                           v-show="index === 12"></customer-feedback>
      </div>
    </div>
  </div>
</template>
<script>
  import basicInfo from './detail/base-info.vue';
  import receiptDetail from './detail/receipt-detail.vue';
  import batchNumbers from './detail/batch.number.vue';
  import exceptionInfo from './detail/exception.info.vue';
  import orderAttachment from '@/components/common/order/in.order.attachment.vue';
  import relevanceCode from '@/components/common/order/relevance.code.vue';
  import OrderPushLog from '@/components/common/order/order-push-log';
  import log from '@/components/common/order.log.vue';
  import {erpOrder, http, InWork} from '@/resources';
  import CancelOrder from '@/components/common/order/cancel-order';

  export default {
    components: {
      CancelOrder,
      basicInfo, receiptDetail, log, batchNumbers, exceptionInfo, orderAttachment, relevanceCode,
      OrderPushLog
    },
    props: {
      orderId: {
        type: String
      },
      state: String,
      vaccineType: String
    },
    data() {
      return {
        currentOrder: {},
        index: 0,
        title: ''
      };
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

