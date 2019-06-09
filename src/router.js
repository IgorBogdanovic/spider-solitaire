import Vue from 'vue'
import Router from 'vue-router'

import HomeRoute from '@/home/route'
import GameRoute from '@/game/route'
import ScoresRoute from '@/scores/route'

Vue.use(Router)

const routesList = [].concat(
  HomeRoute,
  GameRoute,
  ScoresRoute
)

const router = new Router({
  mode: 'history',
  routes: routesList
})

export default router
