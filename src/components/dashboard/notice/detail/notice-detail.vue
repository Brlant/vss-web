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
    p {
      white-space: pre-wrap;
      text-indent: 2em;
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
          <oms-row label="公告标题" :span="4">{{ form.noticeTitle }}</oms-row>
        </el-row>
        <el-row style="margin-bottom:0">
          <el-col :span="12">
            <oms-row label="发布人">
              {{form.createdBy}}
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="发布时间">
              {{form.issuedTime|date}}
            </oms-row>
          </el-col>
        </el-row>
        <el-row style="margin-bottom:0">
          <el-col :span="24">
            <el-row>
              <p>{{ form.noticeContent }}</p>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="3" class="text-right">
            附件：
          </el-col>
          <el-col :span="21">
            <attachment-lists :attachmentIdList="attachmentIdList" :objectId="form.noticeId"
                              :objectType="'notice'"></attachment-lists>
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
      formItem: {
        type: Object
      }
    },
    data () {
      return {
        attachmentIdList: [],
        form: {}
      };
    },
    computed: {},
    watch: {
      formItem: {
        handler (val) {
          this.form = val;
        }
      }
    },
    methods: {}
  };
</script>

