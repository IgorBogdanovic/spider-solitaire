<template>
  <div class="high-scores">
    <table-cmp :value="highScores"
      :columns="columns">
    </table-cmp>
  </div>
</template>

<script>
import TableCmp from '@/-common-/components/TableCmp'

export default {
  name: 'HighScores',
  components: { TableCmp },
  computed: {
    highScores () {
      return this.$store.getters['scores/highScores']
    }
  },
  data () {
    return {
      columns: [
        { column: 'name', title: 'Name' },
        { column: 'score', title: 'Score' }
      ]
    }
  },
  created () {
    this.$store.dispatch('scores/getScores')
  }
}
</script>

<style lang="scss" scoped>
.high-scores {
  width: 20vw;
  min-width: 300px;
  margin: 0 auto;
}
</style>
