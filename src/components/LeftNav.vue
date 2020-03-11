<template>
  <aside class="left-nav-component">
    <nav class="nav-list">
      <div
        v-for="(item, index) in navList"
        :key="index"
        :style="{
          color: activePath === item.value ? 'white' : '',
          background: activePath === item.value ? '#0A419B' : ''
        }"
        class="nav-item"
        @click="handleSwitchRouter(item.path)">
        <div class="nav-item-box">
          <i :class="item.icon"></i>
          <p class="label">{{item.label}}</p>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  name: '',
  props: {},
  components: {},
  data () {
    return {
      activePath: 'three',
      navList: [
        {
          icon: 'el-icon-s-opportunity',
          label: 'Three',
          value: 'three',
          path: '/three'
        },
        {
          icon: 'el-icon-s-opportunity',
          label: 'WebGL',
          value: 'webgl',
          path: '/webgl'
        }
      ]
    }
  },
  computed: {},
  watch: {
    $route: function (val, oldval) {
      let path = val.path.split('/')[1]
      console.log('当前路由:', path)
      switch (path) {
        case 'three':
          this.activePath = 'three'
          break
        case 'webgl':
          this.activePath = 'webgl'
          break
        default:
          return undefined
      }
    }
  },
  created () {},
  mounted () {},
  methods: {
    handleSwitchRouter (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss">
.left-nav-component {
  position: fixed;
  top: 70px;
  left: 0;
  z-index: 999;
  .nav-list {
    background: white;
    box-shadow: 0 0 10px #dfdfdf;
    border-radius: 0 8px 8px 0;
    overflow: hidden;
    .nav-item {
      display: flex;
      align-items: center;
      width: 50px;
      height: 50px;
      padding: 10px;
      cursor: pointer;
      &:hover {
        background: rgba(10, 65, 155, 0.2);
      }
      .nav-item-box {
        width: 100%;
        text-align: center;
        i {
          font-size: 24px;
        }
        .label {
          margin-top: 5px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
