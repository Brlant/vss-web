<style lang="less" scoped>

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
      margin-bottom: 10px;
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
    width: 380px;
    margin: 5px;
    padding: 10px;
    font-size: 12px;
    img {
      width: 380px;
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
        <div class="status-item" :class="{'active':key==activeStatus,'item-right':item.type===0} "
             v-for="(item,key) in vaccineType"
             @click="changeType(key,item)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div class="status-title"><i class="el-icon-caret-right" v-if="key==activeStatus"></i>{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="d-table">
        <div class="d-table-left">
          <div class="d-table-col-wrap" :style="'height:'+bodyHeight" @scroll="scrollLoadingData">
            <h2 class="header">
                <span class="pull-right">
                  <perm label="second-vaccine-info-add">
                      <a href="#" class="btn-circle" @click.stop.prevent="addType">
                        <i class="el-icon-t-plus"></i>
                      </a>
                  </perm>
                    <a href="#" class="btn-circle" @click.prevent="searchType"><i
                      class="el-icon-t-search"></i> </a>
                </span>
              货主二类疫苗资料
            </h2>
            <div class="search-left-box" v-show="showTypeSearch">
              <oms-input v-model="typeTxt" placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
            </div>
            <div v-if="showTypeList.length == 0" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li v-for="item in showTypeList" class="list-item" @click="showType(item)" style="padding-left: 10px"
                    :class="{'active':item.orgGoodsDto==currentItem.orgGoodsDto}">
                  <!--<perm label="second-vaccine-info-delete">-->
                  <!--<oms-remove :item="item" @removed="removeType" :tips='"确认删除疫苗\""+item.orgGoodsDto.name +"\"?"'-->
                  <!--class="hover-show"><i class="el-icon-t-delete"></i></oms-remove>-->
                  <!--</perm>-->
                  <div class="id-part">
                    <span>疫苗编号{{item.orgGoodsDto.goodsNo}}</span>
                    <el-tag type="primary" style="padding-left: 9px" v-show="item.orgGoodsDto.goodsIsCombination">组合
                    </el-tag>
                    <el-tag type="danger" v-show="item.orgGoodsDto.goodsDto.overdue">注册证照过期</el-tag>
                  </div>
                  <div>
                    <span>{{item.orgGoodsDto.name}}</span>
                  </div>
                </li>
              </ul>

            </div>
          </div>
          <div class="lot-load">
            <bottom-loading></bottom-loading>
            <div @click.stop="getOrgMore" v-show="!$store.state.bottomLoading">
              <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <div v-if="!data.id" class="empty-info">
            请选择
          </div>
          <div class="d-table-col-wrap" :style="'height:'+bodyHeight" v-else>
            <h2 class="clearfix">
            <span class="pull-right">
                 <el-button-group>
                  <perm label="second-vaccine-info-update">
                    <el-button @click="edit"><i class="el-icon-t-edit"></i> 编辑</el-button>
                    </perm>
                   <perm label="second-vaccine-info-start">
                    <el-button @click="enableRelation" v-show="data.status == '0'"><i class="el-icon-t-start"></i> 启用</el-button>
                   </perm>
                   <perm label="second-vaccine-info-stop">
                    <el-button @click="forbid" v-show="data.status == '1' "><i
                      class="el-icon-t-stop"></i> 停用</el-button>
                   </perm>
                   <!--<perm label="second-vaccine-info-delete">-->
                   <!--<el-button @click="remove"><i class="el-icon-t-remove"></i> 删除</el-button>-->
                   <!--</perm>-->
                </el-button-group>
            </span>
            </h2>
            <div class="page-main-body min-row">
              <el-row>
                <el-col :span="4" class="text-right" style="font-size: 12px">
                  [ 产品图片 ]
                </el-col>
                <el-col :span="12" class="text-right" style="font-size: 12px">
                  [ 疫苗信息 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" style="padding-left:50px;">
                  <div class="base-pic-item" @click="handlePreview(data.goodsDto.photoId)">
                    <img
                      :src="data.goodsDto.photo?data.goodsDto.photo+'?image&action=resize:w_380,m_2':'/static/img/userpic.png' "/>
                  </div>
                </el-col>
                <el-col :span="12">
                  <goods-row label="疫苗编号" :span="8">
                    {{ data.goodsNo}}
                  </goods-row>
                  <goods-row label="疫苗名称" :span="8">
                    {{ data.name}}
                  </goods-row>
                  <!--<goods-row label="疫苗分类" :span="8">-->
                  <!--<dict :dict-group="'typeId'" :dict-key="data.goodsDto.typeId"></dict>-->
                  <!--</goods-row>-->
                  <goods-row label="疫苗标志" :span="8">
                    <dict :dict-group="'vaccineSign'" :dict-key="data.goodsDto.vaccineSign"></dict>
                  </goods-row>
                  <goods-row label="储存条件" :span="8">
                    <dict :dict-group="'storageCondition'" :dict-key="data.storageConditionId"></dict>
                  </goods-row>
                  <goods-row label="标准单价" :span="8">
                    <span v-if="data.unitPrice">¥</span> {{ data.unitPrice | formatMoney}}
                  </goods-row>
                  <goods-row label="中标价格" :span="8">
                    <span v-if="data.bidPrice">¥</span> {{ data.bidPrice | formatMoney}}
                  </goods-row>
                  <goods-row label="采购价格" :span="8">
                    <span v-if="data.procurementPrice">¥</span> {{ data.procurementPrice | formatMoney}}
                  </goods-row>
                  <goods-row label="供货厂商" :span="8">
                    {{ data.salesFirmName }}
                  </goods-row>
                  <goods-row label="销售价格" :span="8">
                    <span v-if="data.procurementPrice">¥</span> {{ data.sellPrice | formatMoney}}
                  </goods-row>
                  <goods-row label="库存上限" :span="8">
                    {{ data.inventoryUpperLimit }}
                  </goods-row>
                  <goods-row label="库存下限" :span="8">
                    {{ data.inventoryLowerLimit }}
                  </goods-row>
                  <goods-row label="是否组合" :span="8" v-show="data.goodsIsCombination">
                    {{ data.goodsIsCombination | formatStatus}}
                  </goods-row>
                  <goods-row label="是否计价" :span="8" v-show="data.valuationFlag">
                    {{ data.valuationFlag | formatStatus}}
                  </goods-row>
                </el-col>
              </el-row>
              <div class="border-show"></div>
              <el-row>
                <el-col :span="4" class="text-right" style="font-size: 12px">
                  [ 疫苗标准产品信息 ]
                </el-col>
                <el-col :span="12" class="text-right" style="font-size: 12px">
                  [ 包装存储信息 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <goods-row label="生产厂商" :span="12">{{ data.goodsDto.factoryName }}</goods-row>
                  <goods-row label="规格 / 型号" :span="12">{{ data.goodsDto.specifications }}</goods-row>
                  <goods-row label="疫苗编号" :span="12">{{ data.goodsDto.code }}</goods-row>
                  <goods-row label="疫苗名称" :span="12">{{ data.goodsDto.name }}</goods-row>
                  <goods-row label="剂型" :span="12">
                    <dict :dict-group="'dosageForm'" :dict-key="data.goodsDto.dosageForm"></dict>
                  </goods-row>
                  <goods-row label="基本单位" :span="12">
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.measurementUnit"></dict>
                  </goods-row>
                  <goods-row label="批准文号" :span="12">{{ data.goodsDto.approvalNumber }}</goods-row>
                </el-col>
                <el-col :span="12">
                  <goods-row label="存储类别" :span="8">
                     <span v-for="(item, index) in data.goodsDto.storageType">
                       <dict :dict-group="'storageType'" :dict-key="item"></dict>
                       <span v-if="(data.goodsDto.storageType.length-1) !== index ">/</span>
                    </span>
                  </goods-row>
                  <goods-row label="储存条件" :span="8">
                    <dict :dict-group="'storageCondition'" :dict-key="data.goodsDto.storageConditionId"></dict>
                  </goods-row>
                  <goods-row label="运输温度" :span="8">
                    <span
                      v-show="data.goodsDto.transportStartTemperature">{{ data.goodsDto.transportStartTemperature}} ℃ - {{ data.goodsDto.transportEndTemperature
                      }} ℃</span>
                  </goods-row>
                  <goods-row label="冷藏存储温度" :span="8">
                    <span
                      v-show="data.goodsDto.storageStartTemperature">{{ data.goodsDto.storageStartTemperature}} ℃ - {{ data.goodsDto.storageEndTemperature}} ℃
                    </span>
                  </goods-row>
                  <goods-row label="最小发货单位" :span="8">
                    <dict :dict-group="'shipmentPackingUnit'" :dict-key="data.goodsDto.shipmentPackingUnit"
                          v-show="data.goodsDto.packageSize"></dict>
                    = {{ data.goodsDto.packageSize }}
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.measurementUnit"
                          v-show="data.goodsDto.largePacking"></dict>
                  </goods-row>
                  <goods-row label="大包装" :span="8" v-show="data.goodsDto.largePacking">
                    {{ data.goodsDto.largePacking }}
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.measurementUnit"
                          v-show="data.goodsDto.largePacking"></dict>
                  </goods-row>
                  <goods-row label="中包装" :span="8" v-show="data.goodsDto.measurementUnit">
                    {{ data.goodsDto.mediumPacking }}
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.measurementUnit"
                          v-show="data.goodsDto.mediumPacking"></dict>
                  </goods-row>
                  <goods-row label="小包装" :span="8" v-show="data.goodsDto.smallPacking">
                    {{ data.goodsDto.smallPacking }}
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.measurementUnit"
                          v-show="data.goodsDto.smallPacking"></dict>
                  </goods-row>
                </el-col>
              </el-row>

              <div class="border-show"></div>
              <el-row>
                <el-col :span="4" class="text-right" style="font-size: 12px" v-if="data.goodsDto.typeId==='0'">
                  [ 药品专用 ]
                </el-col>
                <el-col :span="4" class="text-right" style="font-size: 12px" v-if="data.goodsDto.typeId==='1'">
                  [ 疾控专用 ]
                </el-col>
                <el-col :span="4" class="text-right" style="font-size: 12px" v-if="data.goodsDto.typeId==='2'">
                  [ 器械专用 ]
                </el-col>
                <el-col :span="4" class="text-right" style="font-size: 12px" v-if="data.goodsDto.typeId==='3'">
                  [ 化妆品专用 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" v-if="data.goodsDto.typeId!=='4'">
                  <goods-row label="化学名" :span="12"
                             v-if="data.goodsDto.typeId==='0'||data.goodsDto.typeId==='1'||data.goodsDto.typeId==='3'">
                    {{ data.goodsDto.propertyMap.chemicalName }}
                  </goods-row>
                  <goods-row label="器械生产许可证号" :span="12" v-if="data.goodsDto.typeId==='2'">
                    {{ data.goodsDto.propertyMap.productionLicense }}
                  </goods-row>
                  <goods-row label="器械生产许可证号有效期" :span="12" v-if="data.goodsDto.typeId==='2'">
                    {{ data.goodsDto.propertyMap.productionLicenseValidity | date }}
                  </goods-row>
                  <goods-row label="厂家备案凭证号" :span="12" v-if="data.goodsDto.typeId==='2'||data.goodsDto.typeId==='3'">
                    {{ data.goodsDto.propertyMap.recordNumber
                    }}
                  </goods-row>
                  <goods-row label="注册证书/备案凭证号" :span="12"
                             v-if="data.goodsDto.typeId==='2'||data.goodsDto.typeId==='3'">
                    {{ data.goodsDto.propertyMap.registrationRecordNumber }}
                  </goods-row>
                  <goods-row label="备案凭证号有效期" :span="12" v-if="data.goodsDto.typeId==='2'||data.goodsDto.typeId==='3'">
                    {{ data.goodsDto.propertyMap.goodsRecordNOValidity | date }}
                  </goods-row>
                  <goods-row label="OTC标志" :span="12" v-if="data.goodsDto.typeId==='0'">
                    {{ data.goodsDto.propertyMap.goodsOtc | formatStatus}}
                  </goods-row>
                  <goods-row label="毒麻标志" :span="12" v-if="data.goodsDto.typeId==='0'">
                    {{ data.goodsDto.propertyMap.poisonFlaxSign | formatStatus}}
                  </goods-row>
                  <goods-row label="运动员慎用" :span="12" v-if="data.goodsDto.typeId==='0'">
                    {{data.goodsDto.propertyMap.athletesCaution | formatStatus}}
                  </goods-row>
                  <goods-row label="人份" :span="12" v-if="data.goodsDto.typeId==='0'||data.goodsDto.typeId==='1'">
                    {{ data.goodsDto.propertyMap.personPortion }}
                  </goods-row>
                  <goods-row label="是否打印药检报告" :span="12" v-if="data.goodsDto.typeId==='0'||data.goodsDto.typeId==='1'">
                    {{ data.goodsDto.propertyMap.drugTestingSign | formatStatus }}
                  </goods-row>
                  <goods-row label="是否近效期管理" :span="12"
                             v-if="data.goodsDto.typeId==='0'||data.goodsDto.typeId==='1'||data.goodsDto.typeId==='3'">
                    {{ data.goodsDto.propertyMap.lastMaintenanceFlag | formatStatus }}
                  </goods-row>
                  <goods-row label="近效期管理时间" :span="12" v-if="data.goodsDto.propertyMap.lastMaintenanceFlag">
                    {{ data.goodsDto.propertyMap.lastMaintenanceDays }} 天
                  </goods-row>
                  <goods-row label="养护标志" :span="12" v-if="data.goodsDto.typeId==='0'||data.goodsDto.typeId==='1'">
                    {{ data.goodsDto.propertyMap.maintenanceSign | formatStatus }}
                  </goods-row>
                  <goods-row label="养护周期" :span="12" v-if="data.goodsDto.propertyMap.maintenanceSign">
                    {{ data.goodsDto.propertyMap.maintenanceCycle }} 天
                  </goods-row>
                  <goods-row label="稀释液数量" :span="12" v-if="data.goodsDto.typeId==='1'">
                    {{ data.goodsDto.propertyMap.diluentCount }}
                  </goods-row>
                  <goods-row label="接种资料数量" :span="12" v-if="data.goodsDto.typeId==='1'">
                    {{ data.goodsDto.propertyMap.instructionsCount
                    }}
                  </goods-row>
                  <goods-row label="疫苗标志" :span="12" v-if="data.goodsDto.typeId==='1'">
                    <dict :dict-group="'vaccineSign'" :dict-key="data.goodsDto.vaccineSign"></dict>
                  </goods-row>
                  <goods-row label="最小销售单位" :span="12" v-if="data.goodsDto.typeId==='1'">
                    <dict :dict-group="'minSalesUnit'" :dict-key="data.goodsDto.propertyMap.minSalesUnit"></dict>
                  </goods-row>
                </el-col>
              </el-row>
              <div class="border-show"></div>
              <el-row>
                <el-col :span="4" class="text-right" style="font-size: 12px">
                  [ 附件 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" style="padding-left:120px;">
                  <attachment-lists attachmentIdList="" :objectId="data.goodsDto.id"
                                    :objectType="'goodsDocument'"
                                    :permission="'goods-attachment-download'"></attachment-lists>
                </el-col>
              </el-row>
              <div class="border-show" v-show="combinationList.length>0"></div>
              <el-row v-show="combinationList.length>0">
                <el-col :span="4" class="text-right" style="font-size: 12px">
                  [ 组合明细 ]
                </el-col>
              </el-row>
              <el-row v-for="(item, index) in combinationList" :key="item.id">
                <el-col :span="12">
                  <goods-row label="组合疫苗名称" :span="12">
                    {{ item.name}}
                  </goods-row>
                </el-col>
                <el-col :span="12">
                  <goods-row label="组合疫苗比例" :span="12">
                    {{ item.proportion }}
                  </goods-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>

    <page-right :show="showRight" @right-close="resetRightBox">
      <goods-part :formItem="form" :action="action" :userStatus="1" @close="showRight=false" :actionType="showRight"
                  @change="onSubmit"></goods-part>
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
        showTypeRight: false,
        showTypeSearch: false,
        showSearch: false,
        vaccineType: utils.vaccineType,
        activeStatus: 0,
        data: {},
        combinationList: [],
        typeList: [],
        showTypeList: [],
        typeTxt: '',
        form: {},
        action: '',
        currentItem: {},
        filters: {
          status: '1'
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
        height = (height - 25) + 'px';
        return height;
      }
    },
    methods: {
      scrollLoadingData (event) {
        this.$scrollLoadingData(event);
      },
      handlePreview: function (id) {
        this.$store.commit('changeAttachment', id);
      },
      isLocked: function (item) {
        return item.auditedStatus === '3' && item.auditedBy !== this.$store.state.user.userId;
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
        this.typePager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.typePager.pageSize,
          keyWord: this.typeTxt,
          deleteFlag: false
        }, this.filters);
        Vaccine.querySecondVaccine(params).then(res => {
          this.$store.commit('initBottomLoading', false);

          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            this.typeList = res.data.list;
            this.currentItem = Object.assign({orgGoodsDto: {}, list: []}, this.showTypeList[0]);// , this.showTypeList[0]
          }
          this.data.id = '';
          this.typePager.totalPage = res.data.totalPage;
          this.queryOrgGoods();
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
          self.showTypeList.forEach(function (val) {
            if (self.data.id === val.orgGoodsDto.id) {
              item = val;
            }
          });
          item.orgGoodsDto.status = false;
          Vaccine.update(item.orgGoodsDto.id, item).then(() => {
            this.getGoodsList(1);
            this.$notify.success({
              title: '成功',
              message: '已成功停用疫苗"' + item.orgGoodsDto.name + '"'
            });
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
          self.showTypeList.forEach(function (val) {
            if (self.data.id === val.orgGoodsDto.id) {
              item = val;
            }
          });
          item.orgGoodsDto.status = true;
          Vaccine.update(item.orgGoodsDto.id, item).then(() => {
            this.getGoodsList(1);
            this.$notify.success({
              title: '成功',
              message: '已成功启用疫苗"' + item.orgGoodsDto.name + '"'
            });
          });
        });
      },
      remove: function () {
        this.$confirm('确认删除疫苗"' + this.data.name + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let name = this.data.name;
          Vaccine.delete(this.data.id).then(() => {
            this.data = {};
            this.getGoodsList(1);
            this.$notify.success({
              title: '成功',
              message: '已成功删除"' + name + '"'
            });
          });
        });
      },
      removeType: function (item) {
        Vaccine.delete(item.orgGoodsDto.id).then(() => {
          this.data = {};
          this.getGoodsList(1);
          this.$notify.success({
            title: '成功',
            message: '已成功删除疫苗"' + item.orgGoodsDto.name + '"'
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
      },
      onSubmit: function (item) {
        if (this.action === 'add') {
          this.getGoodsList(1);
          this.showRight = false;
        } else {
          let self = this;
          self.showTypeList.forEach(function (val, index) {
            if (item.orgGoodsDto.id === val.orgGoodsDto.id) {
              self.showTypeList.splice(index, 1, item);
              self.data = item.orgGoodsDto;
              self.currentItem = item;
              self.combinationList = item.list;
            }
          });
          this.showRight = false;
        }
      }
    }
  };
</script>
