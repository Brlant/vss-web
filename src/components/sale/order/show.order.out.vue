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
        <h2 class="clearfix right-title">销售订单详情</h2>
        <ul>
          <li class="list-style" v-for="item in pageSets" @click="showPart(item)"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <li class="text-center order-btn" style="margin-top: 40px">
            <perm label="sales-order-confirm" v-show="currentOrder.state === '0' ">
              <el-button type="primary" @click="check">确认订单</el-button>
            </perm>
          </li>

          <li class="text-center order-btn" style="margin-top: 10px">
            <perm label="sales-order-audit" v-show="currentOrder.state === '1' ">
              <el-button type="primary" @click="review">审单通过</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm label="sales-order-confirm" v-show="currentOrder.state === '0' || currentOrder.state === '1'">
              <el-button type="primary" @click="cancel">取消订单</el-button>
            </perm>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info :currentOrder="currentOrder" v-show="index === 0" :index="index" :isCheck="isCheck"
                    @checkPass="checkPass"></basic-info>
        <receipt :currentOrder="currentOrder" v-show="index === 1" :index="index"></receipt>
        <log :currentOrder="currentOrder" v-show="index === 2" :defaultIndex="2" :index="index"></log>
      </div>
    </div>
  </div>
</template>
<script>
  import basicInfo from './detail/base-info.vue';
  import log from '@/components/common/order.log.vue';
  import receipt from './detail/receipt.vue';
  import { InWork, http, erpOrder } from '@/resources';

  export default {
    components: {basicInfo, log, receipt},
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
        title: '',
        isCheck: false
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
        menu.push({name: '订单详情', key: 0});
        if (this.state === '3') {
          menu.push({name: '收货详情', key: 1});
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
      showPart (item) {
        this.index = item.key;
        this.title = item.name;
      },
      check () {
        this.isCheck = false;
        this.$nextTick(() => {
          this.isCheck = true;
        });
      },
      checkPass () {
        http.put(`/erp-order/${this.orderId}`, this.currentOrder).then(() => {
          this.$notify.success({
            message: '确认订单成功'
          });
          this.transformState('1');
          this.$emit('close');
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '确认订单失败'
          });
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
            this.transformState('2');
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '审单通过失败'
            });
          });
        });
      },
      transformState (state) {
        this.currentOrder.state = state;
        this.$emit('refreshOrder');
      },
      cancel () {
        this.$confirm('是否取消订单', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          erpOrder.cancel(this.orderId).then(() => {
            this.$notify.success({
              message: '取消订单成功'
            });
            this.$emit('close');
            this.$emit('refreshOrder');
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '取消订单失败'
            });
          });
        });
      }
    }
  };
</script>

