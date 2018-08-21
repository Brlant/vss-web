<template>
  <el-form ref="form" :rules="rules" :model="form" label-width="120px">
    <h2 class="clearfix">{{showTitle}}公告内容</h2>
    <el-form-item label="公告标题" prop="title">
      <oms-input type="text" v-model="form.noticeTitle" placeholder="请输入公告标题"></oms-input>
    </el-form-item>
    <el-form-item label="公告内容" prop="content">
      <oms-input type="textarea" v-model="form.noticeContent" placeholder="请输入公告内容"
                 :autosize="{ minRows: 5, maxRows: 5}"></oms-input>
    </el-form-item>
    <el-form-item label="附件">
      <oms-upload :fileList="attachmentList" @change="changeFiles"
                  :formData="{ objectId: 'notice', objectType: form.noticeId}"></oms-upload>
    </el-form-item>
    <el-form-item label-width="120px">
      <el-button type="primary" @click="onSubmit('form')" :disabled="doing">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
  import {OmsAttachment, Notice} from '../../../../resources';

  export default {
    data: function () {
      return {
        rules: {
          name: [
            {required: true, message: '请输入公告标题', trigger: 'blur'}
          ],
          standard: [
            {required: true, message: '请输入公告内容', trigger: 'blur'}
          ]
        },
        form: this.formItem,
        doing: false,
        attachmentList: [],
        x: ''
      };
    },
    computed: {
      showTitle: function () {
        let title = '新增';
        if (this.form.noticeId) {
          title = '修改';
        }
        return title;
      }
    },
    props: ['formItem', 'action', 'actionType'],
    watch: {
      formItem: function (val) {
        this.form = Object.assign({}, val);
        this.attachmentList = [];
        this.getFileList();
      },
      actionType: function (val) {
        if (!val) {
          this.$refs['form'].resetFields();
        }
      }
    },
    methods: {
      changeFiles: function (fileList) {
        let ids = [];
        fileList.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.form.attachmentIdList = ids;
      },
      getFileList: function () {
        if (!this.form.noticeId) return;
        OmsAttachment.queryOneAttachmentList(this.form.noticeId, 'notice').then(res => {
          this.attachmentList = res.data;
          let ids = [];
          this.attachmentList.forEach(val => {
            ids.push(val.attachmentId);
          });
          this.form.attachmentIdList = ids;
        });
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (this.action === 'add') {
              this.doing = true;
              Notice.save(this.form).then(res => {
                this.$notify.success({
                  duration: 2000,
                  name: '成功',
                  message: '新增公告成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '新增公告失败'
                });
                this.doing = false;
              });
            } else {
              // 获取当前表单下的附件
              this.getFileList();
              this.doing = true;
              Notice.edit(this.form.noticeId, this.form).then(res => {
                this.$notify.success({
                  name: '成功',
                  message: '修改公告"' + this.form.noticeTitle + '"成功'
                });
                this.doing = false;
                this.$emit('change', res.data);
                this.$emit('right-close');
              }).catch(() => {
                this.$notify.error({
                  duration: 2000,
                  message: '修改公告' + this.form.name + '"失败'
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
      }
    }
  };
</script>
