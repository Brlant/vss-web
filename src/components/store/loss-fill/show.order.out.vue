<style lang="scss" scoped>
$leftWidth: 220px;
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
        <h2 class="clearfix right-title">报损详情</h2>
        <ul>
          <li v-for="item in pageSets" class="list-style" v-bind:class="{ 'active' : index==item.key}"
              @click="showPart(item)"><span>{{ item.name }}</span>
          </li>
          <li class="text-center order-btn" style="margin-top: 40px">
            <perm v-show="currentOrder.state === '0' "
                  label="breakage-order-confirm">
              <el-button type="primary" @click="checkPass">确认订单</el-button>
            </perm>
          </li>

          <!--<li class="text-center order-btn" style="margin-top: 10px">-->
          <!--<perm label="breakage-order-audit"-->
          <!--v-show="currentOrder.state === '1' ">-->
          <!--<el-button type="primary" @click="review">审单通过</el-button>-->
          <!--</perm>-->
          <!--</li>-->
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm v-show="currentOrder.state === '0' || currentOrder.state === '1' || currentOrder.state === '2'"
                  label="breakage-order-cancel">
              <el-button plain type="warning" @click="cancel">取消订单</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm v-show="currentOrder.state === '0'"
                  label="breakage-order-cancel">
              <el-button plain type="danger" @click="deleteOrder">删除订单</el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm
              v-show="currentOrder.state > 0" :label="'breakage-order-export-scrap-stock' ">
              <el-button :loading="printing" plain style="width: 200px;padding: 10px 10px" type="primary"
                         @click="exportScrapStockInfo">
                {{printing ? '正在导出' : '导出待报废库存登记表'}}
              </el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm
              v-show="currentOrder.state > 0" :label="'breakage-order-export-scrap-stock-transport' ">
              <el-button :loading="printingTransport" plain style="width: 200px; padding: 10px 10px"
                         type="primary" @click="exportScrapStockTransportInfo">
                {{printingTransport ? '正在导出' : '导出待报废疫苗转运单'}}
              </el-button>
            </perm>
          </li>
          <li class="text-center order-btn" style="margin-top: 10px">
            <perm
              v-show="currentOrder.state > 0" :label="'breakage-order-export-scrap-stock-tag' ">
              <el-button :loading="printingTag" plain style="width: 200px;padding: 10px 10px"
                         type="primary" @click="exportScarpVaccineTag">
                {{printingTag ? '正在导出' : '导出待报废疫苗专用标签'}}
              </el-button>
            </perm>
          </li>
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info v-show="index === 0" :currentOrder="currentOrder" :index="index" :isCheck="isCheck"
                    :vaccineType="vaccineType" @checkPass="checkPass"></basic-info>
        <receipt v-show="index === 1" :currentOrder="currentOrder" :index="index"></receipt>
        <log v-show="index === 2" :currentOrder="currentOrder" :defaultIndex="2" :index="index"></log>
        <order-attachment v-show="index === 3" :currentOrder="currentOrder" :index="index"></order-attachment>
        <relevance-code v-show="index === 8" :currentOrder="currentOrder" :index="index" type="1"></relevance-code>
        <relevance-code-review v-show="index === 9" :currentOrder="currentOrder" :index="index"
                               type="1"></relevance-code-review>
        <cancel-order v-show="index === 0" ref="cancelPart" :orderId="orderId" @close="$emit('close')"
                      @refreshOrder="$emit('refreshOrder')"></cancel-order>
        <order-push-log v-show="index === 15" :currentOrder="currentOrder" :index="index"></order-push-log>
        <customer-feedback v-show="index === 12" :currentOrder="currentOrder" :index="index"
                           :orderId="currentOrder.id"/>
      </div>
    </div>
  </div>
</template>
<script>
import basicInfo from './detail/base-info.vue';
import log from '@/components/common/order.log.vue';
import receipt from './detail/receipt.vue';
import {erpOrder, http, InWork} from '@/resources';
import orderAttachment from './breakage-order.attachment.vue';
import relevanceCode from '@/components/common/order/relevance.code.vue';
import utils from '@/tools/utils';
import OrderPushLog from '@/components/common/order/order-push-log';

export default {
  components: {basicInfo, log, receipt, orderAttachment, relevanceCode, OrderPushLog},
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
      isCheck: false,
      printing: false,
      printingTransport: false,
      printingTag: false
    };
  },
  watch: {
    orderId() {
      this.index = 0;
      this.title = '报损详情';
      this.queryOrderDetail();
    }
  },
  computed: {
    pageSets() {
      let menu = [];
      let perms = this.$store.state.permissions || [];
      menu.push({name: '报损详情', key: 0});
      if (this.state === '4' && this.currentOrder.customerChannel) {
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
      menu.push({name: '推送日志', key: 15});
      if (perms.includes('sales-order-upload-data')) {
        menu.push({name: '反馈信息', key: 12});
      }
      return menu;
    }
  },
  methods: {
    exportScrapStockInfo: function () {
      this.printing = true;
      this.$http.get(`erp-order/${this.currentOrder.id}/scrap-stock`, {}).then(res => {
        utils.download(res.data.path, '导出待报废库存登记表');
        this.printing = false;
      }).catch(error => {
        this.printing = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    exportScrapStockTransportInfo: function () {
      this.printingTransport = true;
      this.$http.get(`erp-order/${this.currentOrder.id}/scrap-stock-transport`, {}).then(res => {
        utils.download(res.data.path, '导出待报废疫苗转运单');
        this.printingTransport = false;
      }).catch(error => {
        this.printingTransport = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    exportScarpVaccineTag: function () {
      this.printingTag = true;
      this.$http.get(`erp-order/${this.currentOrder.id}/scrap-vaccine-tag`, {}).then(res => {
        utils.download(res.data.path, '导出待报废疫苗专用标签');
        this.printingTag = false;
      }).catch(error => {
        this.printingTag = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
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
          message: error.response && error.response.data && error.response.data.msg || '确认订单失败'
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

