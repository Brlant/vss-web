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
          <li class="text-center order-btn" style="margin-top: 40px">
            <perm label="purchasing-order-audit" v-show="currentOrder.state === '6' ">
              <el-button type="primary" @click="review" style="width: 80px;">审单通过</el-button>
            </perm>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info :currentOrder="currentOrder" v-show="index === 0" :index="index"></basic-info>
        <receipt-detail :currentOrder="currentOrder" v-show="index === 1" :index="index"></receipt-detail>
        <log :currentOrder="currentOrder" v-show="index === 2" :defaultIndex="2" :index="index"></log>
        <exception-info :currentOrder="currentOrder" v-show="index === 3" :orderId="orderId"
                        :index="index"></exception-info>
        <batch-numbers :currentOrder="currentOrder" v-show="index === 4" :index="index"></batch-numbers>
      </div>
    </div>
  </div>
</template>
<script>
  import basicInfo from './detail/base-info.vue';
  import receiptDetail from './detail/receipt-detail.vue';
  import log from '@/components/common/order.log.vue';
  import batchNumbers from '../../purchase/order/detail/batch.number.vue';
  import exceptionInfo from '../../purchase/order/detail/exception.info.vue';
  import { InWork, http } from '@/resources';

  export default {
    components: {
      basicInfo, receiptDetail, log, batchNumbers, exceptionInfo
    },
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
        if (this.state === '8') {
          menu.push({name: '收货详情', key: 1});
        }
        if (perms.includes('quality-exception-manager')) {
          menu.push({name: '异常信息', key: 3});
        }
        if (perms.includes('batch-number-manager')) {
          menu.push({name: '批号相关', key: 4});
        }
        menu.push({name: '操作日志', key: 2});
        return menu;
      }
    },
    methods: {
      queryOrderDetail () {
        this.currentOrder = {};
        if (!this.orderId) return false;
        InWork.queryOrderDetail(this.orderId).then(res => {
          res.data.state = res.data.erpStatus;
          this.currentOrder = res.data;
        });
      },
      review () {
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
              message: error.response.data && error.response.data.msg || '审单通过失败'
            });
          });
        });
      },
      showPart (item) {
        this.index = item.key;
        this.title = item.name;
      },
      transformState (state) {
        this.currentOrder.state = state;
        this.$emit('refreshOrder');
      }
    }
  };
</script>

