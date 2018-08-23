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
      padding: 5px 20px 0 20px;
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

  .border-show {
    height: 20px;
    border-bottom: 1px solid #777777;
    opacity: 0.2;
    margin-left: 40px;
    margin-right: 40px;
    margin-bottom: 20px;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">公告详情</h2>
      </div>
      <div class="content-right">
        <el-row>
          <el-col :span="24" style=" padding: 0 30px 0 0">
            <h3>{{ form.noticeTitle }}</h3>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
          </el-col>
          <el-col :span="6">
            发布人：{{form.createdBy}}
          </el-col>
          <el-col :span="6">
            发布时间：{{form.issuedTime|date}}
          </el-col>
        </el-row>
        <div class="border-show"></div>
        <el-row>
          <el-col :span="24">
              <nl2br :content="form.noticeContent"></nl2br>
          </el-col>
        </el-row>
        <div class="border-show"></div>
        <el-row>
          <el-col :span="3" class="text-right">
            附件：
          </el-col>
          <el-col :span="21">
            <attachment-lists :attachmentIdList="attachmentIdList" :objectId="form.noticeId" :objectType="'notice'"></attachment-lists>
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

