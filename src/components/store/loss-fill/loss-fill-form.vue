<style lang="scss" scoped>
@import "../../../assets/mixins";

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
        <h2 class="clearfix right-title" style="padding: 0">{{ getTitle() }}</h2>
        <ul>
          <li v-for="item in productListSet" class="list-style" v-bind:class="{ 'active' : index==item.key}"
              @click="setIndexValue(item.key)"><span>{{ item.name }}</span>
          </li>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button :disabled="disabled" type="success" @click="saveOrder">保存订单</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3>{{ currentPartName }}</h3>
        <el-form ref="orderAddForm" :model="form" :rules="rules" label-width="100px" onsubmit="return false"
                 @submit.prevent="saveOrder">
          <el-form-item label="损耗原因" prop="breakageReason">
            <oms-input v-if="selfLoss" v-model="form.breakageReason" :autosize="{ minRows: 2, maxRows: 5}"
                       placeholder="请输入损耗原因"
                       type="textarea"></oms-input>
            <el-select v-else v-model="form.breakageReason" placeholder="请选择损耗原因" type="text">
              <el-option v-for="item in breakageReasons" :key="item.key" :label="item.label"
                         :value="item.label"></el-option>
            </el-select>

          </el-form-item>
          <el-form-item label="附件" required>
            <oms-upload :fileList="attachmentList" accept="picture"
                        :formData="{ objectId: form.id, objectType: 'erpOrderFile'}"
                        @change="changeFiles"></oms-upload>
          </el-form-item>
          <el-form-item label="追溯码" prop="code">
            <el-row>
              <el-col :span="8">
                <oms-input v-model="form.code" placeholder="请输入要损耗的追溯码"></oms-input>
              </el-col>
              <el-col :span="6" :offset="1">
                <el-button type="primary" @click="confirmAdd">确认添加</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-table :data="form.detailDtoList" size="mini">
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
                <template v-slot="{ row, $index }">
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
              <el-table-column label="批号" prop="batchNumber"></el-table-column>
              <el-table-column label="有效期">
                <template v-slot="{ row, $index }">
                  {{ row.expirationDate | date }}
                </template>
              </el-table-column>
              <!--请选择损耗时间-->
              <el-table-column label="损耗时间" align="center" width="235px">
                <template v-slot="{ row}">
                  <el-form-item
                    style="margin:30px 0"
                    :rules="[{ required: true, message: '请选择损耗时间' }]">
                    <el-date-picker
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="timestamp"
                      type="datetime"
                      v-model="row.breakageTime"
                      placeholder="请选择损耗时间"/>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="损耗人份" prop="amount" fixed="right" align="center">
                <template v-slot="{ row, $index }">
                  <el-form-item
                    style="margin:30px 0"
                    :prop="`detailDtoList.${$index}.amount`"
                    :rules="[
                                  { required: true, message: '请输入损耗人份' },
                                  { type: 'number', min: 1,max: row.wastage, message: `请输入1-${row.wastage}之间的数字` },
                                  ]">
                    <oms-input v-model.number="row.amount"></oms-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column fixed="right" width="60" align="center">
                <template v-slot="{ $index }">
                  <el-button type="danger"
                             icon="el-icon-close"
                             circle
                             size="small"
                             style="padding: 5px"
                             @click="handleDelete($index)"
                  ></el-button>
                </template>
              </el-table-column>
              <template slot="append">
                <div class="total-wastage">
                  <total-count :list="form.detailDtoList" property="amount" title="合计人份"></total-count>
                </div>
              </template>
            </el-table>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {erpOrder, InWork, OmsAttachment} from '@/resources';
import utils from '@/tools/utils';
import OrderMixin from '@/mixins/orderMixin';

export default {
  name: 'loss-fill-detail',
  loading: false,
  components: {},
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
        id: '',
        customerChannel: '',
        "orgId": "", //单位id
        "bizType": "2-5", //订单类型（该处固定）
        "type": "1", //出入库类型（该处固定）
        "detailDtoList": [
          // {
          //   "amount": 1, //损耗人份数量
          //   "orgGoodsId": "ZRnv8eWxjiNRGoTGqhs", //货主货品名称
          //   "specificationsId": "",
          //   "orgGoodsName": "wyc001", //货主货品名称
          //   "batchNumberId": "l2IB03Y0laOA1sBMmuX", //批号id
          //   "batchNumber": "20220330", //批号
          //   "expirationDate": 1773763200000, //有效期
          //   "code": "16486106640410000001", //追溯码
          //   "multiPersonAgingId": "202203301141", //多人份剂次id
          //   "stockId": "AijTTt75zlEUiiz8owv" //库存id
          // }
        ], //货品列表
        "breakageReason": "", //损耗原因
        "fileIdList": [], //文件id集合
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
      disabled: false,
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
      warehouseTypeList: this.$store.state.warehouseType
    };
  },
  computed: {
    breakageReasons() { // 损耗原因
      return this.$getDict('breakageReason');
    },
    selfLoss() { // pov自行损耗
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
      this.form.id = '';
      this.index = 0;
      let user = this.$store.state.user;
      this.form.orgId = user.userCompanyAddress;
      if (val === 2) {
        this.editOrderInfo();
      }
    },
  },
  mounted: function () {
    this.currentPartName = this.productListSet[0].name;
  },
  methods: {
    // 附件管理
    queryAttachmentList() {
      if (!this.form.id) return;
      if (!this.form.fileIdList) {
        this.form.fileIdList = [];
      }
      OmsAttachment.queryOneAttachmentList(this.form.id, 'erpOrderFile').then(res => {
        this.attachmentList = res.data;
        // console.log('res.data:',res.data)
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
      this.filterProductList = [];
      // 清空附件列表
      this.attachmentList = [];
      this.form.fileIdList = [];
    },
    editOrderInfo() {
      if (!this.orderId) return;
      InWork.queryOrderDetail(this.orderId).then(res => {
        this.detail2FormData(res.data);
        // 查询附件
        this.queryAttachmentList();
      });
    },
    detail2FormData(data) {
      this.form.id = data.id;
      this.form.customerChannel = data.customerChannel;
      this.form.orgId = data.orgId;
      this.form.breakageReason = data.breakageReason;
      console.info(data.detailDtoList);
      this.form.detailDtoList = data.detailDtoList.map(ddl => ({
        "breakageTime":ddl.breakageTime,//损耗时间
        "amount": ddl.amount, //损耗人份数量
        "wastage": ddl.wastage, //损耗人份数量
        "orgGoodsId": ddl.orgGoodsId, //货主货品id
        "orgGoodsName": ddl.orgGoodsDto.name, //货主货品名称
        "specificationsId": "",
        specificationName: ddl.orgGoodsDto.goodsDto.specifications,//规格名称
        goodsType: ddl.orgGoodsDto.goodsVaccineSign,//货品类型
        productName: ddl.orgGoodsDto.goodsDto.name,//产品名称
        photoUrl: ddl.orgGoodsDto.goodsDto.photo,
        "batchNumberId": ddl.batchNumberId, //批号id
        "batchNumber": ddl.batchNumber, //批号
        "expirationDate": ddl.expiryDate, //有效期
        "code": ddl.code, //追溯码
        "multiPersonAgingId": ddl.multiPersonAgingId, //多人份剂次id
        "stockId": ddl.stockId //库存id
      }));
    },
    code2FormData(ddl) {
      const detailDto = {
        "amount": '', //损耗人份数量
        "wastage": ddl.wastage, //最大可损耗人份数量
        "orgGoodsId": ddl.orgGoodsId, //货主货品id
        "orgGoodsName": ddl.goodsName, //货主货品名称
        "specificationsId": "",
        specificationName: ddl.specification,//规格名称
        goodsType: ddl.vaccineType,//货品类型
        productName: ddl.platformGoodsName,//产品名称
        "batchNumberId": ddl.batchNumberId, //批号id
        "batchNumber": ddl.batchNumber, //批号
        "expirationDate": ddl.expiryDate, //有效期
        "code": ddl.code, //追溯码
        "multiPersonAgingId": ddl.multiPersonAgingId, //多人份剂次id
        "stockId": ddl.id, //库存id
        photoUrl: ddl.photoUrl
      }

      this.form.detailDtoList.push(detailDto);
    },
    setIndexValue: function (value) {// 左侧显示页切换
      this.index = value;
    },
    // 确认添加追溯码
    confirmAdd() {
      if (!this.form.code) {
        this.$notify.warning('请先输入追溯码');
        return;
      }

      const exist = this.form.detailDtoList.some(cd => cd.code === this.form.code);
      if (exist) {
        this.$notify.warning('追溯码已存在，请勿重复添加！');
        return
      }

      // 调用接口查询追溯码情况
      this.$http.get('/erp-stock/query-wastage-by-code', {params: {code: this.form.code}})
        .then(res => {
          this.code2FormData(res.data);
        })
        .catch(err => {
          const {msg} = err.response.data;
          this.$notify.warning(msg);
        })
    },
    handleDelete(index) {
      this.$confirm('确定要删除当前行吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.form.detailDtoList.splice(index, 1);
      })
    },
    // 保存订单
    saveOrder() {
      if (this.form.fileIdList.length === 0) {
        this.$notify({
          duration: 2000,
          message: '请添加附件',
          type: 'warning'
        });
        return false;
      }

      this.$refs['orderAddForm'].validate((valid) => {
        if (!valid || this.disabled) {
          this.index = 0;
          return false;
        }

        if (this.form.detailDtoList.length === 0) {
          this.$notify({
            duration: 2000,
            message: '请输入追溯码并确认添加',
            type: 'warning'
          });
          return false;
        }

        this.disabled = true;
        if (this.form.id) {
          erpOrder.updateOrder(this.form.id, this.form).then(res => {
            this.$notify({
              duration: 2000,
              message: '编辑损耗成功',
              type: 'success'
            });
            this.$emit('change');
            this.disabled = false;
            this.$emit('close');
            this.resetForm();
          }).catch(error => {
            this.disabled = false;
            this.$notify({
              duration: 2000,
              title: '编辑损耗失败',
              message: error.response && error.response.data && error.response.data.msg || '网络异常',
              type: 'error'
            });
          });
        } else {
          erpOrder.save(this.form).then(res => {
            this.$notify({
              duration: 2000,
              message: '新增损耗成功',
              type: 'success'
            });
            window.localStorage.removeItem(this.saveKey);
            this.$emit('change', res.data);
            this.disabled = false;
            this.$emit('close');
            this.resetForm();
          }).catch(error => {
            this.disabled = false;
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
