<style lang="scss" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">{{title}}</h2>
    <el-form ref="form" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit('form')" onsubmit="return false">
      <el-form-item label="姓名" prop="inoculatorName">
        <oms-input type="text" v-model="form.inoculatorName" placeholder="请输入姓名"></oms-input>
      </el-form-item>
      <el-form-item label="性别" prop="inoculatorSex">
        <el-radio-group v-model="form.inoculatorSex">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="生日" prop="inoculatorBirthday">
        <el-date-picker v-model="form.inoculatorBirthday" placeholder="请选择生日" format="yyyy-MM-dd"
                        value-format="timestamp">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="接种证编号">
        <oms-input type="text" v-model="form.inoculatorNumber" placeholder="请输入接种证编号"></oms-input>
      </el-form-item>
      <el-form-item label="身份证">
        <oms-input type="text" v-model="form.inoculatorCardNumber" placeholder="请输入身份证"></oms-input>
      </el-form-item>
      <el-form-item label="出生证号">
        <oms-input type="text" v-model="form.birthCertificateNumber" placeholder="请输入出生证号"></oms-input>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('form')" native-type="submit" :disabled="doing">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {inoculateInfo} from '@/resources';

  export default {
    inoculatorName: 'editForm',
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      }
    },
    data: function () {
      return {
        form: {
          inoculatorName: '',
          inoculatorSex: '',
          inoculatorBirthday: '',
          inoculatorNumber: '',
          inoculatorCardNumber: '',
          birthCertificateNumber: ''
        },
        rules: {
          inoculatorName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          inoculatorSex: [
            {required: true, message: '请输入性别', trigger: 'change'}
          ],
          inoculatorBirthday: [
            {required: true, message: '请选择生日', trigger: 'change'}
          ],
          inoculatorNumber: [
            {required: true, message: '请输入接种证编号', trigger: 'blur'}
          ],
          inoculatorCardNumber: [
            {required: true, message: '请输入身份证', trigger: 'blur'}
          ],
          birthCertificateNumber: [
            {required: true, message: '请输入出生证号', trigger: 'blur'}
          ]
        },
        doing: false
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      title() {
        return (this.form.id ? '编辑' : '新增') + '接种者档案';
      }
    },
    watch: {
      formItem: function (val) {
        if (val.id) {
          this.form = Object.assign({}, this.formItem);
        } else {
          this.form = {
            inoculatorName: '',
            inoculatorSex: '',
            inoculatorBirthday: '',
            inoculatorNumber: '',
            inoculatorCardNumber: '',
            birthCertificateNumber: ''
          };
        }
        this.$refs['form'].clearValidate();
      }
    },
    methods: {
      onSubmit: function (formName) {
        let self = this;
        if (this.doing) return;
        this.doing = true;
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.doing = false;
            return false;
          }
          this.doing = true;
          let formData = JSON.parse(JSON.stringify(this.form));
          if (!formData.id) {
            inoculateInfo.save(formData).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                inoculatorName: '成功',
                message: '新增成功'
              });
              this.$emit('change');
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '新增失败'
              });
              this.doing = false;
            });
          } else {
            inoculateInfo.update(formData.id, formData).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                inoculatorName: '成功',
                message: '修改成功'
              });
              this.$emit('change');
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '修改失败'
              });
              this.doing = false;
            });
          }
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['form'].resetFields();
      }
    }
  };
</script>
