<style lang="scss" scoped="">
  .order-list-item {
    cursor: pointer;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="生产企业" :span="5">
                <el-select filterable remote placeholder="请输入名称搜索生产企业" :remote-method="filterFactory"
                           @click.native.once="filterFactory('')"
                           :clearable="true" v-model="searchWord.orgId" popperClass="good-selects">
                  <el-option :value="org.id" :key="org.id" :label="org.name" v-for="org in factories">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{org.name}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{org.manufacturerCode}}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="疫苗" :span="5">
                <el-select filterable remote placeholder="请输入名称搜索疫苗" :remote-method="filterOrgGoods"
                           :clearable="true"
                           v-model="searchWord.goodsId" popper-class="good-selects"
                           @click.native.once="filterOrgGoods('')">
                  <el-option :value="org.goodsId" :key="org.id" :label="org.goodsName"
                             v-for="org in orgGoods">
                    <div style="overflow: hidden">
                      <span class="pull-left">{{org.goodsName}}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left"><span
                        v-show="org.goodsNo">货主货品编号:</span>{{org.goodsNo}}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="org.saleFirmName">供货单位:</span>{{ org.saleFirmName }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="批号" :span="6">
                <el-input v-model="searchWord.batchNumber" placeholder="请输入批号"></el-input>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row label="" :span="1">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <perm label="batchNumber-zip-export" class="ml-15">
                  <el-button native-type="reset" @click="batchDownloadZip" v-show="batches.length">批量下载附件</el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="order-list clearfix " v-if="showFlag">
        <el-row class="order-list-header">
          <el-col :span="5">
            <el-checkbox v-model="checkAll" @change="checkAllChange"></el-checkbox>
            疫苗名称
          </el-col>
          <el-col :span="3">疫苗规格</el-col>
          <el-col :span="5">生产单位</el-col>
          <el-col :span="3">生产日期</el-col>
          <el-col :span="3">批号</el-col>
          <el-col :span="3">批签发号</el-col>
          <el-col :span="2">有效期</el-col>
        </el-row>
        <!--<el-row v-if="loadingData">-->
        <!--<el-col :span="24">-->
        <!--<oms-loading :loading="loadingData"></oms-loading>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-if="!loadingData&&batches.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom is-checkbox">
          <div class="order-list-item order-list-item-bg" v-for="item in batches"
               :class="[{'active':currentItemId==item.id}]"
               @click.prevent="showDetail(item)">
            <el-row>
              <el-col :span="5" class="pt" @click.native.stop="">
                <el-checkbox @click.native.stop="" v-model="item.checked" style="padding-right: 5px"></el-checkbox>
                <el-tooltip class="item" effect="dark" :content="`疫苗主档ID:${item.goodsId}`" placement="right">
                  <span @click.stop="item.checked = !item.checked">{{ item.goodsName }}</span>
                </el-tooltip>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.specification }}</span>
              </el-col>
              <el-col :span="5" class="pt">
                <span>{{ item.orgName }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.productionDate | date }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.batchNumber }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.batchReleaseNumber }}</span>
              </el-col>
              <el-col :span="2" class="pt" align="center">
                <span>{{ item.expirationDate | date }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>

      <div class="text-center" v-show="batches.length && !loadingData">
        <el-pagination
          layout="prev, pager, next"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="getBatcheNumbers"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>

    <page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1200px','padding':0}">
      <detail :id="currentItemId" @close="resetRightBox"></detail>
    </page-right>
  </div>
</template>
<script>
  //  import order from '../../../tools/orderList';
  import {BaseInfo} from '../../../resources';
  import detail from './detail.vue';
  import utils from '@/tools/utils';

  export default {
    components: {detail},
    data() {
      return {
//        loadingData: true,
        showFlag: false,
        showSearch: true,
        showDetailPart: false,
        loadingData: true,
        batches: [],
        filters: {
          orgId: '',
          batchNumber: '',
          goodsId: ''
        },
        searchWord: {
          orgId: '',
          batchNumber: '',
          goodsId: ''
        },
        factories: [], // 厂商列表
        orgList: [], // 货主列表,
        orgGoods: [],
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 10
        },
        currentItemId: '',
        checkAll: false
      };
    },
    mounted() {
      this.filterOrgGoods();
    },
    watch: {
      filters: {
        handler: function () {
          this.getBatcheNumbers(1);
        },
        deep: true
      }
    },
    methods: {
      batchDownloadZip() {
        let list = this.batches.filter(f => f.checked).map(m => m.id);
        if (!list.length) {
          return this.$notify.info({
            message: '请选择批号'
          });
        }
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
        this.$http.post('/batch-number/zip-list', list).then(res => {
          utils.download(res.data.path, '批号附件');
          this.isLoading = false;
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        }).catch(error => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '下载失败'
          });
        });
      },
      checkAllChange(val) {
        this.batches.forEach(i => {
          i.checked = val;
        });
      },
      getBatcheNumbers(pageNo) { // 得到批次列表
        this.batches = [];
        this.pager.currentPage = pageNo;
        this.loadingData = true;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.$http.get('/erp-batch', {params}).then(res => {
          res.data.list.forEach(i => {
            i.checked = false;
          });
          this.batches = res.data.list;
          this.loadingData = false;
          this.pager.count = res.data.count;
        });
      },
      showDetail(item) {
        this.currentItemId = item.id;
        this.showDetailPart = true;
      },
      resetRightBox() {
        this.showDetailPart = false;
      },
      searchInOrder: function () {// 搜索
//        if (this.searchWord.orgId !== '' || this.searchWord.goodsId !== '' || this.searchWord.batchNumber !== '') {
        this.showFlag = true;
        Object.assign(this.filters, this.searchWord);
        this.getBatcheNumbers(1);
//        } else {
//          this.$notify.info({
//            message: '请选择查询条件'
//          });
//          this.loadingData = false;
//          return;
//        }
      },
      resetSearchForm: function () {// 重置表单
        let temp = {
          orgId: '',
          batchNumber: '',
          goodsId: ''
        };
        Object.assign(this.searchWord, temp);
        this.batches = [];
        this.showFlag = false;
//        Object.assign(this.filters, temp);
      },
      filterFactory(query) { // 查询厂商
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) {
          return;
        }
        // 过滤来源单位
        let params = {
          keyWord: query,
          orgRelationTypeList: ['Supplier', 'Manufacture']
        };
        BaseInfo.queryByOrgRelationTypeList(params).then(res => {
          this.factories = res.data.list;
        });
      },
      filterOrgGoods(query) {
        this.orgGoods = [];
        let orgId = this.$store.state.user.userCompanyAddress;
        let params = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          orgId: orgId,
          keyWord: query
        });
        this.$http.get('/erp-stock/goods-list', {params}).then(res => {
          this.orgGoods = res.data.list;
        });
      }
    }
  };
</script>
