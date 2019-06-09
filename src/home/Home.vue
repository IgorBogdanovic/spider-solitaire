<template>
  <div class="home">
    <div class="home__input">
      <p>Enter your name before you start the game:</p>
      <input type="text"
        @blur="saveUser($event)"
        placeholder="Type your name here..."
        :value="userName"
      >
    </div>
    <div class="home__buttons">
      <btn @click="playGame">Play a game</btn>
      <btn @click="goToHighScores">View high scores</btn>
    </div>
    <p v-if="errorMsg" class="home__error">{{ errorMsg }}</p>
  </div>
</template>

<script>
import Btn from '@/-common-/components/Button'
import userName from '@/-common-/mixins/UserName.js'

export default {
  name: 'Home',
  components: { Btn },
  mixins: [ userName ],
  data () {
    return {
      errorMsg: ''
    }
  },
  methods: {
    saveUser (e) {
      this.$store.commit('user/setUser', e.target.value)
    },
    goToHighScores () {
      this.$router.push({ name: 'HighScores' })
    },
    playGame () {
      if (this.userName) this.$router.push({ name: 'SolitaireGame' })
      else this.errorMsg = 'Please, enter your name.'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../-common-/assets/style/settings/_module-settings';

.home {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  &__input {
    text-align: center;
    margin-bottom: 2rem;
    @include breakpoint(desktop) {
      margin-bottom: 4rem;
    }
    p {
      @include fontSizeRem(14, 20);
      margin-bottom: 1rem;
      @include breakpoint(desktop) {
        margin-bottom: 2rem;
      }
    }
    input {
      color: $font-color;
      font-family: cursive;
      @include fontSizeRem(14, 20);
      background: transparent;
      border: 2px solid $blue;
      border-radius: 15px;
      padding: .8rem 2rem;
      &::placeholder {
        color: lighten($font-color, 30%);
      }
    }
  }
  &__buttons {
    display: flex;
    justify-content: space-between;
    button {
      font-family: cursive;
      @include fontSizeRem(14, 20);
      color: $white;
      background-color: $blue;
      padding: .8rem;
      border-radius: 15px;
      @include breakpoint(desktop) {
        padding: 1.2rem;
        &:hover {
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
  &__error {
    color: red;
    @include fontSizeRem(14, 20);
    position: absolute;
    bottom: -2rem;
    @include breakpoint(desktop) {
      bottom: -3rem;
    }
  }
}
</style>
