import request from '@/utils/request'

// 一级分类
export const reqCategory1List = () => request({ url: '/admin/product/getCategory1', method: 'get' })
// 二级分类
export const reqCategory2List = (category1Id) =>
  request({ url: `/admin/product/getCategory2/${category1Id}`, method: 'get' })
// 三级分类
export const reqCategory3List = (category2Id) =>
  request({ url: `/admin/product/getCategory3/${category2Id}`, method: 'get' })
// 平台属性
export const reqAttrInfoList = (category1Id, category2Id, category3Id) =>
  request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' })
// 保存属性信息
export const reqSaveAttrInfo = (data) => request({ url: '/admin/product/saveAttrInfo', method: 'post', data })
// 删除属性
export const reqDeleteAttr = (attrId) => request({ url: `/admin/product/deleteAttr/${attrId}`, method: 'delete' })
