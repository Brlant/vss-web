<style lang="scss">
  .material {
    .el-input-group--append {
      > .el-input__inner {
        width: 120px;
      }
    }

    .el-input-group__append, .el-input-group__prepend {
      width: auto;
      background: #ffffff;
    }
  }
</style>
<template>
  <div class="material">
    <el-form-item label="物料数量" class="pull-left">
      <oms-input type="number" size="mini" v-model.number="form.count" :min="0">
        <el-select placeholder="请输入名称搜索物料" v-model="form.name" slot="append" filterable clearable remote
                   :remoteMethod="queryMaterials">
          <el-option :label="item.name" :value="item.name" :key="item.id" v-for="item in materials">
          </el-option>
        </el-select>
      </oms-input>
    </el-form-item>
    <el-form-item class="pull-left" label-width="20px">
      <el-button type="primary" @click="add">加入备注</el-button>
    </el-form-item>
  </div>
</template>
<script>
  import {material} from '@/resources';

  export default {
    props: {
      orgId: String,
      type: String
    },
    data() {
      return {
        form: {
          name: '',
          count: '',
          materialUnit: ''
        },
        materials: []
      };
    },
    computed: {
      materialUnits() {
        return this.$getDict('materialUnit');
      }
    },
    watch: {
      orgId() {
        this.queryMaterials();
      }
    },
    mounted() {
      this.queryMaterials();
    },
    methods: {
      queryMaterials(query) {
        let params = {
          deleteFlag: false,
          keyword: query,
          pageSize: 100
        };
        this.materials = [];
        if (!this.type) {
          material.query(params).then(res => {
            this.materials = res.data.list;
          });
        } else {
          if (!this.orgId) return;
          params.orgId = this.orgId;
          this.$http.get('/material/superior', {params}).then(res => {
            this.materials = res.data.list;
          });
        }
      },
      add() {
        if (!this.form.count) {
          this.$notify.info({
            message: '请输入物料数量'
          });
          return;
        }
        if (!this.form.name) {
          this.$notify.info({
            message: '请选择物料'
          });
          return;
        }
        this.$emit('changeRemark', this.form);
        this.form = {
          name: '',
          count: '',
          materialUnit: ''
        };
      }
    }
  };
</script>
