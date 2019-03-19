<style lang="scss" scoped="">
  @import "~@/assets/mixins";

  .el-form .el-select {
    display: block;
  }

  .mini-form {
    .el-form-item {
      margin-bottom: 0px;
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
    <el-form ref="form" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit('form')" onsubmit="return false">
      <h2>基本信息</h2>
      <el-form-item label="接种者" prop="inoculatorInfoId">
        <el-select v-model="form.inoculatorInfoId" filterable remote :remote-method="queryPersons"
                   placeholder="请输入名称/身份证号/出生证号搜索" @click.native.once="queryPersonList('')"
                   clearable popper-class="good-selects">
          <el-option v-for="item in personList" :key="item.id" :label="item.inoculatorName" :value="item.id">
            <div>
              <span>{{item.inoculatorName}}</span>
            </div>
            <div>
              <span class="select-other-info"><span v-show="item.inoculatorNumber">接种证编号:</span>{{item.inoculatorNumber}}</span>
              <span class="select-other-info"><span v-show="item.inoculatorCardNumber">身份证:</span>{{item.inoculatorCardNumber}}</span>
              <span class="select-other-info"><span v-show="item.birthCertificateNumber">出生证号:</span>
                {{item.birthCertificateNumber}}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-row>
        <el-col :span="14">
          <el-form-item label="登记编号" prop="inoculatorNumber">
            <oms-input placeholder="请输入登记编号" v-model="form.inoculatorNumber"></oms-input>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="是否缴费" label-width="80px">
            <el-radio-group v-model="form.payCostType">
              <el-radio :label="1">已缴</el-radio>
              <el-radio :label="0">未缴</el-radio>
            </el-radio-group>
          </el-form-item>
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
    <el-form ref="addForm" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit('form')" onsubmit="return false">
      <h2>疫苗信息</h2>
      <el-form-item label="疫苗" prop="vaccineId">
        <el-select v-model="form.vaccineId" filterable remote :remote-method="queryOrgGoodsList"
                   placeholder="请输入名称搜索疫苗" @click.native.once="queryOrgGoodsList('')"
                   clearable popper-class="order-good-selects"
                   @change="orgGoodsIdChange">
          <el-option v-for="item in orgGoodsList" :key="item.id" :label="item.goodsName"
                     :value="item.goodsId">
            <div style="overflow: hidden">
              <span class="pull-left">{{item.goodsName}}</span>
            </div>
            <div style="overflow: hidden">
              <span class="select-other-info pull-left"><span
                v-show="item.goodsNo">疫苗编号:</span>{{item.goodsNo}}
              </span>
              <span class="select-other-info pull-left">
                <span v-show="item.saleFirmName">供货厂商:</span>{{ item.saleFirmName }}
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批号" prop="batchNumberId">
        <el-select v-model="form.batchNumberId" filterable remote :remote-method="queryBatchNumbers" placeholder="请选择批号"
                   clearable popper-class="good-selects" @change="batchNumberChange"
                   @click.native.once="queryBatchNumbers('')">
          <el-option v-for="item in batchNumberList" :key="item.batchNumberId" :label="item.batchNumber"
                     :value="item.batchNumberId">
            <div>{{item.batchNumber}}</div>
            <div class="font-gray">
              <span>剩余剂次：{{item.qualifiedBizServings}}</span>
              <span class="ml-15">有效期：{{item.expiryDate | date}}</span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-row class="info" v-show="form.vaccineId&& form.batchNumberId">
        <el-col :span="10" v-show="form.factoryName">
          <el-form-item label="生产厂商">{{form.factoryName}}</el-form-item>
        </el-col>
        <el-col :span="8" v-show="form.specifications">
          <el-form-item label="规格">{{form.specifications}}</el-form-item>
        </el-col>
        <el-col :span="6" v-show="form.qualifiedBizServings">
          <el-form-item label="剩余剂次">
            <span>{{form.qualifiedBizServings}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="接种部位" prop="inoculationPosition">
            <el-select type="text" v-model="form.inoculationPosition" placeholder="请选择接种部位">
              <el-option :value="item.key" :key="item.key" :label="item.label"
                         v-for="item in inoculationPositionList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="接种途径" prop="inoculationChannel">
            <el-select type="text" v-model="form.inoculationChannel" placeholder="请选择接种途径">
              <el-option :value="item.key" :key="item.key" :label="item.label"
                         v-for="item in inoculationChannelList"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-show="form.list.length">
        <h2>已选疫苗</h2>
        <goods-list :goodsList="form.list" @deleteItem="deleteItem"/>
      </div>
      <el-form-item label-width="100px">
        <el-button type="primary" plain @click="addGoods" v-show="!form.id && form.vaccineId">添加多种疫苗</el-button>
      </el-form-item>
      <el-form-item label-width="100px" v-show="form.vaccineId || form.list.length">
        <el-button type="primary" @click="onSubmit('form')" native-type="submit" :disabled="doing">保存接种任务</el-button>
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
      }
    },
    data: function () {
      return {
        roleId: '',
        form: {
          inoculatorInfoId: '',
          inoculatorNumber: '',
          vaccineId: '',
          batchNumberId: '',
          inoculationPosition: '',
          inoculationChannel: '',
          payCostType: 1,
          newInoculationStatus: 0,
          qualifiedBizServings: '',
          specifications: '',
          factoryName: '',
          list: []
        },
        rules: {
          inoculatorInfoId: [
            {required: true, message: '请选择接种者', trigger: 'change'}
          ],
          inoculatorNumber: [
            {required: true, message: '请输入登记编号', trigger: ['blur', 'change']}
          ],
          vaccineId: [
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
          ]
        },
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
              goodsName: this.formItem.goodsName,
              id: this.formItem.orgGoodsId
            }
          ];
          this.form = Object.assign({}, this.formItem);
          this.form.list = [];
          this.$http.get('/org/goods/' + this.form.orgGoodsId).then(res => {
            this.form = Object.assign({}, this.form, {
              specifications: res.data.orgGoodsDto.goodsDto.specifications,
              factoryName: res.data.orgGoodsDto.goodsDto.factoryName
            });
          });
        } else {
          this.form = {
            inoculatorInfoId: '',
            inoculatorNumber: '',
            vaccineId: '',
            batchNumberId: '',
            inoculationPosition: '',
            inoculationChannel: '',
            payCostType: 1,
            newInoculationStatus: 0,
            qualifiedBizServings: '',
            specifications: '',
            factoryName: '',
            list: []
          };
        }
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
          this.$refs['addForm'].clearValidate();
        });
      }
    },
    methods: {
      queryPersons(query) {
        this.form.inoculatorNumber = query;
        this.queryPersonList(query);
      },
      queryBatchNumbers(query, first) {
        if (!this.form.vaccineId) return;
        let item = this.orgGoodsList.find(f => f.goodsId === this.form.vaccineId);
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
            this.batchNumberList = res.data.filter(f => f.qualifiedBizServings).sort((pre, cur) => pre.expiryDate - cur.expiryDate);
            if (!this.batchNumberList.length) {
              return this.$notify.info('没有可用库存');
            }
            if (first && this.batchNumberList[0]) {
              this.form.qualifiedBizServings = this.batchNumberList[0].qualifiedBizServings;
              this.form.erpStockId = this.batchNumberList[0].id;
              this.form.batchNumber = this.batchNumberList[0].batchNumber;
              this.form.batchNumberId = this.batchNumberList[0].batchNumberId;
              this.form.expiryDate = this.batchNumberList[0].expiryDate;
              this.form.qualifiedBizServings = this.batchNumberList[0].qualifiedBizServings;
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
        let item = this.orgGoodsList.find(f => f.goodsId === val);
        this.form.orgGoodsId = item.id;
        this.form.orgGoodsName = item.goodsName;
        this.queryBatchNumbers('', true);
        this.$http.get('/org/goods/' + this.form.orgGoodsId).then(res => {
          this.form.inoculationPosition = res.data.orgGoodsDto.goodsDto.propertyMap.inoculationPosition;
          this.form.inoculationChannel = res.data.orgGoodsDto.goodsDto.propertyMap.inoculationChannel;
          this.form.specifications = res.data.orgGoodsDto.goodsDto.specifications;
          this.form.factoryName = res.data.orgGoodsDto.goodsDto.factoryName;
        });
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
      deleteItem(item) {
        this.form.list = this.form.list.filter(f => f !== item);
      },
      onSubmit: function (formName) {
        let self = this;
        if (this.doing) return;
        this.doing = true;
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
                this.$notify.error({
                  message: error.response.data && error.response.data.msg || '修改失败'
                });
                this.doing = false;
              });
            });
          }
        });
      },
      add(formData) {
        const list = formData.list.map(m => {
          return Object.assign({}, m, {
            inoculatorInfoId: formData.inoculatorInfoId,
            inoculatorNumber: formData.inoculatorNumber,
            payCostType: formData.payCostType,
            newInoculationStatus: formData.newInoculationStatus
          });
        });
        this.doing = true;
        inoculateTask.save(list).then(() => {
          this.doing = false;
          this.$notify.success({
            duration: 2000,
            inoculatorInfoId: '成功',
            message: '新增成功'
          });
          this.$emit('change');
        }).catch((error) => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '新增失败'
          });
          this.doing = false;
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['form'].resetFields();
      }
    }
  };
</script>
