<style lang="scss">
.bg-box-all {
  &.RejectionInfo-item {
    padding: 0;
    margin: 0;

    div > .bg-box-title {
      float: right;
    }

    .oms-row {
      margin-bottom: 5px;
    }
  }
}

.comment-part {
  .comment-item {
    border: 1px solid #eee;
    border-radius: 5px;
    margin-bottom: 5px;
    padding-left: 5px;
  }

  .header {
    overflow: hidden;
  }

  .date {
    color: #999;
  }

  .content {
    padding-left: 15px;
  }

  .attachment {
    color: #999;
  }
}
</style>
<template>
  <div>
    <div v-if="loadingData">
      <oms-loading :loading="loadingData"></oms-loading>
    </div>
    <div v-else-if="exceptionDtoList.length===0" class="empty-info">
      暂无异常信息
    </div>
    <div v-else>
      <div v-for="exception in exceptionDtoList" :key="exception.id" @click="setItem(exception)">
        <div v-if="exception.flag">
          <bg-box :title="exception.exceptionName" class="bg-box-all" type="white">
            <div class="clearfix">

              <!--<oms-row :span="4" label="异常环节" class="mb-15">-->
              <!--&lt;!&ndash;<dict :dict-group="'executionBody'" :dict-key="exception.link"></dict>&ndash;&gt;-->
              <!--{{ getOrderStatus(exception.link) }}-->
              <!--</oms-row>-->
              <el-col :span="12" class="mb-15">
                <oms-row :span="8" label="异常环节">{{ getOrderStatus(exception.link) }}</oms-row>
              </el-col>
              <el-col :span="12" class="mb-15">
                <oms-row :span="8" label="创建人">{{exception.creatorName}}</oms-row>
              </el-col>
              <el-col :span="12" class="mb-15">
                <oms-row :span="8" label="创建时间">{{exception.createTime | minute}}</oms-row>
              </el-col>
              <el-col v-show="exception.verifyTime" :span="12" class="mb-15">
                <oms-row :span="8" label="确认人">{{exception.verifierName}}</oms-row>
              </el-col>
              <el-col v-show="exception.verifyTime" :span="12" class="mb-15">
                <oms-row :span="8" label="确认时间">{{exception.verifyTime | time}}
                </oms-row>
              </el-col>
              <oms-row :span="4" class="mb-15 clearfix" label="异常备注">{{exception.description}}</oms-row>
              <!--<oms-row :span="4" label="客户意见" class="mb-15">{{exception.dealDescriptionOrg}} </oms-row>-->

              <oms-row v-if="exception.reasonAttachments &&exception.reasonAttachments.length" :span="4"
                       class="mb-15" label="异常原因附件">
                <attachment-show :attachmentRight="exceptionReasonRight"
                                 :orderAttachment="exception.reasonAttachments"
                                 attachmentClass="exception-attachment"
                                 @refreshAttachment="queryAllExceptionList"></attachment-show>
              </oms-row>
              <!--<oms-row :span="4" label="客户反馈附件" v-if="exception.feedBackAttachments.length" class="mb-15">-->
              <!--<attachment-show :orderAttachment="exception.feedBackAttachments"-->
              <!--:attachmentRight="clientRight"-->
              <!--attachmentClass="exception-attachment"-->
              <!--@refreshAttachment="queryAllExceptionList"></attachment-show>-->
              <!--</oms-row>-->
              <oms-row :span="4" class="mb-15" label="回复">
                <div class="comment-part">
                  <div v-for="item in exception.commentList" class="comment-item">
                    <div class="header">
                      <span> {{ item.creatorName }}</span>
                      <span v-show="item.creatorOrgName">({{item.creatorOrgName}})</span>
                      <span class="date pull-right mr-10"> {{ item.createDate | time}}</span>
                    </div>
                    <el-row class="content">
                      {{item.content}}
                    </el-row>
                    <el-row>
                      <span v-show="item.list.length" class="attachment">附件信息</span>
                      <attachment-show :attachmentRight="exceptionReasonRight"
                                       :orderAttachment="item.list"
                                       attachmentClass="exception-attachment"
                                       @refreshAttachment="queryAllExceptionList"></attachment-show>
                    </el-row>
                  </div>
                </div>
              </oms-row>
            </div>
            <span slot="header-left">

                  </span>
            <span slot="header" class="pull-right">
                    <span v-show="exception.closed">已关闭</span>
                    <span v-show="!exception.closed && exception.exceptionStatus === '1' ">已确认</span>
              <span v-show="!exception.closed && exception.exceptionStatus === '0' ">待确认</span>
                  </span>
            <perm v-show="exception.closed===false &&(exception.exceptionStatus!=='0')"
                  label="quality-exception-edit">
              <div style="margin-top: 10px;margin-bottom: 10px">
                <span style="font-size: 14px">客户意见</span>
                <div class="comment-box" style="margin-top: 4px">
                  <oms-input v-model="exception.deal" :rows="3" placeholder="请输入客户意见"
                             type="textarea"></oms-input>
                  <div style="margin: 10px">
                    <oms-upload-relation :formData="{objectId:'',objectType:'orgDescription'}"
                                         :showFileList="exception.showDel"
                                         @change="changeFiles"></oms-upload-relation>
                  </div>
                </div>
              </div>
            </perm>
            <span>
                    <perm label="quality-exception-confirm">
                        <el-button v-show="exception.exceptionStatus==='0'"
                                   type="primary"
                                   @click="checkException(exception)">确认</el-button>
                    </perm>
                      <perm v-show="exception.closed===false &&(exception.exceptionStatus!=='0')"
                            label="quality-exception-edit">
                        <el-button :disabled="doing" type="primary" @click="saveException(exception)">提交</el-button>
                      </perm>
                     <perm label="quality-exception-close">
                          <el-button v-show="exception.closed===false &&(exception.exceptionStatus!=='0')"
                                     type="primary"
                                     @click="closeException(exception)">关闭异常</el-button>
                      </perm>
                  </span>

          </bg-box>
        </div>
        <div v-if="!exception.flag">
          <bg-box :title="'拒收信息'" class="bg-box-all" type="white">
            <div class="clearfix">
              <oms-row :span="4" class="mb-15" label="执行环节">
                {{ getOrderStatus(exception.link) }}
              </oms-row>
              <el-col :span="12" class="mb-15">
                <oms-row :span="8" label="创建人">{{exception.creatorName}}</oms-row>
              </el-col>
              <el-col :span="12" class="mb-15">
                <oms-row :span="8" label="创建时间">{{exception.createTime | minute}}</oms-row>
              </el-col>
              <oms-row :span="4" class="mb-15" label="拒收原因">{{exception.description}}</oms-row>
              <el-col :span="12" class="mb-15">
                <oms-row :span="8" label="复核人">{{exception.verifierName}}</oms-row>
              </el-col>
              <el-col :span="12" class="mb-15">
                <oms-row :span="8" label="复核时间">{{exception.verifyTime | time}}
                </oms-row>
              </el-col>
              <oms-row :span="4" class="mb-15" label="复核意见">{{exception.reviewComments}}</oms-row>
              <el-col :span="12" class="mb-15">
                <oms-row :span="8" label="处理人">{{exception.submitterName}}</oms-row>
              </el-col>
              <el-col :span="12" class="mb-15">
                <oms-row :span="8" label="处理时间">{{exception.submitTime | time}}
                </oms-row>
              </el-col>
              <oms-row :span="4" class="mb-15" label="客户意见">{{exception.dealDescriptionOrg}}</oms-row>
              <oms-row v-if="exception.reasonAttachments.length" :span="4" class="mb-15" label="拒收原因附件">

                <attachment-show :attachmentRight="rejectionReasonRight"
                                 :orderAttachment="exception.reasonAttachments"
                                 attachmentClass="exception-attachment"
                                 @refreshAttachment="queryAllExceptionList"></attachment-show>
              </oms-row>
              <oms-row v-if="exception.reviewAttachments && exception.reviewAttachments.length" :span="4" class="mb-15"
                       label="拒收复核附件">
                <attachment-show :attachmentRight="reviewReasonRight"
                                 :orderAttachment="exception.reviewAttachments"
                                 attachmentClass="exception-attachment"
                                 @refreshAttachment="queryAllExceptionList"></attachment-show>
              </oms-row>
              <oms-row v-if="exception.feedBackAttachments && exception.feedBackAttachments.length" :span="4"
                       class="mb-15" label="客户反馈附件">
                <attachment-show :attachmentRight="feedBackReasonRight"
                                 :orderAttachment="exception.feedBackAttachments"
                                 attachmentClass="exception-attachment"
                                 @refreshAttachment="queryAllExceptionList"></attachment-show>
              </oms-row>
            </div>
            <span slot="header" class="pull-right">
                  <span v-show="exception.closed">已关闭</span>
                   <span v-show="!exception.closed">未关闭</span>
                </span>
          </bg-box>
        </div>

      </div>

    </div>
  </div>
</template>
<script>
import {http} from '@/resources';
import utils from '@/tools/utils';
import attachmentShow from './attachmentShow.vue';
import bgBox from '@/components/common/bgbox.vue';

export default {
  components: {
    attachmentShow,
    bgBox
  },
  props: {
    currentOrder: {
      required: true,
      type: Object,
      default: function () {
        return {};
      }
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      loadingData: true,
      exceptionDtoList: [], // 异常信息列表
      clientRight: {// 客户反馈附件权限
        remove: 'quality-exception-edit'
      },
      exceptionReasonRight: {// 异常原因附件权限
        remove: 'quality-exception-add'
      },
      rejectionReasonRight: {// 拒收原因附件权限
        remove: 'order-status-rejection'
      },
      reviewReasonRight: {// 拒收复核附件权限
        remove: 'order-status-rejection'
      },
      feedBackReasonRight: {// 拒收客户反馈附件权限
        remove: 'order-status-rejection'
      },
      form: {
        attachmentIdList: []
      },
      doing: false,
      fileList: [],
      currentItem: {}
    };
  },
  watch: {
    index(val) {
      this.loadingData = true;
      this.exceptionDtoList = [];
      if (val === 3) this.queryAllExceptionList();
    }
  },
  methods: {
    changeFiles: function (fileList) {// 上传附件时，获取附加id
      var ids = [];
      fileList.forEach(file => {
        ids.push(file.attachmentId);
      });
      this.currentItem.showDel = true;
      this.currentItem.attachmentIdList = ids;
    },
    setItem(item) {
      this.currentItem = item;
    },
    queryAllExceptionList: function () {// 所有异常信息列表
      if (!this.currentOrder.id) return;
      http.get('/order-exception/orders/' + this.currentOrder.id, {params: {flag: false}}).then(res => {
        res.data.forEach(item => {
          item.showDel = false;
          item.attachmentIdList = [];
          item.dealDescriptionOrg = item.dealDescription;
          item.deal = '';
        });
        this.loadingData = false;
        this.exceptionDtoList = res.data;
      });
    },
    getOrderStatus: function (state) {// 获取执行环节title
      let retstate = '';
      for (let key in utils.inOrderLink) {
        if (state === utils.inOrderLink[key].state) {
          retstate = utils.inOrderLink[key].title;
        }
      }
      return retstate;
    },
    checkException: function (exc) {
      http.put('/quality-exception/' + exc.id + '/confirm').then(res => {
        exc.exceptionStatus = res.data.exceptionStatus;
        exc.verifierName = res.data.verifierName;
        exc.verifyTime = res.data.verifyTime;
      });
    },
    saveException: function (exc) {
      if (!exc.deal) {
        this.$notify({
          duration: 20000,
          message: '请输入客户意见',
          type: 'warning'
        });
        return;
      }
      let object = {
        content: exc.deal,
        attachmentIdList: exc.attachmentIdList,
        objectId: exc.id
      };
      this.doing = true;
      http.put('/order-exception/' + exc.id, object).then(() => {
        this.doing = false;
        this.form.attachmentIdList = [];
        exc.dealDescriptionOrg = exc.dealDescription;
        exc.showDel = false;
        this.$notify({
          duration: 20000,
          message: '客户意见提交成功',
          type: 'success'
        });
        this.queryAllExceptionList();
      });
    },
    closeException: function (exc) {
      if (!exc.dealDescriptionOrg) {
        this.$notify({
          duration: 20000,
          message: '没有客户意见，无法关闭',
          type: 'warning'
        });
        return;
      }
      this.$confirm('确认要关闭 "' + exc.item.name + '"', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.put('/quality-exception/' + exc.id + '/close').then(() => {
          exc.closed = true;
          exc.showDel = false;
        }).catch(error => {
          this.$notify({
            duration: 20000,
            title: '无法关闭',
            message: error.response && error.response.data && error.response.data.msg || '网络异常',
            type: 'error'
          });
        });
      });
    }
  }
};
</script>
