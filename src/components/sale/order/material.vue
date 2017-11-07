<template>
  <div>
    <el-form-item label="物料">
      <el-select placeholder="请选择物料" v-model="form.name" filterable clearable remote :remoteMethod="queryMaterials"
                 style="width: 100%">
        <el-option :label="item.name" :value="item.name" :key="item.id" v-for="item in materials">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="物料数量" style="display: inline-block" v-if="form.name">
      <oms-input type="number" v-model.number="form.count" :min="0">
      </oms-input>
    </el-form-item>
    <el-form-item style="display: inline-block">
      <el-button type="primary" @click="add">加入备注</el-button>
    </el-form-item>
  </div>
</template>
<script>
  import { material } from '@/resources';

  export default {
    data () {
      return {
        form: {
          name: '',
          count: ''
        },
        materials: []
      };
    },
    mounted () {
      this.queryMaterials();
    },
    methods: {
      queryMaterials (query) {
        let params = {
          deleteFlag: false,
          keyWord: query
        };
        material.query(params).then(res => {
          this.materials = res.data.list;
        });
      },
      add () {
        if (!this.form.name) {
          this.$notify.info({
            message: '请选择物料'
          });
          return;
        }
        if (!this.form.count) {
          this.$notify.info({
            message: '请输入物料数量'
          });
          return;
        }
        this.$emit('changeRemark', this.form);
        this.form = {
          name: '',
          count: ''
        };
      }
    }
  };
</script>
