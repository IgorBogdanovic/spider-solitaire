<template>
  <div class="tableau">
    <div v-for="(cards, i) in tableau"
      :key="`tableau-column_${i}`"
      :id="`tableau-column_${i}`"
      class="tableau__column">
      <div v-for="(card, j) in cards"
        :key="`tableau-column-card_${i}-${j}`"
        :style="[{ top: `${j * 4.1}rem` }, { zIndex: `${j}` }]"
        class="tableau__card"
        :class="{ 'face-up': card.faceUp }"
        :ref="card.faceUp ? `faceUpCard-column_${i}-${j}` : 'faceDownCard'"
        @click="cardClicked(j, card, i, cards)">
        <card :card="card" />
        <div v-if="j === cards.length - 1"
          :ref="`move-button_${i}-${j}`"
          class="move-button">
          <btn @click="moveBtnClicked($event, i)">Move here</btn>
        </div>
      </div>
      <!-- case if there is no cards -->
      <div v-if="!cards || !cards.length" class="tableau__card tableau__card--empty">
        <div ref="move-button_of-empty-column"
          class="move-button">
          <btn @click="moveBtnClicked($event, i)">Move here</btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import classCleaner from '@/-common-/mixins/ClassCleaner.js'
import Btn from '@/-common-/components/Button'
import Card from '@/game/components/Card'

export default {
  name: 'Tableau',
  components: { Btn, Card },
  mixins: [ classCleaner ],
  props: {
    tableau: { type: Array, required: true }
  },
  data () {
    return {
      cardsToMove: {}
    }
  },
  methods: {
    cardClicked (cardIndexOfCards, card, columnIndex, cards) {
      this.classCleaner()
      if (cardIndexOfCards === cards.length - 1 && !card.faceUp) {
        this.$emit('turnTableauCard', { cardIndexOfCards, columnIndex })
        return
      } else if (cardIndexOfCards < cards.length - 1 && !card.faceUp) return
      let selectionIsValid = false
      let columnFaceUpCards = []
      this.cardsToMove = { fromColumn: columnIndex, clickedCardIndex: cardIndexOfCards, cards: [] }
      for (let i = cardIndexOfCards; i < cards.length; i++) {
        columnFaceUpCards = columnFaceUpCards.concat(this.$refs[`faceUpCard-column_${columnIndex}-${i}`])
        let cardToCheck = cards[i]
        let withThisCard = cards[i + 1]
        if (withThisCard) {
          let diff = cardToCheck.id - withThisCard.id
          let isSameType = cardToCheck.type === withThisCard.type
          if (diff === 1 && isSameType) {
            selectionIsValid = true
            this.cardsToMove.cards.push(cardToCheck)
          } else {
            selectionIsValid = false
            this.cardsToMove = {}
            break
          }
        } else {
          selectionIsValid = true
          this.cardsToMove.cards.push(cardToCheck)
          break
        }
      }
      if (selectionIsValid) {
        for (let card of columnFaceUpCards) {
          card.classList.add('is-clicked')
        }
        this.checkAvailableColumns(card, columnIndex)
      } else return false
    },
    checkAvailableColumns (card, columnIndex) {
      for (let i = 0; i < this.tableau.length; i++) {
        if (i !== columnIndex) {
          let col = this.tableau[i]
          let lastColCard = col[col.length - 1]
          if (lastColCard && lastColCard.faceUp) {
            let diff = lastColCard.id - card.id
            let columnFaceUpCards = this.$refs[`faceUpCard-column_${i}-${col.length - 1}`]
            let columnBtn = this.$refs[`move-button_${i}-${col.length - 1}`]
            if (diff === 1 && lastColCard.faceUp) {
              columnFaceUpCards[columnFaceUpCards.length - 1].classList.add('is-available')
              columnBtn[0].classList.add('is-visible')
            }
            else columnFaceUpCards[columnFaceUpCards.length - 1].classList.add('not-available')
          } else {
            // case of empty column
            const btnsOfEmptyColumns = this.$refs['move-button_of-empty-column']
            for (let btn of btnsOfEmptyColumns) {
              btn.classList.add('is-visible')
            }
          }
        }
      }
    },
    moveBtnClicked (e, columnIndex) {
      e.stopPropagation()
      this.$emit('moveCards', { columnIndex, cardsToMove: this.cardsToMove })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../-common-/assets/style/settings/_module-settings.scss';

.tableau {
  display: flex;
  &__column {
    position: relative;
    width: 9.8rem;
    margin-right: 3rem;
  }
  &__card {
    position: absolute;
    width: 9.8rem;
    height: 13.3rem;
    &--empty {
      border: 2px solid $darkgrey;
    }
    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: .6;
    }
    &.is-clicked {
      &:after {
        content: "";
        background-color: $yellow;
      }
    }
    &.is-available {
      &:after {
        content: "";
        background-color: $green;
      }
    }
    &.not-available {
      &:after {
        content: "";
        background-color: $red;
      }
    }
    .move-button {
      display: none;
      z-index: 1;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      &.is-visible {
        display: block;
      }
      /deep/ button {
        @include fontSizeRem(10, 14);
        padding: .8rem;
        white-space: nowrap;
      }
    }
  }
}
</style>
