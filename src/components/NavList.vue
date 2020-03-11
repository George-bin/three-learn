<template>
  <nav class="nav-list-component">
    <div
      v-for="(item, index) in navList"
      :key="index"
      class="classify-item">
      <h3 class="classify-item__label">{{item.label}}</h3>
      <div class="classify-item__list">
        <div
          v-for="(route, i) in item.list"
          :key="i"
          class="nav-item"
          @click="handleClickSwitchRouter(route.path)">
          {{route.label}}
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "",
  props: {
    navList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  components: {},
  data() {
    return {
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    handleClickSwitchRouter(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss">
body,
html {
  background: #f7f7f7;
}

.nav-list-component {
  .classify-item {
    .classify-item__label {
      padding-bottom: 5px;
      border-bottom: 1px dashed #dfdfdf;
      font-size: 14px;
    }
    .classify-item__list {
      .nav-item {
        display: inline-block;
        width: 32.66%;
        height: 40px;
        line-height: 40px;
        margin-top: 10px;
        font-size: 14px;
        text-align: center;
        background: #f7f7f7;
        cursor: pointer;
        &:nth-child(n+2) {
          margin-left: 1%;
        }
        &:nth-child(3n+1) {
          margin-left: 0;
        }
        &:hover {
          color: white;
          background: rgb(10, 65, 155);
        }
      }
    }
  }
  .classify-item + .classify-item {
    margin-top: 20px;
  }
}
</style>
