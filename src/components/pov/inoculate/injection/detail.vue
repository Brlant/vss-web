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
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-right content-padding" v-loading="loading">
        <h3>接种任务详情</h3>

        <section v-if="currentItem.inoculatorInfoDto">
          <h2>受种者信息</h2>
          <oms-row class="row-mg" label="姓名" :span="5">
            {{currentItem.inoculatorInfoDto.inoculatorName}}
            <span class="col-label">性别：</span>{{currentItem.inoculatorInfoDto.inoculatorSex}}
            <span class="col-label">生日：</span>{{currentItem.inoculatorInfoDto.inoculatorBirthday | date}}
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
        </section>
        <section v-if="currentItem.injectionTaskDto">
          <h2>接种任务</h2>
          <oms-row label="登记编号" :span="span">{{currentItem.injectionTaskDto.inoculatorNumber}}</oms-row>
          <oms-row label="疫苗名称" :span="span">{{currentItem.injectionTaskDto.orgGoodsName}}</oms-row>
          <oms-row label="疫苗种类" :span="span">
            <dict dict-group="vaccineSign" :dict-key="'' + currentItem.injectionTaskDto.vaccineSign"></dict>
          </oms-row>
          <oms-row label="规格" :span="span">{{currentItem.injectionTaskDto.specification}}</oms-row>
          <oms-row label="生产厂商" :span="span">{{currentItem.injectionTaskDto.origin}}</oms-row>
          <oms-row label="批号" :span="span">{{currentItem.injectionTaskDto.batchNumber}}</oms-row>
          <oms-row label="生产日期" :span="span">{{currentItem.injectionTaskDto.productionDate | date}}</oms-row>
          <oms-row label="有效期" :span="span">{{currentItem.injectionTaskDto.expirationDate | date}}</oms-row>
          <oms-row label="接种部位" :span="span">
            <dict :dict-group="'inoculationPosition'"
                  :dict-key="currentItem.injectionTaskDto.inoculationPosition"></dict>
          </oms-row>
          <oms-row label="接种途经" :span="span">
            <dict :dict-group="'inoculationChannel'" :dict-key="currentItem.injectionTaskDto.inoculationChannel"></dict>
          </oms-row>
          <oms-row label="任务创建时间" :span="span">{{currentItem.injectionTaskDto.createTime | time}}</oms-row>
          <oms-row label="登记时间" :span="span">{{currentItem.injectionTaskDto.registrationTime | time}}</oms-row>
          <oms-row label="登记完成时间" :span="span" v-show="currentItem.injectionTaskDto.actualTime">
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
