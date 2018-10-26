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
        <h2 class="clearfix right-title">报损出库详情</h2>
        <ul>
          <li class="list-style" v-for="item in pageSets" @click="showPart(item)"
              v-bind:class="{ 'active' : index==item.key}"><span>{{ item.name }}</span>
          </li>
          <li class="text-center order-btn" style="margin-top: 40px">
            <perm label="breakage-order-confirm"
                  v-show="currentOrder.state === '0' ">
              <el-button type="primary" @click="check">确认订单</el-button>
            </perm>
          </li>

          <li class="text-center order-btn" style="margin-top: 10px">
            <perm label="breakage-order-audit"
                  v-show="currentOrder.state === '1' ">
              <el-button type="primary" @click="review">审单通过</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm label="breakage-order-cancel"
                  v-show="currentOrder.state === '0' || currentOrder.state === '1' || currentOrder.state === '2'">
              <el-button type="warning" plain @click="cancel">取消订单</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm label="breakage-order-cancel"
                  v-show="currentOrder.state === '0'">
              <el-button type="danger" plain @click="deleteOrder">删除订单</el-button>
            </perm>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info :currentOrder="currentOrder" v-show="index === 0" :index="index" :isCheck="isCheck"
                    @checkPass="checkPass" :vaccineType="vaccineType"></basic-info>
        <receipt :currentOrder="currentOrder" v-show="index === 1" :index="index"></receipt>
        <log :currentOrder="currentOrder" v-show="index === 2" :defaultIndex="2" :index="index"></log>
        <order-attachment :currentOrder="currentOrder" :index="index" v-show="index === 3"></order-attachment>
        <relevance-code :currentOrder="currentOrder" :index="index" type="1" v-show="index === 8"></relevance-code>
        <relevance-code-review :currentOrder="currentOrder" :index="index" type="1"
                               v-show="index === 9"></relevance-code-review>
        <cancel-order ref="cancelPart" :orderId="orderId" @close="$emit('close')" @refreshOrder="$emit('refreshOrder')"
                      v-show="index === 0"></cancel-order>
      </div>
    </div>
  </div>
</template>
<script>
  import basicInfo from './detail/base-info.vue';
  import log from '@/components/common/order.log.vue';
  import receipt from './detail/receipt.vue';
  import {erpOrder, http, InWork} from '@/resources';
  import orderAttachment from '@/components/common/order/out.order.attachment.vue';
  import relevanceCode from '@/components/common/order/relevance.code.vue';

  export default {
    components: {basicInfo, log, receipt, orderAttachment, relevanceCode},
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
        title: '',
        isCheck: false
      };
    },
    watch: {
      orderId() {
        this.index = 0;
        this.title = '报损出库详情';
        this.queryOrderDetail();
      }
    },
    computed: {
      pageSets() {
        let menu = [];
        let perms = this.$store.state.permissions || [];
        menu.push({name: '报损详情', key: 0});
        if (this.state === '4') {
          menu.push({name: '收货详情', key: 1});
        }
        if (perms.includes('erp-order-document-watch')) {
          menu.push({name: '附件管理', key: 3});
        }
        let state = this.state;
        if (state > 2) {
          // menu.push({name: '关联追溯码', key: 8});
          menu.push({name: '复核追溯码', key: 9});
        }
        menu.push({name: '操作日志', key: 2});
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
      },
      checkPass() {
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
              message: error.response.data && error.response.data.msg || '审单通过失败'
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
              message: error.response.data && error.response.data.msg || '删除订单失败'
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

