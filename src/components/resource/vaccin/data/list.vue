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
    width: 180px;
    margin: 5px;
    padding: 10px;
    font-size: 12px;
    img {
      width: 180px;
      height: 180px;
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
</style>
<template>
  <div>
    <div>
      <div class="container d-table">
        <div class="d-table-left">
          <h2 class="header">
                <span class="pull-right">
                  <perm label="org-goods-add">
                      <a href="#" class="btn-circle" @click.stop.prevent="addType">
                        <i class="iconfont icon-plus"></i>
                      </a>
                  </perm>
                    <a href="#" class="btn-circle" @click.prevent="searchType"><i
                      class="iconfont icon-search"></i> </a>
                </span>
            疫苗资料
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
                  :class="{'active':item.orgGoodsDto==currentItem.orgGoodsDto,'locked':isLocked(item.orgGoodsDto)}">
                <perm label="org-goods-delete">
                  <oms-remove :item="item" @removed="removeType" :tips='"确认删除货品\""+item.orgGoodsDto.name +"\"?"'
                              class="hover-show"><i class="iconfont icon-delete"></i></oms-remove>
                </perm>
                <div class="id-part">
                  <span>货主货品ID{{item.orgGoodsDto.id}}</span>
                  <el-tag type="primary" style="padding-left: 9px" v-show="item.orgGoodsDto.goodsIsCombination">组合
                  </el-tag>
                  <el-tag type="danger" v-show="item.orgGoodsDto.goodsDto.overdue">证照过期</el-tag>
                </div>
                <div>
                  <span>{{item.orgGoodsDto.name}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="d-table-right">
          <div v-if="!data.id" class="empty-info">
            请选择
          </div>
          <div v-else>
            <h2 class="clearfix">
            <span class="pull-right">
                <!--  <a href="#" class="btn-circle"><i class="iconfont icon-filter"></i> </a>-->
              <perm label="org-goods-edit">
                   <a href="#" @click.stop.prevent="edit()"><i class="iconfont icon-edit"></i>编辑</a>
                <a href="#" @click.stop.prevent="forbid()" class="margin-left" v-show="data.status == '1' "><i
                  class="iconfont icon-forbidden"></i>停用</a>
                <a href="#" @click.stop.prevent="enableRelation()" class="margin-left" v-show="data.status == '0' "><i
                  class="iconfont icon-start"></i>启用</a>
              </perm>
             <perm label="org-goods-check">
               <a href="#" @click.prevent="remove()" class="margin-left"><i class="iconfont icon-delete"></i>删除</a>
                    <a href="#" @click.prevent="audited()" class="margin-left"
                       v-show="data.status&&data.auditedStatus==='0'"><i
                      class="iconfont icon-verify"></i>审核通过</a>
                  <a href="#" @click.prevent="notAudited()" class="margin-left"
                     v-show="data.status&&data.auditedStatus==='0'"><i
                    class="iconfont icon-verify"></i>审核不通过</a>
             </perm>
            </span>
            </h2>
            <div class="page-main-body min-row">
              <el-row>
                <el-col :span="3" class="text-right" style="font-size: 12px">
                  [ 产品图片 ]
                </el-col>
                <el-col :span="12" class="text-right" style="font-size: 12px">
                  [ 货主货品信息 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" style="padding-left:120px;">
                  <div class="base-pic-item" @click="handlePreview(data.goodsDto.photoId)">
                    <img :src="data.goodsDto.photo "/>
                  </div>
                </el-col>
                <el-col :span="12">
                  <goods-row label="货主货品ID" :span="12">
                    {{ data.id}}
                  </goods-row>
                  <goods-row label="货主货品名称" :span="12">
                    {{ data.name}}
                  </goods-row>
                  <goods-row label="货品分类" :span="12">
                    <dict :dict-group="'typeId'" :dict-key="data.goodsDto.typeId"></dict>
                  </goods-row>
                  <goods-row label="储存条件" :span="12">
                    <dict :dict-group="'storageCondition'" :dict-key="data.storageConditionId"></dict>
                  </goods-row>
                  <goods-row label="单价" :span="12">
                    ¥ {{ data.unitPrice | formatMoney}}
                  </goods-row>
                  <goods-row label="库存上限" :span="12">
                    {{ data.inventoryUpperLimit }}
                  </goods-row>
                  <goods-row label="库存下限" :span="12">
                    {{ data.inventoryLowerLimit }}
                  </goods-row>
                  <goods-row label="是否组合" :span="12" v-show="data.goodsIsCombination">
                    {{ data.goodsIsCombination | formatIsUse}}
                  </goods-row>
                  <goods-row label="是否可用" :span="12" v-show="data.status">
                    {{ data.status | formatIsUse}}
                  </goods-row>
                  <goods-row label="是否计价" :span="12" v-show="data.valuationFlag">
                    {{ data.valuationFlag | formatIsUse}}
                  </goods-row>
                </el-col>
              </el-row>
              <div class="border-show"></div>
              <el-row>
                <el-col :span="3" class="text-right" style="font-size: 12px">
                  [ OMS货品信息 ]
                </el-col>
                <el-col :span="12" class="text-right" style="font-size: 12px">
                  [ 包装存储信息 ]
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <goods-row label="厂家名称" :span="12">{{ data.goodsDto.factoryName }}</goods-row>
                  <goods-row label="规格 / 型号" :span="12">{{ data.goodsDto.specifications }}</goods-row>
                  <goods-row label="货品名称" :span="12">{{ data.goodsDto.name }}</goods-row>
                  <goods-row label="剂型" :span="12">
                    <dict :dict-group="'dosageForm'" :dict-key="data.goodsDto.dosageForm"></dict>
                  </goods-row>
                  <goods-row label="基本单位" :span="12">
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.measurementUnit"></dict>
                  </goods-row>
                  <goods-row label="批准文号" :span="12">{{ data.goodsDto.approvalNumber }}</goods-row>
                </el-col>
                <el-col :span="12">
                  <goods-row label="存储类别" :span="12">
                    <dict :dict-group="'storageType'" :dict-key="data.goodsDto.storageType"></dict>
                  </goods-row>
                  <goods-row label="储存条件" :span="12">
                    <dict :dict-group="'storageCondition'" :dict-key="data.goodsDto.storageConditionId"></dict>
                  </goods-row>
                  <goods-row label="运输温度" :span="12">
                    <span
                      v-show="data.goodsDto.transportStartTemperature">{{ data.goodsDto.transportStartTemperature}} ℃ - {{ data.goodsDto.transportEndTemperature
                      }} ℃</span>
                  </goods-row>
                  <goods-row label="冷藏存储温度" :span="12">
                    <span
                      v-show="data.goodsDto.storageStartTemperature">{{ data.goodsDto.storageStartTemperature}} ℃ - {{ data.goodsDto.storageEndTemperature}} ℃
                    </span>
                  </goods-row>
                  <goods-row label="最小发货单位" :span="12">
                    <dict :dict-group="'shipmentPackingUnit'" :dict-key="data.goodsDto.shipmentPackingUnit"
                          v-show="data.goodsDto.packageSize"></dict>
                    = {{ data.goodsDto.packageSize }}
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.measurementUnit"
                          v-show="data.goodsDto.largePacking"></dict>
                  </goods-row>
                  <goods-row label="大包装" :span="12" v-show="data.goodsDto.largePacking">
                    {{ data.goodsDto.largePacking }}
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.measurementUnit"
                          v-show="data.goodsDto.largePacking"></dict>
                  </goods-row>
                  <goods-row label="中包装" :span="12" v-show="data.goodsDto.measurementUnit">
                    {{ data.goodsDto.mediumPacking }}
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.measurementUnit"
                          v-show="data.goodsDto.mediumPacking"></dict>
                  </goods-row>
                  <goods-row label="小包装" :span="12" v-show="data.goodsDto.smallPacking">
                    {{ data.goodsDto.smallPacking }}
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.measurementUnit"
                          v-show="data.goodsDto.smallPacking"></dict>
                  </goods-row>
                </el-col>
              </el-row>

              <div class="border-show"></div>
              <el-row>
                <el-col :span="3" class="text-right" style="font-size: 12px" v-if="data.goodsDto.typeId==='0'">
                  [ 药品专用 ]
                </el-col>
                <el-col :span="3" class="text-right" style="font-size: 12px" v-if="data.goodsDto.typeId==='1'">
                  [ 疫苗专用 ]
                </el-col>
                <el-col :span="3" class="text-right" style="font-size: 12px" v-if="data.goodsDto.typeId==='2'">
                  [ 器械专用 ]
                </el-col>
                <el-col :span="3" class="text-right" style="font-size: 12px" v-if="data.goodsDto.typeId==='3'">
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
                    <dict :dict-group="'measurementUnit'" :dict-key="data.goodsDto.propertyMap.firstVaccineSign"></dict>
                  </goods-row>
                  <goods-row label="最小销售单位" :span="12" v-if="data.goodsDto.typeId==='1'">
                    <dict :dict-group="'minSalesUnit'" :dict-key="data.goodsDto.propertyMap.minSalesUnit"></dict>
                  </goods-row>
                </el-col>
              </el-row>
              <div class="border-show" v-show="combinationList.length>0"></div>
              <el-row v-show="combinationList.length>0">
                <el-col :span="3" class="text-right" style="font-size: 12px">
                  [ 组合明细 ]
                </el-col>
              </el-row>
              <el-row v-for="(item, index) in combinationList" :key="item.id">
                <el-col :span="12">
                  <goods-row label="组合货品名称" :span="12">
                    {{ item.name}}
                  </goods-row>
                </el-col>
                <el-col :span="12">
                  <goods-row label="组合货品比例" :span="12">
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
      <goods-part :formItem="form" :action="action" @close="showRight=false" :actionType="showRight"
                  @change="onSubmit"></goods-part>
    </page-right>
  </div>
</template>
<script>
  import { http } from '@/resources';
  import goodsPart from './form/form.vue';
  import { OrgGoods } from '@/resources';
  import goodsRow from './goods.row.vue';

  export default {
    components: {goodsPart, goodsRow},
    data: function () {
      return {
        showRight: false,
        showTypeRight: false,
        showTypeSearch: false,
        showSearch: false,
        data: {},
        combinationList: [],
        typeList: [],
        showTypeList: [],
        typeTxt: '',
        keyTxt: '',
        form: {},
        action: '',
        currentItem: {},
        orgType: {
          0: {'title': '所有', 'num': '0', 'status': null, 'auditedStatus': null},
          1: {'title': '正常', 'num': '0', 'status': true, 'auditedStatus': '1'},
          2: {'title': '待审核', 'num': '0', 'status': true, 'auditedStatus': '0'},
          3: {'title': '审核未通过', 'num': '0', 'status': true, 'auditedStatus': '2'},
          4: {'title': '停用', 'num': '0', 'status': false}
        },
        activeStatus: 0,
        filters: {
          status: null,
          auditedStatus: null
        }
      };
    },
    filters: {
      formatIsUse: function (value) {
        return value ? '是' : '否';
      }
    },
    mounted () {
      this.$emit('loaded');
      this.getGoodsList();
    },
    watch: {
      'typeTxt': function () {
        this.getGoodsList();
      },
      filters: {
        handler () {
          this.getGoodsList();
        },
        deep: true
      }
    },
    methods: {
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
          unitPrice: '',
          valuationFlag: false,
          storageConditionId: '',
          inventoryLowerLimit: null,
          inventoryUpperLimit: null
        };
        this.showRight = true;
        this.combinationList = [];
        this.$notify.info({
          duration: 20000,
          message: '添加货品时，只能添加通过审核的、与货主经营范围保持一致的oms货品'
        });
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      pickTypeList: function () {
        let arr = [];
        let self = this;
        this.typeList.forEach(function (value) {
          if (value.title.indexOf(self.typeTxt) !== -1) {
            arr.push(value);
          }
        });
        this.showTypeList = arr;
      },
      getGoodsList: function () {
        let params = Object.assign({}, {
          deleteFlag: false,
          orgId: this.$route.params.id,
          keyWord: this.typeTxt
        }, this.filters);
        OrgGoods.query(params).then(res => {
          this.showTypeList = res.data.list;
          this.typeList = res.data.list;
          this.currentItem = Object.assign({orgGoodsDto: {}, list: []}, this.showTypeList[0]);// , this.showTypeList[0]
          this.data.id = '';
          this.queryOrgGoods();
        });
        this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        OrgGoods.queryStateNum(params).then(res => {
          let data = res.data;
          this.orgType[0].num = data['all'];
          this.orgType[1].num = data['normal'];
          this.orgType[2].num = data['audit'];
          this.orgType[3].num = data['notAudit'];
          this.orgType[4].num = data['disable'];
        });
      },
      queryOrgGoods () {
        let id = this.currentItem.orgGoodsDto.id;
        if (!id) return;
        http.get('/org/goods/' + id).then(res => {
          this.data = res.data.orgGoodsDto;
          this.combinationList = res.data.list;
        });
      },
      edit: function () {
        this.action = 'edit';
        this.form = JSON.parse(JSON.stringify(this.data));
        this.showRight = true;
      },
      audited: function () {
        this.$confirm('确认通过货品"' + this.data.name + '"的审核?', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          OrgGoods.check(this.currentItem.orgGoodsDto.id, {status: '1'}).then(() => {
            this.getGoodsList();
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '审核货品"' + this.data.name + '"成功'
            });
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '审核货品"' + this.data.name + '"失败'
            });
          });
        }).catch(() => {
        });
      },
      notAudited: function () {
        this.$confirm('确认不通过货品"' + this.data.name + '"的审核?', '', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          OrgGoods.check(this.currentItem.orgGoodsDto.id, {status: '2'}).then(() => {
            this.getGoodsList();
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '货品"' + this.data.name + '"的审核未通过'
            });
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '货品"' + this.data.name + '"的审核未通过失败'
            });
          });
        }).catch(() => {

        });
      },
      forbid: function () {
        this.$confirm('确认停用货品"' + this.data.name + '"?', '', {
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
          OrgGoods.update(item.orgGoodsDto.id, item).then(() => {
            this.getGoodsList();
            this.$notify.success({
              title: '成功',
              message: '已成功停用货品"' + item.orgGoodsDto.name + '"'
            });
          });
        });
      },
      enableRelation: function () {
        this.$confirm('确认启用货品"' + this.data.name + '"?', '', {
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
          OrgGoods.update(item.orgGoodsDto.id, item).then(() => {
            this.getGoodsList();
            this.$notify.success({
              title: '成功',
              message: '已成功启用货品"' + item.orgGoodsDto.name + '"'
            });
          });
        });
      },
      remove: function () {
        this.$confirm('确认删除货品"' + this.data.name + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let name = this.data.name;
          OrgGoods.delete(this.data.id).then(() => {
            this.data = {};
            this.getGoodsList();
            this.$notify.success({
              title: '成功',
              message: '已成功删除"' + name + '"'
            });
          });
        });
      },
      removeType: function (item) {
        OrgGoods.delete(item.orgGoodsDto.id).then(() => {
          this.data = {};
          this.getGoodsList();
          this.$notify.success({
            title: '成功',
            message: '已成功删除货品"' + item.orgGoodsDto.name + '"'
          });
        });
      },
      showType: function (item) {
        if (this.isLocked(item.orgGoodsDto)) {
          this.$notify.info({
            message: '已被其他用户锁定，暂时无法查看'
          });
          this.data = {id: ''};
          this.combinationList = [];
          return;
        }
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
          this.getGoodsList();
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
