<style lang="scss" scoped>

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
</style>
<template>
  <div>
    <h2 class="clearfix">{{showTitle}}货主疫苗产品资料</h2>
    <el-form ref="goodSForm" :model="form" :rules="rules" label-width="120px" onsubmit="return false"
             @submit.prevent="onSubmit('goodSForm')">
      <el-form-item label="疫苗种类" prop="goodsId">
        <el-select v-model="form.goodsId" :clearable="true" :remote-method="getOmsGoods" filterable placeholder="请选择疫苗种类"
                   popper-class="good-selects" remote @change="getOmsGoods"
                   @clear="getOmsGoods">
          <el-option v-for="item in goodsList" :key="item.id" :label="item.name" :value="item.id">
            <div style="overflow: hidden">
              <span class="pull-left">{{item.name}}</span>
            </div>
            <div style="overflow: hidden">
                <span class="select-other-info pull-left"><span
                  v-show="item.code">货主货品编号:</span>{{item.code}}
                </span>
              <span class="select-other-info pull-left"><span
                v-show="item.specifications">疫苗规格:</span>{{item.specifications}}
                </span>
              <span class="select-other-info pull-left"><span
                v-show="item.approvalNumber">批准文号:</span>{{item.approvalNumber}}
                </span>
            </div>
            <div style="overflow: hidden">
              <span class="select-other-info pull-left"><span
                v-show="item.factoryName">生产单位:</span>{{ item.factoryName }}
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供货单位" prop="salesFirm">
        <el-select v-model="form.salesFirmId" :clearable="true" :remote-method="filterOrg" filterable placeholder="请输入名称搜供货单位"
                   popperClass="good-selects" remote @change="setSalesFirm(form.salesFirmId)"
                   @click.native="filterOrg('')">
          <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
            <div style="overflow: hidden">
              <span class="pull-left" style="clear: right">{{org.name}}</span>
            </div>
            <div style="overflow: hidden">
              <span class="select-other-info pull-left">
                <span>系统代码:</span>{{org.manufacturerCode}}
              </span>
            </div>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="供货单位ID">
        {{form.salesFirm}}
      </el-form-item>
      <el-form-item label="供货单位名称">
        {{form.salesFirmName}}
      </el-form-item>
      <el-form-item label="货主货品编号" prop="goodsNo">
        <oms-input v-model="form.goodsNo" placeholder="请输入货主货品编号" type="text"></oms-input>
      </el-form-item>
      <el-form-item label="疫苗名称" prop="name">
        <oms-input v-model="form.name" placeholder="请输入疫苗名称" type="text"></oms-input>
      </el-form-item>
      <el-form-item label="产品图片">
        <oms-upload-picture :photoUrl="form.photoUrl" @change="changPhoto"></oms-upload-picture>
      </el-form-item>
      <el-form-item label="储存条件">
        <el-select v-model="form.storageConditionId" placeholder="请选择储存条件">
          <el-option v-for="item in storageCondition" :key="item.key" :label="item.label" :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="疫苗种类" prop="goodsVaccineSign">
        <el-select v-model="form.goodsVaccineSign" clearable placeholder="请选择疫苗种类">
          <el-option v-for="item in  vaccineSignList" :key="item.key" :label="item.label"
                     :value="item.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标准单价" prop="unitPrice">
        <oms-input v-model="form.unitPrice" placeholder="请输入标准单价" type="text" @blur="formatPrice">
          <template slot="prepend">¥</template>
        </oms-input>
      </el-form-item>
      <el-form-item label="中标价格" prop="bidPrice">
        <oms-input v-model="form.bidPrice" placeholder="请输入中标价格" type="text" @blur="formatPrice" @change="setPrice">
          <template slot="prepend">￥</template>
        </oms-input>
      </el-form-item>
      <el-form-item label="采购价格" prop="procurementPrice">
        <oms-input v-model="form.procurementPrice" placeholder="请输入采购价格" type="text" @blur="formatPrice">
          <template slot="prepend">￥</template>
        </oms-input>
      </el-form-item>
      <el-form-item label="销售价格" prop="sellPrice">
        <oms-input v-model="form.sellPrice" placeholder="请输入销售价格" type="text" @blur="formatPrice">
          <template slot="prepend">￥</template>
        </oms-input>
      </el-form-item>
      <el-form-item label="库存上限">
        <oms-input v-model.number="form.inventoryUpperLimit" :min="0" placeholder="请输入库存上限" type="number"></oms-input>
      </el-form-item>
      <el-form-item label="库存下限">
        <oms-input v-model.number="form.inventoryLowerLimit" :min="0" placeholder="请输入库存下限" type="number"></oms-input>
      </el-form-item>
      <el-form-item label="是否计价">
        <el-switch v-model="form.valuationFlag" active-color="#13ce66" active-text="是" inactive-color="#ff4949"
                   inactive-text="否"></el-switch>
      </el-form-item>
      <el-form-item label="是否组合">
        <el-switch v-model="form.goodsIsCombination" active-color="#13ce66" active-text="是" inactive-color="#ff4949"
                   inactive-text="否"></el-switch>
      </el-form-item>
      <div v-show="form.goodsIsCombination">
        <!--<el-form ref="otherGoodsForm" :model="form" :rules="otherGoodsRules" label-width="120px">-->
        <el-form-item label="其他单位疫苗">
          <el-select v-model="otherForm.accessory" :clearable="true" :remote-method="queryCombinationGoods" filterable placeholder="请选择单位疫苗"
                     popper-class="good-selects" remote @click.native="queryCombinationGoods('')">
            <el-option v-for="item in otherGoodsList" :key="item.orgGoodsDto.id" :label="item.orgGoodsDto.name"
                       :value="item.orgGoodsDto.id">
              <div style="overflow: hidden">
                <span class="pull-left">{{item.orgGoodsDto.name}}</span>
              </div>
              <div style="overflow: hidden">
              <span class="select-other-info pull-left"><span
                v-show="item.orgGoodsDto.goodsDto.code">疫苗主档编号:</span>{{item.orgGoodsDto.goodsDto.code}}
              </span>
                <span class="select-other-info pull-left"><span
                  v-show="item.orgGoodsDto.goodsNo">货主货品编号:</span>{{item.orgGoodsDto.goodsNo}}
              </span>
                <span class="select-other-info pull-left"><span
                  v-show="item.orgGoodsDto.salesFirmName">供货单位:</span>{{ item.orgGoodsDto.salesFirmName }}
              </span>
                <span v-if="item.orgGoodsDto.goodsDto" class="select-other-info pull-left">
                          <span v-show="item.orgGoodsDto.goodsDto.factoryName">生产单位:</span>{{ item.orgGoodsDto.goodsDto.factoryName }}
                 </span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数量">
          <oms-input v-model.number="otherForm.proportion" :min="1" placeholder="请输入数量" style="width: 120px"
                     type="number"></oms-input>
          <el-button type="primary" @click="addGoods">添加</el-button>
        </el-form-item>
        <!--</el-form>-->
        <ul v-show="selectGoodsList.length" class="show-list">
          <li class="list-item"><span>其他单位疫苗</span> <span style="position: absolute;right: 200px">数量</span></li>
          <li v-for="item in selectGoodsList" class="list-item">
            <span style="display: inline-block;width: 260px">{{ item.name }}</span>
            <span style="position: absolute;right: 200px;display: inline-block;">{{ item.proportion }}</span>
            <a class="pull-right" href="#" @click.prevent="removeGoodList(item)"><i
              class="el-icon-t-delete"></i></a>
          </li>
        </ul>
      </div>
      <el-form-item label-width="120px" style="margin-top: 20px">
        <el-button native-type="submit" type="primary" @click="onSubmit('goodSForm')">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {BaseInfo, SuccessfulBidder, Vaccine} from '@/resources';
import utils from '@/tools/utils';
import omsUploadPicture from '@/components/common/upload.picture.vue';

export default {
  components: {
    omsUploadPicture
  },
  data: function () {
    let checkGoodsCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入货主货品编号'));
      } else {
        let orgId = this.$store.state.user.userCompanyAddress;
        Vaccine.checkGoodsCode({code: value, goodsId: this.form.goodsId, orgId: orgId}).then(val => {
          if (!val.data['codeCheck']) {
            callback(new Error('输入的货主货品编号已存在,请重新输入'));
          } else {
            callback();
          }
        });
      }
    };
    return {
      form: {
        name: '',
        orgId: '',
        status: true,
        salesFirm: '',
        salesFirmName: '',
        goodsId: '',
        goodsIsCombination: false,
        goodsNo: '',
        bidPrice: null,
        valuationFlag: false,
        storageConditionId: '',
        goodsVaccineSign: '',
        photoId: '',
        photoUrl: ''
      },
      rules: {
        goodsId: [
          {required: true, message: '请选择疫苗种类', trigger: 'change'}
        ],
        goodsNo: [
          {required: true, message: '请输入货主货品编号', trigger: 'blur'},
          {validator: checkGoodsCode, trigger: 'blur'}
        ],
        salesFirm: [
          {required: true, message: '请选择供货单位', trigger: 'change'}
        ],
        storageConditionId: [
          {required: true, message: '请选择储存条件', trigger: 'blur'}
        ],
        goodsVaccineSign: [
          {required: true, message: '请选择疫苗种类', trigger: 'change'}
        ],
        name: [
          {required: true, message: '请输入疫苗名称', trigger: 'blur'}
        ],
        unitPrice: [
          {required: true, message: '请输入标准单价', trigger: 'blur'}
        ],
        bidPrice: [
          {required: true, message: '请输入中标价格', trigger: 'blur'}
        ],
        procurementPrice: [
          {required: true, message: '请输入采购价格', trigger: 'blur'}
        ],
        sellPrice: [
          {required: true, message: '请输入销售价格', trigger: 'blur'}
        ],
        accessory: [
          {required: true, message: '请输入其他单位疫苗', trigger: 'change'}
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
      goodsList: [], // 单位疫苗列表
      otherGoodsList: [], // 其他oms组合疫苗列表
      invariantOtherGoodslist: [], // 所有的oms组合疫苗列表
      selectGoodsList: [], // 已经选择的疫苗列表
      goodsType: '',
      doing: false,
      orgList: []
    };
  },
  props: ['formItem', 'action', 'actionType', 'usedStatus'],
  mounted: function () {
  },
  computed: {
    typeId() {
      return this.$getDict('typeId');
    },
    storageCondition() {
      return this.$getDict('storageCondition');
    },
    showTitle() {
      let tilet = '新增';
      if (this.action === 'edit') {
        tilet = '修改';
      }
      return tilet;
    },
    user() {
      return this.$store.state.user;
    },
    vaccineSignList() {
      return this.$getDict('vaccineSign');
    }
  },
  watch: {
    formItem: function (val) {
      this.goodsType = '';
      this.filterOrg();
      if (typeof val.id === 'string') {
        this.form = this.formItem;
        if (this.form.unitPrice) {
          this.form.unitPrice = utils.autoformatDecimalPoint(this.form.unitPrice ? this.form.unitPrice.toString() : '');
        }
        if (this.form.bidPrice) {
          this.form.bidPrice = utils.autoformatDecimalPoint(this.form.bidPrice.toString());
        }
        if (this.form.procurementPrice) {
          this.form.procurementPrice = utils.autoformatDecimalPoint(this.form.procurementPrice.toString());
        }
        if (this.form.sellPrice) {
          this.form.sellPrice = utils.autoformatDecimalPoint(this.form.sellPrice.toString());
        }
        this.selectGoodsList = this.form.combinationList;
//          this.otherGoodsList = [];
//          this.getCombinationGoods();
        this.getOmsGoods(val.goodsDto.name);
//          this.filterOrg(val.salesFirmName);
      } else {
//          this.queryCombinationGoods();
        this.getOmsGoods();
        this.form = {
          name: '',
          orgId: '',
          status: true,
          goodsId: '',
          salesFirm: '',
          salesFirmName: '',
          goodsIsCombination: false,
          goodsNo: '',
          unitPrice: '',
          bidPrice: '',
          sellPrice: '',
          procurementPrice: '',
          valuationFlag: false,
          storageConditionId: '',
          inventoryLowerLimit: null,
          inventoryUpperLimit: null,
          photoId: '',
          photoUrl: ''
        };
        this.otherGoodsList = [];
      }
      this.otherForm = {
        accessory: '',
        proportion: null
      };
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
    changPhoto: function (photo) {
      if (photo) {
        this.photo = photo;
        this.form.photoId = this.photo.attachmentId;
        this.form.photoUrl = this.photo.url;
      }
    },
    setSalesFirm: function (id) {
      if (id) {
        this.orgList.forEach(val => {
          if (val.id === id) {
            this.form.salesFirm = id;
            this.form.salesFirmName = val.name;
          }
        });
      }
    },
    filterOrg: function (query) {
      let orgId = this.$store.state.user.userCompanyAddress;
      if (!orgId) {
        return;
      }
      // 查询供货单位
      let params = {
        keyWord: query,
        relation: '1'
      };
      BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
        this.orgList = res.data;
      });
    },
    setPrice: function () {
      if (this.form.bidPrice) {
        this.form.procurementPrice = this.form.bidPrice;
        this.form.sellPrice = this.form.bidPrice;
      }
    },
    getOmsGoods: function (keyWord) {// 得到单位疫苗列表
      let params = {
        keyWord: keyWord,
        availabilityStatus: true
      };
      SuccessfulBidder.queryInfo(params).then(res => {
        this.goodsList = res.data;
        // this.getGoodsType(this.form.goodsId);
      });
//        }
    },
    queryCombinationGoods: function (keyWord) {// 获取其他组合疫苗列表
      let params = Object.assign({}, {
        keyWord: keyWord,
        deleteFlag: false
      });
      Vaccine.query(params).then(res => {
        this.invariantOtherGoodslist = JSON.parse(JSON.stringify(res.data.list));
        this.filtersCombinationGoods();
      });
    },
    getCombinationGoods: function (keyWord) {// 获取其他组合疫苗列表
      let params = Object.assign({}, {
        deleteFlag: false,
        orgId: this.$route.params.id,
        keyWord: keyWord
      });
      Vaccine.query(params).then(res => {
        let list = JSON.parse(JSON.stringify(res.data.list));
        this.filterSelectGoodsList(list);
      });
    },
    filtersCombinationGoods() {// 过滤已有的单位疫苗和本身
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
    filterSelectGoodsList: function (data) {// 过滤选择的组合单位疫苗
      this.selectGoodsList = [];
      if (data.length === 0) return;
      data.forEach(item => {
        if (this.form.id === item.orgGoodsDto.id) {
          this.selectGoodsList = item.list;
        }
      });
    },
    formatPrice() {// 格式化单价，保留两位小数
      this.form.bidPrice = utils.autoformatDecimalPoint(this.form.bidPrice);
      this.form.procurementPrice = utils.autoformatDecimalPoint(this.form.procurementPrice);
      this.form.sellPrice = utils.autoformatDecimalPoint(this.form.sellPrice);
      this.form.unitPrice = utils.autoformatDecimalPoint(this.form.unitPrice);
    },
    remove() {
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
      // 如果选择组合疫苗，则验证组或疫苗的表单
      if (this.form.goodsIsCombination) {
        if (this.selectGoodsList && this.selectGoodsList.length === 0) {
          this.$notify.info({
            duration: 1500,
            message: '请先添加其他单位疫苗'
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
        //  转成numer
        let data = {
          'orgGoodsDto': Object.assign({}, this.form),
          'list': list
        };
        if (this.action === 'add') {
          Vaccine.save(data).then(() => {
            this.doing = false;
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '新增单位疫苗"' + data.orgGoodsDto.name + '"成功'
            });
            this.$emit('change', data);
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '新增单位疫苗"' + data.orgGoodsDto.name + '"失败'
            });
            this.doing = false;
          });
        } else {
          Vaccine.update(data.orgGoodsDto.id, data).then(() => {
            this.doing = false;
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '修改单位疫苗"' + data.orgGoodsDto.name + '"成功'
            });
            this.$emit('change', data);
          }).catch(() => {
            this.$notify.error({
              duration: 2000,
              message: '修改单位疫苗"' + data.orgGoodsDto.name + '"失败'
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
