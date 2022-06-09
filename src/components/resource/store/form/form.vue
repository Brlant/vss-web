<style lang="scss" scoped>
.el-form .el-select {
  display: block;
}

.el-form .el-cascader {
  display: block;
}
</style>
<template>
  <el-form ref="storeform" :model="form" :rules="rules" label-width="120px">
    <h2 class="clearfix">仓库地址</h2>
    <el-form-item label="仓库名称" prop="name">
      <oms-input v-model="form.name" placeholder="请输入仓库名称" type="text"></oms-input>
    </el-form-item>
    <el-form-item label="仓库类型" prop="warehouseType">
      <el-select v-model="form.warehouseType" placeholder="请选择仓库类型">
        <el-option label="物流公司仓库" value="0"></el-option>
        <el-option label="本地仓库" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item v-if="form.warehouseType==='0'" label="所属物流公司" prop="warehouseSourceFirm">
      <el-select v-model="form.warehouseSourceFirm" :clearable="true" :remote-method="getOrgs" filterable placeholder="请输入名称搜索物流公司"
                 popper-class="good-selects" remote @click.native="getOrgs('')">
        <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
          <div style="overflow: hidden">
            <span class="pull-left" style="clear: right">{{org.name}}</span>
          </div>
          <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
          </div>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="物流中心">
      <el-select v-model="form.logisticsCentreId" clearable filterable placeholder="请选择物流中心">
        <el-option v-for="item in LogisticsCenter" :key="item.id" :label="item.name" :value="item.id"/>
      </el-select>
    </el-form-item>
    <el-form-item label="联系人" prop="contact">
      <oms-input v-model="form.contact" placeholder="请输入联系人" type="text"></oms-input>
    </el-form-item>
    <el-form-item label="联系人电话">
      <oms-input v-model="form.telephone" placeholder="请输入联系人手机" type="text"></oms-input>
    </el-form-item>
    <el-form-item label="所在地区">
      <el-cascader v-model="selectOptions" :options="options" placeholder="请选择省市区"></el-cascader>
    </el-form-item>
    <el-form-item label="详细地址" prop="detail">
      <oms-input v-model="form.detail" placeholder="建议您如实填写详细地址,例如街道名称,门牌号码等信息" type="text"></oms-input>
    </el-form-item>
    <el-form-item label="仓库地址类型" prop="type">
      <el-select v-model="form.type" placeholder="请选择仓库地址类型">
        <el-option v-for="item in dictAddress" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>
    </el-form-item>
    <el-form-item label="默认地址" prop="isuse">
      <el-switch v-model="form.default" active-color="#13ce66" active-text="是" inactive-color="#ff4949"
                 inactive-text="否"></el-switch>
    </el-form-item>
    <el-form-item label-width="120px">
      <el-button :disabled="doing" type="primary" @click="onSubmit('storeform')">保存</el-button>
      <el-button @click="doClose">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import {Address, BaseInfo, LogisticsCenter} from '../../../../resources';
import utils from './../../../../tools/utils';

export default {
  data: function () {
    let checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'));
      } else {
        let re = /^1[345789]\d{9}$/;
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
        type: '',
        logisticsCentreId: ''
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
//          telephone: [
//            {required: true, message: '请选输入联系人手机', trigger: 'blur'},
//            {validator: checkPhone, trigger: 'blur'}
//          ],
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
      doing: false,
      LogisticsCenter: []
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
      return this.$getDict('orgAddress');
    }
  },
  mounted() {
    this.filterLogisticsCenter();
  },
  methods: {
    filterLogisticsCenter: function () {// 过滤物流中心
      let param = {
        deleteFlag: false
      };
      LogisticsCenter.query(param).then(res => {
        this.LogisticsCenter = res.data;
      });
    },
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
      });
    },
    initFormValue: function () {
      this.selectOptions = [];
      this.orgList = [];
      if (this.formItem.id) {
        this.getOrgs(this.formItem.warehouseSourceFirmName);
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
          type: '',
          logisticsCentreId: ''
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
