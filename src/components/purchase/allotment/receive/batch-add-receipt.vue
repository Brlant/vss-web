<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form-item label="生产日期" prop="productionDate"
                      :rules="[{required: true, message: '请选择生产日期', trigger: 'blur'}]">
          <el-date-picker
            v-model="form.productionDate"
            placeholder="请选择生产日期" format="yyyy-MM-dd"
            @change="dateChange" value-format="timestamp">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="有效期" prop="expiryDate" :rules="[{required: true, message: '请选择有效期', trigger: 'blur'}]">
          <el-date-picker
            v-model="form.expiryDate"
            placeholder="请选择有效期" format="yyyy-MM-dd"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="批量/进口量">
          <oms-input ref="inputNumber" type="number" placeholder="请输入批量/进口量"
                     v-model.number="form.batchReleaseCount"></oms-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="批签发日期">
          <el-date-picker
            v-model="form.batchReleaseDate"
            placeholder="请选择批签发日期" format="yyyy-MM-dd"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="批签发号">
          <oms-input placeholder="请输入批签发号" v-model="form.batchReleaseNumber"></oms-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="通关单号编码">
          <oms-input placeholder="请输入通关单号编码" v-model="form.customsFormNumber"></oms-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="口岸检验报告编号" class="acrony-my" label-width="160px">
      <oms-input placeholder="请输入口岸检验报告编号 " v-model="form.portInspectionNumber"></oms-input>
    </el-form-item>
  </div>
</template>
<script>
  import utils from '@/tools/utils';

  export default {
    props: {
      form: {},
      currentItem: {}
    },
    mounted() {
      utils.forbidEleScroll(this.$refs['inputNumber']);
    },
    methods: {
      dateChange() {
        if (new Date(this.form.productionDate) > new Date(this.currentItem.orgGoodsDto.goodsDto.goodsApprovalNOValidity)) {
          this.$notify.info({
            message: '货品的生产日期大于批准文号有效期'
          });
        }
      }
    }
  };
</script>
