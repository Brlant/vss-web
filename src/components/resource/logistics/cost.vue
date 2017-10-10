<style lang="less" scoped="">
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

  .costs {
    font-size: 16px;
    .oms-row {
      margin-bottom: 10px;
    }
  }
</style>
<template>
  <div class="order-page">
    <div class="container">

      <div class="d-table">

        <div class="d-table-right">
          <div style="overflow: hidden">
            <perm label="cerp-logistics-cost-add">
                <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="add" v-if="!cost">
              <a href="#" class="btn-circle" @click.prevent=""><i class="iconfont icon-plus"></i> </a>
            </span>
            </perm>
            <perm label="cerp-logistics-cost-update">
                <span class="pull-right cursor-span" style="margin-left: 10px" @click.prevent="edit" v-if="cost">
              <a href="#" class="btn-circle" @click.prevent=""><i class="iconfont icon-edit"></i> </a>
            </span>
            </perm>
          </div>
          <div class=" costs clearfix " style="margin-top: 10px">
            <el-row v-if="loadingData">
              <el-col :span="24">
                <oms-loading :loading="loadingData"></oms-loading>
              </el-col>
            </el-row>
            <div v-else="">
              <oms-row label="市级CDC名称" :span="5">{{ cost.orgName }}</oms-row>
              <oms-row label="物流费用" :span="5"><span v-show="cost.price">￥</span>{{ cost.price }}</oms-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showItemRight" @right-close="resetRightBox" :css="{'width':'1000px','padding':0}">
      <add-form :formItem="form" :formType="action" @close="resetRightBox"></add-form>
    </page-right>
  </div>
</template>
<script>
  import addForm from './form.vue';
  import {http} from '../../../resources';

  export default {
    components: {
      addForm
    },
    data () {
      return {
        loadingData: true,
        cost: {},
        showItemRight: false,
        form: {},
        action: ''
      };
    },
    mounted () {
      this.queryCosts();
    },
    methods: {
      queryCosts () {
        this.cost = {};
        this.loadingData = true;
        http.get('/logistics-cost/municipal').then(res => {
          this.cost = res.data;
          this.loadingData = false;
        });
      },
      edit: function () {
        this.action = 'edit';
        this.form = JSON.parse(JSON.stringify(this.cost));
        this.showItemRight = true;
      },
      resetRightBox () {
        this.showItemRight = false;
        this.queryCosts();
      },
      add () {
        this.action = 'add';
        this.showItemRight = true;
      }
    }
  };
</script>
