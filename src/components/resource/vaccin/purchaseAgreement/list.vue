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
      <div class="order-list-status container">
        <div class="status-item" :class="{'active':key==activeStatus} "
             v-for="(item,key) in orgType"
             @click="changeType(key,item)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div>{{item.title}}</div>
        </div>
      </div>
      <div class="container d-table">
        <div class="d-table-left">
          <h2 class="header">
                <span class="pull-right">
                  <perm label="purchase-agreement-add">
                      <a href="#" class="btn-circle" @click.stop.prevent="addType">
                        <i class="iconfont icon-plus"></i>
                      </a>
                  </perm>
                  <!--<a href="#" class="btn-circle" @click.prevent="searchType"><i-->
                  <!--class="iconfont icon-search"></i> </a>-->
                </span>
            疫苗采购协议
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
                  :class="{'active':item==currentItem}">
                <div>
                  <span>{{item.orgGoodsName}}</span>
                </div>
              </li>
            </ul>
            <div class="btn-left-list-more" @click.stop="getMore">
              <el-button v-show="pager.currentPage<pager.totalPage">加载更多</el-button>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <h2 class="clearfix">
            <span class="pull-right">
                 <el-button-group>
                  <perm label="purchase-agreement-edit">
                    <el-button @click="edit"><i class="iconfont icon-edit"></i> 编辑</el-button>
                   </perm>
                   <perm label="purchase-agreement-delete">
                       <el-button @click="remove"><i class="iconfont icon-remove"></i> 删除</el-button>
                   </perm>
                </el-button-group>
            </span>
          </h2>
          <div class="page-main-body min-row">
            <div v-if="currentItem.id===''">
              <el-row>
                <el-col :span="24">
                  <div class="empty-info">
                    暂无信息
                  </div>
                </el-col>
              </el-row>
            </div>
            <div v-if="currentItem.id!==''">
              <el-row>
                <el-col :span="4" class="text-right">
                  货品名称：
                </el-col>
                <el-col :span="20">
                  {{currentItem.orgGoodsName }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4" class="text-right">
                  供货厂商：
                </el-col>
                <el-col :span="20">
                  {{currentItem.factoryName }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4" class="text-right">
                  采购单价：
                </el-col>
                <el-col :span="20">
                  <span v-if="currentItem.unitPrice">￥</span>{{ currentItem.unitPrice}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4" class="text-right">
                  协议采购数量：
                </el-col>
                <el-col :span="20">
                  {{ currentItem.amount}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="4" class="text-right">
                  协议有效时间：
                </el-col>
                <el-col :span="20">
                  {{ currentItem.expireTime | date}}
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <goods-part :formItem="form" :action="action" @right-close="showRight=false" :actionType="showRight"
                  @change="onSubmit"></goods-part>
    </page-right>
  </div>
</template>
<script>
  import goodsPart from './form/form.vue';
  import {Vaccine, PurchaseAgreement} from '../../../../resources';
  import utils from '../../../../tools/utils';

  export default {
    components: {goodsPart},
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
        form: {},
        action: '',
        currentItem: {},
        activeStatus: 0,
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        },
        filters: {
          availabilityStatus: true
//          auditedStatus: null
        },
        orgType: {
          0: {'title': '可用', 'num': 0, 'availabilityStatus': true},
          1: {'title': '停用', 'num': 0, 'availabilityStatus': false}
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
    methods: {
      getMore: function () {
        this.getGoodsList(this.pager.currentPage + 1, true);
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
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getGoodsList: function (pageNo, isContinue = false) {
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyWord: this.typeTxt,
          deleteFlag: false
        }, this.filters);
        PurchaseAgreement.query(params).then(res => {
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            this.typeList = res.data.list;
            if (res.data.list.length > 0) {
              this.currentItem = Object.assign(this.showTypeList[0]);
            } else {
              this.currentItem = Object.assign({'id': ''});
            }
          }
          this.pager.totalPage = res.data.totalPage;
        });
      },
      edit: function () {
        this.action = 'edit';
        this.form = JSON.parse(JSON.stringify(this.currentItem));
        this.form.unitPrice = utils.autoformatDecimalPoint(this.form.unitPrice.toString());
        this.showRight = true;
      },
      remove: function () {
        this.$confirm('确认删除疫苗"' + this.currentItem.orgGoodsName + '的采购协议"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let name = this.currentItem.orgGoodsName;
          PurchaseAgreement.delete(this.currentItem.id).then(() => {
            this.currentItem = {};
            this.getGoodsList(1);
            this.$notify.success({
              title: '成功',
              message: '已成功删除"' + name + '的采购协议"'
            });
          });
        });
      },
      showType: function (item) {
        this.currentItem = item;
      },
      changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
        this.activeStatus = key;
        this.filters.availabilityStatus = item.availabilityStatus;
      },
      onSubmit: function (item) {
//        if (this.action === 'add') {
        this.getGoodsList(1);
        this.showRight = false;
        this.currentItem = {};
//        } else {
//          let self = this;
//          self.showTypeList.forEach(function (val, index) {
//            if (item.id === val.id) {
//              self.showTypeList.splice(index, 1, item);
//              self.currentItem = item;
//            }
//          });
//          this.showRight = false;
//        }
      }
    }
  };
</script>
