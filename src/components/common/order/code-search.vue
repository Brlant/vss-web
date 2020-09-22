<template>
  <el-row class="mt-10">
    <el-col :span="7">
      <oms-form-row :span="5" label="货品">
        <el-select v-model="searchCondition.goodsId" clearable filterable placeholder="请选择货品" popperClass="good-selects"
                   size="mini" @change="goodsIdChange">
          <el-option v-for="item in goodsList" :key="item.goodsId" :label="item.goodsName"
                     :value="item.goodsId">
            <div>{{item.goodsName}}</div>
            <div class="select-other-info" style="margin-left: 0">
              <div>规格：{{item.specification}}</div>
              <div>编号：{{item.goodsCode}}</div>
              <div>生产单位：{{item.factoryName}}</div>
            </div>
          </el-option>
        </el-select>
      </oms-form-row>
    </el-col>
    <el-col :span="7">
      <oms-form-row :span="5" label="批号">
        <el-select v-model="searchCondition.batchNumber" clearable filterable placeholder="请选择批号"
                   size="mini" @focus="batchNumberIdFocus">
          <el-option v-for="item in batchNumberList" :key="item.batchNumberId" :label="item.no"
                     :value="item.no"></el-option>
        </el-select>
      </oms-form-row>
    </el-col>
    <el-col :span="7">
      <oms-form-row :span="6" label="追溯码">
        <el-input v-model="searchCondition.code" clearable size="mini"></el-input>
      </oms-form-row>
    </el-col>
    <el-col :span="3" style="padding-left: 10px">
      <el-button type="primary" @click="search">查询</el-button>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    type: String,
    currentOrder: Object,
    index: Number
  },
  data() {
    return {
      searchCondition: {
        goodsId: '',
        batchNumber: '',
        code: ''
      },
      goodsList: [],
      detailList: []
    };
  },
  watch: {
    index: {
      handler(val) {
        this.searchCondition = {
          goodsId: '',
          batchNumber: '',
          code: ''
        };
        this.goodsList = [];
        this.detailList = [];
        if (val !== 8 && val !== 9) return;
        if (this.type === '0') {
          this.$http.get(`/receipt/order/${this.currentOrder.id}`).then(res => {
            let obj = {};
            res.data.forEach(i => {
              obj[i.goodsId] = i;
            });
            this.goodsList = Object.keys(obj).map(k => obj[k]);
            this.detailList = res.data;
          });
        } else {
          let obj = {};
          this.currentOrder.detailDtoList.forEach(i => {
            if (i.orgGoodsDto) {
              i.specification = i.orgGoodsDto.goodsDto.specifications;
              i.goodsCode = i.orgGoodsDto.goodsDto.code;
              i.factoryName = i.orgGoodsDto.goodsDto.factoryName;
            }
            obj[i.goodsId] = i;
          });
          this.goodsList = Object.keys(obj).map(k => obj[k]);
          this.detailList = this.currentOrder.detailDtoList;
        }
      },
      immediate: true
    }
  },
  computed: {
    batchNumberList() {
      if (!this.searchCondition.goodsId) return [];
      if (this.type === '0') {
        return this.detailList.filter(f => f.goodsId === this.searchCondition.goodsId);
      }
      return this.detailList.filter(f => f.goodsId === this.searchCondition.goodsId).map(m => {
        m.no = m.batchNumber;
        return m;
      });
    }
  },
  methods: {
    search() {
      this.$emit('search', this.searchCondition);
    },
    batchNumberIdFocus() {
      if (!this.batchNumberList.length && this.goodsList.length) {
        this.$notify.info('请选择货品');
      }
    },
    goodsIdChange() {
      this.searchCondition.batchNumber = '';
    }
  }
};
</script>
