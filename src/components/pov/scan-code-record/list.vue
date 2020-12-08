<style lang="scss" scoped>

.sign-img {
  width: 65px;
  height: 24px;
  vertical-align: middle;
  cursor: pointer;
}

</style>
<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
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
              <oms-form-row :span="6" label="签核日期">
                <el-col :span="24">
                  <el-date-picker
                    v-model="actualTime"
                    format="yyyy-MM-dd"
                    placeholder="请选择" type="daterange">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="追溯码">
                <el-col :span="24">
                  <el-input v-model="searchCondition.actualCode" placeholder="请输入追溯码"></el-input>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="疫苗名称">
                <el-select v-model="searchCondition.orgGoodsId" :clearable="true" :remote-method="searchProduct"
                           filterable
                           placeholder="请输入名称或编号搜索疫苗"
                           popper-class="good-selects" remote
                           @click.native.once="searchProduct('')">
                  <el-option v-for="item in detailList" :key="item.orgGoodsDto.id" :label="item.orgGoodsDto.name"
                             :value="item.orgGoodsDto.id">
                    <div style="overflow: hidden">
                      <span class="pull-left">
                        {{ item.orgGoodsDto.name }}
                      </span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span v-show="item.orgGoodsDto.goodsDto.specifications">规格:</span>{{
                          item.orgGoodsDto.goodsDto.specifications
                        }}
                      </span>
                      <span class="select-other-info pull-left">
                        <span v-show="item.orgGoodsDto.goodsDto.code">货品编号:</span>{{ item.orgGoodsDto.goodsDto.code }}
                      </span>
                      <span class="select-other-info pull-left"><span
                        v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{
                          item.orgGoodsDto.goodsDto.factoryName
                        }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="签核状态">
                <el-radio-group v-model="searchCondition.signedStatus" size="small">
                  <el-radio-button label="0">取消签核</el-radio-button>
                  <el-radio-button label="1">已签核</el-radio-button>
                </el-radio-group>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="3" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
                <perm label="injection-signed-export">
                  <el-button :disabled="isLoading" :plain="true" style="margin-left: 10px" type="success"
                             @click="exportFile">
                    导出Excel
                  </el-button>
                </perm>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix " style="margin-top: 10px">
        <el-row class="order-list-header">
          <el-col :span="2">签核日期</el-col>
          <el-col :span="4">接种单位名称</el-col>
          <el-col :span="4">货品名称</el-col>
          <el-col :span="2">批号</el-col>
          <el-col :span="2">规格</el-col>
          <el-col :span="3">生产厂商</el-col>
          <el-col :span="3">追溯码</el-col>
          <el-col :span="2">签名图片</el-col>
          <el-col :span="2">签核状态</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="recordList.length == 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body flex-list-dom">
          <div v-for="item in recordList" :key="" class="order-list-item order-list-item-bg">
            <el-row>
              <el-col :span="2" class="R pt10">
                {{ item.createTime | date }}
              </el-col>
              <el-col :span="4" class="R pt10">
                {{ item.povName }}
              </el-col>
              <el-col :span="4" class="R pt10">
                {{ item.orgGoodsName }}
              </el-col>
              <el-col :span="2" class="R pt10">
                {{ item.batchNumber }}
              </el-col>
              <el-col :span="2" class="R pt10">
                {{ item.specification }}
              </el-col>
              <el-col :span="3" class="R pt10">
                {{ item.origin }}
              </el-col>
              <el-col :span="3" class="R pt10">
                {{ item.actualCode }}
              </el-col>
              <el-col :span="2">
                <img v-if="item.signedFile&&item.signedFile.attachmentStoragePath" :src="item.signedFile&&item.signedFile.attachmentStoragePath"
                     class="sign-img" @click="showImg(item)">
                <span v-else>未签名</span>
              </el-col>
              <el-col :span="2">
                {{ item.signedStatus?statusList[item.signedStatus]:'' }}
                <perm label="injection-signed-cancel">
                  <span @click.stop="cancelItem(item)" v-show="item.signedStatus==='1'">
                      <a class="btn-circle btn-opera" href="#" @click.prevent=""><i
                        class="el-icon-t-stop"></i></a>
                  </span>
                </perm>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="text-center" v-show="recordList&&recordList.length>0">
        <el-pagination
          :current-page="pager.currentPage"
          :page-sizes="[10,30,50,100]" :total="pager.count" layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import utils from '@/tools/utils';
import {BaseInfo} from "@/resources";

export default {
  data() {
    return {
      loadingData: true,
      showSearch: true,
      isLoading: false,
      recordList: [],
      filters: {
        actualStartTime: '',
        actualEndTime: '',
        orgGoodsId: '',
        actualCode: '',
        povId: '',
        signedStatus: '',
        batchNumberId: ''
      },
      searchCondition: {
        actualStartTime: '',
        actualEndTime: '',
        orgGoodsId: '',
        actualCode: '',
        povId: '',
        signedStatus: ''
      },
      actualTime: '',
      detailList: [], // 货主列表,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 10
      },
      statusList: utils.scanCodeRecordStatus,
      doing: false,
      selectLoading: false
    };
  },
  mounted() {
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
    cancelItem: function (item) {
      let time = this.$moment(item.createTime).format('YYYY-MM-DD');
      this.$confirm(`是否对签核日期【${time}】追溯码【${item.actualCode}】记录取消签核`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(`/injection-task/cancel-signed`, {params: {id: item.id}}).then(() => {
          this.$notify.success({
            message: `签核日期【${time}】追溯码【${item.actualCode}】记录取消签核成功`
          });
          item.signedStatus = "0";
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || `签核日期【${time}】追溯码【${item.actualCode}】记录取消签核失败`
          });
        });
      });
    },
    showImg: function (file) {
      this.$store.commit('changeAttachment', file.signedFile.attachmentId);
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      this.getRecordPage(1);
    },
    handleCurrentChange(val) {
      this.getRecordPage(val);
    },
    getRecordPage(pageNo) { // 得到波次列表
      this.pager.currentPage = pageNo;
      let params = Object.assign({
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      this.$http.get('/injection-task/signed', {params}).then(res => {
        this.recordList = res.data.list;
        if (res.data.list.length) {
          this.pager.count = this.pager.currentPage * this.pager.pageSize + (res.data.list.length < this.pager.pageSize ? 0 : 1);
        }
        this.loadingData = false;
      });
    },
    searchProduct(query) {
      let params = Object.assign({}, {
        deleteFlag: false,
        keyWord: query
      });
      this.$http.get('/vaccine-info', {params}).then(res => {
        this.detailList = res.data.list;
      });
    },
    searchInOrder: function () {// 搜索
      this.searchCondition.actualStartTime = this.$formatAryTime(this.actualTime, 0);
      this.searchCondition.actualEndTime = this.$formatAryTime(this.actualTime, 1);
      Object.assign(this.filters, this.searchCondition);
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        actualStartTime: '',
        actualEndTime: '',
        orgGoodsId: '',
        actualCode: '',
        povId: '',
        signedStatus: '',
        batchNumberId: ''
      };
      this.actualTime = '';
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filters, temp);
    },
    exportFile: function () {// 导出表单
      this.searchCondition.actualStartTime = this.$formatAryTime(this.actualTime, 0);
      this.searchCondition.actualEndTime = this.$formatAryTime(this.actualTime, 1);
      let params = Object.assign({}, this.searchCondition);
      this.isLoading = true;
      this.$store.commit('initPrint', {isPrinting: true, moduleId: '/pov/scan-code-record'});
      this.$http.get('/injection-task/signed/export', {params}).then(res => {
        utils.download(res.data.path, '扫码验证签核记录表');
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/pov/scan-code-record'});
      }).catch(error => {
        this.isLoading = false;
        this.$store.commit('initPrint', {isPrinting: false, moduleId: '/pov/scan-code-record'});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    formatTime: function (date) {
      return date ? this.$moment(date).format('YYYY-MM-DD') : '';
    }
  }
};
</script>
