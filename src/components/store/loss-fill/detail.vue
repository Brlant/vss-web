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

.left-actions {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
}

</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">损耗详情</h2>
        <ul>
          <li v-for="item in pageSets" class="list-style" v-bind:class="{ 'active' : index==item.key}"
              @click="showPart(item)"><span>{{ item.name }}</span>
          </li>
        </ul>
        <ul class="left-actions">
          <li class="text-center order-btn">
            <perm v-show="currentOrder.state === '0' "
                  label="breakage-order-confirm">
              <el-button type="primary" @click="checkPass">确认订单</el-button>
            </perm>
          </li>
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
        </ul>
      </div>
      <div class="content-right content-padding">
        <h3>{{ title }}</h3>
        <basic-info v-show="index === 0" :currentOrder="currentOrder" :index="index" :isCheck="isCheck"
                    :vaccineType="vaccineType" @checkPass="checkPass"></basic-info>
        <div style="margin-top: 50px">
          <cancel-order v-show="index === 0" ref="cancelPart" :orderId="orderId" @close="$emit('close')"
                        @refreshOrder="$emit('refreshOrder')"></cancel-order>
        </div>
        <log v-show="index === 1" :currentOrder="currentOrder" :defaultIndex="1" :index="index"></log>
      </div>
    </div>
  </div>
</template>
<script>
import basicInfo from './detail/base-info.vue';
import CancelOrder from '@/components/common/order/cancel-order.vue';
import log from '@/components/common/order.log.vue';
import {erpOrder, http} from '@/resources';
import orderAttachment from './breakage-order.attachment.vue';
import relevanceCode from '@/components/common/order/relevance.code.vue';
import utils from '@/tools/utils';
import OrderPushLog from '@/components/common/order/order-push-log';

export default {
  name: 'detail',
  components: {basicInfo, log, orderAttachment, relevanceCode, OrderPushLog, CancelOrder},
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
      menu.push({name: '损耗信息', key: 0});
      menu.push({name: '操作日志', key: 1});
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
      http.get(`/erp-order/${this.orderId}`).then(res => {
        this.currentOrder = this.transDetailData(res.data);
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
      http.put(`/erp-order/${this.orderId}/confirm`, this.currentOrder).then(() => {
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
    },
    transDetailData(data) {
      return {
        id: data.id,
        orderNo: data.orderNo,
        orgName: data.orgName,
        customerChannel: data.customerChannel,
        orgId: data.orgId,
        breakageReason: data.breakageReason,
        state: data.erpStatus,
        // detailDtoList需要做一个转换
        detailDtoList: data.detailDtoList.map(ddl => ({
          "amount": ddl.amount, //损耗人份数量
          "wastage": ddl.wastage, //损耗人份数量
          "orgGoodsId": ddl.orgGoodsId, //货主货品id
          "orgGoodsName": ddl.goodsName, //货主货品名称
          "specificationsId": "",
          specificationName: ddl.orgGoodsDto.goodsDto.specifications,//规格名称
          goodsType: ddl.vaccineType,//货品类型
          productName: ddl.orgGoodsDto.name,//产品名称
          photoUrl: ddl.orgGoodsDto.photoUrl,
          "batchNumberId": ddl.batchNumberId, //批号id
          "batchNumber": ddl.batchNumber, //批号
          "expirationDate": ddl.expiryDate, //有效期
          "code": ddl.code, //追溯码
          "multiPersonAgingId": ddl.multiPersonAgingId, //多人份剂次id
          "stockId": ddl.stockId //库存id
        })),
      }
    },
  },
};
</script>
