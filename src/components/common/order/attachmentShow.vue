<style lang="less" scoped>
  .qp-box {
    &.accessory {
      margin-bottom: 20px;
      border: 1px solid #eee;
      border-radius: 5px;
      padding: 0 20px 10px 20px;
      h2 {
        line-height: 20px;
        margin: 10px 0;
        padding: 0;
      }
      .accessory-item {
        margin-top: 10px;
      }
    }
    .accessory-list {
      .show-list {
        .list-item {
          .attachment-delete, .download-link {
            float: right;
            padding: 0 10px;
            color: #fff;
            font-size: 16px;
          }
          &:hover .attachment-delete {
            color: red;
          }
          &:hover .download-link {
            color: #1c8de0;
          }
        }
      }
    }
  }

  .exception-attachment {
    .show-list {
      .list-item {
        position: relative;
        line-height: 20px;
        padding-top: 3px;
        padding-bottom: 3px;
        border: 0;
        .attachment-span, .download-link {
          float: right;
          padding: 0 10px;
          color: #fff;
        }
        &:hover .attachment-span {
          color: red;
        }
        &:hover .download-link {
          color: #1c8de0;
        }
      }
    }
  }

</style>
<template>
  <div>
    <div class="qp-box accessory" v-if="attachmentClass === 'accessory' ">
      <h2>
        {{ label }}
      </h2>
      <perm :label="currentAttachmentRight.watch">
        <div class="accessory-list">
          <div v-if="orderAttachment.length">
            <ul class="show-list">
              <li class="list-item" v-for="item in orderAttachment" :key="item.attachmentId"
                  @click="showAttachment(item)">{{ item.attachmentFileName }}
                <perm :label="currentAttachmentRight.remove">
                   <span class="attachment-delete" @click.stop="deleteAttachMentManageItem(item)"
                         v-show="isShowDeleteButton">
                     <i class="oms-font oms-font-delete"></i>
                    </span>
                </perm>
                <perm :label="currentAttachmentRight.download">
              <span class="attachment-delete">
                <a class="download-link" :href="item.attachmentStoragePath" @click.stop=""
                   :download="item.attachmentFileName">
                  <i class="oms-font oms-font-download"></i>
                </a>
              </span>
                </perm>
              </li>
            </ul>
          </div>
          <div v-else>
            <span>无附件</span>
          </div>
        </div>
      </perm>
      <div class="accessory-item" v-show="isShowAttachmentUpload">
        <perm :label="currentAttachmentRight.upload">
          <oms-upload-relation :formData="{objectId:objId,objectType:objectType}" :showFileList="false"
                               @change="changeAttachmentFiles"></oms-upload-relation>
        </perm>
      </div>
    </div>
    <div class="exception-attachment" v-else-if="attachmentClass === 'exception-attachment' ">
      <ul class="show-list">
        <li class="list-item" v-for="item in orderAttachment" :key="item.attachmentId"
            @click="showAttachment(item)">
          {{ item.attachmentFileName }}
          <perm :label="currentAttachmentRight.remove">
              <span class="attachment-span" @click.stop="deleteAttachMentManageItem(item)">
                 <i class="oms-font oms-font-delete"></i>
              </span>
          </perm>
          <span class="attachment-span">
              <a class="download-link" :href="item.attachmentStoragePath "
                 :download="item.attachmentFileName" @click.stop="">
                <i class="oms-font oms-font-download"></i>
              </a>
         </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { OmsAttachment } from '@/resources';

  export default {
    props: {
      label: {
        type: String,
        default: ''
      },
      orderAttachment: {
        required: true,
        type: Array,
        default: function () {
          return [];
        }
      },
      objectType: {
        type: String,
        default: ''
      },
      objectId: {
        type: String,
        default: ''
      },
      currentOrder: {
        type: Object,
        default: function () {
          return {};
        }
      },
      attachmentRight: {
        type: Object,
        default: function () {
          return {};
        }
      },
      isShowUpload: {
        type: Boolean,
        default: true
      },
      attachmentClass: {
        type: String,
        default: 'accessory'
      }
    },
    computed: {
      isShowDeleteButton: function () {
        let isShow = false;
        let state = this.currentOrder.state;
        if (state === '0' || state === '3') isShow = true;
        return isShow;
      },
      isShowAttachmentUpload: function () {// 是否显示附件上传
        let isShow = true;
        let state = this.currentOrder.state;
        if (state === '4' || state === '7' || state === '8' || state === '6') {
          isShow = false;
        }
        return isShow && this.isShowUpload;
      },
      objId () {
        let id = '';
        if (this.currentOrder.id) id = this.currentOrder.id;
        if (this.objectId) id = this.objectId;
        return id;
      },
      currentAttachmentRight () {
        return Object.assign({upload: '', watch: '', download: '', remove: ''}, this.attachmentRight);
      }
    },
    methods: {
      showAttachment: function (item) {// 显示预览
        this.$store.commit('changeAttachment', item.attachmentId);
      },
      deleteAttachMentManageItem: function (item) {// 删除附件管理附件
        OmsAttachment.delete(item.attachmentId).then(() => {
          this.$emit('refreshAttachment');
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功删除附件'
          });
        });
      },
      changeAttachmentFiles: function () {// 附件列表改变时，触发
        this.$emit('refreshAttachment');
      }
    }
  };
</script>
