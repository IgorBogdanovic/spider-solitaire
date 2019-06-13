<template>
  <div class="game">
    <div class="game__user-data">
      <p class="user-data__name">{{ userName }}</p>
      <p class="user-data__score">Score: {{ score }}</p>
      <p class="user-data__moves">Moves: {{ moves }}</p>
      <div class="go-home-btn">
        <btn @click="goHome">Go home</btn>
      </div>
    </div>
    <div v-if="!isMobile" class="game__difficulty">
      <transition name="fade">
        <div v-if="buttonsToDisplay.length" key="game-difficulty-buttons" class="game__difficulty-buttons">
          <btn v-for="btn in buttonsToDisplay"
            :key="btn.difficulty"
            :color="btn.color"
            @click="gameStart(btn.difficulty)">
            {{ btn.text }}
          </btn>
        </div>
        <div v-else key="game-difficulty-info" class="game__difficulty-info">
          <p>Difficulty: {{ choosenDifficulty }}</p>
          <btn color="#CC0000" @click="undo">Undo</btn>
        </div>
      </transition>
    </div>
    <div v-if="!isMobile" class="game__field">
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
            :class="{ 'is-clickable': index === setsOfCards.stock.length - 1 }"
            v-on="index === setsOfCards.stock.length - 1 ? { click: dealStockCards } : false">
            <card :card="card" />
          </div>
          <!-- case if there is no stock -->
          <div v-if="!setsOfCards.stock.length" class="stock__card stock__card--empty"></div>
          <div class="stock__card-no">{{ setsOfCards.stock.length }}</div>
        </div>
      </div>
    </div>
    <p v-if="isMobile" class="game__warning">In order to play this game, you'll need a bigger screen :(</p>
    <popup v-if="popupProps"
      :popupProps="popupProps"
      @closePopup="closePopup"
      @startNewGame="startNewGame"
      @goToHighScores="goToHighScores" />
  </div>
</template>

<script>
import store from '@/store.js'
import userName from '@/-common-/mixins/UserName.js'
import classCleaner from '@/-common-/mixins/ClassCleaner.js'
import cardSuits from '@/game/assets/js/CardSuits.js'
import Btn from '@/-common-/components/Button'
import Card from '@/game/components/Card'
import Popup from '@/game/components/Popup'
import Tableau from '@/game/components/Tableau'
import Foundations from '@/game/components/Foundations'

const cloneDeep = require('lodash.clonedeep')

export default {
  name: 'SolitaireGame',
  components: { Btn, Card, Popup, Tableau, Foundations },
  mixins: [ userName, classCleaner ],
  data () {
    return {
      isMobile: false,
      score: 500,
      moves: 0,
      buttonsToDisplay: [
        { difficulty: 'easy', color: '#00CC00', text: 'One Suit Game (easy)' },
        { difficulty: 'medium', color: '#0066FF', text: 'Two Suit Game (medium)' },
        { difficulty: 'hard', color: '#CC0000', text: 'Four Suit Game (hard)' }
      ],
      choosenDifficulty: '',
      setsOfCards: {
        tableau: [],
        foundations: [],
        stock: []
      },
      finalizedMoves: [],
      popupProps: null
    }
  },
  methods: {
    setCardCols () {
      for (let i = 0; i < 10; i++) {
        this.setsOfCards.tableau = this.setsOfCards.tableau.concat(null)
        if (i < 8) this.setsOfCards.foundations = this.setsOfCards.foundations.concat(null)
      }
    },
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
        case 'medium':
          for (let i = 0; i < 4; i++) {
            tempStock = tempStock.concat(
              cloneDeep(cardSuits.spades),
              cloneDeep(cardSuits.hearts)
            )
          }
          break
        case 'hard':
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
    calculateMove (isSuitCompleted, stockDealCmpltd = false) {
      if (!stockDealCmpltd) this.moves++
      if (isSuitCompleted) {
        this.score += 100
        let gameFinished = false
        for (let col of this.setsOfCards.foundations) {
          if (col) gameFinished = true
          else {
            gameFinished = false
            break
          }
        }
        if (gameFinished) {
          let payload = {
            userName: this.userName,
            score: this.score,
            moves: this.moves,
            difficulty: this.choosenDifficulty
          }
          this.storeUserScore(payload)
          this.popupProps = {
            message: 'You nailed it!',
            buttons: [
              {
                btnText: 'Start New Game',
                btnEmit: 'startNewGame'
              },
              {
                btnText: 'High Scores',
                btnEmit: 'goToHighScores'
              }
            ]
          }
        }
      }
      else this.score--
    },
    moveCards (payload) {
      let tableauColTo = cloneDeep(this.setsOfCards.tableau[payload.columnIndex])
      let tableauColFrom = cloneDeep(this.setsOfCards.tableau[payload.cardsToMove.fromColumn])
      tableauColTo = tableauColTo.concat(payload.cardsToMove.cards)
      this.$set(this.setsOfCards.tableau, payload.columnIndex, tableauColTo)
      tableauColFrom = tableauColFrom.slice(0, payload.cardsToMove.clickedCardIndex)
      this.$set(this.setsOfCards.tableau, payload.cardsToMove.fromColumn, tableauColFrom)
      let isSuitCompleted = false
      if (tableauColTo.length >= 13) {
        isSuitCompleted = this.completedSuitCheck(payload.columnIndex)
      }
      this.calculateMove(isSuitCompleted)
      this.classCleaner()
      this.finalizedMoves.push({
        move: {
          columnTo: payload.columnIndex,
          columnFrom: payload.cardsToMove.fromColumn,
          cards: payload.cardsToMove.cards
        },
        finalizedAs: isSuitCompleted ? 'completed' : 'move'
      })
    },
    completedSuitCheck (columnIndex) {
      const column = cloneDeep(this.setsOfCards.tableau[columnIndex])
      let isCompleted = false
      for (let i = column.length - 1, j = 0; j < 12; i--, j++) {
        // guard against rare but possible case
        if (!column[i - 1].faceUp) {
          isCompleted = false
          break
        }
        let diff = column[i - 1].id - column[i].id
        let isSameType = column[i - 1].type === column[i].type
        if (diff === 1 && isSameType) {
          isCompleted = true
        } else {
          isCompleted = false
          break
        }
      }
      if (isCompleted) {
        let indexOfFoundationCol
        for (let i = 0; i < this.setsOfCards.foundations.length; i++) {
          if (!this.setsOfCards.foundations[i]) {
            indexOfFoundationCol = i
            break
          }
        }
        let completedSuit = column.splice(column.length - 13, 13)
        completedSuit.reverse()
        this.$set(this.setsOfCards.tableau, columnIndex, column)
        this.$set(this.setsOfCards.foundations, indexOfFoundationCol, completedSuit)
      }
      return isCompleted
    },
    turnTableauCard (payload) {
      let tableauCol = cloneDeep(this.setsOfCards.tableau[payload.columnIndex])
      tableauCol[payload.cardIndexOfCards].faceUp = true
      this.$set(this.setsOfCards.tableau, payload.columnIndex, tableauCol)
      this.calculateMove(false)
      this.finalizedMoves.push({
        move: {
          columnTo: payload.columnIndex
        },
        finalizedAs: 'turn'
      })
    },
    dealStockCards () {
      let isValid = true
      let cardsToDeal = []
      // variable below is needed in case of EXTREME luck
      let columnsCompleted = []
      for (let col of this.setsOfCards.tableau) {
        if (!col.length) isValid = false
      }
      if (isValid) {
        let stockLength = this.setsOfCards.stock.length
        cardsToDeal = this.setsOfCards.stock.splice(stockLength - 10, 10)
        cardsToDeal.reverse()
        for (let i = 0; i < cardsToDeal.length; i++) {
          cardsToDeal[i].faceUp = true
          this.setsOfCards.tableau[i].push(cardsToDeal[i])
          // this check is needed in case of EXTREME luck
          if (this.setsOfCards.tableau[i].length >= 13) {
            let isSuitCompleted = this.completedSuitCheck(i)
            if (isSuitCompleted) {
              this.calculateMove(true, true)
              columnsCompleted.push(i)
            }
          }
        }
        this.calculateMove(false)
        if (columnsCompleted.length) {
          this.finalizedMoves.push({
            move: {
              columnsCompleted
            },
            finalizedAs: 'stockCompleted'
          })
        } else {
          this.finalizedMoves.push({
            move: null,
            finalizedAs: 'stock'
          })
        }
      } else {
        this.popupProps = {
          message: 'It is not possible to deal new cards while you have empty columns.',
          buttons: [
            {
              btnText: 'Ok',
              btnEmit: 'closePopup'
            }
          ]
        }
      }
    },
    goHome () {
      this.$router.push({ name: 'Home' })
    },
    closePopup () {
      this.popupProps = null
    },
    storeUserScore (payload) {
      this.$store.dispatch('scores/postScore', payload)
    },
    startNewGame () {
      Object.assign(this.$data, this.$options.data.apply(this))
      this.setCardCols()
      this.closePopup()
    },
    goToHighScores () {
      this.$router.push({ name: 'HighScores' })
      this.closePopup()
    },
    undo () {
      let moveToUndo = this.finalizedMoves.pop()
      if (!moveToUndo) return false
      switch(moveToUndo.finalizedAs) {
        case 'move': {
          let tableauColTo = cloneDeep(this.setsOfCards.tableau[moveToUndo.move.columnTo])
          let tableauColFrom = cloneDeep(this.setsOfCards.tableau[moveToUndo.move.columnFrom])
          let cardsNum = moveToUndo.move.cards.length
          tableauColFrom = tableauColFrom.concat(tableauColTo.splice(tableauColTo.length - cardsNum, cardsNum))
          this.$set(this.setsOfCards.tableau, moveToUndo.move.columnTo, tableauColTo)
          this.$set(this.setsOfCards.tableau, moveToUndo.move.columnFrom, tableauColFrom)
          break
        }
        case 'completed': {
          let completedSuit
          for (let i = this.setsOfCards.foundations.length - 1; i >= 0; i--) {
            if (this.setsOfCards.foundations[i]) {
              completedSuit = cloneDeep(this.setsOfCards.foundations[i])
              completedSuit.reverse()
              this.$set(this.setsOfCards.foundations, i, null)
              break
            }
          }
          let tableauColTo = cloneDeep(this.setsOfCards.tableau[moveToUndo.move.columnTo])
          let tableauColFrom = cloneDeep(this.setsOfCards.tableau[moveToUndo.move.columnFrom])
          let cardsNum = moveToUndo.move.cards.length
          tableauColFrom = tableauColFrom.concat(completedSuit.splice(completedSuit.length - cardsNum, cardsNum))
          tableauColTo = tableauColTo.concat(completedSuit)
          this.$set(this.setsOfCards.tableau, moveToUndo.move.columnTo, tableauColTo)
          this.$set(this.setsOfCards.tableau, moveToUndo.move.columnFrom, tableauColFrom)
          this.score -= 100
          break
        }
        case 'turn': {
          let tableauColTo = cloneDeep(this.setsOfCards.tableau[moveToUndo.move.columnTo])
          tableauColTo[tableauColTo.length - 1].faceUp = false
          this.$set(this.setsOfCards.tableau, moveToUndo.move.columnTo, tableauColTo)
          break
        }
        // in case of EXTREME luck
        case 'stockCompleted': {
          let completedSuits = []
          for (let i = this.setsOfCards.foundations.length - 1; i >= 0; i--) {
            if (this.setsOfCards.foundations[i]) {
              let suit = {
                colIndex: moveToUndo.move.columnsCompleted.pop(),
                cards: cloneDeep(this.setsOfCards.foundations[i])
              }
              suit.cards.reverse()
              completedSuits.push(suit)
              this.$set(this.setsOfCards.foundations, i, null)
              if (!moveToUndo.move.columnsCompleted.length) break
            }
          }
          for (let suit of completedSuits) {
            let tableauColTo = cloneDeep(this.setsOfCards.tableau[suit.colIndex])
            tableauColTo = tableauColTo.concat(suit.cards)
            this.$set(this.setsOfCards.tableau, suit.colIndex, tableauColTo)
            this.score -= 100
          }
          // below part is like in a case of 'stock'
          let dealtStockCards = []
          for (let col of this.setsOfCards.tableau) {
            dealtStockCards.push(col.pop())
            dealtStockCards[dealtStockCards.length - 1].faceUp = false
          }
          dealtStockCards.reverse()
          this.setsOfCards.stock = this.setsOfCards.stock.concat(dealtStockCards)
          break
        }
        case 'stock': {
          let dealtStockCards = []
          for (let col of this.setsOfCards.tableau) {
            dealtStockCards.push(col.pop())
            dealtStockCards[dealtStockCards.length - 1].faceUp = false
          }
          dealtStockCards.reverse()
          this.setsOfCards.stock = this.setsOfCards.stock.concat(dealtStockCards)
          break
        }
        default:
          return false
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    if (store.state.user.userName) next()
    else next('/')
  },
  created () {
    this.setCardCols()
  },
  mounted () {
    const body = document.getElementsByTagName('body')[0]
    body.addEventListener('mouseup', e => {
      const clickedEl = e.currentTarget
      if (!clickedEl.classList.contains('tableau__card') || !clickedEl.classList.contains('stock__card')) {
        this.classCleaner()
      }
    })
    if (window.innerWidth < 768) this.isMobile = true
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
    color: $font-color;
    @include breakpoint(desktop) {
      max-width: 40%;
      margin: 2rem auto;
    }
    /deep/ button {
      padding: .2rem 1rem;
    }
  }
  &__difficulty {
    color: $font-color;
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
      display: flex;
      align-items: center;
      /deep/ button {
        padding: .2rem 1rem;
        margin-left: 9rem;
      }
    }
  }
  &__field {
    .field-above {
      max-width: 90%;
      margin: 0 auto;
      padding-top: 7rem;
      padding-bottom: 50vw;
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
          &.is-clickable {
            cursor: pointer;
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
  &__warning {
    color: $red;
    @include lineHeightRem(20, 0);
    font-weight: 900;
    position: absolute;
    top: 50vh;
    left: 50%;
    transform: translate(-50%, -10vh);
  }
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .8s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
