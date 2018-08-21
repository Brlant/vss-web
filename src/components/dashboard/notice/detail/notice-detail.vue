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
    .oms-row {
      margin-bottom: 10px;
    }
  }

</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">公告详情</h2>
      </div>
      <div class="content-right content-padding">
        <el-row style="margin-bottom: 0">
          <oms-row label="公告标题" :span="4">{{ currentItem.noticeTitle }}</oms-row>
        </el-row>
        <el-row style="margin-bottom:0">
          <el-col :span="12">
            <oms-row label="发布人">
              {{currentItem.createdBy}}
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="发布时间">
              {{currentItem.issuedTime|date}}
            </oms-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:0">
          <el-col :span="12">
           <oms-row>
             <pre>{{ currentItem.noticeContent }}</pre>
           </oms-row>
          </el-col>
        </el-row>
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
    data() {
      return {};
    },
    computed: {},
    watch: {},
    methods: {}
  };
</script>

