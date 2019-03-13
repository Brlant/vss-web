<style lang="scss" scoped>
  @import "../../../../assets/mixins";

  $font-size-base: 20px;
  .title {
    font-size: $font-size-base;
  }

  .d-table-left {
    min-width: 200px;
    width: 200px;

    .list-item {
      font-size: $font-size-base;
      font-weight: 500;
      padding-right: 10px;

      .id-part {
        font-size: 14px;
      }

      &.active {
        color: $activeHoverColor;

        .id-part {
          color: $activeHoverColor;
        }
      }
    }
  }

  .d-table-right {
    font-size: $font-size-base;
    padding: 10px;

    /*.el-row {*/
    /*margin: 8px 0;*/
    /*}*/

    h2 {
      font-size: $font-size-base;
      /*font-weight: bold;*/
      margin: 6px 10px 14px 10px;
      padding: 6px;
      background: #eee;
      border-left: 10px solid $activeColor;
    }
  }

  .row-mg {
    margin-bottom: 12px;
  }

  .d-table {
    margin-top: 0;
    word-wrap: break-word;
    word-break: break-all;
  }

  .flex-row {
    display: flex;
    align-items: center;
  }

  .col-label {
    color: #777;
    margin-left: 25px;
  }

  .mini-input {
    max-width: 50%;
  }

  .valid-sign {
    height: 36px;
    margin: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffff;

    &.success {
      background: #67C23A;
    }

    &.error {
      background: #f56c6c;
    }
  }

  .el-select {
    display: block;
    width: 50%;
  }
</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-left">
        <h2 class="header">
            <span class="pull-right">
              <a href="#" class="btn-circle" @click.prevent="showSearch = !showSearch"><i class="el-icon-t-search"></i></a>
            </span>
          <span class="title">接种任务</span>
        </h2>
        <div class="d-table-col-wrap" :style="'height:'+ bodyHeight  + 'px'" @scroll="$scrollLoadingData">
          <div class="search-left-box" v-show="showSearch">
            <oms-input v-model="filters.keyWord" placeholder="输入接种证/身份证搜索" :showFocus="showSearch"></oms-input>
          </div>
          <div v-if="!leftList.length" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in leftList" class="list-item" @click="showItem(item)"
                  :class="{'active':item.code===currentItem.code}">
                <div class="id-part">
                  {{item.code }}
                </div>
                <div>
                  {{item.name }}
                </div>
              </li>
            </ul>
          </div>
          <div class="btn-left-list-more">
            <bottom-loading></bottom-loading>
            <div @click.stop="getMore" v-show="!$store.state.bottomLoading">
              <el-button v-show="pager.currentPage<pager.totalPage">加载更多</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <section>
          <h2>接种者信息</h2>
          <oms-row class="row-mg" label="姓名" :span="5">
            {{currentItem.name}}测试战鼓
            <span class="col-label">性别：</span>{{currentItem.sex}}
            <span class="col-label">生日：</span>{{currentItem.date}}
          </oms-row>
          <oms-row class="row-mg" label="接种证编号" :span="5">{{currentItem.inoculateCode}}</oms-row>
          <oms-row class="row-mg" label="身份证" :span="5">{{currentItem.idCard}}</oms-row>
          <oms-row class="row-mg" label="出生证号" :span="5">{{currentItem.lifeCard}}</oms-row>
        </section>
        <section>
          <h2>
            接种任务
          </h2>
          <el-row>
            <el-col :span="12">
              <oms-row class="row-mg" label="登记编号" :span="span">{{currentItem.code}}
                <el-tag type="success">已缴费</el-tag>
              </oms-row>
            </el-col>
            <el-col :span="12">
              <oms-row class="row-mg" label="登记时间" :span="span">2019-01-01 10:10:23</oms-row>
            </el-col>
          </el-row>
          <oms-row class="row-mg" label="疫苗名称" :span="5">{{currentItem.list[0].goodsName}}</oms-row>
          <oms-row class="row-mg" label="规格" :span="5">0.5ml</oms-row>
          <oms-row class="row-mg flex-row" label="批号" :span="5">
            <el-select v-model="form.batchNumberId" filterable remote :remote-method="queryBatchNumbers"
                       placeholder="请选择批号"
                       clearable popper-class="order-good-selects">
              <el-option v-for="item in batchNumberList" :key="item.id" :label="item.batchNumber"
                         :value="item.id"></el-option>
            </el-select>
          </oms-row>
          <oms-row class="row-mg flex-row" label="接种部位" :span="5">
            <el-select type="text" v-model="form.part" placeholder="请选择接种部位">
              <el-option :value="item.key" :key="item.key" :label="item.label"
                         v-for="item in inoculationPositionList"></el-option>
            </el-select>
          </oms-row>
          <oms-row class="row-mg flex-row" label="接种途径" :span="5">
            <el-select type="text" v-model="form.way" placeholder="请选择接种途径">
              <el-option :value="item.key" :key="item.key" :label="item.label"
                         v-for="item in inoculationChannelList"></el-option>
            </el-select>
          </oms-row>
          <oms-row class="row-mg flex-row" label="追溯码" :span="5">
            <el-col :span="12">
              <oms-input v-model="form.code" placeholder="请输入追溯码"></oms-input>
            </el-col>
            <el-col :span="12">
              <div class="valid-sign" :class="{success: form.code, error: !form.code}">
                 <span v-if="form.code">
                <i class="el-icon-success"></i>
                  <span>追溯码校验成功</span>
                </span>
                <span v-else>
                <i class="el-icon-error"></i>
                  <span>追溯码校验失败</span>
                </span>
              </div>
            </el-col>
          </oms-row>
          <oms-row class="row-mg flex-row" :span="5" v-if="form.code">
            <el-button type="primary">确认接种</el-button>
          </oms-row>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
  import methods from '../mixin/methods';

  export default {
    mixins: [methods],
    data: function () {
      return {
        span: 10,
        showSearch: true,
        leftList: [],
        currentItem: {},
        filters: {
          keyWord: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        form: {
          batchNumberId: '',
          part: '',
          code: '',
          way: ''
        }
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height - 20);
        return height;
      },
      user() {
        return this.$store.state.user;
      }
    },
    watch: {
      filters() {
        this.queryList();
      }
    },
    mounted() {
      this.queryList();
      // 全屏
      // this.setElFullScreen();
    },
    methods: {
      queryBatchNumbers(query) {
        this.queryBatchNumberList({
          keyWord: query
        });
      },
      queryList() {
        this.leftList = [
          {
            name: '张三',
            sex: '男',
            date: '2019-01-01',
            inoculateCode: '001',
            idCard: '341222201910000000',
            lifeCard: '341222201910000000',
            code: '341222201910000000',
            doctor: '李医生',
            list: [
              {goodsName: '06070511A/乙脑-蓉生-0.5ml-L-鼠肾5.4Lg冻西', batchNumber: '20190201'}
            ]
          },
          {
            name: '李四',
            sex: '女',
            date: '2019-01-02',
            inoculateCode: '002',
            idCard: '341222201910000001',
            lifeCard: '341222201910000001',
            code: '341222201910000001',
            doctor: '赵医生',
            list: [
              {goodsName: '07060523A/流脑-兰生-0.5ml-D-AC多糖50ug冻西0.5ml', batchNumber: '20190202'}
            ]
          },
          {
            name: '王二',
            sex: '女',
            date: '2019-01-03',
            inoculateCode: '003',
            idCard: '341222201910000002',
            lifeCard: '341222201910000002',
            code: '341222201910000002',
            doctor: '王医生',
            list: [
              {goodsName: '11010510A/麻腮风-上生-0.5ml-L-3+4.3+3Lg冻西', batchNumber: '20190203'}
            ]
          },
          {
            name: '赵五',
            sex: '男',
            date: '2019-01-05',
            inoculateCode: '004',
            idCard: '341222201910000003',
            lifeCard: '341222201910000003',
            code: '341222201910000003',
            doctor: '江医生',
            list: [
              {goodsName: '07060523A/流脑-兰生-稀释液0.5ml', batchNumber: '20190204'}
            ]
          }
        ];
        this.showItem(this.leftList[0]);
      },
      showItem(item) {
        this.currentItem = item;
        this.resetForm();
      },
      resetForm() {
        this.form = {
          batchNumberId: '',
          part: '',
          code: '',
          way: ''
        };
      },
      getMore() {

      },
      addType() {

      },
      setElFullScreen() {
        const root = document.documentElement;
        const fullscreen = root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen;
        fullscreen.call(root);
      }
    }
  };
</script>
