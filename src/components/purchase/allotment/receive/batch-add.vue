<template>
  <el-form ref="addBatchForm" :model="form" :rules="rules" label-width="140px">
    <el-form-item label="批号" prop="batchNumber">
      <oms-input placeholder="请输入" v-model="form.batchNumber"></oms-input>
    </el-form-item>
    <el-form-item label="生产日期 " prop="productionDate">
      <el-date-picker
        v-model="form.productionDate"
        placeholder="请选择生产日期" format="yyyy-MM-dd"
        value-format="timestamp">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="有效期 " prop="expirationDate">
      <el-date-picker
        v-model="form.expirationDate"
        placeholder="请选择有效期" format="yyyy-MM-dd"
        value-format="timestamp">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="批量/进口量">
      <oms-input ref="inputNumber" type="number" placeholder="请输入批量/进口量"
                 v-model.number="form.batchReleaseCount"></oms-input>
    </el-form-item>
    <el-form-item label="批签发日期">
      <el-date-picker
        v-model="form.batchReleaseDate"
        placeholder="请选择批签发日期" format="yyyy-MM-dd"
        value-format="timestamp">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="批签发号">
      <oms-input placeholder="请输入批签发号" v-model="form.batchReleaseNumber"></oms-input>
    </el-form-item>
    <el-form-item label="通关单号编码">
      <oms-input placeholder="请输入通关单号编码" v-model="form.customsFormNumber"></oms-input>
    </el-form-item>
    <el-form-item label="口岸检验报告编号 ">
      <oms-input placeholder="请输入口岸检验报告编号 " v-model="form.portInspectionNumber"></oms-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm" :disabled="doing">保存</el-button>
      <!--<el-button type="primary" @click="reset">重置</el-button>-->
    </el-form-item>
  </el-form>
</template>
<script>
  import {batchNumber} from '@/resources';
  import utils from '@/tools/utils';

  export default {
    props: {
      currentItem: {}
    },
    data() {
      return {
        form: {
          'batchNumber': '',
          'batchReleaseCount': '',
          'batchReleaseDate': '',
          'batchReleaseNumber': '',
          'createTime': '',
          'createdBy': '',
          'expirationDate': '',
          'goodsId': '',
          'goodsName': '',
          'id': '',
          'orgId': '',
          'orgName': '',
          'productionDate': '',
          'customsFormNumber': '',
          'portInspectionNumber': '',
          'specification': ''
        },
        rules: {
          batchNumber: [
            {required: true, message: '请输入批号', trigger: 'blur'}
          ],
          productionDate: [
            {required: true, message: '请选择生产日期', trigger: 'change'}
          ],
          expirationDate: [
            {required: true, message: '请输入有效期', trigger: 'change'}
          ]
        },
        doing: false
      };
    },
    watch: {
      currentItem: {
        handler() {
          this.resetForm();
          utils.handleReceiptInfo('batchForm', this);
        },
        deep: true
      },
      form: {
        handler(val) {
          utils.saveReceiptInfo('batchForm', val);
        },
        deep: true
      }
    },
    mounted() {
      utils.forbidEleScroll(this.$refs['inputNumber']);
    },
    methods: {
      resetForm() {
        this.form = {
          'batchNumber': '',
          'batchReleaseCount': '',
          'batchReleaseDate': '',
          'batchReleaseNumber': '',
          'createTime': '',
          'createdBy': '',
          'expirationDate': '',
          'goodsId': '',
          'goodsName': '',
          'id': '',
          'orgId': '',
          'orgName': '',
          'productionDate': '',
          'customsFormNumber': '',
          'portInspectionNumber': '',
          'specification': ''
        };
      },
      reset() {
        this.resetForm();
        utils.saveCopyReceiptInfo('batchForm', this.form);
      },
      submitForm() {
        this.$refs['addBatchForm'].validate(valid => {
          if (!valid) return;
          this.doing = true;
          this.form.goodsId = this.currentItem.orgGoodsDto.goodsDto.id;
          this.form.orgId = this.currentItem.orgGoodsDto.goodsDto.factoryId;
          batchNumber.save(this.form).then(res => {
            this.$notify.success({
              message: '添加批号成功'
            });
            this.doing = false;
            this.$emit('changeBatch', res.data);
            this.reset();
          }).catch(err => {
            this.doing = false;
            this.$notify.error({
              message: err.response.data && err.response.data.msg || '添加批号失败'
            });
          });
        });
      }
    }
  };
</script>
