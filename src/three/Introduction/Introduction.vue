<template>
  <div class="introduction-component">
    <canvas id="threeContext"></canvas>
  </div>
</template>

<script>
import * as THREE from 'three';
import { mapState } from 'vuex';
export default {
  name: "",
  props: {},
  components: {},
  data() {
    return {
      s: 300
    }
  },
  computed: {
    ...mapState({
      screenWidth: state => state.home.screenWidth,
      screenHeight: state => state.home.screenHeight
    })
  },
  watch: {
    screenHeight: function(val, oldval) {
      this.canvasResize()
    },
    screenWidth: function(val, oldval) {
      this.canvasResize()
    }
  },
  created() {
    window.renderer = null;
    window.scene = null;
    window.camera = null;
  },
  mounted() {
    this.initThree();
    this.render();
  },
  methods: {
    initThree() {
      // 1、创建场景对象
      window.scene = new THREE.Scene();

      // 2、创建网络模型
      // let geometry = new THREE.SphereGeometry(60, 40, 40);
      let geometry = new THREE.BoxGeometry(100, 100, 100); // 创建一个立方体的几何对象Geometry
      let material = new THREE.MeshLambertMaterial({ // 创建一种材质Material
        color: 0x00ff00
      });
      let mesh = new THREE.Mesh(geometry, material); // 网格模型对象Mesh
      scene.add(mesh); // 将网格模型添加到场景中

      // 3、光源设置
      // 点光源
      let point = new THREE.PointLight(0xffffff);
      point.position.set(400, 200, 300); //点光源位置
      scene.add(point); //点光源添加到场景中

      // 环境光
      let ambient = new THREE.AmbientLight(0x444444);
      scene.add(ambient);

      // 4、创建相机
      let width = this.screenWidth;
      let height = this.screenHeight;
      let k = width / height; // 窗口宽高比
      let s = this.s; // 三维场景显示范围控制系数，系数越大，显示的范围越大
      window.camera = new THREE.OrthographicCamera(-s*k, s*k, s, -s, 1, 1000);
      camera.position.set(200, 300, 200); // 设置相机位置
      camera.lookAt(scene.position); // 设置相机方向（指向的场景对象）

      // 5、创建渲染器
      window.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('threeContext')
      });
      renderer.setSize(width, height); // 设置渲染区域的宽高
      renderer.setClearColor(0xb9d3ff, 1); // 设置背景颜色

      // 6、执行渲染操作
      renderer.render(scene, camera);
    },
    // 渲染函数
    render() {
      renderer.render(scene, camera);
      requestAnimationFrame(this.render);
    },
    // 窗口大小变换重新进行绘制
    canvasResize() {
      let s = this.s;
      let width = document.documentElement.clientWidth;
      let height = document.documentElement.clientHeight;
      // 重新渲染canvas尺寸
      renderer.setSize(width, height);
      // 重置相机投影的相关参数
      let k = width/height; // 窗口宽高比
      camera.left = -s*k;
      camera.right = s*k;
      camera.top = s;
      camera.bottom = -s;
      // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
      // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
      // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
      camera.updateProjectionMatrix ();
    }
  }
}
</script>

<style lang="scss">
.introduction-component {
}
</style>
