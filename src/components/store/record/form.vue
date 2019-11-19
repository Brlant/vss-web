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

  .md-inline-form {
    .el-select {
      width: 260px;
    }
    .el-input {
      width: 260px;
    }
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
            <el-form-item label="货主疫苗" prop="orgGoodsId">
              <el-select filterable remote placeholder="请输入名称或编号搜索货主疫苗" :remote-method="filterOrgGoods"
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
                        v-show="org.goodsNo">货主货品编号:</span>{{org.goodsNo}}
                      </span>
                    <span class="select-other-info pull-left"><span
                      v-show="org.saleFirmName">供货单位:</span>{{ org.saleFirmName }}
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
            <div v-loading="loadingData">
              <div class="empty-info" v-show="!batches.length">暂无库存信息</div>
              <el-row class="md-info" v-for="item in batches" :key="item.id">
                <el-col :span="14">
                  <oms-row label="货主疫苗名称" :sapn="span">{{item.goodsName}}</oms-row>
                  <oms-row label="生产厂商" :sapn="span">{{item.factoryName}}</oms-row>
                  <oms-row label="批号" :sapn="span">{{item.batchNumber}}</oms-row>
                  <oms-row label="有效期" :sapn="span">{{item.expiryDate | date}}</oms-row>
                  <oms-row label="散件包装数量" :sapn="span">{{smallPackCount}}</oms-row>
                </el-col>
                <el-col :span="10">
                  <oms-row label="可用库存" :sapn="span">{{item.availableCount}}</oms-row>
                  <oms-row label="锁定库存" :sapn="span">{{item.undeterminedCount}}</oms-row>
                  <oms-row label="实际合格库存" :sapn="span">{{item.qualifiedCount}}</oms-row>
                  <oms-row label="在途库存" :sapn="span">{{item.transitCount}}</oms-row>
                  <oms-row label="实际不合格库存" :sapn="span">{{item.unqualifiedCount}}</oms-row>
                </el-col>
              </el-row>
              <div v-if="batches.length" class="md-inline-form">
                <el-form-item label="原状态" prop="adjustType" class="pull-left">
                  <el-select v-model="form.adjustType" filterable clearable
                             placeholder="请选择原库存状态">
                    <el-option v-for="item in adjustTypeList" :value="item.key" :key="item.key"
                               :label="item.name" v-show="item.key !== 2">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="新状态" prop="adjustNewType" class="pull-left">
                  <el-select v-model="form.adjustNewType" filterable clearable
                             placeholder="请选择新库存状态">
                    <el-option v-for="item in adjustTypeList" :value="item.key" :key="item.key"
                               :label="item.name" v-show="item.key !== form.adjustType">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="数量" prop="count" class="clearfix">
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
  import {Address, erpStock, http} from '@/resources';

  export default {
    props: {
      formItem: Object
    },
    data() {
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
          orgGoodsId: {required: true, message: '请选择货主疫苗', trigger: 'change'},
          batchNumberId: {required: true, message: '请选择批号', trigger: 'change'},
          warehouseId: {required: true, message: '请选择仓库', trigger: 'change'},
          adjustType: {required: true, message: '请选择原状态', trigger: 'change'},
          adjustNewType: {required: true, message: '请选择新状态', trigger: 'change'},
          count: [
            {required: true, message: '请输入数量', trigger: 'blur'},
            {validator: this.validatePackageMultiple, trigger: 'blur'}
          ]
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
    mounted() {
      this.queryOrgWarehouse();
    },
    watch: {
      'form.adjustType'(val) {
        this.form.adjustNewType = '';
      }
    },
    computed: {
      smallPackCount() {
        let count = '';
        if (!this.form.orgGoodsId) return count;
        this.orgGoods.forEach(i => {
          if (i.id === this.form.orgGoodsId) {
            count = i.smallPackCount;
          }
        });
        return count;
      },
      totalCount() {
        if (this.batches.length && typeof this.form.adjustType === 'number') {
          return this.form.adjustType === 0 ? this.batches[0].availableCount : this.batches[0].undeterminedCount;
        }
        return 0;
      }
    },
    methods: {
      validatePackageMultiple(rule, value, callback) {
        let obj = this.validPackage(value, this.smallPackCount, this.totalCount);
        switch (obj.type) {
          case 0: {
            callback();
            break;
          }
          case 1: {
            callback(new Error('缺少散件包装数量信息，请补充疫苗包装资料'));
            break;
          }
          case 2: {
            callback(new Error('输入数量大于总数量'));
            break;
          }
          case 3: {
            callback(new Error('输入数量不是散件的倍数,推荐数量' + obj.count));
            break;
          }
          case 4: {
            callback();
            break;
          }
        }
      },
      /**
       * 校验最小包装
       * @param count
       * @param packageCount
       * @param total
       * @returns {*}
       */
      validPackage(count, packageCount, total) {
        const lack_count_data = 0; // 缺少输入数量
        const lack_package_data = 1; // 缺少包装资料
        const exceeded_number = 2; // 超过总数量
        const not_package_multiple = 3; // 不是最小包装倍数
        const correct = 4; // 正常
        if (!count) return {type: lack_count_data};
        if (!packageCount) return {type: lack_package_data};
        if (count > total) return {type: exceeded_number};
        let remainder = count % packageCount;
        if (remainder === 0) return {type: correct};
        let ig = Math.floor(count / packageCount);
        let curCount = 0;
        curCount = ((ig + 1) * packageCount > total) ? ig * packageCount : (ig + 1) * packageCount;
        return {
          type: not_package_multiple,
          count: curCount
        };
      },
      filterOrgGoods(query) {
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
      orgGoodsChange(val) {
        this.form.batchNumberId = '';
        this.batchNumberList = [];
        this.batches = [];
        this.filterBatchNumber();
      },
      batchNumberChange(val) {
        if (!val) {
          this.form.batchNumberId = '';
          this.batches = [];
          return;
        }
        this.getBatches();
      },
      filterBatchNumber(query) {
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
      queryOrgWarehouse() {
        let param = Object.assign({}, {
          deleteFlag: false,
          auditedStatus: '1'
        });
        Address.queryAddress(param).then(res => {
          this.warehouses = res.data;
          this.form.warehouseId = res.data.length ? res.data[0].id : '';
        });
      },
      warehouseChange(val) {
        if (!this.form.orgGoodsId || !this.form.batchNumberId) return;
        this.getBatches();
      },
      getBatches() { // 得到波次列表
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
      formatTime(date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      },
      onSubmit() {
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
            this.form.reason = '';
            this.batches = [];
            this.form.warehouseId = this.warehouses.length ? this.warehouses[0].id : '';
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
