import Mock from 'mockjs'

const {mock} = Mock;

export default {
  pageList: (options) => {
    console.log(`损耗报表vss.pageList.options`, options);

    return mock({
      "pageNo": 1, //页码
      "pageSize": 20, //页大小
      "count|1-100": 1,
      "start": 0,
      "first": 1,
      "last": 1,
      "firstPage": true,
      "lastPage": true,
      "list|1-20": [
        {
          'orderNo': '@id',
          'orgName': '@cword',
          'orgAreaName': '@cword',
          'code': '@natural(10)',
          'orgGoodsName': '口服I型III型脊髓灰质炎减毒活疫苗（人二倍体细胞）',
          'batchNumber': '@natural(10)',
          'expirationDate': '',
          'amount|1-10': 3,
          'createTime': '@datetime',
          'factoryName': '@cname',
          'status|1-2': 1,
        },
        {
          'orderNo': '@id',
          'orgName': '@cword',
          'orgAreaName': '@cword',
          'code': '@natural(10)',
          'orgGoodsName': '口服I型III型脊髓灰质炎减毒活疫苗（人二倍体细胞）',
          'batchNumber': '@natural(10)',
          'expirationDate': '',
          'amount|1-10': 3,
          'createTime': '@datetime',
          'factoryName': '@cname',
          'status|1-2': 1,
        },
      ]
    })
  }
}
