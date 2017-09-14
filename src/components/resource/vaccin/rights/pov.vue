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
    margin-bottom: 30px;
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
            <span class="pull-right" style="margin-top: 8px">
             <perm label="show">
               <a href="#" class="margin-left">
                 <i class="iconfont icon-verify"></i> 审核
               </a>
              </perm>
               <perm label="show" style="margin-left: 10px">
                  <a href="#" class="margin-left">
                    <i class="iconfont icon-delete"></i> 删除
                  </a>
               </perm>
            </span>
            <el-row class="clearfix font-bold">
              <el-col :span="2">POV名称:</el-col>
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
                <el-button type="primary">授权疫苗</el-button>
              </el-col>
              <el-col :span="11" class="text-right">
                <span>
                  <span style="margin-top: 8px">
                     <span class="btn-search-toggle open" v-show="showSearch">
                        <single-input v-model="filters.keyWord" placeholder="请输入关键字搜索" :showFocus="showSearch"></single-input>
                        <i class="iconfont icon-search" @click.stop="showSearch=(!showSearch)"></i>
                     </span>
                     <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                        <i class="iconfont icon-search"></i>
                     </a>
                  </span>
                </span>
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
                {{row.name}}
              </td>
              <td>
                <dict :dict-group="'orgUserStatus'" :dict-key="row.status"></dict>
              </td>
              <td>
                {{ row.list | formatRole }}
              </td>
              <td class="list-op">
                <perm label="show">
                  <a href="#" @click.stop.prevent="edit(row)"><i class="iconfont icon-delete"></i>删除</a>
                </perm>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="text-center" v-show="pager.count>pager.pageSize">
            <el-pagination layout="prev, pager, next"
                           :total="pager.count"
                           :pageSize="pager.pageSize"
                           @current-change="getPageList"
                           :current-page="pager.currentPage">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import { BaseInfo, cerpAction, Vaccine } from '@/resources';
  import ElCol from 'element-ui/packages/col/src/col';

  export default {
    components: {ElCol},
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
          orgId: '',
          keyWord: ''
        },
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
    filters: {
      formatRole: function (list) {
        let value = '';
        if (list.length > 0) {
          value = list[0].title;
        }
        return value;
      }
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
      filters: {
        handler: function () {
          this.getPageList(1);
        },
        deep: true
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
              this.filters.orgId = this.currentItem.orgId;
            } else {
              this.currentItem = Object.assign({'id': ''});
              this.filters.orgId = '';
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
        Vaccine.query(params).then(res => {
          this.vaccines = res.data.list;
        });
      },
      getPageList: function (pageNo) {
        this.dataRows = [];
        if (!this.filters.orgId) return;
        this.pager.currentPage = pageNo;
//        let data = Object.assign({}, {
//          pageNo: pageNo,
//          pageSize: this.pager.pageSize
//        }, this.filters);
//        OrgUser.queryOrgInfo(this.filters.orgId, data).then(res => {
//          this.dataRows = res.data.list;
//          this.pager.count = res.data.count;
//        });
      },
      removeType: function (item) {
        BaseInfo.delete(item.id).then(() => {
          this.getOrgsList();
          this.$notify.success({
            title: '成功',
            message: '已成功删除货主用户"' + item.name + '"'
          });
        });
      },
      bindVaccine () {
      },
      showType: function (item) {
        this.filters.orgId = item.id;
        this.orgName = item.subordinateName;
        this.currentItem = item;
      }
    }
  };
</script>
