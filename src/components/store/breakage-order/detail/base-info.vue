<style lang="scss" scoped="">

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
</style>
<template>
  <div>
    <div v-if="!currentOrder.id">
      <oms-loading :loading="!currentOrder.id"></oms-loading>
    </div>
    <div v-else="" class="page-main-body padding">
      <div>
        <el-row style="margin-bottom:0;position: relative" v-show=" currentOrder.bizType !== '2-2' ">
          <el-col :span="12">
            <oms-row label="货主订单号" :span="span">
              {{currentOrder.orderNo}}
            </oms-row>
            <oms-row label="货主" :span="span">
              {{currentOrder.orgName}}
            </oms-row>
            <oms-row label="报损方式" :span="span">
              <dict :dict-group="'breakageType'" :dict-key="currentOrder.customerChannel"></dict>
            </oms-row>
            <oms-row label="上级供货单位" :span="span" v-show="currentOrder.customerChannel === '1'">
              {{currentOrder.customerName}}
            </oms-row>
            <oms-row label="物流中心" :span="span" v-show="currentOrder.centreName">
              {{currentOrder.centreName}}
            </oms-row>
            <oms-row label="运输条件" :span="span">
              <dict :dict-group="'transportationCondition'" :dict-key="currentOrder.transportationCondition"></dict>
            </oms-row>
            <oms-row label="仓库地址" :span="span">
              <span class="goods-span">{{currentOrder.outWarehouseAddress}}</span>
            </oms-row>
            <oms-row label="物流商" :span="span">
              <span class="goods-span">{{currentOrder.logisticsProviderName}}</span>
            </oms-row>
            <oms-row label="收货地址" :span="span" v-show="currentOrder.warehouseAddress">
              <span class="goods-span">{{currentOrder.warehouseAddress}}</span>
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="货品类型">
              <dict dict-group="orderGoodsType" :dict-key="'' + currentOrder.goodsType"></dict>
            </oms-row>
            <oms-row label="业务类型">
              <dict :dict-group="'bizOutType'" :dict-key="currentOrder.bizType"></dict>
            </oms-row>
            <oms-row label="运输方式" v-show="currentOrder.transportationMeansId">
              <dict :dict-group="'outTransportMeans'" :dict-key="currentOrder.transportationMeansId"></dict>
            </oms-row>
            <oms-row label="下单时间">
              <span class="goods-span">{{currentOrder.createTime | minute}}</span>
            </oms-row>
            <oms-row label="预计送货时间" v-show="currentOrder.expectedTime">
              <span class="goods-span">{{currentOrder.expectedTime | date}}</span>
            </oms-row>
            <oms-row label="是否合格">
              <span class="goods-span" v-show="currentOrder.qualifiedFlag">合格</span>
              <span class="goods-span" v-show="!currentOrder.qualifiedFlag">不合格</span>
            </oms-row>
            <oms-row label="订单状态">
              {{ getOrderStatus(currentOrder) }}
              <order-push-status :status="currentOrder.pushStatus" :msg="currentOrder.pushMessage"/>
            </oms-row>
            <!--<oms-row :label="getTimeTitle(currentOrder)" v-show="currentOrder.expectedTime">-->
            <!--<span class="goods-span">{{currentOrder.expectedTime | date}}</span>-->
            <!--</oms-row>-->
          </el-col>
        </el-row>
        <el-row v-show="currentOrder.remark">
          <oms-row label="报损原因" :span="4">{{ currentOrder.remark }}</oms-row>
        </el-row>
      </div>

      <!--<hr class="hr"/>-->
      <div class="table-product">
        <table class="table no-border table-product-list" v-show="currentOrder.detailDtoList">
          <thead>
          <tr>
            <td></td>
            <td></td>
            <td class="text-center">疫苗</td>
            <td class="text-center">批号</td>
            <!--<td>生产日期</td>-->
            <td class="text-center">有效期</td>
            <td class="text-center">单价</td>
            <td class="text-center">数量</td>
            <td class="text-center">金额</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in currentOrder.detailDtoList" v-if="item.orgGoodsDto">
            <td width="10">{{index + 1}}</td>
            <td width="80">
              <el-tooltip v-if="$formatPhotoUrl(item)" popperClass="el-tooltip" class="item"
                          effect="light" placement="right">
                <compressed-img :src="$formatPhotoUrl(item) +'?image&action=resize:h_80,w_80,m_2' "
                                class="product-img"/>
                <compressed-img slot="content" :src="$formatPhotoUrl(item) +'?image&action=resize:h_200,m_2' "
                                class="product-img"/>
              </el-tooltip>
              <el-tooltip v-else class="item" effect="light" popperClass="el-tooltip" placement="right">
                <img :src="'../../../../static/img/userpic.png'" class="product-img">
                <img :src="'../../../../static/img/userpic.png'" slot="content" class="product-img">
              </el-tooltip>
            </td>
            <td>
              <div>
                <el-tooltip class="item" effect="dark"
                            :content="`货主疫苗编码:${item.orgGoodsDto.goodsNo} 货主疫苗ID:${item.orgGoodsId}`" placement="right">
                  <span style="font-size: 14px;line-height: 20px">{{item.name}}</span>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" effect="dark"
                            :content="`疫苗主档编号:${item.orgGoodsDto.goodsDto.code} 疫苗主档ID:${item.goodsId}`"
                            placement="right">
                  <span style="font-size: 12px;color:#999">{{ item.goodsName }}</span>
                </el-tooltip>
              </div>
              <div>
                <el-tooltip class="item" effect="dark" content="疫苗规格" placement="right">
                  <span style="font-size: 12px;">{{ item.orgGoodsDto.goodsDto.specifications }}</span>
                </el-tooltip>
              </div>
            </td>
            <td width="100px" class="R text-center">
              {{ item.batchNumber || '无' }}
              <!--<el-tag v-show="item.inEffectiveFlag" type="warning">近效期</el-tag>-->
              <goods-status-tag :item="item" :form="currentOrder"/>
            </td>
            <!--<td>{{ item.productionDate | date }}</td>-->
            <td width="90px" class="text-center">{{ item.expiryDate | date }}</td>
            <td width="80px" class="text-center">
              <span v-if="item.unitPrice">￥{{item.unitPrice | formatMoney}}</span>
              <span v-if="!item.unitPrice">-</span>
            </td>
            <td width="80px" class="text-center">
              {{item.amount}}
              <dict :dict-group="'measurementUnit'" :dict-key="item.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </td>
            <td class="text-center">
            <span v-if="item.unitPrice">
              <span>¥</span>{{ item.amount * item.unitPrice | formatMoney }}
            </span>
              <span v-if="!item.unitPrice">-</span>
            </td>
          </tr>
          <tr class="text-center">
            <td colspan="6" align="right">
              <total-count property="amount" :list="currentOrder.detailDtoList"></total-count>
            </td>
            <td colspan="2" align="right">
            <span style="font-weight:600;"
                  v-show="currentOrder.totalAmount">合计: ¥  {{ currentOrder.totalAmount | formatMoney
              }}</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import {Address, LogisticsCenter} from '@/resources';
  import materialPart from '../material.vue';

  export default {
    components: {materialPart},
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
    computed: {
      bizTypeList() {
        return this.$getDict('bizOutType');
      },
      transportationMeansList() {
        return this.$getDict('outTransportMeans');
      },
      transportationConditionList() {
        return this.$getDict('transportationCondition');
      },
      shipmentPackingUnit() {
        return this.$getDict('shipmentPackingUnit');
      },
      measurementUnitList() {
        return this.$getDict('measurementUnit');
      },
      orgRelationList() {
        return this.$getDict('orgRelation');
      },
      totalMoney: function () {
        let totalMoney = 0.00;
        if (!this.form.detailDtoList.length) return totalMoney;
        this.form.detailDtoList.forEach(item => {
          totalMoney += item.amount * item.unitPrice;
        });
        return totalMoney;
      },
      breakageOrgType() {
        return this.$store.state.breakageOrgType;
      },
      breakageType() { // 报损方式
        return this.$getDict('breakageType');
      }
    },
    watch: {
      currentOrder(val) {
        if (!val.id) return;
        if (val.state === '0') {
          this.searchWarehouses();
          this.filterAddress();
        }
      },
      isCheck(val) {
        if (val) {
          this.check();
        }
      }
    },
    methods: {
      filterAddressLabel(item) {
        let name = item.name ? '【' + item.name + '】' : '';
        return name + item.detail;
      },
      getTimeTitle: function (item) {
        return item.transportationMeansId === '0' ? item.bizType === '2-1' ? '预计出库' : '预计送货'
          : item.transportationMeansId === '1' ? '预计提货'
            : item.transportationMeansId === '2' ? '预计发货' : '';
      },
      getWarehouseAdress: function (item) { // 得到仓库地址
        return item.detail + `（${item.warehouseType === '0' ? '物流仓库' : '本地仓库'}）`;
      },
      changeRemark(form) {
        if (!this.currentOrder.remark) {
          this.currentOrder.remark = form.count + form.name;
        } else {
          this.currentOrder.remark += '，' + form.count + form.name;
        }
      },
      searchWarehouses() {
        if (!this.currentOrder.customerId) {
          this.warehouses = [];
          return;
        }
        Address.queryAddress(this.currentOrder.customerId, {
          deleteFlag: false,
          auditedStatus: '1',
          orgId: this.currentOrder.customerId, status: 0
        }).then(res => {
          this.warehouses = res.data || [];
        });
      },
      changeWarehouseAdress: function (val) {
        this.currentOrder.actualConsignee = '';
        this.currentOrder.consigneePhone = '';
        this.warehouses.forEach(item => {
          if (val === item.id) {
            this.currentOrder.actualConsignee = item.contact;
            this.currentOrder.consigneePhone = item.consigneePhone;
          }
        });
      },
      filterLogisticsCenter: function () {// 过滤物流中心
        let param = {
          deleteFlag: false
        };
        LogisticsCenter.query(param).then(res => {
          this.LogisticsCenter = res.data;
        });
      },
      filterAddress() {
        Address.queryAddress(this.currentOrder.orgId, {
          deleteFlag: false,
          orgId: this.currentOrder.orgId,
          auditedStatus: '1', status: 0
        }).then(res => {
          this.LogisticsCenter = res.data;
        });
      },
      changeExpectedTime: function (date) {// 格式化日期
        if (!date) {
          this.currentOrder.expectedTime = '';
          return;
        }
        this.currentOrder.expectedTime = this.$moment(date).format('YYYY-MM-DD');
      },
      getOrderStatus: function (order) { // 获取订单状态
        let state = '';
        for (let key in utils.outOrderType) {
          if (order.state === utils.outOrderType[key].state) {
            state = utils.outOrderType[key].title;
          }
        }
        return state;
      },
      check() {
        this.$refs['orderAddForm'].validate((valid) => {
          if (!valid) {
            return false;
          }
          this.$emit('checkPass');
        });
      }
    }
  };
</script>
