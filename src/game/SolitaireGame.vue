<template>
  <div class="game">
    <div class="game__user-data">
      <p class="user-data__name">{{ userName }}</p>
      <p class="user-data__score">Score: {{ score }}</p>
      <p class="user-data__moves">Moves: {{ moves }}</p>
      <div class="go-back-btn">
        <btn @click="goBack">Go back</btn>
      </div>
    </div>
    <div class="game__difficulty">
      <transition name="fade">
        <div v-if="buttonsToDisplay.length" key="game-difficulty-buttons" class="game__difficulty-buttons">
          <btn v-for="btn in buttonsToDisplay"
            :key="btn.difficulty"
            :color="btn.color"
            @click="gameStart(btn.difficulty)">
            {{ btn.text }}
          </btn>
        </div>
        <div v-else key="game-difficulty-info" class="game__difficulty-info">Difficulty: {{ choosenDifficulty }}</div>
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
            class="stock__card"
            v-on="index === setsOfCards.stock.length - 1 ? { click: dealStockCards } : false">
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
      fromRoute: '',
      score: 500,
      moves: 0,
      buttonsToDisplay: [
        { difficulty: 'easy', color: '#00CC00', text: 'One Suit Game (easy)' },
        { difficulty: 'moderate', color: '#0066FF', text: 'Two Suit Game (moderate)' },
        { difficulty: 'veteran', color: '#CC0000', text: 'Four Suit Game (veteran)' }
      ],
      choosenDifficulty: '',
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
      this.buttonsToDisplay = []
    },
    calculateMove () {
      this.moves++
      this.score--
    },
    moveCards (payload) {
      let tableauColTo = cloneDeep(this.setsOfCards.tableau[payload.columnIndex])
      let tableauColFrom = cloneDeep(this.setsOfCards.tableau[payload.cardsToMove.fromColumn])
      tableauColTo = tableauColTo.concat(payload.cardsToMove.cards)
      this.$set(this.setsOfCards.tableau, payload.columnIndex, tableauColTo)
      tableauColFrom = tableauColFrom.slice(0, payload.cardsToMove.clickedCardIndex)
      this.$set(this.setsOfCards.tableau, payload.cardsToMove.fromColumn, tableauColFrom)
      this.calculateMove()
      this.classCleaner()
    },
    turnTableauCard (payload) {
      let tableauCol = cloneDeep(this.setsOfCards.tableau[payload.columnIndex])
      tableauCol[payload.cardIndexOfCards].faceUp = true
      this.$set(this.setsOfCards.tableau, payload.columnIndex, tableauCol)
      this.calculateMove()
    },
    dealStockCards () {
      let isValid = true
      let cardsToDeal = []
      for (let col of this.setsOfCards.tableau) {
        // TODO: popup info for this case
        if (!col.length) isValid = false
      }
      if (isValid) {
        let stockLength = this.setsOfCards.stock.length
        cardsToDeal = this.setsOfCards.stock.splice(stockLength - 10, 10)
        cardsToDeal.reverse()
        for (let i = 0; i < cardsToDeal.length; i++) {
          cardsToDeal[i].faceUp = true
          this.setsOfCards.tableau[i].push(cardsToDeal[i])
        }
        this.calculateMove()
      } else return false
    },
    goBack () {
      this.$router.push(this.fromRoute)
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   if (store.state.user.userName) {
  //     next(vm => {
  //       vm.fromRoute = from.fullPath
  //     })
  //   } else next('/')
  // },
  created () {
    for (let i = 0; i < 10; i++) {
      this.setsOfCards.tableau = this.setsOfCards.tableau.concat(null)
      if (i < 8) this.setsOfCards.foundations = this.setsOfCards.foundations.concat(null)
    }
  },
  mounted () {
    const body = document.getElementsByTagName('body')[0]
    body.addEventListener('mouseup', e => {
      const clickedEl = e.currentTarget
      if (!clickedEl.classList.contains('tableau__card') || !clickedEl.classList.contains('stock__card')) {
        this.classCleaner()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../-common-/assets/style/settings/_module-settings';

.game {
  position: relative;
  width: 100%;
  max-width: 136rem;
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
    align-items: center;
    max-width: 95%;
    margin: 1rem auto;
    @include breakpoint(desktop) {
      max-width: 40%;
      margin: 2rem auto;
    }
    /deep/ button {
      padding: .2rem 1rem;
    }
  }
  &__difficulty {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    &-buttons {
      display: flex;
      flex-direction: column;
      @include breakpoint(desktop) {
        flex-direction: row;
      }
      /deep/ button {
        @include fontSizeRem(12, 18);
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
      padding-top: 7rem;
      padding-bottom: 45vw;
    }
    .field-below {
      display: flex;
      justify-content: space-between;
      max-width: 90%;
      margin: 0 auto;
      .stock {
        position: relative;
        width: 9.8rem;
        right: 2.45rem;
        &__card {
          position: absolute;
          width: 9.8rem;
          height: 13.3rem;
          &--empty {
            border: 2px solid $darkgrey;
          }
        }
        &__card-no {
          color: $white;
          @include fontSizeRem(14, 28);
          font-weight: 900;
          position: absolute;
          top: 14rem;
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
