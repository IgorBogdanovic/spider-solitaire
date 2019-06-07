import Vue from 'vue'
import Router from 'vue-router'

import ScoresRoute from '@/scores/route'

Vue.use(Router)

const routesList = [].concat(
  // GameRoute,
  ScoresRoute
)

const router = new Router({
  mode: 'history',
  routes: routesList
})

export default router
