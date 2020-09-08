<style lang="scss" scoped>

.el-form .el-select {
  display: block;
}

.d-table-right {
  .org-name-h2 {
    font-size: 16px;
    font-weight: bold;
  }
}

.d-table-col-wrap {
  overflow: auto;
}

.pov-info {
  margin-bottom: 20px;

  .font-bold {
    font-size: 14px;
  }
}

.oms-row {
  font-size: 14px;
  margin-bottom: 10px;
}

.content-body {
  margin: 20px 0;
}

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

.error {
  color: red;
}
</style>
<template>
  <div class="content-part">
    <div class="content-left">
      <h2 class="clearfix right-title">修改退货数量</h2>
      <div class="btn-submit-save">
        <el-button type="success" @click="submit">保存</el-button>
      </div>
    </div>
    <div class="content-right content-padding">
      <h3 class="clearfix right-title">修改退货数量</h3>
      <div class="d-table-col-wrap">
        <div class="content-body clearfix">
          <el-row v-if="loading">
            <el-col :span="24">
              <oms-loading :loading="loading"></oms-loading>
            </el-col>
          </el-row>
          <el-row v-else="">
            <el-col :span="11">
              <oms-row label="退货申请编号">
                {{currentOrder.id }}
              </oms-row>
              <oms-row label="退货单位">
                {{currentOrder.povName }}
              </oms-row>
              <oms-row label="供货单位">
                {{currentOrder.cdcName}}
              </oms-row>

              <oms-row label="退货单位仓库">
                {{currentOrder.warehouseAddress}}
              </oms-row>
              <el-row v-show="currentOrder.remark">
                <oms-row label="备注">{{ currentOrder.remark }}</oms-row>
              </el-row>
            </el-col>
            <el-col :span="13">
              <oms-row label="预计退货日期">
                {{currentOrder.demandTime | date }}
              </oms-row>
              <oms-row label="申请时间">
                {{currentOrder.applyTime | time}}
              </oms-row>
              <oms-row label="申请人">
                {{currentOrder.applyManName}}
              </oms-row>
              <div v-if="pageType === 'pov'">
                <oms-row v-show="currentOrder.auditManName" label="审批人">
                  {{currentOrder.auditManName}}
                </oms-row>
                <oms-row v-show="currentOrder.auditTime" label="审批时间">
                  {{currentOrder.auditTime | time}}
                </oms-row>
                <oms-row v-show="currentOrder.orgAuditManName" label="上级单位审批人">
                  {{currentOrder.orgAuditManName}}
                </oms-row>
                <oms-row v-show="currentOrder.orgAuditTime" label="上级单位审批时间">
                  {{currentOrder.orgAuditTime | time}}
                </oms-row>
              </div>
              <div v-else>
                <oms-row v-show="currentOrder.orgAuditManName" label="审批人">
                  {{currentOrder.orgAuditManName}}
                </oms-row>
                <oms-row v-show="currentOrder.orgAuditTime" label="审批时间">
                  {{currentOrder.orgAuditTime | time}}
                </oms-row>
              </div>
              <oms-row v-show="currentOrder.orderNo" label="关联采购退货订单">
                {{currentOrder.orderNo}}
              </oms-row>
              <oms-row v-show="currentOrder.orgOrderNo" label="关联疾控销售退货订单">
                {{currentOrder.orgOrderNo}}
              </oms-row>
            </el-col>
          </el-row>
        </div>
        <span style="font-size: 14px">【退货明细】</span>
        <table class="table table-hover" style="margin-top: 10px">
          <thead>
          <tr>
            <th>疫苗名称</th>
            <th width="70px">规格</th>
            <th width="70px">单价</th>
            <th width="80px">申请数量</th>
            <th width="80px">申请金额</th>
            <th>退货数量</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in currentOrder.detailDtoList">

            <td>
              <div>{{row.goodsName}}</div>
              <div class="font-gray">批号: {{row.batchNumber}}</div>
              <div class="font-gray">散件包装数量: {{row.smallPackCount}}</div>
            </td>
            <td>
              <span>{{ row.specification }}</span>
            </td>
            <td>
              <span v-if="row.price">￥{{row.price | formatMoney}}</span>
              <span v-if="!row.price">-</span>
            </td>
            <td>
              {{row.applyCount}}
            </td>
            <td>
              <span v-if="row.applyMoney">￥{{row.applyMoney | formatMoney}}</span>
              <span v-if="!row.applyMoney">-</span>
            </td>
            <td>
              <!--<el-input v-model.number="row.actualCount"></el-input>-->
              <input v-model.number="row.actualCount" class="el-input__inner"
                     type="number" @blur="validPackage(row)"
                     @input="inputHandler(row)"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import {returnRequest} from '@/resources';
import utils from '@/tools/utils';

export default {
  props: {
    currentItem: Object,
    showEditPart: false
  },
  data: function () {
    return {
      loading: false,
      currentOrder: {},
      doing: false,
      changeTotalNumber: utils.changeTotalNumber
    };
  },
  computed: {
    pageType() {
      return this.$route.meta.type;
    }
  },
  watch: {
    showEditPart(val) {
      if (val) {
        this.getDetail();
      }
    }
  },
  methods: {
    getDetail: function () {
      this.currentOrder = {};
      if (!this.currentItem.id) return;
      this.loading = true;
      returnRequest.get(this.currentItem.id).then(res => {
        this.currentOrder = res.data;
        this.loading = false;
      });
    },
    getRepertoryCount(i, next) {
      let count = 0;
      next.data.forEach(n => {
        if (n.orgGoodsId === i.orgGoodsId) {
          count = n.count;
        }
      });
      return count;
    },
    validPackage(row) {
      row.actualCount = row.actualCount || 0;
      if (row.actualCount < 0) {
        this.$notify.info({
          message: '退货数量不能小于0，请进行调整'
        });
        return;
      }
      if (row.actualCount > row.applyCount) {
        this.$notify.info({
          message: '退货数量不能大于申请数量，请进行调整'
        });
        return;
      }
      let newAmount = this.changeTotalNumber(row.actualCount, row.smallPackCount);
      if (row.actualCount !== newAmount) {
        this.$confirm(`疫苗"${row.goodsName}"数量${row.actualCount}不是最小包装的倍数，确认后会对后续操作产生严重影响！
          选择“是”修改数量为${newAmount}，选择“否”确认数量${row.actualCount}`, '', {
          confirmButtonText: '是',
          cancelButtonText: '否',
          type: 'warning'
        }).then(res => {
          row.actualCount = newAmount;
        });
      }
    },
    submit() {
      for (let i = 0; i < this.currentOrder.detailDtoList.length; i++) {
        let row = this.currentOrder.detailDtoList[i];
        if (row.actualCount < 0) {
          this.$notify.info({
            message: `"${row.goodsName}"的退货数量不能小于0，请进行调整`
          });
          return;
        }
        if (row.actualCount > row.applyCount) {
          this.$notify.info({
            message: `"${row.goodsName}"的退货数量不能大于申请数量，请进行调整`
          });
          return;
        }
      }
      let ary = this.currentOrder.detailDtoList.map(m => {
        return {
          detailId: m.id,
          count: m.actualCount
        };
      });
      this.doing = true;
      this.$http.put(`/return-application/edit/${this.currentItem.id}/actual-count`, ary).then(res => {
        this.$notify.success({
          message: '修改退货数量成功'
        });
        this.doing = false;
        this.$emit('close', 'refresh');
      }).catch(error => {
        this.doing = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '修改退货数量失败'
        });
      });
    }
  }
};
</script>
