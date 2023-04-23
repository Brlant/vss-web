<template>
  <el-dialog
    :before-close="handleClose"
    :visible.sync="dialogVisible"
    append-to-body
    title="撤销"
    width="500px">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="原因" prop="applicationReason">
        <el-input v-model="form.applicationReason" type="textarea" :rows="1"></el-input>
      </el-form-item>
      <el-form-item label="追溯码" prop="traceCode">
        <!-- <div v-for="(item,index) in form.detailDtoList" :key="index">
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
        </div> -->
        <el-input v-model="form.traceCode" type="textarea" :rows="5" placeholder="可以录入多个追溯码，追溯码之间可以通过逗号分隔、空格分隔、换行分隔"></el-input>
      </el-form-item>
      <el-row style="margin-bottom:15px">
        <el-col :span="6" :offset="3">
          <el-button type="primary" @click="reviewTraceCode" :loading="doing">复核追溯码</el-button>
        </el-col>
        <el-col :span="6" :offset="1">
          <el-button  type="primary" plain @click="batchRemove">批量移除追溯码</el-button>
        </el-col>
      </el-row>
      <!-- 复核结果 -->
      <el-row style="margin-bottom:5px">
        <el-col :span="6" >复核结果</el-col>
      </el-row>
      <el-table :data="form.detailDtoList"
      style="width: 100%;margin-bottom:15px">
        <el-table-column
        prop="code"
        label="追溯码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
          <el-tag v-if="!scope.row.errorFlag" type="success">正常</el-tag>
          <el-tag v-else type="danger">错误</el-tag>
          <span v-if="scope.row.errorFlag">（错误信息: {{scope.row.exceptionResultTitle}}）</span>
        </template>
      </el-table-column>
      <el-table-column
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button type="danger" size="mini" @click="removeCode(scope.row)">删除</el-button>
      </template>
      </el-table-column>
      </el-table>
      <el-form-item label="数量">
        <el-input-number v-model="form.cancelCount" :min="1"></el-input-number>
      </el-form-item>
      <el-form-item label="上传附件" prop="fileIdList">
        <oms-el-upload
          :file-list="fileList"
          :on-remove="handleRemove"
          :onPreview="onPreview"
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
  props:{
    // 接受父级组件的显示标记，用于被watch
    showFlag: {
      type: Boolean,
      default:false,
    },
    orderId: {
      type: String,
      default: ''
    },
    injectionTaskId: {
      type: String,
      default: ''
    },
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
        // TODO
        traceCode:'', // 追溯码
        cancelCount: 1,//数量
        // 复核结果
        detailDtoList: [],//追溯码
        fileIdList: [],//附件
        injectionTaskId: '',//订单明细id
        orderId: '',//订单id
      },
      rules: {
        applicationReason: [{required: true, message: '请输入原因', trigger: 'blur'}],
        traceCode: [{required: true, message: '请输入追溯码', trigger: 'blur'}],
        fileIdList: [{required: true, message: '请选择文件'},],
        // detailDtoList: [{required: true, validator: checkCode, trigger: 'change'}], 
      },
      doing: false,
      fileList: [],
      dialogVisible: false
    };
  },
  watch:{
    showFlag(val){
      if(val){
        this.dialogVisible = val
        this.form.orderId = this.orderId
        this.form.injectionTaskId=this.injectionTaskId
        this.queryCodeList()
      }
    },
  },
  // mounted(){
  //   // 初始查询复核追溯码列表
  //   this.$nextTick(()=>{
  //     console.log(this.form.orderId,'mounted');
  //     this.queryCodeList()
  //   })
  // },
  methods: {
    onPreview(file) {
      this.$store.commit('changeAttachment', {currentId: file.response.attachmentId, attachmentList: this.fileList});
    },
    addCode() {
      this.form.detailDtoList.push({code: ''});
    },
    eddCode(index) {
      this.form.detailDtoList.splice(index, 1);
    },
    handleClose() {
      this.form = {
        applicationReason: '', //撤销原因
        traceCode:'', // 追溯码
        cancelCount: 0,//数量
        detailDtoList: [],//追溯码
        fileIdList: [],//附件
        injectionTaskId: '',//订单明细id
        orderId: '',//订单id
      };
      this.fileList = [];
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
      this.dialogVisible = false;
      console.log('111');
      // 触发父组件关闭弹窗
      this.$parent.handleClose();
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
    // 复核追溯码
    reviewTraceCode(){
      if (this.doing) return;
      let codeList = this.form.traceCode.split(/[\n,\s，]/g).filter(f => f);
      if (!codeList.length) return this.$notify.info('请输入追溯码');
      this.doing = true;
      let arg = {
        orderId:this.form.orderId,
        codeList:codeList
      }
      this.$http.post(`/erp-breakage/revokeBreakageReview`, arg).then(res => {
        // this.form.traceCode = '';
        this.doing = false;
        this.queryCodeList();
      }).catch(error => {
        this.doing = false;
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '提交失败'
        });
      });
    },
    queryCodeList() {
      this.$http.get(`/erp-order/break/${this.form.orderId}/code`).then(res => {
        res.data.errorCodeList.forEach(i => i.errorFlag = true);
        this.form.detailDtoList = res.data.packageDtoList.concat(res.data.errorCodeList);
      });
    },
    /**
     * 批量移除追溯码
     * **/
    batchRemove(){
      let codeList = this.form.traceCode.split(/[\n,\s，]/g).filter(i => i);
      if(codeList.length){
        this.$confirm("确认要全部清空?", "提示", {type: "warning"})
          .then(async () => {
            this.form.traceCode = ''
          })
      }else {
        this.$notify.info({
          title: '提示',
          message: '暂无追溯码数据',
          duration: '2000',
          onClose: function () {

          }
        });
      }
    },
    // 删除
    removeCode(item){
      this.$http.delete(`/review-code/${item.logId}`).then(res => {
        this.queryCodeList();
      });
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 复核结果列表不能为空(校验)
          if(this.form.detailDtoList.length == 0){
            this.$message.warning('请先复核追溯码')
            return
          }
          let arg = {
            applicationReason: this.form.applicationReason, //撤销原因
            cancelCount: this.form.cancelCount,//数量
            detailDtoList: this.form.detailDtoList,//追溯码
            fileIdList: this.form.fileIdList,//附件
            injectionTaskId: this.form.injectionTaskId,//订单明细id
            orderId: this.form.orderId,//订单id
          }
          this.doing = true;
          demand.reportedUndo(arg).then(res => {
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

<style  scoped>
.el-form{
  max-height: 620px !important;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
