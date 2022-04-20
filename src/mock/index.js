import Mock from 'mockjs';
import lossFill from '@/mock/data/lossFill';
import wastageReport from '@/mock/data/wastageReport';

// 设置拦截ajax请求的相应时间
Mock.setup({
  timeout: '200-600',
  baseURL: '/api'
});

const {mock} = Mock;

// 损耗填报
mock(new RegExp('/erp-order/count\\?'), 'get', lossFill.orderCount);
mock(new RegExp('/erp-order/\\d+'), 'get', lossFill.detail);
mock(new RegExp('/erp-order\\?'), 'get', lossFill.pageList);
mock(new RegExp('/erp-stock/query-wastage-by-code\\?'), 'get', lossFill.codeDetail);

// 损耗报表vss
mock(new RegExp('/erp-statement/wastage-report\\?'),'get',wastageReport.pageList);
