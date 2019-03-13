import {BatchNumber, inoculateInfo, Vaccine} from '@/resources';

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
        keyWord: query
      };
      inoculateInfo.query(params).then(res => {
        this.personList = res.data.list;
      });
    },
    queryOrgGoodsList(query) {
      const params = {
        keyWord: query
      };
      Vaccine.query(params).then(res => {
        this.orgGoodsList = res.data.list;
      });
    },
    queryBatchNumberList(prop) {
      const params = prop || {};
      BatchNumber.query(params).then(res => {
        this.batchNumberList = res.data.list;
      });
    }
  }
};
