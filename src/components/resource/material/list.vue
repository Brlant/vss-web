<style lang="scss" scoped>
@import "../../../assets/mixins";

.btn-color {
  a:hover {
    color: $activeColor;
  }
}

.d-table > div.d-table-right {
  padding: 10px 20px;
}

.container {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div>
        <el-row>
          <el-col :span="8" class="search-input"></el-col>
          <el-col :span="10" style="padding-left: 10px"></el-col>
          <el-col :span="6" class="text-right">
                  <span>
                   <span v-show="showSearch" class="btn-search-toggle open">
                      <single-input v-model="filters.keyword" :showFocus="showSearch"
                                    placeholder="请输入物料名称查询"></single-input>
                      <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
                  </span>
                    <a v-show="!showSearch" class="btn-circle" href="#" @click.stop.prevent="showSearch=(!showSearch)">
                        <i class="el-icon-t-search"></i>
                    </a>
                    <perm label="supplies-add">
                        <a class="btn-circle" href="#" @click.stop.prevent="add">
                        <i class="el-icon-t-plus"></i>
                        </a>
                    </perm>
                 </span>
          </el-col>
        </el-row>
      </div>
      <div class="order-list clearfix " style="margin-top: 10px">
        <el-row class="order-list-header">
          <el-col :span="6">物料编号</el-col>
          <el-col :span="6">物料名称</el-col>
          <el-col :span="9">物料描述</el-col>
          <el-col :span="3">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="materials.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in materials" :class="[{'active':currentId==item.id}]"
               class="order-list-item order-list-item-bg">
            <el-row>
              <el-col :span="6" class="R pt10">
                    <span>
                      {{ item.id }}
                    </span>
              </el-col>
              <el-col :span="6" class="R pt10">
                    <span>
                      {{ item.name }}
                    </span>
              </el-col>
              <el-col :span="9" class="R pt10">
                    <span>
                      {{ item.parameters }}
                    </span>
              </el-col>
              <el-col :span="3" class="R pt10 btn-color">
                <perm label="supplies-update">
                  <a href="#" @click.prevent="edit(item)"><i
                    class="el-icon-t-edit"></i>编辑</a>
                </perm>
                <perm label="supplies-delete">
                  <a href="#" @click.prevent="deleteItem(item)"><i
                    class="el-icon-t-delete"></i> 删除</a>
                </perm>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div v-show="pager.count>pager.pageSize && !loadingData" class="text-center">
        <el-pagination
          :current-page="pager.currentPage"
          :pageSize="pager.pageSize" :total="pager.count" layout="prev, pager, next"
          @current-change="getMaPage">
        </el-pagination>
      </div>
    </div>
    <page-right :css="{'width':'1000px','padding':0}" :show="showPart"
                @right-close="resetRightBox">
      <form-part :formItem="form" @close="resetRightBox" @refresh="refresh"></form-part>
    </page-right>
  </div>
</template>
<script>
import {material} from '@/resources';
import formPart from './form.vue';

export default {
  components: {formPart},
  data() {
    return {
      loadingData: true,
      showSearch: false,
      showPart: false,
      materials: [],
      filters: {
        keyword: '',
        deleteFlag: false
      },
      form: {},
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 15
      },
      currentId: ''
    };
  },
  mounted() {
    this.getMaPage(1);
  },
  watch: {
    filters: {
      handler: function () {
        this.getMaPage(1);
      },
      deep: true
    }
  },
  methods: {
    resetRightBox: function () {
      this.showPart = false;
      this.form = {}
    },
    getMaPage(pageNo) { // 得到波次列表
      this.pager.currentPage = pageNo;
      let params = Object.assign({
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      material.query(params).then(res => {
        this.materials = res.data.list;
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
    },
    refresh() {
      this.getMaPage(1);
      this.showPart = false;
    },
    add() {
      this.form = {};
      this.showPart = true;
    },
    edit(item) {
      this.currentId = item.id;
      this.form = item;
      this.showPart = true;
    },
    deleteItem(item) {
      this.$confirm('是否删除物料 "' + item.name + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        material.delete(item.id).then(() => {
          this.$notify.success({
            message: '删除成功'
          });
          this.getMaPage();
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '删除失败'
          });
        });
      });
    }
  }
};
</script>
