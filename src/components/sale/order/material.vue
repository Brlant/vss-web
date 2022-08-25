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
      <el-form-item class="pull-left" label="物料数量">
        <oms-input v-model.number="form.count" :min="0"  size="mini" type="number">
          <el-select slot="append" v-model="form.name" :remoteMethod="queryMaterials" clearable filterable placeholder="请输入名称搜索物料"
                     remote>
            <el-option v-for="item in materials" :key="item.id" :label="item.name" :value="item.name">
            </el-option>
          </el-select>
        </oms-input>
      </el-form-item>
      <el-form-item class="pull-left" label-width="20px">
        <el-button type="primary" @click="add">加入物料列表</el-button>
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
      materials: [],

      tableData: [],
      rowName: '',
      rowNum: '',
      idNum: 0
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
