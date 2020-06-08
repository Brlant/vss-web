<style lang="scss" scoped>
  @import "~@/assets/mixins";

  $leftWidth: 0;
  .content-part {
    .content-left {
      width: $leftWidth;
      text-align: center;
    }

    .content-right {
      > h3 {
        left: $leftWidth;
      }

      left: $leftWidth;
    }
  }

  h2 {
    /*font-weight: bold;*/
    margin: 6px 10px 14px 10px;
    padding: 6px;
    background: #eee;
    border-left: 10px solid $activeColor;
  }

  .col-label {
    color: #777;
    margin-left: 25px;
  }

  .el-row {
    margin-bottom: 10px;
    font-size: 16px;
  }

  .img-warp {
    padding: 20px;
    text-align: center;

    .confirm-img {
      width: auto;
      height: auto;
      max-height: 100%;
      max-width: 100%;
    }
  }
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-right content-padding" v-loading="loading">
        <h3>接种任务详情</h3>

        <section v-if="currentItem.inoculatorInfoDto">
          <h2>受种者信息</h2>
          <oms-row :span="5" class="row-mg" label="姓名" v-show="currentItem.inoculatorInfoDto.inoculatorName">
            {{currentItem.inoculatorInfoDto.inoculatorName}}
            <span class="col-label" v-show="currentItem.inoculatorInfoDto.inoculatorSex">
              性别：</span>{{currentItem.inoculatorInfoDto.inoculatorSex}}
            <span v-show="currentItem.inoculatorInfoDto.inoculatorBirthday">
              <span class="col-label">生日：</span>
              {{currentItem.inoculatorInfoDto.inoculatorBirthday | date}}
              <span class="ml-15">{{currentItem.inoculatorInfoDto.inoculatorBirthday | formatBirthDate}}</span>
            </span>
          </oms-row>
          <oms-row class="row-mg" label="接种证编号" :span="5" v-show="currentItem.inoculatorInfoDto.inoculateCode">
            {{currentItem.inoculatorInfoDto.inoculateCode}}
          </oms-row>
          <oms-row class="row-mg" label="身份证" :span="5" v-show="currentItem.inoculatorInfoDto.inoculatorCardNumber">
            {{currentItem.inoculatorInfoDto.inoculatorCardNumber}}
          </oms-row>
          <oms-row class="row-mg" label="出生证号" :span="5" v-show="currentItem.inoculatorInfoDto.birthCertificateNumber">
            {{currentItem.inoculatorInfoDto.birthCertificateNumber}}
          </oms-row>
          <oms-row :span="5" class="row-mg" label="护照号" v-show="currentItem.inoculatorInfoDto.passportNo">
            {{currentItem.inoculatorInfoDto.passportNo}}
          </oms-row>
          <oms-row :span="5" class="row-mg" label="备注" v-show="currentItem.inoculatorInfoDto.inoculatorRemarks">
            {{currentItem.inoculatorInfoDto.inoculatorRemarks}}
          </oms-row>
        </section>
        <section v-if="currentItem.injectionTaskDto">
          <h2>接种任务</h2>
          <oms-row :span="span" label="接种任务ID">
            {{currentItem.injectionTaskDto.id}}
          </oms-row>
          <oms-row :span="span" label="登记编号" v-if="currentItem.injectionTaskDto.inoculatorNumber">
            {{currentItem.injectionTaskDto.inoculatorNumber}}
          </oms-row>
          <oms-row :span="span" label="追溯码">
            {{currentItem.injectionTaskDto.actualCode}}
            <el-tag type="warn" v-if="!currentItem.injectionTaskDto.traceCodeId">
              未知追溯码
            </el-tag>
          </oms-row>
          <oms-row label="疫苗名称" :span="span">{{currentItem.injectionTaskDto.orgGoodsName}}</oms-row>
          <oms-row label="疫苗种类" :span="span">
            <el-tag type="success" v-if="currentItem.injectionTaskDto.vaccineSign === '2'">
              <dict :dict-key="'' + currentItem.injectionTaskDto.vaccineSign" dict-group="vaccineSign"></dict>
            </el-tag>
            <dict :dict-key="'' + currentItem.injectionTaskDto.vaccineSign" dict-group="vaccineSign" v-else></dict>
          </oms-row>
          <oms-row label="规格" :span="span">{{currentItem.injectionTaskDto.specification}}</oms-row>
          <oms-row :span="span" label="生产厂商">{{currentItem.injectionTaskDto.origin}}</oms-row>
          <oms-row label="批号" :span="span">{{currentItem.injectionTaskDto.batchNumber}}</oms-row>
          <oms-row label="生产日期" :span="span">{{currentItem.injectionTaskDto.productionDate | date}}</oms-row>
          <oms-row :span="span" label="有效期至">{{currentItem.injectionTaskDto.expirationDate | date}}</oms-row>
          <oms-row :span="span" label="接种部位" v-if="currentItem.injectionTaskDto.inoculationPosition">
            <dict :dict-group="'inoculationPosition'"
                  :dict-key="currentItem.injectionTaskDto.inoculationPosition"></dict>
          </oms-row>
          <oms-row :span="span" label="接种途经" v-if="currentItem.injectionTaskDto.inoculationChannel">
            <dict :dict-group="'inoculationChannel'" :dict-key="currentItem.injectionTaskDto.inoculationChannel"></dict>
          </oms-row>
          <oms-row label="任务创建时间" :span="span">{{currentItem.injectionTaskDto.createTime | time}}</oms-row>
          <oms-row :span="span" label="接种时间" v-show="currentItem.injectionTaskDto.actualTime">
            {{currentItem.injectionTaskDto.actualTime | time}}
          </oms-row>
          <!--<oms-row label="是否缴费" :span="span">-->
          <!--{{currentItem.injectionTaskDto.payCostType === 1 ? '已缴费' : '未交费'}}-->
          <!--</oms-row>-->
          <oms-row label="是否新开瓶" :span="span">
            {{currentItem.injectionTaskDto.newInoculationStatus === 1 ? '是' : '否'}}
          </oms-row>
          <oms-row label="状态" :span="span">
            {{getStatusTitle(currentItem.injectionTaskDto.status)}}
          </oms-row>
        </section>
        <section v-if="currentItem.injectionTaskDto && currentItem.injectionTaskDto.attachmentResponseList">
          <h2>接种签核信息</h2>
          <div class="img-warp" v-for="item in currentItem.injectionTaskDto.attachmentResponseList">
            <img :src="item.attachmentStoragePath" class="confirm-img"/>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
  import {inoculateTask} from '@/resources';

  export default {
    props: {
      id: String,
      defaultIndex: Number,
      getStatusTitle: Function
    },
    data() {
      return {
        span: 6,
        currentItem: {},
        loading: false
      };
    },
    watch: {
      defaultIndex(val) {
        if (val !== 3) return;
        this.queryOrderDetail();
      }
    },
    methods: {
      queryOrderDetail() {
        this.currentItem = {};
        if (!this.id) return false;
        this.loading = true;
        inoculateTask.queryDetail(this.id).then(res => {
          this.currentItem = res.data;
          this.loading = false;
        }).catch(e => {
          this.loading = false;
        });
      }
    }
  };
</script>
