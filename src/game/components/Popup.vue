<template>
  <div class="popup">
    <div class="popup__box">
      <p>{{ popupProps.message }}</p>
      <div class="popup__btns">
        <btn v-for="btn in popupProps.buttons"
          :key="btn.btnText"
          @click="$emit(btn.btnEmit)">
          {{ btn.btnText }}
        </btn>
      </div>
    </div>
  </div>
</template>

<script>
import Btn from '@/-common-/components/Button'

export default {
  name: 'Card',
  components: { Btn },
  props: {
    popupProps: { type: Object, required: true }
  }
}
</script>

<style lang="scss" scoped>
@import '../../-common-/assets/style/settings/_module-settings.scss';

.popup {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba($black, .5);
  &__box {
    z-index: 101;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: $white;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    padding: 2rem 0;
    border-radius: 4px;
    @include breakpoint(desktop) {
      max-width: 400px;
      padding: 4rem 0;
    }
    p {
      color: $font-color;
      @include fontSizeRem(14, 22);
      @include lineHeightRem(20, 28);
      text-align: center;
      padding: 0 6rem;
      margin-bottom: 2rem;
      @include breakpoint(desktop) {
        padding: 0 12rem;
      }
    }
  }
  &__btns {
    text-align: center;
    /deep/ button {
      padding: .8rem 2rem;
      margin-right: 1rem;
      &:last-child {
        margin-right: 0;
      }
      @include breakpoint(desktop) {
        padding: 1rem 3rem;
        margin-right: 2rem;
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
