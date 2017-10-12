<style lang="less" scoped="">
  .advanced-query-form {
    .el-select {
      display: block;
      position: relative;
    }
    .el-date-editor.el-input {
      width: 100%;
    }
    padding-top: 20px;
  }

  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .pt {
    padding-top: 8px;
  }

  .good-selects {
    .el-select-dropdown__item {
      font-size: 14px;
      padding: 8px 10px;
      position: relative;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgb(72, 94, 106);
      height: auto;
      width: 300px;
      line-height: 1.5;
      box-sizing: border-box;
      cursor: pointer;
    }
  }

  .align-word {
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .color-blue {
    color: #00ff00;
  }

  .color-red {
    color: red;
  }

  .content-part {
    .content-right {
      > h3 {
        left: 0;
        text-align: center;
        padding: 0;
        margin: 0 0 20px;
        font-size: 18px;
        font-weight: 400;
        line-height: 55px;
        border-bottom: 1px solid #ddd;
        position: fixed;
        top: 0;
        right: 0;
        height: 55px;
        background: #fff;
        z-index: 2;
      }
      left: 0;
    }
  }

  .order-page {
    padding: 0 20px;
  }

  .colorRed {
    color: red;
  }
</style>
<template>

  <div>
    <div class="content-part">
      <div class="content-right content-padding">
        <h3>分配详情</h3>
        <div class="order-page">
          <div class="container">
            <div class="order-list clearfix ">
              <el-row class="order-list-header" :gutter="10">
                <el-col :span="10">POV</el-col>
                <el-col :span="7">需求数</el-col>
                <el-col :span="7">分配数量</el-col>
              </el-row>
              <el-row v-if="loadingData">
                <el-col :span="24">
                  <oms-loading :loading="loadingData"></oms-loading>
                </el-col>
              </el-row>
              <el-row v-else-if="allocationList.length == 0">
                <el-col :span="24">
                  <div class="empty-info">
                    暂无信息
                  </div>
                </el-col>
              </el-row>
              <div v-else="" class="order-list-body flex-list-dom">
                <div class="order-list-item order-list-item-bg" v-for="item in allocationList"
                     :class="[{'active':currentItemId==item.id}]">
                  <el-row>
                    <el-col :span="10" class="R pt">
                      <span>{{ item.povName }}</span>
                    </el-col>
                    <el-col :span="7" class="pt">
                      <span>
                        {{ item.applyCount }}
                        <dict :dict-group="'shipmentPackingUnit'" :dict-key="currentItem.mixUnit"></dict>
                      </span>
                    </el-col>
                    <el-col :span="7" class="pt">
                      <span v-show="status === 1 ">{{item.actualCount}}</span>
                      <perm label="demand-assignment-update">
                        <el-input v-show="status === 0 " v-model.number="item.actualCount"
                                  @blur="submit(item)">
                          <template slot="append">
                            <dict :dict-group="'shipmentPackingUnit'" :dict-key="currentItem.mixUnit"></dict>
                          </template>
                        </el-input>
                      </perm>
                    </el-col>
                  </el-row>
                </div>
                <div>
                  <el-row
                    style="height: 64px;background: #f1f1f1;margin-left: -5px;margin-right: -5px;padding-top: 20px">
                    <el-col :span="12"></el-col>
                    <el-col :span="4">
                      <span style="font-size: 16px">需求总计
                        {{ currentItem.requiredQuantity }}
                       <dict :dict-group="'shipmentPackingUnit'" :dict-key="currentItem.mixUnit"></dict>
                      </span>
                    </el-col>
                    <el-col :span="4">
                      <span style="font-size: 16px">库存数量
                        {{ currentItem.inventoryQuantity }}
                        <dict :dict-group="'shipmentPackingUnit'" :dict-key="currentItem.mixUnit"></dict>
                      </span>
                    </el-col>
                    <el-col :span="4">
                      <el-tooltip class="item" effect="dark" content="库存数量减去已经分配的数量" placement="right">
                        <span style="font-size: 16px">剩余差额 <span>
                          {{ currentItem.resultAmount}}
                         <dict :dict-group="'shipmentPackingUnit'" :dict-key="currentItem.shipmentPackingUnit"></dict>
                        </span></span>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
  import { demandAssignment } from '@/resources';

  export default {
    props: {
      currentItem: Object,
      status: Number
    },
    data () {
      return {
        loadingData: false,
        allocationList: [],
        currentItemId: ''
      };
    },
    watch: {
      currentItem () {
        this.queryAllocationList();
      }
    },
    methods: {
      queryAllocationList () { // 得到需求分配列表
        this.allocationList = [];
        this.loadingData = true;
        let params = {};
        let ary = [];
        let list = this.currentItem.list.map(m => m.detailId);
        list.forEach(i => {
          ary.push(i);
        });
        params.idArray = ary;
        demandAssignment.assignmentGoods(params).then(res => {
          this.allocationList = res.data;
          this.loadingData = false;
        });
      },
      submit (item) {
        if (typeof item.actualCount !== 'number') return;
        let list = [];
        list.push(item);
        demandAssignment.allotVaccine(list).then(() => {
          this.$notify.success({
            message: '分配数量成功'
          });
          let count = 0;
          this.allocationList.forEach(i => {
            count += i.actualCount;
          });
          this.$emit('change', this.currentItem, count);
        }).catch(error => {
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '分配数量失败'
          });
        });
      }
    }
  };
</script>
