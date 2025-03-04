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
        <h2 class="clearfix right-title">调拨出库详情</h2>
        <ul>
          <li v-for="item in pageSets" class="list-style" v-bind:class="{ 'active' : index==item.key}"
              @click="showPart(item)"><span>{{ item.name }}</span>
          </li>
          <li class="text-center order-btn" style="margin-top: 40px">
            <perm v-show="currentOrder.state === '0' " label="allocating-out-order-confirm">
              <el-button type="primary" @click="confirm">确认订单</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm v-show="currentOrder.state === '0' || currentOrder.state === '1' || currentOrder.state === '2'"
                  label="allocating-out-order-cancel">
              <el-button plain type="warning" @click="cancel">取消订单</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm v-show="currentOrder.state === '0'"
                  label="allocating-out-order-cancel">
              <el-button plain type="danger" @click="deleteOrder">删除订单</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm v-show="currentOrder.state === '1' " label="allocating-out-order-audit">
              <el-button type="primary" @click="review">审单通过</el-button>
            </perm>
          </li>
          <li v-show="currentOrder.state === '3' " class="text-center order-btn" style="margin-top: 10px">
            <perm label="return-manager-batch-complete">
              <el-button type="primary" @click="completeOrder">完成订单</el-button>
            </perm>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info v-show="index === 0" :currentOrder="currentOrder" :index="index"></basic-info>
        <log v-show="index === 2" :currentOrder="currentOrder" :defaultIndex="2" :index="index"></log>
        <order-attachment v-show="index === 3" :currentOrder="currentOrder" :index="index"></order-attachment>
        <relevance-code v-show="index === 8" :currentOrder="currentOrder" :index="index" type="1"></relevance-code>
        <relevance-code-review v-show="index === 9" :currentOrder="currentOrder" :index="index"
                               type="1"></relevance-code-review>
        <cancel-order v-show="index === 0" ref="cancelPart" :orderId="orderId" @close="$emit('close')"
                      @refreshOrder="$emit('refreshOrder')"></cancel-order>
        <customer-feedback v-show="index === 12" :currentOrder="currentOrder" :index="index"
                           :orderId="currentOrder.id"/>
        <order-push-log v-show="index === 15" :currentOrder="currentOrder" :index="index"></order-push-log>
      </div>
    </div>
  </div>
</template>
<script>
import basicInfo from './detail/base-info.vue';
import log from '@/components/common/order.log.vue';
import {erpOrder, http, InWork} from '@/resources';
import orderAttachment from '@/components/common/order/out.order.attachment.vue';
import relevanceCode from '@/components/common/order/relevance.code.vue';
import customerFeedback from '@/components/common/order/customer-feedback.vue';
import OrderPushLog from '@/components/common/order/order-push-log';

export default {
  components: {basicInfo, log, orderAttachment, relevanceCode, customerFeedback, OrderPushLog},
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
      if (perms.includes('erp-order-document-watch')) {
        menu.push({name: '附件管理', key: 3});
      }
      let state = this.state;
      if (state > 2) {
        // menu.push({name: '关联追溯码', key: 8});
        menu.push({name: '复核追溯码', key: 9});
      }
      menu.push({name: '操作日志', key: 2});
      if (perms.includes('sales-order-upload-data')) {
        menu.push({name: '反馈信息', key: 12});
      }
      menu.push({name: '推送日志', key: 15});
      return menu;
    }
  },
  methods: {
    completeOrder() {
      this.$confirm('是否确认完成订单', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(`/erp-order/${this.orderId}/transport/complete`).then(() => {
          this.$notify.success({
            message: '完成订单'
          });
          this.$emit('refreshOrder');
          this.$emit('close');
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '操作失败'
          });
        });
      });
    },
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
    confirm() {
      let createDate = this.$moment(this.currentOrder.createTime).format('YYYY-MM-DD');
      let createTime = this.$moment(createDate).valueOf();
      if (this.currentOrder.expectedTime < createTime) {
        return this.$notify.info('预计出库时间小于下单时间，请修改');
      }

      let isValid = this.currentOrder.detailDtoList.every(s => !s.orgGoodsDto.goodsDto
        || s.amount % s.orgGoodsDto.goodsDto.smallPacking === 0);
      if (!isValid) {
        this.$confirm('订单明细存在非最小包装倍数数量，请确定是否确认订单？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.put(`/erp-order/${this.orderId}`, this.currentOrder).then(() => {
            this.$notify.success({
              message: '确认订单成功'
            });
            this.transformState('1');
            this.$emit('close');
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '确认订单失败'
            });
          });
        });
      } else {
        this.$confirm('是否确认订单', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.put(`/erp-order/${this.orderId}`, this.currentOrder).then(() => {
            this.$notify.success({
              message: '确认订单成功'
            });
            this.transformState('1');
            this.$emit('close');
          }).catch(error => {
            this.$notify.error({
              message: error.response && error.response.data && error.response.data.msg || '确认订单失败'
            });
          });
        });
      }
    },
    review() {
      this.$confirm('是否审单通过', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.put(`/erp-order/${this.orderId}/check`).then(() => {
          this.$notify.success({
            message: '审单通过成功'
          });
          this.transformState('2');
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '审单通过失败'
          });
        });
      });
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
