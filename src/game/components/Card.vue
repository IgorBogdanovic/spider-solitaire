<template functional>
  <img v-if="props.card.faceUp" class="card-image" :src="props.card.imgSrc" />
  <img v-else class="card-image" :src="require('@/game/assets/images/cardBack.png')">
</template>

<script>
export default {
  name: 'Card',
  props: {
    card: { type: Object, required: true }
  }
}
</script>

<style lang="scss" scoped>
@import '../../-common-/assets/style/settings/_module-settings.scss';

.card-image {
  width: 100%;
  height: 100%;
}
</style>
