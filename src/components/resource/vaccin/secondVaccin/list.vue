<style lang="scss" scoped>

.margin-left {
  margin-left: 15px;
}

.margin-left-right {
  margin-left: 38px;
  margin-right: 38px;
}

.power-style-part {
  margin: 12px 0;
  background-color: rgb(238, 238, 238);
  padding: 12px 10px 10px 10px;
}

.el-form .el-checkbox__label {
  font-size: 12px;
  padding-left: 5px;
}

.el-form .el-checkbox__inner {
  width: 14px;
  height: 14px;
}

.customize-input {
  border: 1px solid #ffffff;
  border-radius: 5px;
  width: 240px;
  padding: 4px;

  &:hover {
    border-color: #cccccc;
  }

  &:focus {
    outline: none;
  }
}

.min-row {
  .el-row {
    /*margin-bottom: 10px;*/
  }
}

.bill-font {
  font-weight: bold;
}

.borderShow {
  height: 20px;
  border-bottom: 1px solid #777777;
  opacity: 0.2;
  margin-right: 20px;
  margin-bottom: 20px;
}

.title {
  margin-bottom: 5px;
  color: #999999;
  font-weight: normal;
}

.locked {
  border-left: 5px solid #fa0;
  text-indent: -5px;
}

.base-pic-item {
  border: 1px solid #eee;
  position: relative;
  cursor: pointer;
  margin: 5px;
  padding: 10px;
  font-size: 12px;

  img {
    width: 100%;
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    display: block;
    background: #ccc;
  }
}

.border-show {
  height: 20px;
  border-bottom: 1px solid #777777;
  opacity: 0.2;
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 20px;
}

.d-table-col-wrap {
  overflow: auto;
}

.lot-load {
  text-align: center;

  .el-button {
    border: none;
    color: #666;
    background: 0 0;
    padding-left: 0;
    padding-right: 0;

    &:hover {
      color: #333
    }
  }
}
</style>
<template>
  <div>
    <div class="container">
      <div class="order-list-status container">
        <div v-for="(item,key) in vaccineType" :class="{'active':key==activeStatus,'item-right':item.type===0} "
             class="status-item"
             @click="changeType(key,item)">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div class="status-title"><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{item.title}}<span
            class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="d-table">
        <div class="d-table-left">
          <h2 class="header">
                <span class="pull-right">
                  <!--<perm label="second-vaccine-info-add">-->
                  <!--<a href="#" class="btn-circle" @click.stop.prevent="addType">-->
                  <!--<i class="el-icon-t-plus"></i>-->
                  <!--</a>-->
                  <!--</perm>-->
                    <a class="btn-circle" href="#" @click.prevent="searchType"><i
                      class="el-icon-t-search"></i> </a>
                </span>
            货主疫苗产品资料
          </h2>
          <div :style="'height:'+ (bodyHeight - 60)  + 'px'" class="d-table-col-wrap" @scroll="scrollLoadingData">

            <div v-show="showTypeSearch" class="search-left-box">
              <oms-input v-model="typeTxt" :showFocus="showTypeSearch" placeholder="请输入关键字搜索"></oms-input>
            </div>
            <div v-if="orgGoodsList.length == 0" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li v-for="item in orgGoodsList" :class="{'active':item.orgGoodsDto==currentItem.orgGoodsDto}" class="list-item" style="padding-left: 10px"
                    @click="showType(item)">
                  <div class="id-part">
                    <span>货主货品编号{{item.orgGoodsDto.goodsNo}}</span>
                    <el-tag v-show="item.orgGoodsDto.goodsIsCombination" style="padding-left: 9px" type="primary">组合
                    </el-tag>
                    <el-tag v-show="item.orgGoodsDto.goodsDto.overdue" type="danger">注册证照过期</el-tag>
                  </div>
                  <div>
                    <span>{{item.orgGoodsDto.name}}</span>
                  </div>
                </li>
              </ul>

            </div>
          </div>
          <div class="btn-left-list-more">
            <bottom-loading></bottom-loading>
            <div v-show="!$store.state.bottomLoading" @click.stop="getOrgMore">
              <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <div v-if="!data.id" class="empty-info">
            暂无疫苗产品资料
          </div>
          <div v-else :style="'height:'+bodyHeight + 'px'" class="d-table-col-wrap">
            <h2 class="clearfix">
            <span class="pull-right">
                 <el-button-group>
                    <perm label="second-vaccine-info-start">
                      <el-button v-show="!data.status" @click="enableRelation"><i
                        class="el-icon-t-start"></i> 启用</el-button>
                    </perm>
                    <perm label="second-vaccine-info-stop">
                      <el-button v-show="data.status" @click="forbid"><i
                        class="el-icon-t-stop"></i> 停用</el-button>
                    </perm>
              </el-button-group>
            </span>
            </h2>
            <div class="page-main-body min-row">
              <el-row>
                <el-col :span="6" class="text-right" style="font-size: 12px">
                  [ 产品图片 ]
                </el-col>
                <el-col :span="11" class="text-right" style="font-size: 12px">
                  [ 货主疫苗信息 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" style="padding-left:50px;text-align: center">
                  <div
                    v-if="$formatOrgPhotoUrl(data)"
                    :class="{'base-pic-item':$formatOrgPhotoUrl(data),'base-pic-item-normal':!$formatOrgPhotoUrl(data)} " @click="handlePreview($formatOrgPhotoId(data))">
                    <compressed-img
                      :src="$formatOrgPhotoUrl(data)?$formatOrgPhotoUrl(data)+'?image&action=resize:w_380,m_0':'/static/img/userpic.png' "/>
                  </div>
                  <div v-else>无产品图片</div>
                </el-col>
                <el-col :span="12">
                  <goods-row :span="12" label="货主疫苗ID">
                    {{ data.id}}
                  </goods-row>
                  <goods-row :span="12" label="货主货品编号">
                    {{ data.goodsNo}}
                  </goods-row>
                  <goods-row :span="12" label="疫苗名称">
                    {{ data.name}}
                  </goods-row>
                  <goods-row :span="12" label="疫苗种类">
                    <dict :dict-group="'vaccineSign'" :dict-key="data.goodsVaccineSign"></dict>
                  </goods-row>
                  <goods-row v-if="data.procurementPrice !== null" :span="12" label="采购价格">
                    <span>¥</span> {{ data.procurementPrice | formatMoney}}
                  </goods-row>
                  <goods-row v-if="data.sellPrice !== null" :span="12" label="销售价格">
                    <span>¥</span> {{ data.sellPrice | formatMoney}}
                  </goods-row>
                  <goods-row :span="12" label="供货单位">
                    {{ data.salesFirmName }}
                  </goods-row>
                </el-col>
              </el-row>
              <div class="border-show"></div>
              <el-row>
                <el-col :span="6" class="text-right" style="font-size: 12px">
                  [ 疫苗主档信息 ]
                </el-col>
                <el-col :span="11" class="text-right" style="font-size: 12px">
                  [ 包装存储信息 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <goods-row :span="12" label="生产单位">{{ data.goodsDto.factoryName }}</goods-row>
                  <goods-row :span="12" label="规格 / 型号">{{ data.goodsDto.specifications }}</goods-row>
                  <goods-row :span="12" label="疫苗编号">{{ data.goodsDto.code }}</goods-row>
                  <goods-row :span="12" label="疫苗名称">{{ data.goodsDto.name }}</goods-row>
                  <goods-row :span="12" label="DHS疫苗ID">{{ data.goodsDto.dhsGoodsId }}</goods-row>
                  <goods-row :span="12" label="剂型">
                    <dict :dict-group="'dosageForm'" :dict-key="data.goodsDto.dosageForm"></dict>
                  </goods-row>
                  <goods-row :span="12" label="货品来源">
                    <dict :dict-group="'importation'" :dict-key="data.goodsDto.importation"></dict>
                  </goods-row>
                  <goods-row :span="12" label="基本单位">
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.measurementUnit"></dict>
                  </goods-row>
                  <goods-row :span="12" label="质量标准">{{data.goodsDto.qualityStandard}}</goods-row>
                  <goods-row v-if="data.goodsDto.importation!=='1'" :span="12" label="注册证号">
                    {{data.goodsDto.registrationNumber}}
                  </goods-row>
                  <goods-row v-if="data.goodsDto.importation!=='1'" :span="12" label="注册证号有效期">
                    {{data.goodsDto.registrationNOValidity | date}}
                  </goods-row>
                  <goods-row :span="12" label="批准文号">
                    {{ data.goodsDto.approvalNumber }}
                  </goods-row>
                  <goods-row :span="12" label="批准文号有效期">
                    {{ data.goodsDto.goodsApprovalNOValidity | date }}
                  </goods-row>
                  <goods-row :span="12" label="有效期">
                    {{ data.goodsDto.expiryNumber }} {{ data.goodsDto.expiryUnit | formExpiryUnit}}
                  </goods-row>
                  <goods-row :span="12" label="厂家认证体系">
                    {{ data.goodsDto.certificationMark }}
                  </goods-row>
                  <goods-row :span="12" label="证照有效期">
                    {{ data.goodsDto.licenceValidityDate | date }}
                  </goods-row>
                  <goods-row :span="12" label="备注">
                    {{ data.goodsDto.remark}}
                  </goods-row>
                  <goods-row v-if="data.goodsDto.typeId==='0'||data.goodsDto.typeId==='1'" :span="12" label="最大注射次数">
                    {{ data.goodsDto.propertyMap.personPortion }}
                  </goods-row>
                  <goods-row :span="12" label="最小销售单位">
                    <dict :dict-group="'minSalesUnit'" :dict-key="data.goodsDto.propertyMap.minSalesUnit"></dict>
                  </goods-row>
                </el-col>
                <el-col :span="12">
                  <goods-row :span="12" label="存储类别">
                     <span v-for="(item, index) in data.goodsDto.storageType">
                       <dict :dict-group="'storageType'" :dict-key="item"></dict>
                       <span v-if="(data.goodsDto.storageType.length-1) !== index ">/</span>
                    </span>
                  </goods-row>
                  <goods-row :span="12" label="储存条件">
                    <dict :dict-group="'storageCondition'" :dict-key="data.goodsDto.storageConditionId"></dict>
                  </goods-row>
                  <goods-row :span="12" label="运输温度">
                    <span
                      v-show="data.goodsDto.transportStartTemperature">{{ data.goodsDto.transportStartTemperature}} ℃ -
                      {{ data.goodsDto.transportEndTemperature
                      }} ℃</span>
                  </goods-row>
                  <goods-row :span="12" label="冷藏存储温度">
                    <span
                      v-show="data.goodsDto.storageStartTemperature">{{ data.goodsDto.storageStartTemperature}} ℃ -
                      {{ data.goodsDto.storageEndTemperature}} ℃
                    </span>
                  </goods-row>
                  <span v-for="(packageDto,index) in data.goodsDto.packageDtoList">
                    <goods-row v-if="data.goodsDto.wholePackageScheme===index+1" v-show="packageDto.conversionCount"
                               :span="12" label="整件">
                      {{ packageDto.conversionCount }}
                      <dict v-show="packageDto.conversionCount" :dict-group="'measurementUnit'"
                            :dict-key="data.goodsDto.measurementUnit"></dict> /  <dict :dict-group="'shipmentPackingUnit'"
                                                                                 :dict-key="packageDto.packageUnit"></dict>
                    </goods-row>
                    <goods-row v-if="index===0" v-show="packageDto.conversionCount"
                               :span="12" label="散件">
                      {{ packageDto.conversionCount }}
                      <dict v-show="packageDto.conversionCount" :dict-group="'measurementUnit'"
                            :dict-key="data.goodsDto.measurementUnit"></dict> / <dict :dict-group="'shipmentPackingUnit'"
                                                                                :dict-key="packageDto.packageUnit"></dict>
                    </goods-row>
                  </span>
                </el-col>
              </el-row>
              <div class="border-show"></div>
              <el-row>
                <el-col :span="6" class="text-right" style="font-size: 12px">
                  [ 附件 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="2"/>
                <el-col v-if="data.goodsDto" :span="22" style="padding-left:120px;">
                  <attachment-lists :objectId="data.goodsDto.id" :objectType="'goodsDocument'"
                                    :permission="'goods-attachment-download'"
                                    attachmentIdList=""></attachment-lists>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>

    <page-right :show="showRight" @right-close="resetRightBox">
      <goods-part :action="action" :actionType="showRight" :formItem="form" :userStatus="1" @change="onSubmit"
                  @close="showRight=false"></goods-part>
    </page-right>
  </div>
</template>
<script>
import goodsPart from './form/form.vue';
import {Vaccine} from '@/resources';
import goodsRow from './goods.row.vue';
import utils from '@/tools/utils';
import attachmentLists from './../../../common/attachmentList.vue';

export default {
  components: {
    goodsPart, goodsRow, attachmentLists
  },
  data: function () {
    return {
      showRight: false,
      showTypeSearch: false,
      vaccineType: {
        0: {'title': '正常', 'num': '', 'status': true, 'auditedStatus': '1'},
        1: {'title': '停用', 'num': '', 'status': false}
      },
      activeStatus: 0,
      data: {},
      combinationList: [],
      orgGoodsList: [],
      typeTxt: '',
      form: {},
      action: '',
      currentItem: {},
      filters: {
        status: true,
        auditedStatus: '1'
      },
      typePager: {
        currentPage: 1,
        count: 0,
        pageSize: 20,
        totalPage: 1
      }
    };
  },
  mounted() {
    this.$emit('loaded');
    this.getGoodsList(1);
  },
  filters: {
    formExpiryUnit: function (value) {
      let array = {
        0: '年',
        1: '月',
        2: '日'
      };
      return array[value];
    }
  },
  watch: {
    'typeTxt': function () {
      this.getGoodsList(1);
    },
    filters: {
      handler() {
        this.getGoodsList(1);
      },
      deep: true
    }
  },
  computed: {
    bodyHeight: function () {
      let height = parseInt(this.$store.state.bodyHeight, 10);
      height = (height - 25);
      return height;
    }
  },
  methods: {
    scrollLoadingData(event) {
      this.$scrollLoadingData(event);
    },
    handlePreview: function (id) {
      this.$store.commit('changeAttachment', id);
    },
    resetRightBox: function () {
      this.showRight = false;
    },
    addType: function () {
      this.action = 'add';
      this.form = {
        name: '',
        orgId: '',
        status: true,
        goodsId: '',
        goodsIsCombination: false,
        goodsNo: '',
        bidPrice: '',
        procurementPrice: '',
        sellPrice: '',
        valuationFlag: false,
        storageConditionId: '',
        inventoryLowerLimit: null,
        inventoryUpperLimit: null
      };
      this.showRight = true;
      this.combinationList = [];
      this.$notify.info({
        message: '添加疫苗时，只能添加通过审核的、与经营范围保持一致的疫苗'
      });
    },
    searchType: function () {
      this.showTypeSearch = !this.showTypeSearch;
    },
    getGoodsList: function (pageNo, isContinue = false) {
      this.data = {};
      this.combinationList = [];
      this.typePager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.typePager.pageSize,
        keyWord: this.typeTxt,
        deleteFlag: false
      }, this.filters);
      Vaccine.query(params).then(res => {
        if (params.keyWord !== this.typeTxt) return;
        this.$store.commit('initBottomLoading', false);

        if (isContinue) {
          this.orgGoodsList = this.orgGoodsList.concat(res.data.list);
        } else {
          this.orgGoodsList = res.data.list;
          this.currentItem = Object.assign({orgGoodsDto: {}, list: []}, this.orgGoodsList[0]);
        }
        this.typePager.totalPage = res.data.totalPage;
        this.queryStatusNum(params);
        this.queryOrgGoods();
      });
    },
    queryStatusNum: function (params) {
      Vaccine.queryStateNum(params).then(res => {
        let data = res.data;
        this.vaccineType[0].num = data['normal'];
        this.vaccineType[1].num = data['disable'];
      });
    },
    queryOrgGoods() {
      let id = this.currentItem.orgGoodsDto.id;
      if (!id) return;
      Vaccine.queryVaccineDetail(id).then(res => {
        this.data = res.data.orgGoodsDto;
        this.combinationList = res.data.list;
      });
    },
    getOrgMore: function () {
      this.getGoodsList(this.typePager.currentPage + 1, true);
    },
    edit: function () {
      this.action = 'edit';
      this.form = JSON.parse(JSON.stringify(this.data));
      this.form.bidPrice = utils.autoformatDecimalPoint(this.form.bidPrice.toString());
      this.form.procurementPrice = utils.autoformatDecimalPoint(this.form.procurementPrice.toString());
      this.form.sellPrice = utils.autoformatDecimalPoint(this.form.sellPrice.toString());
      this.form.combinationList = this.combinationList;
      this.showRight = true;
    },
    forbid: function () {
      this.$confirm('确认停用疫苗"' + this.data.name + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this;
        let item = {};
        self.orgGoodsList.forEach(function (val) {
          if (self.data.id === val.orgGoodsDto.id) {
            item = val;
          }
        });
        item.orgGoodsDto.status = false;
        Vaccine.stopVaccineInfo(item.orgGoodsDto.id, {}).then(() => {
          this.getGoodsList(1);
          this.$notify.success({
            title: '成功',
            message: '已成功停用疫苗"' + item.orgGoodsDto.name + '"'
          });
        }).catch(error => {
          let e = error.response;
          if (e.status === 400) {
            this.$notify.info({
              message: error.response && error.response.data && error.response.data.msg || '网络异常'
            });
          }
        });
      });
    },
    enableRelation: function () {
      this.$confirm('确认启用疫苗"' + this.data.name + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this;
        let item = {};
        self.orgGoodsList.forEach(function (val) {
          if (self.data.id === val.orgGoodsDto.id) {
            item = val;
          }
        });
        item.orgGoodsDto.status = true;
        Vaccine.startVaccineInfo(item.orgGoodsDto.id, {}).then(() => {
          this.getGoodsList(1);
          this.$notify.success({
            title: '成功',
            message: '已成功启用疫苗"' + item.orgGoodsDto.name + '"'
          });
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '启用疫苗失败'
          });
        });
      });
    },
    showType: function (item) {
      this.currentItem = item;
      this.queryOrgGoods();
    },
    changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
      this.activeStatus = key;
      this.filters.status = item.status;
      this.filters.auditedStatus = item.auditedStatus;
    },
    onSubmit: function (item) {
      if (this.action === 'add') {
        this.getGoodsList(1);
        this.showRight = false;
      } else {
        this.getGoodsList(1);
        // let self = this;
        // self.orgGoodsList.forEach(function (val, index) {
        //   if (item.orgGoodsDto.id === val.orgGoodsDto.id) {
        //     self.orgGoodsList.splice(index, 1, item);
        //     self.data = item.orgGoodsDto;
        //     self.currentItem = item;
        //     self.combinationList = item.list;
        //   }
        // });
        this.showRight = false;
      }
    }
  }
};
</script>
