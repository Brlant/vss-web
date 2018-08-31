<style lang="scss" scoped>
  .list-item {
    position: relative;
    line-height: 25px;
    padding-top: 0;
    padding-bottom: 0;
    border: 0;
    .download-link {
      display: none;
    }
    &:hover .download-link {
      display: block;
    }
  }

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
    <li class="list-item list_flex" v-for="attachment in attachmentList"
        :style="{'line-height':attachment.showEdit?'50px':'25px'}">
      <div class="attachment-name" v-show="!attachment.showEdit" @click="handlePreview(attachment)">
        {{attachment.attachmentFileName}}
      </div>
      <div v-show="attachment.showEdit">
        <el-input v-model="attachment.attachmentFileName" placeholder="请输入附件名称" autosize
                  @blur="editAttachmentName(attachment)"></el-input>
      </div>
      <div>
        <perm :label="perm">
          <a :href="attachment.attachmentStoragePath "
             class="download-link pull-right" :download="attachment.attachmentFileName" @click.stop="">
            <i class="el-icon-t-download"></i>
          </a>
        </perm>
        <perm label="erp-attachment-name-update">
          <a href="#" class="download-link pull-right" @click.stop.prevent="editName(attachment)">
            <i class="el-icon-t-edit"></i>
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
      editAttachmentName: function (item) {
        if (item && !item.attachmentFileName) {
          this.$notify.warning({
            duration: 2000,
            message: '附件文件名不能为空！'
          });
          return;
        }
        // 修改附件名称
        let param = {'attachmentFileName': item.attachmentFileName};
        let index = this.attachmentList.indexOf(item);
        this.$http.put(`/omsAttachment/${item.attachmentId}/name`, param).then(res => {
          this.$notify.success({
            message: '修改附件文件名成功'
          });
          this.attachmentList.splice(index, 1, res.data);
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '修改附件文件名失败'
          });
        });
      },
      editName: function (val) {
        if (val && !val.attachmentFileName) {
          this.$notify.warning({
            duration: 2000,
            message: '附件文件名不能为空！'
          });
          return;
        }
        let index = this.attachmentList.indexOf(val);
        val.showEdit = !val.showEdit;
        this.attachmentList.splice(index, 1, val);
      },
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
          this.attachmentList.forEach(val => {
            val.showEdit = false;
          });
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
