<style lang="scss" scoped>
  @import "../../../assets/mixins.scss";

  $leftWidth: 220px;

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

  .table-product-list {
    font-size: 12px;
    > tbody > tr > td, > thead > tr > th {
      padding: 5px;
    }
  }

  .order-product-box {
    position: relative;
    border-radius: 10px;
    font-size: 12px;
    line-height: 26px;
    .product-info-fix {
      background: #f6f6f6;
      margin-top: 10px;
      padding: 5px;
      margin-bottom: 20px;
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

  .ar {
    text-align: right;
  }

  .md-info {
    margin-bottom: 20px;
    min-height: 80px;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title" style="font-size: 16px">{{ title }}</h2>
        <ul>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button type="success" @click="onSubmit" :disabled="doing">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <div class="hide-content show-content">
          <el-form ref="d-form" :rules="rules" :model="form"
                   label-width="80px" style="padding-right: 20px">
            <el-form-item label="货主货品" prop="orgGoodsId">
              <el-select filterable remote placeholder="请输入名称搜索货主货品" :remote-method="filterOrgGoods"
                         :clearable="true"
                         v-model="form.orgGoodsId" popper-class="good-selects"
                         @click.native.once="filterOrgGoods('')" @change="orgGoodsChange">
                <el-option :value="org.id" :key="org.id" :label="org.goodsName"
                           v-for="org in orgGoods">
                  <div style="overflow: hidden">
                    <span class="pull-left">{{org.goodsName}}</span>
                  </div>
                  <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">货品编号:</span>{{org.goodsNo}}
                      </span>
                    <span class="select-other-info pull-left"><span
                      v-show="org.saleFirmName">供货厂商:</span>{{ org.saleFirmName }}
                      </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="批号" prop="batchNumberId">
              <el-select v-model="form.batchNumberId" filterable clearable remote @change="batchNumberChange"
                         :remoteMethod="filterBatchNumber" placeholder="请输入批号名称搜索批号">
                <el-option v-for="item in batchNumberList" :value="item.id" :key="item.id"
                           :label="item.batchNumber">
                  {{ item.batchNumber }}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库" prop="warehouseId">
              <el-select v-model="form.warehouseId" filterable clearable
                         @change="warehouseChange"
                         placeholder="请选择仓库">
                <el-option v-for="item in warehouses" :value="item.id" :key="item.id"
                           :label="item.name">
                </el-option>
              </el-select>
            </el-form-item>
            <div  v-loading="loadingData">
              <div class="empty-info" v-show="!batches.length">暂无库存信息</div>
              <el-row class="md-info" v-for="item in batches" :key="item.id">
                <el-col :span="14">
                  <oms-row label="货主货品名称" :sapn="span">{{item.goodsName}}</oms-row>
                  <oms-row label="生产厂商" :sapn="span">{{item.factoryName}}</oms-row>
                  <oms-row label="批号" :sapn="span">{{item.batchNumber}}</oms-row>
                  <oms-row label="有效期" :sapn="span">{{item.expiryDate}}</oms-row>
                </el-col>
                <el-col :span="10">
                  <oms-row label="可用库存" :sapn="span">{{item.availableCount}}</oms-row>
                  <oms-row label="锁定库存" :sapn="span">{{item.undeterminedCount}}</oms-row>
                  <oms-row label="实际合格库存" :sapn="span">{{item.qualifiedCount}}</oms-row>
                  <oms-row label="在途库存" :sapn="span">{{item.transitCount}}</oms-row>
                  <oms-row label="实际不合格库存" :sapn="span">{{item.unqualifiedCount}}</oms-row>
                </el-col>
              </el-row>
              <div v-if="batches.length">
                <el-form-item label="原状态" prop="adjustType">
                  <el-select v-model="form.adjustType" filterable clearable
                             placeholder="请选择原库存状态">
                    <el-option v-for="item in adjustTypeList" :value="item.key" :key="item.key"
                               :label="item.name" v-show="item.key !== 2">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="新状态" prop="adjustNewType">
                  <el-select v-model="form.adjustNewType" filterable clearable
                             placeholder="请选择新库存状态">
                    <el-option v-for="item in adjustTypeList" :value="item.key" :key="item.key"
                               :label="item.name" v-show="item.key !== form.adjustType">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="数量" prop="count">
                  <el-input type="number" v-model.number="form.count"></el-input>
                </el-form-item>
                <el-form-item label="调整理由">
                  <el-input type="textarea" v-model.number="form.reason"></el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {Address, http, erpStock } from '@/resources';

  export default {
    props: {
      formItem: Object
    },
    data () {
      return {
        title: '库存状态调整',
        doing: false,
        loadingData: false,
        form: {
          batchNumberId: '',
          orgGoodsId: '',
          warehouseId: '',
          adjustType: '',
          adjustNewType: '',
          count: '',
          reason: ''
        },
        rules: {
          orgGoodsId: {required: true, message: '请选择货主货品', trigger: 'change'},
          batchNumberId: {required: true, message: '请选择', trigger: 'change'},
          warehouseId: {required: true, message: '请选择仓库', trigger: 'change'},
          adjustType: {required: true, message: '请输入原状态', trigger: 'change'},
          adjustNewType: {required: true, message: '请输入新状态', trigger: 'change'},
          count: {required: true, message: '请输入数量', trigger: 'blur'}
        },
        adjustTypeList: {
          0: {key: 0, name: '可用库存'},
          1: {key: 1, name: '锁定库存'},
          2: {key: 2, name: '实际不合格库存'}
        },
        batchNumberList: [],
        warehouses: [],
        orgGoods: [],
        batches: [],
        span: 6
      };
    },
    mounted () {
      this.queryOrgWarehouse();
    },
    methods: {
      filterOrgGoods (query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        let params = Object.assign({}, {
          deleteFlag: false,
          orgId: orgId,
          keyWord: query
        });
        http.get('/erp-stock/goods', {params}).then(res => {
          this.orgGoods = res.data.list;
        });
      },
      orgGoodsChange (val) {
        this.form.batchNumberId = '';
        this.batchNumberList = [];
        this.batches = [];
        this.filterBatchNumber();
      },
      batchNumberChange (val) {
        if (!val) {
          this.form.batchNumberId = '';
          this.batches = [];
          return;
        }
        this.getBatches();
      },
      filterBatchNumber (query) {
        if (!this.form.orgGoodsId) return;
        let goodsId = '';
        this.orgGoods.forEach(i => {
          if (i.id === this.form.orgGoodsId) {
            goodsId = i.goodsId;
          }
        });
        if (!goodsId) return;
        this.$http.get('/batch-number/pager', {
          params: {
            keyWord: query,
            goodsId
          }
        }).then(res => {
          this.batchNumberList = res.data.list;
        });
      },
      queryOrgWarehouse () {
        let param = Object.assign({}, {
          deleteFlag: false,
          auditedStatus: '1'
        });
        Address.queryAddress(param).then(res => {
          this.warehouses = res.data;
          this.form.warehouseId = res.data.length ? res.data[0].id : '';
        });
      },
      warehouseChange (val) {
        if (!this.form.orgGoodsId || !this.form.batchNumberId) return;
        this.getBatches();
      },
      getBatches () { // 得到波次列表
        let params = {
          orgGoodsId: this.form.orgGoodsId,
          batchNumberId: this.form.batchNumberId,
          warehouseId: this.form.warehouseId
        };
        this.loadingData = true;
        erpStock.query(params).then(res => {
          this.batches = res.data;
          this.loadingData = false;
        });
      },
      formatTime (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      },
      onSubmit () {
        this.$refs['d-form'].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          if (!this.batches.length) {
            this.$notify.info({
              message: '无库存信息，请重新选择'
            });
            return;
          }
          let obj = {
            oldStatus: this.form.adjustType,
            newStatus: this.form.adjustNewType,
            count: this.form.count,
            stockId: this.batches[0].id,
            warehouseId: this.form.warehouseId,
            reason: this.form.reason
          };
          this.doing = true;
          this.$http.put(`/erp-stock/${obj.stockId}/adjust/stock`, obj).then(() => {
            this.$notify.success({
              message: '库存状态调整成功'
            });
            this.doing = false;
            this.$refs['d-form'].resetFields();
            this.batches = [];
            this.$emit('refresh');
          }).catch(error => {
            this.doing = false;
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '库存状态调整失败'
            });
          });
        });
      }
    }
  };
</script>
