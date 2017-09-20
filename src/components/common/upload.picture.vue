<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :show-file-list="false"
      name="upfile"
      :on-success="handleAvatarSuccess"
      :on-error="error"
      :before-upload="beforeAvatarUpload"
      :on-change="changePhoto"
      :on-remove="handleRemove"
      :data="uploadData">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else="" class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<script>
  import {http, OmsAttachment} from '../../resources';

  export default {
    props: ['photoUrl'],
    name: 'omsPhotoUpload',
    data() {
      return {
        imageUrl: this.photoUrl,
        uploadData: {},
        uploadUrl: '/omsAttachment'
      };
    },
    watch: {
      photoUrl: function (val) {
        if (!val) {
          this.imageUrl = '';
        } else {
          this.imageUrl = val;
        }
      }
    },
    methods: {
      handleRemove(file) {
        OmsAttachment.delete(file.attachmentId).then(() => {
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
      changePhoto: function (photo) {
        this.$emit('change', photo.response);
      },
      handleAvatarSuccess(file) {
        this.imageUrl = file.url;
        this.$notify.success({
          duration: 2000,
          message: '上传图片成功'
        });
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
        });
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

