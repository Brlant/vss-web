<style lang="less" scoped>


  .margin-left {
    margin-left: 15px;
  }

  .margin-left-right {
    margin-left: 38px;
    margin-right: 38px;
  }

  .power-style-part {
    margin: 12px 0;
    background-color: rgb(238, 238, 238);
    padding: 12px 10px 10px 10px;
  }

  .el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
  }

  .el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
  }
</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-left">
        <h2 class="header">
          <span class="pull-right">
            <perm label="binding-warehouse-add">
              <a href="#" class="btn-circle" @click.stop.prevent="addType">
                <i class="iconfont icon-plus"></i>
              </a>
            </perm>
              <!--<perm label="show">-->
                <!--<a href="#" class="btn-circle" @click.prevent="searchType">-->
                  <!--<i class="iconfont icon-search"></i>-->
                <!--</a>-->
              <!--</perm>-->
          </span>
          仓库地址
        </h2>
        <!--<div class="search-left-box" v-show="showTypeSearch">-->
          <!--<oms-input v-model="typeTxt" placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>-->
        <!--</div>-->
        <div v-if="showTypeList.length == 0" class="empty-info">
          暂无信息
        </div>
        <div v-else>
          <ul class="show-list">
            <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                :class="{'active':item.id==currentItem.id}">
              <div>
                {{item.name }}
                <span v-show="item.default"
                      style="position: absolute;right:60px;font-size: 12px; color: #888;">默认</span>
                <el-tag type="danger" v-show="item.status==='3'">停用</el-tag>
                <el-tag type="success" v-show=" item.status==='0'">正常</el-tag>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="d-table-right">
        <div v-if="showTypeList.length == 0" class="empty-info">
          暂无信息
        </div>
        <div v-else>
          <h2 class="clearfix">
                <span class="pull-right">
                    <!--  <a href="#" class="btn-circle"><i class="iconfont icon-filter"></i> </a>-->
                  <!--<perm label="show">-->
                    <!--<a href="#" @click.stop.prevent="edit()" v-show="data.status==='0'">-->
                      <!--<i class="iconfont icon-edit"></i>编辑</a>-->
                  <!--</perm>-->
                  <!--<perm label="show">-->
                    <!--<a href="#" @click.prevent="remove()" class="margin-left"-->
                       <!--v-show="data.status==='0'||data.status==='1'"><i-->
                      <!--class="iconfont icon-forbidden"></i>停用</a>-->
                  <!--</perm>-->
                  <!--<perm label="show">-->
                      <!--<a href="#" @click.prevent="start()" class="margin-left"-->
                         <!--v-show="data.status==='2'||data.status==='3'"><i-->
                        <!--class=" iconfont icon-start"></i>启用</a>-->
                  <!--</perm>-->
                  <el-button-group>
                    <perm label="binding-warehouse-update">
                      <el-button @click="edit()" v-show="data.status==='0'"><i
                        class="iconfont icon-edit"></i>编辑</el-button>
                    </perm>
                    <perm label="binding-warehouse-forbid">
                      <el-button @click="remove()" v-show="data.status==='0'||data.status==='1'"><i
                        class="iconfont icon-stop"></i>停用</el-button>
                    </perm>
                    <perm label="binding-warehouse-start">
                      <el-button @click="start()" v-show="data.status==='2'||data.status==='3'"><i
                        class="iconfont icon-start"></i>启用</el-button>
                    </perm>
                  </el-button-group>
                </span>
          </h2>
          <div class="page-main-body">
            <el-row>
              <el-col :span="3" class="text-right">
                仓库名称：
              </el-col>
              <el-col :span="20">
                {{ data.name }}
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-col :span="3" class="text-right">
                仓库地址类型：
              </el-col>
              <el-col :span="21">
                <dict :dict-group="'orgAddress'" :dict-key="formatAddress"></dict>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-col :span="3" class="text-right">
                所在地区：
              </el-col>
              <el-col :span="21">
                {{ storeAddress }}
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
              <el-col :span="3" class="text-right">
                详细地址：
              </el-col>
              <el-col :span="21">
                {{ data.detail }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" class="text-right">
                联系人：
              </el-col>
              <el-col :span="20">
                {{ data.contact }}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="3" class="text-right">
                联系电话：
              </el-col>
              <el-col :span="20">
                {{ data.telephone }}
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <store-part :formItem="formItem" :formType="formType" :actionType="showRight" @change="onSubmit"></store-part>
    </page-right>
  </div>
</template>
<script>
  import storePart from './form/form.vue';
  import {Address} from '../../../resources';
  import utils from '../../../tools/utils';

  export default {
    components: {storePart},
    data: function () {
      return {
        formType: 'add',
        showRight: false,
        showTypeRight: false,
        showTypeSearch: false,
        showSearch: false,
        data: {
          id: '',
          name: '',
          orgId: '',
          contact: '',
          telephone: '',
          default: false,
          type: '',
          detail: ''
        },
        typeList: [],
        showTypeList: [],
        typeTxt: '',
        keyTxt: '',
        action: '',
        currentItem: '',
        formItem: {},
        doing: false
      };
    },
    computed: {
      formatAddress: function () {
        let value = this.data.type;
        return value.toString();
      },
      storeAddress() {
        let province = this.data.province;
        let city = this.data.city;
        let region = this.data.region;
        return utils.formatAddress(province, city, region);
      }
    },
    mounted () {
      this.getPageList();
    },
    watch: {
      'typeTxt': function () {
        this.getPageList();
      }
    },
    methods: {
      resetRightBox: function () {
        this.showRight = false;
      },
      addType: function () {
        this.formType = 'add';
        this.formItem = {};
        this.showRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getPageList: function () {
        let param = Object.assign({}, {
          deleteFlag: false,
          keyword: this.typeTxt
        });
        Address.queryAddress(param).then(res => {
          this.showTypeList = res.data;
          this.typeList = res.data;
          this.data = Object.assign({}, {'id': ''}, this.showTypeList[0]);
          this.currentItem = this.data;
        });
      },
      edit: function () {
        this.formType = 'edit';
        this.formItem = JSON.parse(JSON.stringify(this.data));
        this.oldItem = this.formItem;
        this.formItem.type = this.data.type.toString();
        this.showRight = true;
      },
      remove: function () {
        this.$confirm('确认停用仓库"' + this.data.name + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Address.forbid(this.data.id).then(() => {
            this.getPageList();
            this.$notify.success({
              title: '成功',
              message: '已成功停用仓库"' + this.data.name + '"'
            });
          });
        });
      },
      start: function () {
        this.$confirm('确认启用仓库"' + this.data.name + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Address.start(this.data.id).then(() => {
            this.getPageList();
            this.$notify.success({
              title: '成功',
              message: '已成功启用仓库"' + this.data.name + '"'
            });
          });
        });
      },
      removeType: function () {
        Address.forbid(this.data.id).then(() => {
          this.getPageList();
          this.$notify.success({
            title: '成功',
            message: '已成功停用仓库"' + this.data.name + '"'
          });
        });
      },
      showType: function (item) {
        this.data = item;
        this.currentItem = this.data;
      },
      changeType: function (key) {// 根据当前选中的标签，重置状态等相关参数。
        this.activeStatus = key;
      },
      onSubmit: function (item) {
        if (this.formType === 'add') {
          if (item) {
            // 刷新左侧列表的值
            this.getPageList();
            // 左侧选中
            this.showType(item);
            // 关闭弹出框
            this.resetRightBox();
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '新增仓库信息成功'
            });
          } else {
            this.$notify.error({
              duration: 2000,
              message: '新增仓库信息失败'
            });
          }
        } else {
          if (item) {
            // 刷新左侧列表的值
            this.getPageList();
            // 左侧选中
            this.showType(item);
            // 关闭弹出框
            this.resetRightBox();
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '修改仓库"' + this.formItem.name + '"信息成功'
            });
          } else {
            this.$notify.error({
              duration: 2000,
              message: '修改仓库"' + this.formItem.name + '"信息失败'
            });
          }
        }
      }

    }
  };
</script>
