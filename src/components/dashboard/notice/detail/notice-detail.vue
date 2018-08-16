<style lang="scss" scoped>
  $leftWidth: 180px;
  .content-part {
    .content-left {
      width: $leftWidth;
      text-align: center;
    }
    .content-right {
      > h3 {
        left: $leftWidth;
      }
      left: $leftWidth;
    }
    .page-main-body {
      font-size: 16px;
    }
  }

</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-part">
        <div class="content-left">
          <h2 class="clearfix right-title">公告详情</h2>
        </div>
        <div class="content-right content-padding">
          <div class="page-main-body">
          <el-row>
            <el-col :span="3" class="text-right">
              公告标题：
            </el-col>
            <el-col :span="21">
              {{ currentItem.noticeTitle }}
            </el-col>
          </el-row>
            <el-col>
              <el-col>发布人:{{currentItem.createdBy}}</el-col>
            </el-col>
            <el-col>发布时间:{{currentItem.issuedTime|date}}</el-col>
          <el-row>
            <el-col :span="3" class="text-right">
              公告内容：
            </el-col>
            <el-col :span="21">
              <pre>{{ currentItem.noticeContent }}</pre>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="text-right">
              附件：
            </el-col>
            <el-col :span="21">
              <attachment-lists :attachmentIdList="currentItem.attachmentIdList" :objectId="currentItem.noticeId"
                                :objectType="'notice'"></attachment-lists>
            </el-col>
          </el-row>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>
<script>
  import attachmentLists from '../../../common/attachmentList.vue';
  export default {
    components: {
      attachmentLists
    },
    props: {
      currentItem: {
        type: Object
      }
    },
    data () {
      return {
      };
    },
    computed: {
    },
    watch: {

    },
    methods: {

      }
  };
</script>

