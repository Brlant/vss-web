import Mock from 'mockjs'
import {getUrlParams} from '@/tools/utils'

const {mock} = Mock;

export default {
  pageList: (options) => {
    console.log(`损耗报表vss.pageList.options`, options);
    const urlParams = getUrlParams(options.url);
    return mock({
      "count|20-100": 100,
      "list|1-20": [
        {
          'orderNo': '@id',
          'orgName': '@cname',
          'orgAreaName': '@city',
          'code': '@natural',
          'orgGoodsName|4-10': '@cword',
          'batchNumber': '@natural',
          'expiryDate': '@date',
          'amount|1-99': 3,
          'createTime': '@date',
          'factoryName|3-9': '@cword',
          'status|1': [0,4,5],
        }
      ]
    })
  }
}
