export default {
  methods: {
    classCleaner () {
      let allFaceUpCards = document.getElementsByClassName('face-up')
      let allButtons = document.getElementsByClassName('move-button')
      for (let card of allFaceUpCards) {
        card.classList.remove('is-clicked', 'is-available', 'not-available')
      }
      for (let btn of allButtons) {
        btn.classList.remove('is-visible')
      }
    }
  }
}
