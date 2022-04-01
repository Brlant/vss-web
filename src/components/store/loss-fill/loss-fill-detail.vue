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

.oms-row {
  margin-bottom: 8px;
}

.confirm-order {
  .el-select {
    display: block;
    position: relative;
    width: 500px;
  }
}

.total-wastage {
  position: absolute;
  right: 150px;
  font-size: 20px;
  padding: 10px;
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
              <el-button type="primary" @click="confirmOrder">确认订单</el-button>
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
        <div v-show="index === 0">
          <div v-if="!currentOrder.id">
            <oms-loading :loading="!currentOrder.id"></oms-loading>
          </div>
          <div v-else class="page-main-body padding">
            <div>
              <el-row>
                <el-col :span="12">
                  <oms-row :span="span" label="货主订单号">{{ currentOrder.orderNo }}</oms-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <oms-row :span="span" label="货主">{{ currentOrder.orgName }}</oms-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <oms-row :span="span" label="报损原因">{{ currentOrder.breakageReason }}</oms-row>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <oms-row label="附件" :span="4" v-show="['0','1','2'].includes(currentOrder.state)">
                    <oms-upload :fileList="attachmentList"
                                accept="picture"
                                :formData="{ objectId: currentOrder.id, objectType: 'erpOrderFile'}"
                                @change="changeFiles"></oms-upload>
                  </oms-row>
                  <oms-row label="附件" :span="4" v-show="['4','5'].includes(currentOrder.state)">
                    <attachment-list :attachmentIdList="attachmentList" :objectId="currentOrder.id"
                                     :objectType="'erpOrderFile'"
                                     :permission="'show'"></attachment-list>
                  </oms-row>
                </el-col>
              </el-row>
            </div>

            <div class="table-product">
              <el-table :data="currentOrder.detailDtoList" size="mini">
                <el-table-column>
                  <template v-slot="{row}">
                    <el-tooltip v-if="row.photoUrl" class="item" effect="light"
                                placement="right" popperClass="el-tooltip">
                      <compressed-img :src="row.photoUrl +'?image&action=resize:h_80,w_80,m_2' "
                                      class="product-img"/>
                      <compressed-img slot="content" :src="row.photoUrl +'?image&action=resize:h_200,m_2' "
                                      class="product-img"/>
                    </el-tooltip>
                    <el-tooltip v-else class="item" effect="light" placement="right" popperClass="el-tooltip">
                      <img :src="'../../../../static/img/userpic.png'" class="product-img">
                      <img slot="content" :src="'../../../../static/img/userpic.png'" class="product-img">
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column label="追溯码" prop="code"></el-table-column>
                <el-table-column label="疫苗">
                  <template v-slot="{row}">
                    <div>
                      <el-tooltip :content="`产品名称:${row.productName}`" class="row"
                                  effect="dark" placement="right">
                        <span style="font-size: 14px;line-height: 20px">{{ row.productName }}</span>
                      </el-tooltip>
                    </div>
                    <div>
                      <el-tooltip :content="`货品名称:${row.orgGoodsName}`" class="row"
                                  effect="dark"
                                  placement="right">
                        <span style="font-size: 12px;color:#999">{{ row.orgGoodsName }}</span>
                      </el-tooltip>
                    </div>
                    <div style="display: flex;justify-content: space-between;align-rows: center">
                      <el-tooltip class="row" :content="`疫苗规格:${row.orgGoodsName}`" effect="dark" placement="right">
                        <span style="font-size: 12px;">{{ row.specificationName }}</span>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="类型">
                  <template v-slot="{ row, $index }">
                    {{ row.goodsType === '1' ? '免疫规划疫苗' : '非免疫规划疫苗' }}
                  </template>
                </el-table-column>
                <el-table-column label="批号" prop="batchNumber">
                  <template v-slot="{ row, $index }">
                    {{ row.batchNumber || '无' }}
                    <goods-status-tag :form="currentOrder" :row="row"/>
                  </template>
                </el-table-column>
                <el-table-column label="有效期">
                  <template v-slot="{ row, $index }">
                    {{ row.expirationDate | date }}
                  </template>
                </el-table-column>
                <el-table-column label="损耗人份" prop="amount"/>
              </el-table>
              <div class="total-wastage">
                <total-count :list="currentOrder.detailDtoList" property="amount" title="合计人份"></total-count>
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: 50px" v-show="index === 0">
          <cancel-order ref="cancelPart" :orderId="orderId" @close="$emit('close')"
                        @refreshOrder="$emit('refreshOrder')"></cancel-order>
        </div>
        <order-log v-show="index === 1" :currentOrder="currentOrder" :defaultIndex="1" :index="index"></order-log>
      </div>
    </div>
  </div>
</template>
<script>
import cancelOrder from '@/components/common/order/cancel-order.vue';
import orderLog from '@/components/common/order.log.vue';
import {erpOrder, http, OmsAttachment} from '@/resources';
import attachmentList from '@/components/common/attachmentList.vue';

export default {
  name: 'detail',
  components: {orderLog, cancelOrder, attachmentList},
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
      span: 8,
      attachmentList: [],
      warehouseTypeList: this.$store.state.warehouseType,
    };
  },
  watch: {
    orderId() {
      this.index = 0;
      this.title = '报损详情';
      this.queryOrderDetail();
      this.queryAttachmentList();
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
    confirmOrder() {
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
    queryAttachmentList: function () {// 附件管理
      if (!this.currentOrder.id) return;
      OmsAttachment.queryOneAttachmentList(this.currentOrder.id, 'erpOrderFile').then(res => {
        this.attachmentList = res.data;
      });
    },
    changeFiles: function (fileList) {
      let ids = [];
      fileList.forEach(file => {
        ids.push(file.attachmentId);
      });
      this.currentOrder.fileIdList = ids;
    },
  },
};
</script>
