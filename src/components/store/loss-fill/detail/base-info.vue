<style lang="scss" scoped>

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
              <attachment-lists :attachmentIdList="attachmentList" :objectId="currentOrder.id"
                                :objectType="'erpOrderFile'"
                                :permission="'show'"></attachment-lists>
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
    <undo ref="undo"></undo>
  </div>
</template>
<script>
import {OmsAttachment} from '@/resources';
import materialPart from '../material.vue';
import undo from '@/components/store/breakage-order/form/undo';
import attachmentLists from '@/components/common/attachmentList.vue';

export default {
  components: {materialPart, undo, attachmentLists},
  props: {
    currentOrder: {
      type: Object,
      default: function () {
        return {};
      }
    },
    isCheck: Boolean,
    vaccineType: String
  },
  data() {
    return {
      span: 8,
      warehouses: [],
      LogisticsCenter: [],
      attachmentList: [],
      warehouseTypeList: this.$store.state.warehouseType,
      rules: {
        transportationMeansId: [
          {required: true, message: '请选择物流方式', trigger: 'change'}
        ],
        transportationAddress: [
          {required: true, message: '请选择收货单位收货地址', trigger: 'change'}
        ],
        orgAddress: [
          {required: true, message: '请选择发货地址', trigger: 'change'}
        ],
        transportationCondition: [
          {required: true, message: '请选择运输条件', trigger: 'blur'}
        ],
        expectedTime: [
          {required: true, message: '请选择日期', trigger: 'change'}
        ],
        remark: [
          {required: true, message: '请输入备注信息', trigger: 'blur'}
        ]
      }
    };
  },
  watch: {
    currentOrder(val) {
      if (!val.id) return;
      this.queryAttachmentList();
    },
    isCheck(val) {
      if (val) {
        this.check();
      }
    }
  },
  methods: {
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
    showUndo(row) {
      this.$refs.undo.form = Object.assign({}, this.$refs.undo.form, {
        orderId: row.orderId,
        injectionTaskId: row.id,
      });
      this.$refs.undo.show();

    },
    filterAddressLabel(row) {
      let name = row.name ? '【' + row.name + '】' : '';
      return name + row.detail;
    },
    getTimeTitle: function (row) {
      return row.transportationMeansId === '0' ? row.bizType === '2-1' ? '预计出库' : '预计送货' : row.transportationMeansId === '1' ? '预计提货' : row.transportationMeansId === '2' ? '预计发货' : '';
    },
    getWarehouseAdress: function (row) { // 得到仓库地址
      return row.detail + `（${this.warehouseTypeList[row.warehouseType].label}）`;
    },
    changeRemark(form) {
      if (!this.currentOrder.remark) {
        this.currentOrder.remark = form.count + form.name;
      } else {
        this.currentOrder.remark += '，' + form.count + form.name;
      }
    },
  }
};
</script>
