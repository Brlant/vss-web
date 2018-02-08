<style lang="less" scoped="">
  .d-table > div.d-table-right {
    padding: 10px 20px;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div>

      </div>
      <div class="d-table">
        <div class="d-table-right">
          <div>
            <el-row>
              <el-col :span="8" class="search-input">
                <el-select filterable remote placeholder="请输入名称搜索疾控" :remote-method="filterOrgs"
                           :clearable="true"
                           v-model="orgId" filterable popper-class="good-selects">
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
              <el-col :span="10" style="padding-left: 10px">
                <perm label="erp-bind-cdc-add">
                  <el-button type="primary" @click="bindDistrict" :disabled="doing">绑定疾控</el-button>
                </perm>
                <perm label="erp-bind-cdc-batch-add" style="margin-left: 20px">
                  <el-button type="primary" @click="bindAll" :disabled="doing">一键绑定区疾控和接种点</el-button>
                </perm>
              </el-col>
              <el-col :span="6" class="text-right">
                  <span >
                    <span class="btn-search-toggle open" v-show="showSearch">
                        <single-input v-model="filters.keyWord" placeholder="请输入名称搜索"
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
          <div class="order-list clearfix " style="margin-top: 10px">
            <el-row class="order-list-header">
              <el-col :span="20">疾控名称</el-col>
              <el-col :span="4">操作</el-col>
            </el-row>
            <el-row v-if="loadingData">
              <el-col :span="24">
                <oms-loading :loading="loadingData"></oms-loading>
              </el-col>
            </el-row>
            <el-row v-else-if="CDCs.length == 0">
              <el-col :span="24">
                <div class="empty-info">
                  暂无信息
                </div>
              </el-col>
            </el-row>
            <div v-else="" class="order-list-body flex-list-dom">
              <div class="order-list-item order-list-item-bg" v-for="item in CDCs" :key="">
                <el-row>
                  <el-col :span="20" class="R pt10">
                    <div class="minor-part" v-show="item.subordinateCode">
                      系统代码{{item.subordinateCode }}
                    </div>
                    <div>
                      {{ item.subordinateName }}
                    </div>
                  </el-col>
                  <el-col :span="4" class="R pt10">
                    <perm label="erp-bind-cdc-delete">
                      <a href="#" @click.prevent="deleteItem(item)"><i
                        class="el-icon-t-delete"></i> 删除</a>
                    </perm>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
            <el-pagination
              layout="prev, pager, next"
              :total="pager.count" :pageSize="pager.pageSize" @current-change="getCDCPage"
              :current-page="pager.currentPage">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { cerpAccess, cerpAction } from '@/resources';

  export default {
    data () {
      return {
        loadingData: true,
        showSearch: false,
        CDCs: [],
        filters: {
          keyWord: ''
        },
        orgList: [], // 货主列表,
        showOrgList: [],
        orgId: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 15
        },
        doing: false
      };
    },
    mounted () {
      this.getCDCPage(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getCDCPage(1);
        },
        deep: true
      }
    },
    methods: {
      bindDistrict () {
        if (!this.orgId) {
          this.$notify.info({
            message: '请选择疾控'
          });
          return;
        }
        this.doing = true;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: '/account/cdc', text: '正在绑定'});
        cerpAccess.bindDistrict(this.orgId).then(() => {
          this.$notify.success({
            message: '绑定疾控成功'
          });
          this.orgId = '';
          this.doing = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/account/cdc', text: '正在绑定'});
          this.getCDCPage();
        }).catch(error => {
          this.doing = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: '/account/cdc', text: '正在绑定'});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '绑定疾控失败'
          });
        });
      },
      bindAll () {
        this.$confirm('是否一键绑定区疾控和接种点', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doing = true;
          this.$store.commit('initPrint', {isPrinting: true, moduleId: '/account/cdc', text: '正在绑定'});
          cerpAccess.bindAllCdcAndPov().then(() => {
            this.$notify.success({
              message: '一键绑定成功'
            });
            this.doing = false;
            this.$store.commit('initPrint', {isPrinting: false, moduleId: '/account/cdc', text: '正在绑定'});
            this.getCDCPage();
          }).catch(error => {
            this.doing = false;
            this.$store.commit('initPrint', {isPrinting: false, moduleId: '/account/cdc', text: '正在绑定'});
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '一键绑定失败'
            });
          });
        });
      },
      filterOrgs: function (query) {
        // 根据参数，获取单位信息
        let param = {
          keyWord: query
        };
        cerpAction.queryCdcList(param).then(res => {
          this.orgList = res.data.list;
          this.filterAvaliableCDCs();
        });
      },
      filterAvaliableCDCs () {
        this.showOrgList = this.orgList.filter(f => !this.CDCs.some(s => f.id === s.subordinateId));
      },
      getCDCPage (pageNo) { // 得到波次列表
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        cerpAction.queryCount(params).then(res => {
          this.CDCs = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
          this.filterAvaliableCDCs();
        });
      },
      deleteItem (item) {
        this.$confirm('是否删除疾控 "' + item.subordinateName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cerpAction.deleteCdc(item.id).then(() => {
            this.$notify.success({
              message: '删除成功'
            });
            this.getCDCPage();
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
