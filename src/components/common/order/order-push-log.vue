<template>
  <div>
    <div v-loading="loadingData">
      <div class="order-list clearfix">

        <el-row class="order-list-header t-head" style="margin:0">
          <el-col :span="5">推送类型</el-col>
          <el-col :span="10">推送信息</el-col>
          <el-col :span="6">推送时间</el-col>
          <el-col :span="3">推送状态</el-col>
        </el-row>
        <el-row v-if="!logList.length">
          <el-col :span="24">
            <div class="empty-type-info mini">暂无信息</div>
          </el-col>
        </el-row>
        <div v-else="" class="order-list-body">
          <div class="order-list-item order-list-item-bg flex-list-dom" v-for="item in logList"
               style="margin-left: 0;margin-right: 0">
            <el-row>
              <el-col :span="5" class="R pt10">
                <span>{{ pushTypes[item.pushType] || item.pushType}}</span>
              </el-col>
              <el-col :span="10" class="pt">
                <div style="max-height: 100px;overflow: auto">
                  {{ item.pushMessage }}
                </div>
              </el-col>
              <el-col :span="6" class="pt">
                <span>{{ item.pushTime | time }}</span>
              </el-col>
              <el-col :span="3" class="pt">
                <span>{{ item.pushStatusCode }}</span>
              </el-col>
            </el-row>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  import {http} from '@/resources';
  import utils from '@/tools/utils';

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
    data() {
      return {
        loadingData: false,
        logList: [],
        packageType: utils.packageType,
        doing: false,
        totalInfoList: [],
        pushTypes: {
          'usage-trace': '使用记录',
          'biz-trace': '业务追溯',
          'cancel-order': '取消订单',
          'transport-order': '订单运输完成',
          'push-oms': '推送OMS',
          'reject-order': '拒收订单',
          'push-wms': '推送WMS',
          'wms-complete': '上下架完成',
          'push-exception': '订单异常推送',
          'stop-reject': '订单取消拒收',
          'push-file': '推送订单',
          'receive-cancel': '接收取消订单信息',
          'receive-transport': '接收订单运输完成信息',
          'receive-oms': '接收推送OMS消息',
          'receive-reject': '接收拒收订单信息',
          'receive-wms': '接收推送WMS信息',
          'receive-complete': '接收上下架完成信息',
          'receive-exception': '接收订单异常信息',
          'receive-stop': '接收订单取消拒收信息',
          'receive-task': '接收入库任务完成信息',
          'receive-file': '接收订单相关文件'
        }
      };
    },
    watch: {
      index(val) {
        if (val !== 15) return;
        this.getLogList(1);
      }
    },
    methods: {
      getLogList() {
        this.loadingData = true;
        http.get(`/erp-order/${this.currentOrder.id}/push-log`).then(res => {
          this.logList = res.data;
          this.loadingData = false;
        }).catch(() => {
          this.loadingData = false;
        });
      }
    }
  };
</script>
