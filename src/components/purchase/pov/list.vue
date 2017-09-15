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

  .opera-btn-group {

    border: 2px solid #eeeeee;
    margin: 10px -5px;
    .opera-icon {
      line-height: 50px;
      height: 50px;
      padding: 0 10px;
      border-bottom: 2px solid #eeeeee;
    }
    .switching-icon {
      cursor: pointer;
      .el-icon-arrow-up {
        transition: all .5s ease-in-out;
      }
    }
    &.up {
      .advanced-query-form {
        display: none;
      }
      .opera-icon {
        border-bottom: 0;
      }
      .el-icon-arrow-up {
        transform: rotate(180deg);
      }
    }
    .el-checkbox-warp {
      padding: 10px;
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="">
            <i class="iconfont icon-search"></i> 筛选查询
          </span>
          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="POV" :span="6">
                <el-select placeholder="请选择POV" v-model="searchWord.povId" filterable clearable>
                  <el-option :label="item.povName" :value="item.povId" :key="item.povId" v-for="item in demandList">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="需求时间" :span="6">
                <el-date-picker
                  type="daterange"
                  v-model="demandTime"
                  placeholder="请选择需求时间" format="yyyy-MM-dd"
                  @change="changeTime">
                </el-date-picker>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="" :span="6">
                <el-button type="primary" @click="searchInOrder">查询</el-button>
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
          <div>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
        <span class="pull-right" style="margin-top: 8px">
          <perm label="show" class="opera-btn">
            <span @click="createDemand" style="cursor:pointer"><a href="#" @click.prevent="" class="btn-circle"><i
              class="iconfont icon-wave"></i></a><span class="wave-title"> 需求分配</span></span>
          </perm>
       </span>
      </div>
      <div class="order-list clearfix " style="margin-top: 20px">
        <el-row class="order-list-header" :gutter="10">
          <el-col :span="1">
            <el-checkbox @change="checkAll" v-model="isCheckAll"></el-checkbox>
          </el-col>
          <el-col :span="6">POV要货申请ID</el-col>
          <el-col :span="7">POV</el-col>
          <el-col :span="5">需求产生时间</el-col>
          <el-col :span="5">需求时间</el-col>
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
        <div v-else="" class="order-list-body">
          <div class="order-list-item order-list-item-bg" v-for="item in demandList"
               :class="[{'active':currentItemId==item.id}]"
               @click.prevent="showDetail(item)">
            <el-row>
              <el-col :span="1">
                <div class="el-checkbox-warp" @click.stop.prevent="checkItem(item)">
                  <el-checkbox v-model="item.isChecked"></el-checkbox>
                </div>
              </el-col>
              <el-col :span="6" class="R pt10">
                <span>
                  {{ item.applyMan }}
                </span>
              </el-col>
              <el-col :span="7" class="pt">
                <span>{{ item.povName }}</span>
              </el-col>
              <el-col :span="5" class="pt">
                <span>{{ item.applyTime | date }}</span>
              </el-col>
              <el-col :span="5" class="pt">
                <span>{{ item.demandTime | date }}</span>
              </el-col>
            </el-row>
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
  </div>
</template>
<script>
  //  import order from '../../../tools/demandList';
  import { demandAssignment, pullSignal } from '@/resources';
  import utils from '../../../tools/utils';

  export default {
    data () {
      return {
        loadingData: true,
        showSearch: false,
        showDetailPart: false,
        assignType: utils.assignType,
        activeStatus: '',
        demandList: [],
        filters: {
          status: '',
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
        checkList: [], // 选中的订单列表
        isCheckAll: false
      };
    },
    computed: {
      user () {
        return this.$store.state.user;
      }
    },
    mounted () {
      this.getDemandList(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getDemandList(1);
        },
        deep: true
      },
      user (val) {
        if (val.userCompanyAddress) {
          this.getDemandList(1);
        }
      }
    },
    methods: {
      getDemandList (pageNo) { // 得到波次列表
        let orgId = this.user.userCompanyAddress;
        if (!orgId) return;
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          povId: orgId
        }, this.filters);
        this.loadingData = false;
        pullSignal.query(params).then(res => {
          res.data.list.forEach(item => {
            item.isChecked = false;
          });
          this.demandList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      showDetail (item) {
        this.currentItemId = item.id;
        this.showDetailPart = true;
      },
      resetRightBox () {
        this.showDetailPart = false;
      },
      checkStatus (item, key) {
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      searchInOrder: function () {// 搜索
        this.searchWord.demandStartTime = this.changeTime(this.demandTime[0]);
        this.searchWord.demandEndTime = this.changeTime(this.demandTime[1]);
        Object.assign(this.filters, this.searchWord);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          povId: '',
          demandStartTime: '',
          demandEndTime: ''
        };
        Object.assign(this.searchWord, temp);
        Object.assign(this.filters, temp);
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
          this.$router.push({path: '/purchase/pov/allocation', query: {id: res.data.id}});
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '需求分配失败'
          });
        });
      },
      changeTime (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
