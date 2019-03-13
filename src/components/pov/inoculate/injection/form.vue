<style lang="scss" scoped="">
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">{{title}}</h2>
    <el-form ref="form" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit('form')" onsubmit="return false">
      <el-form-item label="接种者" prop="name">
        <el-select v-model="form.name" filterable remote :remote-method="queryPersonList" placeholder="请选择接种者"
                   clearable popper-class="order-good-selects">
          <el-option v-for="item in personList" :key="item.id" :label="item.name" :value="item.id">
            <div>{{item.name}}</div>
            <div><span class="select-other-info"><span v-show="item.code">登记编号:</span>{{item.code}}</span></div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="疫苗" prop="orgGoodsId">
        <el-select v-model="form.orgGoodsId" filterable remote :remote-method="queryOrgGoodsList"
                   placeholder="请输入名称搜索疫苗"
                   clearable popper-class="order-good-selects"
                   @change="orgGoodsIdChange">
          <el-option v-for="item in orgGoodsList" :key="item.orgGoodsDto.id" :label="item.orgGoodsDto.name"
                     :value="item.orgGoodsDto.id">
            <div>{{item.orgGoodsDto.name}}</div>
            <div>
                <span class="select-other-info">
                  <span v-show="item.orgGoodsDto.goodsNo">疫苗编号:</span>{{item.orgGoodsDto.goodsNo}}
                </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="批号" prop="batchNumber">
        <el-select v-model="form.batchNumber" filterable remote :remote-method="queryBatchNumbers" placeholder="请选择批号"
                   clearable popper-class="order-good-selects">
          <el-option v-for="item in batchNumberList" :key="item.id" :label="item.batchNumber"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接种部位" prop="part">
        <el-select type="text" v-model="form.part" placeholder="请选择接种部位">
          <el-option :value="item.key" :key="item.key" :label="item.label"
                     v-for="item in inoculationPositionList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接种途径" prop="way">
        <el-select type="text" v-model="form.way" placeholder="请选择接种途径">
          <el-option :value="item.key" :key="item.key" :label="item.label"
                     v-for="item in inoculationChannelList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('form')" native-type="submit" :disabled="doing">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {inoculateTask} from '@/resources';
  import methods from '../mixin/methods';

  export default {
    name: 'editForm',
    mixins: [methods],
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      }
    },
    data: function () {
      return {
        roleId: '',
        form: {
          name: '',
          orgGoodsId: '',
          batchNumber: '',
          part: '',
          way: ''
        },
        rules: {
          name: [
            {required: true, message: '请选择接种者', trigger: 'change'}
          ],
          orgGoodsId: [
            {required: true, message: '请选择疫苗', trigger: 'change'}
          ],
          batchNumber: [
            {required: true, message: '请选择批号', trigger: 'change'}
          ],
          part: [
            {required: true, message: '请选择接种部位', trigger: 'change'}
          ],
          way: [
            {required: true, message: '请选择接种途径', trigger: 'change'}
          ]
        },
        doing: false
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      },
      title() {
        return (this.form.id ? '编辑' : '新增') + '接种任务';
      }
    },
    watch: {
      formItem: function (val) {
        this.$refs['form'].clearValidate();
        if (val.id) {
          this.form = this.formItem;
        } else {
          this.form = {
            name: '',
            orgGoodsId: '',
            batchNumber: '',
            part: '',
            way: ''
          };
        }
      }
    },
    methods: {
      queryBatchNumbers(query) {
        this.queryBatchNumberList({
          keyWord: query
        });
      },
      orgGoodsIdChange() {

      },
      onSubmit: function (formName) {
        let self = this;
        if (this.doing) return;
        this.doing = true;
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.doing = false;
            return false;
          }
          this.doing = true;
          let formData = JSON.parse(JSON.stringify(this.form));
          if (!formData.id) {
            inoculateTask.save(formData).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增成功'
              });
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '新增失败'
              });
              this.doing = false;
            });
          } else {
            inoculateTask.update(formData.id, formData).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '修改成功'
              });
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '修改失败'
              });
              this.doing = false;
            });
          }
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['form'].resetFields();
      }
    }
  };
</script>
