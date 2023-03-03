<template>
    <div class="order-page">
        <div class="container">
            <div :class="{up:!showSearch}" class="opera-btn-group">
                <div class="opera-icon">
                <span class="pull-left switching-icon" style="margin-right: 20px" @click="showSearch = !showSearch">
                    <i class="el-icon-arrow-up"></i>
                    <span v-show="showSearch">收起筛选</span>
                    <span v-show="!showSearch">展开筛选</span>
                </span>
                </div>
                <el-form :model="searchWord" class="advanced-query-form" onsubmit="return false">
                <el-row>
                    <!-- <el-col :span="5">
                    <oms-form-row :span="7" label="物流方式">
                        <el-select v-model="searchWord.logisticsType" placeholder="请选择物流方式" type="text">
                        <el-option v-for="item in logisticsModeList" :key="item.key" :label="item.label"
                                    :value="item.key"></el-option>
                        </el-select>
                    </oms-form-row>
                    </el-col>
                    <el-col :span="5">
                    <oms-form-row :span="5" label="供货单位">
                        <el-select v-model="searchWord.povId" :clearable="true" :remote-method="filterOrg" filterable
                                placeholder="请输入名称搜索供货单位" popperClass="good-selects" remote
                                @click.native="filterOrg('')">
                        <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
                            <div style="overflow: hidden">
                            <span class="pull-left" style="clear: right">{{ org.name }}</span>
                            </div>
                            <div style="overflow: hidden">
                            <span class="select-other-info pull-left">
                                <span>系统代码:</span>{{ org.manufacturerCode }}
                            </span>
                            </div>
                        </el-option>
                        </el-select>
                    </oms-form-row>
                    </el-col>
                    <el-col :span="5">
                    <oms-form-row :span="5" label="货主疫苗">
                        <el-select v-model="searchWord.orgGoodsId" :clearable="true" :remote-method="filterOrgGoods" filterable
                                placeholder="请输入名称或编号搜索货主疫苗"
                                popper-class="good-selects" remote
                                @click.native.once="filterOrgGoods('')">
                        <el-option v-for="org in orgGoods" :key="org.id" :label="org.goodsName"
                                    :value="org.id">
                            <div style="overflow: hidden">
                            <span class="pull-left">{{ org.goodsName }}<el-tag v-show="!org.status" style="float: none"
                                                                                type="danger">停用</el-tag></span>
                            </div>
                            <div style="overflow: hidden">
                            <span class="select-other-info pull-left"><span
                                v-show="org.goodsNo">货主货品编号:</span>{{ org.goodsNo }}
                            </span>
                            <span class="select-other-info pull-left"><span
                                v-show="org.saleFirmName">供货单位:</span>{{ org.saleFirmName }}
                            </span>
                            </div>
                        </el-option>
                        </el-select>
                    </oms-form-row>
                    </el-col>
                    <el-col :span="5">
                        <oms-form-row :span="5" label="疫苗类型">
                            <el-radio-group v-model="searchWord.vaccineType">
                                <el-radio-button v-for="item in vaccineTypeList" :key="item.key" :label="item.label"
                                :name="item.key"></el-radio-button>
                            </el-radio-group>
                        </oms-form-row>
                    </el-col> -->
                    <el-col :span="9">
                        <oms-form-row :span="8" label="订单号">
                            <oms-input v-model="searchWord.orderNo" placeholder="请输入订单号" type="text"></oms-input>
                        </oms-form-row>
                    </el-col>
                    <el-col :span="9">
                        <el-row>
                            <el-col :span="8" style="padding-top: 10px;padding-right:8px;text-align: right">
                            实际到达时间
                            </el-col>
                            <el-col :span="16">
                            <el-date-picker
                                v-model="demandTime"
                                format="yyyy-MM-dd"
                                placeholder="请选择实际到达时间" type="daterange">
                            </el-date-picker>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="6">
                    <oms-form-row :span="5" label="">
                        <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                        <el-button @click="resetSearchForm">重置</el-button>
                    </oms-form-row>
                    </el-col>
                </el-row>
                </el-form>
            </div>
            <el-row>
                <el-col :span="13">
                    <div class="order-list-status container clearfix">
                        <div v-for="(item,key) in transitTab"  :class="{'active':key==activeStatus}"
                            class="status-item" style="width: 115px" @click="checkStatus(item, key)">
                        <div :class="['b_color_'+key]" class="status-bg"></div>
                        <div><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{ item.title }}<span class="status-num">
                        {{ item.num }}</span></div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="order-list clearfix " style="margin-top: 20px">
               <el-row class="order-list-header">
                    <el-col :span="5">
                        <!-- <el-checkbox v-show="filters.status === 1 || filters.status === 11" v-model="isCheckAll" @change="checkAll">
                        </el-checkbox> -->
                        供货单位/运单编号
                    </el-col>
                    <el-col :span="6">计划送达时间</el-col>
                    <el-col :span="3">疫苗类型</el-col>
                    <el-col :span="5">货主疫苗名称</el-col>
                    <el-col :span="5">操作</el-col>
                </el-row> 
                <el-row v-if="loadingData">
                    <el-col :span="24">
                        <oms-loading :loading="loadingData"></oms-loading>
                    </el-col>
                </el-row>
                <el-row v-else-if="demandList.length == 0">
                    <el-col :span="24">
                        <div class="empty-info">
                        暂无信息
                        </div>
                    </el-col>
                </el-row>
                <div v-else class="order-list-body flex-list-dom">
                    <div v-for="item in demandList" :class="['status-'+activeStatus,{'active':currentItemId==item.id}]"
                       class="order-list-item">
                       <el-row>
                            <!-- <el-col :class="{'special-col': filters.status === 1 || filters.status === 11}" :span="5" class="R pt10"> -->
                            <el-col  :span="5" class="R pt10">
                                <!-- <div v-show="filters.status === 1 || filters.status === 11" class="el-checkbox-warp"
                                    @click.stop.prevent="checkItem(item)">
                                <el-checkbox v-model="item.isChecked"></el-checkbox>
                                </div> -->
                                {{ item.waybillNumber }}
                                <div>
                                    {{item.senderName}}
                                <!-- <dict :dict-key="'' + item.goodsType" dict-group="orderGoodsType"></dict> -->
                                </div>
                            </el-col>
                            <el-col :span="6" class="pt">
                                <span>{{ item.orderExpectedTime | date}}</span>
                            </el-col>
                            <el-col :span="3" class="pt pl7">
                                <span v-if="item.goodsType == null">其他</span>
                                <span v-else>
                                    <dict :dict-key="''+item.goodsType" dict-group="orderGoodsType"></dict>
                                </span>
                            </el-col>
                            <el-col :span="5" class="pt pl7">
                                <div v-for="(item,index) in item.goodsName" :key="index"><span>{{index+1}}、</span><span>{{item}}</span></div>
                            </el-col>
                            <el-col :span="5" class="opera-btn pl7">
                                <div>
                                    <perm v-show="filters.status !== 'NO'"  label='real-time-trajectory'>
                                        <span @click.prevent="viewTrack(item)">
                                            <a class="btn-circle" href="#" @click.prevent=""><i
                                            class="el-icon-map-location"></i></a>
                                        实时轨迹
                                        </span>
                                    </perm>
                                </div>
                            </el-col>
                        </el-row>
                        <!-- TODO -->
                        <!-- <sale-goods-info :order-item="item"></sale-goods-info>
                        <div class="order-list-item-bg"></div> -->
                    </div>  
                </div>
            </div>
            <div v-show="demandList.length && !loadingData" class="text-center">
                <el-pagination
                :current-page="pager.currentPage" :page-sizes="[10,20,50,100]"
                :pageSize="pager.pageSize"
                :total="pager.count" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange">
                </el-pagination>
            </div>
        </div> 
        <!-- 实时轨迹弹窗 -->
        <div class="trackShow" v-if="trackDialogVisible">
            <el-dialog
            :visible.sync="trackDialogVisible"
            width="30%"
            :show-close="false"
            >
            <div class="title">
                <div>实时运输轨迹<span class="span">-{{currentItem.waybillNumber}}</span> </div>
                <div class="refresh"> 
                    <perm label='real-time-trajectory'>
                        <span @click.prevent="refreshTrack()">
                            <a class="" href="#" @click.prevent=""><i
                            class="el-icon-t-reset"></i></a>
                            刷新
                        </span>
                    </perm>
                </div>
            </div>
            <div>
                <!-- 参数:运单号 -->
                <map-path ref="myMap" :currentItem="currentItem"></map-path>
            </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {http} from '@/resources';
import Perm from '@/components/common/perm';
import MapPath from './components/map-path';
import utils from '../../../tools/utils';
    export default {
        // name:'transit',
        components: {
            Perm,
            MapPath
            // showForm, addForm, editForm
        },
        data(){
            return{
                showSearch: true,
                demandTime:[],
                filters: {
                    status: 'NO', // 未配送 'NO',  配送中 'RUNING', 已完成 'OK'
                    orderNo:'',
                    startDate: '',
                    endDate: '',
                    // povId: '',
                    // orgGoodsId:'',
                    // vaccineType:'',
                    // orgAreaCode: '',
                    // id: '',
                    // goodsType: '',  
                },
                searchWord: {
                    orderNo:'',
                    startDate: '',
                    endDate: '',
                    // logisticsType:'',
                    // povId: '',
                    // orgGoodsId:'',
                    // vaccineType:'',
                    // orgAreaCode: '',
                    // id: '',
                    // goodsType: '',
                },
                orgList:[],  //供货单位list
                orgGoods: [],  // 货主疫苗
                transitTab: utils.transitTab,   // 切换tab
                activeStatus: 0,  
                loadingData:false, 
                demandList: [],
                currentItemId: '',
                currentItem:{},  // 当前选中行数据
                pager: {
                    currentPage: 1,
                    count: 0,
                    pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
                },
                trackDialogVisible:false,
            }
        },
        computed: {
            user() {
                return this.$store.state.user;
            },
            logisticsModeList: function () {
                return this.$getDict('logisticsMode');
            },
            vaccineTypeList: function () {
                return this.$getDict('vaccineType');
            },
        },
        mounted(){
            this.resetSearchForm();
            this.getDemandList(1);
        },
        watch:{
            filters: {
                handler: function () {
                    this.getDemandList(1);
                },
                deep: true
            },
            user(val) {
                if (val.userCompanyAddress) {
                    this.getDemandList(1);
                }
            },
            isShowGoodsList() {
                this.getDemandList(1);
            }
        },
        methods:{
        //    filterOrg: function (query) {// 供货单位
        //         let orgId = this.$store.state.user.userCompanyAddress;
        //         if (!orgId) return;
        //         let params = {
        //             keyWord: query,
        //             relation: '2'
        //         };
        //         BaseInfo.queryOrgByAllRelation(orgId, params).then(res => {
        //             this.orgList = res.data;
        //         });
        //     },
        //     // 货主疫苗 
        //     filterOrgGoods(query) {
        //         let orgId = this.$store.state.user.userCompanyAddress;
        //         let params = Object.assign({}, {
        //             deleteFlag: false,
        //             orgId: orgId,
        //             keyWord: query
        //         });
        //         http.get('/erp-stock/goods', {params}).then(res => {
        //             this.orgGoods = res.data.list;
        //         });
        //     },
            // 实时轨迹
            viewTrack(item){
                this.trackDialogVisible = true
                this.currentItem = item
            },
            // 刷新轨迹
            refreshTrack(){
                this.$nextTick(()=>{
                    this.$refs.myMap.queryPath(this.currentItem.waybillNumber)
                })
            }, 
            // 查询
            searchInOrder(){
                if (this.demandTime instanceof Array && this.demandTime.length && this.demandTime[0]) {
                    this.searchWord.startDate = this.$formatAryTime(this.demandTime, 0);
                    this.searchWord.endDate = this.$formatAryTime(this.demandTime, 1);
                } else {
                    this.demandTime = []
                    this.searchWord.startDate = ''
                    this.searchWord.endDate = ''
                }
                Object.assign(this.filters, this.searchWord);
            },
            handleSizeChange(val) {
                this.pager.pageSize = val;
                window.localStorage.setItem('currentPageSize', val);
                this.getDemandList(1);
            },
            handleCurrentChange(val) {
                this.getDemandList(val);
            },
            getDemandList(pageNo) { // 得到需求列表
                this.isCheckAll = false;
                this.checkList = [];
                let orgId = this.user.userCompanyAddress;
                if (!orgId) return;
                this.pager.currentPage = pageNo;
                let searchCondition = {};
                // 查询采购单
                // if (this.filters.status > 10) {
                //     searchCondition = Object.assign({}, this.filters, {
                //     procurementStatus: this.filters.status === 11 ? 0 : this.filters.status === 12 ? 1 : 2
                //     });
                //     searchCondition.status = undefined;
                // } else {
                    searchCondition = Object.assign({}, this.filters);
                // }
                // if (searchCondition.status === 3) searchCondition.cancelFlag = '0';
                let params = Object.assign({
                    pageNo: pageNo,
                    pageSize: this.pager.pageSize
                }, searchCondition);
                params.isShowDetail = !!JSON.parse(window.localStorage.getItem('isShowGoodsList'));
                this.loadingData = true;
                http.get(`/erp-order/tmsOrder`, {params}).then(res => {
                    this.loadingData = false;
                    res.data.list.forEach(item => {
                        // item.isChecked = false;
                        if(item.goodsName.charAt(item.goodsName.length-1) ==','){
                            item.goodsName = item.goodsName.substring(0,item.goodsName.length-1)
                        }
                        item.goodsName = item.goodsName.split(',')
                        // 删除多余的，
                        item.goodsName = item.goodsName.filter(val=> {
                            return val !='' && val !=' '
                        })
                        // item.orderExpectedTime?this.changeTime(item.orderExpectedTime):''
                    });
                    console.log(res.data.list,'res.data.list')
                    this.demandList = res.data.list;
                    this.pager.count = res.data.count;
                    this.queryCount();
                })
                .catch(()=>{
                    this.loadingData = false;
                })
            },
            // tab切换数量
            queryCount(){
                let params = Object.assign({}, this.filters);
                // let params = {};
                http.get(`/erp-order/tmsOrderCount`, {params}).then(res => {
                    let NOArr = []
                    let RUNINGArr = []
                    let OKArr = []
                    if(res.data.length !=0){
                        NOArr = res.data.filter(item=>{ return item.NO})
                        RUNINGArr =  res.data.filter(item=>{ return item.RUNING})
                        OKArr = res.data.filter(item=>{ return item.OK})
                    }
                    this.transitTab[0].num = NOArr.length !=0 ? NOArr[0].NO : 0
                    this.transitTab[1].num = RUNINGArr.length !=0 ? RUNINGArr[0].RUNING : 0
                    this.transitTab[2].num = OKArr.length !=0 ? OKArr[0].OK : 0
                });
            },
            checkStatus(item, key) {
                this.activeStatus = key;
                this.filters.status = item.status;
            },
            
            // 重置表单
            resetSearchForm: function () {
                let temp = {
                    orderNo:'',
                    startDate:'',
                    endDate:'',
                };
                this.demandTime = []
                Object.assign(this.searchWord, temp);
                Object.assign(this.filters, temp);
            }
        }
    }
</script>

<style lang="scss" scoped>
.special-col {
  padding-left: 20px;
  position: relative;

  .el-checkbox {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  } 
}
.app-body .el-date-editor--daterange.el-input__inner{
    max-width: 100% !important;
}
</style>
<style lang="scss">
.trackShow{
  .el-dialog__wrapper {
      text-align: center;
      white-space: nowrap;
      overflow: auto;
      &:after {
        content: "";
        display: inline-block;
        vertical-align: middle;
        height: 100%;
      }
      .el-dialog {
        margin: 30px auto !important;
        display: inline-block;
        vertical-align: middle;
        text-align: left;
        white-space: normal;
        .el-dialog__header{
          display: none !important;
        } 
        .el-dialog__body{
            padding: 0 !important;
        } 
      }
    }
    .title{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        box-sizing: border-box;
        padding: 25px;
        font-size:20px;
        font-weight: 700;
        .span{
            font-weight: 600;
            font-size: 16px;
        }
        .refresh{
            font-weight: 600;
            font-size: 18px;
            cursor: pointer;
            .el-icon-t-reset{
                font-size: 18px;
            }
        }
    }
}
</style>