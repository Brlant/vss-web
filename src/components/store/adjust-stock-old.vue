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

  .good-selects {
    .el-select-dropdown__item {
      height: auto;
      width: 300px;
    }
  }

  .align-word {
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .order-list-item {
    cursor: pointer;
  }

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
  }

  .header-list {
    overflow: hidden;
  }

  .opera-btn-group {
    margin-left: 0;
    margin-right: 0;
  }
  .batch-info {
    .oms-row {
      margin-bottom: 10px;
    }
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
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="货主货品" :span="5">
                <el-select filterable remote placeholder="请输入名称搜索货主货品" :remote-method="filterOrgGoods"
                           :clearable="true"
                           v-model="searchWord.orgGoodsId" popper-class="good-selects"
                           @click.native.once="filterOrgGoods('')" @change="orgGoodsChange">
                  <el-option :value="org.id" :key="org.id" :label="org.goodsName"
                             v-for="org in orgGoods">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{org.goodsName}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">货品编号</span>  {{org.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.saleFirmName">供货厂商</span>  {{ org.saleFirmName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="批号" :span="5">
                <el-select v-model="searchWord.keyWord" filterable clearable remote
                           :remoteMethod="filterBatchNumber" placeholder="请输入批号名称搜索批号">
                  <el-option v-for="item in batchNumberList" :value="item.batchNumber" :key="item.id"
                             :label="item.batchNumber">
                    {{ item.batchNumber }}
                    <!--<el-tag v-show="isNewBatch(item.createTime)" style="height: 20px">新</el-tag>-->
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <!--<el-col :span="8">-->
              <!--<oms-form-row label="生产厂商" :span="5">-->
                <!--<el-select filterable remote placeholder="请输入名称生产厂商" :remote-method="filterFactory" :clearable="true"-->
                           <!--v-model="searchWord.factoryId" popperClass="good-selects"-->
                           <!--@click.native.once="filterFactory('')">-->
                  <!--<el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in factories">-->
                    <!--<div style="overflow: hidden">-->
                      <!--<span class="pull-left" style="clear: right">{{org.name}}</span>-->
                    <!--</div>-->
                    <!--<div style="overflow: hidden">-->
                      <!--<span class="select-other-info pull-left">-->
                        <!--<span>系统代码</span> {{org.manufacturerCode}}-->
                      <!--</span>-->
                    <!--</div>-->
                  <!--</el-option>-->
                <!--</el-select>-->
              <!--</oms-form-row>-->
            <!--</el-col>-->
            <el-col :span="8">
              <oms-form-row label="" :span="3">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <div class="empty-info" v-show="!batches.length">暂无数据,尝试查询</div>

        <el-form ref="stockForm" label-width="120px" :model="form" v-show="isShowForm" inline="true">
          <el-form-item label="可用库存">
            <el-input v-model="form.availableCount" ></el-input>
          </el-form-item>
          <el-form-item label="实际合格库存">
            <el-input v-model="form.qualifiedCount"></el-input>
          </el-form-item>
          <el-form-item label="实际不合格库存">
            <el-input v-model="form.unqualifiedCount"></el-input>
          </el-form-item>
          <el-form-item label="在途库存">
            <el-input v-model="form.transitCount"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button  @click="cancelSubmit">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  //  import order from '../../../tools/orderList';
  import { BaseInfo, erpStock, http } from '@/resources';

  export default {
    data () {
      return {
        loadingData: true,
        showSearch: true,
        showDetailPart: false,
        batches: [],
        filters: {
          factoryId: '',
          keyWord: '',
          orgGoodsId: '',
          nearTermDays: ''
        },
        searchWord: {
          factoryId: '',
          keyWord: '',
          orgGoodsId: '',
          nearTermDays: ''
        },
        factories: [], // 厂商列表
        orgList: [], // 货主列表,
        orgGoods: [],
        batchNumberList: [],
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        currentItemId: '',
        currentItem: {},
        span: 6,
        form: {
          availableCount: '',
          qualifiedCount: '',
          transitCount: '',
          unqualifiedCount: ''
        },
        isShowForm: false
      };
    },
    mounted () {
      // this.getBatches(1);
    },
    computed: {
      orgLevel () {
        return this.$store.state.orgLevel;
      },
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = height - 110;
        return height;
      }
    },
    watch: {
      filters: {
        handler: function () {
          let isValid = Object.keys(this.filters).some(s => this.filters[s]);
          if (!isValid) return;
          this.getBatches(1);
        },
        deep: true
      }
    },
    methods: {
      getBatches () { // 得到波次列表
        this.batches = [];
        let params = Object.assign({}, this.filters);
        this.loadingData = true;
        erpStock.query(params).then(res => {
          this.batches = res.data;
          this.loadingData = false;
        });
      },
      showDetail (item) {
        this.currentItemId = item.id;
        this.currentItem = item;
        this.showDetailPart = true;
      },
      editStock () {
        this.isShowForm = true;
      },
      cancelSubmit () {
        this.$refs['stockForm'].resetFields();
        this.isShowForm = false;
      },
      onSubmit () {

      },
      resetRightBox () {
        this.showDetailPart = false;
      },
      searchInOrder: function () {// 搜索
        if (!this.searchWord.orgGoodsId) {
          this.$notify.info({
            message: '请选择货主货品'
          });
          return;
        }
        if (!this.searchWord.keyWord) {
          this.$notify.info({
            message: '请选择批号'
          });
          return;
        }
        this.cancelSubmit();
        Object.assign(this.filters, this.searchWord);
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          factoryId: '',
          keyWord: '',
          orgGoodsId: '',
          nearTermDays: ''
        };
        Object.assign(this.searchWord, temp);
        Object.assign(this.filters, temp);
        this.batches = [];
      },
      filterFactory (query) { // 生产厂商
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) {
          return;
        }
        // 过滤来源单位
        let params = {
          keyWord: query,
          orgRelationTypeList: ['Manufacture', 'Supplier']
        };
        BaseInfo.queryByOrgRelationTypeList(params).then(res => {
          this.factories = res.data.list;
        });
      },
      filterOrgGoods (query) {
        let orgId = this.$store.state.user.userCompanyAddress;
        let params = Object.assign({}, {
          deleteFlag: false,
          orgId: orgId,
          keyWord: query
        });
        http.get('/erp-stock/goods', {params}).then(res => {
          this.orgGoods = res.data.list;
        });
      },
      orgGoodsChange (val) {
        if (!val) return;
        this.batchNumberList = [];
        this.filterBatchNumber();
      },
      filterBatchNumber (query) {
        if (!this.searchWord.orgGoodsId) return;

        let goodsId = '';
        this.orgGoods.forEach(i => {
          if (i.id === this.searchWord.orgGoodsId) {
            goodsId = i.goodsId;
          }
        });
        if (!goodsId) return;
        this.$http.get('/batch-number/pager', {
          params: {
            keyWord: query,
            goodsId
          }
        }).then(res => {
          this.batchNumberList = res.data.list;
        });
      },
      formatTime (date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
