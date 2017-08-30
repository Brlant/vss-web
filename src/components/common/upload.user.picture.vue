<template>
  <div>
    <el-upload
      class="avatar-user-uploader"
      :action="'/omsAttachment' | formatImgUrl"
      :show-file-list="false"
      name="upfile"
      :on-success="handleAvatarSuccess"
      :on-error="error"
      :before-upload="beforeAvatarUpload"
      :on-change="changePhoto">
      <img v-if="imageUrl" :src="imageUrl" class="avatar-user">
      <img v-else src="/static/img/userpic.png" class="avatar-user">
    </el-upload>
  </div>
</template>

<style lang="less" scoped>
  .avatar-user-uploader .el-upload {
    border: 0;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-user-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-user {
    margin-right: 10px;
    border-radius: 50%;
    height: 40px;
    width: 40px;
    border: 1px solid #eee
  }
</style>

<script>
  import {http} from '../../resources';

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
    computed: {
      user: function () {
        return Object.assign({}, {userName: '', userAccount: '', userLastLoginTime: 0}, this.$store.state.user);
      }
    },
    methods: {
      changePhoto: function (photo) {
        this.$emit('change', photo.response);
      },
      handleAvatarSuccess(file) {
        this.imageUrl = file.url;
        this.changPhoto(file);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';

        const isPng = file.type === 'image/png';

        if (!isJPG && !isPng) {
          this.$message.error('头像只能是JPG或者PNG格式!');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;

        if (!isLt10M) {
          this.$message.error('头像大小不能超过 10MB!');
        }
        return isPng || isJPG && isLt10M;
      },
      error(err) {
        this.$notify.error({
          duration: 2000,
          message: '更换头像失败' + err
        });
      },
      changPhoto: function (photo) {
        let user = this.user;
        let obj = {
          id: user.userId,
          photoId: photo.attachmentId
        };
        if (user.userId) {
          http.put('oms/user/' + user.userId + '/icon', obj).then(() => {
            this.user.userIcon = photo.url;
            this.$store.commit('initUser', this.user);
            this.$notify.success({
              title: '成功',
              message: '更换头像成功'
            });
          }).catch(() => {
            this.user.userIcon = '';
            this.$notify.error({
              title: '失败',
              message: '更换头像失败'
            });
          });
        }
      }
    }
  };
</script>

