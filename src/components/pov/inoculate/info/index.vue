<style lang="scss" scoped="">

</style>
<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <perm label="add-inoculator-info">
              <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add">
           <a class="btn-circle" href="#" @click.prevent=""><i
             class="el-icon-t-plus"></i> </a>添加
            </span>
          </perm>

          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" onsubmit="return false"
                 style="padding-top: 10px">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="8" label="姓名">
                <oms-input v-model.trim="searchCondition.inoculatorName" placeholder="请输入姓名" type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="8" label="接种证编号">
                <oms-input v-model.trim="searchCondition.inoculatorNumber" placeholder="请输入接种证编号"
                           type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="8" label="身份证号">
                <oms-input v-model.trim="searchCondition.inoculatorCardNumber" placeholder="请输入身份证号"
                           type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="8" label="出生证号">
                <oms-input v-model.trim="searchCondition.birthCertificateNumber" placeholder="请输入出生证号"
                           type="text"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="5" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="2">姓名</el-col>
          <el-col :span="2">性别</el-col>
          <el-col :span="3">生日</el-col>
          <el-col :span="3">接种证编号</el-col>
          <el-col :span="3">身份证</el-col>
          <el-col :span="3">出生证号</el-col>
          <el-col :span="4">备注</el-col>
          <el-col :span="2">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="!dataList.length">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div v-for="item in dataList" :class="[{'active':currentItem.id===item.id}]" class="order-list-item order-list-item-bg"
               @click.prevent="showItem(item)">
            <el-row>
              <el-col :span="2">
                {{item.inoculatorName}}
              </el-col>
              <el-col :span="2">
                {{item.inoculatorSex}}
              </el-col>
              <el-col :span="3">
                {{item.inoculatorBirthday | date}}
              </el-col>
              <el-col :span="3">
                {{item.inoculatorNumber}}
              </el-col>
              <el-col :span="3">
                {{item.inoculatorCardNumber}}
              </el-col>
              <el-col :span="3">
                {{item.birthCertificateNumber}}
              </el-col>
              <el-col :span="4">
                {{item.inoculatorRemarks}}
              </el-col>
              <el-col :span="2" class="opera-btn">
                <perm label="edit-inoculator-info">
                  <span @click.stop.prevent="editItem(item)">
                      <a class="btn-circle" href="#" @click.prevent=""><i
                        class="el-icon-t-edit"></i></a>
                    编辑
                  </span>
                </perm>
                <!--<perm label="edit-inoculator-info">-->
                <!--<span @click.stop.prevent="deleteItem(item)">-->
                <!--<a href="#" class="btn-circle" @click.prevent=""><i-->
                <!--class="el-icon-t-delete"></i></a>删除-->
                <!--</span>-->
                <!--</perm>-->
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div v-show="pager.count>pager.pageSize && !loadingData" class="text-center">
      <el-pagination
        :current-page="pager.currentPage"
        :pageSize="pager.pageSize" :total="pager.count" layout="prev, pager, next"
        @current-change="queryList">
      </el-pagination>
    </div>

    <page-right :show="!!defaultIndex" @right-close="resetRightBox">
      <add-form :formItem="form" @change="formChange" @close="resetRightBox"></add-form>
    </page-right>
  </div>
</template>
<script>
import AddForm from './form';
import {inoculateInfo} from '@/resources';

export default {
  components: {AddForm},
  data: function () {
    return {
      loadingData: false,
      showSearch: true,
      dataList: [],
      filters: {},
      searchCondition: {
        inoculatorName: '',
        inoculatorNumber: '',
        inoculatorCardNumber: '',
        birthCertificateNumber: ''
      },
      currentItem: {},
      form: {},
      defaultIndex: 0,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      }
    };
  },
  mounted() {
    this.queryList();
  },
  computed: {},
  methods: {
    searchInOrder: function () {// 搜索
      this.searchCondition.createStartTime = this.$formatAryTime(this.expectedTime, 0);
      this.searchCondition.createEndTime = this.$formatAryTime(this.expectedTime, 1);
      Object.assign(this.filters, this.searchCondition);
      this.queryList(1);
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        inoculatorName: '',
        inoculatorNumber: '',
        inoculatorCardNumber: '',
        birthCertificateNumber: ''
      };
      this.expectedTime = '';
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filters, temp);
      this.queryList(1);
    },
    resetRightBox: function () {
      this.defaultIndex = 0;
    },
    add: function () {
      this.form = {};
      this.defaultIndex = 1;
    },
    editItem(item) {
      this.currentItem = item;
      this.form = item;
      this.defaultIndex = 2;
    },
    deleteItem(item) {
      this.$confirm(`是否删除${item.birthCertificateNumber}`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        inoculateInfo.delete(item.id).then(() => {
          this.$notify.success({
            message: `删除${item.birthCertificateNumber}成功`
          });
          this.queryList(1);
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || `删除${item.birthCertificateNumber}失败`
          });
        });
      });
    },
    showItem(item) {
      this.currentItem = item;
    },
    formChange() {
      this.resetRightBox();
      this.queryList();
    },
    queryList: function (pageNo) {
      this.pager.currentPage = pageNo;
      let params = Object.assign({
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      inoculateInfo.query(params).then(res => {
        this.dataList = res.data.list;
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
    }
  }
};
</script>
