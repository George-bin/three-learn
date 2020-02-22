<template>
  <div class="home-component">
    <ul class="nav-list">
      <li
        v-for="(item, index) in navList"
        :key="index"
        class="nav-item"
        @click="handleSwitchRouter(item.path)">
        {{item.label}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: '',
  props: {},
  components: {},
  data() {
    return {
      navList: [
        {
          label: '入门',
          path: '/introduction'
        },
        {
          label: '周期性渲染',
          path: '/renderCycle'
        },
        {
          label: '鼠标控制三维场景',
          path: '/orbitControls'
        },
        {
          label: '几何网格模型',
          path: '/mesh'
        },
        {
          label: '材质',
          path: '/material'
        },
        {
          label: '光源',
          path: '/light'
        },
        {
          label: '顶点',
          path: '/peak'
        },
        {
          label: '点线面模型',
          path: '/pointLineMesh'
        },
        {
          label: '层级模型',
          path: '/group'
        },
        {
          label: '纹理贴图',
          path: '/map'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleSwitchRouter(path) {
      this.$router.push(path);
    }
  }
}
</script>

<style lang="scss">
.home-component {
  padding: 20px;
  .nav-list {
    display: flex;
    flex-wrap: wrap;
    .nav-item {
      width: 50%;
      cursor: pointer;
    }
  }
}
</style>
