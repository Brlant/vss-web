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
    padding-top: 15px;
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
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div>
        <el-row>
          <el-col :span="5">
            <el-select filterable remote placeholder="请输入名称搜索POV" :remote-method="filterOrgs"
                       :clearable="true"
                       v-model="orgId">
              <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="bindDistrict">绑定POV</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="d-table">
        <div class="d-table-right">
          <h2 style="overflow: hidden">
            <span class="pull-right">
              <span class="btn-search-toggle open" v-show="showSearch">
                  <single-input v-model="filters.keyWord" placeholder="请输入关键字搜索" :showFocus="showSearch"></single-input>
                  <i class="iconfont icon-search" @click.stop="showSearch=(!showSearch)"></i>
              </span>
              <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                  <i class="iconfont icon-search"></i>
              </a>
            </span>
          </h2>
          <div class="order-list clearfix ">
            <el-row class="order-list-header" :gutter="10">
              <el-col :span="24">名称</el-col>
            </el-row>
            <el-row v-if="loadingData">
              <el-col :span="24">
                <oms-loading :loading="loadingData"></oms-loading>
              </el-col>
            </el-row>
            <el-row v-else-if="povs.length == 0">
              <el-col :span="24">
                <div class="empty-info">
                  暂无信息
                </div>
              </el-col>
            </el-row>
            <div v-else="" class="order-list-body">
              <div class="order-list-item order-list-item-bg" v-for="item in povs"
                   :class="[{'active':currentItemId==item.id}]"
                   @click.prevent="showDetail(item)">
                <el-row>
                  <el-col :span="24" class="R pt10">
                    <span>
                      {{ item.subordinateName }}
                    </span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
            <el-pagination
              layout="prev, pager, next"
              :total="pager.count" :pageSize="pager.pageSize" @current-change="getPovPage"
              :current-page="pager.currentPage">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {cerpAction, cerpAccess, BaseInfo } from '@/resources';
  import ElRow from 'element-ui/packages/row/src/row';
  import ElCol from 'element-ui/packages/col/src/col';
  export default {
    components: {
      ElCol,
      ElRow},
    data () {
      return {
        loadingData: true,
        showSearch: false,
        showDetailPart: false,
        povs: [],
        filters: {
          keyWord: ''
        },
        orgList: [], // 货主列表,
        orgId: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 15
        },
        currentItemId: ''
      };
    },
    mounted () {
      this.getPovPage(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getPovPage(1);
        },
        deep: true
      }
    },
    methods: {
      bindDistrict () {
        if (!this.orgId) {
          this.$notify.info({
            message: '请选择POV'
          });
          return;
        }
        cerpAccess.bindPov(this.orgId).then(() => {
          this.$notify.success({
            message: '绑定POV成功'
          });
          this.getPovPage();
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '绑定POV失败'
          });
        });
      },
      filterOrgs: function (query) {
        // 根据参数，获取单位信息
        let param = {
          keyWord: query
        };
        BaseInfo.query(param).then(res => {
          this.orgList = res.data.list;
        });
      },
      getPovPage (pageNo) { // 得到波次列表
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        cerpAction.queryPov(params).then(res => {
          this.povs = res.data.list;
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
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchWord);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgId: '',
          factoryId: '',
          batchNumber: '',
          orgGoodsId: '',
          nearTermDays: ''
        };
        Object.assign(this.searchWord, temp);
        Object.assign(this.filters, temp);
      },
      formatTime (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
