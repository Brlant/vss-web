<template>
  <div>
    <el-upload
      class="upload-demo"
      ref="upload"
      name="upfile"
      :data="object"
      :action="'/omsAttachment' | formatImgUrl"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileLists"
      :on-change="changeFile"
      :on-success="success"
      :on-error="error"
      :before-upload="beforeAvatarUpload"
      :list-type="type"
      :with-credentials="true"
      :show-file-list="showFileList"
      :multiple="multiple">
      <el-button slot="trigger" size="small" type="primary">{{ uploadName }}</el-button>
      <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
    </el-upload>

  </div>
</template>

<script>
  import {OmsAttachment} from '../../resources';

  export default {
    name: 'omsUploadRelation',

    props: {
      fileList: {
        type: Array,
        default: function () {
          return [];
        }
      },
      objectId: {
        type: String
      },
      objectType: {
        type: String
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
      },
      uploadName: {
        type: String,
        default: '选取文件'
      }
    },

    data() {
      return {
        fileLists: this.fileList,
        object: {
          objectId: this.objectId,
          objectType: this.objectType
        },
        dialogImageUrl: '',
        dialogVisible: false
      };
    },
    watch: {
      fileList: function (val) {
        val.forEach(file => {
          file.url = file.attachmentStoragePath;
          file.name = file.attachmentFileName;
        });
        this.fileLists = val;
      },
      objectId: function (val) {
        this.object.objectId = val;
      },
      objectType: function (val) {
        this.object.objectType = val;
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
      handleRemove(file) {
        OmsAttachment.delete(file.attachmentId).then(() => {
//           let index = this.fileList.indexOf(file);
//           this.fileList.splice(index, 1);
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功删除附件' + file.attachmentFileName + '"'
          });
        }).catch(() => {
          this.$notify.error({
            duration: 2000,
            message: '删除失败'
          });
        });
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
        }
        return isLt10M;
      },
      success(response) {
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
      }
    }

  };
</script>
