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
        <h2 class="clearfix right-title">退货申请详情</h2>
        <ul>
          <li class="list-style" v-for="item in pageSets" @click="showPart(item)"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>

          <template v-if="pageType === 'pov'">
            <li class="text-center order-btn" style="margin-top: 10px" v-show="currentOrder.state === '0' ">
              <perm label="return-request-query-audit">
                <el-button style="width: 102px" type="primary" @click="review(true, '审核通过')">审单通过</el-button>
              </perm>
            </li>
            <li class="text-center order-btn" style="margin-top: 10px" v-show="currentOrder.state === '0' ">
              <perm label="return-request-query-audit">
                <el-button style="width: 102px" type="warning" @click="review(false, '审核不通过')">审单不通过</el-button>
              </perm>
            </li>
          </template>

          <template v-if="pageType === 'cdc'">
            <li class="text-center order-btn" style="margin-top: 10px" v-show="currentOrder.state === '1'">
              <perm label="sub-unit-return-request-query-audit">
                <el-button style="width: 102px" type="primary" @click="review(true, '审核通过')">审单通过</el-button>
              </perm>
            </li>
            <li class="text-center order-btn" style="margin-top: 10px" v-show="currentOrder.state === '1' ">
              <perm label="sub-unit-return-request-query-audit">
                <el-button style="width: 102px" type="warning" @click="review(false, '审核不通过')">审单不通过</el-button>
              </perm>
            </li>
          </template>

          <li class="text-center order-btn" style="margin-top: 10px" v-if="pageType === 'pov'">
            <perm label="return-request-query-audit"
                  v-show="currentOrder.state === '0' || currentOrder.state === '1'">
              <el-button style="width: 102px" plain @click="cancelOrder">取消退货申请</el-button>
            </perm>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info :currentOrder="currentOrder" v-show="index === 0" :index="index"></basic-info>
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
        this.$confirm('是否' + title, '', {
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
              message: error.response.data && error.response.data.msg || '审单失败'
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
              message: error.response.data && error.response.data.msg || '取消成功'
            });
          });
        });
      },
    }
  };
</script>

