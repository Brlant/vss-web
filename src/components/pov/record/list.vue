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

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
  }

  .minor-part {
    color: #999;
  }

  .d-table > div.d-table-right {
    padding: 10px 20px;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="">
            <i class="el-icon-t-search"></i> 筛选查询
          </span>
          <span class="pull-right switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix" style="padding-top: 10px" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="接种时间" :span="6">
                <el-col :span="24">
                  <el-date-picker
                    v-model="actualTime"
                    type="daterange"
                    placeholder="请选择" format="yyyy-MM-dd">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="货主货品" :span="6">
                <el-select v-model="searchCondition.vaccineId" filterable remote placeholder="请输入名称搜索货主货品"
                           :remote-method="searchProduct" @click.native="searchProduct('')" :clearable="true"
                           popper-class="good-selects">
                  <el-option v-for="item in orgList" :key="item.orgGoodsDto.id"
                             :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.goodsId">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{item.orgGoodsDto.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                        <span class="select-other-info pull-left"><span
                          v-show="item.orgGoodsDto.goodsNo">货品编号</span>  {{item.orgGoodsDto.goodsNo}}
                        </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.salesFirmName">供货厂商</span>  {{ item.orgGoodsDto.salesFirmName }}
                        </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="5">
              <oms-form-row label="" :span="3">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix " style="margin-top: 10px">
        <el-row class="order-list-header">
          <el-col :span="4">接种时间</el-col>
          <el-col :span="10">接种疫苗</el-col>
          <el-col :span="4">批号</el-col>
          <el-col :span="6">追溯码</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="CDCs.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div class="order-list-item order-list-item-bg" v-for="item in CDCs" :key="">
            <el-row>
              <el-col :span="4" class="R pt10">
                  {{ item.actualTime | minute}}
              </el-col>
              <el-col :span="10" class="R pt10">
                <div>
                  {{ item.goodsName }}
                </div>
                <div>
                  {{ item.specification }}
                </div>
              </el-col>
              <el-col :span="4" class="R pt10">
                {{ item.batchNumber }}
              </el-col>
              <el-col :span="6" class="R pt10">
                {{ item.actualCode}}
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          layout="prev, pager, next"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="getRecordPage"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import {VaccineRights} from '@/resources';
  export default {
    data () {
      return {
        loadingData: true,
        showSearch: true,
        CDCs: [],
        filters: {
          actualStartTime: '',
          actualEndTime: '',
          vaccineId: ''
        },
        searchCondition: {
          actualStartTime: '',
          actualEndTime: '',
          vaccineId: ''
        },
        actualTime: '',
        orgList: [], // 货主列表,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 15
        },
        doing: false
      };
    },
    mounted () {
      this.getRecordPage(1);
    },
    watch: {
      filters: {
        handler: function () {
          this.getRecordPage(1);
        },
        deep: true
      }
    },
    methods: {
      getRecordPage (pageNo) { // 得到波次列表
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        this.$http.get('/injection-task', {params}).then(res => {
          this.CDCs = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      searchProduct(query) {
        let params = Object.assign({}, {
          keyWord: query
        });
        VaccineRights.queryPovVaccineByType(params).then(res => {
          this.orgList = res.data.list;
        });
      },
      searchInOrder: function () {// 搜索
        this.searchCondition.actualStartTime = this.formatTime(this.actualTime[0]);
        this.searchCondition.actualEndTime = this.formatTime(this.actualTime[1]);
        Object.assign(this.filters, this.searchCondition);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          actualStartTime: '',
          actualEndTime: '',
          vaccineId: ''
        };
        this.actualTime = '';
        Object.assign(this.searchCondition, temp);
        Object.assign(this.filters, temp);
      },
      formatTime: function (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
