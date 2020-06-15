import {erpStock, inoculateInfo} from '@/resources';

export default {
  data() {
    return {
      personList: [],
      orgGoodsList: [],
      batchNumberList: []
    };
  },
  computed: {
    inoculationPositionList() {
      return this.$getDict('inoculationPosition');
    },
    inoculationChannelList() {
      return this.$getDict('inoculationChannel');
    }
  },
  methods: {
    queryPersonList(query) {
      const params = {
        keyword: query
      };
      inoculateInfo.query(params).then(res => {
        this.personList = res.data.list;
      });
    },
    queryOrgGoodsList(query) {
      const params = {
        keyWord: query
      };
      this.$http.get('/erp-stock/goods', {params}).then(res => {
        this.orgGoodsList = res.data.list;
      });
    },
    queryAllOrgGoodsList(query) {
      const params = {
        keyWord: query
      };
      this.$http.get('/vaccine-info', {params}).then(res => {
        this.orgGoodsList = res.data.list.map(m => {
          let item = m.orgGoodsDto;
          item.goodsName = item.name;
          item.saleFirmName = item.salesFirmName;
          return item;
        })
      });
    },
    queryAllGoodsList(query) {
      const params = {
        keyWord: query
      };
      this.$http.get('/vaccine-info', {params}).then(res => {
        let goodsIds = [];
        this.goodsList = [];
        res.data.list.forEach(m => {
          let item = m.orgGoodsDto;
          item.goodsName = item.goodsDto.name;
          item.saleFirmName = item.salesFirmName;
          item.goodsNo = item.goodsDto.code;
          item.factoryName = item.goodsDto.factoryName;
          if (goodsIds.indexOf(item.goodsId) === -1) {
            goodsIds.push(item.goodsId);
            this.goodsList.push(item);
          }
        })
      });
    },
    queryBatchNumberList(prop) {
      const params = prop || {};
      this.$http.get('/batch-number/pager', {params}).then(res => {
        this.batchNumberList = res.data.list;
      });
    },
    getStockAndBatchNumber({
                             before = () => {
                             }, success = () => {
      }
                           }) {
      let params = {};
      before(params);
      erpStock.query(params).then(res => {
        success(res);
      });
    }
  }
};
