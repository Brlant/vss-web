<style lang="less" scoped>
  @leftWidth: 260px;
  .content-part {
    .content-left {
      width: @leftWidth;
      text-align: center;
      .show-item {
        width: @leftWidth;
        padding: 15px 0;
        text-align: left;
        cursor: pointer;
        &.active, &:hover {
          background: #fff;
        }
        .btn-circle:hover {
          color: #333;
        }
      }
    }
    .content-right {
      > h3 {
        left: @leftWidth;
      }
      left: @leftWidth;
    }
  }

  .btn-bg-mr {
    margin-left: 10px;
    margin-right: 15px;
    background: #fff;
  }

  .content-padding {
    padding-left: 40px;
    padding-right: 40px;
  }

  .search-btn {
    width: 200px;
    margin: 10px auto;
    background: #fff;
    input {
      width: 160px;
    }
    &:hover {
      background: #fff;
    }
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">指派上架人员</h2>
        <span class="btn-search-toggle open search-btn clearfix">
                  <single-input placeholder="请输入名称搜索" :showFocus="true" v-model="keyWord"></single-input>
                  <i class="wms-font wms-font-search"></i>
        </span>
        <ul class="show-list ul-position">
          <li class="show-item" v-for="item in operators" :key="item.id" :class="{active: activeId === item.id }"
              @click="showTasks(item)">
            <a href="#" class="btn-circle btn-bg-mr" @click.prevent=""><i
              class="wms-font wms-font-detail" @click.prevent=""></i></a>{{ item.name }}
          </li>
        </ul>
        <div class="opera-btn">
          <div type="primary" class="btn" @click="onSubmit">指派任务</div>
        </div>
      </div>
      <div class="content-right content-padding">
        <h3></h3>
        <span v-show="operatorName">{{ operatorName }}的任务清单</span>
        <div class="order-list" style="margin-top: 20px">
          <el-row class="order-list-header" :gutter="10">
            <el-col :span="7">货主订单ID</el-col>
            <el-col :span="4">指派人</el-col>
            <el-col :span="6">指派时间</el-col>
            <el-col :span="4">作业量</el-col>
            <el-col :span="3">状态</el-col>
          </el-row>
          <el-row v-if="loadingData">
            <el-col :span="24">
              <oms-loading :loading="loadingData"></oms-loading>
            </el-col>
          </el-row>
          <el-row v-else-if="tasks.length == 0">
            <el-col :span="24">
              <div class="empty-info">
                暂无信息
              </div>
            </el-col>
          </el-row>
          <div v-else="" class="order-list-body">
            <div class="order-list-item order-list-item-bg" v-for="item in tasks">
              <el-row>
                <el-col :span="7">
                  {{ item.id }}
                </el-col>
                <el-col :span="4">
                  {{ item.creatorName }}
                </el-col>
                <el-col :span="6">
                  {{ item.createTime | date }}
                </el-col>
                <el-col :span="4">
                  {{ item.count }}
                </el-col>
                <el-col :span="3">
                  {{ getInWorkStatus(item) }}
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
          <el-pagination
            layout="prev, pager, next"
            :total="pager.count" :pageSize="pager.pageSize" @current-change="getOneTacks"
            :current-page="pager.currentPage">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {InWork} from '@/resources';
  import utils from '@/tools/utils';

  export default {
    props: {
      orderId: {
        type: String
      },
      showPartIndex: String
    },
    data() {
      return {
        activeId: '',
        keyWord: '',
        operators: [],
        loadingData: false,
        tasks: [],
        operatorName: '',
        form: {
          userId: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        }
      };
    },
    mounted() {
      this.queryOperator();
    },
    watch: {
      keyWord() {
        this.queryOperator();
      },
      showPartIndex(val) {
        this.operators = [];
        this.keyWord = '';
        this.tasks = [];
        if (val !== '3') return;
        this.queryOperator();
      }
    },
    methods: {
      showTasks(item) {
        this.activeId = item.id;
        this.operatorName = item.name;
        this.getOneTacks(1);
      },
      queryOperator() { // 查询操作人员列表
        let params = {
          keyWord: this.keyWord,
          pageSize: 6
        };
        InWork.queryOperator(params).then(res => {
          this.operators = res.data.list;
          this.tasks = [];
          this.activeId = '';
          this.operatorName = '';
          if (!this.operators.length) return;
          this.activeId = this.operators[0].id;
          this.operatorName = this.operators[0].name;
          this.getOneTacks(1);
        });
      },
      getOneTacks(pageNo) { // 得到任务列表
        if (!this.activeId) {
          this.tasks = [];
          return;
        }
        let params = {
          operator: this.activeId,
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        };
        this.loadingData = true;
        InWork.queryOperatorOrders(params).then(res => {
          this.tasks = res.data.list;
          this.loadingData = false;
        });
      },
      getInWorkStatus: function (order) { // 获取订单状态
        let state = '';
        for (let key in utils.inType) {
          if (order.status.toString() === utils.inType[key].state) {
            state = utils.inType[key].title;
          }
        }
        return state;
      },
      onSubmit() {
        this.form.userId = this.activeId;
        if (!this.form.userId) {
          this.$notify.info({
            message: '请选择上架人员'
          });
          return;
        }
        InWork.allotShelfMan(this.orderId, this.form).then(() => {
          this.$notify.success({
            message: '指派上架人员成功'
          });
          this.$emit('close');
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '指派上架人员失败'
          });
        });
      }
    }
  };
</script>
