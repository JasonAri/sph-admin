import request from '@/utils/request'

// 获取SPU列表数据
export const reqSpuList = (page, limit, category3Id) =>
  request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } })

// 获取spu
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' })

// 获取品牌
export const reqTradeMarkList = () => request({ url: '/admin/product/baseTrademark/getTrademarkList', method: 'get' })

// 获取SPU图标
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' })

// 获取平台销售属性
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList/', method: 'get' })

// 修改/添加SPU
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 修改
  if (spuInfo.id) {
    return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo })
  } else {
    // 添加
    return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo })
  }
}

// 删除spu
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' })
