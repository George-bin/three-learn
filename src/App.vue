<template>
  <div id="app">
    <left-nav></left-nav>
    <router-view/>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'App',
  components: {
    LeftNav: () => import('@/components/LeftNav'),
    NavList: () => import('@/components/NavList')
  },
  created() {
    this.onResize();
    window.addEventListener('resize', this.onResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    ...mapMutations([
      'SET_SCREEN_INFO'
    ]),
    onResize() {
      let screenWidth = document.documentElement.clientWidth
      let screenHeight = document.documentElement.clientHeight
      this.SET_SCREEN_INFO({
        screenWidth,
        screenHeight
      });
    }
  }
}
</script>

<style></style>
