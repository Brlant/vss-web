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
        <div class="d-table-col-wrap" :style="'max-height:'+bodyHeight">
          <h2 class="header">
          <span class="pull-right">
            <a href="#" class="btn-circle" @click.prevent="searchType"><i
              class="iconfont icon-search"></i> </a>
          </span>
            {{ orgLevel === 1 ? '货主疫苗列表' : '采购协议疫苗' }}列表
          </h2>
          <div class="search-left-box" v-show="showTypeSearch">
            <oms-input v-model="typeTxt" placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
          </div>
          <div v-if="!currentItem.id" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list" v-if="orgLevel !== 1">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                  :class="{'active':item.id==currentItem.id}">
                <div class="id-part">
                  组织疫苗ID {{item.orgGoodsId }}
                </div>
                <div>
                  {{item.orgGoodsName }}
                </div>
              </li>
            </ul>
            <ul class="show-list" v-if="orgLevel === 1">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)" style="padding-left: 10px"
                  :class="{'active':item.orgGoodsDto==currentItem.orgGoodsDto}">
                <!--<perm label="vaccine-info-delete">-->
                <!--<oms-remove :item="item" @removed="removeType" :tips='"确认删除疫苗\""+item.orgGoodsDto.name +"\"?"'-->
                <!--class="hover-show"><i class="iconfont icon-delete"></i></oms-remove>-->
                <!--</perm>-->
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
            <div class="btn-left-list-more" @click.stop="getOrgMore">
              <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <div class="d-table-col-wrap">
          <h2 class="clearfix">
              <span class="pull-right">
                  <perm label="vaccine-authorization-add">
                    <el-button @click="add(currentItem)"><i
                      class="iconfont icon-plus"></i>添加</el-button>
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
              <th>POV</th>
              <th>销售价格</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody v-if="dataRows.length === 0">
            <tr>
              <td colspan="3" class="text-center">
                <div class="empty-info">暂无信息</div>
              </td>
            </tr>
            </tbody>
            <tbody>
            <tr v-for="row in dataRows" :keys="row.id">
              <td>
                {{ row.povName }}
              </td>
              <td>
                ￥{{row.price ? row.price : 0 }}
              </td>
              <td>
                <perm label="vaccine-authorization-update">
                  <a href="#" @click.stop.prevent="edit(row)"><i class="iconfont icon-edit"></i>编辑</a>
                </perm>
                <perm label="vaccine-authorization-delete">
                  <a href="#" @click.stop.prevent="removeVaccine(row)"><i class="iconfont icon-delete"></i>删除</a>
                </perm>
              </td>
            </tr>
            </tbody>
          </table>
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
  import { cerpAction, Vaccine, VaccineRights, PurchaseAgreement } from '@/resources';
  export default {
    components: {
      addForm
    },
    data: function () {
      return {
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
          pageSize: 20,
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
        formPara: {}
      };
    },
    computed: {
      bodyHeight: function () {
        return this.$store.state.bodyHeight;
      },
      orgLevel () {
        return this.$store.state.orgLevel;
      }
    },
    mounted () {
      this.getOrgsList(1);
    },
    watch: {
      'typeTxt': function () {
        this.dataRows = [];
        this.orgName = '';
        this.getOrgsList();
      },
      keyWord () {
        this.pickTypeList();
      }
    },
    methods: {
      resetRightBox: function () {
        this.showRight = false;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getOrgsList: function (pageNo, isContinue = false) {
        if (this.orgLevel === 1) {
          this.typePager.currentPage = pageNo;
          let params = Object.assign({}, {
            pageNo: pageNo,
            pageSize: this.pager.pageSize,
            keyWord: this.typeTxt,
            deleteFlag: false,
            status: '1'
          });
          Vaccine.query(params).then(res => {
            if (isContinue) {
              this.showTypeList = this.showTypeList.concat(res.data.list);
            } else {
              this.showTypeList = res.data.list;
              if (this.showTypeList.length !== 0) {
                this.currentItem = res.data.list[0];
                this.orgName = this.showTypeList[0].orgGoodsName;
                this.getPageList();
              } else {
                this.currentItem = Object.assign({'id': ''});
              }
            }
            this.typePager.totalPage = res.data.totalPage;
          });
        } else {
          this.typePager.currentPage = pageNo;
          let params = Object.assign({}, {
            pageNo: pageNo,
            pageSize: this.pager.pageSize,
            keyWord: this.typeTxt
          });
          this.$http.get('/purchase-agreement/valid/second-vaccine/pager', {params}).then(res => {
            if (isContinue) {
              this.showTypeList = this.showTypeList.concat(res.data.list);
            } else {
              this.showTypeList = res.data.list;
              if (this.showTypeList.length !== 0) {
                this.currentItem = res.data.list[0];
                this.orgName = this.showTypeList[0].orgGoodsName;
                this.getPageList();
              } else {
                this.currentItem = Object.assign({'id': ''});
              }
            }
            this.typePager.totalPage = res.data.totalPage;
          });
        }
      },
      getOrgMore: function () {
        this.getOrgsList(this.typePager.currentPage + 1, true);
      },
      queryVaccines (query) {
        let params = Object.assign({}, {
          keyWord: query
        });
        Vaccine.queryLevelVaccine(params).then(res => {
          this.vaccines = res.data.list;
          this.filterPOVs();
        });
      },
      filterPOVs () {
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
      getPageList: function () {
        this.dataRows = [];
        if (!this.currentItem.orgGoodsId) return;
        VaccineRights.queryPovByVaccine(this.currentItem.orgGoodsId).then(res => {
          this.dataRows = res.data;
        });
      },
      refreshDetails () {
        this.getPageList();
        this.showRight = false;
      },
      removeVaccine: function (item) {
        this.$confirm('是否删除POV"' + item.povName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          VaccineRights.deleteVaccine(item.id).then(() => {
            this.getPageList();
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
      bindVaccinePOV () {
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
          this.getPageList();
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '授权疫苗失败'
          });
        });
      },
      showType: function (item) {
        this.orgName = item.orgGoodsName;
        this.currentItem = item;
        this.getPageList();
      },
      add () {
        this.formPara = {};
        this.showRight = true;
      },
      edit (item) {
        this.formPara = item;
        this.showRight = true;
      },
      changeItem (item) {
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
