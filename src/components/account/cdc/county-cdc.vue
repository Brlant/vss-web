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

      <div class="container">
        <div>
          <el-button type="primary"  @click="bindDistrict">绑定县级CDC</el-button>
        </div>
        <div class="d-table">
          <div class="d-table-right">
            <div>
              <h2 style="overflow: hidden">
            <span class="pull-right">
              <span class="btn-search-toggle open" v-show="showSearch">
                  <single-input v-model="filters.keyWord" placeholder="请输入关键字搜索" :showFocus="showSearch"></single-input>
                  <i class="iconfont icon-search" @click.stop="showSearch=(!showSearch)"></i>
              </span>
              <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                  <i class="iconfont icon-search"></i>
              </a>
            </span>
              </h2>
              <div class="order-list clearfix " style="margin-top: 10px">
                <el-row class="order-list-header" :gutter="10">
                  <el-col :span="6">系统代码</el-col>
                  <el-col :span="6">货主名称</el-col>
                  <el-col :span="4">货主级别</el-col>
                  <el-col :span="4">状态</el-col>
                  <el-col :span="4">操作</el-col>
                </el-row>
                <el-row v-if="loadingData">
                  <el-col :span="24">
                    <oms-loading :loading="loadingData"></oms-loading>
                  </el-col>
                </el-row>
                <el-row v-else-if="dataRows.length == 0">
                  <el-col :span="24">
                    <div class="empty-info">
                      暂无信息
                    </div>
                  </el-col>
                </el-row>
                <div v-else="" class="order-list-body">
                  <div class="order-list-item order-list-item-bg" v-for="row in dataRows">
                    <el-row>
                      <el-col :span="6" class="R pt10">
                    <span>
                       {{row.manufacturerCode}}
                        <el-tag type="success" v-show="row.type === '0' && filters.type===1 ">货主</el-tag>
                    </span>
                      </el-col>
                      <el-col :span="6" class="pt">
                        <span>{{ row.name }}</span>
                      </el-col>
                      <el-col :span="4" class="pt">
                    <span>
                      <dict :dict-group="'orgLevel'" :dict-key="row.level"></dict>
                    </span>
                      </el-col>
                      <el-col :span="4" class="pt">
                        <span v-show="row.deleteFlag">停用</span>
                        <span v-show="!row.deleteFlag">
                    <span
                      v-if="row.auditDto.baseInfoStatus === '1' && row.auditDto.financeStatus === '1' && row.auditDto.warehouseStatus === '1'">
                      正常
                    </span>
                  </span>
                      </el-col>
                      <el-col :span="4" class="pt">
                        <perm label="biz-delete">
                          <a href="#" @click.prevent="forbid(row)" class="margin-left" v-show="!row.deleteFlag"><i
                            class="iconfont icon-forbidden"></i>停用</a>
                          <a href="#" @click.prevent="enableGoods(row)" class="margin-left" v-show="row.deleteFlag"><i
                            class="iconfont icon-start"></i>启用</a>
                        </perm>
                      </el-col>
                    </el-row>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox" :css="{'width':'800px','padding':0}">
      <base-form :formItem="form" :orgTitle="'货主'" @close="showRight=false" :action="action" @change="onSubmit">
      </base-form>
    </page-right>
  </div>

</template>
<script>
  import { BaseInfo, cerpAction, cerpAccess } from '@/resources';
  import Dict from '@/components/common/dict';
  import baseForm from './form/form.vue';
  export default {
    components: {
      Dict,
      baseForm
    },
    data: function () {
      return {
        loadingData: true,
        showRight: false,
        showSearch: false,
        dataRows: [],
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
          keyWord: '',
          type: '',
          deleteFlag: null
        },
        typePage: this.$route.path.substring(1),
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        activeStatus: 0
      };
    },
    mounted () {
      this.getCdcPage(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getCdcPage(1);
        },
        deep: true
      }
    },
    methods: {
      bindDistrict () {
        cerpAccess.bindDistrict().then(() => {
          this.$notify.success({
            message: '绑定CDC成功'
          });
          this.getCdcPage();
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '绑定CDC失败'
          });
        });
      },
      getCdcPage: function (pageNo) {
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        });
        this.loadingData = true;
        cerpAction.queryCount(param).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      resetRightBox: function () {
        this.showRight = false;
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
      remove: function (item) {
        this.$confirm('确认删除' + item.name + '?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          BaseInfo.delete(item.id).then(() => {
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
            this.getCdcPage();
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
            this.getCdcPage();
            this.$notify.success({
              title: '成功',
              message: '已成功启用' + item.name
            });
          });
        });
      },
      onSubmit () {
        if (this.action === 'add') {
          this.getCdcPage(1);
          this.showRight = false;
        }
      }
    }
  };
</script>
