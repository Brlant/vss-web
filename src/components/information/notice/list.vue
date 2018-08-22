<style lang="scss" scoped=''>

  .margin-left {
    margin-left: 15px;
  }

    .order-list-item {
      line-height: 20px;
    }


  .margin-left-right {
    margin-left: 38px;
    margin-right: 38px;
  }

  .power-style-part {
    margin: 12px 0;
    background-color: rgb(238, 238, 238);
    padding: 12px 10px 10px 10px;
  }

  .el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
  }

  .el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
  }

  .page-main-body {
    font-size: 16px;
  }
</style>
<template>
  <div>
    <div class="container">
      <el-row>
        <div class="order-list-status container">
          <div class="status-item" :class="{'active':key==activeStatus}" style="width: 115px"
               v-for="(item,key) in noticeType" @click="changeType(item, key)">
            <div class="status-bg" :class="['b_color_'+key]"></div>
            <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">
            {{item.num}}</span></div>
          </div>

          <!--<span class="pull-right">-->
          <!--<a href="#" class="btn-circle" @click.prevent="searchType"><i-->
          <!--class="el-icon-t-search"></i> </a>-->
          <!--</span>-->
          <span class="pull-right opera-btn" style="margin-top: 8px">
            <span>
               <perm label="notice-add">
                 <a href="#" class="btn-circle" @click.stop.prevent="addType">
                  <i class="el-icon-t-plus"></i>
                 </a>添加
               </perm>
            </span>
          </span>
        </div>
      </el-row>
      <div class="order-list clearfix " style="margin-top: 20px">
        <el-row class="order-list-header">
          <el-col :span="10">
            标题
          </el-col>
          <el-col :span="4">创建人</el-col>
          <el-col :span="4">创建时间</el-col>
          <el-col :span="6">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="showTypeList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item" v-for="item in showTypeList"
               :class="['status-'+activeStatus,{'active':currentItem.noticeId==item.noticeId}]">
            <el-row>
              <el-col :span="10" class="R pt10">
                {{ item.noticeTitle }}
              </el-col>
              <el-col :span="4" class="pt">
                <span>{{ item.createdBy }}</span>
              </el-col>
              <el-col :span="4" class="pt pl7">
                <span>{{ item.createTime | date }}</span>
              </el-col>
              <el-col :span="6" class="opera-btn pl7">
                <div>
                  <perm label="notice-watch">
                     <span @click.prevent="showDetail(item)">
                    <a href="#" class="btn-circle" @click.prevent="showDetail(item)"><i
                      class="el-icon-t-detail"></i></a>
                  查看详情
                     </span>
                  </perm>
                </div>
                <div>
                  <perm label="notice-edit">
                    <span @click.prevent="edit(item)">
                      <a href="#" class="btn-circle" @click.prevent=""><i
                        class="el-icon-t-edit"></i></a>
                        编辑
                  </span>
                  </perm>
                  <perm label="notice-stop" v-show="filters.status === 1 || filters.status === 11">
                     <span @click.prevent="forbid">
                      <a href="#" class="btn-circle" @click.prevent="forbid()"><i
                        class="el-icon-t-verify"></i></a>
                        撤回
                      </span>
                  </perm>
                  <perm label="notice-issue">
                    <span @click.prevent="start()" v-show="!item.availabilityStatus">
                        <a href="#" class="btn-circle" @click.prevent=""><i
                          class="el-icon-t-start"></i></a>
                          发布
                    </span>
                  </perm>
                  <perm label="notice-assign">
                    <span @click.prevent="authorize" v-show="item.availabilityStatus">
                        <a href="#" class="btn-circle" @click.prevent=""><i
                          class="el-icon-t-appoint"></i></a>
                          授权单位
                    </span>
                  </perm>
                </div>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
      <div class="text-center" v-show="true">
        <el-pagination
          layout="prev, pager, next"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="getPageList"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
      <page-right :show="showRight" @right-close="resetRightBox">
        <notice-form :formItem="form" @change="onSubmit" :action="action" :actionType="showRight"
                     @right-close="resetRightBox"></notice-form>
      </page-right>
      <page-right :show="showAuthorization" :css="{'width':'1200px','padding':0}" @right-close="resetRightBox">
        <issue v-bind:formItem="currentItem">
        </issue>
      </page-right>
      <page-right :show="detailShow" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}" >
        <issue-detail   :currentItem="detailItem" ></issue-detail>
      </page-right>
    </div>


  </div>

</template>
<script>
  import noticeForm from './form/form.vue';
  import issue from './form/issue';
  import attachmentLists from '../../common/attachmentList.vue';
  import {Notice} from '../../../resources';
  import ElButton from '../../../../node_modules/element-ui/packages/button/src/button.vue';
  import issueDetail from '../../dashboard/notice/detail/notice-detail';

  export default {
    components: {
      ElButton,
      attachmentLists, noticeForm, issue, issueDetail
    },
    data: function () {
      return {
        loadingData: true,
        attachmentIdList: [],
        attachmentList: [],
        showRight: false,
        showTypeRight: false,
        showTypeSearch: false,
        detailShow: false,
        currentItem: {},
        detailItem: {},
        showSearch: false,
        showAuthorization: false,
        data: {},
        typeList: [],
        showTypeList: [],
        form: {
          noticeId: '',
          noticeTitle: '',
          noticeContent: '',
          attachmentIdList: []
        },
        noticeId: '',
        action: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        noticeType: {
          0: {'title': '已发布', 'num': '', 'status': 1},
          1: {'title': '未发布', 'num': '', 'status': 0}
        },
        activeStatus: 0,
        filters: {
          availabilityStatus: true,
          typeTxt: ''
        },
        doing: false
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height - 70) + 'px';
      }
    },
    mounted() {
      this.$emit('loaded');
      this.getPageList(1);
    },
    watch: {
      filters: {
        handler() {
          this.getPageList(1);
        },
        deep: true
      }
    },
    methods: {
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      getPageList: function (pageNo) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          noticeTitle: this.filters.typeTxt
        }, this.filters);
        Notice.queryPager(param).then(res => {
            this.showTypeList = res.data.list;
            this.data = Object.assign({}, {'id': ''}, res.data.list[0]);
            this.currentItem = Object.assign({}, this.data);
          this.pager.totalPage = res.data.totalPage;
          this.pager.count = res.data.count;
        });
        this.queryStatusNum(param);
        this.loadingData = false;
      },
      queryStatusNum: function (params) {
        Notice.queryStateNum(params).then(res => {
          let data = res.data;
          this.noticeType[0].num = data['available'];
          this.noticeType[1].num = data['notAvailable'];
        });
      },
      start: function () {
        this.$confirm('确认启用公告"' + this.data.noticeTitle + '"', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Notice.start(this.data.noticeId).then(() => {
            this.getPageList(1);
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功发布公告"' + this.data.noticeTitle + '"'
            });
            this.data.availabilityStatus = true;
          });
        });
      },
      authorize: function (query) {
        this.showAuthorization = true;
      },
      forbid: function () {
        this.$confirm('确认停用公告"' + this.data.noticeTitle + '"', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Notice.forbid(this.data.noticeId).then(() => {
            this.getPageList(1);
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功停用公告"' + this.data.noticeTitle + '"'
            });
          });
        });
      },
      resetRightBox: function () {
        this.showRight = false;
        this.showAuthorization = false;
        this.detailShow = false;
      },
      addType: function () {
        this.action = 'add';
        this.form = {
          availabilityStatus: false,
          noticeTitle: '',
          noticeContent: '',
          attachmentIdList: []
        };
        this.showRight = true;
        this.attachmentList = [];
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      edit: function (item) {
        this.action = 'edit';
        this.form = JSON.parse(JSON.stringify(this.data));
        this.showRight = true;
        this.showType(item);
      },
      remove: function () {
        this.$confirm('确认删除公告"' + this.data.noticeTitle + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
      },
      showType: function (type) {
        this.currentItem = Object.assign({}, type);
      },
      changeType: function (item, key) {// 根据当前选中的标签，重置状态等相关参数。
        this.activeStatus = key;
        this.filters.availabilityStatus = item.status;
      },
      onSubmit: function (item) {
        if (this.action === 'add') {
          this.showTypeList.splice(0, 0, item);
        } else {
          let idList = [];
          this.showTypeList.forEach(val => {
            idList.push(val.noticeId);
          });
          this.showTypeList.splice(idList.indexOf(this.currentItem.noticeId), 1, item);
        }
        this.showType(item);
        this.attachmentIdList = item.attachmentIdList;
      },
      showDetail: function(item) {
        this.detailShow = true;
        this.detailItem = item;
        this.showType(item);
      }
    }
  };
</script>
