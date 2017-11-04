<style lang="less" scoped="">
  @import "../../../assets/mixins";

  .advanced-query-form {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    padding-top: 20px;
  }

  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .pt {
    padding-top: 15px;
  }

  .opera-btn-group {

    border: 2px solid #eeeeee;
    margin: 10px -5px;
    .opera-icon {
      line-height: 50px;
      height: 50px;
      padding: 0 10px;
      border-bottom: 2px solid #eeeeee;
    }
    .switching-icon {
      cursor: pointer;
      .el-icon-arrow-up {
        transition: all .5s ease-in-out;
      }
    }
    &.up {
      .advanced-query-form {
        display: none;
      }
      .opera-icon {
        border-bottom: 0;
      }
      .el-icon-arrow-up {
        transform: rotate(180deg);
      }
    }
  }

  .search-input {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
  }

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
  }

  .btn-color {
    a:hover {
      color: @activeColor;
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="d-table">
        <div class="d-table-right">
          <div>
            <el-row>
              <el-col :span="8" class="search-input"></el-col>
              <el-col :span="10" style="padding-left: 10px"></el-col>
              <el-col :span="6" class="text-right">
                  <span>
                   <span class="btn-search-toggle open" v-show="showSearch">
                      <single-input v-model="filters.keyWord" placeholder="请输入物料名称查询"
                                    :showFocus="showSearch"></single-input>
                      <i class="iconfont icon-search" @click.stop="showSearch=(!showSearch)"></i>
                  </span>
                    <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
                        <i class="iconfont icon-search"></i>
                    </a>
                    <perm label="supplies-add">
                        <a href="#" class="btn-circle" @click.stop.prevent="add">
                        <i class="iconfont icon-plus"></i>
                        </a>
                    </perm>
                 </span>
              </el-col>
            </el-row>
          </div>
          <div class="order-list clearfix " style="margin-top: 10px">
            <el-row class="order-list-header" :gutter="10">
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
            <div v-else="" class="order-list-body flex-list-dom">
              <div class="order-list-item order-list-item-bg" v-for="item in materials"
                   :class="[{'active':currentId==item.id}]">
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
                        class="iconfont icon-edit"></i>编辑</a>
                    </perm>
                    <perm label="supplies-delete">
                      <a href="#" @click.prevent="deleteItem(item)"><i
                        class="iconfont icon-delete"></i> 删除</a>
                    </perm>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
            <el-pagination
              layout="prev, pager, next"
              :total="pager.count" :pageSize="pager.pageSize" @current-change="getMaPage"
              :current-page="pager.currentPage">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showPart" @right-close="resetRightBox"
                :css="{'width':'1000px','padding':0}">
      <form-part :formItem="form" @close="resetRightBox" @refresh="refresh"></form-part>
    </page-right>
  </div>
</template>
<script>
  import { material } from '@/resources';
  import formPart from './form.vue';

  export default {
    components: {formPart},
    data () {
      return {
        loadingData: true,
        showSearch: false,
        showPart: false,
        materials: [],
        filters: {
          keyWord: '',
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
    mounted () {
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
      },
      getMaPage (pageNo) { // 得到波次列表
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
      refresh () {
        this.getMaPage(1);
        this.showPart = false;
      },
      add () {
        this.form = {};
        this.showPart = true;
      },
      edit (item) {
        this.currentId = item.id;
        this.form = item;
        this.showPart = true;
      },
      deleteItem (item) {
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
              message: error.response.data && error.response.data.msg || '删除失败'
            });
          });
        });
      }
    }
  };
</script>
