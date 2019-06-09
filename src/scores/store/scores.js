import Vue from 'vue'
import ScoresResource from '@/scores/resources/ScoresResource'

const scoresResource = new ScoresResource()

/************
*   STATE   *
************/
const state = {
  scores: []
}

/**************
*   GETTERS   *
**************/
const getters = {
  highScores: state => {
    const scores = state.scores.slice()
    return scores.sort((a, b) => {
      let acol = a.score
      let bcol = b.score
      let result = 0
      if (acol < bcol) result = 1
      if (acol > bcol) result = -1
      return result
    })
  }
}

/****************
*   MUTATIONS   *
****************/
const mutations = {
  setScores: (state, scores) => {
    Vue.set(state, 'scores', scores)
  }
}

/**************
*   ACTIONS   *
**************/
const actions = {
  getScores: ctx => {
    scoresResource.get()
      .then(scores => {
        ctx.commit('setScores', scores)
      })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
