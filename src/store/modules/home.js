import mockRequest from '@/utils/mockRequest'
const state = {
  data: {}
}
const mutations = {
  GETDATA(state, data) {
    state.data = data
  }
}
const actions = {
  // 发请求
  async getData({ commit }) {
    const result = await mockRequest.get('/home/list')
    if (result.code === 20000) {
      commit('GETDATA', result.data)
      return 'ok'
    } else {
      return Promise.reject(result.message)
    }
  }
}
const getters = {}
export default {
  state,
  mutations,
  actions,
  getters
}
