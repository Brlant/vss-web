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
      <h2 class="clearfix right-title">修改分配数量</h2>
      <div class="btn-submit-save">
        <el-button @click="submit" type="success">保存</el-button>
      </div>
    </div>
    <div class="content-right content-padding">
      <div class="d-table-col-wrap">
        <div class="content-body clearfix">
          <el-row v-if="loading">
            <el-col :span="24">
              <oms-loading :loading="loading"></oms-loading>
            </el-col>
          </el-row>
          <el-row v-else="">
            <el-col :span="8">
              <oms-row label="要货申请编号">
                {{currentOrder.id }}
              </oms-row>
              <oms-row label="申请时间">
                {{currentOrder.applyTime | time}}
              </oms-row>
              <oms-row label="到货需求日期">
                {{currentOrder.demandTime | date }}
              </oms-row>
              <oms-row label="接种点仓库">
                {{currentOrder.warehouseAddress}}
              </oms-row>
            </el-col>
            <el-col :span="16">
              <oms-row label="申请人">
                {{currentOrder.applyManName}}
              </oms-row>
              <oms-row label="审批人">
                {{currentOrder.auditManName}}
              </oms-row>
              <oms-row label="审批时间">
                {{currentOrder.auditTime | time}}
              </oms-row>
              <oms-row label="关联疾控销售订单">
                {{currentOrder.orderNo}}
              </oms-row>
            </el-col>
          </el-row>
        </div>
        <span style="font-size: 14px">【要货明细】</span>
        <table class="table table-hover" style="margin-top: 10px">
          <thead>
          <tr>
            <th>货品名称</th>
            <th>规格</th>
            <th width="70px">单价</th>
            <th width="80px">申请数量</th>
            <th width="80px">申请金额</th>
            <th width="80px">可用库存</th>
            <th>分配数量</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="row in currentOrder.detailDtoList">

            <td>
              <div>{{row.goodsName}}</div>
              <div style="color: #888;font-size: 13px">散件包装数量: {{row.smallPackCount}}</div>
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
              {{row.repertoryCount}}
            </td>
            <td>
              <!--<el-input v-model.number="row.actualCount"></el-input>-->
              <input class="el-input__inner" :class="{error: row.isNoValid}" type="number"
                     @input="inputHandler(row)" @blur="validPackage(row)"
                     v-model.number="row.actualCount"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import { pullSignal } from '@/resources';
  import axios from 'axios';
  export default {
    props: {
      currentItem: Object,
      showEditPart: false
    },
    data: function () {
      return {
        loading: false,
        currentOrder: {},
        doing: false
      };
    },
    watch: {
      showEditPart (val) {
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
        axios.all([pullSignal.get(this.currentItem.id), this.$http.get(`/pull-signal/${this.currentItem.id}/stock`)]).then(
          axios.spread((pre, next) => {
            pre.data.detailDtoList.forEach(i => {
              i.repertoryCount = this.getRepertoryCount(i, next);
              i.isNoValid = i.actualCount > i.repertoryCount;
            });
            this.currentOrder = pre.data;
            this.loading = false;
          })
        );
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
      inputHandler (row) {
        row.isNoValid = row.actualCount > row.repertoryCount;
      },
      validPackage (row) {
        if (row.actualCount % row.smallPackCount !== 0) {
          this.$notify.info({
            message: '货品' + row.goodsName + '，输入的分配数量不是散件倍数, 请调整'
          });
        }
      },
      submit () {
        // let valid = this.currentOrder.detailDtoList.some(s => s.actualCount > s.repertoryCount);
        // if (valid) {
        //   this.currentOrder.detailDtoList.forEach(i => {
        //     i.isNoValid = i.actualCount > i.repertoryCount;
        //   });
        //   this.$notify.info({
        //     message: '存在分配数量大于可用库存的要货明细，请进行调整'
        //   });
        //   return;
        // }
        let valid = this.currentOrder.detailDtoList.some(s => s.actualCount % s.smallPackCount !== 0);
        if (valid) {
          this.$notify.info({
            message: '存在分配数量不是散件倍数的明细，请进行调整'
          });
          return;
        }
        let ary = this.currentOrder.detailDtoList.map(m => {
          return {
            detailId: m.id,
            count: m.actualCount
          };
        });
        this.doing = true;
        this.$http.put(`/pull-signal/${this.currentItem.id}/detail/actual-count`, ary).then(res => {
          this.$notify.success({
            message: '修改分配数量成功'
          });
          this.doing = false;
          this.$emit('close', 'refresh');
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '修改分配数量失败'
          });
        });
      }
    }
  };
</script>
