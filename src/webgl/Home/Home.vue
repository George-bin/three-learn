<template>
  <div class="home-component">
    <div class="home-box">
      <nav-list :navList="navList"></nav-list>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  props: {},
  components: {
     NavList: () => import('@/components/NavList')
  },
  data() {
    return {
      navList: [
        {
          label: '入门',
          list: [
            {
              label: '入门',
              path: '/webgl/introduction'
            },
            {
              label: '绘制矩形',
              path: '/webgl/rectangle'
            },
            {
              label: '坐标系',
              path: '/webgl/axes'
            },
            {
              label: '平移变换',
              path: '/webgl/translate'
            },
            {
              label: '旋转变换',
              path: '/webgl/rotate'
            },
            {
              label: '顶点绘制',
              path: '/webgl/vertices'
            },
            {
              label: '颜色插值',
              path: '/webgl/color'
            },
            {
              label: '彩色三角形',
              path: '/webgl/triangle'
            },
            {
              label: '彩色正方形',
              path: '/webgl/colorRectangle'
            },
            {
              label: '平行光',
              path: '/webgl/parallelLight'
            }
          ]
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
.home-component {
  .home-box {
    max-width: 1160px;
    padding: 20px;
    margin: 20px auto;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }
}
@media screen and (max-width: 1380px){
  .home-component {
    .home-box {
      margin: 20px 80px;
    }
  }
}
</style>
