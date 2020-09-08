<template>
  <el-dialog
    :before-close="handleClose"
    :visible.sync="dialogVisible"
    append-to-body
    title="撤销"
    width="500px">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="原因" prop="applicationReason">
        <el-input v-model="form.applicationReason" type="textarea"></el-input>
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
              <i v-show="index!==0" class="el-icon-remove-outline"
                 style="font-size: 20px;color: red;cursor: pointer" @click="eddCode(index)"></i>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="数量">
        <el-input-number v-model="form.cancelCount" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="上传附件" prop="fileIdList">
        <oms-el-upload
          :file-list="fileList"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          action="/omsAttachment"
          class="avatar-user-uploader">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        </oms-el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button :loading="doing" type="primary" @click="submit">提 交</el-button>
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
      this.$refs.form.validate();
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
