<template>
  <div id="app">
    <h1 class="heading">Spider Solitaire Game</h1>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import "./-common-/assets/style/main";

#app {
  font-family: cursive;
  color: $font-color;
  background-color: $background-color;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  .heading {
    color: $black;
    @include fontSizeRem(20, 40);
    font-weight: 900;
    text-align: center;
    padding: 1rem;
    @include breakpoint(desktop) {
      padding: 2rem;
    }
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: $white;
  }
  &::-webkit-scrollbar {
    width: .6rem;
    background-color: $white;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: $darkgrey;
  }
}
</style>
