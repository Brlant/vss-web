<style lang="scss" scoped>
  .part-count {
    padding: 0 20px;
  }

  .el-form .el-select {
    display: block;
  }

  .product-batch-item {
    margin-bottom: 10px;
    border: 1px solid #d9d9d9;
    border-radius: 10px;
    padding: 10px;

    h2 {
      padding: 0;
      overflow: hidden;

      .title {
        float: left;
        margin-top: 2px;

        .el-tag {
          margin-top: 5px;
        }
      }

      .el-button {
        float: right;
      }
    }
  }

  .batch-info {
    .oms-row {
      margin-bottom: 5px;
      font-size: 14px;
    }

    margin-bottom: 10px;
  }

  .batch-total {
    padding-right: 20px;

    .h3 {
      margin: 0;
    }
  }

  .inline-block-count {
    float: left;

    & /deep/ .el-input {
      max-width: 300px;
    }
  }

</style>
<style lang="scss">
  .refuse-input {
    .el-date-editor {
      width: 100%;
    }
  }
</style>
<template>
  <div class="part-count" v-show="currentItem.goodsId">
    <product-info :currentItem="currentItem"></product-info>
    <div class="product-batch-item" v-for="(item) in receiptInfoList">
      <oms-row label="" :span="0" style="margin-bottom: 10px">
        <h2>
          <span class="title">
            批号:{{ item.no }}
            <!--新增批号标志，创建时间等于今天 或者创建时间不存在但isNew标志存在 -->
            <el-tag v-show="isNewBatch(item.batchNumberCreateTime)
            || !item.batchNumberCreateTime && item.isNew">新</el-tag>
          </span>
          <el-button size="mini" plain type="danger" style="margin-left: 10px" @click="deleteReceiptInfo(item)">删除
          </el-button>
          <el-button size="mini" plain type="warning" @click="edit(item)">编辑</el-button>
        </h2>
      </oms-row>
      <el-row>
        <el-col :span="9"
                style="margin-bottom: 10px">
          <oms-row label="生产日期" :span="span">{{ item.productionDate | date }}</oms-row>
          <oms-row label="有效期" :span="span">{{ item.expiryDate | date }}</oms-row>
          <oms-row label="批签发号" :span="span">{{ item.batchReleaseNumber }}</oms-row>
          <oms-row label="批量/进口量" :span="span">{{ item.batchReleaseCount }}</oms-row>
          <oms-row label="批签发日期" :span="span">{{ item.batchReleaseDate | date}}</oms-row>
        </el-col>
        <el-col :span="15">
          <oms-row label="通关单号编码" :span="span">{{ item.customsFormNumber }}</oms-row>
          <oms-row label="口岸检验报告编号" :span="span">{{ item.portInspectionNumber }}</oms-row>
          <oms-row label="数量" :span="span" v-show="item.smallPackageCount > 0 ">
            {{item.smallPackageCount}}
            <span v-if="currentItem.orgGoodsDto">
             <dict :dict-group="'measurementUnit'"
                   :dict-key="currentItem.orgGoodsDto.goodsDto.measurementUnit"></dict>
               <el-tag type="success">合格</el-tag>
            </span>
          </oms-row>
          <oms-row label="数量" :span="span" v-show="item.smallNonconformityCount > 0">
            {{item.smallNonconformityCount}}
            <span v-if="currentItem.orgGoodsDto">
                <dict :dict-group="'measurementUnit'"
                      :dict-key="currentItem.orgGoodsDto.goodsDto.measurementUnit"></dict>
              <el-tag type="warning">不合格</el-tag>
            </span>
          </oms-row>
        </el-col>
      </el-row>
      <el-row class="text-right batch-total">
        <h3 class="h3">
          合计:{{ item.aggregateQuantity}}
          <span v-if="currentItem.orgGoodsDto">
          <dict :dict-group="'measurementUnit'" :dict-key="currentItem.orgGoodsDto.goodsDto.measurementUnit"></dict>
        </span>
        </h3>
      </el-row>
    </div>
    <h2 class="text-right" v-show="receiptInfoList.length">
      实收合计:{{ totalCount }}
      <span v-if="currentItem.orgGoodsDto">
        <dict :dict-group="'measurementUnit'" :dict-key="currentItem.orgGoodsDto.goodsDto.measurementUnit"></dict>
      </span>
    </h2>

    <!--<el-form ref="batchAddForm" label-width="140px">-->
    <!--<el-form-item label="是否新增批号">-->
    <!--<el-switch v-model="addBatchNumber" active-text="是" inactive-text="否" style="margin-bottom: 8px"></el-switch>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<batch-add v-show="addBatchNumber" :currentItem="currentItem" @changeBatch="changeBatch"></batch-add>-->

    <div v-show="!addBatchNumber">
      <el-form ref="batchForm" :model="form" label-width="110px">
        <el-form-item label="批号" prop="batchNumberId">
          <!--<oms-input placeholder="请输入批号" v-model="form.no" @blur="inputBlur"></oms-input>-->
          <el-row>
            <el-col :span="12">
              <el-select v-model="form.batchNumberId" filterable clearable remote
                         :remoteMethod="filterBatchNumber" ref="batchSelect" @clear="clearBatch"
                         placeholder="请输入批号名称搜索批号" @change="changeBatchId" @blur="judgeAddBatchNumber">
                <el-option v-for="item in batchNumberList" :value="item.id" :key="item.id"
                           :label="item.batchNumber">
              <span>
              {{ item.batchNumber }}
               <el-tag v-show="isNewBatch(item.createTime)" style="height: 20px;line-height: 20px">新</el-tag>
              </span>
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="6">
              <el-button plain v-show="batchNumberInfos.length && !batchNumberInfos[0].createdBy && !form.isNew"
                         @click="editBatch">
                编辑
              </el-button>
              <el-button plain
                         v-show="batchNumberInfos.length && !batchNumberInfos[0].createdBy && isShowBatchReceipt && !form.isNew"
                         @click="cancelEditBatch">取消编辑
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <batch-receipt :form="form" :currentItem="currentItem" v-if="isShowBatchReceipt"></batch-receipt>
        <div v-show="form.batchNumberId && !isShowBatchReceipt" :keys="item.id" v-for="item in batchNumberInfos">
          <el-row class="batch-info">
            <el-col :span="12">
              <oms-row label="生产日期" :span="12">{{ item.productionDate | date }}</oms-row>
              <oms-row label="有效期" :span="12">{{ item.expirationDate | date }}</oms-row>
              <oms-row label="批签发号" :span="12">{{ item.batchReleaseNumber }}</oms-row>
              <oms-row label="批量/进口量" :span="12">{{ item.batchReleaseCount }}</oms-row>
              <oms-row label="批签发日期" :span="12">{{ item.batchReleaseDate | date}}</oms-row>
            </el-col>
            <el-col :span="12">
              <oms-row label="口岸检验报告编号" :span="12">{{ item.portInspectionNumber }}</oms-row>
              <oms-row label="通关单号编码">{{ item.customsFormNumber }}</oms-row>
            </el-col>
          </el-row>
        </div>
        <el-form-item label="合格数量">
          <oms-input type="text" placeholder="请输入" v-model="form.smallPackageCount" :min="0">
            <template slot="append" v-if="currentItem.orgGoodsDto">
              <dict :dict-group="'measurementUnit'"
                    :dict-key="currentItem.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </template>
          </oms-input>
        </el-form-item>
        <el-form-item label="不合格数量" class="nonconformity">
          <oms-input type="text" placeholder="请输入" v-model="form.smallNonconformityCount" :min="0">
            <template slot="append" v-if="currentItem.orgGoodsDto">
              <dict :dict-group="'measurementUnit'"
                    :dict-key="currentItem.orgGoodsDto.goodsDto.measurementUnit"></dict>
            </template>
          </oms-input>
        </el-form-item>
        <el-form-item class="clearfix">
          <el-button type="primary" @click="submitConfirm" :disabled="doing">添加收货详情</el-button>
          <!--<el-button type="primary" plain @click="reset">重置</el-button>-->
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import productInfo from './product-info';
  import batchReceipt from './batch-add-receipt';
  import utils from '@/tools/utils';

  /**
   * 添加每条收货信息，然后提交后台
   * 1，编辑收货信息
   * a.新增的收货信息, 没有唯一索引id, 没有id, 设置id
   * b. 如果是新增的批号, 直接在编辑状态，不再显示编辑，取消编辑按钮;
   * 2，编辑批号
   * a.不编辑批号, 直接取批号列表中的批号信息, 添加到收货信息中，
   * b.编辑批号时，取编form中批号信息, 添加到收货信息中,
   * 若编辑此类型收货信息，直接展示form中的收货信息，不取批号列表中的批号信息,
   * 若选择了其他批号, 然后再次选择了此批号，form中信息会清除, 此时选择批号列表中的批号信息
   * 3，显示是否新增批号
   * a.有创建时间, 判断创建时间, 没有创建时间,判断isNew属性，true新增
   * 4, 编辑批号, 传editFlag
   */
  export default {
    components: {
      // batchAdd,
      productInfo,
      batchReceipt
    },
    props: {
      orderId: String,
      currentOrder: {},
      currentItem: {},
      index: {
        type: Number,
        default: -1
      }
    },
    data() {
      return {
        span: 8,
        addBatchNumber: false,
        form: {
          orderDetailId: '',
          no: '',
          largePackageCount: '',
          smallPackageCount: '',
          largeNonconformityCount: '',
          smallNonconformityCount: '',
          batchNumberId: '',
          productionDate: '',
          expiryDate: '',
          batchReleaseCount: '',
          batchReleaseDate: '',
          batchReleaseNumber: '',
          customsFormNumber: '',
          portInspectionNumber: '',
          smallPackageFlag: true
        },
        rules: {
          productionDate: [
            {required: true, message: '请选择生产日期', trigger: 'change'}
          ],
          expiryDate: [
            {required: true, message: '请输入有效期', trigger: 'change'}
          ]
        },
        doing: false,
        receiptInfoList: [],
        batchNumberList: [],
        isShowBatchReceipt: false,
        retainBatchValue: '',
        refuseTypeAry: ['当日取走', '暂放待验区，指定日取走', '其他'],
        exceptionDtoList: []
      };
    },
    watch: {
      'currentItem.id'(val) {
        this.isShowBatchReceipt = false;
        this.resetForm();
        this.batchNumberList = [];
        this.addBatchNumber = false;
        this.retainBatchValue = '';
        this.exceptionDtoList = [];
        if (!val) return;
        this.queryReceiptInfo();
      },
      index() {
        this.isShowBatchReceipt = false;
      }
    },
    computed: {
      totalCount() {
        let count = 0;
        this.receiptInfoList.forEach(i => {
          count += i.aggregateQuantity;
        });
        return count;
      },
      batchNumberInfos() {
        let ary = ['productionDate', 'expiryDate', 'batchReleaseCount',
          'batchReleaseDate', 'batchReleaseNumber', 'customsFormNumber', 'portInspectionNumber'];
        // 判断form 是否被重置
        let isReset = ary.some(e => this.form[e]);
        // 非编辑, 被重置, 显示列表内容
        // 否则显示表单内容
        if (!this.form.id || !isReset) {
          return this.batchNumberList.filter(f => f.id === this.form.batchNumberId) || [];
        } else {
          let item = this.batchNumberList.filter(f => f.id === this.form.batchNumberId)[0];
          let obj = {};
          if (item) {
            obj = JSON.parse(JSON.stringify(item));
            obj.productionDate = this.form.productionDate;
            obj.expiryDate = this.form.expirationDate;
            obj.batchReleaseCount = this.form.batchReleaseCount;
            obj.portInspectionNumber = this.form.portInspectionNumber;
            obj.batchReleaseDate = this.form.batchReleaseDate;
            obj.batchReleaseNumber = this.form.batchReleaseNumber;
            obj.customsFormNumber = this.form.customsFormNumber;
          }
          return [obj];
        }
      }
    },
    mounted() {
      // 监听输入的批号信息，保留最新的输入的有效值
      this.$refs['batchSelect'].$refs.reference.$on('input', (val) => {
        if (val) {
          this.retainBatchValue = val;
        }
      });
    },
    methods: {
      queryAllExceptionList: function () {// 所有异常信息列表
        if (!this.currentOrder.id) return;
        this.$http.get('/order-exception/orders/' + this.currentOrder.id).then(res => {
          this.exceptionDtoList = res.data.filter(f => f.flag);
        });
      },
      isNewBatch(time) {
        return time && this.$moment().isSame(time, 'day');
      },
      resetForm() {
        this.form = {
          orderDetailId: '',
          no: '',
          largePackageCount: '',
          smallPackageCount: '',
          largeNonconformityCount: '',
          smallNonconformityCount: '',
          batchNumberId: '',
          productionDate: '',
          expiryDate: '',
          batchReleaseCount: '',
          batchReleaseDate: '',
          batchReleaseNumber: '',
          customsFormNumber: '',
          portInspectionNumber: '',
          refuseDate: '',
          refusePerson: '',
          refuseRemark: '',
          refuseType: '',
          smallPackageFlag: true
        };
      },
      reset() {
        this.retainBatchValue = '';
        this.isShowBatchReceipt = false;
        this.resetForm();
      },
      queryReceiptInfo() {
        this.receiptInfoList = this.currentItem.receiptInfoList;
        // 根据id, 直接赋值批号信息
        if (!this.receiptInfoList.length) {
          this.filterBatchNumberById();
        }
        // this.receiptInfoList = [];
        // if (!this.currentItem.id) return;
        // if (this.currentItem.receiptInfoList.length) {
        //   this.receiptInfoList = this.currentItem.receiptInfoList;
        //   return;
        // }
        // receiptApi.query({orderDetailId: this.currentItem.id}).then(res => {
        //   this.receiptInfoList = res.data;
        //   this.currentItem.receiptInfoList = res.data;
        // });
      },
      filterBatchNumberById() {
        if (!this.currentItem.batchNumberId) return;
        this.$http.get('/batch-number/pager', {
          params: {
            id: this.currentItem.batchNumberId
          }
        }).then(res => {
          this.batchNumberList = res.data.list;
          this.form.batchNumberId = this.currentItem.batchNumberId;
          let ary = this.batchNumberList.filter(f => f.id === this.form.batchNumberId);
          if (ary.length) {
            // 批文文号过期校验
            if (new Date(ary[0].productionDate) > new Date(this.currentItem.orgGoodsDto.goodsDto.goodsApprovalNOValidity)) {
              this.$notify.info({
                message: '货品的生产日期大于批准文号有效期'
              });
            }
          }
        });
      },
      filterBatchNumber(query) {
        if (!this.currentItem.orgGoodsDto) return;
        this.$http.get('/batch-number/dhs', {
          params: {
            batchNumber: query,
            goodsId: this.currentItem.orgGoodsDto.goodsId,
            dhsGoodsId: this.currentItem.orgGoodsDto.goodsDto.dhsGoodsId
          }
        }).then(res => {
          this.batchNumberList = res.data;
        });
      },
      edit(item) {
        this.isShowBatchReceipt = false;
        this.form = JSON.parse(JSON.stringify(item));
        if (!item.isNew) {
          this.filterBatchNumber(item.no);
        } else {
          this.isShowBatchReceipt = true;
        }
        this.queryAllExceptionList();
      },
      changeBatch(data) {
        this.form.batchNumberId = data.id;
        this.filterBatchNumber(data.batchNumber);
        this.addBatchNumber = false;
      },
      changeBatchId(val) {
        this.resetBatchForm();
        // 不显示添加批号信息
        this.isShowBatchReceipt = false;
        this.form.batchNumberId = val;
        if (!val) {
          this.form.no = '';
          return;
        }
        let ary = this.batchNumberList.filter(f => f.id === this.form.batchNumberId);
        if (ary.length) {
          this.form.no = ary[0].batchNumber;
          // 批文文号过期校验
          if (new Date(ary[0].productionDate) > new Date(this.currentItem.orgGoodsDto.goodsDto.goodsApprovalNOValidity)) {
            this.$notify.info({
              message: '货品的生产日期大于批准文号有效期'
            });
          }
        }
      },
      editBatch() {
        let obj = this.batchNumberInfos[0];
        if (!obj) return;
        this.form.productionDate = obj.productionDate;
        this.form.expiryDate = obj.expirationDate;
        this.form.batchReleaseCount = obj.batchReleaseCount;
        this.form.batchReleaseDate = obj.batchReleaseDate;
        this.form.batchReleaseNumber = obj.batchReleaseNumber;
        this.form.customsFormNumber = obj.customsFormNumber;
        this.form.portInspectionNumber = obj.portInspectionNumber;
        this.isShowBatchReceipt = true;
      },
      cancelEditBatch() {
        this.isShowBatchReceipt = false;
      },
      /**
       * 失去焦点判断是否有可用批号
       * @param
       */
      judgeAddBatchNumber() {
        this.resetBatchForm();
        //判断有没有输入值, 防止未输入任何值时，切换状态
        if (!this.$refs['batchSelect'].selectedLabel) return;
        // 批号列表为空或者列表里不存在此批号时，切换到添加批号状态
        let isAdd = !this.batchNumberList.length;
        if (!isAdd) {
          this.isShowBatchReceipt = isAdd;
          return;
        }
        this.$confirm('是否新增批号？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isShowBatchReceipt = isAdd;
          if (this.isShowBatchReceipt) {
            // 新批号标志
            this.form.isNew = true;
            this.form.batchNumberId = this.retainBatchValue;
          }
        });
      },
      resetBatchForm() {
        this.form = Object.assign({}, this.form, {
          productionDate: '',
          expiryDate: '',
          batchReleaseCount: '',
          batchReleaseDate: '',
          batchReleaseNumber: '',
          customsFormNumber: '',
          portInspectionNumber: ''
        });
      },
      /**
       * 清空操作时,重置一些值
       */
      clearBatch() {
        this.resetBatchForm();
        this.retainBatchValue = '';
        this.filterBatchNumber();
      },
      deleteReceiptInfo(item) {
        this.$confirm('是否删除收货信息', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.reset();
          let index = this.receiptInfoList.indexOf(item);
          if (index !== -1) {
            this.receiptInfoList.splice(index, 1);
          }
          this.$emit('showSubmitButton');
          // receiptApi.delete(item.id).then(() => {
          //   this.$notify.success({
          //     message: '删除收货信息成功'
          //   });
          //   this.reset();
          //   let index = this.receiptInfoList.indexOf(item);
          //   if (index !== -1) {
          //     this.receiptInfoList.splice(index, 1);
          //   }
          // }).catch(error => {
          //   this.$notify.error({
          //     message: error.response.data && error.response.data.msg || '删除收货信息失败'
          //   });
          // });
        });
      },
      submitConfirm() {
        if (!this.form.batchNumberId) {
          this.$notify.info({
            message: '请选择批号'
          });
          return;
        }
        if (this.isShowBatchReceipt) {
          if (!this.form.productionDate) {
            this.$notify.info({
              message: '请选择生产日期'
            });
            return;
          }
          if (!this.form.expiryDate) {
            this.$notify.info({
              message: '请选择有效期'
            });
            return;
          }
        }
        this.submitForm();
      },
      submitForm() {
        this.$refs['batchForm'].validate(valid => {
          if (!valid) return;

          if (!this.form.id) {
            let isHas = this.receiptInfoList.some(s => s.batchNumberId === this.form.batchNumberId);
            if (isHas) {
              return this.$notify.info({
                message: '批号已经存在'
              });
            }
          }
          // 必须输入收货数量，才能保存
          if (!Number(this.form.largePackageCount) && !Number(this.form.largeNonconformityCount) &&
            !Number(this.form.smallPackageCount) && !Number(this.form.smallNonconformityCount)) {
            return this.$notify.info({
              message: '请输入收货数量'
            });
          }

          let count = this.form.largePackageCount * this.currentItem.orgGoodsDto.goodsDto.largePacking +
            this.form.largeNonconformityCount * this.currentItem.orgGoodsDto.goodsDto.largePacking +
            this.form.smallPackageCount * 1 +
            this.form.smallNonconformityCount * 1;
          let totalCount = count;
          if (!this.form.id) {
            this.receiptInfoList.forEach(i => {
              count = count + i.aggregateQuantity;
            });
          } else {
            // 编辑时，数量校验
            this.receiptInfoList.forEach(i => {
              count = count + i.aggregateQuantity;
            });
            count -= this.form.aggregateQuantity;
          }
          if (count > this.currentItem.amount) {
            this.$notify.info({
              message: '收货数量大于订单数量'
            });
            return;
          }
          let ary = this.batchNumberList.filter(f => f.id === this.form.batchNumberId);
          if (ary.length) {
            this.form.no = ary[0].batchNumber;
            // 编辑批号，传后台标志位
            this.form.editFlag = this.isShowBatchReceipt;
          } else {
            if (this.isShowBatchReceipt) {
              this.form.no = this.form.batchNumberId;
              // this.form.batchNumberId = undefined;
            } else {
              this.$notify.info({
                message: '请选择批号'
              });
              return;
            }
          }
          this.form.orderDetailId = this.currentItem.id;
          this.form.aggregateQuantity = totalCount;
          ary = this.batchNumberList.filter(f => f.id === this.form.batchNumberId);
          let obj = {};
          // 判断是否编辑批号，非编辑批号, 才合并值
          if (ary.length && !this.isShowBatchReceipt) {
            obj.productionDate = ary[0].productionDate;
            obj.expiryDate = ary[0].expirationDate;
            obj.batchReleaseCount = ary[0].batchReleaseCount;
            obj.portInspectionNumber = ary[0].portInspectionNumber;
            obj.batchReleaseDate = ary[0].batchReleaseDate;
            obj.batchReleaseNumber = ary[0].batchReleaseNumber;
            obj.customsFormNumber = ary[0].customsFormNumber;
          }
          //id不存在, 设置id
          if (!this.form.id) {
            this.form.id = utils.guid();
          }
          let form = Object.assign({}, this.form, obj);
          let pl = -1;
          this.receiptInfoList.forEach((i, index) => {
            if (i.id === this.form.id) {
              pl = index;
            }
          });
          if (pl !== -1) {
            this.receiptInfoList.splice(pl, 1, form);
          } else {
            this.receiptInfoList.push(form);
          }
          this.reset();
          this.$emit('showSubmitButton');
        });
      }
    }
  };
</script>
