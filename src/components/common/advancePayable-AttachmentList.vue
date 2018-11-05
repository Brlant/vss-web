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
</style>
<template>
  <div>
    <ul class="show-list">
      <li class="list-item list_flex" v-for="attachment in attachmentList" @click="handlePreview(attachment)">
        <div class="attachment-name">
          <el-tooltip effect="dark" :content="attachment.attachmentFileName" placement="top">
            <span>
                {{attachment.attachmentFileName}}
            </span>
          </el-tooltip>
        </div>
      </li>
    </ul>
  </div>
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
        dialogFormVisible: false,
        form: {},
        formLabelWidth: '120px',
        doing: false
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
      }
    },
    props: ['objectId', 'objectType', 'attachmentIdList', 'permission', 'deletePermission'],
    methods: {
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
