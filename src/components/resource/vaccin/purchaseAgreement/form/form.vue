<style lang="less" scoped>
  .search-input {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
  }

</style>
<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="120px" class="demo-ruleForm">
    <h2 class="clearfix">{{showTitle}}疫苗采购协议</h2>
    <el-form-item label="疫苗" prop="orgGoodsId" class="search-input">
      <el-select placeholder="请选择疫苗" v-model="form.orgGoodsId" filterable remote :remote-method="getOmsGoods"
                 :clearable="true" popper-class="good-selects" @change="setSalesFirmName(form.orgGoodsId)">
        <el-option :label="item.orgGoodsDto.name" :value="item.orgGoodsDto.id" :key="item.orgGoodsDto.id"
                   v-for="item in goodsList">
          <div style="overflow: hidden">
            <span class="pull-left">{{item.orgGoodsDto.name}}</span>
          </div>
          <div style="overflow: hidden">
            <span class="select-other-info pull-left"><span
              v-show="item.orgGoodsDto.goodsId">平台货品ID</span>  {{item.orgGoodsDto.goodsId}}
            </span>
            <span class="select-other-info pull-left"><span
              v-show="item.orgGoodsDto.goodsNo">货品编号</span>  {{item.orgGoodsDto.goodsNo}}
            </span>
            <span class="select-other-info pull-left"><span
              v-show="item.orgGoodsDto.salesFirmName">供货厂商</span>  {{ item.orgGoodsDto.salesFirmName }}
            </span>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="供货厂商" v-if="form.orgGoodsId&&salesFirmName">
      {{salesFirmName}}
    </el-form-item>
    <el-form-item label="采购单价" prop="unitPrice">
      <oms-input type="text" v-model="form.unitPrice" @blur="formatUnitPrice"
                 placeholder="请输入单价,最多保留两位小数">
        <template slot="prepend">¥</template>
      </oms-input>
    </el-form-item>
    <el-form-item label="协议采购数量" prop="amount">
      <oms-input type="number" v-model.number="form.amount" min="0" placeholder="请输入协议采购数量"></oms-input>
    </el-form-item>
    <el-form-item label="协议到期时间" prop="expireTime" ref="expireTime">
      <el-date-picker v-model="form.expireTime" format="yyyy-MM-dd" placeholder="选择到期时间" @change="changeEndTime">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="是否生效">
      <el-switch v-model="form.availabilityStatus" on-text="是" off-text="否"
                 on-color="#13ce66"
                 off-color="#ff4949">
      </el-switch>
    </el-form-item>
    <el-form-item label-width="120px">
      <!--<el-button type="warning" @click.prevent.stop="remove()" native-type="submit">-->
      <!--删除-->
      <!--</el-button>-->
      <el-button type="primary" @click="onSubmit('form')">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {Vaccine, PurchaseAgreement} from '../../../../../resources';
  import utils from '../../../../../tools/utils';

  export default {
    data: function () {
      return {
        rules: {
          orgGoodsId: [
            {required: true, message: '请选择疫苗', trigger: 'blur'}
          ],
          unitPrice: [
            {required: true, message: '请输入采购单价', trigger: 'blur'}
          ],
          amount: [
            {type: 'number', required: true, message: '请输入采购数量', trigger: 'blur'}
          ],
          expireTime: [
            {required: true, message: '请选择协议到期日期', trigger: 'change'}
          ],
          availabilityStatus: [
            {required: true, message: '请选择是否生效'}
          ]
        },
        salesFirmName: '',
        form: {},
        doing: false,
        goodsList: []
      };
    },
    computed: {
      showTitle: function () {
        let title = '新增';
        if (this.form.id) {
          title = '修改';
        }
        return title;
      },
      exceptionType: function () {
        return this.$store.state.dict['exceptionType'];
      },
      executionBody: function () {
        return this.$store.state.dict['executionBody'];
      }
    },
    props: ['formItem', 'action', 'actionType'],
    watch: {
      formItem: function (val) {
        if (this.action === 'add') {
          this.form = {
            orgGoodsId: '',
            unitPrice: '',
            amount: '',
            expireTime: '',
            supplyCompanyId: '',
            availabilityStatus: true
          };
        }
        if (this.action === 'edit') {
          this.form = Object.assign({}, val);
        }
        this.getOmsGoods();
      },
      actionType: function (val) {
        if (!val) {
          this.$refs['form'].resetFields();
        }
      }
    },
    methods: {
      setSalesFirmName: function (item) {
        if (item) {
          this.goodsList.forEach(val => {
            if (val.orgGoodsDto.id === item) {
              this.salesFirmName = val.orgGoodsDto.salesFirmName;
              this.form.supplyCompanyId = val.orgGoodsDto.salesFirm;
            }
          });
        }
      },
      getOmsGoods: function (keyWord) {// 得到组织疫苗列表
        let params = {
          keyWord: keyWord,
          deleteFlag: false,
          status: true
        };
        Vaccine.query(params).then(res => {
          this.goodsList = res.data.list;
          if (this.action === 'edit') {
            let isExist = this.goodsList.some(item => this.form.orgGoodsId === item.orgGoodsDto.id);
            if (!isExist) {
              this.goodsList.push({
                orgGoodsDto: {
                  id: this.form.orgGoodsId,
                  name: this.form.orgGoodsName
                }
              });
            }
          }
        });
      },
      formatUnitPrice() {// 格式化单价，保留两位小数
        this.form.unitPrice = utils.autoformatDecimalPoint(this.form.unitPrice);
      },
//      remove: function () {
//        this.$confirm('确认删除疫苗"' + this.form.orgGoodsName + '的采购协议"?', '', {
//          confirmButtonText: '确定',
//          cancelButtonText: '取消',
//          type: 'warning'
//        }).then(() => {
//          let name = this.form.orgGoodsName;
//          PurchaseAgreement.delete(this.form.id).then(() => {
//            this.currentItem = {};
//            this.getGoodsList(1);
//            this.$notify.success({
//              title: '成功',
//              message: '已成功删除"' + name + '的采购协议"'
//            });
//            this.$emit('change', this.form);
//            this.$emit('right-close');
//          });
//        });
//      },
      onSubmit: function (formName) {
        this.changeEndTime(this.form.expireTime);
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            if (this.action === 'add') {
              PurchaseAgreement.save(this.form).then(res => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增疫苗采购协议成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(error => {
                this.$notify.error({
                  message: error.response.data && error.response.data.msg || '新增疫苗采购协议失败'
                });
              });
            } else {
              PurchaseAgreement.update(this.form.id, this.form).then(res => {
                this.$notify.success({
                  name: '成功',
                  message: '修改疫苗采购协议信息成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(error => {
                this.$notify.error({
                  message: error.response.data && error.response.data.msg || '修改疫苗采购协议信息失败'
                });
                this.doing = false;
              });
            }
          } else {

          }
        });
      },
      cancel: function () {
        this.$emit('right-close');
      },
      changeEndTime: function (date) {
        if (date) {
          this.form.expireTime = this.$moment(date).format('YYYY-MM-DD');
        } else {
          this.$refs['expireTime'].resetField();
        }
      }
    }
  };
</script>
