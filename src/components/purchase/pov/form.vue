<style lang="scss" scoped="">

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
            <div v-loading="loadingData">
              <el-row class="mb-10">
                <el-col :span="12">
                  <oms-row label="货主疫苗" :span="4">{{currentItem.orgGoodsName}}</oms-row>
                  <oms-row label="生产单位" :span="4">{{currentItem.productFactory}}</oms-row>
                </el-col>
                <el-col :span="12">
                  <oms-row label="规格" :span="4">{{currentItem.specification}}</oms-row>
                  <oms-row label="供货单位" :span="4">{{currentItem.saleFactory}}</oms-row>
                </el-col>
              </el-row>
              <div class="order-list clearfix">
                <el-row class="order-list-header">
                  <el-col :span="2" v-show="status === 0">操作</el-col>
                  <el-col :span="status === 0 ? 6 : 8">要货单位</el-col>
                  <el-col :span="4">要货单位现有库存</el-col>
                  <el-col :span="4">需求数</el-col>
                  <el-col :span="4">要货时间</el-col>
                  <el-col :span="4">分配数量</el-col>
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
                       :class="[{'active':currentItemId==item.id}]" style="max-height: 500px;overflow-y: auto">
                    <el-row>
                      <el-col :span="2" v-show="status === 0">
                        <perm label="demand-assignment-update-org-goods">
                          <el-tooltip content="修改要货品种" placement="bottom">
                            <span @click.prevent="editItem(item)">
                                <a href="#" class="btn-circle" @click.prevent=""><i
                                  class="el-icon-t-edit"></i></a>
                            </span>
                          </el-tooltip>
                        </perm>
                      </el-col>
                      <el-col :span="status === 0 ? 6 : 8" class="R">
                        <span>{{ item.povName }}</span>
                      </el-col>
                      <el-col :span="4">
                      <span>
                        {{ item.currentStock }}
                        <dict :dict-group="'measurementUnit'" :dict-key="currentItem.mixUnit"></dict>
                      </span>
                      </el-col>
                      <el-col :span="4">
                      <span>
                        {{ item.applyCount }}
                        <dict :dict-group="'measurementUnit'" :dict-key="currentItem.mixUnit"></dict>
                      </span>
                      </el-col>
                      <el-col :span="4">{{ item.applyTime | minute }}</el-col>
                      <el-col :span="4">
                        <span v-show="status === 1 ">{{item.actualCount}}</span>
                        <perm label="demand-assignment-update">
                          <el-input v-show="status === 0 " v-model.number="item.actualCount"
                                    @blur="submit(item)">
                            <template slot="append">
                              <dict :dict-group="'measurementUnit'" :dict-key="currentItem.mixUnit"></dict>
                            </template>
                          </el-input>
                        </perm>
                      </el-col>
                    </el-row>
                  </div>
                  <div v-show="status === 0">
                    <el-row
                      style="height: 45px;background: #f1f1f1;margin-left: -5px;margin-right: -5px;margin-top: 10px">
                      <el-col :span="11" align="right" style="padding-right: 57px">
                       <span style="font-size: 16px">最小包装数量
                        {{ currentItem.smallPackCount }}
                       <dict :dict-group="'measurementUnit'" :dict-key="currentItem.mixUnit"></dict>
                      </span>
                      </el-col>
                      <el-col :span="4">
                      <span style="font-size: 16px">需求数
                        {{ currentItem.requiredQuantity }}
                       <dict :dict-group="'measurementUnit'" :dict-key="currentItem.mixUnit"></dict>
                      </span>
                      </el-col>
                      <el-col :span="4">
                      <span style="font-size: 16px">库存数
                        {{ currentItem.inventoryQuantity }}
                        <dict :dict-group="'measurementUnit'" :dict-key="currentItem.mixUnit"></dict>
                      </span>
                      </el-col>
                      <el-col :span="5">
                        <el-tooltip class="item" effect="dark" content="库存数量减去已经分配的数量" placement="right">
                        <span style="font-size: 16px">调配后库存差额 <span>
                          {{ currentItem.resultAmount}}
                         <dict :dict-group="'measurementUnit'" :dict-key="currentItem.mixUnit"></dict>
                        </span></span>
                        </el-tooltip>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
            <el-row class="mt-10 text-right">
              <el-button-group>
                <el-button plain @click="updateItem(--index)" :disabled="index === 0"><i
                  class="el-icon-d-arrow-left"></i>上一条
                </el-button>
                <el-button plain @click="updateItem(++index)" :disabled="index === TotalAllocationList.length - 1">
                  <i class="el-icon-d-arrow-right"></i>下一条
                </el-button>
                <el-button plain @click="$emit('close')"><i class="el-icon-circle-close-outline"></i>关闭</el-button>
              </el-button-group>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <el-dialog width="500px" title="修改要货品种" :visible.sync="showEditGoodsRight" append-to-body>
      <oms-row label="要货单位" class="mb-10" :span="6">{{currentGoodsItem.povName}}</oms-row>
      <el-row class="mb-10">
        <el-col :span="12">
          <oms-row label="现有库存" :span="12">{{currentGoodsItem.currentStock}}</oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="需求数" :span="12">{{currentGoodsItem.applyCount}}</oms-row>
        </el-col>
      </el-row>
      <oms-row class="mb-10" label="要货时间" :span="6">{{currentGoodsItem.applyTime | time}}</oms-row>
      <oms-row class="mb-10" label="分配数量" :span="6">{{currentGoodsItem.actualCount}}</oms-row>
      <edit-goods class="is-no-fix" :currentItem="currentGoodsItem" :show="showEditGoodsRight"
                  @refresh="refresh"></edit-goods>
    </el-dialog>
  </div>

</template>
<script>
  import {demandAssignment} from '@/resources';
  import utils from '@/tools/utils';
  import editGoods from './editGoods';

  export default {
    components: {editGoods},
    props: {
      currentItem: Object,
      status: Number,
      TotalAllocationList: Array
    },
    data() {
      return {
        showEditGoodsRight: false,
        loadingData: false,
        allocationList: [],
        currentItemId: '',
        index: -1,
        changeTotalNumber: utils.changeTotalNumber,
        currentGoodsItem: {}
      };
    },
    watch: {
      currentItem(val) {
        this.index = this.TotalAllocationList.indexOf(val);
        this.queryAllocationList();
      }
    },
    methods: {
      refresh() {
        this.showEditGoodsRight = false;
        this.currentGoodsItem = {};
        this.$emit('refresh');
      },
      editItem(item) {
        this.currentGoodsItem = Object.assign({}, item, {
          orgGoodsId: this.currentItem.orgGoodsId,
          list: [{detailId: item.id}]
        });
        this.showEditGoodsRight = true;
      },
      queryAllocationList() { // 得到需求分配列表
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
      updateItem(index) {
        console.log(index);
        this.$emit('updateItem', this.TotalAllocationList[index]);
      },
      submit(item) {
        if (typeof item.actualCount !== 'number') return;
        if (item.actualCount < 0) {
          this.$notify.info({
            message: '分配数量不能小于0，请进行调整'
          });
          return;
        }
        let newAmount = this.changeTotalNumber(item.actualCount, this.currentItem.smallPackCount);
        if (item.actualCount !== newAmount) {
          this.$confirm(`疫苗"${this.currentItem.goodsName}"数量${item.actualCount}不是最小包装的倍数，确认后会对后续操作产生严重影响！
          选择“是”修改数量为${newAmount}，选择“否”确认数量${item.actualCount}`, '', {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(res => {
            item.actualCount = newAmount;
            this.save(item);
          }).catch(() => {
            this.save(item);
          });
        } else {
          this.save(item);
        }
      },
      save(item) {
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
