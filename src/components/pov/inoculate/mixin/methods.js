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
