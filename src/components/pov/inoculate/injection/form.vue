<style lang="scss" scoped>
@import "~@/assets/mixins";

.el-form .el-select {
  display: block;
}

.mini-form {
  .el-form-item {
    margin-bottom: 0;
  }
}

.el-form {
  h2 {
    /*font-weight: bold;*/
    margin: 6px 0 14px 0;
    padding: 6px;
    background: #eee;
    border-left: 10px solid $activeColor;
  }
}
</style>
<style lang="scss">
.inoculatorInfo-form {
  .info {
    .el-form-item__label, .el-form-item__content {
      line-height: normal;
    }
  }
}
</style>
<template>
  <div class="inoculatorInfo-form">
    <h2 class="clearfix">{{title}}</h2>
    <el-form ref="form" :model="form" :rules="rules" label-width="100px"
             onsubmit="return false" @submit.prevent="onSubmit('form')">
      <h2>基本信息</h2>
      <el-form-item label="受种者" prop="inoculatorInfoId">
        <el-select v-if="!type" v-model="form.inoculatorInfoId" :remote-method="queryPersons"
                   clearable filterable
                   placeholder="请输入姓名或身份证号或接种证编号或出生证号或护照号进行搜索" popper-class="good-selects"
                   remote @change="changeInoculatorId" @clear="queryPersons('')">
          <el-option v-for="item in personList" :key="item.id" :label="item.inoculatorName" :value="item.id">
            <div>
              <span>{{item.inoculatorName}}</span>
            </div>
            <div>
              <span class="select-other-info"><span v-show="item.inoculatorNumber">接种证编号:</span>{{item.inoculatorNumber}}</span>
              <span class="select-other-info"><span v-show="item.inoculatorCardNumber">身份证:</span>{{item.inoculatorCardNumber}}</span>
              <span class="select-other-info"><span v-show="item.birthCertificateNumber">出生证号:</span>
                {{item.birthCertificateNumber}}</span>
              <span class="select-other-info"><span v-show="item.passportNo">护照号:</span>{{item.passportNo}}</span>
            </div>
          </el-option>
        </el-select>
        <span v-else>{{form.inoculatorName}}</span>
      </el-form-item>
      <el-row>
        <el-col :span="14">
          <el-form-item label="登记编号" prop="inoculatorNumber">
            <oms-input v-model="form.inoculatorNumber" :maxlength="25" placeholder="请输入登记编号"></oms-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <!--<el-form-item label="是否缴费" label-width="80px">-->
          <!--<el-radio-group v-model="form.payCostType">-->
          <!--<el-radio :label="1">已缴</el-radio>-->
          <!--<el-radio :label="0">未缴</el-radio>-->
          <!--</el-radio-group>-->
          <!--</el-form-item>-->
        </el-col>
        <!--<el-col :span="7">-->
        <!--<el-form-item label="是否新开瓶" label-width="90px">-->
        <!--<el-radio-group v-model="form.newInoculationStatus">-->
        <!--<el-radio :label="1">是</el-radio>-->
        <!--<el-radio :label="0">否</el-radio>-->
        <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
      </el-row>
    </el-form>
    <el-form ref="addForm" :model="form" :rules="rules" label-width="100px"
             onsubmit="return false" @submit.prevent="onSubmit('form')">
      <h2>疫苗信息</h2>
      <el-form-item v-if="type" label="货品属性" prop="injectionTaskType">
        <el-radio-group v-model="form.injectionTaskType" @change="injectionTaskTypeChange">
          <el-radio label="1">狂苗</el-radio>
          <el-radio label="2">狂免</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="疫苗" prop="orgGoodsId">
        <el-select v-model="form.orgGoodsId" :filter-method="filterGoods" clearable
                   filterable
                   placeholder="请输入名称或疫苗编号或疫苗名称拼音或疫苗名称拼音首字母搜索疫苗" popper-class="order-good-selects"
                   @change="orgGoodsIdChange"
                   @focus="filterGoods('')">
          <el-option v-for="item in filterOrgGoodsList" :key="item.id" :label="item.goodsName"
                     :value="item.id">
            <div style="overflow: hidden">
              <span class="pull-left">{{item.goodsName}}</span>
            </div>
            <div style="overflow: hidden">
              <span class="select-other-info pull-left"><span
                v-show="item.goodsNo">疫苗编号:</span>{{item.goodsNo}}
              </span>
              <span class="select-other-info pull-left">
                <span v-show="item.saleFirmName">供货单位:</span>{{ item.saleFirmName }}
              </span>
              <span class="select-other-info pull-left">
                  <dict :dict-key="'' + item.vaccineSign" dict-group="vaccineSign"></dict>
              </span>
            </div>
            <div style="overflow: hidden">
              <span class="select-other-info pull-left">
                <span>规格:</span>{{item.specifications}}
              </span>
              <span class="select-other-info pull-left">
                <span v-show="item.factoryName">生产厂商:</span>{{ item.factoryName }}
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-row v-show="form.orgGoodsId" class="info">
        <el-col v-show="form.factoryName" :span="12">
          <el-form-item label="生产厂商">{{form.factoryName}}</el-form-item>
        </el-col>
        <el-col v-show="form.vaccineSign" :span="12">
          <el-form-item label="疫苗种类">
            <el-tag v-if="form.vaccineSign === '2'" class="el-tag--max" type="success">
              <dict :dict-key="'' + form.vaccineSign" dict-group="vaccineSign"></dict>
            </el-tag>
            <dict v-else :dict-key="'' + form.vaccineSign" dict-group="vaccineSign"></dict>
          </el-form-item>
        </el-col>
        <el-col v-show="form.specifications" :span="12">
          <el-form-item label="规格">{{form.specifications}}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接种途径">
            <!--<el-select type="text" v-model="form.inoculationChannel" placeholder="请选择接种途径"-->
            <!--@change="inoculationChannelChange">-->
            <!--<el-option :value="item.key" :key="item.key" :label="item.label"-->
            <!--v-for="item in inoculationChannelList"></el-option>-->
            <!--</el-select>-->
            <dict :dict-group="'inoculationChannel'" :dict-key="form.inoculationChannel"></dict>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="批号" prop="batchNumberId">
        <el-select v-model="form.batchNumberId" clearable filterable
                   placeholder="请输入名称搜索批号" popper-class="good-selects" @change="batchNumberChange">
          <el-option v-for="item in batchNumberList" :key="item.batchNumberId" :label="item.batchNumber"
                     :value="item.batchNumberId">
            <div>{{item.batchNumber}}</div>
            <div class="font-gray">
              <span v-show="item.qualifiedBizServings">剩余剂次：{{item.qualifiedBizServings}}</span>
              <span v-show="item.expiryDate" class="ml-15">有效期：{{item.expiryDate | date}}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <!--<el-col :span="12">-->
        <!--<el-form-item label="接种途径" prop="inoculationChannel">-->
        <!--&lt;!&ndash;<el-select type="text" v-model="form.inoculationChannel" placeholder="请选择接种途径"&ndash;&gt;-->
        <!--&lt;!&ndash;@change="inoculationChannelChange">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-option :value="item.key" :key="item.key" :label="item.label"&ndash;&gt;-->
        <!--&lt;!&ndash;v-for="item in inoculationChannelList"></el-option>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
        <!--<dict :dict-group="'inoculationChannel'" :dict-key="form.inoculationChannel"></dict>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="12">
          <el-form-item label="接种部位" prop="inoculationPosition">
            <el-select v-model="form.inoculationPosition" placeholder="请选择接种部位" type="text">
              <el-option v-for="item in inoculationPositionList" :key="item.key" :label="item.label"
                         :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-show="form.list.length">
        <h2>已选疫苗</h2>
        <goods-list :goodsList="form.list" @deleteItem="deleteItem"/>
      </div>
      <el-form-item v-show="form.orgGoodsId || form.list.length" label-width="100px">
        <el-button v-if="!type" v-show="!form.id && form.orgGoodsId" plain type="primary" @click="addGoods">添加多种疫苗
        </el-button>
        <el-button :disabled="doing" native-type="submit" type="primary" @click="onSubmit('form')">保存接种任务</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {inoculateTask} from '@/resources';
import methods from '../mixin/methods';
import GoodsList from './goods-list';

export default {
  mixins: [methods],
  components: {GoodsList},
  props: {
    formItem: {
      type: Object,
      default: {},
      required: true
    },
    type: String
  },
  data: function () {
    return {
      roleId: '',
      form: {
        inoculatorInfoId: '',
        inoculatorNumber: '',
        orgGoodsId: '',
        batchNumberId: '',
        inoculationPosition: '',
        inoculationChannel: '',
        payCostType: 1,
        newInoculationStatus: 0,
        qualifiedBizServings: '',
        specifications: '',
        factoryName: '',
        injectionTaskType: '1',
        list: []
      },
      rules: {
        inoculatorInfoId: [
          {required: true, message: '请选择受种者', trigger: 'change'}
        ],
        inoculatorNumber: [
          {required: true, message: '请输入登记编号', trigger: ['blur', 'change']}
        ],
        orgGoodsId: [
          {required: true, message: '请选择疫苗', trigger: 'change'}
        ],
        batchNumberId: [
          {required: true, message: '请选择批号', trigger: 'change'}
        ],
        inoculationPosition: [
          {required: true, message: '请选择接种部位', trigger: 'change'}
        ],
        inoculationChannel: [
          {required: true, message: '请选择接种途径', trigger: 'change'}
        ],
        injectionTaskType: [
          {required: true, message: '请选择货品属性', trigger: 'change'}
        ]
      },
      filterOrgGoodsList: [],
      doing: false,
      injectionType: 0 // 0 添加一个疫苗, 1 添加2个疫苗
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    title() {
      return (this.form.id ? '编辑' : '新增') + '接种任务';
    }
  },
  watch: {
    formItem: function (val) {
      this.batchNumberList = [];
      this.injectionType = 0;
      if (this.type) {
        this.form = Object.assign({}, {
          inoculatorInfoId: '',
          inoculatorNumber: '',
          orgGoodsId: '',
          batchNumberId: '',
          inoculationPosition: '',
          inoculationChannel: '',
          payCostType: 1,
          newInoculationStatus: 0,
          qualifiedBizServings: '',
          specifications: '',
          factoryName: '',
          injectionTaskType: '1',
          list: []
        }, this.formItem);
      } else {
        if (val.id) {
          this.batchNumberList = [
            {
              batchNumberId: this.formItem.batchNumberId,
              batchNumber: this.formItem.batchNumber
            }
          ];
          this.personList = [
            {
              inoculatorName: this.formItem.inoculatorName,
              id: this.formItem.inoculatorInfoId
            }
          ];
          this.orgGoodsList = [
            {
              goodsId: this.formItem.vaccineId,
              goodsName: this.formItem.orgGoodsName,
              id: this.formItem.orgGoodsId
            }
          ];
          this.filterOrgGoodsList = JSON.parse(JSON.stringify(this.orgGoodsList));
          this.form = Object.assign({}, this.formItem, {
            specifications: this.formItem.specification,
            factoryName: this.formItem.origin,
            vaccineSign: this.formItem.vaccineSign
          });
          this.form.list = [];
        } else {
          this.form = {
            inoculatorInfoId: '',
            inoculatorNumber: '',
            orgGoodsId: '',
            batchNumberId: '',
            inoculationPosition: '',
            inoculationChannel: '',
            payCostType: 1,
            newInoculationStatus: 0,
            qualifiedBizServings: '',
            specifications: '',
            factoryName: '',
            injectionTaskType: '1',
            list: []
          };
          this.orgGoodsList = [];
          this.filterOrgGoodsList = [];
          this.personList = [];
          this.batchNumberList = [];
        }
      }
      this.queryOrgGoodsListNew();
      this.$nextTick(() => {
        this.$refs['form'].clearValidate();
        this.$refs['addForm'].clearValidate();
      });
    }
  },
  methods: {
    injectionTaskTypeChange() {
      this.form.orgGoodsId = '';
      this.orgGoodsIdChange(this.form.orgGoodsId);
    },
    changeInoculatorId(val) {
      this.form.inoculatorNumber = '';
      if (!val) return;
      let item = this.personList.find(i => i.id === val);
      if (!item) return;
      this.form.inoculatorNumber = item.inoculatorNumber || item.inoculatorCardNumber || item.birthCertificateNumber || item.passportNo || '';
    },
    filterGoods(query) {
      this.filterOrgGoodsList = this.orgGoodsList.filter(f => {
        if (!this.type) return true;
        return f.vaccineAttribute === (this.form.injectionTaskType === '1' ? '0' : '15');
      }).filter(f => f.nameAcronymy.indexOf(query) !== -1 ||
        f.goodsName.indexOf(query) !== -1 || f.goodsNo.indexOf(query) !== -1 || f.namePhonetic.indexOf(query) !== -1);
    },
    queryOrgGoodsListNew(query) {
      const params = {
        keyWord: query
      };
      this.$http.get('/injection-task/goods', {params}).then(res => {
        this.orgGoodsList = res.data;
        this.filterOrgGoodsList = JSON.parse(JSON.stringify(res.data));
      });
    },
    queryPersons(query) {
      this.queryPersonList(query);
    },
    queryBatchNumbers(query, first) {
      if (!this.form.orgGoodsId) return;
      let item = this.orgGoodsList.find(f => f.id === this.form.orgGoodsId);
      this.form.orgGoodsId = item.id;
      if (!this.form.orgGoodsId) {
        this.batchNumberList = [];
        return;
      }
      this.getStockAndBatchNumber({
        before: (params) => {
          params.orgGoodsId = this.form.orgGoodsId;
          params.keyWord = query;
        },
        success: (res) => {
          this.batchNumberList = res.data.sort((pre, cur) => pre.expiryDate - cur.expiryDate);
          if (!this.batchNumberList.length) {
            return this.$notify.info('没有可用库存');
          }
          if (first && this.batchNumberList[0]) {
            this.form.qualifiedBizServings = this.batchNumberList[0].qualifiedBizServings;
            this.form.erpStockId = this.batchNumberList[0].id;
            this.form.batchNumber = this.batchNumberList[0].batchNumber;
            this.form.batchNumberId = this.batchNumberList[0].batchNumberId;
            this.form.expiryDate = this.batchNumberList[0].expiryDate;
          }
        }
      });
    },
    orgGoodsIdChange(val) {
      this.batchNumberList = [];
      this.form.batchNumberId = '';
      this.form.batchNumber = '';
      this.form.inoculationPosition = '';
      this.form.inoculationChannel = '';
      if (!val) return;
      let item = this.orgGoodsList.find(f => f.id === val);
      this.form.vaccineId = item.goodsId;
      this.form.orgGoodsName = item.goodsName;
      this.form.inoculationChannel = item.inoculationChannel;
      this.form.specifications = item.specifications;
      this.form.factoryName = item.factoryName;
      this.form.vaccineSign = item.vaccineSign;
      this.queryBatchNumbers('', true);
    },
    batchNumberChange(val) {
      this.form.qualifiedBizServings = '';
      this.form.erpStockId = '';
      this.form.batchNumber = '';
      if (!val) return;
      let item = this.batchNumberList.find(f => f.batchNumberId === val);
      this.form.batchNumber = item.batchNumber;
      this.form.expiryDate = item.expiryDate;
      this.form.qualifiedBizServings = item.qualifiedBizServings;
      this.form.erpStockId = item.id;
    },
    addGoods() {
      this.$refs['addForm'].validate((valid) => {
        if (!valid) {
          return false;
        }
        let item = {
          orgGoodsName: this.form.orgGoodsName,
          orgGoodsId: this.form.orgGoodsId,
          specifications: this.form.specifications,
          vaccineId: this.form.vaccineId,
          batchNumber: this.form.batchNumber,
          batchNumberId: this.form.batchNumberId,
          expiryDate: this.form.expiryDate,
          erpStockId: this.form.erpStockId,
          inoculationPosition: this.form.inoculationPosition,
          inoculationChannel: this.form.inoculationChannel
        };
        this.form.orgGoodsId = '';
        this.form.orgGoodsName = '';
        this.form.specifications = '';
        this.form.vaccineId = '';
        this.form.batchNumber = '';
        this.form.batchNumberId = '';
        this.form.expiryDate = '';
        this.form.erpStockId = '';
        this.form.inoculationPosition = '';
        this.form.inoculationChannel = '';
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate();
        });
        this.form.list.push(item);
        this.injectionType = 1;
      });
    },
    inoculationChannelChange() {
      this.form.inoculationPosition = '';
    },
    deleteItem(item) {
      this.form.list = this.form.list.filter(f => f !== item);
      if (!this.form.list.length) {
        this.injectionType = 0;
      }
    },
    onSubmit: function (formName) {
      let self = this;
      if (this.doing) return;
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          this.doing = false;
          return false;
        }
        let formData = JSON.parse(JSON.stringify(this.form));
        if (!formData.id) {
          if (this.injectionType === 1) {
            if (!formData.list.length) {
              return this.$notify.info('请添加疫苗');
            }
            this.add(formData);
          } else {
            this.$refs['addForm'].validate((valid) => {
              if (!valid) {
                this.doing = false;
                return false;
              }
              let item = {
                orgGoodsName: this.form.orgGoodsName,
                orgGoodsId: this.form.orgGoodsId,
                specifications: this.form.specifications,
                vaccineId: this.form.vaccineId,
                batchNumber: this.form.batchNumber,
                batchNumberId: this.form.batchNumberId,
                expiryDate: this.form.expiryDate,
                erpStockId: this.form.erpStockId,
                inoculationPosition: this.form.inoculationPosition,
                inoculationChannel: this.form.inoculationChannel
              };
              formData.list.push(item);
              this.doing = true;
              this.add(formData);
            });
          }
        } else {
          this.$refs['addForm'].validate((valid) => {
            if (!valid) {
              this.doing = false;
              return false;
            }
            this.doing = true;
            inoculateTask.update(formData).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                inoculatorInfoId: '成功',
                message: '修改成功'
              });
              this.$emit('change');
            }).catch(error => {
              this.doing = false;
              this.$notify.error({
                message: error.response && error.response.data && error.response.data.msg || '修改失败'
              });
            });
          });
        }
      });
    },
    add(formData) {
      let list = formData.list.map(m => {
        return Object.assign({}, m, {
          inoculatorInfoId: formData.inoculatorInfoId,
          inoculatorNumber: formData.inoculatorNumber,
          payCostType: formData.payCostType,
          newInoculationStatus: formData.newInoculationStatus
        });
      });
      let http = inoculateTask.save;
      // 犬伤处置
      if (this.type) {
        list[0].disposalRecordId = formData.disposalRecordId;
        list[0].injectionTaskType = formData.injectionTaskType;
        list = list[0];
        http = obj => this.$http.post('/disposal-record-task/add', obj);
      }
      this.doing = true;
      http(list).then(() => {
        this.doing = false;
        this.$notify.success({
          duration: 2000,
          inoculatorInfoId: '成功',
          message: '新增成功'
        });
        this.$emit('change');
      }).catch((error) => {
        this.doing = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '新增失败'
        });
      });
    },
    doClose: function () {
      this.$emit('close');
      this.$refs['form'].resetFields();
    }
  }
};
</script>
