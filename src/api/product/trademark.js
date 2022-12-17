import request from '@/utils/request'
// 获取品牌列表的接口
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 添加/修改品牌的接口
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    // 修改
    return request({ url: `/admin/product/baseTrademark/update`, method: 'put', data: tradeMark })
  } else {
    // 新增
    return request({ url: `/admin/product/baseTrademark/save`, method: 'post', data: tradeMark })
  }
}

// 删除品牌的接口
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
