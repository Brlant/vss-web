<template>
  <div>
    <upload-list :list-type="type" :files=uploadingFiles v-if="!showFileList"
                 style="padding-bottom:10px;" @remove="cancelUpload"></upload-list>
    <el-upload
      class="upload-demo"
      ref="upload"
      name="file"
      :action="uploadUrl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileLists"
      :on-change="changeFile"
      :on-success="success"
      :on-error="error"
      :before-upload="beforeAvatarUpload"
      :list-type="type"
      :show-file-list="showFileList"
      :multiple="multiple"
      :on-progress="showProgress"
      :data="uploadData">
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
    </el-upload>

  </div>
</template>

<script>
  import {http} from '../../resources';
  import UploadList from '@/components/common/upload.file.list.vue';

  export default {
    name: 'omsUpload',
    components: {UploadList},
    props: {
      fileList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      type: {
        type: String,
        default: 'text'
      },
      showFileList: {
        type: Boolean,
        default: true
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        fileLists: this.fileList,
        dialogImageUrl: '',
        dialogVisible: false,
        uploadData: {},
        uploadUrl: '/omsAttachment',
        uploadingFiles: []
      };
    },
    watch: {
      fileList: function (val) {
        val.forEach(file => {
          file.url = file.attachmentStoragePath;
          file.name = file.attachmentFileName;
        });
        this.fileLists = val;
      }
    },

    methods: {
      changeFile: function (file, fileList) {
        if (file.response) {
          file.attachmentId = file.response.attachmentId;
          file.attachmentFileName = file.response.fileName;
        }
        this.$emit('change', fileList);
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        // 将附件从列表中移除
        let index = fileList.indexOf(file);
        fileList.splice(index, 0);
        this.$emit('change', fileList);
      },
      handlePreview(file) {
        this.$store.commit('changeAttachment', file.attachmentId);
      },
      beforeAvatarUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          this.$notify.error({
            duration: 2000,
            message: '上传附件大小不能超过 10MB!'
          });
          return false;
        }
        let data = {objectId: '', objectType: '', fileName: file.name};
        return http.post('/qingstor/pre', data).then(res => {
          this.uploadUrl = res.data.apiUrl;
          this.uploadData = {
            policy: res.data.policy,
            access_key_id: res.data.accessKeyId,
            signature: res.data.signature,
            key: res.data.key,
            redirect: res.data.redirect
          };
          this.uploadingFiles.push(file);
        });
      },
      success(response, file, fileList) {
        this.uploadingFiles = this.uploadingFiles.filter(item => item.uid !== file.uid);
        if (response) {
          this.$notify.success({
            duration: 2000,
            message: '上传附件成功'
          });
        } else {
          this.$notify.error({
            duration: 2000,
            message: '上传附件失败'
          });
        }
      },
      error(err) {
        this.$notify.error({
          duration: 2000,
          message: '上传附件失败' + err
        });
      },
      showProgress(event, file, fileList) {
        let index = -1;
        for (let i = 0, len = this.uploadingFiles.length; i < len; i++) {
          if (file.uid === this.uploadingFiles[i].uid) {
            index = i;
          }
        }
        if (index !== -1) {
          this.uploadingFiles.splice(index, 1, file);
        }
      },
      cancelUpload: function (file) {
        this.$refs['upload'].abort(file);
        this.uploadingFiles = this.uploadingFiles.filter(item => item.uid !== file.uid);
      }
    }

  };
</script>
