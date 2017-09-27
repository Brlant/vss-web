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
            <perm label="show" v-show="currentOrder.state === '0' ">
              <el-button type="primary" @click="confirm">确认订单</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm label="show" v-show="currentOrder.state === '1' ">
              <el-button type="primary" @click="review">确认审单</el-button>
            </perm>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info :currentOrder="currentOrder" v-show="index === 0" :index="index"></basic-info>
        <log :currentOrder="currentOrder" v-show="index === 1" :index="index"></log>
      </div>
    </div>
  </div>
</template>
<script>
  import basicInfo from './detail/base-info.vue';
  import log from './detail/log.vue';
  import { InWork, http } from '@/resources';

  export default {
    components: {basicInfo, log},
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
        pageSets: [
          {name: '订单详情', key: 0},
          {name: '操作日志', key: 1}
        ],
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
    methods: {
      queryOrderDetail () {
        this.currentOrder = {};
        if (!this.orderId) return false;
        InWork.queryOrderDetail(this.orderId).then(res => {
          res.data.state = this.state;
          this.currentOrder = res.data;
        });
      },
      showPart (item) {
        this.index = item.key;
        this.title = item.name;
      },
      confirm () {
        this.$confirm('是否确认订单', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.put(`/erp-order/${this.orderId}/confirm`).then(() => {
            this.$notify.success({
              message: '确认订单成功'
            });
            this.transformState('1');
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '确认订单失败'
            });
          });
        });
      },
      review () {
        this.$confirm('是否确认审单', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.put(`/erp-order/${this.orderId}/check`).then(() => {
            this.$notify.success({
              message: '确认审单成功'
            });
            this.transformState('2');
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '确认审单失败'
            });
          });
        });
      },
      transformState (state) {
        this.currentOrder.state = state;
        this.$emit('refreshOrder');
      }
    }
  };
</script>

