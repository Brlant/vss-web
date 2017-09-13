<style lang="less" scoped>

  .margin-left {
    margin-left: 15px;
  }

  .margin-left-right {
    margin-left: 38px;
    margin-right: 38px;
  }

  .power-style-part {
    margin: 12px 0;
    background-color: rgb(238, 238, 238);
    padding: 12px 10px 10px 10px;
  }

  .el-form .el-checkbox__label {
    font-size: 12px;
    padding-left: 5px;
  }

  .el-form .el-checkbox__inner {
    width: 14px;
    height: 14px;
  }

  .customize-input {
    border: 1px solid #ffffff;
    border-radius: 5px;
    width: 240px;
    padding: 4px;
    &:hover {
      border-color: #cccccc;
    }
    &:focus {
      outline: none;
    }
  }

  .min-row {
    .el-row {
      margin-bottom: 10px;
    }
  }

  .bill-font {
    font-weight: bold;
  }

  .borderShow {
    height: 20px;
    border-bottom: 1px solid #777777;
    opacity: 0.2;
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .title {
    margin-bottom: 5px;
    color: #999999;
    font-weight: normal;
  }

  .el-form .el-select {
    display: block;
  }

  .business-scope {
    border: 1px solid #cccccc;
    border-radius: 5px;
    width: 120px;
    height: 40px;
    text-align: center;
    margin-left: 20px;
    margin-bottom: 10px;
    float: left;
    .scope-span {
      position: relative;
      top: 10px;
    }
    .scope-icon {
      position: relative;
      top: 10px;
      right: -28px;
      color: #ffffff;
      &:hover {
        color: rgb(200, 0, 0)
      }
    }
  }

  .good-selects {
    .el-select-dropdown__item {
      font-size: 14px;
      padding: 8px 10px;
      position: relative;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      color: rgb(72, 94, 106);
      height: auto;
      width: 430px;
      line-height: 1.5;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
</style>
<template>
  <div>
    <h2 class="clearfix">添加货品</h2>
    <el-form ref="goodSForm" :model="form" :rules="rules" label-width="120px" @submit.prevent="onSubmit('goodSForm')"
             onsubmit="return false">
      <el-form-item label="OMS货品" prop="goodsId">
        <el-select placeholder="请选择OMS货品" v-model="form.goodsId" filterable remote :remote-method="getOmsGoods"
                   :clearable="true" @change="getGoodsType(form.goodsId)" popper-class="good-selects">
          <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in goodsList">
            <span class="pull-left">{{ item.name }}</span>
            <span class="pull-right" style="color:#999">
            <dict :dict-group="'typeId'" :dict-key="item.typeId"></dict>
            </span>
          </el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="货品分类">-->
      <!--<dict :dict-group="'typeId'" :dict-key="goodsType"></dict>-->
      <!--&lt;!&ndash;<el-select placeholder="请选择货品分类" v-model="goodsType" disabled>&ndash;&gt;-->
      <!--&lt;!&ndash;<el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in typeId"></el-option>&ndash;&gt;-->
      <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
      <!--</el-form-item>-->
      <el-form-item label="货主货品编号" prop="goodsNo">
        <oms-input type="text" v-model="form.goodsNo" placeholder="请输入货主货品编号"></oms-input>
      </el-form-item>
      <el-form-item label="货主货品名称" prop="name">
        <oms-input type="text" v-model="form.name" placeholder="请输入货主货品名称"></oms-input>
      </el-form-item>
      <el-form-item label="储存条件">
        <el-select placeholder="请选择储存条件" v-model="form.storageConditionId">
          <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in storageCondition"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单价" prop="unitPrice">
        <oms-input type="text" v-model="form.unitPrice" placeholder="请输入单价" @blur="formatPrice">
          <template slot="prepend">￥</template>
        </oms-input>
      </el-form-item>
      <el-form-item label="库存上限" prop="inventoryUpperLimit">
        <oms-input type="number" :min="0" v-model.number="form.inventoryUpperLimit" placeholder="请输入库存上限"></oms-input>
      </el-form-item>
      <el-form-item label="库存下限" prop="inventoryLowerLimit">
        <oms-input type="number" :min="0" v-model.number="form.inventoryLowerLimit" placeholder="请输入库存下限"></oms-input>
      </el-form-item>
      <el-form-item label="是否计价">
        <el-switch on-text="是" off-text="否" on-color="#13ce66" off-color="#ff4949"
                   v-model="form.valuationFlag"></el-switch>
      </el-form-item>
      <el-form-item label="是否组合">
        <el-switch on-text="是" off-text="否" on-color="#13ce66" off-color="#ff4949"
                   v-model="form.goodsIsCombination"></el-switch>
      </el-form-item>
      <div v-show="form.goodsIsCombination">
        <!--<el-form ref="otherGoodsForm" :model="form" :rules="otherGoodsRules" label-width="120px">-->
        <el-form-item label="其他OMS货品">
          <el-select placeholder="请选择OMS货品" v-model="otherForm.accessory" filterable popper-class="good-selects">
            <el-option :label="item.orgGoodsDto.name" :value="item.orgGoodsDto.id" :key="item.orgGoodsDto.id"
                       v-for="item in otherGoodsList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <oms-input type="number" :min="1" v-model.number="otherForm.proportion" placeholder="请输入数量"
                     style="width: 120px"></oms-input>
          <el-button type="primary" @click="addGoods">添加</el-button>
        </el-form-item>
        <!--</el-form>-->
        <ul class="show-list">
          <li class="list-item"><span>其他OMS货品</span> <span style="position: absolute;right: 200px">比例</span></li>
          <li v-for="item in selectGoodsList" class="list-item">
            <span style="display: inline-block;width: 260px">{{ item.name }}</span>
            <span style="position: absolute;right: 200px;display: inline-block;">{{ item.proportion }}</span>
            <a href="#" class="pull-right" @click.prevent="removeGoodList(item)"><i
              class="oms-font oms-font-delete"></i></a>
          </li>
        </ul>
      </div>
      <el-form-item style="margin-top: 20px" label-width="120px">
        <el-button type="primary" @click="onSubmit('goodSForm')" native-type="submit">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { OrgGoods, Goods } from '@/resources';
  import utils from '@/tools/utils';

  export default {
    data: function () {
      return {
        form: {
          name: '',
          orgId: '',
          status: true,
          goodsId: '',
          goodsIsCombination: false,
          goodsNo: '',
          unitPrice: null,
          valuationFlag: false,
          storageConditionId: ''
        },
//         otherGoodsRules: {
//           accessory: [
//             {required: true, message: '请选择OMS货品', trigger: 'change'}
//           ],
//           proportion: [
//             {required: true, message: '请输入', trigger: 'blur'}
//           ],
//         },
        rules: {
          goodsId: [
            {required: true, message: '请选择OMS货品', trigger: 'change'}
          ],
          goodsNo: [
            {required: true, message: '请输入货品编号', trigger: 'blur'}
          ],
          storageConditionId: [
            {required: true, message: '请选择储存条件', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入货品名称', trigger: 'blur'}
          ],
          unitPrice: [
            {required: true, message: '请输入单价', trigger: 'blur'}
          ],
          accessory: [
            {required: true, message: '请输入其他OMS货品', trigger: 'change'}
          ],
          proportion: [
            {type: 'number', message: '比例必须为数字值'}
          ],
          inventoryLowerLimit: [
            {required: true, type: 'number', message: '请输入库存下限', trigger: 'blur'}
          ],
          inventoryUpperLimit: [
            {required: true, type: 'number', message: '请输入库存上限', trigger: 'blur'}
          ]
        },
        otherForm: {
          accessory: '',
          proportion: null
        },
        goodsList: [], // oms货品列表
        otherGoodsList: [], // 其他oms组合货品列表
        invariantOtherGoodslist: [], // 所有的oms组合货品列表
        selectGoodsList: [], // 已经选择的货品列表
        goodsType: '',
        doing: false
      };
    },
    props: ['formItem', 'action', 'actionType'],
    mounted: function () {
    },
    computed: {
      typeId () {
        return this.$store.state.dict['typeId'];
      },
      storageCondition () {
        return this.$store.state.dict['storageCondition'];
      }
    },
    watch: {
      formItem: function (val) {
        this.goodsType = '';
        if (typeof val.id === 'string') {
          this.form = this.formItem;
          this.form.unitPrice = utils.autoformatDecimalPoint(this.form.unitPrice.toString());
        } else {
          this.form = {
            name: '',
            orgId: '',
            status: true,
            goodsId: '',
            goodsIsCombination: false,
            goodsNo: '',
            unitPrice: '',
            valuationFlag: false,
            storageConditionId: '',
            inventoryLowerLimit: null,
            inventoryUpperLimit: null
          };
        }
        this.otherForm = {
          accessory: '',
          proportion: null
        };
        this.getCombinationGoods();
        this.getOmsGoods();
      },
      selectGoodsList: function () {
        this.filtersCombinationGoods();
      },
      actionType: function (val) {
        if (!val) {
          this.$refs['goodSForm'].resetFields();
        }
      }
    },
    methods: {
      getOmsGoods: function (keyWord) {// 得到oms货品列表
        let orgId = this.$route.params.id;
        let params = {
          keyWord: keyWord
        };
        Goods.filterOrg(orgId, params).then(res => {
          this.goodsList = res.data.list;
          if (this.action === 'edit') {
            let isExist = this.goodsList.some(item => this.form.goodsDto.id === item.id);
            if (!isExist) {
              this.goodsList.push({
                id: this.form.goodsDto.id,
                name: this.form.goodsDto.name
              });
            }
          }
          this.getGoodsType(this.form.goodsId);
        });
      },
      getCombinationGoods: function (keyWord) {// 获取其他组合货品列表
        let params = Object.assign({}, {
          deleteFlag: false,
          orgId: this.$route.params.id,
          keyWord: keyWord
        });
        OrgGoods.query(params).then(res => {
          this.invariantOtherGoodslist = JSON.parse(JSON.stringify(res.data.list));
          this.filterSelectGoodsList(res.data.list);
        });
      },
      getGoodsType: function (id) {
        if (!id) {
          this.goodsType = '';
          return;
        }
        this.goodsList.forEach(item => {
          if (id === item.id) {
            this.goodsType = item.typeId;
          }
        });
      },
      filtersCombinationGoods () {// 过滤已有的oms货品和本身
        let array = [];
        let isNotSame = false;
        this.invariantOtherGoodslist.forEach(tItem => {
          isNotSame = true;
          this.selectGoodsList.forEach(sItem => {
            if (tItem.orgGoodsDto.id === sItem.accessory) {
              isNotSame = false;
            }
          });
          if (tItem.orgGoodsDto.id === this.form.id) {
            isNotSame = false;
          }
          if (isNotSame) {
            array.push(tItem);
          }
        });
        this.otherGoodsList = [];
        this.otherGoodsList = array;
      },
      filterSelectGoodsList: function (data) {// 过滤选择的组合oms货品
        this.selectGoodsList = [];
        if (data.length === 0) return;
        data.forEach(item => {
          if (this.form.id === item.orgGoodsDto.id) {
            this.selectGoodsList = item.list;
          }
        });
      },
      formatPrice () {// 格式化单价，保留两位小数
        this.form.unitPrice = utils.autoformatDecimalPoint(this.form.unitPrice);
      },
      remove () {
        this.$confirm('确认删除该信息?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        });
      },
      addGoods: function () {
        let accessory = this.otherForm.accessory;
        if (!accessory) {
          return;
        }
        let proportion = this.otherForm.proportion;
        let name = '';

        this.otherGoodsList.forEach(function (val) {
          if (accessory === val.orgGoodsDto.id) {
            name = val.orgGoodsDto.name;
          }
        });
        this.selectGoodsList.push({accessory, name, proportion});
        this.otherForm.accessory = '';
        this.otherForm.proportion = '';
      },
      removeGoodList: function (item) {
        let index = this.selectGoodsList.indexOf(item);
        this.selectGoodsList.splice(index, 1);
      },
      onSubmit: function (formName) {
        // 如果选择组合货品，则验证组或货品的表单
        if (this.form.goodsIsCombination) {
          if (this.selectGoodsList && this.selectGoodsList.length === 0) {
            this.$notify.error({
              duration: 1500,
              message: '请选择要组合的OMS货品'
            });
            return;
          }
        }
        this.$refs[formName].validate((valid) => {
          if (!valid || this.doing) return;
          this.doing = true;
          let list = [];
          this.selectGoodsList.forEach(function (val) {
            list.push({
              'accessory': val.accessory,
              'proportion': val.proportion,
              'name': val.name
            });
          });
          this.form.orgId = this.$route.params.id;
          //  转成numer
          let data = {
            'orgGoodsDto': Object.assign({}, this.form),
            'list': list
          };
          if (this.action === 'add') {
            OrgGoods.save(data).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增货主货品"' + data.orgGoodsDto.name + '"成功'
              });
              this.$emit('change', data);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '新增货主货品"' + data.orgGoodsDto.name + '"失败'
              });
              this.doing = false;
            });
          } else {
            OrgGoods.update(data.orgGoodsDto.id, data).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '修改货主货品"' + data.orgGoodsDto.name + '"成功'
              });
              this.$emit('change', data);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '修改货主货品"' + data.orgGoodsDto.name + '"失败'
              });
              this.doing = false;
            });
          }
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['goodSForm'].resetFields();
      }
    }
  };
</script>
