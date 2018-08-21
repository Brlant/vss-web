<style lang="scss" scoped=''>


  .d-table-right {
    text-algin:center;
    .content {
      width: 50%;
    }
  }
  .margin-left {
    margin-left: 15px;
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
    <div class="order-list-status container">
      <div class="status-item" :class="{'active':key==activeStatus} "
           v-for="(item,key) in noticeType"
           @click="changeType(key,item)">
        <div class="status-bg" :class="['b_color_'+key]"></div>
        <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span
          class="status-num">{{item.num}}</span></div>
      </div>
    </div>
    <div class="container d-table">
      <div class="d-table-left">
        <h2 class="header">
            <span class="pull-right">
              <perm label="notice-add">
                <a href="#" class="btn-circle" @click.stop.prevent="addType">
                  <i class="el-icon-t-plus"></i>
                </a>
              </perm>
              <perm label="notice-watch">
                <a href="#" class="btn-circle" @click.prevent="searchType">
                  <i class="el-icon-t-search"></i>
                </a>
              </perm>
            </span>
          公告
        </h2>
        <div class="search-left-box" v-show="showTypeSearch">
          <oms-input v-model='typeTxt' placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
        </div>
        <div v-if="!data.noticeId" class="empty-type-info">
          暂无信息
        </div>
        <div v-else>
          <el-scrollbar tag="div" class="d-table-left_scroll" :style="'height:'+bodyHeight"
                        @scroll="scrollLoadingData">
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                  :class="{'active':item.noticeId==currentItem.noticeId}">
                <perm label="notice-stop">
                  <a href="#" @click.stop.prevent="forbid()" class="hover-show pull-right"
                     v-show="data.availabilityStatus">
                  <i class="el-icon-t-forbidden"></i>
                  </a>
                </perm>
                {{item.noticeTitle}}
              </li>
            </ul>
          </el-scrollbar>
          <div class="btn-left-list-more">
            <bottom-loading></bottom-loading>
            <div @click.stop="getMore" v-show="!$store.state.bottomLoading">
              <el-button v-show="pager.currentPage<pager.totalPage">加载更多</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <div v-if="!data" class="empty-info">
          暂无信息
        </div>
        <div v-else>
          <h2 class="clearfix">
                    <span class="pull-right">
                    <el-button-group>

                      <perm label="notice-edit">
                        <el-button @click="edit()">
                          <i class="el-icon-t-edit"></i>
                          编辑
                        </el-button>
                      </perm>
                      <perm label="notice-edit">
                        <el-button @click="authorize()" v-show="data.availabilityStatus">
                          <i class="el-icon-t-edit"></i>
                          授权
                        </el-button>
                      </perm>
                      <perm label="notice-issue">
                        <el-button @click="start()" v-show="!data.availabilityStatus">
                          <i class="el-icon-t-start"></i>
                          发布
                        </el-button>
                      </perm>
                      </el-button-group>
                    </span>
          </h2>
          <div class="content">
            <el-row>
              <el-col :span="3" class="text-right">
                公告标题：
              </el-col>
              <el-col :span="21">
                {{ data.noticeTitle }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" class="text-right">
                公告内容：
              </el-col>
              <el-col :span="12">
                <pre width="300">{{data.noticeContent}}</pre>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" class="text-right">
                附件：
              </el-col>
              <el-col :span="21">
                <attachment-lists :attachmentIdList="attachmentIdList" :objectId="data.noticeId"
                                  :objectType="'notice'"></attachment-lists>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <page-right :show="showRight" @right-close="resetRightBox">
        <notice-form :formItem="form" @change="onSubmit" :action="action" :actionType="showRight"
                     @right-close="resetRightBox"></notice-form>
      </page-right>
      <page-right :show="showAuthorization" :css="{'width':'1200px','padding':0}" @right-close="resetRightBox">
        <issue  :formItem="currentItem">
        </issue>
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

  export default {
    components: {
      ElButton,
      attachmentLists, noticeForm, issue
    },
    data: function () {
      return {
        attachmentIdList: [],
        attachmentList: [],
        showRight: false,
        showTypeRight: false,
        showTypeSearch: false,
        currentItem: {},
        showSearch: false,
        showAuthorization: false,
        data: {},
        typeList: [],
        showTypeList: [],
        typeTxt: '',
        keyTxt: '',
        form: {
          noticeId: '',
          noticeTitle: '',
          noticeContent: '',
          attachmentIdList: [],
          availabilityStatus: false
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
          availabilityStatus: 1
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
      'typeTxt': function () {
        this.getPageList(1);
      },
      filters: {
        handler: function () {
          this.getPageList(1);
        },
        deep: true
      }
    },
    methods: {
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      getPageList: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          noticeTitle: this.typeTxt
        }, this.filters);
        Notice.queryPager(param).then(res => {
          this.$store.commit('initBottomLoading', false);
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            this.data = Object.assign({}, {'id': ''}, res.data.list[0]);
            this.currentItem = this.data;
          }
          this.pager.totalPage = res.data.totalPage;
        });
        this.queryStatusNum(param);
      },
      queryStatusNum: function (params) {
        Notice.queryStateNum(params).then(res => {
          let data = res.data;
          this.noticeType[0].num = data['available'];
          this.noticeType[1].num = data['notAvailable'];
        });
      },
      getMore: function () {
        this.getPageList(this.pager.currentPage + 1, true);
      },
      start: function() {
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
      edit: function () {
        this.action = 'edit';
        this.form = JSON.parse(JSON.stringify(this.data));
        this.showRight = true;
      },
      remove: function () {
        this.$confirm('确认删除公告"' + this.data.noticeTitle + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });
      },
      showType: function (type) {
        this.data = type;
        this.currentItem = this.data;
      },
      changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
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
      }
    }
  }
  ;
</script>
