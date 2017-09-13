<style lang="less" scoped="">


  .d-table-right {
    .org-name-h2 {
      font-size: 16px;
      font-weight: bold;
    }
  }
</style>
<template>
  <div>
    <div>
      <div class="order-list-status container">
        <div class="status-item" :class="{'active':key==activeStatus,'item-right':item.type===0} "
             v-for="(item,key) in orgStatus" @click="changeType(key,item)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="container d-table">
        <div class="d-table-right">
          <h2>
            <span class="pull-right">
              <span class="btn-search-toggle open" v-show="showSearch">
                  <single-input v-model="filters.keyWord" placeholder="请输入关键字搜索" :showFocus="showSearch"></single-input>
                  <i class="iconfont icon-search" @click.stop="showSearch=(!showSearch)"></i>
              </span>
              <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                  <i class="iconfont icon-search"></i>
              </a>
              <!--<a href="#" class="btn-circle"><i class="iconfont icon-filter"></i> </a>-->
              <perm label="biz-add">
                 <a href="#" class="btn-circle" @click.stop.prevent="add">
                    <i class="iconfont icon-plus"></i>
                </a>
              </perm>
            </span>
            <h2 class="org-name-h2">{{menuTitle}}</h2>
          </h2>
          <div v-if="dataRows.length == 0" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <table class="table table-hover">
              <thead>
              <tr>
                <th>系统代码</th>
                <th>{{ orgTitle }}名称</th>
                <th>{{ orgTitle }}级别</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in dataRows">
                <td>
                  {{row.manufacturerCode}}
                  <el-tag type="success" v-show="row.type === '0' && filters.type===1 ">货主</el-tag>
                </td>
                <td>
                  {{row.name}}
                </td>
                <td>
                  <dict :dict-group="'orgLevel'" :dict-key="row.level"></dict>
                </td>
                <td>
                  <span v-show="row.deleteFlag">停用</span>
                  <span v-show="!row.deleteFlag">
                    <span
                      v-if="row.auditDto.baseInfoStatus === '1' && row.auditDto.financeStatus === '1' && row.auditDto.warehouseStatus === '1'">
                      正常
                    </span>
                  </span>
                </td>
                <td>
                  <perm label="biz-delete">
                    <a href="#" @click.prevent="forbid(row)" class="margin-left" v-show="!row.deleteFlag"><i
                      class="iconfont icon-forbidden"></i>停用</a>
                    <a href="#" @click.prevent="enableGoods(row)" class="margin-left" v-show="row.deleteFlag"><i
                      class="iconfont icon-start"></i>启用</a>
                  </perm>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="text-center" v-show="pager.count>pager.pageSize">
              <el-pagination layout="prev, pager, next"
                             :total="pager.count" :pageSize="pager.pageSize" @current-change="getOrgPage"
                             :current-page="pager.currentPage">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import { BaseInfo } from '@/resources';
  import Dict from '@/components/common/dict';

  export default {
    components: {
      Dict
    },
    data: function () {
      return {
        showRight: false,
        showTypeRight: false,
        showTypeSearch: false,
        showSearch: false,
        data: {},
        dataRows: [],
        typeList: [],
        showTypeList: [],
        typeTxt: '',
        form: {
          address: '',
          adminAccount: '',
          adminEmail: '',
          adminId: '',
          adminName: '',
          adminTelephone: '',
          auditedBy: '',
          auditedStatus: '',
          auditedTime: '',
          contact: '',
          createTime: '',
          createdBy: '',
          creditCode: '',
          defaultCenter: '',
          defaultCentreId: '',
          deleteFlag: false,
          id: '',
          legalRepresentative: '',
          level: '',
          manufacturerCode: '',
          name: '',
          nameJc: '',
          namePhonetic: '',
          orgAuditStatus: '',
          phone: '',
          postcode: '',
          province: '',
          city: '',
          region: '',
          relationList: [],
          remarks: '',
          type: '',
          updateTime: ''
        },
        action: '',
        filters: {
          orgAuditStatus: null,
          keyWord: '',
          type: this.$route.meta.type,
          deleteFlag: null
        },
        typePage: this.$route.path.substring(1),
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        orgStatus: [
          {'title': '所有', 'num': 0, 'type': 1, deleteFlag: null, 'orgAuditStatus': null},
          {'title': '待审核', 'num': 0, 'type': 1, deleteFlag: false, 'orgAuditStatus': 0},
          {'title': '正常', 'num': 0, 'type': 1, deleteFlag: false, 'orgAuditStatus': 1},
          {'title': '停用', 'num': 0, 'type': 1, deleteFlag: true}
        ],
        activeStatus: 0,
        menuTitle: '',
        orgTitle: ''
      };
    },
    mounted () {
      this.getOrgPage(1);
      this.pickTypeList();
      this.setMenuTitle(this.$route.meta.type);

    },
    watch: {
      typeTxt: function () {
        this.pickTypeList();
      },
      filters: {
        handler: function () {
          this.getOrgPage(1);
        },
        deep: true
      },
      '$route': function (val) {// 监听路由变化，改变查询参数
        this.filters.type = val.meta.type;
        this.typePage = val.path.substring(1);
        this.setMenuTitle(this.$route.meta.type);
      }
    },
    methods: {
      queryStatusNum: function (params) {
        BaseInfo.queryStateNum(params).then(res => {
          let data = res.data;
          this.orgStatus[0].num = data['all'];
          this.orgStatus[1].num = data['auditing'];
          this.orgStatus[2].num = data['valid'];
          this.orgStatus[3].num = data['stop'];
        });
      },
      getOrgPage: function (pageNo) {
        // 根据参数，获取单位信息
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        if (param.type === 1) {
          param.type = '';
        }
        BaseInfo.query(param).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
        });
        this.queryStatusNum(param);
      },
      resetRightBox: function () {
        this.showTypeRight = false;
        this.showRight = false;
      },
      addType: function () {
        this.showTypeRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      pickTypeList: function () {
        let arr, self;
        arr = [];
        self = this;
        this.typeList.forEach(function (value) {
          if (value.title.indexOf(self.typeTxt) !== -1) {
            arr.push(value);
          }
        });
        this.showTypeList = arr;
      },
      add: function () {
        this.action = 'add';
        this.form = {
          address: '',
          adminAccount: '',
          adminEmail: '',
          adminId: '',
          adminName: '',
          adminTelephone: '',
          auditedBy: '',
          auditedStatus: '',
          auditedTime: '',
          contact: '',
          createTime: '',
          createdBy: '',
          creditCode: '',
          defaultCenter: '',
          defaultCentreId: '',
          deleteFlag: false,
          id: '',
          legalRepresentative: '',
          level: '',
          manufacturerCode: '',
          name: '',
          nameJc: '',
          namePhonetic: '',
          orgAuditStatus: '',
          phone: '',
          postcode: '',
          province: '',
          city: '',
          region: '',
          relationList: [],
          remarks: '',
          type: '',
          updateTime: ''
        };
        this.showRight = true;
      },
      edit: function () {
        this.action = 'edit';
        this.showRight = true;
      },
      setMenuTitle (type) {// 设置表格的标题
        if (type === 0) {
          this.menuTitle = '货主/厂商管理';
          this.orgTitle = '货主';
        } else {
          this.menuTitle = '业务单位管理';
          this.orgTitle = '单位';
        }
      },
      remove: function (item) {
        this.$confirm('确认删除' + item.name + '?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BaseInfo.delete(item.id).then(() => {
//             this.getOrgPage(1);
            // TODO:更新页面，删除该条数据
            this.$notify.success({
              title: '成功',
              message: '已成功删除单位' + item.name
            });
          });
        });
      },
      forbid: function (item) {// 禁用
        this.$confirm('确认停用 ' + item.name + ' ?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          item.deleteFlag = true;
          BaseInfo.update(item.id, item).then(() => {
            this.getOrgPage();
            this.$notify.success({
              title: '成功',
              message: '已经停用' + item.name
            });
          });
        });
      },
      enableGoods: function (item) {
        this.$confirm('确认启用 ' + item.name + ' ?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          item.deleteFlag = false;
          BaseInfo.update(item.id, item).then(() => {
            this.getOrgPage();
            this.$notify.success({
              title: '成功',
              message: '已成功启用' + item.name
            });
          });
        });
      },
      changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
        this.activeStatus = key;
        this.filters.orgAuditStatus = item.orgAuditStatus !== null ? item.orgAuditStatus : null;
        this.filters.deleteFlag = item.deleteFlag;
        //  this.filters.type = item.type;
      },
      onSubmit () {
        if (this.action === 'add') {
          this.getOrgPage(1);
          this.showRight = false;
        }
      }
    }
  };
</script>
