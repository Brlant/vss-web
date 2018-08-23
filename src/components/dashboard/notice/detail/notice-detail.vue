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
    height: 10px;
    border-bottom: 1px solid #777;
    opacity: .2;
    /* margin-left: 40px; */
    /* margin-right: 40px; */
    margin-bottom: 10px;
  }

  .card-box .card-box-body .el-row {
    border-bottom: 0 solid #eee;
    padding-top: 8px;
    padding-bottom: 8px;
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">公告详情</h2>
        <ul>
          <li class="text-center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;">
            <el-button @click.prevent.stop="doClose">关闭
            </el-button>
          </li>
        </ul>
      </div>
      <div class="content-right">
        <el-row>
          <el-col :span="24" style=" padding: 0 30px 0 0">
            <h2 class="text-center">{{ form.noticeTitle }}</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="text-center">
              发布人：{{form.createdBy}}
              <span style="padding-left: 20px">发布时间：{{form.issuedTime|date}}</span>
            </div>
          </el-col>
        </el-row>
        <div class="border-show"></div>
        <el-row>
          <el-col :span="24">
            <nl2br :content="form.noticeContent"></nl2br>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2"><span class="attachment-list-item">附件：</span></el-col>
          <el-col :span="22">
            <attachment-lists :attachmentIdList="attachmentIdList" :objectId="form.noticeId"
                              :objectType="'notice'"></attachment-lists>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <div style="height: 50px"></div>
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
    methods: {
      doClose: function () {
        this.$emit('right-close');
      }
    }
  };
</script>

