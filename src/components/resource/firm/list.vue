<style lang="less" scoped>
  @import "../../../assets/mixins.less";

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

  .business-scope {
    border: 1px solid #cccccc;
    border-radius: 5px;
    width: 120px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    .scope-span {
      position: relative;
      top: 10px;
    }
  }

  .el-form .el-select {
    display: block;
  }

  .row-ul-li {
    ul {
      margin: 0 0;

      li {
        padding: 5px 10px;
        display: inline-block;
        border: 1px solid #eee;
        margin-right: 20px;
        margin-bottom: 10px;
        font-size: 12px;
      }
    }
  }

  .el-dropdown {
    color: #2b2d2f;
    font-size: 16px;
  }

  .el-dropdown {
    .el-icon--right {
      margin-left: 10px;
    }
  }

  .base-pic-list {
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    .base-pic-item {
      border: 1px solid #eee;
      position: relative;
      cursor: pointer;
      width: 180px;
      margin: 5px;
      padding: 10px;
      font-size: 12px;
      h3 {
        margin: 0;
        font-size: 14px;
        font-weight: bold;
        position: relative;
      }
      img {
        width: 180px;
        height: 180px;
        display: block;
        background: #ccc;

      }
      .opera-tools {
        font-weight: normal;
        position: absolute;
        right: 5px;
        top: 0;
        color: #333;
        cursor: pointer;

        span {
          margin-left: 8px;;
          font-size: 14px;
          &:hover {
            color: @activeColor;
          }
        }
      }
    }
  }

  .page-main-body {
    .el-row {
      margin-bottom: 10px;
    }
  }

  .d-table-col-wrap {
    overflow: auto;
  }
</style>
<template>
  <div>
    <div>
      <div class="order-list-status container" style="margin-bottom:20px">
        <div class="status-item"
             :class="{'active':key==activeStatus,'exceptionPosition':key === '5'}"
             v-for="(item,key) in firmType"
             @click="changeStatus(item,key)">
          <div class="status-bg" :class="['b_color_'+key]"></div>
          <div class="status-title">{{item.title}}<span class="status-num">{{item.num}}</span></div>
        </div>
      </div>
      <div class="container d-table">

        <div class="d-table-left">
          <div class="d-table-col-wrap" :style="'max-height:'+bodyHeight">
            <h2 class="header" style="overflow: hidden">
              厂商资料
              <span class="pull-right">
                   <perm label="manufacturer-add">
                      <a href="#" class="btn-circle" @click.stop.prevent="addType"><i
                        class="iconfont icon-plus"></i> </a>
                   </perm>
                      <a href="#" class="btn-circle" @click.prevent="searchType"><i
                        class="iconfont icon-search"></i> </a>
                </span>
            </h2>
            <div class="search-left-box clearfix" v-show="showTypeSearch">
              <oms-input v-model="filters.keyWord" placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
            </div>
            <div v-if="loadingListData">
              <oms-loading :loading="loadingListData"></oms-loading>
            </div>
            <div v-else-if="businessRelationList.length == 0" class="empty-info">
              暂无信息
            </div>
            <div v-else>
              <ul class="show-list">
                <li v-for="item in businessRelationList" class="list-item" @click="showType(item)"
                    :class="{'active':item.id==currentItem.id}">
                  <div class="id-part">
                    <el-tag type="warning" v-show=" isExpirationTime(item) === '1' ">即将到期</el-tag>
                    <el-tag type="danger" v-show=" isExpirationTime(item) === '2' ">已过期</el-tag>
                  </div>
                  <div>
                    {{item.followOrgName }}
                  </div>
                </li>
              </ul>
              <div class="btn-left-list-more" @click.stop="getOrgMore">
                <el-button v-show="typePager.currentPage<typePager.totalPage">加载更多</el-button>
              </div>
            </div>
          </div>
        </div>
        <div class="d-table-right">
          <div v-if="loadingData">
            <oms-loading :loading="loadingData"></oms-loading>
          </div>
          <div v-else-if="!businessRelationItem.followOrg" class="empty-info">
            暂无信息
          </div>
          <div v-else>
            <h2 class="clearfix">
              <span class="pull-right">
                 <!--<perm label="org-relation-edit">-->
                <!--<a href="#" @click.prevent="edit" class="margin-left"><i-->
                <!--class="iconfont icon-edit"></i>编辑</a>-->
                <!--<a href="#" @click.prevent="forbid" class="margin-left"-->
                <!--v-show="businessRelationItem.status  == '0' "><i-->
                <!--class="iconfont icon-forbidden"></i>停用</a>-->
                <!--<a href="#" @click.prevent="enableRelation" class="margin-left"-->
                <!--v-show="businessRelationItem.status == '1' "><i-->
                <!--class="iconfont icon-start"></i>启用</a>-->
                <!--</perm>-->
                <el-button-group>
                  <perm label="manufacturer-update">
                    <el-button @click="edit"><i class="iconfont icon-edit"></i>编辑</el-button>
                  </perm>
                  <perm label="manufacturer-stop">
                      <el-button @click="forbid" v-show="businessRelationItem.status  == '0' "><i
                        class="iconfont icon-stop"></i>停用</el-button>
                  </perm>
                  <perm label="manufacturer-start">
                        <el-button @click="enableRelation" v-show="businessRelationItem.status == '1' "><i
                          class="iconfont icon-start"></i>启用</el-button>
                  </perm>
                </el-button-group>
              </span>
            </h2>
            <div class="page-main-body">
              <!--todo 添加logo-->
              <el-row>
                <el-col :span="5" class="text-right">
                  单位名称：
                </el-col>
                <el-col :span="7">
                  {{ businessRelationItem.followOrg.orgDto.name }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="text-right">
                  统一社会信用代码：
                </el-col>
                <el-col :span="7">
                  {{ businessRelationItem.followOrg.orgDto.creditCode }}
                </el-col>
                <el-col :span="4" class="text-right">
                  建立日期：
                </el-col>
                <el-col :span="8">
                  {{ businessRelationItem.followOrg.orgDto.createTime | date}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="text-right">
                  法人代表：
                </el-col>
                <el-col :span="7">
                  {{ businessRelationItem.followOrg.orgDto.legalRepresentative }}
                </el-col>

                <el-col :span="4" class="text-right">
                  邮政编码：
                </el-col>
                <el-col :span="8">
                  {{ businessRelationItem.followOrg.orgDto.postcode }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="text-right">
                  联系人：
                </el-col>
                <el-col :span="7">
                  {{ businessRelationItem.followOrg.orgDto.contact }}
                </el-col>

                <el-col :span="4" class="text-right">
                  所在地区：
                </el-col>
                <el-col :span="8">
                  {{ companyAddress }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="text-right">
                  联系电话：
                </el-col>
                <el-col :span="7">
                  {{ businessRelationItem.followOrg.orgDto.phone }}
                </el-col>

                <el-col :span="4" class="text-right">
                  详细地址：
                </el-col>
                <el-col :span="8">
                  {{ businessRelationItem.followOrg.orgDto.address }}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5" class="text-right">
                  备注：
                </el-col>
                <el-col :span="7">
                  {{ businessRelationItem.followOrg.orgDto.remarks }}
                </el-col>

                <el-col :span="4" class="text-right">
                  有效期限：
                </el-col>
                <el-col :span="8">
                  {{businessRelationItem.expirationDate | date}}
                </el-col>
              </el-row>
              <div v-show="businessRelationItem.followOrg.scopes.length>0">
                <el-row style="margin-bottom: 0">
                  <el-col :span="3" class="text-right">
                    <h3>经营范围</h3>
                  </el-col>
                </el-row>
                <el-row class="row-ul-li" style="margin-bottom: 0">
                  <el-col :span="3">
                  </el-col>
                  <el-col :span="21">
                    <ul>
                      <li v-for="item in businessRelationItem.followOrg.scopes">
                        <dict :dict-group="'scopes'" :dict-key="item.scopeId"></dict>
                      </li>
                    </ul>
                  </el-col>
                </el-row>
              </div>
              <div v-show="businessRelationItem.followOrg.legislations.length>0">
                <el-row style="margin-bottom: 3px">
                  <el-col :span="3" class="text-right">
                    <h3>受控法规</h3>
                  </el-col>
                </el-row>
                <el-row class="row-ul-li" style="margin-bottom: 0">
                  <el-col :span="3">
                  </el-col>
                  <el-col :span="21">
                    <ul>
                      <li v-for="item in businessRelationItem.followOrg.legislations">{{item.name}}</li>
                    </ul>
                  </el-col>
                </el-row>
              </div>
              <div v-show="businessRelationItem.followOrg.licenses.length>0">
                <el-row style="margin-bottom: 0">
                  <el-col :span="3" class="text-right">
                    <h3>客户证照</h3>
                  </el-col>
                </el-row>
                <div class="base-pic-list">
                  <div v-for=" licence in businessRelationItem.followOrg.licenses" class="base-pic-item">
                    <div @click="watchPhoto(licence)">
                      <img :src="licence.photoThumb ">
                      <h3>{{licence.name}}</h3>
                      <div>有效期:{{licence.validStartTime | date}}至{{licence.validEndTime | date}}</div>
                      <div>
                        <el-tag type="primary" v-show="licence.expireStatus==='0'">正常</el-tag>
                        <el-tag type="warning" v-show="licence.expireStatus==='1'">即将到期</el-tag>
                        <el-tag type="danger" v-show="licence.expireStatus==='2'">已过期</el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <el-form ref="relationForm" :rules="rules" :model="form" label-width="100px" class="demo-ruleForm"
               @submit.prevent="onSubmit('relationForm')" onsubmit="return false">
        <h2 class="clearfix">添加厂商</h2>
        <el-form-item label="往来单位" prop="followOrgId">
          <el-select placeholder="请输入关键字搜索厂商" remote :remote-method="queryOtherBusiness" :clearable="true"
                     v-model="form.followOrgId"
                     filterable popper-class="good-selects">
            <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in orgList"
                       v-show="item.auditedStatus ==1">
              <div style="overflow: hidden">
                <span class="pull-left">{{item.name}}</span>
              </div>
              <div style="overflow: hidden">
                  <span class="select-other-info pull-left">
                    <span>系统代码</span> {{item.manufacturerCode}}
                  </span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期" prop="expirationDate">
          <el-date-picker v-model="form.expirationDate" format="yyyy-MM-dd" placeholder="选择日期"
                          style="width: 100%;" @change="changeExpirationDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label-width="120px">
          <el-button type="primary" @click="onSubmit('relationForm')" native-type="submit" :disabled="doing">保存
          </el-button>
          <el-button @click="doClose">取消</el-button>
        </el-form-item>
      </el-form>
    </page-right>
    <page-right :show="showPhotoRightShow" @right-close="resetPhoto">
      <photo-show :formItem="photoForm" @close="showPhotoRightShow=false"></photo-show>
    </page-right>
  </div>

</template>
<script>
  import { BaseInfo, Vendor } from '@/resources';
  import utils from '@/tools/utils';
  import photoShow from './photo/photo.show.vue';

  export default {
    components: {photoShow},
    data: function () {
      return {
        showRight: false,
        showTypeSearch: false,
        loadingData: false,
        loadingListData: false,
        showPhotoRightShow: false,
        businessRelationList: [], // 厂商列表
        businessRelationItem: {}, // 厂商单条数据
        currentItem: {}, // 与厂商单条数据相等，完成一些操作
        currentName: '', // 当前单位的名字
        relationData: {}, // 与厂商单条数据相等，完成一些操作
        firmType: utils.firmType,
        activeStatus: '0',
        // 过滤条件
        filters: {
          keyWord: '',
          status: ''
        },
        // 表单操作
        form: {},
        action: '',
        orgList: [{id: '', nameJc: ''}],
        doing: false,
        photoForm: {
          name: '',
          photos: [],
          validStartTime: '',
          validEndTime: ''
        },
        rules: {
          followOrgId: [
            {required: true, message: '请选择厂商', trigger: 'blur'}
          ],
          expirationDate: [
            {required: true, message: '请选择有效期', trigger: 'change'}
          ]
        },
        typePager: {
          currentPage: 1,
          count: 0,
          pageSize: 20,
          totalPage: 1
        }
      };
    },
    computed: {
      orgRelationList () {
        return this.$store.state.dict['orgRelation'];
      },
      companyAddress () {
        let province = this.businessRelationItem.followOrg.orgDto.province;
        let city = this.businessRelationItem.followOrg.orgDto.city;
        let region = this.businessRelationItem.followOrg.orgDto.region;
        return utils.formatAddress(province, city, region);
      },
      bodyHeight: function () {
        return this.$store.state.bodyHeight;
      }
    },
    watch: {
      filters: {
        handler () {
          this.getBusinessRelationList(1);
        },
        deep: true
      },
      showRight: function (val) {
        if (!val) {
          this.$refs['relationForm'].resetFields();
        }
      }
    },
    mounted () {
      this.getBusinessRelationList(1);
    },
    methods: {
      resetPhoto: function () {
        this.photoForm = {
          name: '',
          photos: [],
          validStartTime: '',
          validEndTime: ''
        };
        this.resetRightBox();
      },
      watchPhoto (item) {
        this.photoForm = item;
        this.showPhotoRightShow = true;
      },
      isExpirationTime: function (item) {
        let state = '';
        let d1 = this.$moment(item.expirationDate);
        let nowDay = this.$moment();
        let value = d1.diff(nowDay, 'days');
        if (value < 0) {
          state = '2';
        } else {
          if (value < 30) {
            state = '1';
          } else {
            state = '';
          }
        }
        return state;
      },
      getBusinessRelationList (pageNo, isContinue = false) {
        this.typePager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.typePager.pageSize
        }, this.filters);
        this.loadingListData = true;
        Vendor.query(params).then(res => {
          if (isContinue) {
            this.businessRelationList = this.businessRelationList.concat(res.data.list);
          } else {
            this.businessRelationList = res.data.list;
            this.currentItem = Object.assign({}, {'id': ''}, this.businessRelationList[0]);
            this.currentName = this.currentItem.followOrgName;
            this.relationData = this.currentItem;
          }
          this.typePager.totalPage = res.data.totalPage;
          this.loadingListData = false;
          this.getBusinessRelationItem(this.currentItem.id);
        });
      },
      getBusinessRelationItem: function (id) {
        this.businessRelationItem = {};
        if (!id) return false;
        this.loadingData = true;
        Vendor.queryVendorDetail(id).then(res => {
          this.businessRelationItem = res.data;
          this.loadingData = false;
        });
      },
      getOrgMore: function () {
        this.getBusinessRelationList(this.typePager.currentPage + 1, true);
      },
      queryOtherBusiness: function (keyWord) {// 后台搜索
        let params = {
          pageNo: 1,
          deleteFlag: false,
          status: '1',
          keyWord: keyWord,
          orgAuditStatus: '1'
        };
        BaseInfo.query(params).then(res => {
          this.orgList = res.data.list;
        });
      },
      resetRightBox: function () {
        this.showRight = false;
        this.showPhotoRightShow = false;
      },
      showType: function (item) {
        this.relationData = item;
        this.currentItem = item;
        this.currentName = this.currentItem.followOrgName;
        this.getBusinessRelationItem(item.id);
      },
      addType: function () {
        this.action = 'add';
        this.form = {
          followOrgId: '',
          expirationDate: ''
        };
        this.showRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      changeStatus: function (item, key) {// 订单分类改变
        this.activeStatus = key;
        this.filters.status = item.status;
      },
      edit: function () {
        this.action = 'edit';
        this.form = {
          id: this.currentItem.id,
          followOrgId: this.currentItem.followOrgId,
          relation: this.currentItem.relation,
          expirationDate: this.currentItem.expirationDate
        };
        let isExist = this.orgList.some(item => this.currentItem.followOrgId === item.id);
        if (!isExist) {
          this.orgList.push({
            id: this.currentItem.followOrgId,
            name: this.currentItem.followOrgName,
            auditedStatus: 1
          });
        }
        this.showRight = true;
      },
      forbid: function () {
        this.$confirm('确认停用"' + this.currentName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = this.relationData;
          data.status = '1';
          Vendor.update(data.id, data).then(() => {
            this.getBusinessRelationList(1);
            this.$notify.success({
              title: '成功',
              message: '已经停用"' + this.currentName + '"'
            });
          });
        });
      },
      enableRelation: function () {
        this.$confirm('确认启用"' + this.currentName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = this.relationData;
          data.status = '0';
          Vendor.update(data.id, data).then(() => {
            this.getBusinessRelationList(1);
            this.$notify.success({
              title: '成功',
              message: '已成功启用"' + this.currentName + '"'
            });
          });
        });
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) {
            return;
          }
          this.doing = true;
          this.changeExpirationDate(this.form.expirationDate);
          if (this.action === 'add') {
            Vendor.save(this.form).then(() => {
              this.doing = false;
              this.showRight = false;
              this.getBusinessRelationList(1);
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增厂商成功'
              });
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '新增厂商失败'
              });
              this.doing = false;
            });
          } else {
            Vendor.update(this.form.id, this.form).then(() => {
              this.doing = false;
              this.showRight = false;
              this.getBusinessRelationList(1);
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '编辑厂商成功'
              });
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '编辑厂商失败'
              });
              this.doing = false;
            });
          }
        });
      },
      doClose () {
        this.showRight = false;
        this.$refs['relationForm'].resetFields();
      },
      changeExpirationDate: function (date) {
        if (!date) {
          this.form.expirationDate = '';
        }
        this.form.expirationDate = this.$moment(date).format('YYYY-MM-DD');
      }
    }
  };
</script>
