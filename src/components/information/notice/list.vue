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

  .order-list-item {
    cursor: pointer;
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
               :class="['status-'+filterListColor(item.availabilityStatus),{'active':currentItem.noticeId==item.noticeId}]"
               @click="showDetail(item)">
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
                     <span @click.stop="showDetail(item)">
                       <a href="#" class="btn-circle" @click.prevent="">
                         <i class="el-icon-t-detail"></i>
                       </a>
                      查看详情
                     </span>
                  </perm>
                </div>
                <div>
                  <perm label="notice-edit">
                    <span @click.stop="edit(item)">
                      <a href="#" class="btn-circle" @click.prevent=""><i
                        class="el-icon-t-edit"></i></a>
                        编辑
                  </span>
                  </perm>
                  <perm label="notice-stop" v-show="item.availabilityStatus">
                     <span @click.stop="forbid(item)">
                      <a href="#" class="btn-circle" @click.prevent=""><i
                        class="el-icon-t-verify"></i></a>
                        撤回
                      </span>
                  </perm>
                  <perm label="notice-issue">
                    <span @click.stop="authorize(item)" v-show="!item.availabilityStatus">
                        <a href="#" class="btn-circle" @click.prevent=""><i
                          class="el-icon-t-start"></i></a>
                          授权发布
                    </span>
                  </perm>
                  <perm label="notice-assign">
                    <span @click.stop="authorize(item)" v-show="item.availabilityStatus">
                        <a href="#" class="btn-circle" @click.prevent=""><i
                          class="el-icon-t-appoint"></i></a>
                          授权单位
                    </span>
                  </perm>
                  <perm label="notice-assign">
                    <span @click.stop="top(item,100)" v-show="item.availabilityStatus&&item.noticeFlag===0">
                        <a href="#" class="btn-circle" @click.prevent=""><i
                          class="el-icon-t-zhiding"></i></a>
                          置顶
                    </span>
                  </perm>
                  <perm label="notice-assign">
                    <span @click.stop="top(item,0)" v-show="item.availabilityStatus&&item.noticeFlag===100">
                        <a href="#" class="btn-circle" @click.prevent=""><i
                          class="el-icon-t-quxiaozhiding"></i></a>
                          取消置顶
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
        <notice-form :formItem="form" @change="onSubmit" :action="action" @right-close="resetRightBox"></notice-form>
      </page-right>
      <page-right :show="showAuthorization" :css="{'width':'1200px','padding':0}" @right-close="resetRightBox">
        <issue :formItem="form" @start-notice="start" @right-close="resetRightBox"></issue>
      </page-right>
      <page-right :show="detailShow" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
        <issue-detail :formItem="form" @right-close="resetRightBox"></issue-detail>
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
    mounted () {
      this.$emit('loaded');
      this.getPageList(1);
    },
    watch: {
      filters: {
        handler () {
          this.getPageList(1);
        },
        deep: true
      }
      /*  showTypeList: {
          handler () {
            this.getPageList(1);
          }
        }*/
    },
    methods: {
      filterListColor: function (index) {
        if (index) {
          return 0;
        } else {
          return 1;
        }
      },
      scrollLoadingData (event) {
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
          if (Object.keys(this.currentItem).length === 0) {
            this.currentItem = Object.assign({}, this.data);
          }
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
      start: function (item) {
        this.$confirm('确认启用公告"' + item.noticeTitle + '"', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Notice.start(item.noticeId).then(() => {
            this.getPageList(1);
            this.resetRightBox();
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功发布公告"' + item.noticeTitle + '"'
            });
            // this.data.availabilityStatus = true;
            item.availabilityStatus = true;
          });
        }).catch(() => {
        });

      },
      authorize: function (item) {
        this.showAuthorization = true;
        this.form = item;
        this.showType(item);
      },
      top: function (item, flag) {
        let topText;
        if (flag === 100) {
          topText = '置顶';
        } else {
          topText = '取消置顶';
        }
        this.$confirm('确认' + topText + '公告"' + item.noticeTitle + '"', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Notice.top(item.noticeId, flag).then(() => {
            this.getPageList(1);
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功' + topText + '公告"' + item.noticeTitle + '"'
            });
          });
        });
      },
      forbid: function (item) {
        this.$confirm('确认停用公告"' + item.noticeTitle + '"', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Notice.forbid(item.noticeId).then(() => {
            this.getPageList(1);
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功停用公告"' + item.noticeTitle + '"'
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
        this.form = item;
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
        this.form = {};
        this.showType(item);
        this.attachmentIdList = item.attachmentIdList;
        this.getPageList(1);
      },
      showDetail: function (item) {
        this.detailShow = true;
        this.form = item;
        this.showType(item);
      }
    }
  };
</script>
