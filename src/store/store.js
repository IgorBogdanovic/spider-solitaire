import Vue from 'vue'
import Vuex from 'vuex'

import scores from '@/scores/store/scores'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    scores
  }
})
