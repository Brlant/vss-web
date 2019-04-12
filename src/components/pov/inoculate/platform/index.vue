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
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffff;
    padding: 10px 0;

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

    &.is-large {
      width: 100%;
    }
  }
</style>
<style lang="scss">
  .flex-row-col {
    .el-col-19 {
      display: flex;
      align-items: center;
    }
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
            <oms-input v-model="filters.keyword" placeholder="输入登记编号搜索" :showFocus="showSearch"></oms-input>
          </div>
          <div v-if="!leftList.length" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <ul class="show-list">
              <li v-for="item in leftList" class="list-item" @click="showItem(item)"
                  :class="{'active':item.id===currentItemId}">
                <div class="id-part">
                  {{item.inoculatorNumber }}
                </div>
                <div>
                  {{item.inoculatorName }}
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
      <div class="d-table-right" v-loading="loading">

        <section>
          <h2>受种者信息</h2>
          <div v-if="!currentItem.inoculatorInfoDto" class="empty-info mini">
            暂无信息
          </div>
          <div v-else>
            <oms-row class="row-mg" label="姓名" :span="5">
              {{currentItem.inoculatorInfoDto.inoculatorName}}
              <span class="col-label">性别：</span>{{currentItem.inoculatorInfoDto.inoculatorSex}}
              <span class="col-label">生日：</span>{{currentItem.inoculatorInfoDto.inoculatorBirthday | date}}
            </oms-row>
            <oms-row class="row-mg" label="接种证编号" :span="5"
                     v-show="currentItem.inoculatorInfoDto.inoculateCode">
              {{currentItem.inoculatorInfoDto.inoculateCode}}
            </oms-row>
            <oms-row class="row-mg" label="身份证" :span="5"
                     v-show="currentItem.inoculatorInfoDto.inoculatorCardNumber">
              {{currentItem.inoculatorInfoDto.inoculatorCardNumber}}
            </oms-row>
            <oms-row class="row-mg" label="出生证号" :span="5"
                     v-show="currentItem.inoculatorInfoDto.birthCertificateNumber">
              {{currentItem.inoculatorInfoDto.birthCertificateNumber}}
            </oms-row>
          </div>
        </section>
        <section>
          <h2>接种任务</h2>
          <div v-if="!currentItem.injectionTaskDto" class="empty-info mini">
            暂无信息
          </div>
          <div v-else>
            <el-row>
              <el-col :span="12">
                <oms-row class="row-mg" label="登记编号" :span="span">{{currentItem.injectionTaskDto.inoculatorNumber}}
                  <!--<el-tag type="success" v-show="currentItem.injectionTaskDto.payCostType === 1">已缴费</el-tag>-->
                  <!--<el-tag type="warning" v-show="currentItem.injectionTaskDto.payCostType === 0">未缴费</el-tag>-->
                </oms-row>
              </el-col>
              <el-col :span="12">
                <oms-row class="row-mg" label="登记时间" :span="span">{{currentItem.injectionTaskDto.registrationTime |
                  time}}
                </oms-row>
              </el-col>
            </el-row>
            <oms-row class="row-mg" label="疫苗名称" :span="5">{{currentItem.injectionTaskDto.orgGoodsName}}</oms-row>
            <oms-row class="row-mg" label="生产厂商" :span="5">{{currentItem.injectionTaskDto.origin}}</oms-row>
            <el-row>
              <el-col :span="12">
                <oms-row class="row-mg" label="规格" :span="10">{{currentItem.injectionTaskDto.specification}}</oms-row>
              </el-col>
              <el-col :span="12">
                <oms-row class="row-mg" label="疫苗种类" :span="10">
                  <dict dict-group="orderGoodsType" :dict-key="'' + currentItem.injectionTaskDto.vaccineSign"></dict>
                </oms-row>
              </el-col>
            </el-row>
            <oms-row class="row-mg" label="接种途径" :span="5">
              <dict :dict-group="'inoculationChannel'"
                    :dict-key="currentItem.injectionTaskDto.inoculationChannel"></dict>
            </oms-row>
            <oms-row class="row-mg flex-row flex-row-col" label="批号" :span="5">
              <el-col :span="12">
                <el-select class="is-large" v-model="form.batchNumberId" filterable remote
                           :remote-method="queryBatchNumbers"
                           placeholder="请选择批号" @change="batchNumberIdChange"
                           clearable popper-class="order-good-selects" :disabled="validating">
                  <el-option v-for="item in batchNumberList" :key="item.batchNumberId" :label="item.batchNumber"
                             :value="item.batchNumberId">
                    <div>{{item.batchNumber}}</div>
                    <div class="font-gray">剩余剂次：{{item.qualifiedBizServings}}</div>
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="12">
                <oms-row label="剩余剂次" :span="14" v-show="form.batchNumberId && form.qualifiedBizServings">
                  {{form.qualifiedBizServings}}
                </oms-row>
              </el-col>
            </oms-row>
            <oms-row class="row-mg flex-row flex-row-col" label="接种部位" :span="5">
              <el-col :span="12">
                <el-select style="width: 100%" type="text" v-model="form.inoculationPosition" placeholder="请选择接种部位">
                  <el-option :value="item.key" :key="item.key" :label="item.label"
                             v-for="item in inoculationPositionList"></el-option>
                </el-select>
              </el-col>
              <el-col :span="12" v-if="currentItem.injectionTaskDto.maximumOfPeople > 1">
                <oms-row label="是否新开瓶" label-width="90px">
                  <el-switch
                    v-model="form.newInoculationStatus"
                    active-text="是" :disabled="validating"
                    :active-value="1" :inactive-value="0"
                    inactive-text="否" @change="newInoculationStatusChange">
                  </el-switch>
                </oms-row>
              </el-col>
            </oms-row>
            <oms-row class="row-mg flex-row" label="追溯码" :span="5">
              <el-col :span="12">
                <oms-input v-model="form.actualCode" placeholder="请输入追溯码" @blur="validCode"
                           :disabled="validating"></oms-input>
              </el-col>
              <el-col :span="12">
                <!--<div class="valid-sign" :class="{success: validSign, error: !validSign}">-->
                <!--<span v-if="validSign">-->
                <!--<i class="el-icon-success"></i>-->
                <!--<span>追溯码校验成功</span>-->
                <!--</span>-->
                <!--<span v-else>-->
                <!--<i class="el-icon-error"></i>-->
                <!--<span>追溯码校验失败追溯码校验失败追溯码校验失败追溯码校验失败追溯码校验失败追溯码校验失败追溯码校验失败</span>-->
                <!--</span>-->
                <!--</div>-->
              </el-col>
            </oms-row>
            <oms-row class="row-mg" label="" :span="5" v-if="validating">
              <el-button :loading="validating" type="success">正在校验追溯码</el-button>
            </oms-row>
            <oms-row class="row-mg flex-row" label="" :span="5" v-if="typeof validSign === 'boolean'">

              <div class="valid-sign" :class="{success: validSign, error: !validSign}">
              <span v-if="validSign">
                <i class="el-icon-success"></i>
                  <span>追溯码校验成功</span>
              </span>
                <span v-else="">
                <i class="el-icon-error"></i>
                  <span>{{errorDetail.title}}</span>
                </span>
              </div>
            </oms-row>
            <perm label="confirm-vaccination-task">
              <oms-row class="row-mg flex-row" label="" :span="5" v-if="validSign">
                <el-button class="el-button-large" type="primary" @click="confirmTask(0)" :doing="doing">确认接种
                </el-button>
                <!--<el-button type="primary" @click="confirmTask(1)" :doing="doing"-->
                <!--v-if="currentItem.injectionTaskDto.maximumOfPeople === 1">新开瓶接种-->
                <!--</el-button>-->
              </oms-row>
            </perm>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
  import methods from '../mixin/methods';
  import {inoculateTask} from '@/resources';

  export default {
    mixins: [methods],
    data: function () {
      return {
        span: 10,
        showSearch: true,
        leftList: [],
        currentItem: {},
        currentItemId: '',
        filters: {
          keyword: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        form: {
          batchNumberId: '',
          inoculationPosition: '',
          actualCode: '',
          qualifiedBizServings: null,
          newInoculationStatus: 0
        },
        loading: false,
        validating: false,
        doing: false,
        validSign: null,
        errorDetail: {}
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
      filters: {
        handler() {
          this.queryList(1);
        },
        deep: true
      }
    },
    mounted() {
      this.queryList(1);
      // 全屏
      // this.setElFullScreen();
    },
    methods: {
      queryBatchNumbers(query) {
        this.getStockAndBatchNumber({
          before: (params) => {
            params.orgGoodsId = this.form.orgGoodsId;
            params.keyWord = query;
          },
          success: (res) => {
            this.batchNumberList = res.data.filter(f => f.qualifiedBizServings).sort((pre, cur) => pre.expiryDate - cur.expiryDate);
          }
        });
      },
      queryList(pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          status: '0'
        }, this.filters);
        this.loadingData = true;
        inoculateTask.query(params).then(res => {
          this.$store.commit('initBottomLoading', false);
          if (isContinue) {
            this.leftList = this.leftList.concat(res.data.list);
          } else {
            this.leftList = res.data.list;
            this.leftList[0] && this.showItem(this.leftList[0]);
          }
          this.pager.totalPage = res.data.totalPage;
          this.loadingData = false;
        });
      },
      showItem(item) {
        this.validSign = null;
        this.errorDetail = {};
        this.currentItemId = item.id;
        this.loading = true;
        this.currentItem = {};
        inoculateTask.queryDetail(item.id).then(res => {
          this.loading = false;
          this.currentItem = res.data;
          this.form.inoculationPosition = res.data.injectionTaskDto.inoculationPosition;
          this.form.batchNumberId = res.data.injectionTaskDto.batchNumberId;
          this.form.batchNumber = res.data.injectionTaskDto.batchNumber;
          this.form.erpStockId = res.data.injectionTaskDto.erpStockId;
          this.form.newInoculationStatus = res.data.injectionTaskDto.newInoculationStatus;
          this.batchNumberList = [
            {
              id: res.data.injectionTaskDto.batchNumberId,
              batchNumber: res.data.injectionTaskDto.batchNumber
            }
          ];
          this.queryBatchNumbers(res.data.injectionTaskDto.batchNumber);
        }).catch(e => {
          this.loading = false;
        });
        this.resetForm();
      },
      resetForm() {
        this.form = {
          batchNumberId: '',
          inoculationPosition: '',
          actualCode: '',
          qualifiedBizServings: null,
          newInoculationStatus: 0
        };
      },
      getMore() {
        this.queryList(this.pager.currentPage + 1, true);
      },
      batchNumberIdChange(val) {
        this.form.qualifiedBizServings = '';
        this.form.erpStockId = '';
        this.form.batchNumber = '';
        if (!val) return;
        let item = this.batchNumberList.find(f => f.batchNumberId === val);
        this.form.batchNumber = item.batchNumber;
        this.form.qualifiedBizServings = item.qualifiedBizServings;
        this.form.erpStockId = item.id;
        this.validCode();
      },
      newInoculationStatusChange() {
        this.validCode();
      },
      validCode() {
        this.validSign = null;
        if (!this.form.batchNumberId) return;
        if (!this.form.actualCode) return;
        // 校验追溯码和批号
        let params = {
          batchNumberId: this.form.batchNumberId,
          code: this.form.actualCode,
          newInoculationStatus: this.form.newInoculationStatus
        };
        // 人份大于1, 校验是否新开瓶
        if (this.currentItem.injectionTaskDto.maximumOfPeople > 1) {
          params.newInoculationStatus = this.form.newInoculationStatus;
        }
        this.validating = true;
        inoculateTask.reviewCode(params).then(res => {
          this.validating = false;
          this.validSign = res.data.passFlag;
          this.errorDetail = res.data;
        }).catch(() => {
          this.validating = false;
          this.$notify.error({
            message: '校验错误'
          });
        });
      },
      confirmTask(val) {
        if (this.doing) return;
        if (!this.form.batchNumberId) {
          return this.$notify.info('请选择批号');
        }
        if (!this.form.inoculationPosition) {
          return this.$notify.info('请选择接种部位');
        }
        if (!this.form.actualCode) {
          return this.$notify.info('请输入追溯码');
        }
        this.form.id = this.currentItem.injectionTaskDto.id;
        // 人份等于1, 校验是否新开瓶
        if (this.currentItem.injectionTaskDto.maximumOfPeople === 1) {
          this.form.newInoculationStatus = val;
        }
        this.doing = true;
        inoculateTask.confirmTask(this.form).then(res => {
          this.$notify.success({
            message: '确认接种完成'
          });
          this.doing = false;
          this.queryList(1);
          this.validSign = null;
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '确认接种失败'
          });
        });
      },
      setElFullScreen() {
        const root = document.documentElement;
        const fullscreen = root.requestFullscreen || root.webkitRequestFullscreen || root.mozRequestFullScreen || root.msRequestFullscreen;
        fullscreen.call(root);
      }
    }
  };
</script>
