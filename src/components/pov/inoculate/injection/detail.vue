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
      <div v-loading="loading" class="content-right content-padding">
        <h3>接种任务详情</h3>

        <section v-if="currentItem.inoculatorInfoDto">
          <h2>受种者信息</h2>
          <oms-row v-show="currentItem.inoculatorInfoDto.inoculatorName" :span="5" class="row-mg" label="姓名">
            {{currentItem.inoculatorInfoDto.inoculatorName}}
            <span v-show="currentItem.inoculatorInfoDto.inoculatorSex" class="col-label">
              性别：</span>{{currentItem.inoculatorInfoDto.inoculatorSex}}
            <span v-show="currentItem.inoculatorInfoDto.inoculatorBirthday">
              <span class="col-label">生日：</span>
              {{currentItem.inoculatorInfoDto.inoculatorBirthday | date}}
              <span class="ml-15">{{currentItem.inoculatorInfoDto.inoculatorBirthday | formatBirthDate}}</span>
            </span>
          </oms-row>
          <oms-row v-show="currentItem.inoculatorInfoDto.inoculateCode" :span="5" class="row-mg" label="接种证编号">
            {{currentItem.inoculatorInfoDto.inoculateCode}}
          </oms-row>
          <oms-row v-show="currentItem.inoculatorInfoDto.inoculatorCardNumber" :span="5" class="row-mg" label="身份证">
            {{currentItem.inoculatorInfoDto.inoculatorCardNumber}}
          </oms-row>
          <oms-row v-show="currentItem.inoculatorInfoDto.birthCertificateNumber" :span="5" class="row-mg" label="出生证号">
            {{currentItem.inoculatorInfoDto.birthCertificateNumber}}
          </oms-row>
          <oms-row v-show="currentItem.inoculatorInfoDto.passportNo" :span="5" class="row-mg" label="护照号">
            {{currentItem.inoculatorInfoDto.passportNo}}
          </oms-row>
          <oms-row v-show="currentItem.inoculatorInfoDto.inoculatorRemarks" :span="5" class="row-mg" label="备注">
            {{currentItem.inoculatorInfoDto.inoculatorRemarks}}
          </oms-row>
        </section>
        <section v-if="currentItem.injectionTaskDto">
          <h2>接种任务</h2>
          <oms-row :span="span" label="接种任务ID">
            {{currentItem.injectionTaskDto.id}}
          </oms-row>
          <oms-row v-if="currentItem.injectionTaskDto.inoculatorNumber" :span="span" label="登记编号">
            {{currentItem.injectionTaskDto.inoculatorNumber}}
          </oms-row>
          <oms-row :span="span" label="追溯码">
            {{currentItem.injectionTaskDto.actualCode}}
            <el-tag v-if="!currentItem.injectionTaskDto.traceCodeId" type="warn">
              未知追溯码
            </el-tag>
          </oms-row>
          <oms-row :span="span" label="疫苗名称">{{currentItem.injectionTaskDto.orgGoodsName}}</oms-row>
          <oms-row :span="span" label="疫苗种类">
            <el-tag v-if="currentItem.injectionTaskDto.vaccineSign === '2'" type="success">
              <dict :dict-key="'' + currentItem.injectionTaskDto.vaccineSign" dict-group="vaccineSign"></dict>
            </el-tag>
            <dict v-else :dict-key="'' + currentItem.injectionTaskDto.vaccineSign" dict-group="vaccineSign"></dict>
          </oms-row>
          <oms-row :span="span" label="规格">{{currentItem.injectionTaskDto.specification}}</oms-row>
          <oms-row :span="span" label="生产厂商">{{currentItem.injectionTaskDto.origin}}</oms-row>
          <oms-row :span="span" label="批号">{{currentItem.injectionTaskDto.batchNumber}}</oms-row>
          <oms-row :span="span" label="生产日期">{{currentItem.injectionTaskDto.productionDate | date}}</oms-row>
          <oms-row :span="span" label="有效期至">{{currentItem.injectionTaskDto.expirationDate | date}}</oms-row>
          <oms-row v-if="currentItem.injectionTaskDto.inoculationPosition" :span="span" label="接种部位">
            <dict :dict-group="'inoculationPosition'"
                  :dict-key="currentItem.injectionTaskDto.inoculationPosition"></dict>
          </oms-row>
          <oms-row v-if="currentItem.injectionTaskDto.inoculationChannel" :span="span" label="接种途经">
            <dict :dict-group="'inoculationChannel'" :dict-key="currentItem.injectionTaskDto.inoculationChannel"></dict>
          </oms-row>
          <oms-row :span="span" label="任务创建时间">{{currentItem.injectionTaskDto.createTime | time}}</oms-row>
          <oms-row v-show="currentItem.injectionTaskDto.actualTime" :span="span" label="接种时间">
            {{currentItem.injectionTaskDto.actualTime | time}}
          </oms-row>
          <!--<oms-row label="是否缴费" :span="span">-->
          <!--{{currentItem.injectionTaskDto.payCostType === 1 ? '已缴费' : '未交费'}}-->
          <!--</oms-row>-->
          <oms-row :span="span" label="是否新开瓶">
            {{currentItem.injectionTaskDto.newInoculationStatus === 1 ? '是' : '否'}}
          </oms-row>
          <oms-row :span="span" label="状态">
            {{getStatusTitle(currentItem.injectionTaskDto.status)}}
          </oms-row>
        </section>
        <section v-if="currentItem.injectionTaskDto && currentItem.injectionTaskDto.attachmentResponseList">
          <h2>接种签核信息</h2>
          <div v-for="item in currentItem.injectionTaskDto.attachmentResponseList" class="img-warp">
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
