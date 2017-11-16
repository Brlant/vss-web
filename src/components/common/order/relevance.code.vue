<style lang="less" scoped="">
  @import '../../../assets/mixins';

  .product-code-list {
    margin-top: 20px;
    text-align: center;
    border-collapse: collapse;
    font-size: 12px;
    td {
      height: 24px;
      border: 1px solid #dfe6ec;
    }

  }

  .t-head {
    background: #eef1f6;
    color: #1f2d3d;
    font-weight: bold;
  }

  .btn-group {
    margin-bottom: 30px;
    overflow: hidden;
    .download-icon {
      margin-top: 10px;
      cursor: pointer;
      &:hover a {
        color: @activeColor;
      }
    }
  }

  .empty-info {
    &.mini-empty-info {
      height: 60px;
    }
  }

  .qp-box {
    &.accessory {
      margin-bottom: 20px;
      border: 1px solid #eee;
      border-radius: 5px;
      padding: 0 20px 10px 20px;
      h2 {
        line-height: 20px;
        margin: 10px 0;
        padding: 0;
      }
      .accessory-item {
        margin-top: 10px;
      }
    }
    .accessory-list {
      .show-list {
        .list-item {
          .attachment-delete, .download-link {
            float: right;
            padding: 0 10px;
            color: #fff;
            font-size: 16px;
          }
          &:hover .attachment-delete {
            color: red;
          }
          &:hover .download-link {
            color: #1c8de0;
          }
        }
      }
    }
  }

</style>
<template>
  <div>
    <div v-if="!codes.length" class="empty-info">
      暂无追溯码信息
    </div>
    <div v-else="">
      <oms-loading v-if="loadingDetailData" :loading="loadingDetailData"></oms-loading>
      <table v-else-if="codes.length" class="clearfix product-code-list" width="100%">
        <tbody>
        <tr class="t-head">
          <td>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" frame="void">
              <tr>
                <td width="240px">货品</td>
                <td width="160px">批号</td>
                <td width="160px">数量</td>
                <td width="80px">合计数量</td>
              </tr>
            </table>
          </td>
          <td width="100px">
            核对结果
          </td>
        </tr>
        <tr>
          <td>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" frame="void">
              <tr v-for="i in codes">
                <td width="240px">{{i.goodsName}}</td>
                <td width="160px">{{i.batchNumber}}</td>
                <td width="160px">
                  <div v-show="i.largePackageAmount">
                    大包装{{i.largePackageAmount}}
                    <dict :dict-group="'shipmentPackingUnit'" :dict-key="i.largePackageUnit"></dict>
                    ({{ i.largePackageSize }}
                    <dict :dict-group="'measurementUnit'" :dict-key="i.measurementUnit"></dict>
                    /
                    <dict :dict-group="'shipmentPackingUnit'" :dict-key="i.largePackageUnit"></dict>
                    )
                  </div>
                  <div v-show="i.mediumPackageAmount">
                    中包装{{i.mediumPackageAmount}}
                    <dict :dict-group="'shipmentPackingUnit'" :dict-key="i.mediumPackageUnit"></dict>
                    ({{ i.mediumPackageSize }}
                    <dict :dict-group="'measurementUnit'" :dict-key="i.measurementUnit"></dict>
                    /
                    <dict :dict-group="'shipmentPackingUnit'" :dict-key="i.mediumPackageUnit"></dict>
                    )
                  </div>
                  <div v-show="i.bulkCount">
                    小包装{{i.bulkCount}}
                    <dict :dict-group="'shipmentPackingUnit'" :dict-key="i.smallPackageUnit"></dict>
                    ({{ i.smallPackageSize }}
                    <dict :dict-group="'measurementUnit'" :dict-key="i.measurementUnit"></dict>
                    /
                    <dict :dict-group="'shipmentPackingUnit'" :dict-key="i.smallPackageUnit"></dict>
                    )
                  </div>
                </td>
                <td width="80px">
                  {{i.total}}
                  <dict :dict-group="'measurementUnit'" :dict-key="i.measurementUnit"></dict>
                </td>
              </tr>
            </table>
          </td>
          <td width="100px" :colspan="codes.length" style="border-left: 1px solid #ddd;text-align: center">
            {{isCheck ? '通过' : '不通过'}}
          </td>
        </tr>
        </tbody>
      </table>
      <div style="margin-bottom: 10px; margin-top: 20px;overflow: hidden">
       <span class="pull-right">
           <span class="btn-search-toggle open" v-show="showSearch">
              <single-input v-model="filters.code" placeholder="请输入关键字搜索" :showFocus="showSearch"></single-input>
              <i class="oms-font oms-font-search" @click.stop="showSearch=(!showSearch)"></i>
           </span>
           <a href="#" class="btn-circle" @click.stop.prevent="showSearch=(!showSearch)" v-show="!showSearch">
              <i class="oms-font oms-font-search"></i>
           </a>
      </span>
      </div>
      <div class="order-list clearfix">

        <el-row class="order-list-header t-head" style="margin:0" :gutter="10">
          <el-col :span="8">追溯码</el-col>
          <el-col :span="8">货品名称</el-col>
          <el-col :span="5">批号</el-col>
          <el-col :span="3">包装类型</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="!traceCodes.length">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body">
          <div class="order-list-item order-list-item-bg" v-for="item in traceCodes"
               style="margin-left: 0;margin-right: 0">
            <el-row>
              <el-col :span="8" class="R pt10">
                <span>{{ item.code }}</span>
              </el-col>
              <el-col :span="8" class="pt">
                <span>{{ item.goodsName }}</span>
              </el-col>
              <el-col :span="5" class="pt">
                <span>{{ item.batchNumber }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ packageType[item.packageScheme] }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>
      <div class="text-center" v-show="pager.count>pager.pageSize && !loadingData">
        <el-pagination
          layout="prev, pager, next"
          :total="pager.count" :pageSize="pager.pageSize" @current-change="getTraceCodes"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  import { http, OmsAttachment } from '@/resources';

  export default {
    props: {
      currentOrder: {
        required: true,
        type: Object,
        default: function () {
          return {};
        }
      },
      index: {
        type: Number,
        default: -1
      },
      type: String
    },
    data () {
      return {
        loadingData: false,
        loadingDetailData: false,
        showSearch: false,
        codes: [],
        isCheck: false,
        downloadData: {},
        orderAttachment: [],
        files: [],
        traceCodes: [],
        filters: {
          code: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 10
        },
        packageType: [
          '大包装',
          '中包装',
          '小包装',
          '小包装'
        ],
        doing: false
      };
    },
    watch: {
      index (val) {
        if (val !== 8) return;
        this.queryCodes();
        this.files = [];
        this.getTraceCodes(1);
//        this.queryAttachment();
      },
      filters: {
        handler: function () {
          this.getTraceCodes(1);
        },
        deep: true
      }
    },
    methods: {
      changeFiles (files) {
        this.files = files;
      },
      showAttachment: function (item) {// 显示预览
        this.$store.commit('changeAttachment', item.attachmentId);
      },
      deleteAttachMentManageItem: function (item) {// 删除附件管理附件
        OmsAttachment.delete(item.attachmentId).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功删除附件'
          });
          this.queryAttachment();
        });
      },
      onSubmit () {
        if (!this.orderAttachment.length) {
          this.$notify.info({
            message: '请选择文件'
          });
          return;
        }
        this.doing = true;
        http.post(`/code/${this.currentOrder.id}/parse/trace-code`).then(() => {
          this.$notify.info({
            message: '解析成功'
          });
          this.doing = false;
          this.queryCodes();
          this.getTraceCodes(1);
        }).catch(error => {
          this.doing = false;
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '解析失败'
          });
          this.queryCodes();
          this.getTraceCodes(1);
        });
      },
      queryCodes () {
        this.loadingDetailData = true;
        http.get(`/code/${this.currentOrder.id}/trace-code/result`).then(res => {
          this.isCheck = res.data.result;
          this.codes = res.data.list;
          this.loadingDetailData = false;
        });
      },
      queryAttachment () {
        OmsAttachment.queryOneAttachmentList(this.currentOrder.id, 'traceCode').then(res => {
          this.orderAttachment = res.data;
        });
      },
      getTraceCodes (pageNo) {
        if (pageNo === 1) {
          this.pager.count = 0;
        }
        this.pager.currentPage = pageNo;
        let params = Object.assign({
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          type: this.type
        }, this.filters);
        this.loadingData = true;
        http.get(`/code/${this.currentOrder.id}/trace-code`, {params}).then(res => {
          this.traceCodes = res.data.list;
//          this.pager.count = res.data.count;
          if (this.traceCodes.length === this.pager.pageSize) {
            this.pager.count = this.pager.currentPage * this.pager.pageSize + 1;
          }
          this.loadingData = false;
        });
      }
    }
  };
</script>
