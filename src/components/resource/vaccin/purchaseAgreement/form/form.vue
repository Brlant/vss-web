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
                 :clearable="true" popper-class="good-selects">
        <el-option :label="item.orgGoodsDto.name" :value="item.orgGoodsDto.id" :key="item.orgGoodsDto.id"
                   v-for="item in goodsList">
          <span class="pull-left">{{ item.orgGoodsDto.name }}</span>
          <span class="pull-right" style="color:#999">
           <span>{{ item.orgGoodsDto.salesFirmName }}</span>
          </span>
        </el-option>
      </el-select>
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
    <!--<el-form-item label="协议开始时间" prop="startDate" ref="startDate">-->
    <!--<el-date-picker v-model="form.startDate" format="yyyy-MM-dd" placeholder="选择开始时间" @change="changeStartTime">-->
    <!--</el-date-picker>-->
    <!--</el-form-item>-->
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
//      let checkStartTime = (rule, value, callback) => {
//        if (value === '') {
//          callback(new Error('请选择开始日期'));
//        } else {
//          if (this.form.expireTime < this.form.startDate) {
//            callback(new Error('开始日期必须小于到期日期'));
//          } else {
//            callback();
//          }
//        }
//      };
//      let checkEndTime = (rule, value, callback) => {
//        if (value === '') {
//          callback(new Error('请选择到期日期'));
//        } else {
//          if (this.form.expireTime < this.form.startDate) {
//            callback(new Error('到期日期必须大于开始日期'));
//          } else {
//            callback();
//          }
//        }
//      };
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
        form: this.formItem,
        doing: false,
        attachmentList: [],
        goodsList: '',
        goodsType: '',
        x: ''
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
        this.form = Object.assign({}, val);
        this.attachmentList = [];
        this.getOmsGoods();
      },
      actionType: function (val) {
        if (!val) {
          this.$refs['form'].resetFields();
        }
      }
    },
    methods: {
      getOmsGoods: function (keyWord) {// 得到组织疫苗列表
        let params = {
          keyWord: keyWord
        };
        Vaccine.query(params).then(res => {
          this.goodsList = res.data.list;
//          if (this.action === 'edit') {
//            let isExist = this.goodsList.some(item => this.form.orgGoodsId === item.orgGoodsDto.id);
//            if (!isExist) {
//              this.goodsList.push({
//                orgGoodsDto: {
//                  id: this.form.orgGoodsId,
//                  name: this.form.orgGoodsName
//                }
//              });
//            }
//          }
        });
      },
      formatUnitPrice() {// 格式化单价，保留两位小数
        this.form.unitPrice = utils.autoformatDecimalPoint(this.form.unitPrice);
      },
      onSubmit: function (formName) {
        this.changeEndTime(this.form.expireTime);
        this.form.unitPrice = parseInt(this.form.unitPrice, 0);
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
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '新增疫苗采购协议失败'
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
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '修改疫苗采购协议信息失败'
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
