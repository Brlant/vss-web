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

  .search-input {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
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
      <div class="d-table">
        <div class="d-table-left" v-show="isShowLeft">
          <div class="d-table-col-wrap">
            <h2 class="header">
          <span class="pull-right">
              <a href="#" class="btn-circle" @click.prevent="showTypeSearch=!showTypeSearch"><i
                class="iconfont icon-search"></i> </a>
          </span>
              CDC列表
            </h2>
            <div class="search-left-box" v-show="showTypeSearch">
              <oms-input v-model="filterCDCs.keyWord" placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
            </div>
            <div v-if="!cdcs.length" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li v-for="item in cdcs" :keys="item.id" class="list-item" @click="showType(item)"
                    :class="{'active':item.id==cdcItem.id}">
                  <div>
                    {{item.subordinateName }}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <div>
            <el-row>
              <el-col :span="10" class="search-input">
                <el-select filterable remote placeholder="请输入名称搜索POV" :remote-method="filterOrgs"
                           :clearable="true"
                           v-model="orgId">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in showOrgList"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3" style="padding-left: 10px">
                <perm label="erp-bind-city-cdc-add">
                  <el-button type="primary" @click="bindDistrict">绑定市级POV</el-button>
                </perm>
              </el-col>
              <el-col :span="11" class="text-right">
                <span>
                  <span class="btn-search-toggle open" v-show="showSearch">
                    <single-input v-model="filterPOVs.keyWord" placeholder="请输入关键字搜索"
                                  :showFocus="showSearch"></single-input>
                    <i class="iconfont icon-search" @click.stop="showSearch=(!showSearch)"></i>
                  </span>
                  <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                    <i class="iconfont icon-search"></i>
                  </a>
                </span>
              </el-col>
            </el-row>
          </div>
          <div class="order-list clearfix" style="margin-top: 10px">
            <el-row class="order-list-header" :gutter="10">
              <el-col :span="20">POV名称</el-col>
              <el-col :span="4">操作</el-col>
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
            <div v-else="" class="order-list-body flex-list-dom">
              <div class="order-list-item order-list-item-bg" v-for="item in povs" :key="">
                <el-row>
                  <el-col :span="20" class="R pt10">
                      <span>
                      {{ item.subordinateName }}
                      </span>
                  </el-col>
                  <el-col :span="4" class="R pt10">
                    <perm label="erp-bind-city-cdc-delete">
                      <a href="#" @click.prevent="deleteItem(item)"><i
                        class="iconfont icon-delete"></i> 删除</a>
                    </perm>
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
  import { cerpAction, cerpAccess, BaseInfo } from '@/resources';

  export default {
    data () {
      return {
        loadingData: true,
        showSearch: false,
        showTypeSearch: false,
        povs: [],
        filterPOVs: {
          keyWord: ''
        },
        filterCDCs: {
          keyWord: ''
        },
        isShowLeft: true,
        cdcs: [],
        cdcItem: {},
        orgList: [], // 货主列表,
        showOrgList: [],
        orgId: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 15
        },
        level: window.localStorage.getItem('logLevel')
      };
    },
    computed: {
      user () {
        return this.$store.state.user;
      }
    },
    mounted () {
      this.isShowLeft = false;
      if (!this.$store.state.user.userCompanyAddress) return;
      this.cdcItem = {
        subordinateId: this.$store.state.user.userCompanyAddress
      };
      this.getPovPage(1);
    },
    watch: {
      filterPOVs: {
        handler: function () {
          this.getPovPage(1);
        },
        deep: true
      },
      user (val) {
        if (!val.userCompanyAddress) return;
        this.cdcItem = {
          subordinateId: this.$store.state.user.userCompanyAddress
        };
        this.getPovPage(1);
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
        let cdcId = this.cdcItem.subordinateId;
        cerpAccess.bindPov(cdcId, this.orgId).then(() => {
          this.$notify.success({
            message: '绑定POV成功'
          });
          this.orgId = '';
          this.getPovPage(1);
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '绑定POV失败'
          });
        });
      },
      filterAvaliableCDCs () {
        this.showOrgList = this.orgList.filter(f => !this.povs.some(s => f.id === s.subordinateId));
      },
      filterOrgs: function (query) {
        // 根据参数，获取单位信息
        let params = {
          keyWord: query,
          relation: '0'
        };
        BaseInfo.queryOrgByValidReation(this.cdcItem.subordinateId, params).then(res => {
          this.orgList = res.data;
          this.filterAvaliableCDCs();
        });
      },
      getPovPage (pageNo) { // 得到POV列表
        if (!this.cdcItem.subordinateId) return;
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filterPOVs);
        this.loadingData = true;
        cerpAction.queryPov(this.cdcItem.subordinateId, params).then(res => {
          this.povs = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
          this.filterAvaliableCDCs();
        });
      },
      showType (item) {
        this.cdcItem = item;
        this.getPovPage();
      },
      deleteItem (item) {
        this.$confirm('是否删除POV "' + item.subordinateName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cerpAction.deletePov(item.id).then(() => {
            this.$notify.success({
              message: '删除成功'
            });
            this.getPovPage();
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '删除失败'
            });
          });
        });
      }
    }
  };
</script>
