<template>
  <div class="scores">
    <div class="scores__tables">
      <div class="scores__table user-scores">
        <h3>{{ userName }} Scores</h3>
        <table-cmp :value="userScores"
          :columns="columns">
        </table-cmp>
      </div>
      <div class="scores__table high-scores">
        <h3>High Scores</h3>
        <table-cmp :value="highScores"
          :columns="columns">
        </table-cmp>
      </div>
    </div>
    <div class="go-back-btn">
      <btn @click="goBack">Go back</btn>
    </div>
  </div>
</template>

<script>
import TableCmp from '@/-common-/components/TableCmp'
import Btn from '@/-common-/components/Button'
import userName from '@/-common-/mixins/UserName.js'

export default {
  name: 'HighScores',
  components: { TableCmp, Btn },
  mixins: [ userName ],
  data () {
    return {
      fromRoute: '',
      columns: [
        { column: 'userName', title: 'Name' },
        { column: 'score' }
      ]
    }
  },
  computed: {
    userScores () {
      const scores = this.$store.state.scores.scores
      let userScores = []
      if (this.userName) {
        userScores = scores.filter(el => {
          return el.userName === this.userName
        })
      }
      return userScores
    },
    highScores () {
      return this.$store.getters['scores/highScores'].slice(0, 10)
    }
  },
  methods: {
    goBack () {
      this.$router.push(this.fromRoute)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.fromRoute = from.fullPath
    })
  },
  created () {
    this.$store.dispatch('scores/getScores')
  }
}
</script>

<style lang="scss" scoped>
@import '../-common-/assets/style/settings/_module-settings';

.scores {
  h3 {
    @include fontSizeRem(18, 30);
    font-weight: 700;
    text-align: center;
    margin: 2rem 0;
    @include breakpoint(desktop) {
      margin: 4rem 0;
    }
  }
  &__tables {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @include breakpoint(desktop) {
      flex-direction: row;
      align-items: normal;
    }
  }
  &__table {
    width: 20vw;
    min-width: 300px;
    @include breakpoint(desktop) {
      margin-right: 2rem;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  .go-back-btn {
    text-align: center;
    margin-top: 1.5rem;
    @include breakpoint(desktop) {
      margin-top: 3rem;
    }
  }
}
</style>
