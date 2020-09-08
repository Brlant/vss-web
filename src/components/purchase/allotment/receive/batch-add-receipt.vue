<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-form-item :rules="[{required: true, message: '请选择生产日期', trigger: 'blur'}]" label="生产日期"
                      prop="productionDate">
          <el-date-picker
            v-model="form.productionDate"
            format="yyyy-MM-dd" placeholder="请选择生产日期"
            value-format="timestamp" @change="dateChange">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :rules="[{required: true, message: '请选择有效期', trigger: 'blur'}]" label="有效期" prop="expiryDate">
          <el-date-picker
            v-model="form.expiryDate"
            format="yyyy-MM-dd" placeholder="请选择有效期"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="批量/进口量">
          <oms-input ref="inputNumber" v-model.number="form.batchReleaseCount" placeholder="请输入批量/进口量"
                     type="number"></oms-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="批签发日期">
          <el-date-picker
            v-model="form.batchReleaseDate"
            format="yyyy-MM-dd" placeholder="请选择批签发日期"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="批签发号">
          <oms-input v-model="form.batchReleaseNumber" placeholder="请输入批签发号"></oms-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="通关单号编码">
          <oms-input v-model="form.customsFormNumber" placeholder="请输入通关单号编码"></oms-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item class="acrony-my" label="口岸检验报告编号" label-width="160px">
      <oms-input v-model="form.portInspectionNumber" placeholder="请输入口岸检验报告编号 "></oms-input>
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
