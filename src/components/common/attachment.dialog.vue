<style lang="less">
  .attachment-dialog {
    .el-dialog {
      width: 100%;
      transform: none;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.5);
      box-shadow: none;
      margin-bottom: 0;
    }
    .el-dialog__header {
      padding-bottom: 10px;
      position: relative;
      top: -10px;
      z-index: 200;
      background: #fff
    }

    .el-dialog__body {
      position: absolute;
      top: 37px;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0;
      .dialog-image-rap {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        img {
          max-width: 95vh;
          max-height: 95vh;
        }
      }
      .img-tools {
        position: absolute;
        bottom: 35px;
        right: 35px;
      }
      .attachment-doc-body {
        height: 100%;
      }
    }

  }

</style>
<template>
  <el-dialog v-model="dialogVisible" :title="Attachment.attachmentFileName" :before-close="close"
             class="attachment-dialog"
             :class="{'docview':type=='doc','img-view':type=='image'}" top="0">
    <div @click.stop="closeDialog" style="height:100%;width:100%;">
      <div v-if="type=='image'" class="dialog-image-rap">
        <img :src="fileUrl" alt='' :style="'transform: rotate('+currentZ+'deg)'" @click.stop="stop">
      </div>
      <div class="img-tools" v-if="type=='image'" @click.stop="stop">

        <el-button type="default" @click.stop="changeZ(1)"><i class="c-erp-font c-erp-font-rotate"></i>
        </el-button>

      </div>
      <div v-if="type=='doc'" class="attachment-doc-body" @click.stop="stop">
        <iframe :src="docViewUrl" width="100%" height="100%" frameborder="0"></iframe>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import {http} from '../../resources';

  function download(src, fileName) {
    let $a = document.createElement('a');
    $a.setAttribute('href', src);
    $a.setAttribute('download', fileName);

    let evObj = document.createEvent('MouseEvents');
    evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
    $a.dispatchEvent(evObj);
  }

  export default {
    data() {
      return {
        dialogVisible: false,
        Attachment: {},
        type: '',
        currentZ: 0
      };
    },
    computed: {
      currentId: function () {
        return this.$store.state.attachmentDialog.attachmentId;
      },
      fileUrl: function () {
        return this.Attachment.attachmentStoragePath;
      },
      docViewUrl: function () {
        return 'http://docview.tinyapp.top:81/view/url?url=' + encodeURIComponent(this.Attachment.attachmentStoragePath);
      },
      stateDialogVisible: function () {
        return this.$store.state.attachmentDialog.open;
      }
    },
    watch: {
      stateDialogVisible: function (val) {
        if (val === true) {
          this.showAttachment();
        }
      },
      currentId: function () {
        this.currentZ = 0;
        this.getAttachment();
      }
    },

    methods: {
      getAttachment: function () {
        if (this.currentId) {
          http.get('omsAttachment/' + this.currentId).then(res => {
            this.Attachment = res.data;
            this.$nextTick(function () {
              this.showAttachment();
            });
          });
        }
      },
      showAttachment: function () {
        if (!this.Attachment.attachmentStoragePath) {
          return false;
        }
        this.type = this.getType();
        if (this.type === 'image' || this.type === 'doc') {
          this.dialogVisible = true;
        } else {
          download(this.Attachment.attachmentStoragePath, this.Attachment.attachmentFileName);
          /* let fileLink = document.getElementById("fileDownLoadRap");
           fileLink.parentNode.setAttribute("href", this.Attachment.attachmentStoragePath);
           fileLink.click();*/
        }
      },
      getType: function () {
        let type = '';
        let url = this.Attachment.attachmentStoragePath;
        let images = ['jpg', 'png', 'gif', 'jpeg'];
        let docs = ['txt', 'doc', 'docx', 'pdf', 'xls', 'xlsx', 'ppt', 'pptx'];
        if (url) {
          type = url.substring(url.lastIndexOf('.'));
        }
        if (type) {
          type = type.substring(1).toLowerCase();
        }
        if (docs.indexOf(type) !== -1) {
          type = 'doc';
        } else if (images.indexOf(type) !== -1) {
          type = 'image';
        }
        return type;
      },
      close: function () {
        this.$store.commit('closeAttachmentDialog');
        this.dialogVisible = false;
      },
      changeZ: function (type) {
        this.currentZ = (this.currentZ + type * 90) % 360;
      },
      stop: function () {
      },
      closeDialog: function () {
        this.$store.commit('closeAttachmentDialog');
        this.dialogVisible = false;
      }
    }
  };
</script>
