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
        <h2 class="clearfix right-title">退货申请详情</h2>
        <ul class="btn-submit-save">
          <!--          <li class="list-style" v-for="item in pageSets" @click="showPart(item)"-->
          <!--              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>-->
          <!--          </li>-->

          <template v-if="pageType === 'pov'">
            <li v-show="currentOrder.state === '0' " class="text-center order-btn" style="margin-top: 10px">
              <perm label="return-request-query-audit">
                <el-button style="width: 102px" type="primary" @click="review(true, '审核通过')">审单通过</el-button>
              </perm>
            </li>
            <li v-show="currentOrder.state === '0' " class="text-center order-btn" style="margin-top: 10px">
              <perm label="return-request-query-audit">
                <el-button style="width: 102px" type="warning" @click="review(false, '审核不通过')">审单不通过</el-button>
              </perm>
            </li>
          </template>

          <template v-if="pageType === 'cdc'">
            <li v-show="currentOrder.state === '1'" class="text-center order-btn" style="margin-top: 10px">
              <perm label="sub-unit-return-request-query-audit">
                <el-button style="width: 102px" type="primary" @click="review(true, '审核通过')">审单通过</el-button>
              </perm>
            </li>
            <li v-show="currentOrder.state === '1' " class="text-center order-btn" style="margin-top: 10px">
              <perm label="sub-unit-return-request-query-audit">
                <el-button style="width: 102px" type="warning" @click="review(false, '审核不通过')">审单不通过</el-button>
              </perm>
            </li>
          </template>

          <li v-if="pageType === 'pov'" class="text-center order-btn" style="margin-top: 10px">
            <perm v-show="currentOrder.state === '0' || currentOrder.state === '1'"
                  label="return-request-query-audit">
              <el-button plain style="width: 102px" @click="cancelOrder">取消申请</el-button>
            </perm>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info v-show="index === 0" :currentOrder="currentOrder" :index="index"></basic-info>
      </div>
    </div>
  </div>
</template>
<script>
import basicInfo from './detail/base-info.vue';
import log from '@/components/common/order.log.vue';
import {returnRequest} from '@/resources';
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
      this.title = '退货申请详情';
      this.queryOrderDetail();
    }
  },
  computed: {
    pageSets() {
      let menu = [];
      menu.push({name: '退货申请详情', key: 0});
      return menu;
    },
    pageType() {
      return this.$route.meta.type;
    }
  },
  methods: {
    queryOrderDetail() {
      if (!this.orderId) return false;
      this.currentOrder = {};
      returnRequest.get(this.orderId).then(res => {
        res.data.detailDtoList.forEach(i => {
          i.unitPrice = i.price;
          i.amount = i.applyCount;
          i.orgGoodsDto = i.orgGoodsDataDto.orgGoodsDto;
        });
        this.currentOrder = Object.assign({}, res.data, {state: res.data.status + ''});
      });
    },
    showPart(item) {
      this.index = item.key;
      this.title = item.name;
    },
    review(val, title) {
      this.$confirm('是否确认' + title, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        returnRequest[this.pageType === 'pov' ? 'povAudit' : 'cdcAudit']({
          status: val,
          id: this.currentOrder.id
        }).then(() => {
          this.$notify.success({
            message: '审单完成'
          });
          this.$emit('refreshOrder');
          this.queryOrderDetail();
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '审单失败'
          });
        });
      });
    },
    cancelOrder() {
      this.$confirm('是否取消退货申请', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        returnRequest.cancel(this.orderId).then(() => {
          this.$notify.success({
            message: '取消成功'
          });
          this.$emit('refreshOrder');
          this.queryOrderDetail();
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '取消成功'
          });
        });
      });
    },
  }
};
</script>

