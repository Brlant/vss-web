<style lang="less" scoped>

  .el-form .el-select {
    display: block;
  }
  .tr-bg {
    :hover {
       background: #fff;
    }
  }
</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-right">
        <span class="pull-right">
          <span class="btn-search-toggle open" v-show="showSearch">
            <single-input v-model="filters.keyWord" placeholder="请输入关键字搜索"
                          :showFocus="showSearch"></single-input>
            <i class="iconfont icon-search" @click.stop="showSearch=(!showSearch)"></i>
          </span>
          <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
              <i class="iconfont icon-search"></i>
          </a>
          <perm label="org-user-add">
                <a href="#" class="btn-circle" @click.stop.prevent="add">
                    <i class="iconfont icon-plus"></i>
                </a>
          </perm>
        </span>
        <table class="table table-hover">
          <thead>
          <tr>
            <th>姓名</th>
            <th>角色</th>
            <th>手机号码</th>
            <th>邮箱</th>
            <th>状态</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loadingData">
            <td colspan="6" >
              <oms-loading :loading="loadingData"></oms-loading>
            </td>
          </tr>
          <tr v-else-if="dataRows.length == 0">
            <td colspan="6" >
              <div  class="empty-info" >
                暂无信息
              </div>
            </td>
          </tr>
          <tr v-else="" v-for="row in dataRows" :keys="row.id">
            <td>
              {{row.name}}
              <el-tag type="success" v-show="row.adminFlag">主账号</el-tag>
            </td>
            <td>
              {{ row.list | formatRole }}
            </td>
            <td>
              {{row.phone}}
            </td>
            <td>
              {{row.email}}
            </td>

            <td>
              <dict :dict-group="'orgUserStatus'" :dict-key="formatStatus(row.status)"></dict>
            </td>
            <td class="list-op">
              <perm label="org-user-edit">
                <a href="#" @click.stop.prevent="edit(row)" v-show="!row.adminFlag"><i
                  class="iconfont icon-edit"></i>编辑</a>

                <oms-forbid :item="row" @forbided="forbid" :tips='"确认停用用户\""+row.name+"\"?"' v-show="row.status==1">
                  <i class="iconfont icon-forbidden"></i>停用
                </oms-forbid>
                <oms-forbid :item="row" @forbided="useNormal" :tips='"确认启用用户\""+row.name+"\"?"'
                            v-show="row.status==2"><i class="iconfont icon-start" v-show="!row.adminFlag"></i>启用
                </oms-forbid>
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
      <edit-form :formItem="form" :title="formTitle" :action="action" :actionType="showRight" @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>
  </div>

</template>
<script>
  import {OrgUser} from '../../../resources';
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
        dataRows: [],
        typeList: [],
        showTypeList: [],
        typeTxt: '',
        filters: {
          keyWord: '',
          orgId: 0
        },
        form: {list: [{roleId: ''}]},
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
    computed: {
      user () {
        return this.$store.state.user;
      }
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
    mounted () {
      this.getPageList(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getPageList(1);
        },
        deep: true
      },
      user (val) {
        if (val.userCompanyAddress) {
          this.getPageList(1);
        }
      }
    },
    methods: {
      resetRightBox: function () {
        this.showRight = false;
      },
      getPageList: function (pageNo) {
        let orgId = this.user.userCompanyAddress;
        if (!orgId) return;
        this.pager.currentPage = pageNo;
        let data = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyWord: this.filters.keyWord
        });
        this.loadingData = true;
        OrgUser.queryUsers(orgId, data).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      add: function () {
        this.action = 'add';
        this.formTitle = '新增';
        this.form = {
          list: [{roleId: ''}]
        };
        this.showRight = true;
      },
      edit: function (item) {
        this.action = 'edit';
        this.formTitle = '编辑';
        this.oldItem = item;
        this.form = JSON.parse(JSON.stringify(item));
        this.showRight = true;
      },
      forbid: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        itemTemp.status = 2;
        OrgUser.update(itemTemp.id, itemTemp).then(() => {
          item.status = 2;
          this.$notify.success({
            title: '成功',
            message: '已经停用用户"' + itemTemp.name + '"'
          });
        });
      },
      useNormal: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        itemTemp.status = 1;
        OrgUser.update(itemTemp.id, itemTemp).then(() => {
          item.status = 1;
          this.getPageList(1);
          this.$notify.success({
            title: '成功',
            message: '已成功启用用户"' + item.name + '"'
          });
        });
      },
      formatStatus: function (value) {
        if (!value) return '';
        return value.toString();
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
      }
    }
  };
</script>
