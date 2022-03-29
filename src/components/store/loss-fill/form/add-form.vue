<style lang="scss" scoped>
@import "../../../../assets/mixins.scss";

$leftWidth: 200px;

.el-form .el-checkbox__label {
  font-size: 12px;
  padding-left: 5px;
}

.el-form .el-checkbox__inner {
  width: 14px;
  height: 14px;
}

.content-part {
  .content-left {
    text-align: center;
    width: $leftWidth;
  }

  .content-right {
    > h3 {
      left: $leftWidth;
    }

    left: $leftWidth;
  }
}

.el-form .el-select {
  display: block;
}

.order-product-box {
  position: relative;

  /*border: 1px solid #ccc;*/

  border-radius: 10px;
  font-size: 12px;
  line-height: 26px;

  .product-info-fix {
    background: #f6f6f6;
    margin-top: 10px;
    padding: 5px;
    margin-bottom: 10px;
  }

  &:hover {
    border-color: #aaa
  }

  .product-remove {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
    color: #666;

    &:hover {
      color: #333
    }
  }

  .order-goods-info {
    .col-label {
      padding-top: 4px;
    }
  }
}

.ml15 {
  margin-left: 40px;
}

.combinatioon-product {
  color: #777
}

.productItem-info {
  float: left;
}

.goods-btn {
  a:hover {
    color: $activeColor;
  }
}

.total-wastage  {
    float: right;
    right: 150px;
    position: fixed;
    font-size: 20px;
    padding: 10px;
}

</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title" style="padding: 0">{{ getTitle() }}</h2>
        <ul>
          <li v-for="item in productListSet" class="list-style" v-bind:class="{ 'active' : index==item.key}"
              @click="setIndexValue(item.key)"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button :disabled="doing" type="success" @click="onSubmit">保存订单</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>{{ currentPartName }}</h3>
        <el-form ref="orderAddForm" :model="form" :rules="rules" label-width="120px" onsubmit="return false"
                 @submit.prevent="onSubmit">
          <el-form-item v-if="isSelfBreakage" label="损耗原因" prop="breakageReason">
            <oms-input v-model="form.breakageReason" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入损耗原因"
                       type="textarea"></oms-input>
          </el-form-item>
          <el-form-item v-if="!isSelfBreakage" label="损耗原因" prop="breakageReason">
            <el-select v-model="form.breakageReason" placeholder="请选择损耗原因" type="text">
              <el-option v-for="item in breakageReasons" :key="item.key" :label="item.label"
                         :value="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="附件" required>
            <oms-upload :fileList="attachmentList" accept="picture"
                        :formData="{ objectId: form.id, objectType: 'breakageOrderFile'}"
                        @change="changeFiles"></oms-upload>
          </el-form-item>
          <el-form-item label="追溯码" prop="code">
            <el-row>
              <el-col :span="8">
                <oms-input v-model="form.code" placeholder="请输入追溯码"></oms-input>
              </el-col>
              <el-col :span="6" offset="1">
                <el-button type="primary" @click="confirmAdd">确认添加</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-table :data="form.codeDetails" size="mini">
                  <el-table-column type="index"></el-table-column>
                  <el-table-column label="追溯码" prop="code"></el-table-column>
                  <el-table-column label="疫苗">
                    <template v-slot="{ row, $index }">

                      <el-popover trigger="hover" placement="top">
                        <div>产品名称：{{ row.platformGoodsName }}</div>
                        <div>货品名称：{{ row.goodsName }}</div>
                        <div>疫苗规格：{{ row.specification }}</div>
                        <div slot="reference" class="name-wrapper">
                          <el-tag size="mini">{{ row.goodsName }}</el-tag>
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column label="类型" prop="vaccineType"></el-table-column>
                  <el-table-column label="批号" prop="batchNumber"></el-table-column>
                  <el-table-column label="有效期">
                    <template v-slot="{ row, $index }">
                      {{ row.expiryDate | date }}
                    </template>
                  </el-table-column>
                  <el-table-column label="损耗人份" prop="wastageInput">
                    <template v-slot="{ row, $index }">
                      <el-form-item
                        style="margin:30px 0"
                        :prop="`codeDetails.${$index}.wastageInput`"
                        :rules="[
                                  { required: true, message: '请输入损耗人份' },
                                  { type: 'number', min: 1,max: row.wastage, message: `请输入1-${row.wastage}之间的数字` },
                                  ]">
                        <oms-input v-model.number="row.wastageInput"></oms-input>
                      </el-form-item>
                    </template>
                  </el-table-column>
                  <el-table-column>
                    <template v-slot="{ $index }">
                      <div style="margin:30px 0">
                        <el-button
                          type="danger"
                          @click="handleDelete($index)">删除
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                  <template slot="append">
                    <div class="total-wastage">
                      <total-count :list="form.codeDetails" property="wastageInput" title="合计人份"></total-count>
                    </div>
                  </template>
                </el-table>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {Address, erpOrder, http, InWork, OmsAttachment} from '@/resources';
import utils from '@/tools/utils';
import materialPart from '../material.vue';
import OrderMixin from '@/mixins/orderMixin';

export default {
  name: 'addForm',
  loading: false,
  components: {materialPart},
  mixins: [OrderMixin],
  props: {
    type: {
      type: String,
      default: '1'
    },
    action: {
      type: String,
      default: ''
    },
    defaultIndex: {
      type: Number,
      default: 0
    },
    orderId: String,
    vaccineType: String
  },

  data() {
    let checkOrderNumber = (rule, value, callback) => {
      if (value === '') {
        callback();
      } else {
        let re = /^[^\u4e00-\u9fa5]*$/;
        if (!re.test(value)) {
          callback(new Error('请输入正确的订单号'));
        } else {
          callback();
        }
      }
    };

    return {
      loading: false,
      filterProductList: [],
      // 附件
      attachmentList: [],
      form: {
        goodsType: '',
        orgId: '',
        customerId: '',
        bizType: '2-5',
        code: '',
        type: this.type,
        logisticsProviderName: '',
        customerChannel: '0',
        transportationMeansId: '',
        transportationAddress: '',
        logisticsCentreId: '',
        transportationCondition: '',
        importedFlag: false,
        orgRelation: '',
        orgAddress: '',
        qualifiedFlag: true,
        sameBatchNumber: false,
        actualConsignee: '',
        consigneePhone: '',
        thirdPartyNumber: '',
        expectedTime: '',
        detailDtoList: [],
        remark: '',
        breakageReason: '',
        fileIdList: [],
        fileType: 'breakageOrderFile',
        codeDetails: [{
          "id": "a8jMD7AuzhWvH1HO0Si", //库存id
          "stockNo": "6WvQnqmSxP8nCLc62Yw",
          "availableCount": 3,
          "createTime": 1611290622000,
          "batchNumberId": "6lRfB6vgoySqnF6txda", //批号id
          "batchNumber": "201908072", //批号
          "orgId": "HfdIwerZoC8OOTmwLuI", //单位id
          "orgName": "上海市长宁区华阳社区卫生服务中心", //单位名称
          "orgCode": "3101050101", //单位编码
          "areaCode": "310105", //区域编码
          "factoryId": "51ImQqKspTuMZVCNFGl", //生产厂商id
          "factoryName": "北京北生研生物制品有限公司", //厂商名称
          "orgGoodsId": "mkd0E7qWh36oIs831tr", //货主货品id
          "platformGoodsName": "口服I型III型脊髓灰质炎减毒活疫苗（人二倍体细胞）",
          "goodsName": "口服I型III型脊髓灰质炎减毒活疫苗（人二倍体细胞）", //货品名称
          "undeterminedCount": 0,
          "unqualifiedBizCount": 0,
          "unqualifiedCount": 0,
          "qualifiedCount": 5,
          "transitCount": 0,
          "expiryDate": 1640966400000, //有效期
          "nearTermDays": null,
          "warehouseId": null,
          "logisticsCentreId": null,
          "qualifiedBizServings": 32,
          "qualifiedActualServings": 50,
          "showFlag": null,
          "orgIdList": [],
          "remark": null,
          "vaccineType": "1", //货品类型
          "orgGoodsCode": "1110025", //货主货品编码
          "goodsGenericName": "口服I型III型脊髓灰质炎减毒活疫苗(人二倍体细胞)", //货主货品名称
          "specification": "每瓶1.0ml（10人份）", //规格
          "orgGoodsStatus": true,
          "wastage": 100, //可损耗人份（剂次）
          "wastageInput": '', //输入的可损耗人份（剂次） 必须小于wastage
          "multiPersonAgingId": "d1ZIbNWkh5RIruf1iBD", //多人份剂次id
          "code": "81892566218981686585" //追溯码
        },],
      },
      rules: {
        breakageReason: [
          {required: true, message: '请输入损耗原因', trigger: 'blur'},
        ],
        orderNo: [
          {required: true, message: '请输入货主订单编号', trigger: 'blur'},
          {validator: checkOrderNumber}
        ],
        thirdPartyNumber: [
          {required: true, message: '请输入去向订单编号', trigger: 'blur'},
          {validator: checkOrderNumber}
        ],
        code: [
          {required: true, message: '请输入追溯码', trigger: 'blur'}
        ],
      },
      orderGoodsRules: {
        orgGoodsId: [
          {required: true, message: '请选择产品', trigger: 'change'}
        ],
        amount: [
          {required: true, min: 1, type: 'number', message: '请输入产品数量', trigger: 'blur'}
        ],
        unitPrice: [
          {required: true, message: '请输入单价', trigger: 'change'}
        ],
        packingCount: [
          {required: true, min: 1, type: 'number', message: '请输入包装数量', trigger: 'blur'}
        ],
        specificationsId: [
          {required: true, message: '请选择包装单位', trigger: 'change'}
        ]
      },
      currentPartName: '',
      index: 0,
      productListSet: [
        {name: '损耗信息', key: 0}
      ],
      orgList: [],
      customerList: [],
      logisticsList: [],
      goodsList: {},
      relationList: [],
      LogisticsCenterAddressList: [],
      LogisticsCenter: [],
      doing: false,
      isSupplierOrOrg: false,
      saveKey: 'outOrderForm',
      showContent: {
        isShowOtherContent: true, // 是否显示物流类型
        isShowCustomerId: true, // 是否显示POV
        expectedTimeLabel: '预计出库时间'
      },
      warehouses: [], // 收货单位收货地址列表
      batchNumbers: [], // 疫苗批号列表
      selectBatchNumbers: [], // 已经选择的疫苗批号
      changeTotalNumber: utils.changeTotalNumber,
      isCheckPackage: utils.isCheckPackage,
      requestTime: '',
      editItemProduct: {},
      isHasBatchNumberInfo: false,
      formCopy: {},
      warehouseTypeList: this.$store.state.warehouseType
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
    breakageOrgType() { // 单位类型 0疾控 1pov
      return this.$store.state.breakageOrgType;
    },
    breakageReasons() { // 损耗原因
      return this.$getDict('breakageReason');
    },
    breakageType() { // 损耗方式
      return this.$getDict('breakageType');
    },
    isSelfBreakage() { // pov自行损耗
      return this.form.customerChannel !== '1';
    },
    isEntrustWarehouse() {
      let status = false;
      this.LogisticsCenterAddressList.forEach(i => {
        if (i.id === this.form.orgAddress) {
          status = i.warehouseType;
        }
      });
      return status === '0';
    },
    // totalWastageInput() {
    //   return this.codeDetails.map(item => item.wastageInput).reduce((a, b) => a + b);
    // }
  },
  watch: {
    index: function () {
      this.productListSet.forEach((item) => {
        if (item.key === this.index) {
          this.currentPartName = item.name;
        }
      });
    },
    defaultIndex(val) {
      if (!val) return;
      this.attachmentList = [];
      // 清空表单
      this.resetForm();
      this.form.state = '';
      this.form.id = null;
      this.formCopy = {};
      this.index = 0;
      let user = this.$store.state.user;
      this.form.orgId = user.userCompanyAddress;
      this.checkLicence(this.form.orgId);
      if (val === 2) {
        this.editOrderInfo();
      } else {
        this.filterAddress();
      }
    },
  },

  mounted: function () {
    this.currentPartName = this.productListSet[0].name;
  },
  methods: {
    queryAttachmentList: function () {// 附件管理
      if (!this.form.id) return;
      if (!this.form.fileIdList) {
        this.form.fileIdList = [];
      }
      OmsAttachment.queryOneAttachmentList(this.form.id, 'breakageOrderFile').then(res => {
        this.attachmentList = res.data;
        this.attachmentList.forEach(val => {
          this.form.fileIdList.push(val.attachmentId);
        })
      });
    },
    changeFiles: function (fileList) {
      let ids = [];
      fileList.forEach(file => {
        ids.push(file.attachmentId);
      });
      this.form.fileIdList = ids;
    },
    changeVaccineType(val) {
      this.resetProductForm();
      this.form.detailDtoList = [];
    },
    filterAddressLabel(item) {
      let name = item.name ? '【' + item.name + '】' : '';
      return name + item.detail + `（${this.warehouseTypeList[item.warehouseType].label}）`;
    },
    getWarehouseAddress: function (item) { // 得到仓库地址
      return item.detail + `（${this.warehouseTypeList[item.warehouseType].label}）`;
    },
    getTitle() {
      return `${this.defaultIndex === 2 ? '编辑' : '添加'}损耗`;
    },
    resetForm: function () {// 重置表单
      this.$refs['orderAddForm'].resetFields();
      this.form.actualConsignee = '';
      this.form.consigneePhone = '';
      this.form.logisticsProviderName = '';
      this.form.remark = '';
      this.form.breakageReason = '';
      this.form.detailDtoList = [];
      this.form.customerId = '';
      this.form.transportationMeansId = '';
      this.form.transportationAddress = '';
      this.form.transportationCondition = '';
      this.form.orgAddress = '';
      this.filterProductList = [];
      // 清空附件列表
      this.attachmentList = [];
      this.form.fileIdList = [];
      this.resetProductForm();
    },
    editOrderInfo() {
      if (!this.orderId) return;
      // 查询供货单位
      this.queryOnCDCs();
      InWork.queryOrderDetail(this.orderId).then(res => {
        res.data.detailDtoList.forEach(f => {
          f.orgGoodsName = f.name;
          f.no = f.batchNumber;
        });
        this.form = res.data;
        this.formCopy = JSON.parse(JSON.stringify(res.data));

        this.filterAddress(true);
        this.searchWarehouses();
        // 查询附件
        this.queryAttachmentList();
      });
    },
    formatPrice() {// 格式化单价，保留两位小数
      this.product.unitPrice = utils.autoformatDecimalPoint(this.product.unitPrice);
    },
    setIndexValue: function (value) {// 左侧显示页切换
      this.index = value;
    },
    qualifiedFlagChange() { // 改变是否合格
      this.resetProductForm();
      this.form.detailDtoList = [];
    },
    customerChannelChange() { // 改变损耗方式
      this.form.customerId = '';
      this.form.remark = '';
      this.warehouses = [];
      this.form.transportationAddress = '';
      this.queryOnCDCs();
      this.searchWarehouses();
    },
    transportationMeansIdChange(val) { // 改变运输方式
      this.warehouses = [];
      this.form.transportationAddress = '';
      this.form.transportationCondition = '';
      if (val !== '0') return;
      this.searchWarehouses();
    },
    customerIdChange() { // 改变去向单位
      this.warehouses = [];
      this.form.transportationAddress = '';
      this.searchWarehouses();
    },
    searchWarehouses() { // 查询收货地址
      let orgId = this.isSelfBreakage ? this.$store.state.user.userCompanyAddress : this.form.customerId;
      if (!orgId) return;
      Address.queryAddress(orgId, {
        deleteFlag: false, orgId: orgId, auditedStatus: '1', status: 0
      }).then(res => {
        this.warehouses = res.data || [];
      });
    },
    filterAddress(isStorageData) {
      Address.queryAddress(this.form.orgId, {
        deleteFlag: false,
        orgId: this.form.orgId,
        auditedStatus: '1',
        status: 0
      }).then(res => {
        this.LogisticsCenterAddressList = res.data;
        if (isStorageData) return;
        let defaultStore = res.data.filter(item => item.default);
        this.form.orgAddress = defaultStore.length ? defaultStore[0].id : '';
        this.transportationAddressChange(this.form.orgAddress);
      });
    },
    checkLicence: function (val) {// 检查货主/单位证照是否过期
      if (!val) return;
      http.get('/order-licence/org/' + val + '/overdue').then(res => {
        if (!res.data.length) return;
        let msg = '';
        res.data.forEach(item => {
          msg += '"' + item.name + '",';
        });
        msg = msg.substring(0, msg.length - 1);
        this.$notify({
          duration: 2000,
          title: '证照信息过期',
          message: msg + '证照信息已过期,无法创建订单',
          type: 'error'
        });
      });
    },
    setIsHasBatchNumberInfo(val) {
      this.isHasBatchNumberInfo = val;
    },
    // 确认添加追溯码
    confirmAdd() {
      if (!this.form.code) {
        this.$notify.warning('请先输入追溯码');
        return false;
      }

      // 调用接口查询追溯码情况
      this.$http.get('/erp-stock/query-wastage-by-code', {params: {code: this.form.code}})
        .then(res => {
          let data = {
            ...res.data,
            wastageInput: ''
          };
          this.form.codeDetails.push(data);
        })
        .catch(err => {
          // 码使用情况 提示文案
          // 未开瓶 此货品未开瓶使用
          // 已使用完毕 该货品已使用完毕
          // 已扫码 该货品在损耗清单内
          // 校验货主 该码非本单位货品
          console.log({...err})
          // this.$message.warning(err.messages)
          const mockData = {
            "id": "a8jMD7AuzhWvH1HO0Si", //库存id
            "stockNo": "6WvQnqmSxP8nCLc62Yw",
            "availableCount": 3,
            "createTime": 1611290622000,
            "batchNumberId": "6lRfB6vgoySqnF6txda", //批号id
            "batchNumber": "201908072", //批号
            "orgId": "HfdIwerZoC8OOTmwLuI", //单位id
            "orgName": "上海市长宁区华阳社区卫生服务中心", //单位名称
            "orgCode": "3101050101", //单位编码
            "areaCode": "310105", //区域编码
            "factoryId": "51ImQqKspTuMZVCNFGl", //生产厂商id
            "factoryName": "北京北生研生物制品有限公司", //厂商名称
            "orgGoodsId": "mkd0E7qWh36oIs831tr", //货主货品id
            "platformGoodsName": "口服I型III型脊髓灰质炎减毒活疫苗（人二倍体细胞）",
            "goodsName": "口服I型III型脊髓灰质炎减毒活疫苗（人二倍体细胞）", //货品名称
            "undeterminedCount": 0,
            "unqualifiedBizCount": 0,
            "unqualifiedCount": 0,
            "qualifiedCount": 5,
            "transitCount": 0,
            "expiryDate": 1640966400000, //有效期
            "nearTermDays": null,
            "warehouseId": null,
            "logisticsCentreId": null,
            "qualifiedBizServings": 32,
            "qualifiedActualServings": 50,
            "showFlag": null,
            "orgIdList": [],
            "remark": null,
            "vaccineType": "1", //货品类型
            "orgGoodsCode": "1110025", //货主货品编码
            "goodsGenericName": "口服I型III型脊髓灰质炎减毒活疫苗(人二倍体细胞)", //货主货品名称
            "specification": "每瓶1.0ml（10人份）", //规格
            "orgGoodsStatus": true,
            "wastage": Number.parseInt(this.form.code), //可损耗人份（剂次）
            "wastageInput": '', //输入的可损耗人份（剂次） 必须小于wastage
            "multiPersonAgingId": "d1ZIbNWkh5RIruf1iBD", //多人份剂次id
            "code": this.form.code //追溯码
          };

          this.form.codeDetails.push(mockData);
        })
    },
    resetProductForm() {
      this.product = {
        'amount': null,
        'entrustment': false,
        'measurementUnit': '',
        'orgGoodsId': '',
        'packingCount': null,
        'specificationsId': '',
        'fixInfo': {
          'goodsDto': {}
        },
        'unitPrice': null
      };

      this.accessoryList = [];
      this.batchNumbers = [];
      this.editItemProduct = {};
    },
    handleDelete(index) {
      this.form.codeDetails.splice(index, 1)
    },
    onSubmit: function () {// 提交表单
      if (this.form.fileIdList.length === 0) {
        this.$notify({
          duration: 2000,
          message: '请添加附件',
          type: 'warning'
        });
        return false;
      }
      if (!this.checkHasOrderNotAdded(this.product)) return;
      let self = this;
      this.$refs['orderAddForm'].validate((valid) => {
        if (!valid || this.doing) {
          this.index = 0;
          return false;
        }
        let saveData = JSON.parse(JSON.stringify(self.form));
        if (saveData.detailDtoList.length === 0) {
          this.$notify({
            duration: 2000,
            message: '请添加订单产品',
            type: 'warning'
          });
          return false;
        }
        saveData.detailDtoList.forEach(item => {
          !item.combinationFlag && (item.combinationFlag = item.isCombination);
          delete item.fixInfo;
          delete item.mainOrgId;
          delete item.isCombination;
          delete item.proportion;
          delete item.orgGoodsDto;
        });
        saveData.detailDtoList = this.mergeSameOrgGoodsIdAndBatchNumberWhenOut(saveData.detailDtoList);
        let orgId = this.$store.state.user.userCompanyAddress;

        // 没有去向单位id, 默认设置自己
        if (!saveData.customerId) {
          saveData.customerId = this.$store.state.user.userCompanyAddress;
        }
        this.doing = true;
        if (saveData.id) {
          erpOrder.updateOrder(saveData.id, saveData).then(res => {
            this.$notify({
              duration: 2000,
              message: '编辑损耗成功',
              type: 'success'
            });
            self.$emit('change');
            this.doing = false;
            this.$emit('close');
            this.resetForm();
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '编辑损耗失败',
              message: error.response && error.response.data && error.response.data.msg || '网络异常',
              type: 'error'
            });
          });
        } else {
          erpOrder.save(saveData).then(res => {
            this.$notify({
              duration: 2000,
              message: '新增损耗成功',
              type: 'success'
            });
            window.localStorage.removeItem(this.saveKey);
            self.$emit('change', res.data);
            this.doing = false;
            this.$emit('close');
            this.resetForm();
          }).catch(error => {
            this.doing = false;
            this.$notify({
              duration: 2000,
              title: '新增损耗失败',
              message: error.response && error.response.data && error.response.data.msg || '网络异常',
              type: 'error'
            });
          });
        }
      });
    }
  }
};
</script>
