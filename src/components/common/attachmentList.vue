<style lang="scss" scoped>


  .list_flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .attachment-name {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
  }
</style>
<template>
  <ul class="show-list">
    <li class="attachment-list-item list_flex" v-for="attachment in attachmentList" @click="handlePreview(attachment)">
      <div class="attachment-name">
        {{attachment.attachmentFileName}}
      </div>
      <div>
        <perm :label="perm">
          <a :href="attachment.attachmentStoragePath "
             class="download-link pull-right" :download="attachment.attachmentFileName" @click.stop="">
            <i class="el-icon-t-download"></i>
          </a>
        </perm>
        <perm :label="deletePermission">
          <a href="#" class="download-link pull-right" @click.stop.prevent="handleRemove(attachment)">
            <i class="el-icon-t-delete"></i>
          </a>
        </perm>
      </div>
    </li>
  </ul>
</template>
<script>
  import {OmsAttachment} from '../../resources';

  export default {
    data () {
      return {
        object: {
          objectId: this.objectId,
          objectType: this.objectType
        },
        attachmentList: [],
        perm: this.permission
      };
    },
    watch: {
      objectId: function (val) {
        this.object.objectId = val;
        this.getFileList();
      },
      objectType: function (val) {
        this.object.objectType = val;
      },
      attachmentIdList: function () {
        this.getFileList();
      },
      perm: function (val) {
        this.perm = val;
      }
    },
    props: ['objectId', 'objectType', 'attachmentIdList', 'permission', 'deletePermission'],
    methods: {
      handleRemove (attachment) {
        if (!attachment) {
          return;
        }
        this.$confirm('确认删除附件"' + attachment.attachmentFileName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          OmsAttachment.delete(attachment.attachmentId).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功删除附件' + attachment.attachmentFileName + '"'
            });
            this.$emit('delete-change', this.attachmentList);
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '删除失败'
            });
          });
        });
      },
      getFileList: function () {
        if (!this.object.objectId) return;
        OmsAttachment.queryOneAttachmentList(this.object.objectId, this.object.objectType).then(res => {
          this.attachmentList = res.data;
        });
      },
      handlePreview (file) {
        this.$store.commit('changeAttachment', {currentId: file.attachmentId, attachmentList: this.attachmentList});
      }
    },
    mounted () {
      this.getFileList();
    }
  };
</script>
