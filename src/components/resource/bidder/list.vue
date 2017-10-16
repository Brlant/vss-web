<style lang="less" scoped>
  @import "../../../assets/mixins";

  .el-form .el-select {
    display: block;
  }

  .tr-bg {
    :hover {
      background: #fff;
    }
  }

  .tr-right {
    cursor: pointer;
    &:hover, &.active {
      background: @dialog-left-bg;
    }
  }
</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-right">
        <span class="pull-right">
          <span class="btn-search-toggle open" v-show="showSearch">
            <single-input placeholder="请输入关键字搜索"
                          :showFocus="showSearch"></single-input>
            <i class="iconfont icon-search" @click.stop="showSearch=(!showSearch)"></i>
          </span>
          <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
              <i class="iconfont icon-search"></i>
          </a>
          <perm label="successful-bidder-add">
                <a href="#" class="btn-circle" @click.stop.prevent="add">
                    <i class="iconfont icon-plus"></i>
                </a>
          </perm>
        </span>
        <table class="table">
          <thead>
          <tr>
            <th>疫苗名称</th>
            <th>市级CDC</th>
            <th>中标年份</th>
            <th>有效时间</th>
            <th>状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingData">
            <td colspan="6">
              <oms-loading :loading="loadingData"></oms-loading>
            </td>
          </tr>
          <tr v-else-if="dataRows.length == 0">
            <td colspan="6">
              <div class="empty-info">
                暂无信息
              </div>
            </td>
          </tr>
          <tr v-else="" v-for="row in dataRows" :keys="row.id" class="tr-right">
            <td>
              {{row.goodsName}}
            </td>
            <td>
              {{ row.cdcName}}
            </td>
            <td>
              {{row.year}}
            </td>
            <td>
              {{row.expireTime | date}}
            </td>
            <td>
              {{formatStatus(row.availabilityStatus)}}
            </td>
            <td class="list-op">
              <perm label="successful-bidder-update">
                <a href="#" @click.stop.prevent="edit(row)" v-show="!row.adminFlag"><i
                  class="iconfont icon-edit"></i>编辑</a>
              </perm>
              <perm label="successful-bidder-delete">
                <a href="#" @click.stop.prevent="remove(row.id)"><i class="iconfont icon-remove"></i> 删除</a>
              </perm>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="text-center" v-show="pager.count>pager.pageSize">
          <el-pagination
            layout="prev, pager, next"
            :total="pager.count" :pageSize="pager.pageSize" @current-change="getPageList"
            :current-page="pager.currentPage">
          </el-pagination>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <edit-form :formItem="row" :title="formTitle" :action="action" :actionType="showRight" @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>
  </div>

</template>
<script>
  import {OrgUser, http} from '../../../resources';
  import editForm from './form/form.vue';
  import OmsRemove from '../../common/remove.vue';
  import OmsForbid from '../../common/forbid.vue';

  export default {
    components: {
      OmsRemove,
      editForm, OmsForbid
    },
    data: function () {
      return {
        showRight: false,
        showTypeSearch: false,
        showSearch: false,
        loadingData: false,
        row: {},
        dataRows: [],
        typeList: [],
        showTypeList: [],
        typeTxt: '',
        formTitle: '新增',
        oldItem: {},
        action: 'add',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        orgName: '',
        roleMenu: [],
        currentItem: {}
      };
    },
    computed: {},
    mounted() {
      this.getPageList(1);
    },
    watch: {},
    methods: {
      resetRightBox: function () {
        this.showRight = false;
      },
      getPageList: function (pageNo) {
        this.pager.currentPage = pageNo;
        let data = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        });
        this.loadingData = true;
        http.get('successful-bidder', data).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      add: function () {

        this.action = 'add';
        this.formTitle = '新增';
        this.showRight = true;
      },
      edit: function (item) {
        this.action = 'edit';
        this.formTitle = '编辑';
        this.showRight = true;
        this.row = item;
      },
      formatStatus: function (value) {
        if (value === true) return '生效';
        else return '未生效';
      },
      itemChange: function (item) {
        if (this.action === 'add') {
          this.getPageList(1);
          this.showRight = false;
        } else {
          let index = this.dataRows.indexOf(this.oldItem);
          if (index !== -1) {
            this.dataRows.splice(index, 1, item);
          }
          this.showRight = false;
        }
      },
      remove: function (id) {
        http.delete('successful-bidder/' + id, {}).then(() => {
          this.doing = false;
          this.$notify.success({
            duration: 2000,
            name: '成功',
            message: '删除疫苗中标记录成功'
          });
        }).catch(() => {
          this.$notify.error({
            duration: 2000,
            message: '删除疫苗中标记录失败'
          });
          this.doing = false;
        });
        this.getPageList(1);
      }
    }
  };
</script>
