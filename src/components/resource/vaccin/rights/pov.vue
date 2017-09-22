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
            POV列表
          </h2>
          <div class="search-left-box" v-show="showTypeSearch">
            <oms-input v-model="typeTxt" placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
          </div>
          <div v-if="!currentItem.id" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                  :class="{'active':item.id==currentItem.id}">
                <div>
                  {{item.subordinateName }}
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
          <div class="pov-info">
            <el-row class="clearfix font-bold" style="font-weight: 500;font-size: 14px">
              <el-col :span="2" >POV名称:</el-col>
              <el-col :span="10"> {{ orgName }}</el-col>
            </el-row>
          </div>
          <div>
            <el-row>
              <el-col :span="10" class="search-input">
                <el-select filterable remote placeholder="请输入名称搜索疫苗" :remote-method="queryVaccines"
                           :clearable="true"
                           v-model="vaccineId">
                  <el-option :value="item.orgGoodsDto.id" :key="item.orgGoodsDto.id" :label="item.orgGoodsDto.name"
                             v-for="item in vaccines"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3" style="padding-left: 10px">
                <el-button type="primary" @click="bindVaccine">授权疫苗</el-button>
              </el-col>
              <el-col :span="11" class="text-right">
                <!--<span>-->
                  <!--<span style="margin-top: 8px">-->
                     <!--<span class="btn-search-toggle open" v-show="showSearch">-->
                        <!--<single-input v-model="keyWord" placeholder="请输入关键字搜索"-->
                                      <!--:showFocus="showSearch"></single-input>-->
                        <!--<i class="iconfont icon-search" @click.stop="showSearch=(!showSearch)"></i>-->
                     <!--</span>-->
                     <!--<a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">-->
                        <!--<i class="iconfont icon-search"></i>-->
                     <!--</a>-->
                  <!--</span>-->
                <!--</span>-->
              </el-col>
            </el-row>
          </div>
          <table class="table " :class="{'table-hover':dataRows.length !== 0}" style="margin-top: 10px">
            <thead>
            <tr>
              <th>疫苗名称</th>
              <th>疫苗类型</th>
              <th>授权时间</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody v-show="dataRows.length === 0">
            <tr>
              <td colspan="10" class="text-center">
                <div class="empty-info">暂无信息</div>
              </td>
            </tr>
            </tbody>
            <tbody>
            <tr v-for="row in dataRows">
              <td>
                {{row.goodsName}}
              </td>
              <td>
                <dict :dict-group="'vaccineSign'" :dict-key="row.goodsTypeId"></dict>
              </td>
              <td>
                {{ row.time | date }}
              </td>
              <td>
                <perm label="show">
                  <a href="#" @click.stop.prevent="removeVaccine(row)"><i class="iconfont icon-delete"></i>删除</a>
                </perm>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import {cerpAction, Vaccine, VaccineRights } from '@/resources';
  export default {
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
        vaccineId: ''
      };
    },
    computed: {
      bodyHeight: function () {
        return this.$store.state.bodyHeight;
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
        this.typePager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyWord: this.typeTxt
        });
        cerpAction.queryAllPov(params).then(res => {
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            if (this.showTypeList.length !== 0) {
              this.currentItem = res.data.list[0];
              this.orgName = this.showTypeList[0].subordinateName;
              this.getPageList();
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
      queryVaccines (query) {
        let params = Object.assign({}, {
          keyWord: query
        });
        Vaccine.queryLevelVaccine(params).then(res => {
          this.vaccines = res.data.list;
        });
      },
      getPageList: function () {
        this.dataRows = [];
        if (!this.currentItem.subordinateId) return;
        VaccineRights.queryVaccineByPov(this.currentItem.subordinateId).then(res => {
          this.dataRows = res.data;
        });
      },
      removeVaccine: function (item) {
        this.$confirm('是否删除疫苗"' + item.goodsName + '"?', '', {
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
      bindVaccine () {
        let form = {
          'orgGoodsId': this.vaccineId,
          'povId': this.currentItem.subordinateId
        };
        if (!this.form.povId) {
          this.$notify.info({
            message: '请选择疫苗'
          });
          return;
        }
        VaccineRights.save(form).then(() => {
          this.$notify.success({
            message: '授权疫苗成功'
          });
          this.getPageList();
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '授权疫苗失败'
          });
        });
      },
      showType: function (item) {
        this.orgName = item.subordinateName;
        this.currentItem = item;
        this.getPageList();
      }
    }
  };
</script>
