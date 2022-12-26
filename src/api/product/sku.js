import request from '@/utils/request'
// 获取sku列表
export const reqSkulist = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: 'get' })
// 上架/下架
export const reqIsSale = (skuId, isSale) => {
  // 判断销售的状态
  if (isSale === 0) {
    // 上架
    return request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })
  } else {
    // 下架
    return request({ url: `/admin/product/cancelSale/${skuId}`, method: 'get' })
  }
}
