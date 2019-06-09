import Vue from 'vue'

/************
*   STATE   *
************/
const state = {
  userName: ''
}

/****************
*   MUTATIONS   *
****************/
const mutations = {
  setUser: (state, userName) => {
    Vue.set(state, 'userName', userName)
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
