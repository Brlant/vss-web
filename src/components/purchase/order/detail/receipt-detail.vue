<style lang="scss" scoped="">
  $table-background-color: #dfe6ec;
  $table-background-color-tint: #eee;
  .product-detail-list {
    table-layout: fixed;
    /*margin-top: 20px;*/
    text-align: center;
    border-collapse: collapse;
    font-size: 12px;
    > tbody > tr > td {
      padding: 5px;
      border: 1px solid $table-background-color;
    }
    .t-head {
      background: #eaf2f8;
      color: #1f2d3d;
      font-weight: bold;
    }

    &.is-top {
      > tbody > tr > td {
        border-bottom: 0;
      }
    }
    &.is-tint {
      > tbody > tr > td {
        border: 1px solid #d6d6d6;
      }
      .t-head {
        background: $table-background-color-tint;
      }
      &.is-top {
        > tbody > tr > td {
          border-bottom: 0;
        }
      }
    }
  }

  .bg-white {
    background: #fff;
  }

  .bg-red {
    background: #f70f0f;
  }

  .color-red {
    color: red;
  }

  .page-main-body {
    .oms-row {
      margin-bottom: 5px;
    }
  }

  .goods-histories {
    border: 1px solid #dfe6ec;
    border-top: 0;
    padding: 10px 20px;
    margin-bottom: 10px;
    h3 {
      margin: 0;
      font-weight: 500;
      font-size: 18px;
      text-align: center;
    }
    .h-item {
      padding-bottom: 20px;
    }
  }

  /* $timeBorderColor: #cdcdcd;
   $timeIconColor: #00cc66;*/

  /*.goods-histories {
    border: 1px solid #dfe6ec;
    border-top: 0;
    padding: 10px 20px;
    h3 {
      margin: 0;
      font-weight: 500;
      font-size: 18px;
      text-align: center;
    }
    .h-item {
      padding-bottom: 20px;
      padding-left: 30px;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        left: 14px;
        top: 43px;
        width: 17px;
        border-top: 2px dashed $timeBorderColor;
      }
      &::after {
        content: '';
        position: absolute;
        left: 7px;
        top: 52px;
        bottom: 0;
        border-left: 2px dashed $timeBorderColor;
      }
      .top-line {
        position: absolute;
        left: 7px;
        top: 0;
        height: 36px;
        border-left: 2px dashed $timeBorderColor;
      }
      &:last-child {
        &::after {
          display: none;
        }
      }
      .top-icon {
        display: block;
        position: absolute;
        top: -17px;
        left: -4px;
        i {
          font-size: 24px;
          color: $timeIconColor;
        }
      }
    }
    .time-icon {
      position: absolute;
      left: 0;
      top: 36px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 2px solid $timeIconColor;
    }
  }*/
</style>
<template>
  <div>
    <div class="edit-receive">
      <el-button type="primary" size="mini" @click="$emit('editReceive')"
                 v-show="currentOrder.state==='3'|| currentOrder.state==='14'">编辑收货信息
      </el-button>
      <!--<perm label="order-acceptance-result-changer" v-show="currentOrder.state==='4'">-->
      <!--<el-button type="primary" size="mini" @click="$emit('editReceive')">变更验收结果</el-button>-->
      <!--</perm>-->
    </div>
    <el-row style="margin-bottom:0" class="page-main-body padding">
      <el-col :span="12">
        <oms-row label="订单号">
          <span>{{currentOrder.orderNo}}</span>
        </oms-row>
        <oms-row label="货主">
          {{ currentOrder.orgName }}
        </oms-row>
        <oms-row label="车牌号">
          {{ plateNumberTitle }}
        </oms-row>
        <oms-row label="订单始发地">
          {{ currentOrder.sentAddress }}
        </oms-row>
      </el-col>
      <el-col :span="12">
        <oms-row label="业务类型">
          <dict :dict-group="'bizInType'" :dict-key="currentOrder.bizType"></dict>
        </oms-row>
        <oms-row label="来源单位">
          {{currentOrder.supplierName}}
        </oms-row>
        <oms-row label="在途温度">
          <el-tag type="success" v-show="currentOrder.transportTemperatureFlag !== false">合格</el-tag>
          <el-tag type="warning" v-show="currentOrder.transportTemperatureFlag === false">不合格</el-tag>
        </oms-row>
        <oms-row label="到货时间">
          {{ currentOrder.arrivalDate |time }}
        </oms-row>
      </el-col>
    </el-row>
    <hr class="hr"/>
    <div v-loading="doing">
      <div v-for="item in goodsDetails" :key="item.id">
        <table class="product-detail-list" width="100%">
          <tbody>
          <tr>
            <td colspan="1" class="t-head">名称</td>
            <td colspan="5">
              <div>
                <el-tooltip class="item" effect="dark" content="平台货品名称" placement="right">
                  <span style="font-size: 14px;line-height: 20px">{{item.orgGoodsDto.goodsDto.name}}</span>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" effect="dark" content="货主货品名称" placement="right">
                  <span style="font-size: 12px;color:#999">{{ item.name }}</span>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" effect="dark" content="规格" placement="right">
                  <span style="font-size: 12px;">{{ item.orgGoodsDto.goodsDto.specifications }}</span>
                </el-tooltip>
              </div>
            </td>
            <td colspan="1" class="t-head">生产厂商</td>
            <td colspan="3">{{item.factoryName}}</td>
            <td colspan="1" class="t-head">供货厂商</td>
            <td colspan="3">{{item.salesFirmName}}</td>
          </tr>
          <tr>
            <td colspan="2" class="t-head">批号</td>
            <td colspan="2" class="t-head">生产日期</td>
            <td colspan="2" class="t-head">有效期</td>
            <td colspan="3" class="t-head">整件数量</td>
            <td colspan="3" class="t-head">散件数量</td>
            <td colspan="2" class="t-head">合计</td>
          </tr>
          <tr v-for="batchNumber in item.batchNumbers" :key="batchNumber.id"
              v-if="item.batchNumbers && item.batchNumbers.length > 0">
            <td colspan="2">
              {{ batchNumber.no }}
              <el-tag v-show="isNewBatch(batchNumber.batchNumberCreateTime)" style="height: 20px">新</el-tag>
            </td>
            <td colspan="2">{{ batchNumber.productionDate | date }}</td>
            <td colspan="2">{{ batchNumber.expiryDate | date }}</td>
            <td colspan="3">
              <div v-show="batchNumber.largePackageCount || batchNumber.largeNonconformityCount">
                <div v-show="batchNumber.largePackageCount">
                  <el-tag type="success">合格</el-tag>
                  {{ batchNumber.largePackageCount}}
                  <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.largeUnit"></dict>
                </div>
                <div style="padding: 5px 0 " v-show="batchNumber.largeNonconformityCount">
                  <el-tag type="warning">不合格</el-tag>
                  <el-tag type="success" v-show="batchNumber.largePackageFlag === true">入库</el-tag>
                  <el-tag type="success" v-show="batchNumber.largePackageFlag === false">拒收</el-tag>
                  {{ batchNumber.largeNonconformityCount}}
                  <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.largeUnit"></dict>
                </div>
              </div>
            </td>
            <td colspan="3">
              <div v-show="batchNumber.smallPackageCount || batchNumber.smallNonconformityCount">
                <div v-show="batchNumber.smallPackageCount">
                  <el-tag type="success">合格</el-tag>
                  {{ batchNumber.smallPackageCount}}
                  <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.smallUnit"></dict>
                </div>
                <div style="padding: 5px 0 " v-show="batchNumber.smallNonconformityCount">
                  <el-tag type="warning">不合格</el-tag>
                  <el-tag type="success" v-show="batchNumber.smallPackageFlag === true">入库</el-tag>
                  <el-tag type="success" v-show="batchNumber.smallPackageFlag === false">拒收</el-tag>
                  {{ batchNumber.smallNonconformityCount}}
                  <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.smallUnit"></dict>
                </div>
              </div>
            </td>
            <td colspan="2">
              {{ batchNumber.aggregateQuantity + batchNumber.refuseCount }}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
          </tr>
          <tr>
            <td colspan="2" class="t-head">应收</td>
            <td colspan="5">
              {{item.amount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
            <td colspan="2" class="t-head">实收</td>
            <td colspan="5">
          <span :class="{'color-red':getTotalNumber(item) !== item.amount}">{{ getTotalNumber(item) }}
          <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict></span>
            </td>
          </tr>
          <!--<tr v-for="simp in item.simpInfoList">-->
          <!--<td colspan="2" class="t-head">抽样</td>-->
          <!--<td colspan="12">-->
          <!--<span v-show="simp.wholeSampleCount > 0" class="mr15">-->
          <!--整箱:{{simp.wholeSampleCount}} {{simp.wholeSampleUnit}}-->
          <!--</span>-->
          <!--<span v-show="simp.bulkSampleCount > 0" class="mr15">-->
          <!--散件:{{simp.bulkSampleCount}}{{simp.bulkSampleUnit}}-->
          <!--</span>-->
          <!--</td>-->
          <!--&lt;!&ndash;<td colspan="2" class="t-head">验收结果</td>&ndash;&gt;-->
          <!--&lt;!&ndash;<td colspan="5">&ndash;&gt;-->
          <!--&lt;!&ndash;<span class="mr15" v-show="simp.eligibleCount > 0">&ndash;&gt;-->
          <!--&lt;!&ndash;合计合格:{{simp.eligibleCount}}{{simp.eligibleUnit}}&ndash;&gt;-->
          <!--&lt;!&ndash;</span>&ndash;&gt;-->
          <!--&lt;!&ndash;<span class="mr15" v-show="simp.unqualifiedCount > 0">&ndash;&gt;-->
          <!--&lt;!&ndash;合计不合格:{{simp.unqualifiedCount}}{{simp.eligibleUnit}}&ndash;&gt;-->
          <!--&lt;!&ndash;</span>&ndash;&gt;-->
          <!--&lt;!&ndash;</td>&ndash;&gt;-->
          <!--</tr>-->
          </tbody>
        </table>
        <div class="goods-histories" v-show="item.showHistories" v-loading="loadingHistory">
          <h3>历史记录</h3>
          <div class="empty-info mini" v-show="!item.reHistories.length">暂无数据</div>
          <div class="h-item" v-for="(h, index) in item.reHistories" :key="h.checkId">
            <!--<div class="top-icon" v-show="index === 0"><i class="el-icon-caret-top"></i></div>-->
            <!--<div class="top-line"></div>-->
            <!--<div class="time-icon"></div>-->
            <table class="product-detail-list is-top is-tint" width="100%">
              <tbody>
              <tr>
                <td colspan="3" class="t-head">记录创建时间</td>
                <td colspan="2" class="t-head">创建人</td>
                <td colspan="3" class="t-head">状态</td>
                <td colspan="2" class="t-head">审核人</td>
                <td colspan="3" class="t-head">审核时间</td>
              </tr>
              <tr>
                <td colspan="3">{{h.batchNumbers[0].createTime | time}}</td>
                <td colspan="2">{{h.batchNumbers[0].createPersonName}}</td>
                <td colspan="3">{{filterStatus(h.batchNumbers[0].status)}}</td>
                <td colspan="2">{{h.batchNumbers[0].auditPersonName}}</td>
                <td colspan="3">{{h.batchNumbers[0].auditTime | time}}</td>
              </tr>
              </tbody>
            </table>
            <table class="product-detail-list is-tint" width="100%">
              <tbody>
              <tr>
                <td colspan="1" class="t-head">名称</td>
                <td colspan="5">
                  <div>
                    <el-tooltip class="item" effect="dark" content="平台货品名称" placement="right">
                      <span style="font-size: 14px;line-height: 20px">{{h.orgGoodsDto.goodsDto.name}}</span>
                    </el-tooltip>
                  </div>
                  <div>
                    <el-tooltip class="item" effect="dark" content="货主货品名称" placement="right">
                      <span style="font-size: 12px;color:#999">{{ h.name }}</span>
                    </el-tooltip>
                  </div>
                  <div>
                    <el-tooltip class="item" effect="dark" content="规格" placement="right">
                      <span style="font-size: 12px">{{ item.orgGoodsDto.goodsDto.specifications }}</span>
                    </el-tooltip>
                  </div>
                </td>
                <td colspan="1" class="t-head">生产厂商</td>
                <td colspan="3">{{item.factoryName}}</td>
                <td colspan="1" class="t-head">供货厂商</td>
                <td colspan="3">{{item.salesFirmName}}</td>
              </tr>
              <tr>
                <td colspan="2" class="t-head">批号</td>
                <td colspan="2" class="t-head">生产日期</td>
                <td colspan="2" class="t-head">有效期</td>
                <td colspan="3" class="t-head">整件数量</td>
                <td colspan="3" class="t-head">散件数量</td>
                <td colspan="2" class="t-head">合计</td>
              </tr>
              <tr v-for="batchNumber in h.batchNumbers" :key="batchNumber.id">
                <td colspan="2">
                  {{ batchNumber.no }}
                  <el-tag v-show="isNewBatch(batchNumber.batchNumberCreateTime)" style="height: 20px">新</el-tag>
                </td>
                <td colspan="2">{{ batchNumber.productionDate | date }}</td>
                <td colspan="2">{{ batchNumber.expiryDate | date }}</td>
                <td colspan="3">
                  <div v-show="batchNumber.largePackageCount || batchNumber.largeNonconformityCount">
                    <div v-show="batchNumber.largePackageCount">
                      <el-tag type="success">合格</el-tag>
                      {{ batchNumber.largePackageCount}}
                      <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.largeUnit"></dict>
                    </div>
                    <div style="padding: 5px 0 " v-show="batchNumber.largeNonconformityCount">
                      <el-tag type="warning">不合格</el-tag>
                      <el-tag type="success" v-show="batchNumber.largePackageFlag === true">入库</el-tag>
                      <el-tag type="success" v-show="batchNumber.largePackageFlag === false">拒收</el-tag>
                      {{ batchNumber.largeNonconformityCount}}
                      <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.largeUnit"></dict>
                    </div>
                  </div>
                </td>
                <td colspan="3">
                  <div v-show="batchNumber.smallPackageCount || batchNumber.smallNonconformityCount">
                    <div v-show="batchNumber.smallPackageCount">
                      <el-tag type="success">合格</el-tag>
                      {{ batchNumber.smallPackageCount}}
                      <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.smallUnit"></dict>
                    </div>
                    <div style="padding: 5px 0 " v-show="batchNumber.smallNonconformityCount">
                      <el-tag type="warning">不合格</el-tag>
                      <el-tag type="success" v-show="batchNumber.smallPackageFlag === true">入库</el-tag>
                      <el-tag type="success" v-show="batchNumber.smallPackageFlag === false">拒收</el-tag>
                      {{ batchNumber.smallNonconformityCount}}
                      <dict :dict-group="'shipmentPackingUnit'" :dict-key="batchNumber.smallUnit"></dict>
                    </div>
                  </div>
                </td>
                <td colspan="2">
                  {{ batchNumber.aggregateQuantity + batchNumber.refuseCount }}
                  <dict :dict-group="'measurementUnit'" :dict-key="h.orgGoodsDto.goodsDto.measurementUnit"></dict>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="t-head">应收</td>
                <td colspan="5">
                  {{h.amount}}
                  <dict :dict-group="'measurementUnit'" :dict-key="h.orgGoodsDto.goodsDto.measurementUnit"></dict>
                </td>
                <td colspan="2" class="t-head">实收</td>
                <td colspan="5">
          <span :class="{'color-red':getTotalNumber(h) !== h.amount}">{{ getTotalNumber(h) }}
          <dict :dict-group="'measurementUnit'" :dict-key="h.orgGoodsDto.goodsDto.measurementUnit"></dict></span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {http} from '@/resources';

  export default {
    props: {
      currentOrder: {
        required: true,
        type: Object,
        default: function () {
          return {};
        }
      },
      index: {
        type: Number,
        default: -1
      },
      isFormReceipt: Boolean
    },
    data() {
      return {
        goodsDetails: [],
        plateNumbers: [],
        doing: false,
        loadingHistory: false
      };
    },
    computed: {
      plateNumberTitle() {
        return this.plateNumbers && this.plateNumbers.map(m => m.plateNumber).join('，') || '';
      }
    },
    watch: {
      index(val) {
        if (val !== 1) return;
        this.goodsDetails = [];
        if (!this.currentOrder.detailDtoList) return;
        this.getGoodsDetails();
        this.getPlateNumber();
      },
      isFormReceipt(val) {
        if (val) {
          this.getGoodsDetails();
          this.getPlateNumber();
        }
      }
    },
    methods: {
      getGoodsDetails() {
        if (!this.currentOrder.id) return;
        this.doing = true;
        http.get(`/receipt/order/${this.currentOrder.id}`).then(res => {
          let ary = [];
          let set = new Set();
          this.currentOrder && this.currentOrder.detailDtoList.forEach(i => set.add(i.orgGoodsId));
          [...set].forEach(i => {
            let children = this.currentOrder.detailDtoList.filter(g => g.orgGoodsId === i);
            // 拷贝一份订单详情，再累加其值
            children = JSON.parse(JSON.stringify(children));
            if (children.length === 1) {
              ary.push(children[0]);
            } else {
              let amount = 0;
              children.forEach(i => (amount += i.amount));
              children[0].amount = amount;
              ary.push(children[0]);
            }
          });
          // ary = JSON.parse(JSON.stringify(ary));
          ary.forEach(i => {
            i.reHistories = [];
            i.showHistories = false;
          });
          this.goodsDetails = ary;
          this.goodsDetails.forEach(i => {
            i.batchNumbers = res.data.filter(f => f.orderDetailId === i.id);
            if (i.batchNumbers.length) {
              i.factoryName = i.batchNumbers[0].factoryName;
            }
          });
        }).then(() => {
          http.get(`/order-sample/order/${this.currentOrder.id}`).then(res => {
            this.doing = false;
            this.goodsDetails.forEach(i => {
              i.simpInfoList = res.data.filter(f => f.orderDetailId === i.id);
            });
          }).catch(error => {
            this.doing = false;
          });
        });
      },
      isNewBatch(time) {
        return time && this.$moment().isSame(time, 'day');
      },
      getTotalNumber(item) {
        if (!item.batchNumbers) return 0;
        let num = 0;
        item.batchNumbers.forEach(b => {
          num += b.aggregateQuantity;
        });
        return num;
      },
      getPlateNumber() {
        if (!this.currentOrder.id) return;
        let params = {
          orderId: this.currentOrder.id
        };
        http.get('/order-plate', {params}).then(res => {
          this.plateNumbers = res.data;
        });
      }
    }
  };
</script>
