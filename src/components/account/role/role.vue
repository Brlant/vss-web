<style lang="less" scoped="">


  .margin-left {
    margin-left: 15px;
  }

  .margin-left-right {
    margin-left: 38px;
    margin-right: 38px;
  }

  .role-perm-list {
    h2 {
      font-size: 14px;
      margin: 0;
      padding: 0;
      line-height: 24px;
      font-weight: normal;
    }
    ul {
      margin: 10px 0;

      li {
        padding: 5px 10px;
        display: inline-block;
        border: 1px solid #eee;
        margin-right: 20px;
        margin-bottom: 10px;
        font-size: 12px;
      }
    }
    .group-list {

      border: 1px solid #eee;
      padding: 10px 20px;
      margin: 10px 0;
    }

    .d-table-col-wrap {
      overflow: auto;
    }
  }
</style>
<template>
  <div>
    <div>
      <div class="order-list-status container">
        <div class="status-item" :class="{'active':item.usableStatus==filters.usableStatus}"
             v-for="(item,key) in orgType"
             @click="filters.usableStatus=item.usableStatus">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<!--<span class="status-num">{{item.num}}</span>--></div>
        </div>
      </div>
      <div class="container d-table">
        <div class="d-table-left">
          <h2 class="header">
                <span class="pull-right">
                  <perm label="erp-access-add">
                    <a href="#" class="btn-circle" @click.stop.prevent="addType"><i class="iconfont icon-plus"></i> </a>
                  </perm>
                    <a href="#" class="btn-circle" @click.prevent="searchType"><i
                      class="iconfont icon-search"></i> </a>
                </span>
            角色管理
          </h2>
          <div class="search-left-box" v-show="showTypeSearch">
            <oms-input v-model="filters.keyWord" placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
          </div>
          <div v-if="!currentItem.title" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                  :class="{'active':item.id===currentItem.id}">
                <perm label="erp-access-delete">
                  <oms-remove :item="item" @removed="removeType" :tips='"确认删除角色\""+item.title +"\"?"'
                              class="hover-show"><i
                    class="iconfont icon-delete"></i></oms-remove>
                </perm>
                <div class="id-part">
                  {{item.name }}
                </div>
                <div>
                  {{item.title }}
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="d-table-right">
          <div v-if="!currentItem.title" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <h2 class="clearfix">
              <span class="pull-right">
               <el-button-group>
                 <perm label="erp-access-edit">
                   <el-button @click="edit()">
                     <i class="iconfont icon-edit"></i>
                     编辑
                   </el-button>
                 </perm>
                <perm label="erp-access-edit">
                  <el-button @click="forbid()" v-show="resData.usableStatus == 1">
                    <i class="iconfont icon-forbidden"></i>
                    停用
                  </el-button>
                </perm>
                 <perm label="erp-access-edit">
                   <el-button @click="useNormal()" v-show="resData.usableStatus == 0">
                     <i class="iconfont icon-start"></i>启用
                   </el-button>
                 </perm>
                <perm label="erp-access-delete">
                   <el-button @click="remove()"><i class="iconfont icon-delete"></i>删除</el-button>
                </perm>
                </el-button-group>
              </span>
            </h2>
            <div class="page-main-body">
              <el-row>
                <el-col :span="3" class="text-right">
                  角色名称：
                </el-col>
                <el-col :span="20">
                  {{ resData.title }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3" class="text-right">
                  角色英文名称：
                </el-col>
                <el-col :span="21">
                  {{ resData.name }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3" class="text-right">
                  角色状态：
                </el-col>
                <el-col :span="21">
                  {{ resData.usableStatus == 1 ? '可用' : '停用' }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3" class="text-right">
                  角色描述：
                </el-col>
                <el-col :span="21">
                  {{resData.remark}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="3" class="text-right">
                  角色权限：
                </el-col>
                <el-col :span="24">
                  <div class="role-perm-list">
                    <div class="group-list" v-for="groupItem in permList.tree"
                         v-show="checkGroupItem(groupItem)">
                      <h2>{{permList.menuList[groupItem.parentId]}}</h2>
                      <ul>
                        <li v-for="item in groupItem.children" v-show="checkItem(item)">{{permList.menuList[item]}}</li>
                      </ul>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'1000px'}">
      <role-form :formItem="form" :action="action" @close="showRight=false" :actionType="showRight"
                 @changed="change"></role-form>
    </page-right>
  </div>
</template>
<script>
  import { Access } from '../../../resources';
  import roleForm from './form/form.vue';

  export default {
    components: {roleForm},
    data: function () {
      return {
        showRight: false,
        showTypeRight: false,
        showTypeSearch: false,
        showSearch: false,
        resData: {'permissionList': []},
        typeList: [],
        showTypeList: [],
        form: {},
        action: '',
        roleText: '',
        currentItem: {},
        orgType: {
          0: {'title': '所有', 'num': 8, 'usableStatus': null},
          1: {'title': '正常', 'num': 6, 'usableStatus': 1},
          2: {'title': '停用', 'num': 2, 'usableStatus': 0}
        },
        filters: {
          usableStatus: 1,
          keyWord: ''
        },
        activeStatus: 1
      };
    },
    computed: {
      permList: function () {
        return this.$store.state.permList;
      }
    },
    mounted () {
      this.getPageList();
    },
    watch: {
      filters: {
        handler: function () {
          this.getPageList();
        },
        deep: true
      }
    },
    methods: {
      getPageList: function () {// 查询角色列表
        let param = Object.assign({}, {
          keyword: this.typeTxt,
          deleteFlag: false,
          objectId: 'cerp-system'
        }, this.filters);
        Access.queryERPAccess(param).then(res => {
          this.showTypeList = res.data.list;
          this.typeList = res.data.list;
          this.currentItem = Object.assign({id: ''}, this.showTypeList[0]);
          this.queryRoleDetail(this.currentItem.id);
        });
      },
      queryRoleDetail: function (id) {
        if (!id) return;
        Access.getRoleDetail(id).then(res => {
          this.resData = res.data;
        });
      },
      resetRightBox: function () {
        this.showRight = false;
      },
      addType: function () {
        this.action = 'add';
        this.form = {};
        this.showRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      pickTypeList: function () {
        let arr = [];
        let self = this;
        this.typeList.forEach(function (value) {
          if (value.title.indexOf(self.typeTxt) !== -1) {
            arr.push(value);
          }
        });
        this.showTypeList = arr;
      },
      edit: function () {
        this.action = 'edit';
        this.form = JSON.parse(JSON.stringify(this.resData));
        this.showRight = true;
      },
      forbid: function () {
        this.$confirm('确认停用角色"' + this.resData.title + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let itemTemp = JSON.parse(JSON.stringify(this.resData));
          itemTemp.usableStatus = 0;
          Access.update(itemTemp.id, itemTemp).then(() => {
            this.resData.usableStatus = 0;
            this.getPageList();
            this.$notify.success({
              title: '成功',
              message: '已成功停用角色"' + this.resData.title + '"'
            });
          });
        });
      },
      useNormal: function () {
        this.$confirm('确认启用角色"' + this.resData.title + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let itemTemp = JSON.parse(JSON.stringify(this.resData));
          itemTemp.usableStatus = 1;
          Access.update(itemTemp.id, itemTemp).then(() => {
            this.resData.usableStatus = 1;
            this.getPageList();
            this.$notify.success({
              title: '成功',
              message: '已成功启用角色"' + this.resData.title + '"'
            });
          });
        });
      },
      remove: function () {
        this.$confirm('确认删除角色"' + this.resData.title + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Access.delete(this.resData.id).then(() => {
            this.getPageList();
            this.$notify.success({
              title: '成功',
              message: '已成功删除角色"' + this.resData.title + '"'
            });
          });
        });
      },
      removeType: function (item) {
        Access.delete(item.id).then(() => {
          this.getPageList();
          this.$notify.success({
            title: '成功',
            message: '已成功删除角色"' + item.title + '"'
          });
        });
      },
      showType: function (type) {
        this.currentItem = type;
        this.queryRoleDetail(this.currentItem.id);
      },
      change: function (item) {
        if (this.action === 'add') {
          this.getPageList();
          this.showRight = false;
        } else {
          this.resData = item;
          this.showTypeList.forEach(roleItem => {
            if (roleItem.id === item.id) {
              roleItem.name = item.name;
              roleItem.title = item.title;
            }
          });
          this.showRight = false;
        }
      },
      checkItem: function (item) {
        let visible = false;
        this.resData.permissionList.forEach(function (val) {
          if (val.name === item) {
            visible = true;
            return false;
          }
        });
        return visible;
      },
      checkGroupItem: function (item) {
        let visible = false;
        item.children.forEach(key => {
          if (this.checkItem(key)) {
            visible = true;
            return false;
          }
        });
        if (this.checkItem(item.parentId)) {
          visible = true;
        }
        return visible;
      }
    }
  };
</script>
