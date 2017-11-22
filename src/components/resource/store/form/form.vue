<style lang="less" scoped="">
  .el-form .el-select {
    display: block;
  }

  .el-form .el-cascader {
    display: block;
  }
</style>
<template>
  <el-form ref="storeform" :rules="rules" :model="form" label-width="120px">
    <h2 class="clearfix">仓库地址</h2>
    <el-form-item label="仓库名称" prop="name">
      <oms-input type="text" v-model="form.name" placeholder="请输入仓库名称"></oms-input>
    </el-form-item>
    <el-form-item label="仓库类型" prop="warehouseType">
      <el-select v-model="form.warehouseType" placeholder="请选择仓库类型">
        <el-option label="物流公司仓库" value="0"></el-option>
        <el-option label="本地仓库" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="所属物流公司" prop="warehouseSourceFirm" v-if="form.warehouseType==='0'">
      <el-select filterable remote placeholder="请输入名称搜索物流公司" :remote-method="getOrgs" @click.native="getOrgs('')"
                 :clearable="true" v-model="form.warehouseSourceFirm" popper-class="good-selects">
        <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
          <div style="overflow: hidden">
            <span class="pull-left" style="clear: right">{{org.name}}</span>
          </div>
          <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码</span> {{org.manufacturerCode}}
                      </span>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="联系人" prop="contact">
      <oms-input type="text" v-model="form.contact" placeholder="请输入联系人"></oms-input>
    </el-form-item>
    <el-form-item label="联系人手机" prop="telephone">
      <oms-input type="text" v-model="form.telephone" placeholder="请输入联系人手机"></oms-input>
    </el-form-item>
    <el-form-item label="所在地区">
      <el-cascader :options="options" v-model="selectOptions" placeholder="请选择省市区"></el-cascader>
    </el-form-item>
    <el-form-item label="详细地址" prop="detail">
      <oms-input type="text" v-model="form.detail" placeholder="建议您如实填写详细地址,例如街道名称,门牌号码等信息"></oms-input>
    </el-form-item>
    <el-form-item label="仓库地址类型" prop="type">
      <el-select placeholder="请选择仓库地址类型" v-model="form.type">
        <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in dictAddress"/>
      </el-select>
    </el-form-item>
    <el-form-item label="默认地址" prop="isuse">
      <el-switch on-text="是" off-text="否" on-color="#13ce66" off-color="#ff4949" v-model="form.default"></el-switch>
    </el-form-item>
    <el-form-item label-width="120px">
      <el-button type="primary" @click="onSubmit('storeform')" :disabled="doing">保存</el-button>
      <el-button @click="doClose">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {Address, BaseInfo} from '../../../../resources';
  import utils from './../../../../tools/utils';

  export default {
    data: function () {
      let checkPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号码'));
        } else {
          let re = /^1[34578]\d{9}$/;
          if (!re.test(value)) {
            callback(new Error('请输入正确的手机号码'));
          } else {
            callback();
          }
        }
      };
      return {
        form: {
          orgId: '',
          name: '',
          contact: '',
          warehouseType: '',
          warehouseSourceFirm: '',
          telephone: '',
          default: false,
          detail: '',
          type: ''
        },
        orgList: [],
        options: utils.address,
        selectOptions: [],
        rules: {
          name: [
            {required: true, message: '请输入仓库名称', trigger: 'blur'}
          ],
          contact: [
            {required: true, message: '请输入联系人', trigger: 'blur'}
          ],
          telephone: [
            {required: true, message: '请选输入联系人手机', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
          ],
          detail: [
            {required: true, message: '请输入详细地址', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择仓库地址类型', trigger: 'change'}
          ],
          warehouseType: [
            {required: true, message: '请选择仓库类型', trigger: 'blur'}
          ],
          warehouseSourceFirm: [
            {required: true, message: '请选择所属物流公司', trigger: 'blur'}
          ]
        },
        doing: false
      };
    },
    props: ['formItem', 'formType', 'actionType'],
    watch: {
      formItem: function () {
        this.initFormValue();
      },
      selectOptions() {
        this.form.province = this.selectOptions[0];
        this.form.city = this.selectOptions[1];
        this.form.region = this.selectOptions[2];
      },
      actionType: function (val) {
        if (!val) {
          this.$refs['storeform'].resetFields();
        }
      }
    },

    computed: {
      'dictAddress': function () {
        return this.$store.state.dict['orgAddress'];
      }
    },
    methods: {
      getOrgs: function (query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) {
          return;
        }
        // 过滤物流公司名称列表
        let params = {
          keyWord: query,
          relation: '3'
        };
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.orgList = res.data;
          if (this.action === 'edit') {
            let isExist = this.orgList.some(item => this.form.orgList.id === item.id);
            if (!isExist) {
              this.orgList.push({
                id: this.form.salesFirm,
                name: this.form.salesFirmName
              });
            }
          }
        });
      },
      initFormValue: function () {
        this.selectOptions = [];
        this.orgList = [];
        if (this.formItem.id) {
          this.orgList.push({
            id: this.formItem.warehouseSourceFirm,
            name: this.formItem.warehouseSourceFirmName
          });
          this.form = Object.assign({}, this.formItem);
          this.selectOptions.push(this.form.province);
          this.selectOptions.push(this.form.city);
          this.selectOptions.push(this.form.region);
        } else {
          this.form = {
            orgId: '',
            name: '',
            contact: '',
            telephone: '',
            warehouseType: '1',
            warehouseSourceFirm: '',
            default: false,
            detail: '',
            type: ''
          };
        }
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
            if (!valid || this.doing) return;
            this.doing = true;
//          this.form.type = parseInt(this.form.type, 10);
            this.form.orgId = this.$route.params.id;
            if (this.formType === 'add') {
              Address.save(this.form).then(res => {
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              });
            } else {
              Address.update(this.form).then(res => {
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              });
            }
          }
        );
      },
      doClose: function () {
        this.$emit('right-close');
        this.$refs['storeform'].resetFields();
      }
    }
  };
</script>
