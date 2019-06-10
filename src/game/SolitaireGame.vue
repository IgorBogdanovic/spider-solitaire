<template>
  <div class="game">
    <div class="game__user-data">
      <p class="user-data__name">{{ userName }}</p>
      <p class="user-data__score">Score: {{ score }}</p>
      <p class="user-data__moves">Moves: {{ moves }}</p>
    </div>
    <div class="game__difficulty">
      <transition name="fade">
        <div v-if="difficultyBtnsVisible" key="game-difficulty-buttons" class="game__difficulty-buttons">
          <btn @click="gameStart('easy')" color="#00CC00">One Suit Game (easy)</btn>
          <btn @click="gameStart('moderate')" color="#0066FF">Two Suit Game (moderate)</btn>
          <btn @click="gameStart('veteran')" color="#CC0000">Four Suit Game (veteran)</btn>
        </div>
        <div v-else key="game-difficulty-info" class="game__difficulty-info">Choosen difficulty: {{ choosenDifficulty }}</div>
      </transition>
    </div>
    <div class="game__field">
      <div class="field-above">
        <tableau :tableau="setsOfCards.tableau"
          @moveCards="moveCards"
          @turnTableauCard="turnTableauCard" />
      </div>
      <div class="field-below">
        <foundations :foundations="setsOfCards.foundations" />
        <div class="stock">
          <div v-for="(card, index) in setsOfCards.stock"
            :key="`stock-card_${index}`"
            :style="[{ top: `-${index / 10}rem` }, { right: `${index / 10}rem` }, { zIndex: `${index}` }]"
            class="stock__card">
            <card :card="card" />
          </div>
          <!-- case if there is no stock -->
          <div v-if="!setsOfCards.stock.length" class="stock__card stock__card--empty"></div>
          <div class="stock__card-no">{{ setsOfCards.stock.length }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from '@/store.js'
import userName from '@/-common-/mixins/UserName.js'
import classCleaner from '@/-common-/mixins/ClassCleaner.js'
import cardSuits from '@/game/assets/js/CardSuits.js'
import Btn from '@/-common-/components/Button'
import Card from '@/game/components/Card'
import Tableau from '@/game/components/Tableau'
import Foundations from '@/game/components/Foundations'

const cloneDeep = require('lodash.clonedeep')

export default {
  name: 'SolitaireGame',
  components: { Btn, Card, Tableau, Foundations },
  mixins: [ userName, classCleaner ],
  data () {
    return {
      score: 500,
      moves: 0,
      choosenDifficulty: '',
      difficultyBtnsVisible: true,
      setsOfCards: {
        tableau: [],
        foundations: [],
        stock: []
      }
    }
  },
  methods: {
    shuffleCards(cards) {
      for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]]
      }
      return cards
    },
    shareCards(cards) {
      this.setsOfCards.tableau = []
      let tableauRow = []
      // sharing for rows 1-4
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 6; j++) {
          tableauRow.push(cards.pop())
        }
        tableauRow[tableauRow.length - 1].faceUp = true
        this.setsOfCards.tableau.push(tableauRow)
        tableauRow = []
      }
      // sharing for rows 5-10
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
          tableauRow.push(cards.pop())
        }
        tableauRow[tableauRow.length - 1].faceUp = true
        this.setsOfCards.tableau.push(tableauRow)
        tableauRow = []
      }
      this.setsOfCards.stock = cards
    },
    gameStart(difficulty) {
      this.choosenDifficulty = difficulty
      let tempStock = []
      switch (difficulty) {
        case 'easy':
          for (let i = 0; i < 8; i++) {
            tempStock = tempStock.concat(
              cloneDeep(cardSuits.spades)
            )
          }
          break
        case 'moderate':
          for (let i = 0; i < 4; i++) {
            tempStock = tempStock.concat(
              cloneDeep(cardSuits.spades),
              cloneDeep(cardSuits.hearts)
            )
          }
          break
        case 'veteran':
          for (let i = 0; i < 2; i++) {
            tempStock = tempStock.concat(
              cloneDeep(cardSuits.spades),
              cloneDeep(cardSuits.hearts),
              cloneDeep(cardSuits.clubs),
              cloneDeep(cardSuits.diamonds)
            )
          }
          break
        // eslint-disable-next-line
        default: console.error('There is an error trying to start the game.')
      }
      this.shuffleCards(tempStock)
      this.shareCards(tempStock)
      this.difficultyBtnsVisible = false
    },
    moveCards (payload) {
      let tableauColTo = cloneDeep(this.setsOfCards.tableau[payload.columnIndex])
      let tableauColFrom = cloneDeep(this.setsOfCards.tableau[payload.cardsToMove.fromColumn])
      tableauColTo = tableauColTo.concat(payload.cardsToMove.cards)
      this.$set(this.setsOfCards.tableau, payload.columnIndex, tableauColTo)
      tableauColFrom = tableauColFrom.slice(0, payload.cardsToMove.clickedCardIndex)
      this.$set(this.setsOfCards.tableau, payload.cardsToMove.fromColumn, tableauColFrom)
      this.classCleaner()
    },
    turnTableauCard (payload) {
      let tableauCol = cloneDeep(this.setsOfCards.tableau[payload.columnIndex])
      tableauCol[payload.cardIndexOfCards].faceUp = true
      this.$set(this.setsOfCards.tableau, payload.columnIndex, tableauCol)
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   if (store.state.user.userName) next()
  //   else next('/')
  // },
  created () {
    for (let i = 0; i < 10; i++) {
      this.setsOfCards.tableau = this.setsOfCards.tableau.concat(null)
      if (i < 8) this.setsOfCards.foundations = this.setsOfCards.foundations.concat(null)
    }
    // console.log(cloneDeep)
  }
}
</script>

<style lang="scss" scoped>
@import '../-common-/assets/style/settings/_module-settings';

.game {
  position: relative;
  width: 100%;
  max-width: 192rem;
  margin: 0 auto;
  p {
    @include fontSizeRem(14, 20);
    &.user-data__name {
      font-weight: 900;
    }
  }
  &__user-data {
    display: flex;
    justify-content: space-between;
    max-width: 80%;
    margin: 1rem auto;
    @include breakpoint(desktop) {
      max-width: 25%;
      margin: 2rem auto;
    }
  }
  &__difficulty {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin: 0 auto;
    @include breakpoint(desktop) {
      margin: 0 auto;
    }
    &-buttons {
      display: flex;
      flex-direction: column;
      @include breakpoint(desktop) {
        flex-direction: row;
      }
      /deep/ button {
        margin-bottom: 1rem;
        @include breakpoint(desktop) {
          margin-bottom: 0;
          margin-right: 4rem;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    &-info {
      color: $font-color;
      @include fontSizeRem(14, 28);
      white-space: nowrap;
      margin-top: 1rem;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &__field {
    .field-above {
      max-width: 90%;
      margin: 0 auto;
      padding-top: 10rem;
      padding-bottom: 40vw;
    }
    .field-below {
      display: flex;
      justify-content: space-between;
      max-width: 90%;
      margin: 0 auto;
      .stock {
        position: relative;
        width: 14rem;
        right: 5.83rem;
        &__card {
          position: absolute;
          width: 14rem;
          height: 19rem;
          &--empty {
            border: 2px solid $darkgrey;
          }
        }
        &__card-no {
          color: $white;
          @include fontSizeRem(14, 34);
          font-weight: 900;
          position: absolute;
          top: 19rem;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .8s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
