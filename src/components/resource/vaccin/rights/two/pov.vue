<style lang="less" scoped>

  .el-form .el-select {
    display: block;
  }

  .d-table-right {
    .org-name-h2 {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .d-table-col-wrap {
    overflow: auto;
  }

  .pov-info {
    margin-bottom: 20px;
    .font-bold {
      font-size: 14px;
    }
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

  .table > tbody > tr:first-child > td {
    border-top: 0;
  }

  .tr-header {
    background: #f1f1f1;
    th {
      border: 0;
    }
  }

</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-left">
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight" @scroll="scrollLoadingData">
          <h2 class="header">
          <span class="pull-right">
            <a href="#" class="btn-circle" @click.prevent="searchType"><i
              class="el-icon-t-search"></i> </a>
          </span>
            区二类疫苗目录
          </h2>
          <div class="search-left-box" v-show="showTypeSearch">
            <oms-input v-model="typeTxt" placeholder="请输入名称搜索" :showFocus="showTypeSearch"></oms-input>
          </div>
          <div v-if="!showTypeList.length" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                  :class="{'active':item.id==currentItem.id}">
                <div class="id-part">
                  疫苗编号 {{item.orgGoodsNo }}
                </div>
                <div>
                  {{item.orgGoodsName }}
                </div>
              </li>
            </ul>
            <div class="btn-left-list-more" @click.stop="getOrgMore">
              <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight">
          <h2 class="clearfix">
              <span class="pull-right" v-show="showTypeList.length">
                  <perm label="second-vaccine-authorization-add">
                    <el-button @click="add(currentItem)"><i
                      class="el-icon-t-plus"></i>添加</el-button>
                  </perm>
              </span>
          </h2>
          <div class="pov-info">
            <el-row class="clearfix font-bold" style="font-weight: 500;font-size: 14px">
              <oms-row label="疫苗名称" :span="3">
                {{orgName}}
              </oms-row>
            </el-row>
          </div>
          <table class="table " :class="{'table-hover':dataRows.length !== 0}" style="margin-top: 10px">
            <thead>
            <tr class="tr-header">
              <th>接种点</th>
              <th>销售价格</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody v-if="loadingData">
            <tr>
              <td colspan="3" class="text-center">
                <oms-loading :loading="loadingData"></oms-loading>
              </td>
            </tr>
            </tbody>
            <tbody v-else-if="dataRows.length === 0">
            <tr>
              <td colspan="3" class="text-center">
                <div class="empty-info">暂无信息</div>
              </td>
            </tr>
            </tbody>
            <tbody v-else="">
            <tr v-for="row in dataRows" :keys="row.id">
              <td>
                {{ row.povName }}
              </td>
              <td>
                ￥{{row.price ? row.price : 0 }}
              </td>
              <td>
                <perm label="second-vaccine-authorization-update">
                  <a href="#" @click.stop.prevent="edit(row)"><i class="el-icon-t-edit"></i>编辑</a>
                </perm>
                <perm label="second-vaccine-authorization-delete">
                  <a href="#" @click.stop.prevent="removeVaccine(row)"><i class="el-icon-t-delete"></i>删除</a>
                </perm>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData && dataRows.length">
          <el-pagination
            layout="prev, pager, next"
            :total="pager.count" :pageSize="pager.pageSize" @current-change="getPageList"
            :current-page="pager.currentPage">
          </el-pagination>
        </div>
      </div>
    </div>

    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <add-form @change="changeItem" :formItem="formPara" :currentItem="currentItem" @refresh="refreshDetails"
                @close="resetRightBox"></add-form>
    </page-right>
  </div>

</template>
<script>
  import addForm from './form.vue';
  import {cerpAction, Vaccine, VaccineRights, PurchaseAgreement} from '@/resources';

  export default {
    components: {
      addForm
    },
    data: function () {
      return {
        loadingData: false,
        showRight: false,
        showTypeSearch: false,
        showSearch: false,
        dataRows: [],
        showTypeList: [],
        typeTxt: '',
        keyTxt: '',
        filters: {
          povId: ''
        },
        keyWord: '',
        form: {list: [{roleId: ''}]},
        formTitle: '新增',
        oldItem: {},
        action: 'add',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 10,
          totalPage: 1
        },
        typePager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        orgName: '', // 货主名称
        currentItem: {}, //  左边列表点击时，添加样式class
        vaccines: [], // 疫苗列表
        showVaccines: [],
        vaccineId: '',
        orgList: [],
        showOrgList: [],
        povId: '',
        formPara: {},
        nowTime: ''
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height + 10) + 'px';
        return height;
      }
    },
    mounted() {
      this.getOrgsList(1);
    },
    watch: {
      'typeTxt': function () {
        this.dataRows = [];
        this.orgName = '';
        this.getOrgsList();
      },
      keyWord() {
        this.pickTypeList();
      }
    },
    methods: {
      scrollLoadingData (event) {
        this.$scrollLoadingData(event);
      },
      resetRightBox: function () {
        this.showRight = false;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getOrgsList: function (pageNo, isContinue = false) {
        this.typePager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyWord: this.typeTxt
        });
        let nowTime = new Date();
        this.nowTime = nowTime;
        this.$http.get('/purchase-agreement/valid/second-vaccine/pager', {params}).then(res => {
          if (this.nowTime > nowTime) return;
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            if (this.showTypeList.length !== 0) {
              this.currentItem = res.data.list[0];
              this.orgName = this.showTypeList[0].orgGoodsName;
              this.getPageList(1);
            } else {
              this.currentItem = Object.assign({'id': ''});
            }
          }
          this.typePager.totalPage = res.data.totalPage;
        });
      },
      getOrgMore: function () {
        this.getOrgsList(this.typePager.currentPage + 1, true);
      },
      queryVaccines(query) {
        let params = Object.assign({}, {
          keyWord: query
        });
        Vaccine.queryLevelVaccine(params).then(res => {
          this.vaccines = res.data.list;
          this.filterPOVs();
        });
      },
      filterPOVs() {
        this.showOrgList = this.orgList.filter(f => !this.dataRows.some(s => f.subordinateId === s.povId));
      },
      filterPOV: function (query) {// 过滤POV
        let params = Object.assign({}, {
          keyWord: query
        });
        cerpAction.queryAllPov(params).then(res => {
          this.orgList = res.data.list;
          this.filterPOVs();
        });
      },
      getPageList: function (pageNo) {
        this.dataRows = [];
        this.pager.currentPage = pageNo;
        let orgId = this.currentItem.orgGoodsId;
        if (!orgId) return;
        this.loadingData = true;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        });
        VaccineRights.queryPovByVaccine(orgId, params).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      refreshDetails() {
        this.getPageList(1);
        this.showRight = false;
      },
      removeVaccine: function (item) {
        this.$confirm('是否删除接种点"' + item.povName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          VaccineRights.deleteVaccine(item.id).then(() => {
            this.getPageList(1);
            this.$notify.success({
              message: '已成功删除疫苗'
            });
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '删除疫苗失败'
            });
          });
        });
      },
      bindVaccinePOV() {
        let form = {
          'orgGoodsId': this.currentItem.orgGoodsId,
          'povId': this.povId
        };
        if (!form.povId) {
          this.$notify.info({
            message: '没有pov,无法绑定疫苗'
          });
          return;
        }
        if (!form.orgGoodsId) {
          this.$notify.info({
            message: '请选择疫苗'
          });
          return;
        }
        VaccineRights.save(form).then(() => {
          this.$notify.success({
            message: '授权疫苗成功'
          });
          this.povId = '';
          this.getPageList(1);
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '授权疫苗失败'
          });
        });
      },
      showType: function (item) {
        this.orgName = item.orgGoodsName;
        this.currentItem = item;
        this.getPageList(1);
      },
      add() {
        this.formPara = {};
        this.showRight = true;
      },
      edit(item) {
        this.formPara = item;
        this.showRight = true;
      },
      changeItem(item) {
        if (this.action === 'add') {
          this.getPageList(1);
        } else {
          Object.assign(this.formPara, item);
        }
        this.showRight = false;
      }
    }
  };
</script>
