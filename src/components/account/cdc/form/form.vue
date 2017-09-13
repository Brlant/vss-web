<style lang="less" scoped="">
  @import "../../../../assets/mixins.less";

  @leftWidth: 200px;
  .min-gutter {
    .el-form-item {
      margin-bottom: 20px;
    }
  }

  .content-part {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    .content-left {
      width: @leftWidth;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      text-align: left;
      background-color: #eef2f3;
      > ul {
        margin: 0;
      }
      > h2 {
        padding: 0 45px;
        margin: 0;
        font-size: 18px;
        font-weight: bold;
        line-height: 55px;
        border-bottom: 1px solid #ddd;
      }
      .list-style {
        cursor: pointer;
        padding: 10px;
        text-align: center;
        span {
          display: inline-block;
          padding: 8px 35px;
        }
        &.active {
          span {
            background-color: @activeColor;
            border-radius: 20px;
            color: @activeColorFont
          }
        }
        &:hover {
          background: #dee9eb
        }

      }

    }

    .content-right {
      > h3 {
        padding: 0;
        margin: 0 0 20px;
        font-size: 18px;
        font-weight: normal;
        line-height: 55px;
        height: 55px;
        border-bottom: 1px solid #ddd;
        text-align: center;
        position: fixed;
        top: 0;
        right: 0;
        left: @leftWidth;
        background: #fff;
        z-index: 2;
      }
      position: absolute;
      top: 0;
      left: @leftWidth;
      right: 0;
      bottom: 0;
      overflow: auto;
      padding-top: 75px;
      .hide-content {
        display: none;
      }
      .show-content {
        padding: 0 20px;
        display: block;
      }
    }

    .min-gutter {
      .el-form-item {
        margin-bottom: 20px;
      }
      .el-form-item__label {
        font-size: 12px
      }
    }
  }

  .el-form .el-select {
    display: block;
  }

  .el-form .el-cascader {
    display: block;
  }
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">{{orgTitle}}基础信息</h2>
        <ul>
          <li align="center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;text-align: center">
            <el-button type="primary" @click="onSubmit('baseform')" native-type="submit">保存</el-button>
          </li>
        </ul>

      </div>
      <div class="content-right min-gutter">
        <h3></h3>
        <el-form ref="baseform" :rules="rules" :model="form" label-width="140px" class="min-gutter"
                 @submit.prevent="onSubmit('baseform')" onsubmit="return false" style="padding-right: 20px">
          <el-form-item :label="orgTitle+'名称'" prop="name">
            <oms-input type="text" v-model="form.name" placeholder="请输入名称"></oms-input>
          </el-form-item>
          <el-form-item :label="orgTitle+'简称'">
            <oms-input type="text" v-model="form.nameJc" placeholder="请输入简称"></oms-input>
          </el-form-item>
          <el-form-item label="公司图标">
            <oms-upload-picture :photoUrl="form.orgPhoto" @change="changPhoto"></oms-upload-picture>
          </el-form-item>
          <el-form-item :label="orgTitle+'系统代码'" prop="manufacturerCode">
            <oms-input type="text" v-model="form.manufacturerCode" placeholder="请输入oms代码"></oms-input>
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="creditCode">
            <oms-input type="text" v-model="form.creditCode" placeholder="请输入统一社会信用代码"></oms-input>
          </el-form-item>
          <el-form-item label="法人代表">
            <oms-input type="text" v-model="form.legalRepresentative" placeholder="请输入法人代表"></oms-input>
          </el-form-item>
          <el-form-item :label="orgTitle+'级别'">
            <el-select placeholder="请选择级别" v-model="form.level">
              <el-option :label="item.label" :value="item.key" :key="item.key"
                         v-for="item in orgLevel"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话">
            <oms-input type="text" v-model="form.phone" placeholder="请输入联系电话"></oms-input>
          </el-form-item>
          <el-form-item label="联系人">
            <oms-input type="text" v-model="form.contact" placeholder="请输入联系人"></oms-input>
          </el-form-item>
          <el-form-item label="邮政编码">
            <oms-input type="text" v-model="form.postcode" placeholder="请输入邮政编码"></oms-input>
          </el-form-item>
          <el-form-item :label="orgTitle+'所在地区'">
            <el-cascader :options="options" v-model="selectOptions" placeholder="请选择省市区"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址">
            <oms-input type="text" placeholder="建议您如实填写详细地址,例如街道名称,门牌号码等信息" v-model="form.address"></oms-input>
          </el-form-item>
          <el-form-item label="管理员手机号码" prop="adminTelephone">
            <oms-input type="text" v-model="form.adminTelephone" placeholder="请输入手机号码"></oms-input>
          </el-form-item>
          <el-form-item label="管理员邮箱" prop="adminEmail">
            <oms-input type="text" v-model="form.adminEmail" placeholder="请输入邮箱"></oms-input>
          </el-form-item>
          <el-form-item label="默认物流中心">
            <el-select placeholder="请选择默认物流中心" v-model="form.defaultCentreId" filterable>
              <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in LogisticsCenter"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <oms-input type="text" placeholder="请输入备注" v-model="form.remarks"></oms-input>
          </el-form-item>
          <!--<el-form-item label-width="140px">-->
          <!--<el-button type="primary" @click="onSubmit('baseform')" native-type="submit">保存</el-button>-->
          <!--<el-button @click="doClose">取消</el-button>-->
          <!--</el-form-item>-->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable object-shorthand */
  import { BaseInfo, LogisticsCenter, User } from '@/resources';
  import utils from '@/tools/utils';
  import omsUploadPicture from '@/components/common/upload.picture.vue';

  export default {
    components: {
      omsUploadPicture
    },
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      },
      title: {
        type: String,
        default: '增加'
      },
      action: {
        type: String,
        default: ''
      },
      orgTitle: {
        type: String,
        default: '货主'
      }
    },
    data: function () {
      let checkEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱'));
        } else {
          let re = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ig;
          if (!re.test(value)) {
            callback(new Error('请输入正确的邮箱'));
          }
          if (this.action === 'edit') {
            let orgId = this.$route.params.id;
            User.checkEmail(value, this.form.adminId, orgId).then(function (res) {
              if (res.data.valid) {
                callback();
              } else {
                callback(new Error('邮箱已经存在'));
              }
            });
          } else {
            callback();
          }

        }
      };
      let checkPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入座机电话号码'));
        } else {
          let re = /^(0\d{2,3}-?)?\d{7,8}$/ig;
          if (!re.test(value)) {
            callback(new Error('请输入正确的座机电话号码'));
          } else {
            callback();
          }
        }
      };
      let checkTelePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号码'));
        } else {
          let re = /^1[34578]\d{9}$/;
          if (!re.test(value)) {
            callback(new Error('请输入正确的手机号码'));
          }
          if (this.action === 'edit') {
            let orgId = this.$route.params.id;
            User.checkPhone(value, this.form.adminId, orgId).then(function (res) {
              if (res.data.valid) {
                callback();
              } else {
                callback(new Error('手机号码已经存在'));
              }
            });
          } else {
            callback();
          }
        }
      };
      let checkName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入姓名'));
        } else {
          BaseInfo.checkName(value, this.form.id).then(function (res) {
            if (res.data.valid) {
              callback();
            } else {
              callback(new Error('姓名已经存在'));
            }
          });
        }
      };
      let checkCreditCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入统一社会信用代码'));
        } else {
          BaseInfo.checkCreditCode(value, this.form.id).then(function (res) {
            if (res.data.valid) {
              callback();
            } else {
              callback(new Error('统一社会信用代码已经存在'));
            }
          });
        }
      };
      let checkManufacturerCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入oms代码'));
        } else {
          BaseInfo.checkManufacturerCode(value, this.form.id).then(function (res) {
            if (res.data.valid) {
              callback();
            } else {
              callback(new Error('oms代码已经存在'));
            }
          });
        }
      };
      let checkAdminAccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入管理员账号'));
        } else {
          BaseInfo.checkAdminAccount(value, this.form.id).then(function (res) {
            if (res.data.valid) {
              callback();
            } else {
              callback(new Error('管理员账号已经存在'));
            }
          });
        }
      };
      return {
        form: this.formItem,
        LogisticsCenter: [],
        options: utils.address,
        selectOptions: [],
        rules: {
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {validator: checkName, trigger: 'blur'}
          ],
          creditCode: [
            {required: true, message: '请输入信用代码', trigger: 'blur'},
            {validator: checkCreditCode, trigger: 'blur'}
          ],
          manufacturerCode: [
            {required: true, message: '请输入oms代码', trigger: 'blur'},
            {validator: checkManufacturerCode, trigger: 'blur'}
          ],
          adminAccount: [
            {required: true, message: '请输入管理员账号', trigger: 'blur'},
            {validator: checkAdminAccount, trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入座机号码', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          adminTelephone: [
            {required: true, message: '请输入管理员手机号码', trigger: 'blur'},
            {validator: checkTelePhone, trigger: 'blur'}
          ],
          adminEmail: [
            {required: true, message: '请输入管理员邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ]
        },
        doing: false,
        photo: {}
      };
    },
    mounted: function () {
      this.getLogisticsCenter();
    },
    computed: {
      orgLevel () {
        return this.$store.state.dict['orgLevel'];
      }
    },
    watch: {
      formItem: function (val) {
        if (val.id) {
          this.form = Object.assign({}, val);
          this.selectOptions.push(this.form.province);
          this.selectOptions.push(this.form.city);
          this.selectOptions.push(this.form.region);
        } else {
          this.photo = {};
          this.selectOptions = [];
          this.form = {
            address: '',
            adminAccount: '',
            adminEmail: '',
            adminId: '',
            adminName: '',
            adminTelephone: '',
            auditedBy: '',
            auditedStatus: '',
            auditedTime: '',
            contact: '',
            createTime: '',
            createdBy: '',
            creditCode: '',
            defaultCenter: '',
            defaultCentreId: '',
            deleteFlag: false,
            id: '',
            legalRepresentative: '',
            level: '',
            manufacturerCode: '',
            name: '',
            nameJc: '',
            namePhonetic: '',
            orgAuditStatus: '',
            phone: '',
            postcode: '',
            province: '',
            city: '',
            region: '',
            relationList: [],
            remarks: '',
            type: '',
            updateTime: ''
          };
        }
      },
      selectOptions () {
        this.form.province = this.selectOptions[0];
        this.form.city = this.selectOptions[1];
        this.form.region = this.selectOptions[2];
      },
      'form.creditCode': function (val) {
        if (val) {
          this.form.creditCode = val.toUpperCase();
        }
      }
    },
    methods: {
      changPhoto: function (photo) {
        if (photo) {
          this.photo = photo;
          this.form.orgPhoto = this.photo.url;
          this.form.orgPhotoId = this.photo.attachmentId;
        }
      },
      getLogisticsCenter: function () {
        let param = {
          deleteFlag: false
        };
        LogisticsCenter.query(param).then(res => {
          this.LogisticsCenter = res.data;
        });
      },
      onSubmit: function (formName) {
        let self = this;
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return false;
          }
          this.doing = true;
          if (this.action === 'add') {
            self.form.type = this.$route.meta.type;
            BaseInfo.save(self.form).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增"' + this.orgTitle + self.form.name + '"成功'
              });
              self.$emit('change', Object.assign({}, self.form));
            });
          } else {
            BaseInfo.update(self.form.id, self.form).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '修改' + this.orgTitle + '基础信息"' + self.form.name + '"成功'
              });
              self.$emit('change', Object.assign({}, self.form));
            });
          }
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['baseform'].resetFields();
      }
    }
  };
</script>
