<style lang="less" scoped="">
  .advanced-query-form {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    padding-top: 20px;
  }

  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .pt {

  }

  .good-selects {
    .el-select-dropdown__item {
      font-size: 14px;
      padding: 8px 10px;
      position: relative;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgb(72, 94, 106);
      height: auto;
      width: 300px;
      line-height: 1.5;
      box-sizing: border-box;
      cursor: pointer;
    }
  }

  .align-word {
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="">
            <i class="el-icon-t-search"></i> 筛选查询
          </span>
          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="接种点" :span="4">
                <el-select placeholder="请输入名称搜索接种点" v-model="searchWord.povId" filterable remote
                           :remote-method="filterOrg" @click.native="filterOrg('')" :clearable="true"
                           popperClass="good-selects">
                  <el-option :value="org.subordinateId" :key="org.subordinateId" :label="org.subordinateName"
                             v-for="org in orgList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.subordinateName}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码</span> {{org.subordinateCode}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="10">
              <oms-form-row label="到货需求日期" :span="7">
                <el-date-picker
                  type="daterange"
                  v-model="demandTime"
                  placeholder="请选择到货需求日期" format="yyyy-MM-dd">
                </el-date-picker>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="" :span="1">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="order-list-status container clearfix">
        <div class="status-item" :class="{'active':key==activeStatus}" style="width: 100px"
             v-for="(item,key) in assignType" @click="checkStatus(item, key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
        <span class="pull-right" style="margin-top: 8px" v-show="filters.status === 1">
          <perm label="demand-assignment-add" class="opera-btn">
            <span @click="createDemand" style="cursor:pointer"><a href="#" @click.prevent="" class="btn-circle"><i
              class="el-icon-t-wave"></i></a><span class="wave-title"> 生成汇总单</span></span>
          </perm>
       </span>
      </div>
      <div class="order-list clearfix " style="margin-top: 20px">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="1" v-show="filters.status === 1">
            <el-checkbox @change="checkAll" v-model="isCheckAll"></el-checkbox>
          </el-col>
          <el-col :span="filters.status === 1 ? 4: 5">接种点要货申请编号</el-col>
          <el-col :span="7">接种点</el-col>
          <el-col :span="3">到货需求日期</el-col>
          <el-col :span="5">需求单创建时间</el-col>
          <el-col :span="4">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="demandList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item" v-for="item in demandList"
               :class="['status-'+filterListColor(item.status),{'active':currentItemId==item.id}]">
            <el-row>
              <el-col :span="1" v-show="filters.status === 1">
                <div class="el-checkbox-warp" @click.stop.prevent="checkItem(item)">
                  <el-checkbox v-model="item.isChecked"></el-checkbox>
                </div>
              </el-col>
              <el-col :span="filters.status === 1 ? 4: 5" class="R pt10">
                <span>
                  {{ item.id }}
                </span>
              </el-col>
              <el-col :span="7" class="pt">
                <span>{{ item.povName }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.demandTime | date }}</span>
              </el-col>
              <el-col :span="5" class="pt">
                <span>{{ item.applyTime | time }}</span>
              </el-col>
              <el-col :span="4" class="opera-btn">
                <div>
                  <span @click.prevent="showDetail(item)">
                    <a href="#" class="btn-circle" @click.prevent=""><i
                      class="el-icon-t-detail"></i></a>
                  查看详情
                  </span>
                </div>
                <div v-show="filters.status === 1">
                  <perm label="demand-assignment-cancel">
                     <span @click.prevent="cancel(item)">
                      <a href="#" class="btn-circle" @click.prevent=""><i
                        class="el-icon-t-verify"></i></a>
                        取消需求单
                      </span>
                  </perm>
                </div>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>

      </div>

      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          layout="prev, pager, next"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="getDemandList"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>
    <page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1100px','padding':0}"
                class="order-detail-info" partClass="pr-no-animation">
      <show-form :currentItem="currentItem" @close="resetRightBox"></show-form>
    </page-right>
  </div>
</template>
<script>
  import { demandAssignment, pullSignal, cerpAction } from '@/resources';
  import utils from '../../../tools/utils';
  import showForm from './detail/index.vue';

  export default {
    components: {showForm},
    data () {
      return {
        loadingData: false,
        showSearch: true,
        showDetailPart: false,
        assignType: utils.assignType,
        activeStatus: 0,
        demandList: [],
        filters: {
          status: 1,
          povId: '',
          demandStartTime: '',
          demandEndTime: ''
        },
        searchWord: {
          povId: '',
          demandStartTime: '',
          demandEndTime: ''
        },
        demandTime: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 15
        },
        currentItemId: '',
        currentItem: {},
        checkList: [], // 选中的订单列表
        isCheckAll: false,
        orgList: []
      };
    },
    computed: {
      user () {
        return this.$store.state.user;
      }
    },
    mounted () {
//      this.getDemandList(1);
      this.resetSearchForm();
      let orderId = this.$route.params.id;
      if (orderId && orderId !== 'list') {
        this.currentItem = {id: orderId};
        this.showDetailPart = true;
      }
    },
    watch: {
      filters: {
        handler: function () {
          if (this.demandTime instanceof Array && this.demandTime.length && this.demandTime[0]) {
            this.getDemandList(1);
          }
        },
        deep: true
      },
      user (val) {
        if (val.userCompanyAddress) {
//          this.getDemandList(1);
        }
      }
    },
    methods: {
      getDemandList (pageNo) { // 得到需求列表
        let orgId = this.user.userCompanyAddress;
        if (!orgId) return;
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          cdcId: orgId
        }, this.filters);
        this.loadingData = true;
        pullSignal.query(params).then(res => {
          res.data.list.forEach(item => {
            item.isChecked = false;
          });
          this.demandList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
          this.queryCount();
        });
      },
      queryCount () {
        let params = Object.assign({}, {
          cdcId: this.user.userCompanyAddress
        }, this.filters);
        pullSignal.queryCount(params).then(res => {
          this.assignType[0].num = res.data['audited'];
          this.assignType[1].num = res.data['create-wave'];
          this.assignType[2].num = res.data['assigned'];
          this.assignType[3].num = res.data['canceled'];
        });
      },
      filterOrg: function (query) {// 过滤供货商
        let params = Object.assign({}, {
          keyWord: query
        });
        cerpAction.queryAllPov(params).then(res => {
          this.orgList = res.data.list;
        });
      },
      showDetail (item) {
        this.currentItemId = item.id;
        this.currentItem = item;
        this.$router.push(`${item.id}`);
        this.showDetailPart = true;
      },
      resetRightBox () {
        this.showDetailPart = false;
        this.$router.push('list');
      },
      checkStatus (item, key) {
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      filterListColor: function (index) {// 过滤左边列表边角颜色
        let status = -1;
        for (let key in this.assignType) {
          if (this.assignType[key].status === index) {
            status = key;
          }
        }
        return status;
      },
      searchInOrder: function () {// 搜索
        if (this.demandTime instanceof Array && this.demandTime.length && this.demandTime[0]) {
          this.searchWord.demandStartTime = this.changeTime(this.demandTime[0]);
          this.searchWord.demandEndTime = this.changeTime(this.demandTime[1]);
          Object.assign(this.filters, this.searchWord);
        } else {
          this.$notify.info({
            message: '请选择需求到货日期'
          });
        }
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          povId: '',
          demandStartTime: '',
          demandEndTime: ''
        };
        this.demandTime = '';
        this.demandList = [];
        this.checkList = [];
        this.isCheckAll = false;
        Object.assign(this.searchWord, temp);
        Object.assign(this.filters, temp);
        Object.keys(this.assignType).forEach(key => {
          this.assignType[key].num = '';
        });
      },
      checkAll () { // 全选
        if (this.isCheckAll) {
          this.demandList.forEach(item => {
            item.isChecked = true;
            let index = this.checkList.indexOf(item);
            if (index === -1) {
              this.checkList.push(item);
            }
          });
        } else {
          this.demandList.forEach(item => {
            item.isChecked = false;
          });
          this.checkList = [];
        }
      },
      checkItem (item) { // 单选
        item.isChecked = !item.isChecked;
        let index = this.checkList.indexOf(item);
        if (item.isChecked) {
          if (index === -1) {
            this.checkList.push(item);
          }
        } else {
          this.checkList.splice(index, 1);
        }
      },
      createDemand () {
        if (!this.checkList.length) {
          this.$notify.info({
            message: '请选择申请单'
          });
          return;
        }
        let list = [];
        this.checkList.forEach(i => list.push(i.id));
        demandAssignment.save({list}).then(res => {
          this.$notify.success({
            message: '需求分配成功'
          });
          this.$router.push({path: '/sale/allocation/pov', query: {id: res.data.id}});
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '需求分配失败'
          });
        });
      },
      cancel (item) {
        this.$confirm('是否取消"' + item.id + '" 申请单?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          pullSignal.cancel(item.id).then(() => {
            this.$notify.success({
              message: '已成功取消需求单'
            });
            this.getDemandList(1);
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '取消需求单失败'
            });
          });
        });
      },
      changeTime (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
