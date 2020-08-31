<template>
  <el-dialog
    title="撤销"
    append-to-body
    :visible.sync="dialogVisible"
    width="500px"
    :before-close="handleClose">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="原因" prop="applicationReason">
        <el-input type="textarea" v-model="form.applicationReason"></el-input>
      </el-form-item>
      <el-form-item label="追溯码" prop="detailDtoList">
        <div v-for="(item,index) in form.detailDtoList" :key="index">
          <el-row style="padding-bottom: 4px">
            <el-col :span="20">
              <el-input v-model="item.code"></el-input>
            </el-col>
            <el-col :span="4" style="padding-left: 8px">
              <i class="el-icon-circle-plus-outline" style="font-size: 20px;color: #409EFF;cursor: pointer"
                 @click="addCode"></i>
              <i class="el-icon-remove-outline" style="font-size: 20px;color: red;cursor: pointer"
                 @click="eddCode(index)" v-show="index!==0"></i>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="数量">
        <el-input-number v-model="form.cancelCount" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="上传附件" prop="fileIdList">
        <oms-el-upload
          class="avatar-user-uploader"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
          action="/omsAttachment">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </oms-el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="submit" :loading="doing">提 交</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import OmsElUpload from '@/components/common/upload/src/index.vue';
  import {demand} from '@/resources';

  export default {
    name: 'undo',
    components: {
      OmsElUpload
    },
    data() {
      const checkCode = (rule, value, callback) => {
        if (value.length > 1) {
          let isSwitch = true;
          value.forEach(g => {
            if (!g.code) {
              isSwitch = false;
            }
          });
          isSwitch ? callback() : callback('请正确填写追溯码');
          return;
        }
        if (value.length === 1) {
          value[0].code ? callback() : callback('请填写追溯码');
          return;
        }
        callback();
      };
      return {
        form: {
          applicationReason: '', //撤销原因
          cancelCount: 1,//数量
          detailDtoList: [{code: ''}],//追溯码
          fileIdList: [],//附件
          injectionTaskId: '',//订单明细id
          orderId: '',//订单id
        },
        rules: {
          applicationReason: [{required: true, message: '请输入原因', trigger: 'blur'}],
          fileIdList: [{required: true, message: '请选择文件'},],
          detailDtoList: [{required: true, validator: checkCode, trigger: 'change'}],
        },
        doing: false,
        fileList: [],
        dialogVisible: false
      };
    },
    methods: {
      addCode() {
        this.form.detailDtoList.push({code: ''});
      },
      eddCode(index) {
        this.form.detailDtoList.splice(index, 1);
      },
      handleClose() {
        this.dialogVisible = false;
        this.form = {
          applicationReason: '', //撤销原因
          cancelCount: 0,//数量
          detailDtoList: [{code: ''}],//追溯码
          fileIdList: [],//附件
          injectionTaskId: '',//订单明细id
          orderId: '',//订单id
        };
        this.fileList = [];
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      },
      handleAvatarSuccess(file) {
        this.form.fileIdList.push(file.attachmentId);
      },
      handleRemove(file) {
        this.form.fileIdList = this.form.fileIdList.filter(f => f !== file.response.attachmentId);
      },
      show() {
        this.dialogVisible = true;
      },
      submit() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.doing = true;
            demand.reportedUndo(this.form).then(res => {
              this.doing = false;
              this.handleClose();
            }).catch(error => {
              this.doing = false;
              this.$notify.error({
                message: error.response && error.response.data && error.response.data.msg
              });
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
