<style lang="scss" scoped>


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
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight">
          <h2 class="header">
          <span class="pull-right">
            <perm label="binding-warehouse-add">
              <a href="#" class="btn-circle" @click.stop.prevent="addType">
                <i class="el-icon-t-plus"></i>
              </a>
            </perm>
          </span>
            仓库地址
          </h2>
          <div v-if="showTypeList.length == 0" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in showTypeList" class="list-item" @click="showType(item)"
                  :class="{'active':item.id==currentItem.id}">
                <div class="id-part">
                  <span v-show="item.default">默认</span>
                  <span class="pull-right">
                    <el-tag type="danger" v-show="item.status==='3'">停用</el-tag>
                    <el-tag type="success" v-show=" item.status==='0'">正常</el-tag>
                </span>
                </div>
                <div>
                  {{item.name }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight">
          <div v-if="showTypeList.length == 0" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <h2 class="clearfix">
                <span class="pull-right">
                  <el-button-group>
                    <perm label="binding-warehouse-update">
                      <el-button @click="edit()" v-show="data.status==='0'"><i
                        class="el-icon-t-edit"></i>编辑</el-button>
                    </perm>
                    <perm label="binding-warehouse-forbid">
                      <el-button @click="remove()" v-show="data.status==='0'||data.status==='1'"><i
                        class="el-icon-t-stop"></i>停用</el-button>
                    </perm>
                    <perm label="binding-warehouse-start">
                      <el-button @click="start()" v-show="data.status==='2'||data.status==='3'"><i
                        class="el-icon-t-start"></i>启用</el-button>
                    </perm>
                  </el-button-group>
                </span>
            </h2>
            <div class="page-main-body">
              <oms-row label="仓库名称" :span="4">
                {{data.name}}
              </oms-row>
              <oms-row label="仓库类型" :span="4">
                {{warehouseType}}
              </oms-row>
              <oms-row label="所属物流公司" :span="4" v-if="data.warehouseType==='0'">
                {{data.warehouseSourceFirmName}}
              </oms-row>
              <oms-row label="物流中心" :span="4" v-show="data.logisticsCentreId">
                {{ data.logisticsCentreName}}
              </oms-row>
              <oms-row label="仓库地址类型" :span="4">
                <dict :dict-group="'orgAddress'" :dict-key="formatAddress"></dict>
              </oms-row>
              <oms-row label="所在地区" :span="4">
                {{ storeAddress }}
              </oms-row>
              <oms-row label="详细地址" :span="4">
                {{ data.detail }}
              </oms-row>
              <oms-row label="联系人" :span="4">
                {{ data.contact }}
              </oms-row>
              <oms-row label="联系电话" :span="4">
                {{ data.telephone }}
              </oms-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <store-part :formItem="formItem" :formType="formType" :actionType="showRight" @change="onSubmit"
                  @right-close="resetRightBox"></store-part>
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
      },
      warehouseType() {
        let warehouseType = '';
        if (this.data.warehouseType === '0') {
          warehouseType = '物流公司仓库';
        } else if ((this.data.warehouseType === '1')) {
          warehouseType = '本地仓库';
        }
        return warehouseType;
      },
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height + 45) + 'px';
        return height;
      }
    },
    mounted() {
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
          auditedStatus: '1',
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
