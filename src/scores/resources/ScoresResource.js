/******************************
*   API Scores CRUD wrapper   *
******************************/
import api from '@/api'

export default class ScoresResource {
  constructor () {
    this.resource = 'scores'
  }

  get () {
    return api.get('high-scores')
      .then(res => {
        const scores = []
        for (const score of res.data) {
          scores.push(score)
        }
        return Promise.resolve(scores)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }

  post (payload) {
    return api.post('high-scores', payload)
      .then(res => {
        return Promise.resolve(res.data)
      })
      .catch(err => {
        return Promise.reject(err)
      })
  }
}
