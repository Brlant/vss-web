<style lang="scss" scoped="">
  .d-table > div.d-table-right {
    padding: 10px 20px;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="d-table">
        <div class="d-table-left" v-show="isShowLeft">
            <h2 class="header">
          <span class="pull-right">
              <a href="#" class="btn-circle" @click.prevent="showTypeSearch=!showTypeSearch"><i
                class="el-icon-t-search"></i> </a>
          </span>
              疾控列表
            </h2>
          <div class="d-table-col-wrap" :style="'height:'+(bodyHeight - 60) + 'px'">
            <div class="search-left-box" v-show="showTypeSearch">
              <oms-input v-model="filterCDCs.keyWord" placeholder="请输入名称搜索" :showFocus="showTypeSearch"></oms-input>
            </div>
            <div v-if="!cdcs.length" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li v-for="item in cdcs" :keys="item.id" class="list-item" @click="showType(item)"
                    :class="{'active':item.id==cdcItem.id}">
                  <div class="minor-part" v-show="item.subordinateCode">
                    系统代码{{item.subordinateCode }}
                  </div>
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
                  <el-select filterable remote placeholder="请输入名称搜索接种点" :remote-method="filterOrgs"
                             :clearable="true"
                             v-model="orgId" popper-class="good-selects">
                    <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in showOrgList">
                      <div style="overflow: hidden">
                        <span class="pull-left" style="clear: right">{{org.name}}</span>
                      </div>
                      <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                      </div>
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="3" style="padding-left: 10px">
                  <perm label="erp-bind-pov-add">
                    <el-button type="primary" @click="bindDistrict" :disabled="doing">绑定接种点</el-button>
                  </perm>
                </el-col>
                <el-col :span="11" class="text-right">
                <span>
                  <span class="btn-search-toggle open" v-show="showSearch">
                    <single-input v-model="filterPOVs.keyWord" placeholder="请输入名称搜索"
                                  :showFocus="showSearch"></single-input>
                    <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
                  </span>
                  <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                    <i class="el-icon-t-search"></i>
                  </a>
                </span>
                </el-col>
              </el-row>
            </div>
            <div class="order-list clearfix" style="margin-top: 10px">
              <el-row class="order-list-header">
                <el-col :span="20">接种点名称</el-col>
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
                <div class="order-col-wrap" :style="'height:'+ (bodyHeight - 100) + 'px'">
                  <div class="order-list-item order-list-item-bg" v-for="item in povs" :key="">
                    <el-row>
                      <el-col :span="20" class="R pt10">
                        <div class="minor-part">系统代码{{ item.subordinateCode }}</div>
                        <div>{{ item.subordinateName }}</div>
                      </el-col>
                      <el-col :span="4" class="R pt10">
                        <perm label="erp-bind-pov-delete">
                          <a href="#" @click.prevent="deleteItem(item)"><i
                            class="el-icon-t-delete"></i> 删除</a>
                        </perm>
                      </el-col>
                    </el-row>
                  </div>
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
  import { BaseInfo, cerpAccess, cerpAction } from '@/resources';

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
        level: window.localStorage.getItem('logLevel'),
        doing: false
      };
    },
    computed: {
      user () {
        return this.$store.state.user;
      },
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return height;
      }
    },
    mounted () {
      if (this.level === '2') {
        this.isShowLeft = false;
        if (!this.$store.state.user.userCompanyAddress) return;
        this.cdcItem = {
          subordinateId: this.$store.state.user.userCompanyAddress
        };
        this.getPovPage(1);
      } else {
        this.getCDCPage();
      }
    },
    watch: {
      filterPOVs: {
        handler: function () {
          this.getPovPage(1);
        },
        deep: true
      },
      filterCDCs: {
        handler: function () {
          this.getCDCPage();
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
            message: '请选择接种点'
          });
          return;
        }
        let cdcId = this.cdcItem.subordinateId;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/account/pov', text: '正在绑定'});
        this.doing = true;
        cerpAccess.bindPov(cdcId, this.orgId).then(() => {
          this.doing = false;
          this.$notify.success({
            message: '绑定接种点成功'
          });
          this.orgId = '';
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/account/pov', text: '正在绑定'});
          this.getPovPage(1);
        }).catch(error => {
          this.doing = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/account/pov', text: '正在绑定'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '绑定接种点失败'
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
      getCDCPage() { // 得到疾控列表
        let params = Object.assign({
          pageNo: 1,
          pageSize: 20
        }, this.filterCDCs);
        this.loadingData = true;
        cerpAction.queryCount(params).then(res => {
          this.cdcs = res.data.list;
          this.cdcItem = this.cdcs.length && this.cdcs[0];
          this.loadingData = false;
          this.getPovPage(1);
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
        this.$confirm('是否删除接种点 "' + item.subordinateName + '"?', '', {
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
