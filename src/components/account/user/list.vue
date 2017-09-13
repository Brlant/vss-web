<style lang="less" scoped="">


  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <div>
      <div class="order-list-status container">
        <div class="status-item" :class="{'active':item.status==filters.status}"
             v-for="(item,key) in orgType"
             @click="filters.status=item.status">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
      </div>
    </div>
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
                <perm label="platform-user-add">
                <a href="#" class="btn-circle" @click.stop.prevent="add">
                <i class="iconfont icon-plus"></i>
                </a>
                </perm>
                </span>
        <div v-if="dataRows.length == 0" class="empty-info">
          暂无信息
        </div>
        <div v-else>
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

            <tr v-for="row in dataRows">
              <td>
                {{row.name}}
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
                <perm label="platform-user-edit">
                  <a href="#" @click.stop.prevent="edit(row)"><i class="iconfont icon-edit"></i>编辑</a>
                  <oms-forbid :item="row" @forbided="forbid" :tips='"确认停用平台用户\""+row.name +"\"?"'
                              v-show="row.status==1"><i
                    class="iconfont icon-forbidden"></i>停用
                  </oms-forbid>
                  <oms-forbid :item="row" @forbided="useNormal" :tips='"确认启用平台用户\""+row.name +"\"?"'
                              v-show="row.status==2"><i
                    class="iconfont icon-start"></i>启用
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
    </div>

    <page-right :show="showRight" @right-close="resetRightBox">
      <edit-form :formItem="form" :title="formTitle" :action="action" :actionType="showRight" @close="showRight=false"
                 @change="itemChange"></edit-form>
    </page-right>
  </div>

</template>
<script>
  import { User } from '../../../resources';
  import bgBox from '../../common/bgbox.vue';
  import OmsRemove from '../../common/remove.vue';
  import OmsForbid from '../../common/forbid.vue';
  import editForm from './form/form.vue';

  export default {
    components: {
      OmsRemove, bgBox, OmsForbid, editForm
    },
    data: function () {
      return {
        showTypeRight: false,
        showRight: false,
        showTypeSearch: false,
        showSearch: false,
        dataRows: [],
        filters: {
          keyWord: '',
          status: null
        },
        orgType: {
          0: {'title': '所有', 'num': '', 'status': null},
          1: {'title': '正常', 'num': '', 'status': 1},
          2: {'title': '未激活', 'num': '', 'status': 0},
          3: {'title': '停用', 'num': '', 'status': 2}
        },
        activeStatus: 1,
        changeStatus: 4,
        form: {list: [{roleId: ''}]},
        formTitle: '',
        oldItem: {},
        action: 'add',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        }
      };
    },
    mounted () {
      this.getPageList(1);
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
    watch: {
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
      addType: function () {
        this.showTypeRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getPageList: function (pageNo) {
        this.pager.currentPage = pageNo;
        let data = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          objectId: 'wms-system'
        });
        User.query(data).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
        });
      },
      add: function () {
        this.action = 'add';
        this.form = {list: [{roleId: ''}]};
        this.formTitle = '新增';
        this.showRight = true;
      },
      edit: function (item) {
        this.action = 'edit';
        this.oldItem = item;
        this.formTitle = '编辑';
        this.form = JSON.parse(JSON.stringify(item));
        this.showRight = true;
      },
      forbid: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        this.changeStatus = 2;
        itemTemp.status = 2;
        User.update(itemTemp.id, itemTemp).then(() => {
          item.status = 2;
          this.getPageList(1);
          this.$notify.success({
            title: '成功',
            message: '已成功停用平台用户"' + item.name + '"'
          });
        });
      },
      useNormal: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        this.changeStatus = 1;
        itemTemp.status = 1;
        User.update(itemTemp.id, itemTemp).then(() => {
          item.status = 1;
          this.getPageList(1);
          this.$notify.success({
            title: '成功',
            message: '已成功启用平台用户"' + item.name + '"'
          });
        });
      },
      itemChange: function () {
        if (this.action === 'add') {
          let self = this;
          self.getPageList(1);
          self.showRight = false;
        } else {
          let index = this.dataRows.indexOf(this.oldItem);
          this.dataRows.splice(index, 1, this.form);
          this.showRight = false;
        }
      },
      formatStatus: function (value) {
        if (!value) return '';
        return value.toString();
      }
    }
  };
</script>
