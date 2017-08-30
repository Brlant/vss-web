<template>
  <div>
    <el-upload
      class="avatar-uploader"
      :action="'/omsAttachment' | formatImgUrl"
      :show-file-list="false"
      name="upfile"
      :on-success="handleAvatarSuccess"
      :on-error="error"
      :before-upload="beforeAvatarUpload"
      :on-change="changePhoto">
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
  export default {
    props: ['photoUrl'],
    name: 'omsPhotoUpload',
    data() {
      return {
        imageUrl: this.photoUrl
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
        const isJPG = file.type === 'image/jpeg';

        const isPng = file.type === 'image/png';

        if (!isJPG && !isPng) {
          this.$message.error('上传图片只能是JPG或者PNG格式!');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isLt10M) {
          this.$message.error('上传图片大小不能超过 10MB!');
        }
        return isPng || isJPG && isLt10M;
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

