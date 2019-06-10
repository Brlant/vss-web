<style lang="scss" scoped>

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
        <h2 class="header">
          <span class="pull-right">
            <a href="#" class="btn-circle" @click.prevent="searchType"><i
              class="el-icon-t-search"></i> </a>
          </span>
          <perm label="first-vaccine-authorization-add">
              <span class="pull-right" style="margin-right: 10px">
            <a href="#" class="btn-circle" @click.prevent="showMultiplePart"><i
              class="el-icon-t-plus"></i></a>
          </span>
          </perm>

          货主疫苗列表
        </h2>
        <div class="d-table-col-wrap" :style="'height:'+ (bodyHeight - 60)  + 'px'" @scroll="scrollLoadingData">

          <div class="search-left-box" v-show="showTypeSearch">
            <oms-input v-model="typeTxt" placeholder="请输入名称搜索" :showFocus="showTypeSearch"></oms-input>
          </div>
          <div v-if="!showTypeList.length" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)" style="padding-left: 10px"
                  :class="{'active':item.orgGoodsDto==currentItem.orgGoodsDto}">
                <div class="id-part">
                  <span>疫苗编号{{item.orgGoodsDto.goodsNo}}</span>
                  <el-tag type="primary" style="padding-left: 9px" v-show="item.orgGoodsDto.goodsIsCombination">组合
                  </el-tag>
                  <el-tag type="danger" v-show="item.orgGoodsDto.goodsDto.overdue">注册证照过期</el-tag>
                </div>
                <div>
                  <span>{{item.orgGoodsDto.name}}</span>
                </div>
              </li>
            </ul>
            <div class="btn-left-list-more">
              <bottom-loading></bottom-loading>
              <div @click.stop="getOrgMore" v-show="!$store.state.bottomLoading">
                <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight + 'px'">
          <el-row>
            <el-col :span="22">
              <el-form class="rightForm" ref="rightForm" inline onsubmit="return false">
                <el-form-item label="接种点">
                  <el-select filterable remote placeholder="请输入名称搜索接种点" :remote-method="filterPOV"
                             :clearable="true" @click.native.once="filterPOV('')"
                             v-model="searchCondition.povId" popper-class="good-selects ">
                    <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in orgList">
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
                </el-form-item>
                <el-form-item style="margin-left: 10px">
                  <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                  <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                  <perm label="first-vaccine-authorization-delete">
                    <el-button plain type="warning" @click="onceCancelRights" style="margin-left: 10px">一键取消所有授权
                    </el-button>
                  </perm>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="2">
              <span class="pull-right" v-show="showTypeList.length">
                  <perm label="first-vaccine-authorization-add">
                    <el-button @click="add(currentItem)"><i
                      class="el-icon-t-plus"></i>添加</el-button>
                  </perm>
              </span>
            </el-col>
          </el-row>
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
              <!--<th>销售价格</th>-->
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
              <!--<td>-->
              <!--￥{{row.price ? row.price : 0 }}-->
              <!--</td>-->
              <td>
                <!--<perm label="vaccine-authorization-update">-->
                <!--<a href="#" @click.stop.prevent="edit(row)"><i class="el-icon-t-edit"></i>编辑</a>-->
                <!--</perm>-->
                <perm label="first-vaccine-authorization-delete">
                  <a href="#" @click.stop.prevent="removeVaccine(row)"><i class="el-icon-t-delete"></i>删除</a>
                </perm>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData && dataRows.length">
            <el-pagination
              layout="total,prev, pager, next"
              :total="pager.count" :pageSize="pager.pageSize" @current-change="getPageList"
              :current-page="pager.currentPage">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <add-form @change="changeItem" :formItem="formPara" :currentItem="currentItem" @refresh="refreshDetails"
                @close="resetRightBox"></add-form>
    </page-right>
    <page-right :show="showMultiple" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <multiple-form @change="changeItem" :formItem="formPara" :currentItem="currentItem" @refreshLeft="refreshLeft"
                     @close="resetRightBox"></multiple-form>
    </page-right>
  </div>

</template>
<script>
  import addForm from './form.vue';
  import {BaseInfo, Vaccine, VaccineRights} from '@/resources';
  import multipleForm from './multiple-from';

  export default {
    components: {
      addForm, multipleForm
    },
    data: function () {
      return {
        loadingData: false,
        showRight: false,
        showMultiple: false,
        showTypeSearch: false,
        showSearch: false,
        dataRows: [],
        showTypeList: [],
        typeTxt: '',
        keyTxt: '',
        filters: {
          povId: ''
        },
        searchCondition: {
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
        height = (height + 10);
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
      resetRightBox: function () {
        this.showRight = false;
        this.showMultiple = false;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getOrgsList: function (pageNo, isContinue = false) {
        this.typePager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.typePager.pageSize,
          keyWord: this.typeTxt,
          // deleteFlag: false,
          status: '1'
        });
        let nowTime = new Date();
        this.nowTime = nowTime;
        this.$http.get('/vaccine-info/first-vaccine/valid/org-goods', {params}).then(res => {
          if (params.keyWord !== this.typeTxt) return;

          this.$store.commit('initBottomLoading', false);

          if (this.nowTime > nowTime) return;
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            if (this.showTypeList.length !== 0) {
              this.currentItem = res.data.list[0];
              this.orgName = this.showTypeList[0].orgGoodsDto.name;
              this.getPageList(1);
            } else {
              this.currentItem = Object.assign({'id': ''});
            }
          }
          this.typePager.count = res.data.count;
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
        });
      },
      filterPOV: function (query) {// 过滤POV
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query,
          relation: '0'
        };
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.orgList = res.data;
        });
      },
      getPageList: function (pageNo) {
        this.dataRows = [];
        this.pager.currentPage = pageNo;
        let orgId = this.currentItem.orgGoodsDto.id;
        if (!orgId) return;
        this.loadingData = true;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        VaccineRights.queryPovByVaccine(orgId, params).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      searchInOrder: function () {// 搜索
        Object.assign(this.filters, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          povId: ''
        };
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
      },
      refreshDetails() {
        this.getPageList(1);
        this.showRight = false;
      },
      refreshLeft() {
        this.getOrgsList(1);
        this.resetRightBox();
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
              message: '已成功删除接种点'
            });
          }).catch(error => {
            this.$notify.error({
              message: error.response.data && error.response.data.msg || '删除接种点失败'
            });
          });
        });
      },
      bindVaccinePOV() {
        let form = {
          'orgGoodsId': this.currentItem.orgGoodsDto.id,
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
        this.orgName = item.orgGoodsDto.name;
        this.currentItem = item;
        this.getPageList(1);
      },
      showMultiplePart() {
        this.formPara = {};
        this.showMultiple = true;
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
      },
      onceCancelRights() {
        this.$confirm('是否取消疫苗"' + this.currentItem.orgGoodsDto.name + '"的所有接种点授权', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`vaccine-authorization/${this.currentItem.orgGoodsDto.id}/all`).then(() => {
            this.getPageList(1);
            this.$notify.success({
              type: '成功',
              message: '已经取消疫苗"' + this.currentItem.orgGoodsDto.name + '"的所有接种点授权'
            });
          }).catch(error => {
            this.$notify.error({
              type: '失败',
              message: error.response.data && error.response.data.msg || '取消所有接种点授权失败'
            });
          });
        });
      }
    }
  };
</script>
